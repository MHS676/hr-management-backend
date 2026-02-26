import { Router } from 'express';
import attendanceController from '../controllers/attendance.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router: Router = Router();

router.use(authMiddleware.authenticate.bind(authMiddleware));

router.get('/attendance', attendanceController.getMonthlyReport.bind(attendanceController));

export default router;
