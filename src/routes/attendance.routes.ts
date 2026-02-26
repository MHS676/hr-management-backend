import { Router } from 'express';
import attendanceController from '../controllers/attendance.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router: Router = Router();

router.use(authMiddleware.authenticate.bind(authMiddleware));

router.get('/', attendanceController.getAll.bind(attendanceController));

router.get('/:id', attendanceController.getById.bind(attendanceController));

router.post('/', attendanceController.create.bind(attendanceController));

router.put('/:id', attendanceController.update.bind(attendanceController));

router.delete('/:id', attendanceController.delete.bind(attendanceController));

export default router;
