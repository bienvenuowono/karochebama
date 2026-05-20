import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Définir le dossier d'upload racine
const UPLOAD_ROOT = path.join(process.cwd(), 'uploads');

/**
 * Assure que le répertoire ciblé existe
 */
export function ensureDirExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// S'assurer que le répertoire de base existe
ensureDirExists(UPLOAD_ROOT);

/**
 * Configuration générique du stockage Multer
 */
const createStorage = (subDir: string = '') => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const destPath = subDir ? path.join(UPLOAD_ROOT, subDir) : UPLOAD_ROOT;
      ensureDirExists(destPath);
      cb(null, destPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const cleanName = path.basename(file.originalname).replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
      const ext = path.extname(cleanName).toLowerCase();
      const baseName = path.basename(cleanName, ext);
      cb(null, `${file.fieldname}-${baseName}-${uniqueSuffix}${ext}`);
    }
  });
};

/**
 * Filtre générique de fichiers par types MIME / Extensions
 */
const createFileFilter = (allowedTypes: RegExp, errorMessage: string) => {
  return (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error(errorMessage));
    }
  };
};

// --- Configurations Prédéfinies ---

// 1. Upload d'images uniquement (max 5 Mo)
export const uploadImages = multer({
  storage: createStorage('products'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: createFileFilter(
    /jpeg|jpg|png|webp|gif/,
    'Uniquement les images au format JPEG, JPG, PNG, GIF ou WEBP sont autorisées.'
  )
});

// 2. Upload de médias mixtes : Images & Vidéos (max 10 Mo)
export const uploadMedia = multer({
  storage: createStorage('media'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: createFileFilter(
    /jpeg|jpg|png|webp|gif|mp4|mov|avi|wmv/,
    'Uniquement les images (JPEG, JPG, PNG, WEBP, GIF) et vidéos (MP4, MOV, AVI, WMV) sont autorisées.'
  )
});

/**
 * Supprime de manière sécurisée et asynchrone un fichier du serveur local
 * @param relativeOrAbsolutePath Chemin absolu ou relatif vers le fichier
 */
export async function deleteLocalFile(relativeOrAbsolutePath: string): Promise<boolean> {
  if (!relativeOrAbsolutePath) return false;
  
  const absolutePath = path.isAbsolute(relativeOrAbsolutePath)
    ? relativeOrAbsolutePath
    : path.join(process.cwd(), relativeOrAbsolutePath);

  // Sécurité supplémentaire : s'assurer qu'on ne sort pas du dossier de l'application
  if (!absolutePath.startsWith(process.cwd())) {
    console.warn(`[UPLOAD SECURITY] Tentative de suppression d'un fichier hors workspace ignorée : ${absolutePath}`);
    return false;
  }

  return new Promise((resolve) => {
    fs.unlink(absolutePath, (err) => {
      if (err) {
        // Si le fichier n'existe déjà pas, on considère que c'est un succès (déjà nettoyé)
        if (err.code === 'ENOENT') {
          resolve(true);
        } else {
          console.error(`[UPLOAD ERROR] Échec de la suppression du fichier local ${absolutePath} :`, err);
          resolve(false);
        }
      } else {
        resolve(true);
      }
    });
  });
}
