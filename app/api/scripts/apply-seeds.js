/**
 * Script to apply seed data from SQL files
 * Intended to be run after initial database setup
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Path to seeds directory
const DATABASE_PATH = path.join(__dirname, '../../database');
const SEEDS_PATH = path.join(DATABASE_PATH, 'seeds');

/**
 * Execute a SQL seed file
 */
async function executeSeedFile(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf-8');
    console.log(`  Seeding: ${path.basename(filePath)}`);
    await prisma.$executeRawUnsafe(sql);
    console.log(`  ✓ Successfully seeded: ${path.basename(filePath)}`);
    return true;
  } catch (error) {
    console.error(`  ✗ Error seeding ${path.basename(filePath)}:`, error.message);
    return false;
  }
}

/**
 * Apply all seed files
 */
async function seedDatabase() {
  try {
    if (!fs.existsSync(SEEDS_PATH)) {
      console.log('⚠  Seeds directory not found. Skipping seeding.');
      return true;
    }

    const files = fs.readdirSync(SEEDS_PATH)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Alphabetical order (files should be named to ensure correct order)

    if (files.length === 0) {
      console.log('⚠  No seed files found.');
      return true;
    }

    console.log(`\n📚 Seeding database with ${files.length} seed file(s)...\n`);

    let successCount = 0;
    const failedFiles = [];

    for (const file of files) {
      const success = await executeSeedFile(path.join(SEEDS_PATH, file));
      if (success) {
        successCount++;
      } else {
        failedFiles.push(file);
      }
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    if (failedFiles.length === 0) {
      console.log(`✅ All ${successCount} seed file(s) applied successfully!`);
      return true;
    } else {
      console.error(`✗ ${failedFiles.length} seed file(s) failed:`);
      failedFiles.forEach(f => console.error(`   - ${f}`));
      return false;
    }
  } catch (error) {
    console.error('\n❌ Fatal error during seeding:', error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
