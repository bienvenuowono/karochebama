import { UserRepository } from './repository';
import { UserDTO, UpdateProfileInput } from './types';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../core/errors/appError';
import { User } from '@prisma/client';
import argon2 from 'argon2';
import prisma from '../../config/database';

export class UserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  /**
   * Récupère les détails du profil utilisateur courant
   */
  public async getUserProfile(id: string, organizationId: string): Promise<UserDTO> {
    const user = await this.userRepository.findByIdWithRole(id, organizationId);
    if (!user) {
      throw new NotFoundError('Utilisateur introuvable.');
    }
    return this.toUserDTO(user);
  }

  /**
   * Met à jour le profil de l'utilisateur courant
   */
  public async updateProfile(
    id: string,
    organizationId: string,
    input: UpdateProfileInput
  ): Promise<UserDTO> {
    // 1. S'assurer que l'utilisateur existe
    const existing = await this.userRepository.findById(id, organizationId);
    if (!existing) {
      throw new NotFoundError('Utilisateur introuvable.');
    }

    // 2. Mettre à jour l'enregistrement
    await this.userRepository.update(id, input, organizationId);

    // 3. Récupérer l'utilisateur mis à jour avec son rôle
    const updated = await this.userRepository.findByIdWithRole(id, organizationId);
    if (!updated) {
      throw new NotFoundError('Utilisateur introuvable après mise à jour.');
    }

    return this.toUserDTO(updated);
  }

  /**
   * Récupère tous les utilisateurs de l'organisation
   */
  public async getUsers(organizationId: string): Promise<UserDTO[]> {
    const users = await this.userRepository.findAllWithRoles(organizationId);
    return users.map(u => this.toUserDTO(u));
  }

  /**
   * Crée un nouvel utilisateur dans l'organisation
   */
  public async createUser(organizationId: string, input: any): Promise<UserDTO> {
    const { email, password, firstName, lastName, role } = input;

    // 1. Vérifier que l'email n'existe pas
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new BadRequestError('Un utilisateur avec cet email existe déjà');
    }

    // 2. Récupérer le rôle demandé
    const roleRecord = await prisma.role.findUnique({ where: { name: role } });
    if (!roleRecord) {
      throw new BadRequestError('Rôle introuvable');
    }

    // 3. Hasher le mot de passe
    const passwordHash = await argon2.hash(password);

    // 4. Créer l'utilisateur (via Prisma car le repository de base ne gère pas l'include de la relation facilement à la création)
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        organizationId,
        roleId: roleRecord.id,
      },
      include: {
        role: true,
      },
    });

    return this.toUserDTO(newUser);
  }

  /**
   * Supprime (Soft Delete) un utilisateur
   */
  public async deleteUser(id: string, organizationId: string, requestingUserId: string): Promise<void> {
    if (id === requestingUserId) {
      throw new ForbiddenError('Vous ne pouvez pas supprimer votre propre compte');
    }

    const user = await this.userRepository.findById(id, organizationId);
    if (!user) {
      throw new NotFoundError('Utilisateur introuvable');
    }

    await this.userRepository.softDelete(id, organizationId);
  }

  /**
   * Convertit un objet utilisateur Prisma en DTO propre
   */
  private toUserDTO(user: User & { role: { name: string } }): UserDTO {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role.name,
      organizationId: user.organizationId,
      createdAt: user.createdAt,
    };
  }
}

export default UserUseCase;
