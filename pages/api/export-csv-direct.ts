// pages/api/export-csv-direct.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../lib/auth';
import prisma from '../../lib/db';

// Extension de type pour inclure la propriété session
declare module 'next' {
  interface NextApiRequest {
    session: any;
  }
}

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
        return `"${value.replace(/,/g, ', ')}"`;
      }
      
      // Échapper les guillemets doubles et placer le contenu entre guillemets
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
      }
      
      return value;
    });
    csv += values.join(',') + '\n';
  });
  
  return csv;
}

// Route pour l'exportation CSV sans utiliser les utilitaires
async function exportCsvDirectHandler(req: NextApiRequest, res: NextApiResponse) {
  const admin = req.session.admin;

  if (!admin || !admin.isLoggedIn) {
    return res.status(401).send('Non autorisé. Veuillez vous connecter.');
  }

  if (req.method === 'GET') {
    let responses = [];

    try {
      try {
        // Utiliser Prisma pour récupérer les données
        responses = await prisma.surveyResponse.findMany({
          orderBy: {
            createdAt: 'desc'
          }
        });
      } catch (prismaError) {
        console.error("Erreur Prisma dans export-csv-direct:", prismaError);
        throw prismaError;
      }

      if (responses.length === 0) {
        return res.status(404).send('Aucune réponse à exporter.');
      }
      
      // Formater les réponses pour l'exportation CSV
      const formattedResponses = responses.map(response => {
        // Convertir l'objet Date en chaîne pour le CSV
        return {
          ...response,
          createdAt: response.createdAt instanceof Date ? response.createdAt.toISOString() : response.createdAt
        };
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
