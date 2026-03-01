
## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Database Management

This project uses a hybrid database approach with **Prisma ORM** + **Custom SQL** (views, functions).

### Quick Start

```bash
# First time setup
$ npm run db:full-setup

# After schema changes (development)
$ npm run db:push

# Production migrations
$ npm run db:migrate:deploy

# Re-apply views/functions only
$ npm run db:apply-custom-sql
```

### Available Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:full-setup` | Complete database initialization |
| `npm run db:push` | Push schema changes (dev) |
| `npm run db:migrate` | Create and apply migration |
| `npm run db:migrate:deploy` | Deploy migrations (production) |
| `npm run db:apply-custom-sql` | Apply custom views/functions |
| `npm run db:introspect` | Pull database schema to Prisma |
| `npm run db:studio` | Open Prisma Studio (GUI) |
| `npm run db:generate` | Generate Prisma Client |

### 📖 Documentation

- **[DATABASE_MANAGEMENT_GUIDE.md](./DATABASE_MANAGEMENT_GUIDE.md)** - Complete guide with workflows and best practices
- **[DATABASE_QUICK_REFERENCE.md](./DATABASE_QUICK_REFERENCE.md)** - Quick command reference
- **[scripts/README.md](./scripts/README.md)** - Script documentation

### ⚠️ Important

Always use the npm scripts above instead of raw Prisma commands. This ensures custom SQL objects (views, functions) are preserved after schema changes.

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

# 📘 EduWatch Backend – Smart AI Classroom System

## 🔹 Overview

The EduWatch Backend is a production-ready PostgreSQL-based attendance and timetable management system designed to integrate with the AI-powered Teacher Detection Module.

This backend handles:

- Teacher schedule validation
- Real-time period detection
- Substitution handling
- Attendance logging
- Wrong teacher detection
- REST API endpoints for dashboard integration

It ensures that attendance is marked **only after teacher identity verification and confirmation period validation**.

---

# 🏗 Architecture Overview
# 📘 EduWatch Backend – Smart AI Classroom System

## 🔹 Overview

The EduWatch Backend is a production-ready PostgreSQL-based attendance and timetable management system designed to integrate with the AI-powered Teacher Detection Module.

This backend handles:

- Teacher schedule validation
- Real-time period detection
- Substitution handling
- Attendance logging
- Wrong teacher detection
- REST API endpoints for dashboard integration

It ensures that attendance is marked **only after teacher identity verification and confirmation period validation**.

---

# 🏗 Architecture Overview
AI Module (Face Recognition)
↓
Attendance Engine
↓
PostgreSQL Database
↓
REST API (FastAPI)
↓
Admin Dashboard (Future)


---

# 📂 Backend Folder Structure

```
backend/
│
├── database/
│ ├── migrations/
│ ├── seeds/
│ ├── functions/
│ ├── views/
│ └── schema.sql
│
├── core/
│ ├── db_connection.py
│ ├── period_service.py
│ ├── decision_engine.py
│ ├── lock_manager.py
│ └── attendance_engine.py
│
├── api/
│ ├── app.py
│ └── routes.py
│
└── requirements.txt
```

---

# 🗄 Database Design

## The backend uses PostgreSQL with the following core tables:

tables:
- teachers
- subjects
- classes
- timetable
- teacher_substitution
- attendance_log

Views:
- view_today_schedule
- view_live_current_period
- view_attendance_summary
- view_wrong_teacher_logs
- view_monthly_teacher_report

Functions:
- get_current_period()
- check_substitution()
- mark_attendance()

---

# 🛠 Installation Guide

## 1️⃣ Install PostgreSQL

Download and install PostgreSQL:

https://www.postgresql.org/download/

Create database:

```bash
psql -U postgres
CREATE DATABASE eduwatch;
\q
```

# 📦 Backend Requirements
```bash 
psycopg2-binary==2.9.9
fastapi==0.111.0
uvicorn==0.30.1
python-dotenv==1.0.1
```

# 🗄 Database Initialization

## Navigate to:

```bash
backend/database/
```

## Run schema:

```bash
psql -U postgres -d eduwatch -f schema.sql
```

## This will:

- Create tables
- Insert seed data
- Create functions
- Create views

# Drop Database

```bash
DROP DATABASE eduatch;
```

## if return the db is accesed

```bash
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'eduwatch' AND pid <> pg_backend_pid();
```

# 🚀 Running the Backend API

## Navigate to:

```bash 
backend/
```

## Run:

```bah
uvicorn api.app:app --reload
```

## Open in browser:

```bash
http://127.0.0.1:8000/docs
```

##  Swagger API documentation will be available.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
