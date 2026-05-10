import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { ProductController } from '../controllers/product.controller';
import orderRoutes from './order.routes';
import categoryRoutes from './category.routes';

// Configuration de Multer pour le stockage local
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    if (extname) return cb(null, true);
    cb(new Error('Uniquement les images (jpeg, jpg, png, webp)'));
  }
});

const router = Router();
const controller = new ProductController();

// Routes Produits avec Upload
router.get('/products', controller.getAll);
router.get('/products/:id', controller.getOne);

// On accepte une image principale "image" et une galerie "gallery" (jusqu'à 5 photos)
router.post('/products', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 5 }
]), controller.create);

router.patch('/products/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 5 }
]), controller.update);

router.delete('/products/:id', controller.delete);

// Modules Ventes & Catégories
router.use('/orders', orderRoutes);
router.use('/categories', categoryRoutes);

export default router;
