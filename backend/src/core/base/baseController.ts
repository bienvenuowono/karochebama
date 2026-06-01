import { Response } from 'express';
import logger from '../../config/logger';

export abstract class BaseController {
  /**
   * Envoie une réponse HTTP 200 OK standardisée
   */
  public sendSuccess<T>(res: Response, data: T, message?: string): void {
    res.status(200).json({
      success: true,
      ...(message && { message }),
      data,
    });
  }

  /**
   * Envoie une réponse HTTP 201 Created standardisée
   */
  public sendCreated<T>(res: Response, data: T, message?: string): void {
    res.status(201).json({
      success: true,
      ...(message && { message }),
      data,
    });
  }

  /**
   * Envoie une réponse HTTP 200 OK paginée standardisée
   */
  public sendPaginated<T>(
    res: Response,
    data: T[],
    meta: { currentPage: number; limit: number; totalItems: number }
  ): void {
    const totalPages = Math.ceil(meta.totalItems / meta.limit);
    res.status(200).json({
      success: true,
      data,
      meta: {
        currentPage: meta.currentPage,
        limit: meta.limit,
        totalPages,
        totalItems: meta.totalItems,
      },
    });
  }

  /**
   * Envoie une réponse HTTP 204 No Content
   */
  public sendNoContent(res: Response): void {
    res.status(204).send();
  }

  /**
   * Enregistre un message d'erreur et renvoie une réponse personnalisée (en secours du middleware global)
   */
  public sendError(
    res: Response,
    statusCode = 500,
    errorCode = 'INTERNAL_SERVER_ERROR',
    message = 'Une erreur est survenue.'
  ): void {
    logger.warn(`BaseController error response: ${message}`, { statusCode, errorCode });
    res.status(statusCode).json({
      success: false,
      error: {
        code: errorCode,
        message,
      },
    });
  }
}

export default BaseController;
