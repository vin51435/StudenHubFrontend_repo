import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300, 'Title must be at most 300 characters'),
  tags: z.array(z.string().min(1).max(30)).max(5, 'You can add up to 5 tags').optional(),
  files: z.array(z.any()).optional(),
  content: z.string().optional(),
});
