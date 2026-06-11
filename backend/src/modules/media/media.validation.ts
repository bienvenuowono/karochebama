import { z } from 'zod';

export const mediaSchema = z.object({
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  url: z.string().min(1),
  type: z.string().default("IMAGE"),
});

export type MediaInput = z.infer<typeof mediaSchema>;
