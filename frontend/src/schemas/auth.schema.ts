import { z } from 'zod'

export const authSchema = z.object({
    email: z.email('Email inválido, por favor insira um email válido').trim().toLowerCase(),
    password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres').max(100, 'A senha deve conter no máximo 100 caracteres'),
})

export type AuthSchema = z.infer<typeof authSchema>