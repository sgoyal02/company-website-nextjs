import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, 'Name must be at least 1 char').max(100, 'Too long name'),
  //   email: z.email("Please enter a valid email address"),
  email: z.string().trim().min(1, 'Email is required').pipe(z.email('Please enter valid email')),
  message: z.string().min(20, 'Message must be at least 10 char').max(1000, 'Message is too long'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
