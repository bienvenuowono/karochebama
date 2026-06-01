import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Le nom de la catégorie doit comporter au moins 2 caractères.').max(100),
    slug: z
      .string()
      .min(2, 'Le slug doit comporter au moins 2 caractères.')
      .regex(/^[a-z0-9-]+$/, 'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets.'),
    description: z.string().max(500).optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid('Identifiant de catégorie invalide.'),
  }),
  body: z.object({
    name: z.string().min(2, 'Le nom doit comporter au moins 2 caractères.').optional(),
    slug: z
      .string()
      .min(2, 'Le slug doit comporter au moins 2 caractères.')
      .regex(/^[a-z0-9-]+$/, 'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets.')
      .optional(),
    description: z.string().max(500).optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'Au moins un champ de catégorie doit être fourni pour la mise à jour.',
  }),
});

export const getCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid('Identifiant de catégorie invalide.'),
  }),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Le nom du produit doit comporter au moins 3 caractères.').max(100),
    price: z.preprocess((val) => Number(val), z.number().positive('Le prix doit être un nombre positif.')),
    sku: z.string().max(50).optional(),
    description: z.string().max(2000).optional(),
    categoryId: z.string().uuid('Identifiant de catégorie associé invalide.'),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Identifiant de produit invalide.'),
  }),
  body: z.object({
    name: z.string().min(3).max(100).optional(),
    price: z.preprocess((val) => (val === undefined ? undefined : Number(val)), z.number().positive('Le prix doit être un nombre positif.').optional()),
    sku: z.string().max(50).optional(),
    description: z.string().max(2000).optional(),
    categoryId: z.string().uuid('Identifiant de catégorie associé invalide.').optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'Au moins un champ de produit doit être fourni pour la mise à jour.',
  }),
});

export const getProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Identifiant de produit invalide.'),
  }),
});
