// scripts/cleanup-sqlite.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Ce script nettoie les fichiers obsolètes liés à SQLite
 */

console.log('Nettoyage des fichiers obsolètes liés à SQLite...');

// Liste des fichiers à supprimer
const filesToRemove = [
  // Scripts obsolètes
  'scripts/init-sqlite-direct.sh',
  'scripts/init-db.js',
  'scripts/init-db-better.js',
  'scripts/init-db-root.js',
  'scripts/init-db-tmp.js',
  'scripts/create-tables.js',
  'scripts/reset-db.js',
  'scripts/switch-db-mode.sh',
  'scripts/adapt-prisma-schema.js',
  
  // Fichiers de configuration SQLite
  'lib/db.sqlite.ts',
  'prisma/schema.sqlite.prisma',
  
  // Fichiers de base de données SQLite
  'prisma/dev.db',
  'prisma/dev.db-journal',
  'prisma.db',
];

// Supprimer les fichiers s'ils existent
filesToRemove.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  
  if (fs.existsSync(fullPath)) {
    try {
      if (fs.lstatSync(fullPath).isDirectory()) {
        // Si c'est un répertoire, le supprimer récursivement
        fs.rmSync(fullPath, { recursive: true, force: true });
      } else {
        // Sinon supprimer le fichier
        fs.unlinkSync(fullPath);
      }
      console.log(`✅ Supprimé: ${file}`);
    } catch (err) {
      console.error(`❌ Erreur lors de la suppression de ${file}:`, err.message);
    }
  } else {
    console.log(`⏭️ Ignoré (n'existe pas): ${file}`);
  }
});

// Supprimer les dépendances SQLite du package.json
console.log('Mise à jour du package.json pour supprimer les dépendances SQLite...');
try {
  execSync('npm uninstall sqlite sqlite3 better-sqlite3', { stdio: 'inherit' });
  console.log('✅ Dépendances SQLite supprimées du package.json');
} catch (err) {
  console.error('❌ Erreur lors de la suppression des dépendances SQLite:', err.message);
}

console.log('\nNettoyage terminé! Le projet utilise maintenant exclusivement PostgreSQL.');
