// baseline-postgres.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Creating a baseline migration for PostgreSQL...');

// Step 1: Make sure we have a clean state
try {
  console.log('Cleaning up existing migrations folder...');
  if (fs.existsSync(path.join(__dirname, '../prisma/migrations'))) {
    fs.rmSync(path.join(__dirname, '../prisma/migrations'), { recursive: true, force: true });
  }
} catch (error) {
  console.error('Error cleaning migrations folder:', error);
}

// Step 2: Create baseline migration that matches the current database schema
try {
  console.log('Creating baseline migration...');
  execSync('npx prisma migrate resolve --applied "20250528142425_initial_postgresql_setup"', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  // Optional: Create an empty migration file
  const migrationsDir = path.join(__dirname, '../prisma/migrations/20250528142425_initial_postgresql_setup');
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(migrationsDir, 'migration.sql'),
    '-- This is an empty migration file\n-- It represents the initial state of the database\n'
  );
  
  // Create migration_lock.toml
  fs.writeFileSync(
    path.join(__dirname, '../prisma/migrations/migration_lock.toml'),
    'provider = "postgresql"\n'
  );
} catch (error) {
  console.error('Failed to create baseline migration:', error);
  process.exit(1);
}

// Step 3: Generate the Prisma client
try {
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('Prisma client generated successfully');
} catch (error) {
  console.error('Failed to generate Prisma client:', error);
  process.exit(1);
}

console.log('PostgreSQL baseline completed successfully!');
