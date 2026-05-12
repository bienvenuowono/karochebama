import prisma from '../../config/prisma';
import bcrypt from 'bcryptjs';

class UserService {
  async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        whatsapp: true,
        country: true,
        address: true,
        photoUrl: true,
        role: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getUserById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        orders: true
      }
    });
  }

  async createUser(data: any) {
    const hashedPassword = await bcrypt.hash(data.password || 'password123', 10);
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      }
    });
  }

  async updateUser(id: number, data: any) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return prisma.user.update({
      where: { id },
      data
    });
  }

  async deleteUser(id: number) {
    return prisma.user.delete({
      where: { id }
    });
  }
}

export default new UserService();
