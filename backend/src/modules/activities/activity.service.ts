import prisma from '../../config/prisma';
import { ActivityInput } from './activity.validation';

class ActivityService {
  async getAll() {
    return prisma.activity.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async getById(id: number) {
    return prisma.activity.findUnique({
      where: { id }
    });
  }

  async create(data: ActivityInput) {
    return prisma.activity.create({
      data,
    });
  }

  async update(id: number, data: Partial<ActivityInput>) {
    return prisma.activity.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.activity.delete({
      where: { id },
    });
  }
}

export default new ActivityService();
