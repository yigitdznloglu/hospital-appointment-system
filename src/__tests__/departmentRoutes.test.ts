import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index';
import { MONGO_URI } from '../config';

describe('Department Routes', () => {
    let adminToken: string;
    let userToken: string;
    let departmentId: string;

    beforeAll(async () => {
        await mongoose.connect(MONGO_URI);

        // Create admin user
        await request(app)
            .post('/api/users')
            .send({
                name: "Admin User",
                email: "admin@example.com",
                role: "admin",
                password: "AdminPass@1"
            });

        
        const adminLoginRes = await request(app)
            .post('/api/users/login')
            .send({
                email: "admin@example.com",
                password: "AdminPass@1"
            });
        
        adminToken = adminLoginRes.body.token;

        // Create non-admin user
        await request(app)
            .post('/api/users')
            .send({
                name: "Non-admin User",
                email: "user@example.com",
                role: "patient",
                password: "UserPass@1"
            });

        const userLoginRes = await request(app)
            .post('/api/users/login')
            .send({
                email: "user@example.com",
                password: "UserPass@1"
            })
        
        userToken = userLoginRes.body.token;
    });

    afterAll(async () => {
        await mongoose.disconnect();

        await request(app)
            .delete('/api/users/me')
            .set('Authorization', `Bearer ${userToken}`);
        
        await request(app)
            .delete('/api/users/me')
            .set('Authorization', `Bearer ${adminToken}`);
    });

    // Create department route
    it('should create a new department successfully with admin role', async () => {
        const res = await request(app)
            .post('/api/departments')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Cardiology'
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Department created successfully');
        expect(res.body).toHaveProperty('department');
        expect(res.body.department).toHaveProperty('name', 'Cardiology');

        departmentId = res.body.department._id;
    });

    it('should return 403 when a non-admin user tries to create a department', async () => {
        const res = await request(app)
            .post('/api/departments')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: 'Neurology'
            });

        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('error', 'Forbidden: insufficient permissions');
    });

    it('should return 401 when no token is provided for creating a department', async () => {
        const res = await request(app)
            .post('/api/departments')
            .send({
                name: 'Orthopedics'
            });
        
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error', 'No token provided');
    });

    // Get all departments route
    it('should get all departments successfully with any role', async () => {
        const res = await request(app)
            .get('/api/departments')
            .set('Authorization', `Bearer ${userToken}`);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
    });

    // Get department by ID route
    it('should get a department by ID successfully with any role', async () => {
        const res = await request(app)
            .get(`/api/departments/${departmentId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', 'Cardiology');
    });

    it('should return 404 for a non-existent department ID', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .get(`/api/departments/${nonExistentId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error', 'Department not found');
    });

    // Update department route
    it('should update a department successfully with admin role', async () => {
        const res = await request(app)
            .put(`/api/departments/${departmentId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Neurology'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Department updated successfully');
        expect(res.body).toHaveProperty('department');
        expect(res.body.department).toHaveProperty('name', 'Neurology');
    });

    it('should return 403 when a regular user tries to update a department', async () => {
        const res = await request(app)
            .put(`/api/departments/${departmentId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: 'Pediatrics'
            });
        
        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('error', 'Forbidden: insufficient permissions');
    });

    it('should return 401 when no token is provided for updating a department', async () => {
        const res = await request(app)
            .put(`/api/departments/${departmentId}`)
            .send({
                name: 'Orthopedics'
            });
        
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error', 'No token provided');
    });

    // Delete department route
    it('should delete a department successfully with admin role', async () => {
        const res = await request(app)
            .delete(`/api/departments/${departmentId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Department deleted successfully');
    });

    it('should return 403 when a non-admin user tries to delete a department', async () => {
        const res = await request(app)
            .delete(`/api/departments/${departmentId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(403);
        expect(res.body).toHaveProperty('error', 'Forbidden: insufficient permissions');
    });

    it('should return 401 when no token is provided for deleting a department', async () => {
        const res = await request(app)
            .delete(`/api/departments/${departmentId}`)
        
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error', 'No token provided');
    });

    it('should return 404 for a non-existent department ID during deletion', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .delete(`/api/departments/${nonExistentId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error', 'Department not found');
    });
});