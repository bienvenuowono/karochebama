import prisma from '../../config/prisma';
import { SiteInput } from './site.validation';

class SiteService {
  async getAll() {
    return prisma.productionSite.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
  }

  async getById(id: string) {
    return prisma.productionSite.findUnique({
      where: { id },
      include: { products: true }
    });
  }

  async create(data: SiteInput) {
    return prisma.productionSite.create({
      data,
    });
  }

  async update(id: string, data: Partial<SiteInput>) {
    return prisma.productionSite.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.productionSite.delete({
      where: { id },
    });
  }
}

export default new SiteService();
