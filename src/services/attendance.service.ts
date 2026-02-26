import db from '../config/database';
import {
    Attendance,
    CreateAttendancePayload,
    UpdateAttendancePayload,
    AttendanceFilterQuery,
    AttendanceReportItem,
    ReportQuery,
} from '../types';

class AttendanceService {
    private readonly tableName = 'attendance';


    public async getAll(
        query: AttendanceFilterQuery,
    ): Promise<{ records: Attendance[]; total: number }> {
        const page: number = query.page || 1;
        const limit: number = query.limit || 10;
        const offset: number = (page - 1) * limit;

        let baseQuery = db(this.tableName);

        if (query.employee_id) {
            baseQuery = baseQuery.where('employee_id', query.employee_id);
        }

        if (query.date) {
            baseQuery = baseQuery.where('date', query.date);
        }

        if (query.from) {
            baseQuery = baseQuery.where('date', '>=', query.from);
        }

        if (query.to) {
            baseQuery = baseQuery.where('date', '<=', query.to);
        }

        const totalResult = await baseQuery.clone().count('id as count').first();
        const total: number = Number(totalResult?.count || 0);

        const records: Attendance[] = await baseQuery
            .select('*')
            .orderBy('date', 'desc')
            .limit(limit)
            .offset(offset);

        return { records, total };
    }


    public async getById(id: number): Promise<Attendance> {
        const record: Attendance | undefined = await db(this.tableName).where({ id }).first();

        if (!record) {
            throw Object.assign(new Error('Attendance record not found'), { statusCode: 404 });
        }

        return record;
    }


    public async create(payload: CreateAttendancePayload): Promise<Attendance> {

        const employee = await db('employees')
            .where({ id: payload.employee_id })
            .whereNull('deleted_at')
            .first();

        if (!employee) {
            throw Object.assign(new Error('Employee not found'), { statusCode: 404 });
        }


        const [record]: Attendance[] = await db(this.tableName)
            .insert(payload)
            .onConflict(['employee_id', 'date'])
            .merge({ check_in_time: payload.check_in_time })
            .returning('*');

        return record;
    }


    public async update(id: number, payload: UpdateAttendancePayload): Promise<Attendance> {
        await this.getById(id);

        const [updated]: Attendance[] = await db(this.tableName)
            .where({ id })
            .update(payload)
            .returning('*');

        return updated;
    }


    public async delete(id: number): Promise<void> {
        await this.getById(id);
        await db(this.tableName).where({ id }).del();
    }


    public async getMonthlyReport(query: ReportQuery): Promise<AttendanceReportItem[]> {
        const [year, month] = query.month.split('-');
        const startDate = `${year}-${month}-01`;


        const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
        const endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

        let baseQuery = db(this.tableName)
            .join('employees', 'attendance.employee_id', '=', 'employees.id')
            .whereNull('employees.deleted_at')
            .whereBetween('attendance.date', [startDate, endDate]);

        if (query.employee_id) {
            baseQuery = baseQuery.where('attendance.employee_id', query.employee_id);
        }

        const report: AttendanceReportItem[] = await baseQuery
            .select(
                'attendance.employee_id',
                'employees.name',
                db.raw('COUNT(*)::int as days_present'),
                db.raw("COUNT(*) FILTER (WHERE attendance.check_in_time > '09:45:00')::int as times_late"),
            )
            .groupBy('attendance.employee_id', 'employees.name')
            .orderBy('attendance.employee_id');

        return report;
    }
}

export default new AttendanceService();
