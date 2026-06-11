import prisma from '../../config/prisma';
import { PartnerInput } from './partners.validation';

class PartnerService {
  async getAll(skip?: number, take?: number) {
    const [items, total] = await Promise.all([
      prisma.partnerApplication.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.partnerApplication.count()
    ]);
    return { items, total };
  }

  async getById(id: number) {
    return prisma.partnerApplication.findUnique({
      where: { id }
    });
  }

  async create(data: PartnerInput) {
    return prisma.partnerApplication.create({
      data,
    });
  }

  async update(id: number, data: Partial<PartnerInput & { isProcessed: boolean }>) {
    return prisma.partnerApplication.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.partnerApplication.delete({
      where: { id },
    });
  }
}

export default new PartnerService();
