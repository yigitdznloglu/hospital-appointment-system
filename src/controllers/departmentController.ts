import { Request, Response } from 'express';
import Department from '../models/Department';

export const createDepartment = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Department name is required'});
        }

        const existingDepartment = await Department.findOne({ name });
        if (existingDepartment) {
            return res.status(400).json({ error: 'Department already exists' });
        }

        const newDepartment = new Department({ name });
        await newDepartment.save()

        res.status(201).json({ message: 'Department created successfully', department: newDepartment });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: `${error.message}` });
        } else {
            res.status(500).json({ error: 'An unexpected error occured.' });
        }
    }
}

export const getDepartments = async (req: Request, res: Response) => {
    try{
        const departments= await Department.find();
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch departments' });
    }
};

export const getDepartmentById = async (req: Request, res: Response) => {
    try{
        const department = await Department.findById(req.params.id);
        if(!department) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.status(200).json(department);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: `${error.message}` });
        } else {
            res.status(500).json({ error: 'An unexpected error occured.' });
        }
    }
};

export const updateDepartment = async (req: Request, res:Response) => {
    try {
        const { name } = req.body;
        const department = await Department.findByIdAndUpdate(req.params.id, { name }, { new: true });
        if (!department) {
            return res.status(404).json({ error: 'Department not found' });
        }

        res.status(200).json({ message: 'Department updated successfully', department });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: `${error.message}` });
        } else {
            res.status(500).json({ error: 'An unexpected error occured.' });
        }
    }
};

export const deleteDepartment = async (req: Request, res: Response) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ error: 'Department not found' });
        }

        department.deleteOne();

        res.status(200).json({ message: 'Department deleted successfully'});
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: `${error.message}` });
        } else {
            res.status(500).json({ error: 'An unexpected error occured.' });
        }
    }
}