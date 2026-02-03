// scripts/check-database-sync.js
// Ce script vérifie si les données soumises via le formulaire sont correctement accessibles
// via l'API du tableau de bord admin

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const { PrismaClient } = require('@prisma/client');

// Chemin de la base de données directe
const dbPath = path.join(process.cwd(), 'prisma.db');
// Initialiser le client Prisma
const prisma = new PrismaClient();

async function checkDbSync() {
  console.log('Vérification de la synchronisation de la base de données...\n');

  // Vérifier si la base de données existe
  if (!fs.existsSync(dbPath)) {
    console.error(`La base de données n'existe pas à l'emplacement: ${dbPath}`);
    console.log('Créez la base de données en exécutant: npm run init-sqlite');
    return;
  }

  try {
    // 1. Vérifier l'accès à la base de données via SQLite direct
    console.log('1. Vérification de l\'accès direct à SQLite...');
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Compter les réponses via SQLite direct
    const directCount = await db.get('SELECT COUNT(*) as count FROM SurveyResponse');
    console.log(`   ✓ Accès SQLite direct OK: ${directCount.count} réponses trouvées`);

    // Récupérer les données via SQLite direct
    const directResponses = await db.all('SELECT * FROM SurveyResponse LIMIT 3');
    
    await db.close();

    // 2. Vérifier l'accès à la base de données via Prisma
    console.log('2. Vérification de l\'accès via Prisma...');
    try {
      // Compter les réponses via Prisma
      const prismaCount = await prisma.surveyResponse.count();
      console.log(`   ✓ Accès Prisma OK: ${prismaCount} réponses trouvées`);
      
      // Vérifier si les comptes correspondent
      if (directCount.count === prismaCount) {
        console.log(`   ✓ Les comptes correspondent: ${directCount.count} réponses`);
      } else {
        console.log(`   ❌ Les comptes ne correspondent PAS: SQLite (${directCount.count}) vs Prisma (${prismaCount})`);
        console.log('     Cela indique que les deux méthodes accèdent à des fichiers de base de données différents!');
      }

      // Récupérer les données via Prisma
      const prismaResponses = await prisma.surveyResponse.findMany({
        take: 3,
        orderBy: { id: 'asc' }
      });
      
      // Comparer quelques champs pour voir s'ils correspondent
      if (directResponses.length > 0 && prismaResponses.length > 0) {
        console.log('\n3. Comparaison des données:');
        console.log('   SQLite Direct (premier enregistrement):');
        console.log(`   ID: ${directResponses[0].id}, WhatsApp: ${directResponses[0].whatsappNumber}`);
        
        console.log('   Prisma (premier enregistrement):');
        console.log(`   ID: ${prismaResponses[0].id}, WhatsApp: ${prismaResponses[0].whatsappNumber}`);
        
        if (directResponses[0].id === prismaResponses[0].id) {
          console.log('   ✓ Les IDs correspondent');
        } else {
          console.log('   ❌ Les IDs ne correspondent PAS');
        }
      }
      
    } catch (prismaError) {
      console.error(`   ❌ Erreur d'accès Prisma: ${prismaError.message}`);
      console.log('     Cela peut indiquer que Prisma ne peut pas accéder à la base de données.');
    }
    
    console.log('\nConclusion:');
    console.log('- Si les nombres correspondent et que les données semblent cohérentes,');
    console.log('  la synchronisation fonctionne correctement.');
    console.log('- Sinon, vérifiez les chemins de base de données dans:');
    console.log('  1. /prisma/schema.prisma');
    console.log('  2. /pages/api/submit-survey-direct.ts');
    console.log('  3. /pages/api/responses-direct.ts');
    console.log('  4. /pages/api/export-csv-direct.ts');

  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDbSync();
