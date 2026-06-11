import { Request, Response } from 'express';
import activityService from './activity.service';
import { activitySchema } from './activity.validation';
import { sanitizeObject } from '../../utils/sanitize';

import { getPaginationParams, formatPaginatedResult } from '../../utils/pagination';

class ActivityController {
  async getAll(req: Request, res: Response) {
    try {
      const { page, limit, skip } = getPaginationParams(req);
      const { items, total } = await activityService.getAll(skip, limit);
      res.json(formatPaginatedResult(items, total, page, limit));
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' });
      const activity = await activityService.getById(id);
      if (!activity) return res.status(404).json({ success: false, error: 'Activity not found' });
      res.json({ success: true, data: activity });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      req.body = sanitizeObject(req.body);
      const validatedData = activitySchema.parse(req.body);
      const activity = await activityService.create(validatedData);
      res.status(201).json({ success: true, data: activity });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message || 'Failed to create activity' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' });
      req.body = sanitizeObject(req.body);
      const validatedData = activitySchema.partial().parse(req.body);
      const activity = await activityService.update(id, validatedData);
      res.json({ success: true, data: activity });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message || 'Failed to update activity' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' });
      await activityService.delete(id);
      res.json({ success: true, message: 'Activity deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default new ActivityController();
