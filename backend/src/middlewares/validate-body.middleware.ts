import z from 'zod';
import type { Request, Response, NextFunction } from 'express';

export const validateBody = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if(!result.success) {
            return res.status(400).json({ message: 'Invalid request body', issues: result.error.issues });
        }
        req.body = result.data; // sanitized and validated data 
        next();
    }

};