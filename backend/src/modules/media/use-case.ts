import prisma from '../../config/database';
import { NotFoundError } from '../../core/errors/appError';

export class MediaUseCase {

  public async getAllMedia(organizationId: string) {
    return prisma.mediaFile.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  public async saveMediaRecord(organizationId: string, uploaderId: string, fileData: Express.Multer.File) {
    // Dans un vrai projet, le middleware d'upload (S3, Cloudinary) nous renverrait une URL.
    // Ici, on simule une URL locale /uploads/...
    const url = `/uploads/${fileData.filename}`;
    const key = fileData.filename;

    return prisma.mediaFile.create({
      data: {
        url,
        key,
        mimeType: fileData.mimetype,
        size: fileData.size,
        uploadedById: uploaderId,
        organizationId,
      },
    });
  }

  public async deleteMedia(id: string, organizationId: string) {
    const media = await prisma.mediaFile.findFirst({
      where: { id, organizationId, deletedAt: null },
    });

    if (!media) {
      throw new NotFoundError('Fichier introuvable');
    }

    return prisma.mediaFile.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export default MediaUseCase;
