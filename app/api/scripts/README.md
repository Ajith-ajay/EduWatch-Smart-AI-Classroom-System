# Database Management Scripts

This folder contains scripts for managing the hybrid Prisma + Custom SQL database setup.

## Scripts

### `apply-custom-sql.js`
Applies all custom SQL objects (views and functions) from the `database/` folder.

**Usage:**
```bash
node scripts/apply-custom-sql.js
# or via npm
npm run db:apply-custom-sql
```

**What it does:**
1. Reads all `.sql` files from `database/functions/`
2. Reads all `.sql` files from `database/views/`
3. Executes them in order using Prisma

---

### `db-full-setup.js`
Complete database setup including Prisma schema, custom SQL, and optional seeding.

**Usage:**
```bash
node scripts/db-full-setup.js
# or via npm
npm run db:full-setup

# With seeding
node scripts/db-full-setup.js --seed
npm run db:full-setup:seed

# Using migrations instead of push
node scripts/db-full-setup.js --migrate
```

**What it does:**
1. Generates Prisma Client
2. Pushes/migrates Prisma schema to database
3. Applies custom SQL objects
4. Optionally seeds data

---

### `introspect-and-preserve.js`
Introspects existing database and updates Prisma schema while preserving custom SQL.

**Usage:**
```bash
node scripts/introspect-and-preserve.js
# or via npm
npm run db:introspect
```

**What it does:**
1. Backs up current `schema.prisma`
2. Runs `prisma db pull` to introspect database
3. Generates new Prisma Client
4. Preserves custom SQL objects (doesn't touch them)

---

### `apply-seeds.js`
Applies seed data from SQL files in the `database/seeds/` folder.

**Usage:**
```bash
node scripts/apply-seeds.js
# or via npm
npm run db:seed
```

**What it does:**
1. Reads all `.sql` files from `database/seeds/`
2. Executes them in alphabetical order using Prisma
3. Reports success/failure for each seed file

**When to use:**
- After initial database setup: `npm run db:seed`
- As part of full setup: `npm run db:full-setup:seed`
- To reset data: Delete seed data manually, then re-run seeds

---

### `reset-database.js`
⚠️ **DESTRUCTIVE** - Deletes ALL tables and data from database

**Usage:**
```bash
node scripts/reset-database.js
# or via npm
npm run db:reset
```

**What it does:**
1. Lists all tables in database
2. Asks for confirmation (twice for safety)
3. Drops ALL tables with CASCADE
4. Database becomes completely empty

**⚠️ WARNING:**
- This PERMANENTLY deletes all data
- Action CANNOT be undone
- Requires explicit confirmation
- Use only when you want a completely fresh database

**When to use:**
- Starting development from scratch
- Cleaning up after testing
- Before major schema changes
- Never use in production without backup!

---

### `reset-table.js`
⚠️ **DESTRUCTIVE** - Clears specific table(s)

**Usage:**
```bash
# Interactive mode (asks for table name)
node scripts/reset-table.js
npm run db:reset:table

# Direct mode (specify table name)
node scripts/reset-table.js attendance_log
npm run db:reset:table attendance_log
```

**What it does:**
1. Lists available tables
2. Asks which table to clear (or uses provided argument)
3. Asks for confirmation
4. Truncates table (removes all rows)
5. Resets auto-increment counter

**⚠️ WARNING:**
- This PERMANENTLY deletes data from specified table
- Action CANNOT be undone
- Respects foreign key constraints
- Requires explicit confirmation

**When to use:**
- Testing data - clear test records
- Fixing data issues
- Starting with fresh data for specific table
- Development/debugging

**Example:**
```bash
# Clear attendance logs
npm run db:reset:table attendance_log

# Clear user data
npm run db:reset:table "User"
```

## When to Use What

| Scenario | Command |
|----------|---------|
| First time setup | `npm run db:full-setup` |
| First setup with data | `npm run db:full-setup:seed` |
| After schema changes | `npm run db:push` |
| Views/functions missing | `npm run db:apply-custom-sql` |
| Seed data only | `npm run db:seed` |
| Database modified externally | `npm run db:introspect` |
| Clear specific table | `npm run db:reset:table` |
| Delete ALL data (fresh DB) | `npm run db:reset` |
| Production deployment | `npm run db:migrate:deploy` |

---

## File Locations

```
app/
├── api/
│   ├── scripts/              ← You are here
│   │   ├── apply-custom-sql.js
│   │   ├── apply-seeds.js
│   │   ├── db-full-setup.js
│   │   ├── introspect-and-preserve.js
│   │   ├── reset-database.js
│   │   └── reset-table.js
│   └── prisma/
│       ├── schema.prisma     ← Prisma schema
│       └── migrations/       ← Migration files
└── database/                 ← Custom SQL & Seeds
    ├── views/                ← Database views
    ├── functions/            ← Database functions
    └── seeds/                ← Seed data (SQL files)
```

---

## How It Works

### The Problem
Prisma manages database schema through `schema.prisma` but doesn't support views, functions, or other advanced PostgreSQL features. When you run `prisma db push` or `prisma migrate`, it can delete custom database objects.

### The Solution
1. **Prisma manages:** Tables, columns, relationships, indexes
2. **Custom SQL manages:** Views, functions, triggers (if needed)
3. **Scripts coordinate:** Always apply custom SQL after Prisma operations

### The Workflow
```
┌─────────────────────────────────────────────────┐
│  1. Edit schema.prisma (change tables)          │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  2. Run: npm run db:push                        │
│     - Pushes Prisma schema to database          │
│     - Automatically triggers step 3...          │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  3. Automatically applies custom SQL            │
│     - Re-creates views                          │
│     - Re-creates functions                      │
└─────────────────────────────────────────────────┘
```

---

## Maintenance

### Adding New Custom SQL

1. Create SQL file in appropriate directory:
   - `database/views/view_name.sql` for views
   - `database/functions/function_name.sql` for functions

2. Use `CREATE OR REPLACE` syntax:
   ```sql
   CREATE OR REPLACE VIEW view_name AS
   SELECT ...;
   
   CREATE OR REPLACE FUNCTION function_name()
   RETURNS ... AS $$
   BEGIN
     ...
   END;
   $$ LANGUAGE plpgsql;
   ```

3. Apply it:
   ```bash
   npm run db:apply-custom-sql
   ```

### Modifying Existing Custom SQL

1. Edit the SQL file directly
2. Re-apply:
   ```bash
   npm run db:apply-custom-sql
   ```

---

## Troubleshooting

### Script fails with "Cannot connect to database"
- Check your `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify database exists

### Script fails with "Permission denied"
- Ensure database user has CREATE privileges
- Check connection credentials

### Views/Functions not appearing
- Verify files are in correct directories
- Check SQL syntax
- Run: `npm run db:apply-custom-sql` manually
- Check output for errors

---

## See Also

- [DATABASE_MANAGEMENT_GUIDE.md](../DATABASE_MANAGEMENT_GUIDE.md) - Complete documentation
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
