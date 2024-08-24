import express from 'express';
import { createUser, getUser, changePassword, deleteUser, loginUser } from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';


const router = express.Router();

router.post('/', createUser);
router.post('/login', loginUser);
router.get('/me', authenticate, getUser);
router.put('/me', authenticate, changePassword);
router.delete('/me', authenticate, deleteUser);


export default router;