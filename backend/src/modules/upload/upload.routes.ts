import { Router } from 'express';
import uploadController from './upload.controller';
import { uploadMedia } from '../../core/upload';
import { authenticate, authorize } from '../../core/auth.middleware';

const router = Router();

// Route for single file upload - REQUIRE AUTHENTICATION & ADMIN ROLE
router.post('/', authenticate, authorize(['ADMIN']), uploadMedia.single('image'), uploadController.uploadFile);

export default router;
