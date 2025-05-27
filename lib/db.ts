// lib/db.ts
// Mettre à jour ce fichier pour s'assurer que la base de données a les bonnes permissions
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

let prisma: PrismaClient;

// Fonction pour vérifier les permissions du fichier de base de données
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

try {
  if (process.env.NODE_ENV === 'production') {
    // Ensure we have a proper DATABASE_URL before initializing Prisma
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.error('Missing DATABASE_URL - Prisma initialization will fail');
    } else if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
      console.error(`Invalid DATABASE_URL format: ${dbUrl.substring(0, 10)}... - Must start with postgresql:// or postgres://`);
    }
    prisma = new PrismaClient();
    console.log('PrismaClient initialized for production with PostgreSQL');
  } else {
    // Prevent multiple instances of Prisma Client in development
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
  }
} catch (error) {
  console.error('Error initializing Prisma client:', error);
  // Create a proxy object that throws helpful errors when accessed
  prisma = new Proxy({} as PrismaClient, {
    get: function(target, prop) {
      return () => { 
        throw new Error(`Database access failed. Please check DATABASE_URL environment variable. Original error: ${error}`);
      };
    }
  });
}

export default prisma;
