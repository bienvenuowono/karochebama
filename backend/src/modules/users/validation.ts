import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'Le prénom doit contenir au moins 1 caractère.').optional(),
    lastName: z.string().min(1, 'Le nom doit contenir au moins 1 caractère.').optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'Au moins un champ (prénom ou nom) doit être fourni pour la mise à jour.',
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Format d\'email invalide'),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
    lastName: z.string().min(2, 'Le nom de famille doit contenir au moins 2 caractères'),
    role: z.enum(['ADMIN', 'USER'], {
      errorMap: () => ({ message: "Le rôle doit être 'ADMIN' ou 'USER'" }),
    }),
  }),
});

