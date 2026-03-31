/**
 * Complete database setup script
 * Handles full database initialization including:
 * 1. Prisma schema push/migration
 * 2. Custom SQL objects (views, functions)
 * 3. Optional seeding
 */

const { execSync } = require('child_process');
const { applyCustomSql } = require('./apply-custom-sql');
const { seedDatabase } = require('./apply-seeds');

const args = process.argv.slice(2);
const shouldSeed = args.includes('--seed');
const useMigration = args.includes('--migrate');

/**
 * Execute shell command with output
 */
function exec(command, description) {
  console.log(`\n📦 ${description}...`);
  console.log(`   Command: ${command}\n`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✓ ${description} completed`);
    return true;
  } catch (error) {
    console.error(`✗ ${description} failed`);
    return false;
  }
}

/**
 * Main setup function
 */
async function fullSetup() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║        EduWatch Database Full Setup                       ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  let step = 1;

  // Step 1: Generate Prisma Client
  console.log(`\n[${step++}] Generating Prisma Client...`);
  if (!exec('npx prisma generate', 'Generate Prisma Client')) {
    console.error('\n❌ Setup failed at Prisma client generation');
    process.exit(1);
  }

  // Step 2: Push or Migrate Schema
  if (useMigration) {
    console.log(`\n[${step++}] Running Prisma Migrations...`);
    if (!exec('npx prisma migrate deploy', 'Apply Prisma Migrations')) {
      console.error('\n❌ Setup failed at Prisma migration');
      process.exit(1);
    }
  } else {
    console.log(`\n[${step++}] Pushing Prisma Schema to Database...`);
    if (!exec('npx prisma db push --skip-generate', 'Push Prisma Schema')) {
      console.error('\n❌ Setup failed at Prisma schema push');
      process.exit(1);
    }
  }

  // Step 3: Apply Custom SQL
  console.log(`\n[${step++}] Applying Custom SQL Objects...`);
  try {
    await applyCustomSql();
  } catch (error) {
    console.error('\n❌ Setup failed at custom SQL application');
    process.exit(1);
  }

  // Step 4: Optional Seeding
  if (shouldSeed) {
    console.log(`\n[${step++}] Seeding Database...`);
    try {
      const seedSuccess = await seedDatabase();
      if (!seedSuccess) {
        console.error('\n⚠ Warning: Seeding completed with some errors');
      }
    } catch (error) {
      console.error('\n⚠ Warning: Seeding failed, but continuing...');
    }
  }

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║        ✅ Database Setup Completed Successfully!           ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  console.log('Your database now includes:');
  console.log('  • Prisma-managed tables and relations');
  console.log('  • Custom database views');
  console.log('  • Custom database functions');
  if (shouldSeed) {
    console.log('  • Seed data');
  }
  console.log('');
}

// Run setup
fullSetup().catch((error) => {
  console.error('❌ Unexpected error during setup:', error);
  process.exit(1);
});
