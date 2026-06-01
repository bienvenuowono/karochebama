import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Format d\'email invalide'),
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
    lastName: z.string().min(2, 'Le nom de famille doit contenir au moins 2 caractères'),
    organizationName: z.string().min(2, 'Le nom de l\'entreprise doit contenir au moins 2 caractères'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Format d\'email invalide'),
    password: z.string().min(1, 'Le mot de passe est requis'),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
