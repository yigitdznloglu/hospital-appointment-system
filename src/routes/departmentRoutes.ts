import { Router } from 'express';
import {
         createDepartment,
         getDepartments,
         getDepartmentById,
         updateDepartment,
         deleteDepartment
} from '../controllers/departmentController';
import { authenticate } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/roleMiddleware';

const router = Router();

router.post('/', authenticate, authorizeRole('admin'), createDepartment);
router.get('/', authenticate, getDepartments);
router.get('/:id', authenticate, getDepartmentById);
router.put('/:id', authenticate, authorizeRole('admin'), updateDepartment);
router.delete('/:id', authenticate, authorizeRole('admin'), deleteDepartment);

export default router;