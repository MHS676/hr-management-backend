import { Router } from 'express';
import employeeController from '../controllers/employee.controller';
import authMiddleware from '../middlewares/auth.middleware';
import upload from '../config/multer';

const router: Router = Router();

// all employee routes are protected
router.use(authMiddleware.authenticate.bind(authMiddleware));

// GET /employees — list all (with optional pagination & search)
router.get('/', employeeController.getAll.bind(employeeController));

// GET /employees/:id — get single employee
router.get('/:id', employeeController.getById.bind(employeeController));

// POST /employees — create (multipart for photo)
router.post('/', upload.single('photo'), employeeController.create.bind(employeeController));

// PUT /employees/:id — update (also allows photo replacement)
router.put('/:id', upload.single('photo'), employeeController.update.bind(employeeController));

// DELETE /employees/:id — soft-delete an employee
router.delete('/:id', employeeController.delete.bind(employeeController));

export default router;
