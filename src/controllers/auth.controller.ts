import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { loginSchema } from '../validators/auth.validator';
import { LoginPayload, ApiResponse } from '../types';

class AuthController {
 
    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { error, value } = loginSchema.validate(req.body);
            if (error) {
                const response: ApiResponse<null> = {
                    success: false,
                    message: error.details[0].message,
                };
                res.status(400).json(response);
                return;
            }

            const payload: LoginPayload = value;
            const token: string = await authService.login(payload);

            const response: ApiResponse<{ token: string }> = {
                success: true,
                message: 'Login successful',
                data: { token },
            };

            res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthController();
