// lib/db.ts
// Mettre à jour ce fichier pour s'assurer que la base de données a les bonnes permissions
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

let prisma: PrismaClient;

// Fonction pour vérifier les permissions du fichier de base de données
function checkDbPermissions() {
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

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Prevent multiple instances of Prisma Client in development
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
