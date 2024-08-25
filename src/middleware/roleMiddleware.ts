import { Request, Response, NextFunction  } from 'express';

export const authorizeRole = (requiredRole: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role;
        if (!userRole) {
            return res.status(401).json({ error: 'Unauthorized access: no role found' });
        }

        if (userRole !== requiredRole) {
            return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
        }

        next();
    };
};