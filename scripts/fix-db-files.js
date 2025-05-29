// scripts/fix-db-files.js
const fs = require('fs');
const path = require('path');

console.log('Correction des fichiers de connexion à la base de données...');

// Dossier lib contenant les fichiers de connexion à la base de données
const libDir = path.join(__dirname, '../lib');

// Renommer les anciens fichiers avec un suffixe .bak
const filesToBackup = [
  'db.new.ts',
  'db.new.postgres.ts',
];

filesToBackup.forEach(file => {
  const filePath = path.join(libDir, file);
  if (fs.existsSync(filePath)) {
    const backupPath = `${filePath}.bak`;
    console.log(`Sauvegarde de ${file} vers ${file}.bak`);
    fs.renameSync(filePath, backupPath);
  }
});

// Vérifier si le fichier db.ts correct existe
const mainDbFilePath = path.join(libDir, 'db.ts');
if (!fs.existsSync(mainDbFilePath)) {
  console.error('Erreur: Le fichier db.ts est manquant!');
  process.exit(1);
}

// Lire le contenu du fichier db.ts actuel
const dbContent = fs.readFileSync(mainDbFilePath, 'utf8');

// Vérifier que le contenu fait référence à PostgreSQL et pas à SQLite
if (dbContent.includes('file:') || dbContent.includes('sqlite')) {
  console.warn('Attention: Le fichier db.ts contient encore des références à SQLite!');
  console.log('Application des corrections nécessaires...');
  
  // Contenu corrigé pour db.ts
  const correctedContent = `// lib/db.ts - Corrigé automatiquement le ${new Date().toISOString()}
import { PrismaClient } from '@prisma/client';

function checkDbConnectionUrl() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error('ERROR: DATABASE_URL environment variable is not set!');
    console.error('Please set DATABASE_URL in your environment variables.');
    return;
  }
  
  if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
    console.error('ERROR: DATABASE_URL must start with postgresql:// or postgres://');
    console.error('Current DATABASE_URL format is invalid for PostgreSQL.');
    console.error('Please update your environment variables.');
    return;
  }
  
  console.log('PostgreSQL connection URL format validated');
}

// Vérifier l'URL de connexion au démarrage
checkDbConnectionUrl();

// Log the DATABASE_URL type at initialization
console.log(\`[lib/db.ts] \${process.env.NODE_ENV || 'development'} mode: Initializing Prisma Client for PostgreSQL.\`);
console.log('[lib/db.ts] DATABASE_URL type:', process.env.DATABASE_URL?.substring(0, 15) + '...');

let prisma: PrismaClient;

try {
  console.log('[lib/db.ts] Initializing PrismaClient for PostgreSQL...');
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
  console.log('[lib/db.ts] PrismaClient initialized successfully.');
} catch (e: any) {
  console.error('[lib/db.ts] Error initializing PrismaClient:', e);
  console.error('[lib/db.ts] Failing DATABASE_URL type was:', process.env.DATABASE_URL?.substring(0, 15) + '...');
  throw new Error(\`Failed to initialize Prisma Client: \${e.message}\`);
}

export default prisma;`;

  // Sauvegarder le fichier db.ts original
  const backupPath = `${mainDbFilePath}.bak`;
  console.log(`Sauvegarde de db.ts vers db.ts.bak`);
  fs.writeFileSync(backupPath, dbContent);
  
  // Écrire le contenu corrigé dans db.ts
  console.log('Écriture du nouveau contenu dans db.ts');
  fs.writeFileSync(mainDbFilePath, correctedContent);
} else {
  console.log('Le fichier db.ts semble correctement configuré pour PostgreSQL.');
}

console.log('✅ Correction des fichiers de connexion à la base de données terminée.');
