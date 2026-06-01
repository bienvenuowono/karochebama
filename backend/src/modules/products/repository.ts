import { IsolatedBaseRepository } from '../../core/base/baseRepository';
import prisma from '../../config/database';
import { Product, Category, Harvest, OrderItem } from '@prisma/client';
import { CreateProductInput, UpdateProductInput, CreateCategoryInput, UpdateCategoryInput } from './types';

/**
 * CategoryRepository pour gérer l'accès aux catégories isolées par organisation
 */
export class CategoryRepository extends IsolatedBaseRepository<
  Category,
  CreateCategoryInput,
  UpdateCategoryInput
> {
  constructor() {
    super(prisma.category);
  }

  /**
   * Vérifie si un slug de catégorie existe déjà au sein d'une organisation
   */
  public async findBySlug(slug: string, organizationId: string): Promise<Category | null> {
    return prisma.category.findFirst({
      where: {
        slug,
        deletedAt: null,
        products: {
          some: {
            organizationId,
          },
        },
      },
    });
  }
}

/**
 * ProductRepository pour gérer l'accès aux produits isolés par organisation
 */
export class ProductRepository extends IsolatedBaseRepository<
  Product,
  CreateProductInput,
  UpdateProductInput
> {
  constructor() {
    super(prisma.product);
  }

  /**
   * Récupère un produit avec sa catégorie associée
   */
  public async findProductWithCategory(id: string, organizationId: string): Promise<(Product & { category: Category }) | null> {
    return prisma.product.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
      include: {
        category: true,
      },
    });
  }

  /**
   * Récupère tous les produits actifs avec leur catégorie
   */
  public async findAllProductsWithCategory(organizationId: string): Promise<(Product & { category: Category })[]> {
    return prisma.product.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      include: {
        category: true,
      },
    });
  }

  /**
   * Récupère toutes les récoltes effectuées pour un produit
   */
  public async getProductHarvests(productId: string, organizationId: string): Promise<Harvest[]> {
    return prisma.harvest.findMany({
      where: {
        productId,
        organizationId,
        deletedAt: null,
      },
    });
  }

  /**
   * Récupère toutes les ventes confirmées (commandes payées ou expédiées) d'un produit
   */
  public async getProductConfirmedSales(productId: string, organizationId: string): Promise<OrderItem[]> {
    return prisma.orderItem.findMany({
      where: {
        productId,
        order: {
          organizationId,
          status: { in: ['PAID', 'SHIPPED'] },
          deletedAt: null,
        },
      },
    });
  }
}
