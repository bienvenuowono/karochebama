import { z } from 'zod';

const projectStatusEnum = z.enum(['PLANNED', 'ACTIVE', 'COMPLETED', 'SUSPENDED'], {
  errorMap: () => ({ message: 'Statut de projet invalide' }),
});

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Le nom du projet doit contenir au moins 2 caractères'),
    description: z.string().optional(),
    status: projectStatusEnum.default('PLANNED'),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Le nom du projet doit contenir au moins 2 caractères').optional(),
    description: z.string().optional(),
    status: projectStatusEnum.optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'Au moins un champ doit être fourni pour la mise à jour',
  }),
});

export const getProjectSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID de projet invalide'),
  }),
});
