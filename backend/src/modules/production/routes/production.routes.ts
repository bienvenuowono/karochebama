import { Request, Response, Router } from 'express';
import prisma from '../../../config/prisma';
import { authenticate, authorize } from '../../../core/auth.middleware';

export class GeographicZoneController {
  getAll = async (req: Request, res: Response) => {
    try {
      const items = await prisma.geographicZone.findMany({
        include: { cultureSites: true }
      });
      res.json({ success: true, data: items });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const item = await prisma.geographicZone.create({ data: { name } });
      res.status(201).json({ success: true, data: item });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.geographicZone.delete({ where: { id: parseInt(id as string) } });
      res.json({ success: true, message: 'Zone supprimée' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}

export class CultureSiteController {
  getAll = async (req: Request, res: Response) => {
    try {
      const items = await prisma.cultureSite.findMany({
        include: { geographicZone: true }
      });
      res.json({ success: true, data: items });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const { name, geographicZoneId } = req.body;
      const item = await prisma.cultureSite.create({
        data: { name, geographicZoneId: parseInt(geographicZoneId) }
      });
      res.status(201).json({ success: true, data: item });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.cultureSite.delete({ where: { id: parseInt(id as string) } });
      res.json({ success: true, message: 'Site supprimé' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}

const router = Router();
const zoneController = new GeographicZoneController();
const siteController = new CultureSiteController();

// Routes pour Zones Géographiques
router.get('/zones', zoneController.getAll);
router.post('/zones', authenticate, authorize(['ADMIN']), zoneController.create);
router.delete('/zones/:id', authenticate, authorize(['ADMIN']), zoneController.delete);

// Routes pour Sites de Culture
router.get('/sites', siteController.getAll);
router.post('/sites', authenticate, authorize(['ADMIN']), siteController.create);
router.delete('/sites/:id', authenticate, authorize(['ADMIN']), siteController.delete);

export default router;
