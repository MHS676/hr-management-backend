import { Request, Response, NextFunction } from 'express';
import attendanceService from '../services/attendance.service';
import {
    createAttendanceSchema,
    updateAttendanceSchema,
    reportQuerySchema,
} from '../validators/attendance.validator';
import {
    Attendance,
    AttendanceFilterQuery,
    AttendanceReportItem,
    CreateAttendancePayload,
    UpdateAttendancePayload,
    ReportQuery,
    ApiResponse,
} from '../types';

class AttendanceController {

    public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query: AttendanceFilterQuery = {
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
                employee_id: req.query.employee_id ? Number(req.query.employee_id) : undefined,
                from: req.query.from as string | undefined,
                to: req.query.to as string | undefined,
                date: req.query.date as string | undefined,
            };

            const { records, total } = await attendanceService.getAll(query);
            const page = query.page || 1;
            const limit = query.limit || 10;

            const response: ApiResponse<Attendance[]> = {
                success: true,
                message: 'Attendance records fetched successfully',
                data: records,
                meta: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };

            res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }

 
    public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: number = parseInt(req.params.id as string, 10);
            const record: Attendance = await attendanceService.getById(id);

            const response: ApiResponse<Attendance> = {
                success: true,
                message: 'Attendance record fetched successfully',
                data: record,
            };

            res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }


    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { error, value } = createAttendanceSchema.validate(req.body);
            if (error) {
                const response: ApiResponse<null> = {
                    success: false,
                    message: error.details[0].message,
                };
                res.status(400).json(response);
                return;
            }

            const payload: CreateAttendancePayload = value;
            const record: Attendance = await attendanceService.create(payload);

            const response: ApiResponse<Attendance> = {
                success: true,
                message: 'Attendance recorded successfully',
                data: record,
            };

            res.status(201).json(response);
        } catch (err) {
            next(err);
        }
    }

   
    public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: number = parseInt(req.params.id as string, 10);

            const { error, value } = updateAttendanceSchema.validate(req.body);
            if (error) {
                const response: ApiResponse<null> = {
                    success: false,
                    message: error.details[0].message,
                };
                res.status(400).json(response);
                return;
            }

            const payload: UpdateAttendancePayload = value;
            const record: Attendance = await attendanceService.update(id, payload);

            const response: ApiResponse<Attendance> = {
                success: true,
                message: 'Attendance record updated successfully',
                data: record,
            };

            res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }

 
    public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: number = parseInt(req.params.id as string, 10);
            await attendanceService.delete(id);

            const response: ApiResponse<null> = {
                success: true,
                message: 'Attendance record deleted successfully',
            };

            res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }

   
    public async getMonthlyReport(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { error, value } = reportQuerySchema.validate(req.query);
            if (error) {
                const response: ApiResponse<null> = {
                    success: false,
                    message: error.details[0].message,
                };
                res.status(400).json(response);
                return;
            }

            const query: ReportQuery = value;
            const report: AttendanceReportItem[] = await attendanceService.getMonthlyReport(query);

            const response: ApiResponse<AttendanceReportItem[]> = {
                success: true,
                message: 'Monthly attendance report generated successfully',
                data: report,
            };

            res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }
}

export default new AttendanceController();
