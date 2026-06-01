import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { UnauthorizedError, ForbiddenError } from '../errors/appError';
import { TokenPayload } from '../types';

/**
 * Middleware pour exiger l'authentification par jeton Bearer JWT
 */
export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError("Jeton d'accès manquant ou format d'autorisation invalide.");
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
    
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      organizationId: decoded.organizationId,
    };
    
    req.organizationId = decoded.organizationId;
    next();
  } catch (error) {
    throw new UnauthorizedError("Jeton d'accès expiré ou invalide.");
  }
};

/**
 * Middleware pour exiger un rôle spécifique parmi une liste autorisée
 */
export const requireRole = (roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Vous devez être authentifié pour effectuer cette action.');
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError("Vous n'avez pas les privilèges requis pour accéder à cette ressource.");
    }

    next();
  };
};

export default requireAuth;
