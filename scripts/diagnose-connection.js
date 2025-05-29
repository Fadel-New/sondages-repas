// scripts/diagnose-connection.js
/**
 * Comprehensive script to diagnose PostgreSQL connection issues 
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('===== PostgreSQL Connection Diagnostic Tool =====');
console.log('Date:', new Date().toString());
console.log('Node version:', process.version);

// Check environment variables
console.log('\n1. Checking environment variables...');
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  console.log('Found .env file:', envPath);
  
  // Read the file but don't print full values for security
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envLines = envContent.split('\n');
  
  const dbUrlLine = envLines.find(line => line.startsWith('DATABASE_URL='));
  const directUrlLine = envLines.find(line => line.startsWith('DIRECT_URL='));
  
  if (dbUrlLine) {
    console.log('DATABASE_URL found, length:', dbUrlLine.length);
    console.log('DATABASE_URL starts with:', dbUrlLine.substring(0, 30) + '...');
    
    // Check for common special characters that may need escaping
    const specialChars = ['%', '@', '&', '#', '+', ':'];
    specialChars.forEach(char => {
      if (dbUrlLine.includes(char)) {
        console.log(`- Contains special character: ${char}`);
      }
    });
  } else {
    console.error('⚠️ DATABASE_URL not found in .env file!');
  }
  
  if (directUrlLine) {
    console.log('DIRECT_URL found, length:', directUrlLine.length);
    console.log('DIRECT_URL starts with:', directUrlLine.substring(0, 30) + '...');
  } else {
    console.warn('⚠️ DIRECT_URL not found in .env file!');
  }
} else {
  console.error('⚠️ No .env file found at:', envPath);
}

// Check Prisma schema
console.log('\n2. Checking Prisma schema...');
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
if (fs.existsSync(schemaPath)) {
  console.log('Found schema file:', schemaPath);
  
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  // Check datasource provider
  const providerMatch = schemaContent.match(/provider\s*=\s*"([^"]+)"/);
  if (providerMatch) {
    console.log('Prisma provider:', providerMatch[1]);
    if (providerMatch[1] !== 'postgresql') {
      console.error('⚠️ Provider is not postgresql!');
    }
  } else {
    console.error('⚠️ Could not find provider in schema file!');
  }
  
  // Check if directUrl is defined
  const hasDirectUrl = schemaContent.includes('directUrl');
  console.log('directUrl defined in schema:', hasDirectUrl ? 'Yes' : 'No');
} else {
  console.error('⚠️ No schema.prisma file found at:', schemaPath);
}

// Try to test the database connection directly
console.log('\n3. Checking database connection...');
try {
  console.log('Testing database connection directly...');
  
  // Add a delay to make sure console output is complete
  setTimeout(() => {
    try {
      const { PrismaClient } = require('@prisma/client');
      console.log('PrismaClient imported successfully');
      
      const prisma = new PrismaClient();
      console.log('PrismaClient instantiated successfully');
      
      // Try a simple query to test the connection
      console.log('Running query...');
      prisma.$queryRaw`SELECT 1 as test`
        .then(result => {
          console.log('Query successful, result:', result);
          console.log('✅ Database connection working correctly');
          
          // Clean up and exit
          prisma.$disconnect()
            .then(() => process.exit(0))
            .catch(err => {
              console.error('Error disconnecting:', err);
              process.exit(1);
            });
        })
        .catch(err => {
          console.error('❌ Query failed:', err);
          process.exit(1);
        });
    } catch (err) {
      console.error('❌ Error in database connection test:', err);
      process.exit(1);
    }
  }, 1000);
} catch (err) {
  console.error('❌ Failed to test database connection:', err);
  process.exit(1);
}
