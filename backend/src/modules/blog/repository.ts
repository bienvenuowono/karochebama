import { IsolatedBaseRepository } from '../../core/base/baseRepository';
import prisma from '../../config/database';
import { Blog, Prisma } from '@prisma/client';

export class BlogRepository extends IsolatedBaseRepository<
  Blog,
  Prisma.BlogCreateWithoutOrganizationInput,
  Prisma.BlogUpdateInput
> {
  constructor() {
    super(prisma.blog);
  }

  /**
   * Trouve un article par son slug (pour les URLs publiques du frontend)
   */
  public async findBySlug(slug: string, organizationId: string): Promise<Blog | null> {
    return this.modelDelegate.findFirst({
      where: {
        slug,
        organizationId,
        deletedAt: null,
      },
    });
  }

  /**
   * Suppression logique
   */
  public async softDelete(id: string, organizationId: string): Promise<Blog> {
    return this.modelDelegate.update({
      where: { id, organizationId },
      data: { deletedAt: new Date() },
    });
  }
}

export default BlogRepository;
