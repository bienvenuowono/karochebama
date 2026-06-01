import prisma from '../../config/database';
import { User, Organization, RefreshToken } from '@prisma/client';

export class AuthRepository {
  /**
   * Trouve un utilisateur par email en incluant son rôle et son organisation
   */
  public async findUserByEmail(email: string): Promise<(User & { role: { name: string }; organization: Organization }) | null> {
    return prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
      include: {
        role: true,
        organization: true,
      },
    });
  }

  /**
   * Trouve un rôle par son nom (ex: 'ADMIN', 'USER')
   */
  public async findRoleByName(name: string) {
    return prisma.role.findUnique({
      where: { name },
    });
  }

  /**
   * Crée une organisation et son utilisateur administrateur dans une transaction Prisma
   */
  public async registerOrganizationAndAdmin(data: {
    email: string;
    passwordHash: string;
    firstName?: string;
    lastName?: string;
    orgName: string;
    orgSlug: string;
    adminRoleName: string;
  }): Promise<User & { role: { name: string }; organization: Organization }> {
    return prisma.$transaction(async (tx) => {
      // 1. Trouver ou créer le rôle d'administrateur
      let role = await tx.role.findUnique({ where: { name: data.adminRoleName } });
      if (!role) {
        role = await tx.role.create({
          data: {
            name: data.adminRoleName,
            description: 'Administrateur de l\'organisation',
          },
        });
      }

      // 2. Créer l'organisation
      const org = await tx.organization.create({
        data: {
          name: data.orgName,
          slug: data.orgSlug,
        },
      });

      // 3. Créer l'utilisateur rattaché
      const user = await tx.user.create({
        data: {
          email: data.email,
          passwordHash: data.passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          organizationId: org.id,
          roleId: role.id,
          isEmailVerified: false, // Par défaut non vérifié lors de l'inscription
        },
        include: {
          role: true,
          organization: true,
        },
      });

      return user;
    });
  }

  /**
   * Met à jour le mot de passe d'un utilisateur
   */
  public async updateUserPassword(userId: string, passwordHash: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  /**
   * Marque l'email d'un utilisateur comme vérifié
   */
  public async setEmailVerified(userId: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { isEmailVerified: true },
    });
  }

  /**
   * Enregistre un Refresh Token dans MySQL
   */
  public async createRefreshToken(userId: string, token: string, expiresAt: Date): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  /**
   * Recherche un Refresh Token actif en base
   */
  public async findRefreshToken(token: string): Promise<(RefreshToken & { user: User & { role: { name: string } } }) | null> {
    return prisma.refreshToken.findFirst({
      where: {
        token,
        revokedAt: null,
      },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  /**
   * Révoque un Refresh Token en base
   */
  public async revokeRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { token },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Révoque tous les Refresh Tokens actifs d'un utilisateur (détection de réutilisation / brèche de sécurité)
   */
  public async revokeAllUserTokens(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
  }
}

export default AuthRepository;
