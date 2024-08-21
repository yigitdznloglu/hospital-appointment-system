import { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
    interface Request {
        user?: JwtPayload | string; // Adjust this based on the shape of your decoded token
    }
}
