import prisma from '../../config/prisma';
import { CommercialInput } from './commercial.validation';

class CommercialService {
  async getAll(skip?: number, take?: number) {
    const [items, total] = await Promise.all([
      prisma.commercialForm.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.commercialForm.count()
    ]);
    return { items, total };
  }

  async getById(id: number) {
    return prisma.commercialForm.findUnique({
      where: { id }
    });
  }

  async create(data: CommercialInput) {
    return prisma.commercialForm.create({
      data,
    });
  }

  async update(id: number, data: Partial<CommercialInput & { isProcessed: boolean }>) {
    return prisma.commercialForm.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.commercialForm.delete({
      where: { id },
    });
  }
}

export default new CommercialService();
