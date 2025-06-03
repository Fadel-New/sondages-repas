// pages/api/submit-survey-direct.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/db'; // Import the shared instance
import fs from 'fs';
import path from 'path';
import { Prisma } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    console.log('Traitement de soumission du formulaire - début');
    // Parse request body
    const surveyData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // Validation basique
    if (!surveyData.ville || !surveyData.situationProfessionnelle || !surveyData.mangeExterieurFreq || 
        !surveyData.tempsPreparationRepas || !surveyData.typesRepas || !surveyData.defisAlimentation || 
        !surveyData.interetSolutionRepas || !surveyData.aspectsImportants || 
        !surveyData.budgetJournalierRepas || !surveyData.prixMaxRepas || !surveyData.budgetMensuelAbo || 
        !surveyData.acceptePolitique) {
      return res.status(400).json({ message: 'Champs obligatoires manquants ou politique de confidentialité non acceptée.' });
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

    // Préparer les données pour la création
    const createData: Prisma.SurveyResponseCreateInput = {
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
      satisfactionAccesRepas: parseInt(String(surveyData.satisfactionAccesRepas || 0), 10),
      interetSolutionRepas: surveyData.interetSolutionRepas,
      aspectsImportants: aspectsImportantsString,
      aspectsImportantsAutre: surveyData.aspectsImportantsAutre || null,
      budgetJournalierRepas: surveyData.budgetJournalierRepas,
      prixMaxRepas: surveyData.prixMaxRepas,
      budgetMensuelAbo: surveyData.budgetMensuelAbo,
      commentaires: surveyData.commentaires || null,
      acceptePolitique: Boolean(surveyData.acceptePolitique)
    };
    
    // Ajouter les champs facultatifs explicitement si présents
    if (surveyData.email) {
      createData.email = surveyData.email;
    }
    if (surveyData.sexe) {
      createData.sexe = surveyData.sexe;
    }

    try {
      console.log('Tentative de création de la réponse dans la base de données...');
      console.log('Données à enregistrer (createData):', JSON.stringify({
        ...createData,
        // Masquer les données sensibles pour le journal
        email: createData.email ? '***@***' : undefined
      }, null, 2));
      
      const result = await prisma.surveyResponse.create({
        data: createData
      });
      
      console.log('Réponse enregistrée avec succès, ID:', result.id);
      return res.status(201).json({ 
        message: 'Réponse enregistrée avec succès!', 
        responseId: result.id 
      });
    } catch (prismaError: any) {
      console.error("Erreur Prisma dans submit-survey-direct:", prismaError);
      console.error("Code d'erreur Prisma:", prismaError.code);
      console.error("Message d'erreur Prisma:", prismaError.message);
      
      if (prismaError.code === 'P2002') {
        return res.status(409).json({ 
          message: 'Conflit de données - cette réponse existe peut-être déjà.'
        });
      } else if (prismaError.code === 'P2003') {
        return res.status(400).json({ 
          message: 'Erreur de relation - une contrainte de clé étrangère n\'a pas été respectée.'
        });
      } else {
        throw prismaError;
      } 
    }
  } catch (error) {
    console.error('Erreur lors de la soumission du sondage:', error);
    
    // Log détaillé pour le débogage
    if (error instanceof Error) {
      console.error('Type d\'erreur:', error.constructor.name);
      console.error('Stack trace:', error.stack);
      
      return res.status(500).json({ 
        message: 'Erreur serveur interne.', 
        details: error.message 
      });
    }
    
    return res.status(500).json({ 
      message: 'Erreur serveur interne.',
      details: 'Erreur inconnue lors du traitement de la demande'
    });
  }
}
