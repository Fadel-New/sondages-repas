// scripts/create-tables.js
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Chemin de la base de données
const dbPath = '/tmp/sondages_repas.db';
console.log(`Initialisation de la base de données à ${dbPath}`);

// Créer le répertoire /tmp s'il n'existe pas (rarement nécessaire sur Linux)
if (!fs.existsSync('/tmp')) {
  fs.mkdirSync('/tmp', { recursive: true });
  console.log('Répertoire /tmp créé');
}

// Supprimer la base de données si elle existe
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Base de données existante supprimée');
}

// Créer une nouvelle base de données
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur lors de la création de la base de données:', err.message);
    process.exit(1);
  }
  console.log('Base de données créée avec succès');
  
  // Attendre un peu que le fichier soit créé avant de modifier les permissions
  setTimeout(() => {
    try {
      if (fs.existsSync(dbPath)) {
        fs.chmodSync(dbPath, 0o666);
        console.log('Permissions de la base de données définies à 666 (rw-rw-rw-)');
      } else {
        console.error('Le fichier de base de données n\'existe pas encore, impossible de modifier les permissions');
      }
    } catch (error) {
      console.error('Erreur lors de la modification des permissions:', error);
    }
  }, 500); // Attendre 500ms
});

// Fonction pour créer les tables
function createTables() {
  console.log('Création des tables...');
  
  // Créer les tables
  db.serialize(() => {
    // Désactiver les clés étrangères pendant l'initialisation
    db.run('PRAGMA foreign_keys = OFF;');
    
    // Créer la table Admin
    console.log('Création de la table Admin...');
    db.run(`
      CREATE TABLE "Admin" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "username" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `, function(err) {
      if (err) {
        console.error('Erreur lors de la création de la table Admin:', err.message);
      } else {
        console.log('Table Admin créée avec succès');
        
        // Insérer l'admin par défaut
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
        
        db.run(`
          INSERT INTO "Admin" (username, password, updatedAt)
          VALUES (?, ?, datetime('now'))
        `, [adminUsername, adminPassword], function(err) {
          if (err) {
            console.error('Erreur lors de l\'insertion de l\'admin:', err.message);
          } else {
            console.log(`Admin "${adminUsername}" créé avec succès`);
          }
        });
      }
    });
    
    // Créer la table SurveyResponse
    console.log('Création de la table SurveyResponse...');
    db.run(`
      CREATE TABLE "SurveyResponse" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "ville" TEXT NOT NULL,
        "villeAutre" TEXT,
        "situationProfessionnelle" TEXT NOT NULL,
        "situationProfAutre" TEXT,
        "mangeExterieurFreq" TEXT NOT NULL,
        "tempsPreparationRepas" TEXT NOT NULL,
        "typesRepas" TEXT NOT NULL,
        "typesRepasAutre" TEXT,
        "defisAlimentation" TEXT NOT NULL,
        "defisAlimentationAutre" TEXT,
        "satisfactionAccesRepas" INTEGER NOT NULL,
        "interetSolutionRepas" TEXT NOT NULL,
        "aspectsImportants" TEXT NOT NULL,
        "aspectsImportantsAutre" TEXT,
        "budgetJournalierRepas" TEXT NOT NULL,
        "prixMaxRepas" TEXT NOT NULL,
        "budgetMensuelAbo" TEXT NOT NULL,
        "commentaires" TEXT
      );
    `, function(err) {
      if (err) {
        console.error('Erreur lors de la création de la table SurveyResponse:', err.message);
      } else {
        console.log('Table SurveyResponse créée avec succès');
      }
      
      // Réactiver les clés étrangères
      db.run('PRAGMA foreign_keys = ON;');
      
      // Fermer la base de données à la fin
      db.close((err) => {
        if (err) {
          console.error('Erreur lors de la fermeture de la base de données:', err.message);
          process.exit(1);
        }
        console.log('Initialisation de la base de données terminée avec succès');
      });
    });
  });
}

// Attendre que la base de données soit prête avant de créer les tables
setTimeout(createTables, 1000);
