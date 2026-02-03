// scripts/test-form-submission.js
const fetch = require('node-fetch');

async function testFormSubmission() {
  console.log('Test de soumission du formulaire (WhatsApp requis)');
  
  // Données de test pour le formulaire
  const testData = {
    whatsappNumber: '+233501234567',
    mangeExterieurFreq: 'Tous les jours',
    tempsPreparationRepas: '15-30 minutes',
    typesRepas: ['Déjeuner', 'Dîner'],
    defisAlimentation: ['Prix élevés des repas à Achimota', 'Manque de temps pour cuisiner'],
    satisfactionAccesRepas: 3,
    interetSolutionRepas: 'Très intéressé(e)',
    aspectsImportants: ['Prix abordable', 'Qualité / hygiène'],
    budgetJournalierRepas: '40 - 60 GHS',
    prixMaxRepas: '45 - 55 GHS',
    budgetMensuelAbo: '600 - 650 GHS',
    commentaires: '',  // Test avec un commentaire vide
    acceptePolitique: true
  };

  try {
    console.log('Envoi des données...');
    
    const response = await fetch('http://localhost:3000/api/submit-survey-direct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Succès! Réponse du serveur:', result);
    } else {
      console.error('❌ Échec! Réponse du serveur:', result);
    }
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

testFormSubmission();
