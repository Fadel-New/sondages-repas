// setup-postgres.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Setting up PostgreSQL database with Prisma...');

// Step 1: Make sure we have a clean state
try {
  console.log('Cleaning up existing migrations folder...');
  if (fs.existsSync(path.join(__dirname, '../prisma/migrations'))) {
    fs.rmSync(path.join(__dirname, '../prisma/migrations'), { recursive: true, force: true });
  }
} catch (error) {
  console.error('Error cleaning migrations folder:', error);
}

// Step 2: Reset the database and generate a fresh migration for PostgreSQL
try {
  console.log('Resetting the database and creating fresh PostgreSQL migration...');
  execSync('npx prisma migrate reset --force', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  console.log('Creating fresh PostgreSQL migration...');
  execSync('npx prisma migrate dev --name init_postgres --create-only', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
} catch (error) {
  console.error('Failed to create migration:', error);
  process.exit(1);
}

// Step 3: Check if the migration file was created
const migrationsDir = path.join(__dirname, '../prisma/migrations');
if (!fs.existsSync(migrationsDir)) {
  console.error('Migrations directory was not created properly');
  process.exit(1);
}

// Find the migration folder
const migrationFolders = fs.readdirSync(migrationsDir);
if (migrationFolders.length === 0) {
  console.error('No migration folders found');
  process.exit(1);
}

const latestMigrationDir = path.join(migrationsDir, migrationFolders[0]);
const sqlFilePath = path.join(latestMigrationDir, 'migration.sql');

if (!fs.existsSync(sqlFilePath)) {
  console.error('Migration SQL file not found:', sqlFilePath);
  process.exit(1);
}

console.log('Migration file created:', sqlFilePath);

// Step 4: Apply the migration
try {
  console.log('Applying migrations to the database...');
  execSync('npx prisma migrate deploy', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  console.log('Migration applied successfully');
} catch (error) {
  console.error('Failed to apply migration:', error);
  process.exit(1);
}

// Step 5: Generate the Prisma client
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

console.log('PostgreSQL setup completed successfully!');
