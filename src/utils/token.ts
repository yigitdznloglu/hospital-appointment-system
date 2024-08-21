import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

export const generateToken = (payload: object, expiresIn: string | number = '1h'): string => {
    return jwt.sign(payload, JWT_SECRET, {expiresIn});
}

export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};