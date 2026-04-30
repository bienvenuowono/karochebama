import { Request, Response } from 'express';
import prisma from '../../../config/prisma';
import { z } from 'zod';

export class ProductController {
  create = async (req: Request, res: Response) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      // Extraction des chemins de fichiers
      const imageUrl = files['image'] ? `/uploads/products/${files['image'][0].filename}` : null;
      const gallery = files['gallery'] ? files['gallery'].map(f => `/uploads/products/${f.filename}`) : [];

      // Données textuelles (FormData envoie tout en string)
      const data = req.body;

      const product = await prisma.product.create({
        data: {
          name: data.name,
          description: data.description,
          price: parseFloat(data.price),
          imageUrl: imageUrl,
          gallery: gallery,
          typeId: parseInt(data.typeId),
          categoryId: parseInt(data.categoryId),
          varietyId: parseInt(data.varietyId),
          sowingDate: data.sowingDate ? new Date(data.sowingDate) : null,
          maturityDate: data.maturityDate ? new Date(data.maturityDate) : null,
          quantityKg: parseFloat(data.quantityKg) || 0,
          quantityTonne: parseFloat(data.quantityTonne) || (parseFloat(data.quantityKg) / 1000) || 0,
          priceKg: parseFloat(data.priceKg) || 0,
          priceTonne: parseFloat(data.priceTonne) || (parseFloat(data.priceKg) * 1000) || 0,
          status: 'en_production',
          sites: {
            create: (JSON.parse(data.siteIds || '[]')).map((id: number) => ({
              site: { connect: { id } }
            }))
          }
        }
      });

      res.status(201).json({ success: true, data: product });
    } catch (error: any) {
      console.error('Create product error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const items = await prisma.product.findMany({
        include: {
          type: true,
          category: true,
          variety: true,
          sites: { include: { site: { include: { geographicZone: true } } } }
        }
      });
      res.json({ success: true, data: items });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getOne = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const item = await prisma.product.findUnique({
        where: { id: parseInt(id) },
        include: { type: true, category: true, variety: true, sites: true }
      });
      res.json({ success: true, data: item });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    // Logique d'update similaire avec gestion des nouveaux fichiers
    res.status(501).json({ message: "Not implemented yet with file support" });
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.product.delete({ where: { id: parseInt(id) } });
      res.json({ success: true, message: 'Produit supprimé' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
