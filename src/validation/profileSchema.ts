import { z } from 'zod';

export const profileSchema = z.object({
  firstName: z.string().min(1, 'Enter your first name.'),
  lastName: z.string().min(1, 'Enter your last name.'),
  additionalInfo: z.object({
    institute: z.string().min(1, 'Select your institute.'),
    // userType: z.string().min(1, 'Select user type.'),
    gender: z.string().min(1, 'Select gender.'),
  }),
  bio: z.string().optional(),
  // interests: z.union([z.string(), z.array(z.string())]).optional(),
});

export type ProfileFormSchema = z.infer<typeof profileSchema>;
