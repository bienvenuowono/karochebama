import { z } from 'zod';

export const commercialSchema = z.object({
  type: z.enum(['COMMERCIAL', 'DEMARCHEUR']),
  agentName: z.string().min(2),
  clientName: z.string().min(2),
  contact: z.string().optional().nullable(),
  product: z.string().min(2),
  quantity: z.string().min(1),
  location: z.string().min(2),
  comment: z.string().optional().nullable(),
});

export type CommercialInput = z.infer<typeof commercialSchema>;
