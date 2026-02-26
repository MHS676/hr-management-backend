import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface EnvConfig {
    PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    UPLOAD_PATH: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    CLOUDINARY_FOLDER: string;
}

const env: EnvConfig = {
    PORT: parseInt(process.env.PORT || '3000', 10),
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/hr_management',
    JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
    UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
    CLOUDINARY_FOLDER: process.env.CLOUDINARY_FOLDER || 'Hr_management',
};

export default env;
