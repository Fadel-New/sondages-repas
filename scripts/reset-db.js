const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    console.log('Resetting database...');
    
    // Force reset the database with the current schema
    await prisma.$executeRawUnsafe(`
      PRAGMA foreign_keys = OFF;
      
      DROP TABLE IF EXISTS "SurveyResponse";
      
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
      
      PRAGMA foreign_keys = ON;
    `);
    
    console.log('Database reset successfully!');
  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
