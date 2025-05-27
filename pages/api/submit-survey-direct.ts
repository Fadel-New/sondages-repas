// pages/api/submit-survey-direct.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
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

    // Déterminer si nous sommes en production ou en développement
    if (process.env.NODE_ENV === 'production') {
      // En production, utiliser le client Prisma partagé depuis lib/db
      
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
        
        // await prisma.$disconnect(); // Generally not needed for shared instance in serverless, Prisma handles connections.
                                    // If you keep it, ensure it's in a finally block if errors can occur before it.
                                    // For Vercel, it's often better to let Prisma manage the connection lifecycle per function invocation.
        return res.status(201).json({ 
          message: 'Réponse enregistrée avec succès!', 
          responseId: result.id 
        });
      } catch (prismaError) {
        console.error("Erreur Prisma dans submit-survey-direct:", prismaError);
        // await prisma.$disconnect(); // See comment above
        // Rethrow or handle appropriately. The global error handler will catch it.
        throw prismaError; 
      }
    } else {
      // En développement, utiliser SQLite direct comme avant
      const dbPath = path.join(process.cwd(), 'prisma.db');
      
      // Vérifier si le dossier existe
      const dbDir = path.dirname(dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      
      // Créer la base de données si elle n'existe pas
      const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
      });

    // Créer la table si elle n'existe pas
    await db.exec(`
      CREATE TABLE IF NOT EXISTS "SurveyResponse" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
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
      )
    `);

    // Insérer les données
    const stmt = await db.prepare(`
      INSERT INTO "SurveyResponse" (
        ville, villeAutre, situationProfessionnelle, situationProfAutre,
        mangeExterieurFreq, tempsPreparationRepas, typesRepas, typesRepasAutre,
        defisAlimentation, defisAlimentationAutre, satisfactionAccesRepas,
        interetSolutionRepas, aspectsImportants, aspectsImportantsAutre,
        budgetJournalierRepas, prixMaxRepas, budgetMensuelAbo, commentaires
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = await stmt.run(
      surveyData.ville,
      surveyData.villeAutre || null,
      surveyData.situationProfessionnelle,
      surveyData.situationProfAutre || null,
      surveyData.mangeExterieurFreq,
      surveyData.tempsPreparationRepas,
      typesRepasString,
      surveyData.typesRepasAutre || null,
      defisAlimentationString,
      surveyData.defisAlimentationAutre || null,
      parseInt(surveyData.satisfactionAccesRepas, 10),
      surveyData.interetSolutionRepas,
      aspectsImportantsString,
      surveyData.aspectsImportantsAutre || null,
      surveyData.budgetJournalierRepas,
      surveyData.prixMaxRepas,
      surveyData.budgetMensuelAbo,
      surveyData.commentaires || null
    );

    await stmt.finalize();
    await db.close();

    return res.status(201).json({ 
      message: 'Réponse enregistrée avec succès!', 
      responseId: result.lastID 
    });
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
