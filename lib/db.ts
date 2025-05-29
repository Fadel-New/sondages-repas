// lib/db.ts
import { PrismaClient } from '@prisma/client';

function checkDbConnectionUrl() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error('ERROR: DATABASE_URL environment variable is not set!');
    console.error('Please set DATABASE_URL in your environment variables.');
    // Don't throw error here to allow the app to at least start, but it will fail on DB access
    return;
  }
  
  if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
    console.error('ERROR: DATABASE_URL must start with postgresql:// or postgres://');
    console.error('Current DATABASE_URL format is invalid for PostgreSQL.');
    console.error('Please update your environment variables.');
    return;
  }
  
  console.log('PostgreSQL connection URL format validated');
  
  // Check for DIRECT_URL for migrations
  const directUrl = process.env.DIRECT_URL;
  if (!directUrl && process.env.NODE_ENV === 'development') {
    console.warn('WARNING: DIRECT_URL environment variable is not set!');
    console.warn('This may cause issues when running migrations.');
  }
}

// Vérifier l'URL de connexion au démarrage
checkDbConnectionUrl();

// Log the DATABASE_URL at the point of PrismaClient instantiation
console.log(`[lib/db.ts] ${process.env.NODE_ENV || 'development'} mode: Initializing Prisma Client for PostgreSQL.`);
console.log('[lib/db.ts] DATABASE_URL type:', process.env.DATABASE_URL?.substring(0, 15) + '...');

let prisma: PrismaClient;

try {
  console.log('[lib/db.ts] Initializing PrismaClient for PostgreSQL...');
  // Added log output to debug connection URL
  console.log('[lib/db.ts] DATABASE_URL length:', process.env.DATABASE_URL?.length);
  console.log('[lib/db.ts] DIRECT_URL length:', process.env.DIRECT_URL?.length);
  
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL, // Ensure Prisma uses the runtime env var
      },
    },
    log: ['error', 'warn', 'info'], // Add more logging to debug issues
  });
  console.log('[lib/db.ts] PrismaClient initialized successfully.');
} catch (e: any) {
  console.error('[lib/db.ts] Error initializing PrismaClient:', e);
  console.error('[lib/db.ts] Failing DATABASE_URL type was:', process.env.DATABASE_URL?.substring(0, 15) + '...');
  // It's crucial to see this error in logs
  throw new Error(`Failed to initialize Prisma Client: ${e.message}`);
}

export default prisma;
