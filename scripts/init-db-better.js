// scripts/init-db-better.js
// Utilise better-sqlite3 qui est plus robuste et synchrone
// Ce qui facilite la gestion des erreurs et des permissions
const fs = require('fs');
const path = require('path');
const BetterSqlite3 = require('better-sqlite3');

// Récupérer les variables d'environnement du fichier .env.local s'il existe
try {
  const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
  envContent.split('\n').forEach(line => {
    if (!line || line.startsWith('#')) return;
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      const value = valueParts.join('=').trim().replace(/^"(.*)"$/, '$1');
      process.env[key.trim()] = value;
    }
  });
  console.log('Variables d\'environnement chargées depuis .env.local');
} catch (error) {
  console.log('Pas de fichier .env.local ou erreur de lecture, utilisation des variables d\'environnement du système');
}

// Chemin de la base de données de schema.prisma
const dbPath = '/tmp/sondages_repas.db';
console.log(`Initialisation de la base de données à ${dbPath}`);

// Vérifier que le répertoire /tmp existe
if (!fs.existsSync('/tmp')) {
  try {
    fs.mkdirSync('/tmp', { recursive: true });
    console.log('Répertoire /tmp créé avec succès');
  } catch (error) {
    console.error('Erreur lors de la création du répertoire /tmp:', error.message);
    process.exit(1);
  }
}

// Supprimer la base de données si elle existe
if (fs.existsSync(dbPath)) {
  try {
    fs.unlinkSync(dbPath);
    console.log('Base de données existante supprimée');
  } catch (error) {
    console.error('Erreur lors de la suppression de la base de données:', error.message);
    process.exit(1);
  }
}

try {
  // Créer une nouvelle base de données
  const db = new BetterSqlite3(dbPath, { verbose: console.log });
  console.log('Base de données créée avec succès');
  
  // Définir les permissions sur le fichier
  try {
    fs.chmodSync(dbPath, 0o666);
    console.log('Permissions de la base de données définies à 666 (rw-rw-rw-)');
  } catch (error) {
    console.error('Attention: Impossible de définir les permissions sur le fichier:', error.message);
    console.log('Continuing with default permissions...');
  }
  
  // Désactiver les clés étrangères pendant l'initialisation
  db.pragma('foreign_keys = OFF');
  
  // Créer la table Admin
  console.log('Création de la table Admin...');
  db.exec(`
    CREATE TABLE "Admin" (
      "id" INTEGER PRIMARY KEY AUTOINCREMENT,
      "username" TEXT NOT NULL UNIQUE,
      "password" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );
  `);
  console.log('Table Admin créée avec succès');
  
  // Insérer l'admin par défaut
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
  
  const insertAdmin = db.prepare(`
    INSERT INTO "Admin" (username, password, updatedAt)
    VALUES (?, ?, datetime('now'))
  `);
  
  const adminResult = insertAdmin.run(adminUsername, adminPassword);
  if (adminResult.changes === 1) {
    console.log(`Admin "${adminUsername}" créé avec succès`);
  } else {
    console.error(`Erreur lors de la création de l'admin: aucune ligne insérée`);
  }
  
  // Créer la table SurveyResponse
  console.log('Création de la table SurveyResponse...');
  db.exec(`
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
  `);
  console.log('Table SurveyResponse créée avec succès');
  
  // Réactiver les clés étrangères
  db.pragma('foreign_keys = ON');
  
  // Fermer la base de données
  db.close();
  console.log('Initialisation de la base de données terminée avec succès');
} catch (error) {
  console.error('Erreur lors de l\'initialisation de la base de données:', error.message);
  process.exit(1);
}
