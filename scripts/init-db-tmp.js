// scripts/init-db-tmp.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const { execSync } = require('child_process');
const bcrypt = require('bcryptjs');

// Chemin de la base de données
const dbPath = '/tmp/sondages_repas.db';

// Supprimer la base de données existante si elle existe
if (fs.existsSync(dbPath)) {
  console.log('Suppression de la base de données existante...');
  fs.unlinkSync(dbPath);
}

// Exécuter prisma db push pour créer les tables
try {
  console.log('Création des tables dans la base de données...');
  execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
} catch (error) {
  console.error('Erreur lors de la création des tables:', error);
  process.exit(1);
}

// Initialisation de la connexion Prisma
const prisma = new PrismaClient();

// Fonction d'initialisation
async function initDb() {
  try {
    console.log('Initialisation de la base de données...');
    
    // Création d'un admin par défaut
    await prisma.admin.create({
      data: {
        username: process.env.ADMIN_USERNAME || 'admin',
        password: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'password123', 10),
        updatedAt: new Date()
      }
    });
    
    console.log('Base de données initialisée avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécution de la fonction
initDb();
