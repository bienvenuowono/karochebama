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

<<<<<<< HEAD
      const payload = {
        name: data.name || 'Produit sans nom',
        description: data.description || '',
        price: parseFloat(data.price) || 0,
        imageUrl: imageUrl,
        gallery: gallery,
        typeId: parseInt(data.typeId) || 1,
        categoryId: parseInt(data.categoryId) || 1,
        varietyId: (data.varietyId && data.varietyId !== 'undefined' && data.varietyId !== 'null') ? parseInt(data.varietyId) : null,
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
      };

      console.log("Tentative d'insertion du produit avec payload :", JSON.stringify(payload, null, 2));

      const product = await prisma.product.create({
        data: payload
=======
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
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
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
<<<<<<< HEAD
        include: { type: true, category: true, variety: true, sites: { include: { site: { include: { geographicZone: true } } } } }
=======
        include: { type: true, category: true, variety: true, sites: true }
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
      });
      res.json({ success: true, data: item });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
<<<<<<< HEAD
    try {
      const { id } = req.params;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const data = req.body;
      
      const existingProduct = await prisma.product.findUnique({ where: { id: parseInt(id) } });
      if (!existingProduct) {
        return res.status(404).json({ success: false, message: 'Produit non trouvé' });
      }

      // Extraction des chemins de fichiers
      const imageUrl = (files && files['image']) ? `/uploads/products/${files['image'][0].filename}` : existingProduct.imageUrl;
      const gallery = (files && files['gallery']) ? files['gallery'].map(f => `/uploads/products/${f.filename}`) : (existingProduct.gallery || []);

      const payload = {
        name: data.name || existingProduct.name,
        description: data.description !== undefined ? data.description : existingProduct.description,
        price: data.price !== undefined ? parseFloat(data.price) || 0 : existingProduct.price,
        imageUrl: imageUrl,
        gallery: gallery,
        typeId: data.typeId ? parseInt(data.typeId) || 1 : existingProduct.typeId,
        categoryId: data.categoryId ? parseInt(data.categoryId) || 1 : existingProduct.categoryId,
        varietyId: (data.varietyId !== undefined) ? 
           ((data.varietyId && data.varietyId !== 'undefined' && data.varietyId !== 'null') ? parseInt(data.varietyId) : null) 
           : existingProduct.varietyId,
        sowingDate: data.sowingDate !== undefined ? (data.sowingDate ? new Date(data.sowingDate) : null) : existingProduct.sowingDate,
        maturityDate: data.maturityDate !== undefined ? (data.maturityDate ? new Date(data.maturityDate) : null) : existingProduct.maturityDate,
        quantityKg: data.quantityKg !== undefined ? parseFloat(data.quantityKg) || 0 : existingProduct.quantityKg,
        quantityTonne: data.quantityTonne !== undefined ? parseFloat(data.quantityTonne) || (parseFloat(data.quantityKg) / 1000) || 0 : existingProduct.quantityTonne,
        priceKg: data.priceKg !== undefined ? parseFloat(data.priceKg) || 0 : existingProduct.priceKg,
        priceTonne: data.priceTonne !== undefined ? parseFloat(data.priceTonne) || (parseFloat(data.priceKg) * 1000) || 0 : existingProduct.priceTonne,
        status: data.status || existingProduct.status,
      };

      const product = await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
          ...payload,
          sites: data.siteIds ? {
            deleteMany: {},
            create: (JSON.parse(data.siteIds || '[]')).map((siteId: number) => ({
              site: { connect: { id: siteId } }
            }))
          } : undefined
        }
      });

      res.json({ success: true, data: product });
    } catch (error: any) {
      console.error('Update product error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
=======
    // Logique d'update similaire avec gestion des nouveaux fichiers
    res.status(501).json({ message: "Not implemented yet with file support" });
>>>>>>> a9f1ddf04f884b977c71915d684ba0681cbb35f1
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
