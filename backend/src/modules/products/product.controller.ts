import { Response } from 'express';
import { AuthRequest } from '../../core/auth.middleware';
import productService from './product.service';
import { productSchema } from './product.validation';

class ProductController {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const { categoryId, status } = req.query;
      const products = await productService.getAll({ 
        categoryId: categoryId as string, 
        status: status as string 
      });
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const product = await productService.getById(req.params.id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const validatedData = productSchema.parse(req.body);
      const supplierId = req.user!.userId;
      const product = await productService.create(validatedData, supplierId);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create product' });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const validatedData = productSchema.partial().parse(req.body);
      const supplierId = req.user!.userId;
      const product = await productService.update(req.params.id, validatedData, supplierId);
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update product' });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      await productService.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new ProductController();
