# HR Management Backend

A RESTful API for managing HR operations — employee records, daily attendance, and monthly reports. Built with Node.js, TypeScript, Express, Knex, and PostgreSQL.

## Features

- **JWT Authentication** — HR users log in and receive a token to access protected routes.
- **Employee CRUD** — Create, read, update, and soft-delete employees.
- **Photo Upload** — Attach employee photos via multipart form-data (stored locally).
- **Attendance Tracking** — Record daily check-ins with upsert support (one entry per employee per day).
- **Monthly Reports** — View days present and late arrivals (late = check-in after 09:45 AM).
- **Pagination & Search** — Filter employees by name, attendance by date range.
- **Soft Delete** — Deleted employees are hidden from lists but preserved in the database.
- **Input Validation** — All inputs are validated using Joi.

## Tech Stack

- Node.js + TypeScript (OOP style)
- Express
- Knex (query builder)
- PostgreSQL
- Joi (validation)
- Multer (file uploads)
- JWT (authentication)
- ESLint + Prettier (code quality)

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL installed and running
- npm or yarn

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd hr-management-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials, JWT secret, etc.

### 4. Create the database

Make sure PostgreSQL is running, then create the database:

```sql
CREATE DATABASE hr_management;
```

### 5. Run migrations

```bash
npm run migrate
```

### 6. Seed the database (optional)

This will add sample HR users and employees:

```bash
npm run seed
```

Default HR login after seeding:
- **Email:** admin@hr.com
- **Password:** password123

### 7. Start the server

Development mode (with hot reload):

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

The API will be available at `http://localhost:3000`.

## API Endpoints

### Auth

| Method | Endpoint      | Description    |
|--------|---------------|----------------|
| POST   | `/auth/login` | HR user login  |

### Employees (JWT required)

| Method | Endpoint          | Description                     |
|--------|-------------------|---------------------------------|
| GET    | `/employees`      | List all employees (paginated)  |
| GET    | `/employees/:id`  | Get a single employee           |
| POST   | `/employees`      | Create employee (with photo)    |
| PUT    | `/employees/:id`  | Update employee (with photo)    |
| DELETE | `/employees/:id`  | Soft-delete an employee         |

### Attendance (JWT required)

| Method | Endpoint           | Description                         |
|--------|--------------------|-------------------------------------|
| GET    | `/attendance`      | List attendance (with filters)      |
| GET    | `/attendance/:id`  | Get a single attendance record      |
| POST   | `/attendance`      | Create/upsert attendance            |
| PUT    | `/attendance/:id`  | Update an attendance entry          |
| DELETE | `/attendance/:id`  | Delete an attendance entry          |

### Reports (JWT required)

| Method | Endpoint               | Description                    |
|--------|------------------------|--------------------------------|
| GET    | `/reports/attendance`  | Monthly attendance summary     |

## Query Examples

```
GET /employees?search=rahim&page=1&limit=10
GET /attendance?employee_id=12&from=2025-08-01&to=2025-08-31
GET /reports/attendance?month=2025-08
GET /reports/attendance?month=2025-08&employee_id=1
```

## Project Structure

```
src/
├── config/
│   ├── database.ts       # Knex connection pool
│   ├── env.ts            # Environment variable loader
│   ├── knexfile.ts       # Knex CLI config
│   └── multer.ts         # Multer upload config
├── controllers/
│   ├── auth.controller.ts
│   ├── attendance.controller.ts
│   └── employee.controller.ts
├── database/
│   ├── migrations/       # Knex migration files
│   └── seeds/            # Seed data
├── middlewares/
│   ├── auth.middleware.ts # JWT verification
│   └── error.middleware.ts
├── routes/
│   ├── auth.routes.ts
│   ├── attendance.routes.ts
│   ├── employee.routes.ts
│   └── report.routes.ts
├── services/
│   ├── auth.service.ts
│   ├── attendance.service.ts
│   └── employee.service.ts
├── types/
│   ├── express.d.ts      # Express Request augmentation
│   └── index.ts          # All interfaces & types
├── validators/
│   ├── auth.validator.ts
│   ├── attendance.validator.ts
│   └── employee.validator.ts
├── app.ts                # Express app setup
└── server.ts             # Entry point
```

## Scripts

| Command               | Description                          |
|-----------------------|--------------------------------------|
| `npm run dev`         | Start dev server with hot reload     |
| `npm run build`       | Compile TypeScript to JavaScript     |
| `npm start`           | Run compiled JavaScript              |
| `npm run migrate`     | Run database migrations              |
| `npm run migrate:rollback` | Rollback last migration         |
| `npm run seed`        | Seed the database                    |
| `npm run lint`        | Run ESLint                           |
| `npm run format`      | Format code with Prettier            |

## License

ISC
# hr-management-backend
