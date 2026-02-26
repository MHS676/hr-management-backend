import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database';
import env from '../config/env';
import { HrUser, JwtPayload, LoginPayload } from '../types';

class AuthService {
 
    public async login(payload: LoginPayload): Promise<string> {
        const user: HrUser | undefined = await db('hr_users')
            .where({ email: payload.email })
            .first();

        if (!user) {
            throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
        }

        const isPasswordValid: boolean = await bcrypt.compare(payload.password, user.password_hash);

        if (!isPasswordValid) {
            throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
        }

        const tokenPayload: JwtPayload = {
            id: user.id,
            email: user.email,
            name: user.name,
        };

        const token: string = jwt.sign(tokenPayload, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN as string,
        } as jwt.SignOptions);

        return token;
    }
}

export default new AuthService();
