import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../core/base/baseController';
import { ProductUseCase } from './use-case';
import { UnauthorizedError } from '../../core/errors/appError';

export class ProductController extends BaseController {
  private productUseCase: ProductUseCase;

  constructor(productUseCase = new ProductUseCase()) {
    super();
    this.productUseCase = productUseCase;
  }

  // ==========================================
  // ENDPOINTS DES CATÉGORIES
  // ==========================================

  public getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.organizationId;
      if (!organizationId) {
        throw new UnauthorizedError('Non authentifié.');
      }
      const categories = await this.productUseCase.getCategories(organizationId);
      this.sendSuccess(res, categories);
    } catch (error) {
      next(error);
    }
  };

  public getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.organizationId;
      if (!organizationId) {
        throw new UnauthorizedError('Non authentifié.');
      }
      const { id } = req.params;
      const category = await this.productUseCase.getCategoryById(id, organizationId);
      this.sendSuccess(res, category);
    } catch (error) {
      next(error);
    }
  };

  public createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.organizationId;
      if (!organizationId) {
        throw new UnauthorizedError('Non authentifié.');
      }
      const category = await this.productUseCase.createCategory(req.body, organizationId);
      this.sendCreated(res, category, 'Catégorie créée avec succès.');
    } catch (error) {
      next(error);
    }
  };

  public updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.organizationId;
      if (!organizationId) {
        throw new UnauthorizedError('Non authentifié.');
      }
      const { id } = req.params;
      const category = await this.productUseCase.updateCategory(id, req.body, organizationId);
      this.sendSuccess(res, category, 'Catégorie mise à jour avec succès.');
    } catch (error) {
      next(error);
    }
  };

  public deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.organizationId;
      if (!organizationId) {
        throw new UnauthorizedError('Non authentifié.');
      }
      const { id } = req.params;
      await this.productUseCase.deleteCategory(id, organizationId);
      this.sendSuccess(res, null, 'Catégorie supprimée avec succès.');
    } catch (error) {
      next(error);
    }
  };

  // ==========================================
  // ENDPOINTS DES PRODUITS
  // ==========================================

  public getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.organizationId;
      if (!organizationId) {
        throw new UnauthorizedError('Non authentifié.');
      }
      const products = await this.productUseCase.getProducts(organizationId);
      this.sendSuccess(res, products);
    } catch (error) {
      next(error);
    }
  };

  public getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.organizationId;
      if (!organizationId) {
        throw new UnauthorizedError('Non authentifié.');
      }
      const { id } = req.params;
      const product = await this.productUseCase.getProductById(id, organizationId);
      this.sendSuccess(res, product);
    } catch (error) {
      next(error);
    }
  };

  public createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.organizationId;
      if (!organizationId) {
        throw new UnauthorizedError('Non authentifié.');
      }

      // Gérer l'image téléchargée si elle existe
      let imageUrl: string | undefined;
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }

      const productData = {
        ...req.body,
        ...(imageUrl && { imageUrl }),
      };

      const product = await this.productUseCase.create(productData, organizationId);
      this.sendCreated(res, product, 'Produit créé avec succès.');
    } catch (error) {
      next(error);
    }
  };

  public updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.organizationId;
      if (!organizationId) {
        throw new UnauthorizedError('Non authentifié.');
      }
      const { id } = req.params;

      // Gérer la nouvelle image téléchargée si elle existe
      let imageUrl: string | undefined;
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }

      const productData = {
        ...req.body,
        ...(imageUrl && { imageUrl }),
      };

      const product = await this.productUseCase.update(id, productData, organizationId);
      this.sendSuccess(res, product, 'Produit mis à jour avec succès.');
    } catch (error) {
      next(error);
    }
  };

  public deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const organizationId = req.organizationId;
      if (!organizationId) {
        throw new UnauthorizedError('Non authentifié.');
      }
      const { id } = req.params;
      await this.productUseCase.delete(id, organizationId);
      this.sendSuccess(res, null, 'Produit supprimé avec succès.');
    } catch (error) {
      next(error);
    }
  };
}

export default ProductController;
