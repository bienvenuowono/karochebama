import prisma from '../../config/prisma';
import { CategoryInput } from './category.validation';

class CategoryService {
  async getAll() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
  }

  async create(data: CategoryInput) {
    return prisma.category.create({
      data,
    });
  }

  async getBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: { products: true }
    });
  }
}

export default new CategoryService();
