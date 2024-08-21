import express from 'express';
import { createUser, loginUser } from '../controllers/userController';
// import { authenticate } from '../middleware/authMiddleware';


const router = express.Router();

router.post('/', createUser);
router.post('/login', loginUser);

export default router;