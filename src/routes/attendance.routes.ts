import { Router } from 'express';
import attendanceController from '../controllers/attendance.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router: Router = Router();

// all attendance routes are protected
router.use(authMiddleware.authenticate.bind(authMiddleware));

// GET /attendance — list with filters
router.get('/', attendanceController.getAll.bind(attendanceController));

// GET /attendance/:id — single record
router.get('/:id', attendanceController.getById.bind(attendanceController));

// POST /attendance — create or upsert
router.post('/', attendanceController.create.bind(attendanceController));

// PUT /attendance/:id — update
router.put('/:id', attendanceController.update.bind(attendanceController));

// DELETE /attendance/:id — delete
router.delete('/:id', attendanceController.delete.bind(attendanceController));

export default router;
