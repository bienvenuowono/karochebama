import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { BadRequestError } from '../errors/appError';

// Dossier d'upload local temporaire ou permanent pour le dev
const UPLOAD_DIR = './uploads';

// S'assurer que le dossier existe
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configuration du stockage disque local
const storage = multer.diskStorage({
  destination: (_req: Request, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req: Request, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

// Validation des extensions et des types MIME
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestError(`Type de fichier non autorisé (${file.mimetype}). Types acceptés : JPEG, PNG, WEBP et PDF.`));
  }
};

// Configuration globale du middleware Multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5 Mo par fichier
  },
});

export default upload;
