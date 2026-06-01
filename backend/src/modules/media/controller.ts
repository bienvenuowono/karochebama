import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../core/base/baseController';
import { MediaUseCase } from './use-case';
import { BadRequestError } from '../../core/errors/appError';

export class MediaController extends BaseController {
  private mediaUseCase: MediaUseCase;

  constructor(mediaUseCase = new MediaUseCase()) {
    super();
    this.mediaUseCase = mediaUseCase;
  }

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const medias = await this.mediaUseCase.getAllMedia(req.organizationId!);
      this.sendSuccess(res, medias, 'Fichiers récupérés avec succès.');
    } catch (error) {
      next(error);
    }
  };

  public upload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        throw new BadRequestError('Aucun fichier fourni.');
      }
      
      const media = await this.mediaUseCase.saveMediaRecord(req.organizationId!, req.user!.id, req.file);
      this.sendCreated(res, media, 'Fichier téléversé avec succès.');
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.mediaUseCase.deleteMedia(req.params.id, req.organizationId!);
      this.sendSuccess(res, null, 'Fichier supprimé avec succès.');
    } catch (error) {
      next(error);
    }
  };
}

export default MediaController;
