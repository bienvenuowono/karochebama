import prisma from '../../config/prisma';
import { ProjectInput } from './project.validation';

class ProjectService {
  async getAll(skip?: number, take?: number) {
    const [items, total] = await Promise.all([
      prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.project.count()
    ]);
    return { items, total };
  }

  async getById(id: number) {
    return prisma.project.findUnique({
      where: { id }
    });
  }

  async create(data: ProjectInput) {
    return prisma.project.create({
      data,
    });
  }

  async update(id: number, data: Partial<ProjectInput>) {
    return prisma.project.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.project.delete({
      where: { id },
    });
  }
}

export default new ProjectService();
