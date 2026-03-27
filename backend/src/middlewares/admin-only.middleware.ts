import type { Request, Response, NextFunction } from 'express'


export function adminOnly(req: Request, res: Response, next: NextFunction) {
    if(!req.user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    if(req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admins only' })
    }
    return next()

}