// scripts/test-db-connection.js
const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  console.log('Testing database connection...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 15) + '...' : 'undefined');
  console.log('DIRECT_URL:', process.env.DIRECT_URL ? process.env.DIRECT_URL.substring(0, 15) + '...' : 'undefined');
  
  try {
    const prisma = new PrismaClient();
    console.log('PrismaClient initialized');
    
    // Try to query the database
    console.log('Attempting to query the database...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Query result:', result);
    
    // Disconnect
    await prisma.$disconnect();
    console.log('✅ Database connection test successful!');
    return true;
  } catch (error) {
    console.error('❌ Error connecting to the database:');
    console.error(error);
    return false;
  }
}

testDatabaseConnection()
  .then(success => {
    console.log(success ? '✅ Database connection works!' : '❌ Database connection failed!');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
