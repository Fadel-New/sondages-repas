// scripts/test-form-submission.js
const fetch = require('node-fetch');

async function testFormSubmission() {
  console.log('Test de soumission du formulaire avec un email facultatif');
  
  // Données de test pour le formulaire
  const testData = {
    email: '', // Test avec un email vide
    sexe: 'Homme',
    ville: 'Cotonou',
    situationProfessionnelle: 'Salarié(e)',
    mangeExterieurFreq: 'Tous les jours',
    tempsPreparationRepas: '15-30 minutes',
    typesRepas: ['Déjeuner', 'Dîner'],
    defisAlimentation: ['Manque de temps pour cuisiner', 'Coût élevé des repas extérieurs'],
    satisfactionAccesRepas: 3,
    interetSolutionRepas: 'Très intéressé(e)',
    aspectsImportants: ['Prix abordable', 'Qualité des ingrédients'],
    budgetJournalierRepas: '1 000 - 2 000 FCFA',
    prixMaxRepas: '1 500 - 2 500 FCFA',
    budgetMensuelAbo: '15 000 - 25 000 FCFA',
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
