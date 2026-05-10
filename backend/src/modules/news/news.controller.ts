import { Request, Response } from 'express';
import newsService from './news.service';
import { articleSchema } from './news.validation';

class NewsController {
  async getAll(req: Request, res: Response) {
    try {
      const news = await newsService.getAll();
      res.json(news);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
      const article = await newsService.getById(id);
      if (!article) return res.status(404).json({ error: 'Article not found' });
      res.json(article);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const validatedData = articleSchema.parse(req.body);
      const article = await newsService.create(validatedData);
      res.status(201).json(article);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create article' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
      const validatedData = articleSchema.partial().parse(req.body);
      const article = await newsService.update(id, validatedData);
      res.json(article);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update article' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
      await newsService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new NewsController();
