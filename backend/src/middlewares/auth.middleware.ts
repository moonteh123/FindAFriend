
import type{ Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

//middleware para autenticação de rotas

type jwtPayload = {
    sub: string
    role?: 'user' | 'admin'
    name?: string

    userId?: number
    userRole?: 'user' | 'admin'
    userName?: string

}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number
                role: 'user' | 'admin'
                name?: string
            }
        }
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization
        if(!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing '})
        }

        const [scheme, token] = authHeader.split(' ')

        if(scheme !== 'Bearer' || !token) {
            return res.status(401).json({ message: 'Invalid authorization header format' })
        }
        if(!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'JWT secret not configured' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwtPayload

        //suporta padrao sub ou user
        const id = decoded.sub ? Number(decoded.sub) : decoded.userId
        const role = decoded.role ?? decoded.userRole
        const name = decoded.name ?? decoded.userName

        if(!id || !role) {
            return res.status(401).json({ message: 'Invalid token payload' })
        } 
        req.user = {
            id,
            role,
            name
        }
        next()
    } catch (err) {
        console.error('Error in auth middleware:', err)
        return res.status(401).json({ message: 'Invalid or expired token' })
    }
}
