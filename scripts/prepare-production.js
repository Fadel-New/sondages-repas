// scripts/prepare-production.js
// This script will create a production-ready schema.prisma file for Postgres

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path to the existing schema
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
// Path to the production schema
const productionSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.production.prisma');

// Read the current schema
let schema = fs.readFileSync(schemaPath, 'utf8');

// Replace sqlite with postgresql
schema = schema.replace(
  'provider = "sqlite"',
  'provider = "postgresql"'
);

// Write the production schema
fs.writeFileSync(productionSchemaPath, schema);

console.log('Production schema created at:', productionSchemaPath);

// Offer to apply the changes
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Apply these changes to your main schema.prisma file? (y/n) ', response => {
  if (response.toLowerCase() === 'y') {
    // Backup original schema
    const backupPath = path.join(__dirname, '..', 'prisma', 'schema.sqlite.backup');
    fs.copyFileSync(schemaPath, backupPath);
    console.log('Original schema backed up to:', backupPath);
    
    // Replace with production schema
    fs.copyFileSync(productionSchemaPath, schemaPath);
    console.log('Schema updated to use PostgreSQL');
    
    // Generate client
    try {
      console.log('Generating Prisma Client...');
      execSync('npx prisma generate', { stdio: 'inherit' });
      console.log('Prisma Client generated successfully');
    } catch (error) {
      console.error('Error generating Prisma Client:', error);
    }
  } else {
    console.log('No changes applied. You can manually update your schema when ready.');
  }
  
  console.log('\nDEPLOYMENT STEPS:');
  console.log('1. Set DATABASE_URL environment variable in your Vercel project settings');
  console.log('2. Make sure JWT_SECRET is set in your Vercel environment variables');
  console.log('3. Deploy your application to Vercel');
  
  readline.close();
});
