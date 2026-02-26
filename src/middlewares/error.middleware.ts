import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

class ErrorMiddleware {

    public handleError(err: Error, _req: Request, res: Response, _next: NextFunction): void {
        console.error('Unhandled Error:', err.message);

        const statusCode = (err as any).statusCode || 500;
        const response: ApiResponse<null> = {
            success: false,
            message: err.message || 'Internal server error',
        };
        res.status(statusCode).json(response);
    }
}

export default new ErrorMiddleware();
