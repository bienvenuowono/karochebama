import prisma from '../../config/prisma';
import { ProjectInput } from './project.validation';

class ProjectService {
  async getAll() {
    return prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    });
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
