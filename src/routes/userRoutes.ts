import express, { Request, Response } from 'express';
import User from '../models/User';
import { hash, compare } from '../utils/salt';

const router = express.Router();

// Create a new user
router.post('/', async (req: Request, res: Response) => {
    try{
        const { name, email, role, password } = req.body;
        const { salt, hashedPassword } = hash(password);

        const newUser = new User({
            name,
            email,
            role,
            password: hashedPassword,
            salt,
        });

        await newUser.save();

        const { password: _, salt: __, ...userWithoutSensitiveData } = newUser.toObject();
        res.status(201).json(userWithoutSensitiveData);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: 'An unexpected error occured.'})
        }
    }
});

export default router;