# Migration Checklist

Use this checklist when creating database migrations to ensure nothing is forgotten.

## Before Creating Migration

- [ ] Changes tested locally with `npm run db:push`
- [ ] Application works correctly with schema changes
- [ ] Custom SQL (views/functions) still work
- [ ] No breaking changes to existing API endpoints
- [ ] Database indexes added where needed

## Creating Migration

```bash
# Run this command
npm run db:migrate

# You'll be prompted for migration name
# Use descriptive names like:
# - "add_audit_log_table"
# - "add_user_phone_field"
# - "create_teacher_indexes"
```

## After Migration Created

- [ ] Review generated migration file in `prisma/migrations/`
- [ ] Verify migration SQL is correct
- [ ] Custom SQL automatically applied (views/functions)
- [ ] Test rollback if migration has down script
- [ ] Commit migration file to git

## Testing Migration

```bash
# Test on fresh database
npm run db:full-setup

# Verify data integrity
npm run db:studio

# Run application
npm run start:dev

# Run tests
npm run test
```

## Before Deploying to Production

- [ ] Migration tested on staging environment
- [ ] Backup plan in place
- [ ] Database backup taken
- [ ] Rollback procedure documented
- [ ] Team notified of deployment
- [ ] Estimated downtime communicated (if any)

## Deploying Migration

```bash
# On production server
git pull origin main
npm install
npm run db:migrate:deploy
pm2 restart api
```

## After Deployment

- [ ] Verify application is running
- [ ] Check logs for errors
- [ ] Test critical endpoints
- [ ] Verify custom SQL objects exist
- [ ] Monitor for any issues

## Emergency Rollback

If something goes wrong:

```bash
# 1. Stop the application
pm2 stop api

# 2. Rollback migration (if possible)
npx prisma migrate resolve --rolled-back [migration-name]

# 3. Restore database backup
psql eduwatch < backup.sql

# 4. Revert code
git revert HEAD

# 5. Restart application
pm2 restart api
```

## Tips

✅ **DO:**
- Use descriptive migration names
- Test thoroughly before deploying
- Keep migrations small and focused
- Document complex migrations
- Take backups before production migrations

❌ **DON'T:**
- Create migrations with breaking changes without planning
- Edit existing migration files
- Deploy without testing on staging
- Skip the checklist steps
- Forget to re-apply custom SQL

---

## Migration Naming Conventions

Good examples:
- `add_user_two_factor_auth`
- `create_attendance_indexes`
- `remove_deprecated_status_field`
- `alter_teacher_email_unique`

Bad examples:
- `update` (too vague)
- `changes` (not descriptive)
- `fix` (what fix?)
- `temp` (never use temp in migrations)

---

## Common Migration Scenarios

### Adding a new table
```bash
# 1. Add model to schema.prisma
# 2. Run migration
npm run db:migrate
# Name: "create_[table_name]_table"
```

### Adding a field
```bash
# 1. Add field to model in schema.prisma
# 2. Consider if field should be optional or have default
# 3. Run migration
npm run db:migrate
# Name: "add_[table]_[field]_field"
```

### Renaming a field
```bash
# ⚠️ Warning: This drops and recreates the column!
# Better: Create new field, migrate data, drop old field
# 1. Add new field to schema
npm run db:migrate
# 2. Write data migration script
# 3. Remove old field from schema
npm run db:migrate
```

### Creating indexes
```bash
# 1. Add @@index or @@unique to model
# 2. Run migration
npm run db:migrate
# Name: "add_[table]_[field]_index"
```

---

## See Also

- [DATABASE_MANAGEMENT_GUIDE.md](../DATABASE_MANAGEMENT_GUIDE.md)
- [Prisma Migrate Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)
