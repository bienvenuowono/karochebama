import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../core/base/baseController';
import { UserUseCase } from './use-case';
import { UnauthorizedError } from '../../core/errors/appError';

export class UserController extends BaseController {
  private userUseCase: UserUseCase;

  constructor(userUseCase = new UserUseCase()) {
    super();
    this.userUseCase = userUseCase;
  }

  /**
   * Endpoint de récupération du profil de l'utilisateur courant
   */
  public getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.organizationId) {
        throw new UnauthorizedError('Vous devez être authentifié pour accéder à ce profil.');
      }

      const user = await this.userUseCase.getUserProfile(req.user.id, req.organizationId);
      this.sendSuccess(res, user, 'Profil utilisateur récupéré avec succès.');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Endpoint de mise à jour du profil de l'utilisateur courant
   */
  public updateMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user || !req.organizationId) {
        throw new UnauthorizedError('Vous devez être authentifié pour modifier ce profil.');
      }

      const updated = await this.userUseCase.updateProfile(req.user.id, req.organizationId, req.body);
      this.sendSuccess(res, updated, 'Profil utilisateur mis à jour avec succès.');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Lister tous les utilisateurs (pour les admins de l'organisation)
   */
  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userUseCase.getUsers(req.organizationId!);
      this.sendSuccess(res, users, 'Utilisateurs récupérés avec succès.');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Créer un nouvel utilisateur (pour les admins de l'organisation)
   */
  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userUseCase.createUser(req.organizationId!, req.body);
      this.sendCreated(res, user, 'Utilisateur créé avec succès.');
    } catch (error) {
      next(error);
    }
  };

  /**
   * Supprimer un utilisateur (pour les admins de l'organisation)
   */
  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      await this.userUseCase.deleteUser(userId, req.organizationId!, req.user!.id);
      this.sendSuccess(res, null, 'Utilisateur supprimé avec succès.');
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
