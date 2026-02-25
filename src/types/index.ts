export interface HrUser {
    id: number;
    email: string;
    password_hash: string;
    name: string;
    created_at: Date;
    updated_at: Date;
}

export interface Employee {
    id: number;
    name: string;
    age: number;
    designation: string;
    hiring_date: string;
    date_of_birth: string;
    salary: number;
    photo_path: string | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export interface Attendance {
    id: number;
    employee_id: number;
    date: string;
    check_in_time: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface JwtPayload {
    id: number;
    email: string;
    name: string;
}

export interface CreateEmployeePayload {
    name: string;
    age: number;
    designation: string;
    hiring_date: string;
    date_of_birth: string;
    salary: number;
    photo_path?: string | null;
}

export interface UpdateEmployeePayload {
    name?: string;
    age?: number;
    designation?: string;
    hiring_date?: string;
    date_of_birth?: string;
    salary?: number;
    photo_path?: string | null;
}

export interface CreateAttendancePayload {
    employee_id: number;
    date: string;
    check_in_time: string;
}

export interface UpdateAttendancePayload {
    employee_id?: number;
    date?: string;
    check_in_time?: string;
}

export interface AttendanceReportItem {
    employee_id: number;
    name: string;
    days_present: number;
    times_late: number;
}

export interface PaginationQuery {
    page?: number;
    limit?: number;
}

export interface EmployeeFilterQuery extends PaginationQuery {
    search?: string;
}

export interface AttendanceFilterQuery extends PaginationQuery {
    employee_id?: number;
    from?: string;
    to?: string;
    date?: string;
}

export interface ReportQuery {
    month: string;
    employee_id?: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
