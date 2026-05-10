import { z } from 'zod';

export const activitySchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  imageUrl: z.string().optional().nullable(),
  date: z.string().datetime().optional().nullable(),
  status: z.string().default("PUBLISHED"),
});

export type ActivityInput = z.infer<typeof activitySchema>;
