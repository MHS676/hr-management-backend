import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import { JwtPayload, ApiResponse } from '../types';

class AuthMiddleware {

    public authenticate(req: Request, res: Response, next: NextFunction): void {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const response: ApiResponse<null> = {
                success: false,
                message: 'Access denied. No token provided.',
            };
            res.status(401).json(response);
            return;
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
            (req as any).user = decoded;
            next();
        } catch (error) {
            const response: ApiResponse<null> = {
                success: false,
                message: 'Invalid or expired token.',
            };
            res.status(401).json(response);
            return;
        }
    }
}

export default new AuthMiddleware();
