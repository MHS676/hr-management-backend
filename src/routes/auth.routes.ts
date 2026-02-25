import { Router } from 'express';
import authController from '../controllers/auth.controller';

const router: Router = Router();

// POST /auth/login — HR user login
router.post('/login', authController.login.bind(authController));

export default router;
