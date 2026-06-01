import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { BadRequestError } from '../errors/appError';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      // Assigner les valeurs parsées à la requête pour le typage et le formatage automatique
      req.body = parsed.body;
      req.query = parsed.query;
      req.params = parsed.params;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.map((err) => ({
          field: err.path.slice(1).join('.'), // Enlève le premier élément 'body'/'query'/'params'
          message: err.message,
        }));
        next(new BadRequestError('Erreur de validation des données.', details));
        return;
      }
      next(error);
    }
  };
};
