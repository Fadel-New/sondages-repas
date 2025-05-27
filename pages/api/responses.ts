// pages/api/responses.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../lib/auth';
import prisma from '../../lib/db';
import { SurveyResponse } from '@prisma/client'; // Importez le type

async function responsesHandler(req: NextApiRequest, res: NextApiResponse) {
  const admin = req.session.admin;

  if (!admin || !admin.isLoggedIn) {
    return res.status(401).json({ message: 'Non autorisé' });
  }

  if (req.method === 'GET') {
    try {
      const responses: SurveyResponse[] = await prisma.surveyResponse.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      // Convertir les chaînes en tableaux pour le frontend
      const formattedResponses = responses.map(response => ({
        ...response,
        typesRepas: response.typesRepas ? response.typesRepas.split(',') : [],
        defisAlimentation: response.defisAlimentation ? response.defisAlimentation.split(',') : [],
        aspectsImportants: response.aspectsImportants ? response.aspectsImportants.split(',') : []
      }));
      
      return res.status(200).json(formattedResponses);
    } catch (error) {
      console.error('Erreur récupération réponses:', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withSessionRoute(responsesHandler);