import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index';
import dotenv from 'dotenv';
dotenv.config();

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
                password: "Password@1"
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('name', 'Jane Doe');
        expect(res.body).toHaveProperty('email', 'janedoe@example.com');
        expect(res.body).not.toHaveProperty('password');
        expect(res.body).not.toHaveProperty('salt');
    });

    it('should login the user', async () => {
        const res = await request(app)
        .post('/api/users/login')
        .send({
            email: "janedoe@example.com",
            password: "Password@1"
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).not.toHaveProperty('password');
        expect(res.body).not.toHaveProperty('salt');
    });

    it('should return 400 for invalid credentials', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: "janedoe@example.com",
                password: "WrongPassword"
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should return 404 for a non-existent user', async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: "nonexistent@example.com",
                password: "Password@1"
            });

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error', 'User not found');
    });
});