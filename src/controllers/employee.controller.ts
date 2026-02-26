import { Request, Response, NextFunction } from 'express';
import employeeService from '../services/employee.service';
import { uploadToCloudinary } from '../config/cloudinary';
import {
    createEmployeeSchema,
    updateEmployeeSchema,
} from '../validators/employee.validator';
import {
    CreateEmployeePayload,
    UpdateEmployeePayload,
    EmployeeFilterQuery,
    Employee,
    ApiResponse,
} from '../types';

class EmployeeController {
 
    public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query: EmployeeFilterQuery = {
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
                search: req.query.search as string | undefined,
            };

            const { employees, total } = await employeeService.getAll(query);
            const page = query.page || 1;
            const limit = query.limit || 10;

            const response: ApiResponse<Employee[]> = {
                success: true,
                message: 'Employees fetched successfully',
                data: employees,
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
            const employee: Employee = await employeeService.getById(id);

            const response: ApiResponse<Employee> = {
                success: true,
                message: 'Employee fetched successfully',
                data: employee,
            };

            res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }

    /**
     * POST /employees
     * Creates a new employee. Supports multipart form-data for photo upload.
     */
    public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { error, value } = createEmployeeSchema.validate(req.body);
            if (error) {
                const response: ApiResponse<null> = {
                    success: false,
                    message: error.details[0].message,
                };
                res.status(400).json(response);
                return;
            }

            const payload: CreateEmployeePayload = value;

            // if a photo was uploaded, upload to Cloudinary
            if (req.file) {
                const imageUrl = await uploadToCloudinary(req.file.buffer);
                payload.photo_path = imageUrl;
            }

            const employee: Employee = await employeeService.create(payload);

            const response: ApiResponse<Employee> = {
                success: true,
                message: 'Employee created successfully',
                data: employee,
            };

            res.status(201).json(response);
        } catch (err) {
            next(err);
        }
    }

    /**
     * PUT /employees/:id
     * Updates an existing employee. Also allows replacing the photo.
     */
    public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: number = parseInt(req.params.id as string, 10);

            // if only a photo is being updated, skip body validation
            if (Object.keys(req.body).length > 0) {
                const { error, value } = updateEmployeeSchema.validate(req.body);
                if (error) {
                    const response: ApiResponse<null> = {
                        success: false,
                        message: error.details[0].message,
                    };
                    res.status(400).json(response);
                    return;
                }
                req.body = value;
            }

            const payload: UpdateEmployeePayload = { ...req.body };

            if (req.file) {
                const imageUrl = await uploadToCloudinary(req.file.buffer);
                payload.photo_path = imageUrl;
            }

            const employee: Employee = await employeeService.update(id, payload);

            const response: ApiResponse<Employee> = {
                success: true,
                message: 'Employee updated successfully',
                data: employee,
            };

            res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }

    /**
     * DELETE /employees/:id
     * Soft-deletes an employee.
     */
    public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: number = parseInt(req.params.id as string, 10);
            await employeeService.delete(id);

            const response: ApiResponse<null> = {
                success: true,
                message: 'Employee deleted successfully',
            };

            res.status(200).json(response);
        } catch (err) {
            next(err);
        }
    }
}

export default new EmployeeController();
