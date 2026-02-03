// scripts/fix-prisma-schema.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Vérifions et corrigeons les fichiers de schéma Prisma...');

// Chemin vers les fichiers de schéma
const mainSchemaPath = path.join(__dirname, '../prisma/schema.prisma');
const productionSchemaPath = path.join(__dirname, '../prisma/schema.production.prisma');

// Contenu du schéma principal
const mainSchemaContent = `// This file was auto-generated and normalized on ${new Date().toISOString()}
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql" 
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") 
}

model Admin {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model SurveyResponse {
  id                       Int      @id @default(autoincrement())
  createdAt                DateTime @default(now())
  whatsappNumber           String
  mangeExterieurFreq       String
  tempsPreparationRepas    String
  typesRepas               String
  typesRepasAutre          String?
  defisAlimentation        String
  defisAlimentationAutre   String?
  satisfactionAccesRepas   Int
  interetSolutionRepas     String
  aspectsImportants        String
  aspectsImportantsAutre   String?
  budgetJournalierRepas    String
  prixMaxRepas             String
  budgetMensuelAbo         String
  commentaires             String?
  acceptePolitique         Boolean  @default(false)
}
`;

// S'assurer que le fichier schema.prisma principal est correct
console.log('Mise à jour du fichier schema.prisma principal...');
fs.writeFileSync(mainSchemaPath, mainSchemaContent);

// S'assurer que le fichier schema.production.prisma est cohérent
console.log('Mise à jour du fichier schema.production.prisma...');
const productionSchemaContent = mainSchemaContent.replace(
  'datasource db {',
  'datasource db {'
).replace(
  '  directUrl = env("DIRECT_URL") ',
  ''
);
fs.writeFileSync(productionSchemaPath, productionSchemaContent);

// Suppression des anciens artefacts générés par Prisma
console.log('Suppression de tout ancien artefact généré par Prisma...');
const nodePath = path.join(__dirname, '../node_modules/.prisma');
if (fs.existsSync(nodePath)) {
  fs.rmSync(nodePath, { recursive: true, force: true });
}

// Régénération du client Prisma
console.log('Régénération du client Prisma...');
try {
  execSync('npx prisma generate', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
} catch (error) {
  console.error('Erreur lors de la génération du client Prisma:', error);
  process.exit(1);
}

console.log('✅ Configuration Prisma corrigée et client régénéré avec succès.');
