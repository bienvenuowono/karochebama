import { Request, Response } from 'express';
import projectService from './project.service';
import { projectSchema } from './project.validation';

class ProjectController {
  async getAll(req: Request, res: Response) {
    try {
      const projects = await projectService.getAll();
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
      const project = await projectService.getById(id);
      if (!project) return res.status(404).json({ error: 'Project not found' });
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const validatedData = projectSchema.parse(req.body);
      const project = await projectService.create(validatedData);
      res.status(201).json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create project' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
      const validatedData = projectSchema.partial().parse(req.body);
      const project = await projectService.update(id, validatedData);
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update project' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
      await projectService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new ProjectController();
