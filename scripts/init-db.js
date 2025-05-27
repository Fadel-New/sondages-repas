// scripts/init-db.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Vérifions si le fichier de la base de données existe
const dbPath = '/tmp/sondages_repas.db';
if (fs.existsSync(dbPath)) {
  console.log('Suppression de la base de données existante...');
  fs.unlinkSync(dbPath);
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
        username: 'admin',
        password: 'adminpass', // Dans une vraie application, hachez ce mot de passe
        createdAt: new Date(),
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
