import prisma from '../../config/prisma';
import { ArticleInput } from './news.validation';

class NewsService {
  async getAll(skip?: number, take?: number) {
    const [items, total] = await Promise.all([
      prisma.article.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.article.count()
    ]);
    return { items, total };
  }

  async getById(id: number) {
    return prisma.article.findUnique({
      where: { id }
    });
  }

  async create(data: ArticleInput) {
    return prisma.article.create({
      data,
    });
  }

  async update(id: number, data: Partial<ArticleInput>) {
    return prisma.article.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.article.delete({
      where: { id },
    });
  }
}

export default new NewsService();
