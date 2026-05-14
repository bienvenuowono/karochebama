import { Request, Response, Router } from 'express';
import prisma from '../../../config/prisma';

export class HarvestController {
  // 1. Enregistrer une nouvelle récolte
  create = async (req: Request, res: Response) => {
    try {
      const { productId, siteId, quantity, harvestDate, notes } = req.body;

      const result = await prisma.$transaction(async (tx) => {
        const harvest = await tx.harvest.create({
          data: {
            productId: parseInt(productId),
            siteId: parseInt(siteId),
            quantity: parseFloat(quantity),
            harvestDate: new Date(harvestDate),
            notes,
            status: 'COMPLETED'
          }
        });

        // Mise à jour du stock et changement de statut
        await tx.product.update({
          where: { id: parseInt(productId) },
          data: { 
            stock: { increment: parseFloat(quantity) },
            status: 'disponible' // Le produit devient disponible après récolte
          }
        });

        return harvest;
      });

      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  // 2. Obtenir TOUTES les cultures en cours (Suivi de production)
  getForecasts = async (req: Request, res: Response) => {
    try {
      const activeCultures = await prisma.product.findMany({
        where: {
          OR: [
            { status: 'en_production' },
            { 
              maturityDate: {
                gte: new Date()
              } 
            }
          ]
        },
        include: {
          category: true,
          sites: { include: { site: true } },
          variety: true
        },
        orderBy: { maturityDate: 'asc' }
      });
      res.json({ success: true, data: activeCultures });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // 3. Historique des récoltes
  getHistory = async (req: Request, res: Response) => {
    try {
      const history = await prisma.harvest.findMany({
        include: {
          product: {
            include: { category: true, variety: true }
          },
          site: true
        },
        orderBy: { harvestDate: 'desc' }
      });
      res.json({ success: true, data: history });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

const router = Router();
const controller = new HarvestController();

router.post('/', controller.create);
router.get('/forecasts', controller.getForecasts);
router.get('/history', controller.getHistory);

export default router;
