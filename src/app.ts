import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

import authRoutes from './routes/auth.routes';
import employeeRoutes from './routes/employee.routes';
import attendanceRoutes from './routes/attendance.routes';
import reportRoutes from './routes/report.routes';
import errorMiddleware from './middlewares/error.middleware';
import env from './config/env';

class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }


    private initializeMiddlewares(): void {
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        const uploadsPath: string = path.resolve(__dirname, '../', env.UPLOAD_PATH);
        this.app.use('/uploads', express.static(uploadsPath));
    }

 
    private initializeRoutes(): void {
        this.app.get('/health', (_req: Request, res: Response) => {
            res.status(200).json({ success: true, message: 'Server is running' });
        });

        this.app.use('/auth', authRoutes);
        this.app.use('/employees', employeeRoutes);
        this.app.use('/attendance', attendanceRoutes);
        this.app.use('/reports', reportRoutes);

        this.app.use((_req: Request, res: Response) => {
            res.status(404).json({ success: false, message: 'Route not found' });
        });
    }


    private initializeErrorHandling(): void {
        this.app.use(errorMiddleware.handleError.bind(errorMiddleware));
    }
}

export default new App().app;
