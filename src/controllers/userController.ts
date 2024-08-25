import { Request, Response } from 'express';
import User from '../models/User';
import { hash, compare } from '../utils/salt';
import { generateToken } from '../utils/token';

export const createUser = async (req: Request, res: Response) => {
    try {
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
            res.status(400).json({ error: 'An unexpected error occurred.' });
        }
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(400).json({ error: 'Invalid request: user ID is missing' });
        }

        const user = await User.findById(userId).select('-password -salt');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(500).json({ error: 'An unexpected error occured.'});
        }
    }
}

export const changePassword = async (req: Request, res: Response) => {
    try{
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json( { error: 'Invalid Request: user ID is missing' });
        }

        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required'});
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json( { error: 'User not found' });
        }

        const isMatch = compare(currentPassword, { salt: user.salt, hashedPassword: user.password });
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        const { salt, hashedPassword } = hash(newPassword);

        user.password = hashedPassword;
        user.salt = salt;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred.' });
        }
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(400).json({ error: 'Invalid request: user ID is missing '});
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found'})
        }

        await user.deleteOne();

        res.status(200).json({ message: 'User deleted successfully'})
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occured.'});
        }
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = compare(password, { salt: user.salt, hashedPassword: user.password });
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = generateToken({ id: user._id, email: user.email, role: user.role });

        res.status(200).json({ token });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unexpected error occured.'});
        }
    }
};