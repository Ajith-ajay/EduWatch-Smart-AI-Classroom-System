# EduWatch Database Module (PostgreSQL)

This module contains SQL assets used by EduWatch backend systems.

## Contents

```text
database/
├── schema.sql            # Master script (migrations + seeds + functions + views)
├── migrations/           # Table and schema evolution scripts
├── seeds/                # Initial seed data
├── functions/            # PostgreSQL functions/procedures
├── views/                # Reporting/operational SQL views
└── README.md
```

## Prerequisites

- PostgreSQL 14+
- `psql` CLI available in terminal

## Create Database

```bash
psql -U postgres
CREATE DATABASE eduwatch;
\q
```

## Initialize Schema

From repository root:

```bash
cd app/database
psql -U postgres -d eduwatch -f schema.sql
```

This executes:

- Migrations
- Seed scripts
- SQL functions
- SQL views

## Verify Objects

```bash
psql -U postgres -d eduwatch
\dt
\dv
\df
```

## Useful Maintenance Commands

Reset active connections (before destructive operations):

```bash
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'eduwatch'
  AND pid <> pg_backend_pid();
```

Drop database:

```bash
DROP DATABASE eduwatch;
```

## Development Workflow

- Apply schema updates in `migrations/`.
- Keep function logic in `functions/`.
- Keep derived/reporting SQL in `views/`.
- If using API Prisma scripts, prefer `app/api` npm DB commands for coordinated updates.

## Troubleshooting

- If `psql` command is not found, add PostgreSQL bin directory to PATH.
- If permission denied, use correct DB user or grant privileges.
- If object already exists errors occur, review migration order and existing schema state.
