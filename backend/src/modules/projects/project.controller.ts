import { Request, Response } from 'express';
import projectService from './project.service';
import { projectSchema } from './project.validation';
import { sanitizeObject } from '../../utils/sanitize';

import { getPaginationParams, formatPaginatedResult } from '../../utils/pagination';

class ProjectController {
  async getAll(req: Request, res: Response) {
    try {
      const { page, limit, skip } = getPaginationParams(req);
      const { items, total } = await projectService.getAll(skip, limit);
      res.json(formatPaginatedResult(items, total, page, limit));
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' });
      const project = await projectService.getById(id);
      if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
      res.json({ success: true, data: project });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      req.body = sanitizeObject(req.body);
      const validatedData = projectSchema.parse(req.body);
      const project = await projectService.create(validatedData);
      res.status(201).json({ success: true, data: project });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message || 'Failed to create project' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' });
      req.body = sanitizeObject(req.body);
      const validatedData = projectSchema.partial().parse(req.body);
      const project = await projectService.update(id, validatedData);
      res.json({ success: true, data: project });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message || 'Failed to update project' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' });
      await projectService.delete(id);
      res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

export default new ProjectController();
