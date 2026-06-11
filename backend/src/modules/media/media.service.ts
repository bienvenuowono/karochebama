import prisma from '../../config/prisma';
import { MediaInput } from './media.validation';

class MediaService {
  async getAll() {
    return prisma.media.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async getById(id: number) {
    return prisma.media.findUnique({
      where: { id }
    });
  }

  async create(data: MediaInput) {
    return prisma.media.create({
      data,
    });
  }

  async update(id: number, data: Partial<MediaInput>) {
    return prisma.media.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.media.delete({
      where: { id },
    });
  }
}

export default new MediaService();
