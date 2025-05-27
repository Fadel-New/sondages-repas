// pages/api/responses-direct/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../../lib/auth';
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { PrismaClient } from '@prisma/client';

// Extension de type pour inclure la propriété session
declare module 'next' {
  interface NextApiRequest {
    session: any;
  }
}

async function responseDetailHandler(req: NextApiRequest, res: NextApiResponse) {
  const admin = req.session.admin;

  if (!admin || !admin.isLoggedIn) {
    return res.status(401).json({ message: 'Non autorisé' });
  }

  // Récupérer l'ID de la réponse à partir de l'URL
  const { id } = req.query;
  
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'ID de réponse invalide' });
  }

  if (req.method === 'GET') {
    try {
      let response;
      
      // Déterminer si nous sommes en production ou en développement
      if (process.env.NODE_ENV === 'production') {
        // En production, utiliser le client Prisma
        const prisma = new PrismaClient();
        
        try {
          response = await prisma.surveyResponse.findUnique({
            where: {
              id: parseInt(id, 10)
            }
          });
          
          await prisma.$disconnect();
          
          if (!response) {
            return res.status(404).json({ message: 'Réponse introuvable' });
          }
          
        } catch (prismaError) {
          console.error("Erreur Prisma:", prismaError);
          await prisma.$disconnect();
          throw prismaError;
        }
      } else {
        // En développement, utiliser SQLite direct
        // Chemin de la base de données - utiliser un chemin relatif plus fiable
        const dbPath = path.join(process.cwd(), 'prisma.db');

        // Vérifier si la base de données existe
        if (!fs.existsSync(dbPath)) {
          console.log("La base de données n'existe pas:", dbPath);
          return res.status(404).json({ message: 'Base de données introuvable' });
        }

        // Ouvrir la connexion à la base de données
        const db = await open({
          filename: dbPath,
          driver: sqlite3.Database
        });

        // Récupérer la réponse avec l'ID spécifié
        response = await db.get(`
          SELECT * FROM SurveyResponse
          WHERE id = ?
        `, id);

      // Fermer la connexion
      await db.close();

      if (!response) {
        return res.status(404).json({ message: 'Réponse introuvable' });
      }
      }

      // Convertir les chaînes en tableaux et formater les dates
      const formattedResponse = {
        ...response,
        createdAt: process.env.NODE_ENV === 'production' ? response.createdAt.toISOString() : response.createdAt,
        typesRepas: response.typesRepas ? response.typesRepas.split(',') : [],
        defisAlimentation: response.defisAlimentation ? response.defisAlimentation.split(',') : [],
        aspectsImportants: response.aspectsImportants ? response.aspectsImportants.split(',') : []
      };

      return res.status(200).json(formattedResponse);
    } catch (error) {
      console.error('Erreur récupération détails de la réponse:', error);
      return res.status(500).json({ message: 'Erreur serveur', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withSessionRoute(responseDetailHandler);
