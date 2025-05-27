// scripts/test-csv-export.js
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

// Fonction pour convertir des données en CSV (version simplifiée de celle dans l'API)
function convertToCsv(data) {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  let csv = headers.join(',') + '\n';
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return '';
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csv += values.join(',') + '\n';
  });
  
  return csv;
}

async function testCsvExport() {
  console.log('Test d\'exportation CSV...');
  
  // Chemin de la base de données
  const dbPath = path.join(process.cwd(), 'prisma.db');
  console.log(`Utilisation de la base de données à ${dbPath}`);
  
  // Vérifier si la base de données existe
  if (!fs.existsSync(dbPath)) {
    console.error('La base de données n\'existe pas.');
    console.log('Créez d\'abord la base de données avec: npm run init-db-root');
    return;
  }
  
  try {
    // Ouvrir la connexion à la base de données
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // Vérifier si la table SurveyResponse existe
    const tableExists = await db.get(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='SurveyResponse'
    `);
    
    if (!tableExists) {
      console.error('La table SurveyResponse n\'existe pas.');
      await db.close();
      return;
    }
    
    // Compter les réponses
    const countResult = await db.get('SELECT COUNT(*) as count FROM SurveyResponse');
    const responseCount = countResult.count;
    
    console.log(`Nombre de réponses trouvées: ${responseCount}`);
    
    if (responseCount === 0) {
      console.log('Aucune réponse à exporter. Ajoutez d\'abord des réponses via le formulaire.');
      await db.close();
      return;
    }
    
    // Récupérer les réponses
    const responses = await db.all(`
      SELECT * FROM SurveyResponse
      ORDER BY createdAt DESC
    `);
    
    // Fermer la connexion
    await db.close();
    
    // Générer le CSV
    const csvData = convertToCsv(responses);
    
    // Enregistrer le CSV dans un fichier pour vérification
    const fileName = `test_export_${new Date().toISOString().split('T')[0]}.csv`;
    const filePath = path.join(process.cwd(), fileName);
    
    fs.writeFileSync(filePath, csvData);
    
    console.log(`Export CSV de test créé avec succès: ${filePath}`);
    console.log('Vérifiez que le fichier contient les données correctes.');
    
  } catch (error) {
    console.error('Erreur lors du test d\'exportation CSV:', error);
  }
}

// Exécuter le test
testCsvExport();
