import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/appError';
import logger from '../../config/logger';
import { Prisma } from '@prisma/client';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const correlationId = (req.headers['x-correlation-id'] as string) || 'system';

  // 1. Gestion des erreurs de jetons JWT
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: "Le jeton d'accès a expiré.",
      },
    });
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Jeton de sécurité invalide.',
      },
    });
    return;
  }

  // 2. Gestion des erreurs Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    logger.warn(`Prisma Error [${err.code}]: ${err.message}`, {
      correlationId,
      code: err.code,
      meta: err.meta,
    });

    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[]) || [];
      res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: `Une ressource avec cette valeur existe déjà (${target.join(', ')}).`,
        },
      });
      return;
    }

    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: "L'enregistrement demandé est introuvable ou a déjà été supprimé.",
        },
      });
      return;
    }

    if (err.code === 'P2003') {
      res.status(400).json({
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: "Erreur d'intégrité référentielle (clé parente manquante ou dépendance existante).",
        },
      });
      return;
    }
  }

  // 3. Gestion des erreurs applicatives définies (AppError)
  if (err instanceof AppError) {
    logger.warn(`AppError [${err.errorCode}]: ${err.message}`, {
      correlationId,
      statusCode: err.statusCode,
      details: err.details,
    });

    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.errorCode,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  // 4. Erreur serveur non gérée (Erreur 500 générique pour la sécurité)
  logger.error(`Unhandled Error: ${err.message}`, {
    correlationId,
    stack: err.stack,
  });

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Une erreur interne est survenue sur le serveur.',
    },
  });
};

export default errorMiddleware;
