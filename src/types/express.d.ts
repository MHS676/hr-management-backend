import { JwtPayload } from './index';
import { Request } from 'express';

declare module 'express' {
    interface Request {
        user?: JwtPayload;
    }
}
