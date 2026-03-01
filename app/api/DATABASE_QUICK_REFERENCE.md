# 🚀 Database Quick Reference

> **Quick command reference for database management**

## 📦 Most Used Commands

```bash
# First time setup
npm run db:full-setup          # Database initialization (no data)
npm run db:full-setup:seed     # Database initialization (with seed data)

# Development (most common)
npm run db:push                # Push schema changes + apply custom SQL
npm run db:apply-custom-sql    # Re-apply views/functions only

# Seed data
npm run db:seed                # Apply seed data

# Creating migrations (for production)
npm run db:migrate             # Create migration + apply custom SQL

# Production deployment
npm run db:migrate:deploy      # Deploy migrations + apply custom SQL

# Troubleshooting
npm run db:introspect          # Pull database schema into Prisma
npm run db:studio             # Open database browser (localhost:5555)

# 🗑️ Cleanup/Reset (DESTRUCTIVE!)
npm run db:reset:table         # Delete all data from specific table
npm run db:reset               # Delete ALL tables and data (double confirmation)
```

---

## 🆘 Common Problems & Solutions

| Problem | Command |
|---------|---------|
| 😱 Views are missing | `npm run db:apply-custom-sql` |
| 😱 Functions not found | `npm run db:apply-custom-sql` |
| 😱 Seed data missing | `npm run db:seed` |
| 😱 Schema out of sync | `npm run db:introspect` |
| 😱 Prisma client outdated | Stop server → `npm run db:generate` → Restart |
| �️ Clear specific table | `npm run db:reset:table` |
| 🗑️ Fresh database | `npm run db:reset` + `npm run db:full-setup:seed` |

---

## 📝 Workflow Cheatsheet

### Making Schema Changes

```bash
# 1. Edit prisma/schema.prisma
# 2. Push changes
npm run db:push

# 3. If ready for production, create migration
npm run db:migrate
```

### Adding/Updating Views or Functions

```bash
# 1. Edit/create file in database/views/ or database/functions/
# 2. Apply changes
npm run db:apply-custom-sql
```

---

## ✅ Rules to Remember

1. **Always use npm scripts**, never raw Prisma commands
2. **Development:** Use `npm run db:push`
3. **Production:** Use `npm run db:migrate:deploy`
4. **Views/Functions:** Use `CREATE OR REPLACE` syntax
5. **After manual DB changes:** Run `npm run db:introspect`

---

## 🗂️ File Structure

```
app/api/
├── prisma/schema.prisma      ← Prisma schema (tables only)
└── scripts/                  ← Database management scripts
    ├── apply-custom-sql.js
    ├── apply-seeds.js
    └── db-full-setup.js

app/database/
├── views/                    ← SQL views
├── functions/                ← SQL functions
└── seeds/                    ← Seed data (SQL files)
```

---

## 🔗 Full Documentation

📖 See [DATABASE_MANAGEMENT_GUIDE.md](./DATABASE_MANAGEMENT_GUIDE.md) for complete details.

---

## ⚡ Super Quick Reference

**Problem?** → **Solution:**
- Missing views → `npm run db:apply-custom-sql`
- Missing seed data → `npm run db:seed`
- Out of sync → `npm run db:introspect`  
- Fresh start → `npm run db:full-setup:seed`
- Clear one table → `npm run db:reset:table`
- Completely fresh DB → `npm run db:reset` then `npm run db:full-setup:seed`
- Browse data → `npm run db:studio`
