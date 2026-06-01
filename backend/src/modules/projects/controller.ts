import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../core/base/baseController';
import { ProjectUseCase } from './use-case';

export class ProjectController extends BaseController {
  private projectUseCase: ProjectUseCase;

  constructor(projectUseCase = new ProjectUseCase()) {
    super();
    this.projectUseCase = projectUseCase;
  }

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const projects = await this.projectUseCase.getAllProjects(req.organizationId!);
      this.sendSuccess(res, projects, 'Projets récupérés avec succès.');
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const project = await this.projectUseCase.getProjectById(req.params.id, req.organizationId!);
      this.sendSuccess(res, project, 'Projet récupéré avec succès.');
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Parse des dates si fournies
      const data = { ...req.body };
      if (data.startDate) data.startDate = new Date(data.startDate);
      if (data.endDate) data.endDate = new Date(data.endDate);

      const project = await this.projectUseCase.createProject(req.organizationId!, data);
      this.sendCreated(res, project, 'Projet créé avec succès.');
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = { ...req.body };
      if (data.startDate) data.startDate = new Date(data.startDate);
      if (data.endDate) data.endDate = new Date(data.endDate);

      const project = await this.projectUseCase.updateProject(req.params.id, req.organizationId!, data);
      this.sendSuccess(res, project, 'Projet mis à jour avec succès.');
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.projectUseCase.deleteProject(req.params.id, req.organizationId!);
      this.sendSuccess(res, null, 'Projet supprimé avec succès.');
    } catch (error) {
      next(error);
    }
  };
}

export default ProjectController;
