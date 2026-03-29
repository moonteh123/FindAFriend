import { z } from 'zod';

export const authSchema = z.object({
    email: z.email('Invalid email address').trim().toLowerCase(),
    password: z.string().min(6, 'Password must be at least 6 characters long').max(100, 'Password must be at most 100 characters long'),
    name: z.string().min(2, 'Name must be at least 3 characters long').trim().max(80, 'Name must be at most 80 characters long'),
    
});

export const loginSchema = z.object({
    email: z.email('Invalid email address').trim().toLowerCase(),
    password: z.string().min(6, 'Password must be at least 6 characters long').max(100, 'Password must be at most 100 characters long'),
});

export type RegisterInput = z.infer<typeof authSchema>;
export type LoginInput = z.infer<typeof loginSchema>;