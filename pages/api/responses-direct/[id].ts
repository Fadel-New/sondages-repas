// pages/api/responses-direct/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../../lib/auth';
import prisma from '../../../lib/db'; // Import the shared instance

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
      const response = await prisma.surveyResponse.findUnique({
        where: {
          id: parseInt(id, 10)
        }
      });
      
      if (!response) {
        return res.status(404).json({ message: 'Réponse introuvable' });
      }
      
      // Convertir les chaînes séparées par des virgules en tableaux
      const formattedResponse = {
        ...response,
        createdAt: response.createdAt.toISOString(),
        typesRepas: response.typesRepas ? response.typesRepas.split(',') : [],
        defisAlimentation: response.defisAlimentation ? response.defisAlimentation.split(',') : [],
        aspectsImportants: response.aspectsImportants ? response.aspectsImportants.split(',') : []
      };
      
      return res.status(200).json(formattedResponse);
    } catch (error) {
      console.error("Erreur lors de la récupération de la réponse:", error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  } else if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const updateData = req.body;
      
      // Validation rapide
      if (!updateData) {
        return res.status(400).json({ message: 'Données de mise à jour manquantes' });
      }
      
      // Conversion des tableaux en chaînes pour le stockage
      if (updateData.typesRepas && Array.isArray(updateData.typesRepas)) {
        updateData.typesRepas = updateData.typesRepas.join(',');
      }
      
      if (updateData.defisAlimentation && Array.isArray(updateData.defisAlimentation)) {
        updateData.defisAlimentation = updateData.defisAlimentation.join(',');
      }
      
      if (updateData.aspectsImportants && Array.isArray(updateData.aspectsImportants)) {
        updateData.aspectsImportants = updateData.aspectsImportants.join(',');
      }
      
      // Mise à jour via Prisma
      const updatedResponse = await prisma.surveyResponse.update({
        where: {
          id: parseInt(id, 10)
        },
        data: updateData
      });
      
      return res.status(200).json({
        message: 'Réponse mise à jour avec succès',
        response: updatedResponse
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la réponse:", error);
      return res.status(500).json({ message: 'Erreur serveur lors de la mise à jour' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.surveyResponse.delete({
        where: {
          id: parseInt(id, 10)
        }
      });
      
      return res.status(200).json({ message: 'Réponse supprimée avec succès' });
    } catch (error) {
      console.error("Erreur lors de la suppression de la réponse:", error);
      return res.status(500).json({ message: 'Erreur serveur lors de la suppression' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
    return res.status(405).json({ message: `Méthode ${req.method} non autorisée` });
  }
}

export default withSessionRoute(responseDetailHandler);
