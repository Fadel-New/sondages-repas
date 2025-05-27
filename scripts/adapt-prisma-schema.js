// scripts/adapt-prisma-schema.js
// Ce script adapte le schema.prisma en fonction de l'environnement (dev ou production)

const fs = require('fs');
const path = require('path');

// Chemin vers le fichier schema.prisma
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

// Fonction principale
function adaptSchema() {
  console.log('Adapting Prisma schema based on environment...');
  
  // Déterminer l'environnement
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  
  // Lire le contenu du schema actuel
  let schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  if (isProduction) {
    console.log('Production environment detected, setting datasource to PostgreSQL');
    // Pour la production, remplacer le provider par PostgreSQL
    schemaContent = schemaContent.replace(
      /provider\s*=\s*"sqlite"/,
      'provider = "postgresql"'
    );
  } else {
    console.log('Development environment detected, setting datasource to SQLite');
    // Pour le développement, remplacer le provider par SQLite
    schemaContent = schemaContent.replace(
      /provider\s*=\s*"postgresql"/,
      'provider = "sqlite"'
    );
  }
  
  // Écrire le schema modifié
  fs.writeFileSync(schemaPath, schemaContent);
  
  console.log(`Prisma schema updated for ${isProduction ? 'production' : 'development'}`);
}

// Exécuter la fonction
try {
  adaptSchema();
} catch (error) {
  console.error('Error adapting Prisma schema:', error);
  process.exit(1);
}
