import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index';

describe('POST /api/users', () => {
    beforeAll(async () => {
        const mongoURI = process.env.MONGO_URI;
        if(!mongoURI) {
            throw new Error('MONGO_URI is not defined in environment variables.');
        }
        await mongoose.connect(mongoURI);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    it('should create a new user', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                name: "Jane Doe",
                email: "janedoe@example.com",
                role: "doctor",
                password: "anothersecurepassword"
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('name', 'Jane Doe');
        expect(res.body).toHaveProperty('email', 'janedoe@example.com');
        expect(res.body).not.toHaveProperty('password');
        expect(res.body).not.toHaveProperty('salt');
    });
});