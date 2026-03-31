/**
 * Script to reset entire database - DELETE ALL TABLES
 * ⚠️ WARNING: This will permanently delete all data!
 * Use with caution - requires confirmation
 */

const { PrismaClient } = require('@prisma/client');
const readline = require('readline');

const prisma = new PrismaClient();

/**
 * Ask user for confirmation
 */
function askConfirmation(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

/**
 * Get list of all tables
 */
async function getAllTables() {
  try {
    const result = await prisma.$queryRaw`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `;
    return result.map(row => row.tablename);
  } catch (error) {
    console.error('Error fetching tables:', error.message);
    return [];
  }
}

/**
 * Drop all tables with CASCADE
 */
async function dropAllTables(tables) {
  for (const table of tables) {
    try {
      console.log(`  Dropping table: ${table}`);
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
      console.log(`  ✓ Dropped: ${table}`);
    } catch (error) {
      console.error(`  ✗ Error dropping ${table}:`, error.message);
    }
  }
}

/**
 * Main reset function
 */
async function resetDatabase() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║           🚨 DATABASE RESET - DELETE ALL DATA 🚨           ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('⚠️  THIS WILL PERMANENTLY DELETE ALL TABLES AND DATA!');
  console.log('⚠️  This action CANNOT be undone!\n');

  // Get all tables first
  console.log('📋 Fetching database tables...\n');
  const tables = await getAllTables();

  if (tables.length === 0) {
    console.log('ℹ️  No tables found. Database is already empty.');
    await prisma.$disconnect();
    return;
  }

  console.log(`Found ${tables.length} table(s) to drop:`);
  tables.forEach(table => console.log(`  • ${table}`));
  console.log('');

  // Ask for confirmation
  const confirmed = await askConfirmation(
    '⚠️  Type "yes" to confirm deletion of ALL tables: '
  );

  if (!confirmed) {
    console.log('\n❌ Reset cancelled. No data was deleted.');
    await prisma.$disconnect();
    return;
  }

  // Second confirmation - extra safety
  const doubleConfirm = await askConfirmation(
    '🚨 Are you ABSOLUTELY SURE? Type "yes" again to confirm: '
  );

  if (!doubleConfirm) {
    console.log('\n❌ Reset cancelled. No data was deleted.');
    await prisma.$disconnect();
    return;
  }

  try {
    console.log('\n🗑️  Dropping all tables...\n');
    await dropAllTables(tables);

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║           ✅ Database reset successfully!                  ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log('Next steps:');
    console.log('  1. Run: npm run db:full-setup');
    console.log('  2. Or:  npm run db:full-setup:seed (with seed data)');
    console.log('');
  } catch (error) {
    console.error('\n❌ Error during reset:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  resetDatabase().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { resetDatabase };
