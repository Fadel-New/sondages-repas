// Command to run: npm install better-sqlite3
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Make sure the directory exists
const dbDir = path.join(__dirname, '../prisma');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'dev.db');
console.log(`Creating/updating database at: ${dbPath}`);

// Remove existing database if it exists
if (fs.existsSync(dbPath)) {
  console.log('Removing existing database...');
  fs.unlinkSync(dbPath);
}

// Create a new database
const db = new Database(dbPath);

// Create tables
console.log('Creating tables...');

// Create Admin table
db.exec(`
CREATE TABLE "Admin" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  "username" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
`);

// Create SurveyResponse table
db.exec(`
CREATE TABLE "SurveyResponse" (
  "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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

// Add a sample admin user (username: admin, password: adminpassword)
console.log('Adding sample admin user...');
const insertAdmin = db.prepare(`
INSERT INTO "Admin" (username, password, updatedAt) VALUES (?, ?, ?)
`);
insertAdmin.run('admin', 'adminpassword', new Date().toISOString());

console.log('Database setup completed successfully!');
db.close();
