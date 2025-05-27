// pages/api/export-csv-direct.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../lib/auth';
import fs from 'fs';
import path from 'path';

// Extension de type pour inclure la propriété session
declare module 'next' {
  interface NextApiRequest {
    session: any;
  }
}
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { PrismaClient } from '@prisma/client';

// Fonction pour convertir des données en CSV
function convertToCsv(data: any[]): string {
  if (data.length === 0) return '';
  
  // Obtenir les en-têtes à partir des clés de l'objet
  const headers = Object.keys(data[0]);
  
  // Créer la ligne d'en-tête avec des étiquettes plus lisibles
  const headerLabels = headers.map(header => {
    // Formater les en-têtes pour les rendre plus lisibles
    const label = header
      .replace(/([A-Z])/g, ' $1') // Ajouter un espace avant chaque lettre majuscule
      .replace(/^./, str => str.toUpperCase()) // Mettre la première lettre en majuscule
      .trim();
    return `"${label}"`;
  });
  let csv = headerLabels.join(',') + '\n';
  
  // Ajouter les lignes de données
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Traiter les différents types de valeurs
      if (value === null || value === undefined) return '';
      
      // Convertir les dates en format lisible
      if (header === 'createdAt' && value) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return `"${date.toLocaleDateString()} ${date.toLocaleTimeString()}"`;
        }
      }
      
      // Traitement spécial pour les champs à valeurs multiples stockés comme chaînes séparées par des virgules
      if (['typesRepas', 'defisAlimentation', 'aspectsImportants'].includes(header) && typeof value === 'string') {
        // Pour ces champs, on remplace les virgules par des points-virgules pour éviter la confusion avec les séparateurs CSV
        return `"${value.replace(/,/g, '; ')}"`;
      }
      
      if (typeof value === 'string') {
        // Échapper les guillemets dans le texte et entourer le texte de guillemets
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csv += values.join(',') + '\n';
  });
  
  return csv;
}

async function exportCsvDirectHandler(req: NextApiRequest, res: NextApiResponse) {
  const admin = req.session.admin;

  if (!admin || !admin.isLoggedIn) {
    return res.status(401).json({ message: 'Non autorisé' });
  }

  if (req.method === 'GET') {
    try {
      let responses = [];

      // Déterminer si nous sommes en production ou en développement
      if (process.env.NODE_ENV === 'production') {
        // En production, utiliser le client Prisma
        const prisma = new PrismaClient();
        
        try {
          responses = await prisma.surveyResponse.findMany({
            orderBy: {
              createdAt: 'desc'
            }
          });
          
          // Convertir les dates en format standard pour le traitement
          responses = responses.map(r => ({
            ...r,
            createdAt: r.createdAt.toISOString()
          }));
          
          await prisma.$disconnect();
        } catch (prismaError) {
          console.error("Erreur Prisma pour l'export CSV:", prismaError);
          await prisma.$disconnect();
          throw prismaError;
        }
      } else {
        // En développement, utiliser l'approche SQLite
        const dbPath = path.join(process.cwd(), 'prisma.db');

        // Vérifier si la base de données existe
        if (!fs.existsSync(dbPath)) {
          return res.status(404).send('Aucune réponse à exporter.');
        }

        // Ouvrir la connexion à la base de données
        const db = await open({
          filename: dbPath,
          driver: sqlite3.Database
        });

        // Récupérer les réponses
        responses = await db.all(`
          SELECT * FROM SurveyResponse
          ORDER BY createdAt DESC
        `);

        // Fermer la connexion
        await db.close();
      }

      if (responses.length === 0) {
        return res.status(404).send('Aucune réponse à exporter.');
      }
      
      // Formater les réponses pour l'exportation CSV
      const formattedResponses = responses.map(response => {
        // Conserver l'original tout en faisant une petite transformation pour le CSV
        const formatted = { ...response };

        // Convertir typesRepas, defisAlimentation, aspectsImportants pour rendre plus lisible
        // Si la valeur contient des virgules, elle sera correctement traitée par convertToCsv
        
        return formatted;
      });

      const csvData = convertToCsv(formattedResponses);
      const fileName = `sondage_reponses_${new Date().toISOString().split('T')[0]}.csv`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      return res.status(200).send(csvData);
    } catch (error) {
      console.error('Erreur exportation CSV:', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withSessionRoute(exportCsvDirectHandler);
