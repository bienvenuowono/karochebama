import { Request, Response, Router } from 'express';
import prisma from '../../../config/prisma';

export class CategoryController {
  // --- CATÉGORIES ---
  getCategories = async (req: Request, res: Response) => {
    try {
      const categories = await prisma.category.findMany({
        include: { varieties: true }
      });
      res.json({ success: true, data: categories });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  createCategory = async (req: Request, res: Response) => {
    try {
      const category = await prisma.category.create({
        data: { name: req.body.name }
      });
      res.status(201).json({ success: true, data: category });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  deleteCategory = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      // Vérifier s'il y a des variétés ou produits liés
      const count = await prisma.productVariety.count({ where: { categoryId: id } });
      if (count > 0) throw new Error("Impossible de supprimer : cette catégorie contient des variétés.");

      await prisma.category.delete({ where: { id } });
      res.json({ success: true, message: "Catégorie supprimée" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  // --- VARIÉTÉS ---
  deleteVariety = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      // Vérifier si des produits utilisent cette variété
      const count = await prisma.product.count({ where: { varietyId: id } });
      if (count > 0) throw new Error("Impossible de supprimer : des produits utilisent cette variété.");

      await prisma.productVariety.delete({ where: { id } });
      res.json({ success: true, message: "Variété supprimée" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getVarietiesByCategory = async (req: Request, res: Response) => {
    try {
      const varieties = await prisma.productVariety.findMany({
        where: { categoryId: parseInt(req.params.categoryId) }
      });
      res.json({ success: true, data: varieties });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  createVariety = async (req: Request, res: Response) => {
    try {
      const { name, categoryId } = req.body;
      const variety = await prisma.productVariety.create({
        data: { 
          name, 
          categoryId: parseInt(categoryId) 
        }
      });
      res.status(201).json({ success: true, data: variety });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getAllVarieties = async (req: Request, res: Response) => {
    try {
      const varieties = await prisma.productVariety.findMany({
        include: { category: true }
      });
      res.json({ success: true, data: varieties });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

const router = Router();
const controller = new CategoryController();

router.get('/', controller.getCategories);
router.post('/', controller.createCategory);
router.delete('/:id', controller.deleteCategory);
router.get('/varieties', controller.getAllVarieties);
router.post('/varieties', controller.createVariety);
router.delete('/varieties/:id', controller.deleteVariety);
router.get('/:categoryId/varieties', controller.getVarietiesByCategory);

export default router;
