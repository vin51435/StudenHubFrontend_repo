import { z } from 'zod';

export const communityCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Max 50 characters'),
  description: z.string().max(500, 'Max 500 characters').optional(),
  makePrivate: z.boolean().optional(),
  showOnProfile: z.boolean().optional(),
});

export type CommunityCreateSchema = z.infer<typeof communityCreateSchema>;
