import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

export const generateToken = (payload: object, expiresIn: string | number = '1h'): string => {
    return jwt.sign(payload, secretKey, {expiresIn});
}

export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        throw new Error('Invalid token');
    }
};