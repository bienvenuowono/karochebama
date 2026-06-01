import { z } from 'zod';

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
    content: z.string().min(10, 'Le contenu doit contenir au moins 10 caractères'),
    publishedAt: z.string().datetime().optional(),
  }),
});

export const updateBlogSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    content: z.string().min(10).optional(),
    publishedAt: z.string().datetime().nullable().optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'Au moins un champ doit être fourni pour la mise à jour',
  }),
});

export const getBlogSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID de blog invalide'),
  }),
});
