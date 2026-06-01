import { ProductRepository, CategoryRepository } from './repository';
import { ProductDTO, CreateProductInput, UpdateProductInput, CategoryDTO, CreateCategoryInput, UpdateCategoryInput } from './types';
import { NotFoundError, BadRequestError } from '../../core/errors/appError';
import { Product, Category } from '@prisma/client';

export class ProductUseCase {
  private productRepository: ProductRepository;
  private categoryRepository: CategoryRepository;

  constructor(
    productRepository = new ProductRepository(),
    categoryRepository = new CategoryRepository()
  ) {
    this.productRepository = productRepository;
    this.categoryRepository = categoryRepository;
  }

  // ==========================================
  // LOGIQUE DES CATÉGORIES
  // ==========================================

  public async getCategories(organizationId: string): Promise<CategoryDTO[]> {
    const categories = await this.categoryRepository.findAll(organizationId);
    return categories.map(this.toCategoryDTO);
  }

  public async getCategoryById(id: string, organizationId: string): Promise<CategoryDTO> {
    const category = await this.categoryRepository.findById(id, organizationId);
    if (!category) {
      throw new NotFoundError('Catégorie introuvable.');
    }
    return this.toCategoryDTO(category);
  }

  public async createCategory(data: CreateCategoryInput, organizationId: string): Promise<CategoryDTO> {
    const existing = await this.categoryRepository.findBySlug(data.slug, organizationId);
    if (existing) {
      throw new BadRequestError('Une catégorie avec ce slug existe déjà pour cette organisation.');
    }
    const category = await this.categoryRepository.create(data, organizationId);
    return this.toCategoryDTO(category);
  }

  public async updateCategory(id: string, data: UpdateCategoryInput, organizationId: string): Promise<CategoryDTO> {
    const existing = await this.categoryRepository.findById(id, organizationId);
    if (!existing) {
      throw new NotFoundError('Catégorie introuvable.');
    }
    const updated = await this.categoryRepository.update(id, data, organizationId);
    return this.toCategoryDTO(updated);
  }

  public async deleteCategory(id: string, organizationId: string): Promise<void> {
    const existing = await this.categoryRepository.findById(id, organizationId);
    if (!existing) {
      throw new NotFoundError('Catégorie introuvable.');
    }
    await this.categoryRepository.softDelete(id, organizationId);
  }

  // ==========================================
  // LOGIQUE DES PRODUITS
  // ==========================================

  public async getProducts(organizationId: string): Promise<ProductDTO[]> {
    const products = await this.productRepository.findAllProductsWithCategory(organizationId);
    
    // Calculer les données de stock et de tarification dynamiques pour chaque produit
    const dtos: ProductDTO[] = [];
    for (const product of products) {
      dtos.push(await this.calculateStockAndPrice(product, organizationId));
    }
    return dtos;
  }

  public async getProductById(id: string, organizationId: string): Promise<ProductDTO> {
    const product = await this.productRepository.findProductWithCategory(id, organizationId);
    if (!product) {
      throw new NotFoundError('Produit introuvable.');
    }
    return this.calculateStockAndPrice(product, organizationId);
  }

  public async create(data: CreateProductInput, organizationId: string): Promise<ProductDTO> {
    // Valider que la catégorie existe
    const category = await this.categoryRepository.findById(data.categoryId, organizationId);
    if (!category) {
      throw new BadRequestError('La catégorie spécifiée pour le produit est introuvable.');
    }

    const product = await this.productRepository.create(data, organizationId);
    
    // Récupérer le produit complet pour initialiser les calculs
    const fullProduct = await this.productRepository.findProductWithCategory(product.id, organizationId);
    return this.calculateStockAndPrice(fullProduct!, organizationId);
  }

  public async update(id: string, data: UpdateProductInput, organizationId: string): Promise<ProductDTO> {
    // S'assurer que le produit existe
    const existing = await this.productRepository.findById(id, organizationId);
    if (!existing) {
      throw new NotFoundError('Produit introuvable.');
    }

    // Si on change la catégorie, valider son existence
    if (data.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId, organizationId);
      if (!category) {
        throw new BadRequestError('La nouvelle catégorie spécifiée est introuvable.');
      }
    }

    await this.productRepository.update(id, data, organizationId);
    
    const fullProduct = await this.productRepository.findProductWithCategory(id, organizationId);
    return this.calculateStockAndPrice(fullProduct!, organizationId);
  }

  public async delete(id: string, organizationId: string): Promise<void> {
    const existing = await this.productRepository.findById(id, organizationId);
    if (!existing) {
      throw new NotFoundError('Produit introuvable.');
    }
    await this.productRepository.softDelete(id, organizationId);
  }

  // ==========================================
  // MÉTHODES PRIVÉES DE LOGIQUE MÉTIER
  // ==========================================

  /**
   * Calcule le stock dynamique (Régime/Tonnes) et le prix dynamique
   * selon la règle : Stock = TotalHarvestsCompleted - TotalConfirmedSales
   */
  private async calculateStockAndPrice(
    product: Product & { category: Category },
    organizationId: string
  ): Promise<ProductDTO> {
    // 1. Récupérer toutes les récoltes du produit
    const harvests = await this.productRepository.getProductHarvests(product.id, organizationId);
    
    // 2. Récupérer toutes les ventes confirmées
    const sales = await this.productRepository.getProductConfirmedSales(product.id, organizationId);

    // 3. Sommer les récoltes en Régime (conversion Tonnes -> Régime si nécessaire)
    let totalHarvestedRegime = 0;
    for (const harvest of harvests) {
      const qty = Number(harvest.quantity);
      const unit = harvest.unit.toLowerCase().trim();
      
      if (unit === 'tonnes' || unit === 't' || unit === 'tonne') {
        totalHarvestedRegime += qty * 1000;
      } else {
        // Unité par défaut : Régime
        totalHarvestedRegime += qty;
      }
    }

    // 4. Sommer les ventes confirmées en Régime (les orderItems ont une quantité en Régime)
    let totalSalesRegime = 0;
    for (const sale of sales) {
      totalSalesRegime += Number(sale.quantity);
    }

    // 5. Calculer le stock final restant
    const stockRegime = Math.max(0, totalHarvestedRegime - totalSalesRegime);
    const stockTonnes = stockRegime / 1000;

    // 6. Calculer le prix dynamique (Fluctuation selon le stock)
    const basePrice = Number(product.price);
    let dynamicPrice = basePrice;

    if (stockRegime < 100) {
      // Stock faible (< 100 Régime) : Rareté hausse de 10%
      dynamicPrice = basePrice * 1.10;
    } else if (stockRegime > 1000) {
      // Stock abondant (> 1000 Régime) : Déstockage baisse de 10%
      dynamicPrice = basePrice * 0.90;
    }

    // Arrondir proprement le prix final calculé
    dynamicPrice = Math.round(dynamicPrice * 100) / 100;

    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      description: product.description,
      imageUrl: product.imageUrl,
      price: dynamicPrice,
      originalPrice: basePrice,
      stockRegime,
      stockTonnes,
      categoryId: product.categoryId,
      category: this.toCategoryDTO(product.category),
      organizationId: product.organizationId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private toCategoryDTO(category: Category): CategoryDTO {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      createdAt: category.createdAt,
    };
  }
}

export default ProductUseCase;
