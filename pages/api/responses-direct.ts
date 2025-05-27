// pages/api/responses-direct.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../lib/auth';
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { PrismaClient } from '@prisma/client';
import { SurveyResponse } from '../../types';

async function responsesDirectHandler(req: NextApiRequest, res: NextApiResponse) {
  const admin = req.session.admin;

  if (!admin || !admin.isLoggedIn) {
    return res.status(401).json({ message: 'Non autorisé' });
  }

  if (req.method === 'GET') {
    try {
      // Déterminer si nous sommes en production ou en développement
      if (process.env.NODE_ENV === 'production') {
        // En production, utiliser le client Prisma
        const prisma = new PrismaClient();
        
        try {
          const responses = await prisma.surveyResponse.findMany({
            orderBy: {
              createdAt: 'desc'
            }
          });
          
          // Convertir les chaînes en tableaux pour le frontend
          const formattedResponses = responses.map(response => ({
            ...response,
            createdAt: response.createdAt.toISOString(),
            typesRepas: response.typesRepas ? response.typesRepas.split(',') : [],
            defisAlimentation: response.defisAlimentation ? response.defisAlimentation.split(',') : [],
            aspectsImportants: response.aspectsImportants ? response.aspectsImportants.split(',') : []
          })) as SurveyResponse[];
          
          await prisma.$disconnect();
          return res.status(200).json(formattedResponses);
        } catch (prismaError) {
          console.error("Erreur Prisma:", prismaError);
          await prisma.$disconnect();
          throw prismaError;
        }
      } else {
        // En développement, utiliser l'approche SQLite
        const dbPath = path.join(process.cwd(), 'prisma.db');

        // Vérifier si la base de données existe
        if (!fs.existsSync(dbPath)) {
          console.log("La base de données n'existe pas:", dbPath);
          return res.status(200).json([]); // Retourner un tableau vide si la BD n'existe pas
        }

        // Ouvrir la connexion à la base de données
        const db = await open({
          filename: dbPath,
          driver: sqlite3.Database
        });

        // Récupérer les réponses
        const responses = await db.all(`
          SELECT * FROM SurveyResponse
          ORDER BY createdAt DESC
        `);

        // Fermer la connexion
        await db.close();

      // Convertir les chaînes en tableaux pour le frontend
      const formattedResponses = responses.map(response => ({
        ...response,
        typesRepas: response.typesRepas ? response.typesRepas.split(',') : [],
        defisAlimentation: response.defisAlimentation ? response.defisAlimentation.split(',') : [],
        aspectsImportants: response.aspectsImportants ? response.aspectsImportants.split(',') : []
      })) as SurveyResponse[];

      return res.status(200).json(formattedResponses);
      }
    } catch (error) {
      console.error('Erreur récupération réponses:', error);
      return res.status(500).json({ message: 'Erreur serveur', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withSessionRoute(responsesDirectHandler);
