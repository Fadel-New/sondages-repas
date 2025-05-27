// scripts/prepare-production.js
// This script will create a production-ready schema.prisma file for Postgres

const fs = require('fs');
const path = require('path');

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

// Add additional Postgres configuration if needed
schema = schema.replace(
  'datasource db {',
  'datasource db {'
);

// Write the production schema
fs.writeFileSync(productionSchemaPath, schema);

console.log('Production schema created at:', productionSchemaPath);
console.log('When ready for production:');
console.log('1. Rename schema.production.prisma to schema.prisma');
console.log('2. Update DATABASE_URL in your Vercel environment variables');
console.log('3. Make sure to run prisma migrate deploy before or during deployment');
