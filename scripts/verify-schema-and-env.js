// scripts/verify-schema-and-env.js
/**
 * This script verifies that the schema.prisma and .env files are aligned correctly
 */
const fs = require('fs');
const path = require('path');

console.log('Verifying Schema and Environment Configuration');
console.log('=============================================');

// Paths
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
const envPath = path.join(__dirname, '../.env');

// Read files
try {
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  console.log('Read schema.prisma successfully');
  
  // Check provider in schema
  const providerMatch = schemaContent.match(/provider\s*=\s*"([^"]+)"/);
  if (providerMatch) {
    console.log(`Prisma provider in schema: ${providerMatch[1]}`);
    
    if (providerMatch[1] === 'postgresql') {
      console.log('✅ Provider is correct (postgresql)');
    } else {
      console.error(`❌ Provider is incorrect: ${providerMatch[1]}, should be postgresql`);
    }
  } else {
    console.error('❌ Could not find provider in schema file');
  }
  
  // Check DATABASE_URL and DIRECT_URL in env
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log('Read .env file successfully');
    
    const dbUrlMatch = envContent.match(/DATABASE_URL="([^"]+)"/);
    if (dbUrlMatch) {
      const dbUrl = dbUrlMatch[1];
      console.log(`DATABASE_URL prefix: ${dbUrl.substring(0, 25)}...`);
      
      if (dbUrl.startsWith('postgresql://')) {
        console.log('✅ DATABASE_URL starts with postgresql://');
      } else {
        console.error('❌ DATABASE_URL does not start with postgresql://, found:', dbUrl.split('://')[0] + '://');
      }
    } else {
      console.error('❌ Could not find DATABASE_URL in .env file');
    }
    
    const directUrlMatch = envContent.match(/DIRECT_URL="([^"]+)"/);
    if (directUrlMatch) {
      const directUrl = directUrlMatch[1];
      console.log(`DIRECT_URL prefix: ${directUrl.substring(0, 25)}...`);
      
      if (directUrl.startsWith('postgresql://')) {
        console.log('✅ DIRECT_URL starts with postgresql://');
      } else {
        console.error('❌ DIRECT_URL does not start with postgresql://, found:', directUrl.split('://')[0] + '://');
      }
    } else {
      console.warn('⚠️ Could not find DIRECT_URL in .env file');
    }
  } else {
    console.error('❌ .env file not found');
  }
} catch (error) {
  console.error('Error reading files:', error);
}

// Let's introspect the actual Prisma schema in memory if the @prisma/client is available
try {
  // Try to require @prisma/client
  const { Prisma } = require('@prisma/client');
  
  console.log('\nInspecting Prisma client configuration:');
  console.log('--------------------------------------');
  
  // Log the Prisma datamodel
  console.log('Prisma data model:', Prisma.dmmf.datamodel ? '✅ Available' : '❌ Not available');
  
  // Log the provider in the generated client
  const configuredProvider = Prisma.dmmf.dataSourceName;
  console.log('Provider configured in client:', configuredProvider || 'Not found');
  
  // Basic validation
  if (configuredProvider === 'postgresql') {
    console.log('✅ Provider in Prisma client is correct (postgresql)');
  } else if (configuredProvider === 'db' || !configuredProvider) {
    console.warn('⚠️ Provider name is generic or not found, check dataSourceName');
  } else {
    console.error(`❌ Provider in Prisma client is incorrect: ${configuredProvider}, should be postgresql`);
  }
  
} catch (error) {
  console.error('Could not inspect Prisma client configuration:', error.message);
}

console.log('\nVerification complete! If you see any errors above, please fix them.');
