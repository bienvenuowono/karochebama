import prisma from '../../config/prisma';

export interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
}

class ContactService {
  async getAll(skip?: number, take?: number) {
    const [items, total] = await Promise.all([
      prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.contactMessage.count()
    ]);
    return { items, total };
  }

  async getById(id: number) {
    return prisma.contactMessage.findUnique({
      where: { id }
    });
  }

  async create(data: ContactMessageInput) {
    return prisma.contactMessage.create({
      data,
    });
  }

  async update(id: number, data: Partial<ContactMessageInput & { isRead: boolean }>) {
    return prisma.contactMessage.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.contactMessage.delete({
      where: { id },
    });
  }
}

export default new ContactService();
