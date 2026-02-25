import db from '../config/database';
import {
    Employee,
    CreateEmployeePayload,
    UpdateEmployeePayload,
    EmployeeFilterQuery,
} from '../types';

class EmployeeService {
    private readonly tableName = 'employees';

    /**
     * Fetches all employees with optional search and pagination.
     * Soft-deleted employees are excluded.
     */
    public async getAll(
        query: EmployeeFilterQuery,
    ): Promise<{ employees: Employee[]; total: number }> {
        const page: number = query.page || 1;
        const limit: number = query.limit || 10;
        const offset: number = (page - 1) * limit;

        let baseQuery = db(this.tableName).whereNull('deleted_at');

        // search by name (partial match, case-insensitive)
        if (query.search) {
            baseQuery = baseQuery.where('name', 'ILIKE', `%${query.search}%`);
        }

        const totalResult = await baseQuery.clone().count('id as count').first();
        const total: number = Number(totalResult?.count || 0);

        const employees: Employee[] = await baseQuery
            .select('*')
            .orderBy('id', 'asc')
            .limit(limit)
            .offset(offset);

        return { employees, total };
    }

    /**
     * Fetches a single employee by ID. Throws if not found or soft-deleted.
     */
    public async getById(id: number): Promise<Employee> {
        const employee: Employee | undefined = await db(this.tableName)
            .where({ id })
            .whereNull('deleted_at')
            .first();

        if (!employee) {
            throw Object.assign(new Error('Employee not found'), { statusCode: 404 });
        }

        return employee;
    }

    /**
     * Creates a new employee record and returns it.
     */
    public async create(payload: CreateEmployeePayload): Promise<Employee> {
        const [employee]: Employee[] = await db(this.tableName).insert(payload).returning('*');
        return employee;
    }

    /**
     * Updates an existing employee's details and/or photo.
     */
    public async update(id: number, payload: UpdateEmployeePayload): Promise<Employee> {
        // make sure employee exists
        await this.getById(id);

        const [updated]: Employee[] = await db(this.tableName)
            .where({ id })
            .update({ ...payload, updated_at: db.fn.now() })
            .returning('*');

        return updated;
    }

    /**
     * Soft-deletes an employee by setting deleted_at timestamp.
     */
    public async delete(id: number): Promise<void> {
        await this.getById(id);

        await db(this.tableName).where({ id }).update({ deleted_at: db.fn.now() });
    }
}

export default new EmployeeService();
