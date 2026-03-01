/**
 * Script to apply custom SQL objects (views, functions) after Prisma operations
 * This ensures that Prisma schema sync doesn't wipe out custom database objects
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Paths to custom SQL directories
const DATABASE_PATH = path.join(__dirname, '../../database');
const VIEWS_PATH = path.join(DATABASE_PATH, 'views');
const FUNCTIONS_PATH = path.join(DATABASE_PATH, 'functions');

/**
 * Execute a SQL file
 * @returns {boolean} true if successful, false if failed
 */
async function executeSqlFile(filePath, silent = false) {
  try {
    const sql = fs.readFileSync(filePath, 'utf-8');
    if (!silent) {
      console.log(`Executing: ${path.basename(filePath)}`);
    }
    await prisma.$executeRawUnsafe(sql);
    if (!silent) {
      console.log(`✓ Successfully applied: ${path.basename(filePath)}`);
    }
    return true;
  } catch (error) {
    if (!silent) {
      console.error(`✗ Error applying ${path.basename(filePath)}:`, error.message);
    }
    return false;
  }
}

/**
 * Execute all SQL files in a directory with dependency retry logic
 */
async function executeSqlDirectory(dirPath, label) {
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠ ${label} directory not found: ${dirPath}`);
    return;
  }

  const files = fs.readdirSync(dirPath)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Sort to ensure consistent order

  if (files.length === 0) {
    console.log(`⚠ No SQL files found in ${label}`);
    return;
  }

  console.log(`\n📁 Applying ${label}...`);
  
  const filePaths = files.map(file => path.join(dirPath, file));
  const maxRetries = 3;
  let remainingFiles = [...filePaths];
  let attempt = 1;

  // Try to apply all files, retrying failures (they might have dependencies)
  while (remainingFiles.length > 0 && attempt <= maxRetries) {
    if (attempt > 1) {
      console.log(`\n🔄 Retry attempt ${attempt} for ${remainingFiles.length} file(s) (dependencies may need to be resolved)...`);
    }

    const failedFiles = [];
    
    for (const filePath of remainingFiles) {
      const success = await executeSqlFile(filePath, attempt > 1);
      if (!success) {
        failedFiles.push(filePath);
      } else if (attempt > 1) {
        console.log(`✓ Successfully applied: ${path.basename(filePath)}`);
      }
    }

    remainingFiles = failedFiles;
    attempt++;

    // If we still have failures but made progress, continue
    if (remainingFiles.length > 0 && remainingFiles.length < filePaths.length) {
      continue;
    }
    
    // If no progress was made, break
    if (remainingFiles.length > 0 && attempt > 2) {
      break;
    }
  }

  if (remainingFiles.length > 0) {
    console.error(`\n❌ Failed to apply ${remainingFiles.length} file(s) after ${maxRetries} attempts:`);
    remainingFiles.forEach(f => console.error(`   - ${path.basename(f)}`));
    throw new Error(`Could not apply all ${label}`);
  }
}

/**
 * Main function to apply all custom SQL
 */
async function applyCustomSql() {
  try {
    console.log('🚀 Starting custom SQL application...\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Apply functions first (views might depend on them)
    await executeSqlDirectory(FUNCTIONS_PATH, 'Database Functions');

    // Apply views
    await executeSqlDirectory(VIEWS_PATH, 'Database Views');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ All custom SQL objects applied successfully!');
  } catch (error) {
    console.error('\n❌ Failed to apply custom SQL:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  applyCustomSql();
}

module.exports = { applyCustomSql };
