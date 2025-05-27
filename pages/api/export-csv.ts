// pages/api/export-csv.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../lib/auth';
import prisma from '../../lib/db';
import { convertToCsv } from '../../lib/csv';
import { SurveyResponse } from '@prisma/client';

async function exportCsvHandler(req: NextApiRequest, res: NextApiResponse) {
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

      if (responses.length === 0) {
        return res.status(404).send('Aucune réponse à exporter.');
      }
      
      // Note: depending on how your CSV library handles arrays, you may not need to convert
      // these fields. If you want to keep the comma-separated format in the CSV for these fields,
      // you can leave this as is.

      const csvData = convertToCsv(responses);
      const fileName = `sondage_reponses_${new Date().toISOString().split('T')[0]}.csv`;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      return res.status(200).send(csvData);

    } catch (error) {
      console.error('Erreur exportation CSV:', error);
      return res.status(500).json({ message: 'Erreur serveur lors de l\'exportation CSV' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withSessionRoute(exportCsvHandler);