// scripts/init-db-root.js
// Ce script initialise la base de données SQLite directement à la racine du projet
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Chemin de la base de données dans le répertoire racine du projet
const dbPath = path.join(process.cwd(), 'prisma.db');
console.log(`Initialisation de la base de données à ${dbPath}`);

// Supprimer la base de données si elle existe déjà
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
  
  // Création des tables
  db.serialize(() => {
    // Table Admin
    db.run(`
      CREATE TABLE IF NOT EXISTS Admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT NOT NULL
      )
    `, function(err) {
      if (err) {
        console.error('Erreur lors de la création de la table Admin:', err.message);
      } else {
        console.log('Table Admin créée ou existante');
        
        // Insérer l'admin par défaut
        const stmt = db.prepare(`
          INSERT OR REPLACE INTO Admin (username, password, updatedAt)
          VALUES (?, ?, datetime('now'))
        `);
        
        stmt.run('admin', 'password123', function(err) {
          if (err) {
            console.error('Erreur lors de l\'insertion de l\'admin:', err.message);
          } else {
            console.log('Admin "admin" créé ou mis à jour');
          }
        });
        
        stmt.finalize();
      }
    });
    
    // Table SurveyResponse
    db.run(`
      CREATE TABLE IF NOT EXISTS SurveyResponse (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        ville TEXT NOT NULL,
        villeAutre TEXT,
        situationProfessionnelle TEXT NOT NULL,
        situationProfAutre TEXT,
        mangeExterieurFreq TEXT NOT NULL,
        tempsPreparationRepas TEXT NOT NULL,
        typesRepas TEXT NOT NULL,
        typesRepasAutre TEXT,
        defisAlimentation TEXT NOT NULL,
        defisAlimentationAutre TEXT,
        satisfactionAccesRepas INTEGER NOT NULL,
        interetSolutionRepas TEXT NOT NULL,
        aspectsImportants TEXT NOT NULL,
        aspectsImportantsAutre TEXT,
        budgetJournalierRepas TEXT NOT NULL,
        prixMaxRepas TEXT NOT NULL,
        budgetMensuelAbo TEXT NOT NULL,
        commentaires TEXT
      )
    `, function(err) {
      if (err) {
        console.error('Erreur lors de la création de la table SurveyResponse:', err.message);
      } else {
        console.log('Table SurveyResponse créée ou existante');
      }
      
      // Fermer la connexion
      db.close((err) => {
        if (err) {
          console.error('Erreur lors de la fermeture de la base de données:', err.message);
        } else {
          console.log('Initialisation de la base de données terminée avec succès');
          
          // Vérifier les permissions et les corriger si nécessaire
          try {
            fs.chmodSync(dbPath, 0o666);
            console.log('Permissions de la base de données définies à 666 (rw-rw-rw-)');
          } catch (error) {
            console.warn('Impossible de modifier les permissions du fichier:', error.message);
            console.log('Vous devrez peut-être définir les permissions manuellement');
          }
        }
      });
    });
  });
});
