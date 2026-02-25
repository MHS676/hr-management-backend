import { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
    // Clean existing entries
    await knex('attendance').del();
    await knex('employees').del();
    await knex('hr_users').del();

    // Insert HR users
    const passwordHash = await bcrypt.hash('password123', 10);

    await knex('hr_users').insert([
        {
            email: 'admin@hr.com',
            password_hash: passwordHash,
            name: 'HR Admin',
        },
        {
            email: 'manager@hr.com',
            password_hash: passwordHash,
            name: 'HR Manager',
        },
    ]);

    // Insert some sample employees
    const employees = await knex('employees')
        .insert([
            {
                name: 'Rahim Uddin',
                age: 28,
                designation: 'Software Engineer',
                hiring_date: '2024-01-15',
                date_of_birth: '1997-05-20',
                salary: 75000.0,
            },
            {
                name: 'Karim Hossain',
                age: 32,
                designation: 'Senior Developer',
                hiring_date: '2023-06-01',
                date_of_birth: '1993-11-10',
                salary: 95000.0,
            },
            {
                name: 'Fatema Akter',
                age: 25,
                designation: 'Junior Developer',
                hiring_date: '2025-02-01',
                date_of_birth: '2000-03-15',
                salary: 45000.0,
            },
        ])
        .returning('id');

    // Insert some attendance records
    await knex('attendance').insert([
        { employee_id: employees[0].id, date: '2025-08-01', check_in_time: '09:30:00' },
        { employee_id: employees[0].id, date: '2025-08-02', check_in_time: '10:00:00' },
        { employee_id: employees[1].id, date: '2025-08-01', check_in_time: '09:00:00' },
        { employee_id: employees[1].id, date: '2025-08-02', check_in_time: '09:50:00' },
        { employee_id: employees[2].id, date: '2025-08-01', check_in_time: '09:45:00' },
        { employee_id: employees[2].id, date: '2025-08-02', check_in_time: '09:46:00' },
    ]);
}
