import { Request, Response } from 'express';
import siteService from './site.service';
import { siteSchema } from './site.validation';

class SiteController {
  async getAll(req: Request, res: Response) {
    try {
      const sites = await siteService.getAll();
      res.json(sites);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const site = await siteService.getById(req.params.id);
      if (!site) return res.status(404).json({ error: 'Site not found' });
      res.json(site);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const validatedData = siteSchema.parse(req.body);
      const site = await siteService.create(validatedData);
      res.status(201).json(site);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create site' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const validatedData = siteSchema.partial().parse(req.body);
      const site = await siteService.update(req.params.id, validatedData);
      res.json(site);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update site' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await siteService.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new SiteController();
