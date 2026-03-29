import { z } from 'zod';


export const petSchema = z.object({
    name : z.string().min(2, 'Name must be at least 2 characters long').max(80, 'Name must be at most 80 characters long').trim(),
    species: z.enum(['dog', 'cat'], 'Species must be either "dog" or "cat"'),
    breed: z.string().min(2, 'Breed must be at least 2 characters long').max(80, 'Breed must be at most 80 characters long').trim(),
    age: z.coerce.number().int().min(0, 'Age must be a non-negative integer').max(50, 'Age must be at most 50 years old'),
    size: z.enum(['P', 'M', 'G'], 'Size must be "P", "M", or "G"').transform(size => size.toUpperCase() as 'P' | 'M' | 'G'),
    description: z.string().min(10, 'Description must be at least 10 characters long').max(500, 'Description must be at most 500 characters long').trim(),
    image_url: z.url('Invalid URL format for image'),

});

export type PetInput = z.infer<typeof petSchema>;