# EduWatch API Module (NestJS)

This module is the central backend service for EduWatch. It exposes REST APIs for authentication, teachers, classes, timetable management, substitution workflows, attendance logic support, and audit logs.

## Tech Stack

- NestJS 11
- Prisma ORM (PostgreSQL)
- Custom SQL for functions/views
- JWT authentication
- Request audit logging
- Endpoint-level rate limiting

## Runtime

- Default server URL: `http://localhost:5000`
- Static uploads path: `/uploads/*`

## Folder Structure

```text
api/
├── src/
│   ├── modules/                  # Feature modules (auth, teachers, timetable, etc.)
│   ├── common/                   # Guards, interceptors, shared services
│   ├── prisma/                   # Prisma service wiring
│   └── main.ts                   # Application bootstrap
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── scripts/                      # Database helper scripts
├── docs/                         # Detailed backend docs
├── uploads/
├── package.json
└── .env.example
```

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 14+

## Environment Configuration

Create `.env` in `app/api` by copying `.env.example`.

Required variables:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/eduwatch"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
PORT=5000
NODE_ENV=development
```

## Install and Run

From repository root:

```bash
cd app/api
npm install
```

Database first-time setup:

```bash
npm run db:full-setup
```

Start API in development:

```bash
npm run start:dev
```

Production mode:

```bash
npm run build
npm run start:prod
```

## Database Commands

Always use provided npm scripts so custom SQL is preserved.

```bash
npm run db:generate
npm run db:push
npm run db:migrate
npm run db:migrate:deploy
npm run db:apply-custom-sql
npm run db:seed
npm run db:full-setup
npm run db:full-setup:seed
npm run db:introspect
npm run db:studio
npm run db:reset
npm run db:reset:table
```

## Testing and Quality Commands

```bash
npm run lint
npm run format
npm run test
npm run test:watch
npm run test:e2e
npm run test:cov
```

## API Development Notes

- CORS currently allows `http://localhost:3000`.
- Global request validation is enabled.
- Audit logging and rate limiting are enabled globally.
- Keep `prisma/schema.prisma` and SQL objects in sync via scripts.

## Quick Health Check

After startup, verify:

```bash
curl http://localhost:5000
```

Check protected endpoints with bearer token:

```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:5000/teachers
```

## Troubleshooting

- If Prisma errors occur, verify `DATABASE_URL` and run `npm run db:generate`.
- If SQL views/functions are missing, run `npm run db:apply-custom-sql`.
- If port conflicts occur, update `PORT` in `.env`.

## Related Docs

- `app/api/docs/QUICK_SETUP_GUIDE.md`
- `app/api/docs/DATABASE_MANAGEMENT_GUIDE.md`
- `app/api/scripts/README.md`
