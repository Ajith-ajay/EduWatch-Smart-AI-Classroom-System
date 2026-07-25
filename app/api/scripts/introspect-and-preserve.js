/**
 * Script to introspect existing database and update Prisma schema
 * This is useful when you have an existing database with tables
 * that you want to bring into Prisma management
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SCHEMA_PATH = path.join(__dirname, '../prisma/schema.prisma');
const BACKUP_PATH = path.join(__dirname, '../prisma/schema.prisma.backup');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║     Database Introspection & Schema Update Tool           ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Step 1: Backup current schema
console.log('[1] Backing up current Prisma schema...');
try {
  if (fs.existsSync(SCHEMA_PATH)) {
    fs.copyFileSync(SCHEMA_PATH, BACKUP_PATH);
    console.log(`✓ Backup created: ${BACKUP_PATH}`);
  }
} catch (error) {
  console.error('✗ Failed to backup schema:', error.message);
  process.exit(1);
}

// Step 2: Introspect database
console.log('\n[2] Introspecting database...');
console.log('   This will pull the current database structure into Prisma schema\n');

try {
  execSync('npx prisma db pull', { stdio: 'inherit' });
  console.log('\n✓ Introspection completed');
} catch (error) {
  console.error('\n✗ Introspection failed');
  console.log('\n⚠ Restoring backup...');
  if (fs.existsSync(BACKUP_PATH)) {
    fs.copyFileSync(BACKUP_PATH, SCHEMA_PATH);
    console.log('✓ Backup restored');
  }
  process.exit(1);
}

// Step 3: Generate Prisma Client
console.log('\n[3] Generating Prisma Client with new schema...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('\n✓ Client generated');
} catch (error) {
  console.error('\n✗ Client generation failed');
  process.exit(1);
}

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║        ✅ Introspection Completed Successfully!            ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');
console.log('Next steps:');
console.log('  1. Review the updated prisma/schema.prisma file');
console.log('  2. Make any necessary manual adjustments');
console.log('  3. Run: npm run db:apply-custom-sql');
console.log('  4. If everything looks good, delete the backup file\n');
