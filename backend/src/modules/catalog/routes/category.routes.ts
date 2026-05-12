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
      
      // Cascade Delete using a transaction
      await prisma.$transaction(async (tx) => {
        // 1. Récupérer toutes les variétés de cette catégorie
        const varieties = await tx.productVariety.findMany({
          where: { categoryId: id },
          select: { id: true }
        });
        const varietyIds = varieties.map(v => v.id);

        if (varietyIds.length > 0) {
          // 2. Supprimer tous les produits liés à ces variétés
          await tx.product.deleteMany({
            where: { varietyId: { in: varietyIds } }
          });

          // 3. Supprimer les variétés
          await tx.productVariety.deleteMany({
            where: { id: { in: varietyIds } }
          });
        }

        // 4. Supprimer la catégorie
        await tx.category.delete({ where: { id } });
      });

      res.json({ success: true, message: "Catégorie et ses variétés/produits supprimés avec succès" });
    } catch (error: any) {
      console.error('Delete error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  };

  // --- VARIÉTÉS ---
  deleteVariety = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      await prisma.$transaction(async (tx) => {
        // 1. Supprimer tous les produits utilisant cette variété
        await tx.product.deleteMany({
          where: { varietyId: id }
        });

        // 2. Supprimer la variété
        await tx.productVariety.delete({ where: { id } });
      });

      res.json({ success: true, message: "Variété et produits associés supprimés" });
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
