import request from 'supertest';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set up a test server
const app = express();

// Middleware
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hospital Appointment System API');
});

// Testing DB connection
beforeAll(async () => {
    const mongoURI = process.env.MONGO_URI;
    if (mongoURI) {
        await mongoose.connect(mongoURI);
    }
});

afterAll(async () => {
    await mongoose.connection.close();
})

describe('GET /', () => {
    it('should return a message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Hospital Appointment System API');
    });
});