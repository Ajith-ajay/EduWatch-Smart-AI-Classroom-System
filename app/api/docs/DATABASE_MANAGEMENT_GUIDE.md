# Database Management Guide

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Quick Start Commands](#quick-start-commands)
- [Detailed Command Reference](#detailed-command-reference)
- [Workflows](#workflows)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Database Structure](#database-structure)

---

## Overview

This project uses a **hybrid database management approach** combining:
- **Prisma ORM** for NestJS API (tables and relations)
- **Custom SQL** for views, functions, and advanced features (used by FastAPI microservice)

### The Problem
Prisma manages database schema but can overwrite custom SQL objects (views, functions) when running migrations or schema pushes.

### The Solution
This setup ensures:
1. ✅ Prisma manages tables and relations
2. ✅ Custom SQL views and functions are preserved
3. ✅ Both systems work together seamlessly
4. ✅ FastAPI can use advanced PostgreSQL features
5. ✅ NestJS benefits from Prisma's type safety

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PostgreSQL Database                      │
│  ┌───────────────────────────┬───────────────────────────┐  │
│  │   Prisma-Managed Tables   │  Custom SQL Objects       │  │
│  │   - User                  │  - Views                  │  │
│  │   - RefreshToken          │  - Functions              │  │
│  │   - AuditLog              │  - Triggers (if needed)   │  │
│  │   - teachers              │                           │  │
│  │   - classes               │                           │  │
│  │   - subjects              │                           │  │
│  │   - timetable             │                           │  │
│  │   - attendance_log        │                           │  │
│  └───────────────────────────┴───────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
           │                                    │
           ▼                                    ▼
    ┌─────────────┐                    ┌─────────────┐
    │   NestJS    │                    │   FastAPI   │
    │     API     │                    │ AI Service  │
    │   (Prisma)  │                    │ (Raw SQL)   │
    └─────────────┘                    └─────────────┘
```

---

## Quick Start Commands

### 🚀 Initial Setup
```bash
# Full database setup (without seed data)
npm run db:full-setup

# Full database setup (with seed data)
npm run db:full-setup:seed
```

### 📦 Regular Development

```bash
# Push schema changes (development)
npm run db:push

# Create and apply migration (production-ready)
npm run db:migrate

# Deploy migrations in production
npm run db:migrate:deploy

# Apply seed data
npm run db:seed
```

### 🔧 Maintenance

```bash
# Re-apply custom SQL (views/functions) only
npm run db:apply-custom-sql

# Re-apply seed data only
npm run db:seed

# Introspect existing database into Prisma schema
npm run db:introspect

# Open Prisma Studio (database GUI)
npm run db:studio

# Generate Prisma Client only
npm run db:generate

# ⚠️ DESTRUCTIVE: Clear specific table
npm run db:reset:table

# ⚠️ DESTRUCTIVE: Delete ALL data and tables
npm run db:reset
```

---## Detailed Command Reference

### `npm run db:full-setup`
**Purpose:** Complete database setup from scratch

**What it does:**
1. Generates Prisma Client
2. Pushes Prisma schema to database
3. Applies all custom SQL views and functions
4. Optionally seeds data with `--seed` flag

**When to use:**
- First-time database setup
- After major schema changes
- When setting up development environment

**Example:**
```bash
npm run db:full-setup          # Basic setup
npm run db:full-setup:seed     # Setup with seed data
```

---

### `npm run db:push`
**Purpose:** Quick schema sync for development

**What it does:**
1. Pushes Prisma schema changes to database
2. Automatically applies custom SQL after push
3. Skips migration file creation

**When to use:**
- Rapid development iterations
- Experimenting with schema changes
- Local development

**Example:**
```bash
npm run db:push
```

**⚠️ Warning:** Not recommended for production. Use migrations instead.

---

### `npm run db:migrate`
**Purpose:** Create and apply migrations (development)

**What it does:**
1. Creates a new migration file
2. Applies the migration to database
3. Automatically applies custom SQL after migration

**When to use:**
- Before committing schema changes
- Creating production-ready migrations
- Team collaboration

**Example:**
```bash
npm run db:migrate
# You'll be prompted for migration name
# Example: "add_audit_log_table"
```

**Output:** Creates migration in `prisma/migrations/`

---

### `npm run db:migrate:deploy`
**Purpose:** Deploy migrations in production

**What it does:**
1. Runs all pending migrations
2. Applies custom SQL after migrations
3. No interactive prompts

**When to use:**
- Production deployments
- CI/CD pipelines
- Staging environments

**Example:**
```bash
npm run db:migrate:deploy
```

---

### `npm run db:apply-custom-sql`
**Purpose:** Re-apply custom views and functions

**What it does:**
1. Executes all SQL files in `database/functions/`
2. Executes all SQL files in `database/views/`
3. Uses `CREATE OR REPLACE` so it's idempotent

**When to use:**
- After manual database changes
- When custom SQL files are updated
- Troubleshooting missing views/functions

**Example:**
```bash
npm run db:apply-custom-sql
```

---

### `npm run db:introspect`
**Purpose:** Pull existing database schema into Prisma

**What it does:**
1. Backs up current `schema.prisma`
2. Introspects database structure
3. Updates Prisma schema
4. Generates new Prisma Client

**When to use:**
- Working with existing database
- Schema was modified outside Prisma
- Syncing after manual SQL changes

**Example:**
```bash
npm run db:introspect
```

**⚠️ Important:** Review the changes before proceeding!

---

### `npm run db:studio`
**Purpose:** Open Prisma Studio (database GUI)

**What it does:**
- Opens web-based database browser
- View and edit data
- Explore relationships

**Example:**
```bash
npm run db:studio
# Opens at http://localhost:5555
```

---

### `npm run db:seed`
**Purpose:** Apply seed data to the database

**What it does:**
1. Reads all `.sql` files from `database/seeds/`
2. Executes them in alphabetical order
3. Populates database with initial data

**When to use:**
- First-time setup with data
- Resetting to default data
- Preparing test environment

**Example:**
```bash
npm run db:seed
```

**Seed Files:**
- located in `database/seeds/`
- Execute in alphabetical order
- Include INSERT statements
- Use `database/seeds/01_filename.sql` format if order matters

---

### `npm run db:reset:table`
**Purpose:** Clear/delete all data from a specific table

**What it does:**
1. Asks for table name (or accepts via command line argument)
2. Shows list of available tables
3. Asks for confirmation (prevents accidental deletion)
4. Truncates the table (removes all rows)
5. Resets auto-increment counter

**Example:**
```bash
# Interactive (prompts for table name)
npm run db:reset:table

# Direct (specify table)
npm run db:reset:table attendance_log
npm run db:reset:table "User"
```

**⚠️ WARNING:**
- Permanently deletes data from specified table
- Action CANNOT be undone
- Respects foreign key constraints
- Requires explicit confirmation

**When to use:**
- Clear test data
- Reset specific table for debugging
- Fresh start for one table (keep others intact)
- Development testing

---

### `npm run db:reset`
**Purpose:** DESTRUCTIVE - Delete ALL tables and data

**What it does:**
1. Lists all tables in database
2. Asks for dual confirmation (safety precaution)
3. Drops ALL tables with CASCADE
4. Database becomes completely empty

**Example:**
```bash
npm run db:reset
# Then confirms twice
```

**⚠️ CRITICAL WARNING:**
- THIS PERMANENTLY DELETES ALL DATA
- ALL TABLES WILL BE DROPPED
- Action CANNOT be undone
- Requires TWO confirmations for safety
- NEVER use in production without backup!

**When to use:**
- Starting development from absolutely scratch
- Major schema redesign
- Cleaning up after extensive testing
- Development environment reset
- Before archiving old database version

**Recovery:**
After reset, rebuild with:
```bash
# Prisma schema only
npm run db:full-setup

# With seed data
npm run db:full-setup:seed
```

---

## Workflows

### 🆕 New Project Setup

```bash
# 1. Clone repository
git clone <repo-url>
cd app/api

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# 4. Setup database
npm run db:full-setup

# 5. Start development server
npm run start:dev
```

### 📊 New Project Setup WITH Seed Data

```bash
# 1-3. Same as above

# 4. Setup database with seed data
npm run db:full-setup:seed

# 5. Start development server
npm run start:dev
```

---

### 🔄 Daily Development Workflow

```bash
# 1. Pull latest changes
git pull

# 2. Update dependencies (if needed)
npm install

# 3. Apply any schema changes
npm run db:push

# 4. Start coding
npm run start:dev
```

---

### 📝 Making Schema Changes

```bash
# 1. Edit prisma/schema.prisma
# Example: Add new field to User model

# 2. Push changes (development)
npm run db:push

# 3. Test your changes
npm run start:dev

# 4. Create migration (for production)
npm run db:migrate
# Enter migration name: "add_user_phone_field"

# 5. Commit changes
git add prisma/
git commit -m "Add phone field to User model"
```

---

### 🔧 Adding Custom Views or Functions

```bash
# 1. Create SQL file in appropriate directory
# - database/views/ for views
# - database/functions/ for functions

# Example: database/views/view_teacher_stats.sql
CREATE OR REPLACE VIEW view_teacher_stats AS
SELECT 
    t.teacher_id,
    t.full_name,
    COUNT(al.attendance_id) as total_classes
FROM teachers t
LEFT JOIN attendance_log al ON t.teacher_id = al.scheduled_teacher_id
GROUP BY t.teacher_id, t.full_name;

# 2. Apply custom SQL
npm run db:apply-custom-sql

# 3. Verify in database
npm run db:studio

# 4. Commit changes
git add database/
git commit -m "Add teacher statistics view"
```

**⚠️ Important - View Dependencies:**

If your view depends on other views, the script will automatically retry failed views up to 3 times to resolve dependencies. However, for complex dependency chains, consider:

1. **Prefix with numbers** for explicit ordering:
   ```
   database/views/
   ├── 01_view_base_data.sql
   ├── 02_view_depends_on_base.sql
   └── 03_view_final.sql
   ```

2. **Use CREATE OR REPLACE** (already recommended):
   ```sql
   CREATE OR REPLACE VIEW view_name AS
   SELECT * FROM other_view;
   ```

3. **Test application** to ensure views work:
   ```bash
   npm run db:apply-custom-sql
   npm run db:studio  # Verify views exist
   ```

---

### 🚀 Production Deployment

```bash
# On production server

# 1. Pull latest code
git pull origin main

# 2. Install dependencies
npm install --production

# 3. Apply migrations
npm run db:migrate:deploy

# 4. Restart application
pm2 restart api
```

---

### 🔄 Syncing After Manual Database Changes

If you or someone else made changes directly in the database:

```bash
# 1. Introspect database
npm run db:introspect

# 2. Review changes in prisma/schema.prisma
git diff prisma/schema.prisma

# 3. If changes are correct, commit
git add prisma/schema.prisma
git commit -m "Update schema from database introspection"

# 4. Re-apply custom SQL (just in case)
npm run db:apply-custom-sql
```

---

## Best Practices

### ✅ DO

1. **Always use npm scripts** instead of raw Prisma commands
   ```bash
   ✅ npm run db:push
   ❌ npx prisma db push
   ```

2. **Create migrations for production**
   ```bash
   npm run db:migrate  # Creates migration file
   ```

3. **Keep custom SQL in database/ folder**
   - `database/views/` for views
   - `database/functions/` for functions
   - Use descriptive filenames
   - Prefix with numbers if dependencies exist (e.g., `01_base_view.sql`)

4. **Use CREATE OR REPLACE** in custom SQL
   ```sql
   CREATE OR REPLACE VIEW view_name AS ...
   CREATE OR REPLACE FUNCTION func_name() ...
   ```

5. **Document complex views/functions**
   - Add comments in SQL files
   - Explain purpose and usage

6. **Test locally before deploying**
   ```bash
   npm run db:full-setup  # Fresh setup
   npm run test           # Run tests
   ```

### ❌ DON'T

1. **Don't use `prisma migrate reset`** without re-applying custom SQL
   ```bash
   ❌ npx prisma migrate reset
   ✅ npm run db:full-setup  # Use this instead
   ```

2. **Don't manually edit database** without introspecting after
   ```bash
   # If you must edit manually, run:
   npm run db:introspect
   ```

3. **Don't ignore migration files**
   - Always commit migration files
   - Never edit existing migration files

4. **Don't mix `db:push` and `db:migrate`** in production
   - Development: `db:push` is fine
   - Production: Always use `db:migrate:deploy`

5. **Don't skip custom SQL application**
   - Always run `npm run db:apply-custom-sql` after schema changes

---

## Troubleshooting

### Problem: "Views are missing after Prisma push"

**Solution:**
```bash
npm run db:apply-custom-sql
```

---

### Problem: "Function does not exist"

**Cause:** Functions were deleted by Prisma operation

**Solution:**
```bash
npm run db:apply-custom-sql
```

---

### Problem: "Relation does not exist" when applying views

**Error:** `relation "view_xyz" does not exist`

**Cause:** View depends on another view that hasn't been created yet (dependency order issue)

**Solution:**

The script automatically retries failed views up to 3 times. If it still fails:

1. **Rename files with numeric prefixes** to enforce order:
   ```bash
   # Instead of:
   database/views/view_today_schedule.sql
   database/views/view_live_current_period.sql
   
   # Use:
   database/views/01_view_today_schedule.sql
   database/views/02_view_live_current_period.sql
   ```

2. **Re-apply custom SQL:**
   ```bash
   npm run db:apply-custom-sql
   ```

3. **Check for circular dependencies** - views shouldn't depend on each other in a circle

---

### Problem: "Prisma Client out of sync"

**Error:** `The table 'X' does not exist in the current database`

**Solution:**
```bash
npm run db:generate  # Regenerate client
# Or
npm run db:introspect  # Pull schema from database
```

---

### Problem: "Cannot generate Prisma Client (EPERM error)"

**Cause:** Server is running and using Prisma Client

**Solution:**
1. Stop the server (Ctrl+C)
2. Run: `npm run db:generate`
3. Restart server: `npm run start:dev`

---

### Problem: "Migration failed halfway"

**Solution:**
```bash
# 1. Check migration status
npx prisma migrate status

# 2. If stuck, mark as rolled back
npx prisma migrate resolve --rolled-back [migration-name]

# 3. Try again
npm run db:migrate
```

---

### Problem: "Database and Prisma schema are out of sync"

**Solution:**
```bash
# Option 1: Push Prisma schema to database
npm run db:push

# Option 2: Pull database schema to Prisma
npm run db:introspect

# Then verify
npm run db:studio
```

---

## Database Structure

### Tables Managed by Prisma

| Table | Purpose | Used By |
|-------|---------|---------|
| `User` | Admin users | NestJS API |
| `RefreshToken` | JWT refresh tokens | NestJS API |
| `AuditLog` | API audit logging | NestJS API |
| `teachers` | Teacher information | Both |
| `classes` | Class information | Both |
| `subjects` | Subject information | Both |
| `timetable` | Class schedule | Both |
| `attendance_log` | Attendance records | FastAPI AI |
| `teacher_substitution` | Teacher substitutions | FastAPI AI |

### Custom Views

| View | Purpose | Used By |
|------|---------|---------|
| `view_live_current_period` | Current ongoing class | FastAPI AI |
| `view_today_schedule` | Today's full schedule | FastAPI AI |
| `view_attendance_summary` | Attendance statistics | FastAPI AI |
| `view_monthly_teacher_report` | Monthly reports | FastAPI AI |
| `view_wrong_teacher_logs` | Mismatched teachers | FastAPI AI |

### Custom Functions

| Function | Purpose | Used By |
|----------|---------|---------|
| `get_current_period()` | Get current class period | FastAPI AI |
| `mark_attendance()` | Record attendance | FastAPI AI |
| `check_substitution()` | Check for substitutes | FastAPI AI |

---

## File Structure Reference

```
app/
├── api/                         # NestJS API
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma schema (tables)
│   │   └── migrations/         # Migration files
│   ├── scripts/
│   │   ├── apply-custom-sql.js     # Apply views/functions
│   │   ├── db-full-setup.js        # Full database setup
│   │   └── introspect-and-preserve.js  # Introspect tool
│   └── package.json            # npm scripts
│
├── database/                    # Custom SQL
│   ├── schema.sql              # Full schema (reference)
│   ├── views/                  # Database views
│   │   ├── view_live_current_period.sql
│   │   ├── view_today_schedule.sql
│   │   └── ...
│   ├── functions/              # Database functions
│   │   ├── get_current_period.sql
│   │   ├── mark_attendance.sql
│   │   └── ...
│   ├── migrations/             # Manual migrations (if needed)
│   └── seeds/                  # Seed data
│
└── ai-service/                 # FastAPI microservice
    └── (uses views and functions via raw SQL)
```

---

## Integration with FastAPI

Your FastAPI service can freely use:
- ✅ All views
- ✅ All functions
- ✅ All tables
- ✅ Raw SQL queries

Example FastAPI code:
```python
# Using custom view
result = await db.fetch_all("SELECT * FROM view_live_current_period")

# Using custom function
current_period = await db.fetch_one("SELECT * FROM get_current_period()")

# Using custom function to mark attendance
await db.execute(
    "SELECT mark_attendance($1, $2, $3, $4, $5, $6, $7)",
    class_id, subject_id, timetable_id, 
    scheduled_teacher, detected_teacher, status, confidence
)
```

---

## Environment Variables

Required in `.env`:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/eduwatch"

# JWT
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"

# Other vars...
```

---

## Quick Reference Card

### Most Common Commands

```bash
# Development
npm run db:push              # Quick schema sync
npm run db:apply-custom-sql  # Fix missing views/functions

# Production
npm run db:migrate:deploy    # Deploy migrations

# Maintenance
npm run db:introspect        # Sync from database
npm run db:studio           # Browse database

# Setup
npm run db:full-setup        # Complete setup
```

### When Something Goes Wrong

1. **Views missing?** → `npm run db:apply-custom-sql`
2. **Schema out of sync?** → `npm run db:introspect`
3. **Client out of date?** → Stop server, `npm run db:generate`, restart
4. **Fresh start needed?** → `npm run db:full-setup`

---

## Support

If you encounter issues:
1. Check this guide's [Troubleshooting](#troubleshooting) section
2. Verify your `.env` configuration
3. Check Prisma logs: `npx prisma migrate status`
4. Check database directly: `npm run db:studio`

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-03-01 | 1.0.0 | Initial documentation |

---

**Remember:** The key principle is that Prisma manages tables, and we manually preserve views/functions through automated scripts. This gives us the best of both worlds! 🚀
