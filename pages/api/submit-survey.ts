// pages/api/submit-survey.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const surveyData = req.body;

    // Validation basique (à améliorer en production)
    if (!surveyData.ville || !surveyData.situationProfessionnelle) {
      return res.status(400).json({ message: 'Champs obligatoires manquants.' });
    }

    // Convertir les tableaux en chaînes de caractères séparées par des virgules
    const typesRepasString = Array.isArray(surveyData.typesRepas) ? surveyData.typesRepas.join(',') : surveyData.typesRepas || '';
    const defisAlimentationString = Array.isArray(surveyData.defisAlimentation) ? surveyData.defisAlimentation.join(',') : surveyData.defisAlimentation || '';
    const aspectsImportantsString = Array.isArray(surveyData.aspectsImportants) ? surveyData.aspectsImportants.join(',') : surveyData.aspectsImportants || '';
    
    const newResponse = await prisma.surveyResponse.create({
      data: {
        ville: surveyData.ville,
        villeAutre: surveyData.villeAutre,
        situationProfessionnelle: surveyData.situationProfessionnelle,
        situationProfAutre: surveyData.situationProfAutre,
        mangeExterieurFreq: surveyData.mangeExterieurFreq,
        tempsPreparationRepas: surveyData.tempsPreparationRepas,
        typesRepas: typesRepasString,
        typesRepasAutre: surveyData.typesRepasAutre,
        defisAlimentation: defisAlimentationString,
        defisAlimentationAutre: surveyData.defisAlimentationAutre,
        satisfactionAccesRepas: parseInt(surveyData.satisfactionAccesRepas, 10), // Assurer que c'est un nombre
        interetSolutionRepas: surveyData.interetSolutionRepas,
        aspectsImportants: aspectsImportantsString,
        aspectsImportantsAutre: surveyData.aspectsImportantsAutre,
        budgetJournalierRepas: surveyData.budgetJournalierRepas,
        prixMaxRepas: surveyData.prixMaxRepas,
        budgetMensuelAbo: surveyData.budgetMensuelAbo,
        commentaires: surveyData.commentaires,
      },
    });

    return res.status(201).json({ message: 'Réponse enregistrée avec succès!', responseId: newResponse.id });
  } catch (error) {
    console.error('Erreur lors de la soumission du sondage:', error);
    // Dans une vraie app, loggez l'erreur de manière plus détaillée
    if (error instanceof Error) {
         return res.status(500).json({ message: 'Erreur serveur interne.', details: error.message });
    }
    return res.status(500).json({ message: 'Erreur serveur interne.' });
  }
}