import express from 'express';
import { createUser, deleteUser, loginUser } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';


const router = express.Router();

router.post('/', createUser);
router.delete('/:id', authenticate, deleteUser);
router.post('/login', loginUser);

export default router;