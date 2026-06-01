import { ProjectRepository } from './repository';
import { NotFoundError } from '../../core/errors/appError';

export class ProjectUseCase {
  private projectRepository: ProjectRepository;

  constructor(projectRepository = new ProjectRepository()) {
    this.projectRepository = projectRepository;
  }

  public async getAllProjects(organizationId: string) {
    return this.projectRepository.findAll(organizationId);
  }

  public async getProjectById(id: string, organizationId: string) {
    const project = await this.projectRepository.findById(id, organizationId);
    if (!project) {
      throw new NotFoundError('Projet introuvable');
    }
    return project;
  }

  public async createProject(organizationId: string, input: any) {
    return this.projectRepository.create(input, organizationId);
  }

  public async updateProject(id: string, organizationId: string, input: any) {
    const project = await this.projectRepository.findById(id, organizationId);
    if (!project) {
      throw new NotFoundError('Projet introuvable');
    }
    return this.projectRepository.update(id, input, organizationId);
  }

  public async deleteProject(id: string, organizationId: string) {
    const project = await this.projectRepository.findById(id, organizationId);
    if (!project) {
      throw new NotFoundError('Projet introuvable');
    }
    await this.projectRepository.softDelete(id, organizationId);
  }
}

export default ProjectUseCase;
