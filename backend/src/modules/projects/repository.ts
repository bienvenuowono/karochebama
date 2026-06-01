import { IsolatedBaseRepository } from '../../core/base/baseRepository';
import prisma from '../../config/database';
import { Project, Prisma } from '@prisma/client';

export class ProjectRepository extends IsolatedBaseRepository<
  Project,
  Prisma.ProjectCreateWithoutOrganizationInput,
  Prisma.ProjectUpdateInput
> {
  constructor() {
    super(prisma.project);
  }

  /**
   * Suppression logique d'un projet
   */
  public async softDelete(id: string, organizationId: string): Promise<Project> {
    return this.modelDelegate.update({
      where: { id, organizationId },
      data: { deletedAt: new Date() },
    });
  }
}

export default ProjectRepository;
