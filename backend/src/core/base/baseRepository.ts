/**
 * BaseRepository standard pour les entités globales (non isolées par organisation)
 */
export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  protected modelDelegate: any;

  constructor(modelDelegate: any) {
    this.modelDelegate = modelDelegate;
  }

  /**
   * Récupère un enregistrement par son identifiant unique
   */
  public async findById(id: string): Promise<T | null> {
    return this.modelDelegate.findUnique({
      where: { id },
    });
  }

  /**
   * Récupère tous les enregistrements
   */
  public async findAll(): Promise<T[]> {
    return this.modelDelegate.findMany();
  }

  /**
   * Crée un nouvel enregistrement
   */
  public async create(data: CreateInput): Promise<T> {
    return this.modelDelegate.create({
      data,
    });
  }

  /**
   * Met à jour un enregistrement
   */
  public async update(id: string, data: UpdateInput): Promise<T> {
    return this.modelDelegate.update({
      where: { id },
      data,
    });
  }

  /**
   * Supprime physiquement un enregistrement
   */
  public async delete(id: string): Promise<T> {
    return this.modelDelegate.delete({
      where: { id },
    });
  }
}

/**
 * IsolatedBaseRepository pour les entités multi-tenant (isolées par organizationId et gérant le soft-delete)
 */
export abstract class IsolatedBaseRepository<T, CreateInput, UpdateInput> {
  protected modelDelegate: any;

  constructor(modelDelegate: any) {
    this.modelDelegate = modelDelegate;
  }

  /**
   * Récupère un enregistrement par son identifiant et organizationId (actif uniquement)
   */
  public async findById(id: string, organizationId: string): Promise<T | null> {
    return this.modelDelegate.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
    });
  }

  /**
   * Récupère tous les enregistrements actifs d'une organisation
   */
  public async findAll(organizationId: string): Promise<T[]> {
    return this.modelDelegate.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
    });
  }

  /**
   * Crée un enregistrement lié à l'organisation
   */
  public async create(data: CreateInput, organizationId: string): Promise<T> {
    return this.modelDelegate.create({
      data: {
        ...data,
        organizationId,
      },
    });
  }

  /**
   * Met à jour un enregistrement actif de l'organisation
   */
  public async update(id: string, data: UpdateInput, organizationId: string): Promise<T> {
    return this.modelDelegate.update({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
      data,
    });
  }

  /**
   * Réalise une suppression logique (soft delete)
   */
  public async softDelete(id: string, organizationId: string): Promise<T> {
    return this.modelDelegate.update({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Réalise une suppression physique (hard delete)
   */
  public async hardDelete(id: string, organizationId: string): Promise<void> {
    await this.modelDelegate.deleteMany({
      where: {
        id,
        organizationId,
      },
    });
  }
}

export default BaseRepository;
