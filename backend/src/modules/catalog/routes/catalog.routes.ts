import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import orderRoutes from './order.routes';
import categoryRoutes from './category.routes';
import { uploadImages } from '../../../core/upload';

import { authenticate, authorize } from '../../../core/auth.middleware';

const router = Router();
const controller = new ProductController();

// Routes Produits avec Upload
router.get('/products', controller.getAll);
router.get('/products/:id', controller.getOne);

// On accepte une image principale "image" et une galerie "gallery" (jusqu'à 5 photos)
router.post('/products', authenticate, authorize(['ADMIN']), uploadImages.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 5 }
]), controller.create);

router.patch('/products/:id', authenticate, authorize(['ADMIN']), uploadImages.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 5 }
]), controller.update);

router.delete('/products/:id', authenticate, authorize(['ADMIN']), controller.delete);

// Modules Ventes & Catégories
router.use('/orders', orderRoutes);
router.use('/categories', categoryRoutes);

export default router;
