// pages/api/check-social-image.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

type ImageCheckResult = {
  imageUrl: string;
  isAccessible: boolean;
  error: string | null;
  dimensions: string | null;
  fileSize: string | null;
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // URL du site
  const baseUrl = req.headers.host
    ? `${req.headers['x-forwarded-proto'] ? req.headers['x-forwarded-proto'] : 'https'}://${req.headers.host}`
    : process.env.NEXT_PUBLIC_DOMAIN || 'https://sondages-repas.vercel.app';
  
  // URL de l'image
  const imageUrl = `${baseUrl}/images/repas-social.jpeg`;
  
  // Résultats par défaut
  const results: ImageCheckResult = {
    imageUrl,
    isAccessible: false,
    error: null,
    dimensions: null,
    fileSize: null,
    message: "Vérification de l'image de partage social"
  };

  try {
    // Vérifier si l'image existe localement (en développement)
    if (process.env.NODE_ENV === 'development') {
      try {
        const publicDir = path.join(process.cwd(), 'public');
        const imagePath = path.join(publicDir, 'images', 'repas-social.jpeg');
        
        const stats = await fs.stat(imagePath);
        results.isAccessible = true;
        results.fileSize = `${Math.round(stats.size / 1024)} KB`;
        results.message = "Image vérifiée localement (environnement de développement)";
        
        // Note: pour obtenir les dimensions, il faudrait utiliser sharp ou autre bibliothèque
        // Ce qui n'est pas implémenté ici pour simplifier
      } catch (e: any) {
        results.error = "Image non accessible localement";
      }
    } else {
      // Vérifier si l'image est accessible en ligne (en production)
      try {
        const response = await fetch(imageUrl, { method: 'HEAD' });
        
        if (response.ok) {
          results.isAccessible = true;
          
          // Obtenir la taille du fichier si disponible
          const contentLength = response.headers.get('content-length');
          if (contentLength) {
            const sizeInKB = Math.round(parseInt(contentLength, 10) / 1024);
            results.fileSize = `${sizeInKB} KB`;
          }
          
          results.message = "L'image est accessible en ligne";
        } else {
          results.error = `L'image n'est pas accessible. Statut HTTP: ${response.status}`;
        }
      } catch (fetchError: any) {
        results.error = `Erreur lors de la vérification en ligne: ${fetchError.message}`;
      }
    }
  } catch (error: any) {
    results.error = `Erreur lors de la vérification: ${error.message}`;
  }

  // Retourner les résultats au format JSON
  res.status(200).json(results);
}
