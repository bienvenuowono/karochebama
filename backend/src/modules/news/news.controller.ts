import { Request, Response } from 'express';
import newsService from './news.service';
import { articleSchema } from './news.validation';
import { sanitizeObject } from '../../utils/sanitize';

import { getPaginationParams, formatPaginatedResult } from '../../utils/pagination';

class NewsController {
  async getAll(req: Request, res: Response) {
    try {
      const { page, limit, skip } = getPaginationParams(req);
      const { items, total } = await newsService.getAll(skip, limit);
      res.json(formatPaginatedResult(items, total, page, limit));
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' });
      const article = await newsService.getById(id);
      if (!article) return res.status(404).json({ success: false, error: 'Article not found' });
      res.json({ success: true, data: article });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      req.body = sanitizeObject(req.body);
      const validatedData = articleSchema.parse(req.body);
      const article = await newsService.create(validatedData);
      res.status(201).json({ success: true, data: article });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message || 'Failed to create article' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' });
      req.body = sanitizeObject(req.body);
      const validatedData = articleSchema.partial().parse(req.body);
      const article = await newsService.update(id, validatedData);
      res.json({ success: true, data: article });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message || 'Failed to update article' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' });
      await newsService.delete(id);
      res.json({ success: true, message: 'Article deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default new NewsController();
