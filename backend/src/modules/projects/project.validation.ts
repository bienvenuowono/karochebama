import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  imageUrl: z.string().optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  status: z.string().default("ONGOING"),
});

export type ProjectInput = z.infer<typeof projectSchema>;
