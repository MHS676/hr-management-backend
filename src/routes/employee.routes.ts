import { Router } from 'express';
import employeeController from '../controllers/employee.controller';
import authMiddleware from '../middlewares/auth.middleware';
import upload from '../config/multer';

const router: Router = Router();

router.use(authMiddleware.authenticate.bind(authMiddleware));

router.get('/', employeeController.getAll.bind(employeeController));

router.get('/:id', employeeController.getById.bind(employeeController));

router.post('/', upload.single('photo'), employeeController.create.bind(employeeController));

router.put('/:id', upload.single('photo'), employeeController.update.bind(employeeController));

router.delete('/:id', employeeController.delete.bind(employeeController));

export default router;
