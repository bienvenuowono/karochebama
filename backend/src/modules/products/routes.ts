import { Router } from 'express';
import { ProductController } from './controller';
import { requireAuth } from '../../core/middlewares/auth.middleware';
import { validateRequest } from '../../core/middlewares/validation.middleware';
import { upload } from '../../core/middlewares/upload.middleware';
import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
  createCategorySchema,
  updateCategorySchema,
  getCategorySchema,
} from './validation';

const router = Router();
const controller = new ProductController();

// Appliquer requireAuth sur toutes les routes de ce module
router.use(requireAuth);

// ==========================================
// ROUTES DES CATÉGORIES
// ==========================================
router.get('/categories', controller.getCategories);
router.get('/categories/:id', validateRequest(getCategorySchema), controller.getCategoryById);
router.post('/categories', validateRequest(createCategorySchema), controller.createCategory);
router.put('/categories/:id', validateRequest(updateCategorySchema), controller.updateCategory);
router.delete('/categories/:id', validateRequest(getCategorySchema), controller.deleteCategory);

// ==========================================
// ROUTES DES PRODUITS
// ==========================================
router.get('/', controller.getProducts);
router.get('/:id', validateRequest(getProductSchema), controller.getProductById);

// Création de produit avec téléversement d'image
router.post(
  '/',
  upload.single('image'),
  validateRequest(createProductSchema),
  controller.createProduct
);

// Mise à jour de produit avec téléversement d'image
router.put(
  '/:id',
  upload.single('image'),
  validateRequest(updateProductSchema),
  controller.updateProduct
);

router.delete('/:id', validateRequest(getProductSchema), controller.deleteProduct);

export default router;
