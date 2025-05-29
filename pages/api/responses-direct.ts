// pages/api/responses-direct.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../lib/auth';
import prisma from '../../lib/db'; // Import the shared instance
import { SurveyResponse } from '../../types';

async function responsesDirectHandler(req: NextApiRequest, res: NextApiResponse) {
  const admin = req.session.admin;

  if (!admin || !admin.isLoggedIn) {
    return res.status(401).json({ message: 'Non autorisé' });
  }

  if (req.method === 'GET') {
    try {
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
        
        return res.status(200).json(formattedResponses);
      } catch (prismaError) {
        console.error("Erreur Prisma dans responses-direct:", prismaError);
        throw prismaError;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des réponses:", error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ message: 'ID manquant' });
    }
    
    try {
      const responseId = parseInt(id as string, 10);
      
      await prisma.surveyResponse.delete({
        where: {
          id: responseId
        }
      });
      
      return res.status(200).json({ message: 'Réponse supprimée avec succès' });
    } catch (error) {
      console.error("Erreur lors de la suppression de la réponse:", error);
      return res.status(500).json({ message: 'Erreur serveur lors de la suppression' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    return res.status(405).json({ message: `Méthode ${req.method} non autorisée` });
  }
}

export default withSessionRoute(responsesDirectHandler);
