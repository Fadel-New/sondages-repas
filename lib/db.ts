// lib/db.ts
// Mettre à jour ce fichier pour s'assurer que la base de données a les bonnes permissions
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

function checkDbPermissions() {
  // In production, validate that we have a proper PostgreSQL URL
  if (process.env.NODE_ENV === 'production') {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.error('ERROR: DATABASE_URL environment variable is not set in production!');
      console.error('Please set DATABASE_URL in your Vercel environment variables.');
      // Don't throw error here to allow the app to at least start, but it will fail on DB access
    } else if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
      console.error('ERROR: DATABASE_URL must start with postgresql:// or postgres://');
      console.error('Current DATABASE_URL format is invalid for PostgreSQL.');
      console.error('Please update your Vercel environment variables.');
      // Don't throw error here to allow the app to at least start
    } else {
      console.log('PostgreSQL connection URL format validated');
    }
    return;
  }

  // Obtenir le chemin de la base de données de l'URL de connexion
  const dbUrl = process.env.DATABASE_URL || 'file:/tmp/sondages_repas.db';
  
  // Extraire le chemin du fichier de l'URL
  const match = dbUrl.match(/file:(.*)/);
  if (match && match[1]) {
    const dbPath = match[1];
    
    try {
      // Vérifier si le fichier existe
      if (fs.existsSync(dbPath)) {
        // Tenter d'ouvrir le fichier en mode écriture pour vérifier les permissions
        const fd = fs.openSync(dbPath, 'r+');
        fs.closeSync(fd);
        console.log('Base de données accessible en écriture:', dbPath);
      } else {
        console.log('Le fichier de base de données n\'existe pas encore:', dbPath);
        // Le répertoire parent existe-t-il et est-il accessible en écriture?
        const dirPath = dbPath.substring(0, dbPath.lastIndexOf('/'));
        if (dirPath && !fs.existsSync(dirPath)) {
          console.log('Création du répertoire parent:', dirPath);
          fs.mkdirSync(dirPath, { recursive: true });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions de la base de données:', error);
    }
  }
}

// Vérifier les permissions au démarrage
checkDbPermissions();

// Log the DATABASE_URL at the point of potential PrismaClient instantiation
if (process.env.NODE_ENV === 'production') {
  console.log('[lib/db.ts] Production mode: Attempting to initialize Prisma Client for PostgreSQL.');
  console.log('[lib/db.ts] DATABASE_URL from env:', process.env.DATABASE_URL);
} else {
  console.log('[lib/db.ts] Development mode: Attempting to initialize Prisma Client for SQLite.');
  console.log('[lib/db.ts] DATABASE_URL from env:', process.env.DATABASE_URL);
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  try {
    console.log('[lib/db.ts] Initializing PrismaClient for production (PostgreSQL)...');
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL, // Ensure Prisma uses the runtime env var
        },
      },
    });
    console.log('[lib/db.ts] PrismaClient for production initialized successfully.');
  } catch (e: any) {
    console.error('[lib/db.ts] Error initializing PrismaClient for production:', e);
    console.error('[lib/db.ts] Failing DATABASE_URL was:', process.env.DATABASE_URL);
    // It's crucial to see this error in Vercel logs
    throw new Error(`Failed to initialize Prisma Client in production: ${e.message}. DATABASE_URL: ${process.env.DATABASE_URL}`);
  }
} else {
  // Development or other environment: use SQLite
  try {
    console.log('[lib/db.ts] Initializing PrismaClient for development (SQLite)...');
    prisma = new PrismaClient();
    console.log('[lib/db.ts] PrismaClient for development initialized successfully.');
  } catch (e: any) {
    console.error('[lib/db.ts] Error initializing PrismaClient for development:', e);
    throw new Error(`Failed to initialize Prisma Client in development: ${e.message}`);
  }
}

export default prisma;
