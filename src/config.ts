import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

if (!process.env.NODE_ENV) {
    throw new Error('PORT is not defined in environment variables');
}

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined in environment variables');
}

if (!process.env.PORT) {
    throw new Error('PORT is not defined in environment variables');
}

export const NODE_ENV: string = process.env.NODE_ENV;
export const JWT_SECRET: string = process.env.JWT_SECRET;
export const MONGO_URI: string = process.env.MONGO_URI;
export const PORT: number = parseInt(process.env.PORT, 10);
