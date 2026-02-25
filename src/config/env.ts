import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface EnvConfig {
    PORT: number;
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    UPLOAD_PATH: string;
}

const env: EnvConfig = {
    PORT: parseInt(process.env.PORT || '3000', 10),
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT || '5432', 10),
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
    DB_NAME: process.env.DB_NAME || 'hr_management',
    JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
    UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads',
};

export default env;
