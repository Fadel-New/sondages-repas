// pages/api/submit-survey-direct.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/db'; // Import the shared instance

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const surveyData = req.body;

    // Validation basique
    if (!surveyData.ville || !surveyData.situationProfessionnelle) {
      return res.status(400).json({ message: 'Champs obligatoires manquants.' });
    }

    // Convertir les tableaux en chaînes
    const typesRepasString = Array.isArray(surveyData.typesRepas) 
      ? surveyData.typesRepas.join(',') 
      : surveyData.typesRepas || '';
      
    const defisAlimentationString = Array.isArray(surveyData.defisAlimentation) 
      ? surveyData.defisAlimentation.join(',') 
      : surveyData.defisAlimentation || '';
      
    const aspectsImportantsString = Array.isArray(surveyData.aspectsImportants) 
      ? surveyData.aspectsImportants.join(',') 
      : surveyData.aspectsImportants || '';

    try {
      const result = await prisma.surveyResponse.create({
        data: {
          ville: surveyData.ville,
          villeAutre: surveyData.villeAutre || null,
          situationProfessionnelle: surveyData.situationProfessionnelle,
          situationProfAutre: surveyData.situationProfAutre || null,
          mangeExterieurFreq: surveyData.mangeExterieurFreq,
          tempsPreparationRepas: surveyData.tempsPreparationRepas,
          typesRepas: typesRepasString,
          typesRepasAutre: surveyData.typesRepasAutre || null,
          defisAlimentation: defisAlimentationString,
          defisAlimentationAutre: surveyData.defisAlimentationAutre || null,
          satisfactionAccesRepas: parseInt(surveyData.satisfactionAccesRepas, 10),
          interetSolutionRepas: surveyData.interetSolutionRepas,
          aspectsImportants: aspectsImportantsString,
          aspectsImportantsAutre: surveyData.aspectsImportantsAutre || null,
          budgetJournalierRepas: surveyData.budgetJournalierRepas,
          prixMaxRepas: surveyData.prixMaxRepas,
          budgetMensuelAbo: surveyData.budgetMensuelAbo,
          commentaires: surveyData.commentaires || null
        }
      });
      
      return res.status(201).json({ 
        message: 'Réponse enregistrée avec succès!', 
        responseId: result.id 
      });
    } catch (prismaError) {
      console.error("Erreur Prisma dans submit-survey-direct:", prismaError);
      throw prismaError; 
    }
  } catch (error) {
    console.error('Erreur lors de la soumission du sondage:', error);
    if (error instanceof Error) {
      return res.status(500).json({ 
        message: 'Erreur serveur interne.', 
        details: error.message 
      });
    }
    return res.status(500).json({ message: 'Erreur serveur interne.' });
  }
}
