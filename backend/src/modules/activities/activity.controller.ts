import { Request, Response } from 'express';
import activityService from './activity.service';
import { activitySchema } from './activity.validation';

class ActivityController {
  async getAll(req: Request, res: Response) {
    try {
      const activities = await activityService.getAll();
      res.json(activities);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
      const activity = await activityService.getById(id);
      if (!activity) return res.status(404).json({ error: 'Activity not found' });
      res.json(activity);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const validatedData = activitySchema.parse(req.body);
      const activity = await activityService.create(validatedData);
      res.status(201).json(activity);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create activity' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
      const validatedData = activitySchema.partial().parse(req.body);
      const activity = await activityService.update(id, validatedData);
      res.json(activity);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update activity' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
      await activityService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new ActivityController();
