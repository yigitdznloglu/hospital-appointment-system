import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index';
import { MONGO_URI } from '../config';

describe('User Routes', () => {
    let validToken: string;
    const createdUserIds: string[] = [];  // Array to store created user IDs

    beforeAll(async () => {
        await mongoose.connect(MONGO_URI);
    });

    afterAll(async () => {
        // Delete all users created during the tests
        for (const userId of createdUserIds) {
            await request(app)
                .delete(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${validToken}`);
        }

        await mongoose.disconnect();
    });

    // Create user route
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

        // Store the created user ID for later deletion
        createdUserIds.push(res.body._id);
    });

    // Login route
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

        validToken = res.body.token;
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

    // Get user route
    it('should get a user successfully', async () => {
        const res = await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${validToken}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', 'Jane Doe');
        expect(res.body).toHaveProperty('email', 'janedoe@example.com');
        expect(res.body).not.toHaveProperty('password');
        expect(res.body).not.toHaveProperty('salt');
    });

    it('should return 401 for an invalid token', async () => {
        const invalidToken = "invalidtoken";

        const res = await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${invalidToken}`);

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error', 'Unauthorized access');
    });

    // Delete route
    it('should delete a user successfully', async () => {
        const createUserRes = await request(app)
            .post('/api/users')
            .send({
                name: "John Doe",
                email: "johndoe@example.com",
                role: "patient",
                password: "Password@1"
            });

        const userId = createUserRes.body._id;
        createdUserIds.push(userId);

        const deleteRes = await request(app)
            .delete(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${validToken}`);

        expect(deleteRes.statusCode).toEqual(200);
        expect(deleteRes.body).toHaveProperty('message', 'User deleted successfully');
    });

    it('should return 404 when trying to delete a non-existent user', async () => {
        const nonExistentUserId = new mongoose.Types.ObjectId();

        const deleteRes = await request(app)
            .delete(`/api/users/${nonExistentUserId}`)
            .set('Authorization', `Bearer ${validToken}`);

        expect(deleteRes.statusCode).toEqual(404);
        expect(deleteRes.body).toHaveProperty('error', 'User not found');
    });

    it('should return 400 for invalid user ID format', async () => {
        const invalidUserId = '12345';

        const deleteRes = await request(app)
            .delete(`/api/users/${invalidUserId}`)
            .set('Authorization', `Bearer ${validToken}`);

        expect(deleteRes.statusCode).toEqual(400);
        expect(deleteRes.body).toHaveProperty('error');
    });

    it('should return 401 when no authentication token is provided', async () => {
        const createUserRes = await request(app)
            .post('/api/users')
            .send({
                name: "John Doe",
                email: "johndoe@example.com",
                role: "patient",
                password: "Password@1"
            });

        const userId = createUserRes.body._id;
        createdUserIds.push(userId);

        const deleteRes = await request(app)
            .delete(`/api/users/${userId}`);

        expect(deleteRes.statusCode).toEqual(401);
        expect(deleteRes.body).toHaveProperty('error', 'No token provided');
    });

    it('should return 401 for an invalid or expired token', async () => {
        const invalidToken = "invalidtoken";

        const createUserRes = await request(app)
            .post('/api/users')
            .send({
                name: "John Doe",
                email: "johndoe@example.com",
                role: "patient",
                password: "Password@1"
            });

        const userId = createUserRes.body._id;
        createdUserIds.push(userId);

        const deleteRes = await request(app)
            .delete(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${invalidToken}`);

        expect(deleteRes.statusCode).toEqual(401);
        expect(deleteRes.body).toHaveProperty('error', 'Unauthorized access');
    });
});
