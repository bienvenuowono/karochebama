import prisma from '../../config/prisma';
import { ArticleInput } from './news.validation';

class NewsService {
  async getAll() {
    return prisma.article.findMany({
      orderBy: { createdAt: 'desc' }
    });
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
