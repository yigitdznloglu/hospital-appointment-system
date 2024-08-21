import express from 'express';
import { createUser } from '../controllers/userController';
// import { authenticate } from '../middleware/authMiddleware';


const router = express.Router();

router.post('/', createUser);

export default router;