import { Request, Response } from 'express';
import categoryService from './category.service';
import { categorySchema } from './category.validation';

class CategoryController {
  async getAll(req: Request, res: Response) {
    try {
      const categories = await categoryService.getAll();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const validatedData = categorySchema.parse(req.body);
      const category = await categoryService.create(validatedData);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create category' });
    }
  }

  async getBySlug(req: Request, res: Response) {
    try {
      const category = await categoryService.getBySlug(req.params.slug);
      if (!category) return res.status(404).json({ error: 'Category not found' });
      res.json(category);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new CategoryController();
