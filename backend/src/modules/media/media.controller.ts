import { Request, Response } from 'express';
import mediaService from './media.service';
import { mediaSchema } from './media.validation';

class MediaController {
  async getAll(req: Request, res: Response) {
    try {
      const media = await mediaService.getAll();
      res.json(media);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
      const media = await mediaService.getById(id);
      if (!media) return res.status(404).json({ error: 'Media not found' });
      res.json(media);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const validatedData = mediaSchema.parse(req.body);
      const media = await mediaService.create(validatedData);
      res.status(201).json(media);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create media' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
      const validatedData = mediaSchema.partial().parse(req.body);
      const media = await mediaService.update(id, validatedData);
      res.json(media);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update media' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
      await mediaService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new MediaController();
