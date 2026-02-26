# HR Management Backend

A backend API for handling day-to-day HR work — managing employee records, tracking daily attendance, and pulling monthly reports. It's built with Node.js, TypeScript, and PostgreSQL, and uses Cloudinary for employee photo uploads.

---

## What it does

- HR users log in with their email and password and get a JWT token to access everything else
- You can create, view, update, and soft-delete employees — soft delete means they're hidden from lists but still in the database
- Employee photos are uploaded directly to Cloudinary, so you don't need to manage local storage
- Attendance is tracked per employee per day. If you submit for the same employee on the same day twice, it just updates the existing record instead of creating a duplicate
- The monthly report shows how many days each employee came in and how many times they were late (late = check-in after 09:45 AM)
- Search employees by name, filter attendance by date range or employee, paginate everything

---

## Tech Stack

- **Node.js + TypeScript** — written in OOP style with classes
- **Express** — HTTP server and routing
- **Knex** — SQL query builder (no ORM overhead)
- **PostgreSQL** — hosted on Railway
- **Cloudinary** — employee photo storage
- **Joi** — request validation
- **JWT** — authentication
- **Multer** — handles multipart/form-data for photo uploads
- **ESLint + Prettier** — keeps the code clean and consistent

---

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (or use the Railway connection string directly)
- A Cloudinary account

### 1. Clone and install

```bash
git clone <your-repo-url>
cd hr-management-backend
npm install
```

### 2. Set up your environment

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=3000

# PostgreSQL connection string
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=8h

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=Hr_management
```

### 3. Run migrations

This creates the `hr_users`, `employees`, and `attendance` tables:

```bash
npm run migrate
```

### 4. Seed the database (optional but recommended for testing)

```bash
npm run seed
```

After seeding, you can log in with:
- **Email:** `admin@hr.com` / **Password:** `password123`
- **Email:** `manager@hr.com` / **Password:** `password123`

### 5. Start the server

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm run build
npm start
```

Server runs at `http://localhost:3000`.

---

## Testing with Postman

Import the `HR_Management_API.postman_collection.json` file from the root of this project into Postman.

- Hit **Login** first — the token is automatically saved as a collection variable
- Every other request uses that token automatically — no manual copying needed
- The collection has 30 requests covering all endpoints, including error cases

---

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Log in and receive a JWT token |

### Employees — all require `Authorization: Bearer <token>`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employees` | List all employees (paginated, searchable) |
| GET | `/employees/:id` | Get a single employee |
| POST | `/employees` | Create a new employee (supports photo upload) |
| PUT | `/employees/:id` | Update employee details or replace photo |
| DELETE | `/employees/:id` | Soft-delete an employee |

**Query params for GET /employees:**
```
?search=john        — filter by name (case-insensitive)
?page=1&limit=10    — pagination
```

### Attendance — all require `Authorization: Bearer <token>`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/attendance` | List attendance records (filterable) |
| GET | `/attendance/:id` | Get a single record |
| POST | `/attendance` | Record a check-in (upserts if same day + employee) |
| PUT | `/attendance/:id` | Update a record |
| DELETE | `/attendance/:id` | Delete a record |

**Query params for GET /attendance:**
```
?employee_id=1                          — filter by employee
?date=2025-08-01                        — filter by specific date
?from=2025-08-01&to=2025-08-31          — filter by date range
?page=1&limit=10                        — pagination
```

### Reports — requires `Authorization: Bearer <token>`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/attendance` | Monthly summary: days present + times late |

**Query params:**
```
?month=2025-08              — required, format YYYY-MM
?employee_id=1              — optional, filter to one employee
```

---

## Creating an Employee with a Photo

Use `multipart/form-data` with the following fields:

| Field | Type | Required |
|-------|------|----------|
| `name` | text | ✅ |
| `age` | text (number) | ✅ |
| `designation` | text | ✅ |
| `hiring_date` | text (YYYY-MM-DD) | ✅ |
| `date_of_birth` | text (YYYY-MM-DD) | ✅ |
| `salary` | text (number) | ✅ |
| `photo` | file (JPEG/PNG/WebP, max 5MB) | ❌ optional |

The photo is uploaded to Cloudinary and the returned URL is stored in `photo_path`.

---

## Project Structure

```
src/
├── config/
│   ├── cloudinary.ts     # Cloudinary setup + upload helper
│   ├── database.ts       # Knex connection using DATABASE_URL
│   ├── env.ts            # Typed environment variable loader
│   ├── knexfile.ts       # Knex CLI config
│   └── multer.ts         # Multer memory storage for Cloudinary
├── controllers/
│   ├── auth.controller.ts
│   ├── attendance.controller.ts
│   └── employee.controller.ts
├── database/
│   ├── migrations/       # Table creation migrations
│   └── seeds/            # Sample HR users, employees, attendance
├── middlewares/
│   ├── auth.middleware.ts    # JWT verification
│   └── error.middleware.ts   # Global error handler
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
│   ├── express.d.ts      # Adds `user` to Express Request
│   └── index.ts          # All shared interfaces and types
├── validators/
│   ├── auth.validator.ts
│   ├── attendance.validator.ts
│   └── employee.validator.ts
├── app.ts                # Express app setup
└── server.ts             # Entry point
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run the compiled build |
| `npm run migrate` | Run all pending migrations |
| `npm run migrate:rollback` | Roll back the last migration batch |
| `npm run seed` | Seed the database with sample data |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

---

## License

ISC
