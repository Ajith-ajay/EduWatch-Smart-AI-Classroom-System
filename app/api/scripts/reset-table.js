/**
 * Script to delete/clear specific table(s)
 * ⚠️ WARNING: This will permanently delete data from specified table(s)!
 * Use with caution - requires confirmation
 */

const { PrismaClient } = require('@prisma/client');
const readline = require('readline');
const path = require('path');

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
 * Prompt user for table name
 */
function promptTableName() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Enter table name to clear (e.g., "attendance_log"): ', (answer) => {
      rl.close();
      resolve(answer.trim());
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
 * Clear data from a specific table
 */
async function clearTable(tableName) {
  try {
    console.log(`  Clearing table: ${tableName}`);
    
    // Disable foreign key checks temporarily
    await prisma.$executeRawUnsafe('SET session_replication_role = replica;');
    
    // Delete all rows
    await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE;`
    );
    
    // Re-enable foreign key checks
    await prisma.$executeRawUnsafe('SET session_replication_role = default;');
    
    console.log(`  ✓ Cleared: ${tableName}`);
    return true;
  } catch (error) {
    console.error(`  ✗ Error clearing ${tableName}:`, error.message);
    return false;
  }
}

/**
 * Main function
 */
async function resetTable() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║           🗑️  CLEAR SPECIFIC TABLE(S)                      ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Get command line arguments
  const args = process.argv.slice(2);
  let tableName;

  if (args.length > 0) {
    tableName = args[0];
  } else {
    // Get list of tables to show user
    console.log('📋 Available tables:\n');
    const tables = await getAllTables();
    
    if (tables.length === 0) {
      console.log('ℹ️  No tables found in database.');
      await prisma.$disconnect();
      return;
    }

    tables.forEach(table => console.log(`  • ${table}`));
    console.log('');

    // Prompt for table name
    tableName = await promptTableName();
  }

  if (!tableName) {
    console.log('❌ No table name provided. Aborted.');
    await prisma.$disconnect();
    return;
  }

  // Verify table exists
  const tables = await getAllTables();
  if (!tables.includes(tableName)) {
    console.error(`❌ Table "${tableName}" does not exist!`);
    console.log('\nAvailable tables:');
    tables.forEach(table => console.log(`  • ${table}`));
    await prisma.$disconnect();
    return;
  }

  console.log(`\n⚠️  This will DELETE ALL DATA from: "${tableName}"`);
  console.log('⚠️  This action CANNOT be undone!\n');

  // Ask for confirmation
  const confirmed = await askConfirmation(
    `Type "yes" to confirm deletion from "${tableName}": `
  );

  if (!confirmed) {
    console.log('\n❌ Aborted. No data was deleted.');
    await prisma.$disconnect();
    return;
  }

  try {
    console.log(`\n🗑️  Clearing table: ${tableName}\n`);
    const success = await clearTable(tableName);

    if (success) {
      console.log(`\n✅ Table "${tableName}" has been cleared successfully!\n`);
    } else {
      console.log(`\n❌ Failed to clear table "${tableName}"\n`);
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  resetTable().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { clearTable };
