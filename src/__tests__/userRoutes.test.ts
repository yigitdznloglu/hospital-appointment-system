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
        expect(res.body).toHaveProperty('role');
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

    it('should return 401 when authentication token is provided', async () => {
        const res = await request(app)
            .get('/api/users/me')
        
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error', 'No token provided');
    })

    // Change password route
    it('should change a user password successfully', async () => {
        const res = await request(app)
            .put('/api/users/me')
            .send({
                currentPassword: "Password@1",
                newPassword: "Password@2"
            })
            .set('Authorization', `Bearer ${validToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Password changed successfully');

        // Attempt to log in w the new password
        const loginResWithNewPassword = await request(app)
            .post('/api/users/login')
            .send({
                email: "janedoe@example.com",
                password: "Password@2"
            });

        expect(loginResWithNewPassword.statusCode).toEqual(200);
        expect(loginResWithNewPassword.body).toHaveProperty('token');

        // Attempt to log in w the old password
        const loginResWithOldPassword = await request(app)
            .post('/api/users/login')
            .send({
                email: "janedoe@example.com",
                password: "Password@1"
            });
        
        expect(loginResWithOldPassword.statusCode).toEqual(400);
        expect(loginResWithOldPassword.body).toHaveProperty('error', 'Invalid credentials');
    });

    // Delete route
    it('should delete a user successfully', async () => {
        const deleteRes = await request(app)
            .delete('/api/users/me')
            .set('Authorization', `Bearer ${validToken}`);

        expect(deleteRes.statusCode).toEqual(200);
        expect(deleteRes.body).toHaveProperty('message', 'User deleted successfully');
    });

    it('should return 404 for a non-existent user', async () => {
        const deleteRes = await request(app)
            .delete('/api/users/me')
            .set('Authorization', `Bearer ${validToken}`);

        expect(deleteRes.statusCode).toEqual(404);
        expect(deleteRes.body).toHaveProperty('error', 'User not found');
    });

    it('should return 401 when no authentication token is provided', async () => {
        const deleteRes = await request(app)
            .delete(`/api/users/me`);

        expect(deleteRes.statusCode).toEqual(401);
        expect(deleteRes.body).toHaveProperty('error', 'No token provided');
    });

    it('should return 401 for an invalid or expired token', async () => {
        const invalidToken = "invalidtoken";

        const deleteRes = await request(app)
            .delete('/api/users/me')
            .set('Authorization', `Bearer ${invalidToken}`);

        expect(deleteRes.statusCode).toEqual(401);
        expect(deleteRes.body).toHaveProperty('error', 'Unauthorized access');
    });
});
