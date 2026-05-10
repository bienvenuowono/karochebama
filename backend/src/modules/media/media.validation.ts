import { z } from 'zod';

export const mediaSchema = z.object({
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  url: z.string().url(),
  type: z.string().default("IMAGE"),
});

export type MediaInput = z.infer<typeof mediaSchema>;
