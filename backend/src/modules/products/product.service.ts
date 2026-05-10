import prisma from '../../config/prisma';
import { ProductInput } from './product.validation';

class ProductService {
  async getAll(filters: { categoryId?: string; status?: string } = {}) {
    return prisma.product.findMany({
      where: {
        ...(filters.categoryId && { categoryId: filters.categoryId }),
        ...(filters.status && { status: filters.status }),
      },
      include: {
        category: { select: { name: true, slug: true } },
        supplier: { select: { firstName: true, lastName: true } },
        productionSite: { select: { name: true, location: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: { select: { id: true, firstName: true, lastName: true, email: true } },
        productionSite: true,
      },
    });
  }

  async create(data: ProductInput, supplierId: string) {
    return prisma.product.create({
      data: {
        ...data,
        supplierId,
      },
    });
  }

  async update(id: string, data: Partial<ProductInput>, supplierId: string) {
    // Verify ownership or admin role could be added here
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}

export default new ProductService();
