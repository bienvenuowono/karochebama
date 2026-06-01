import { IsolatedBaseRepository } from '../../core/base/baseRepository';
import prisma from '../../config/database';
import { User, Prisma } from '@prisma/client';

export class UserRepository extends IsolatedBaseRepository<
  User,
  Prisma.UserCreateWithoutOrganizationInput,
  Prisma.UserUpdateInput
> {
  constructor() {
    super(prisma.user);
  }

  /**
   * Récupère un utilisateur avec son rôle (sélection filtrée par organizationId et deletedAt)
   */
  public async findByIdWithRole(id: string, organizationId: string): Promise<(User & { role: { name: string } }) | null> {
    return this.modelDelegate.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
      include: {
        role: true,
      },
    });
  }

  /**
   * Récupère tous les utilisateurs d'une organisation
   */
  public async findAllWithRoles(organizationId: string): Promise<(User & { role: { name: string } })[]> {
    return this.modelDelegate.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      include: {
        role: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Suppression logique (Soft Delete)
   */
  public async softDelete(id: string, organizationId: string): Promise<User> {
    return this.modelDelegate.update({
      where: { id, organizationId },
      data: { deletedAt: new Date() },
    });
  }
}

export default UserRepository;
