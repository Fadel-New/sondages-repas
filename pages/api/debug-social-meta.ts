// pages/api/debug-social-meta.js
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Récupérer les informations du domaine
  const host = req.headers.host || 'sondages-repas.vercel.app';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  // URL de l'image
  const imageUrl = `${baseUrl}/images/repas-social.jpeg`;

  // Titre et description
  const title = "Sondage - Solutions Repas au Bénin";
  const description = "Participez à notre sondage sur les habitudes alimentaires au Bénin pour contribuer au développement de solutions de repas pratiques, sains et abordables.";
  
  // Générer une réponse pour déboguer les meta tags
  const debugInfo = {
    host,
    baseUrl,
    imageUrl,
    metaTags: {
      "og:title": title,
      "og:description": description,
      "og:image": imageUrl,
      "og:url": baseUrl,
      "og:type": "website",
      "og:site_name": "Sondage Repas Quotidiens",
      "og:image:width": "1200",
      "og:image:height": "630",
      "twitter:card": "summary_large_image",
      "twitter:title": title,
      "twitter:description": description,
      "twitter:image": imageUrl
    },
    whatsappRecommendations: [
      "Assurez-vous que l'URL de l'image est accessible publiquement",
      "L'image doit être au format JPG, PNG ou GIF",
      "La taille recommandée est de 1200x630 pixels",
      "WhatsApp peut mettre en cache les aperçus; essayez de partager une URL unique en ajoutant un paramètre de requête (ex: ?v=123)"
    ],
    imagePreview: `<img src="${imageUrl}" alt="Aperçu de l'image" style="max-width: 100%; height: auto; border: 1px solid #ccc;" />`
  };

  // Page HTML pour afficher les informations
  const htmlResponse = `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Débogage des Meta Tags pour Partage Social</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
      pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; }
      .card { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      h1, h2 { color: #333; }
      .info { color: #0066cc; }
      .warning { color: #e65100; }
      .test-link { display: inline-block; margin: 10px 0; padding: 8px 16px; background: #4CAF50; color: white; text-decoration: none; border-radius: 4px; }
      .image-container { max-width: 100%; margin: 20px 0; text-align: center; }
    </style>
  </head>
  <body>
    <h1>Débogage des Meta Tags pour Partage Social</h1>
    
    <div class="card">
      <h2>Informations de base</h2>
      <p><strong>Hôte détecté:</strong> ${host}</p>
      <p><strong>URL de base:</strong> ${baseUrl}</p>
      <p><strong>URL de l'image:</strong> ${imageUrl}</p>
    </div>
    
    <div class="card">
      <h2>Meta Tags Open Graph / Twitter</h2>
      <pre>${JSON.stringify(debugInfo.metaTags, null, 2)}</pre>
    </div>
    
    <div class="card">
      <h2>Aperçu de l'image</h2>
      <div class="image-container">
        <img src="${imageUrl}" alt="Aperçu de l'image" style="max-width: 100%; height: auto; border: 1px solid #ccc;" />
        <p class="info">Si vous ne voyez pas l'image ci-dessus, il est possible que WhatsApp ne puisse pas y accéder non plus.</p>
      </div>
    </div>
    
    <div class="card">
      <h2>Tests à effectuer</h2>
      <ol>
        <li>Essayez d'ouvrir directement l'URL de l'image dans votre navigateur: <a href="${imageUrl}" target="_blank">${imageUrl}</a></li>
        <li>Essayez de partager cette URL sur WhatsApp: <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(`${baseUrl}?v=${Date.now()}`)}" target="_blank" class="test-link">Partager sur WhatsApp</a></li>
        <li>Vérifiez l'URL avec le validateur Facebook: <a href="https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(baseUrl)}" target="_blank" class="test-link">Validateur Facebook</a></li>
        <li>Vérifiez l'URL avec le validateur Twitter: <a href="https://cards-dev.twitter.com/validator" target="_blank" class="test-link">Validateur Twitter</a></li>
      </ol>
    </div>
    
    <div class="card">
      <h2>Aperçu simulé sur WhatsApp</h2>
      <div style="max-width: 400px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="height: 200px; overflow: hidden;">
          <img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="Aperçu de l'image" />
        </div>
        <div style="padding: 12px; background-color: white;">
          <div style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 4px;">${title}</div>
          <div style="font-size: 14px; color: #666; line-height: 1.3; margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;">
            ${description}
          </div>
          <div style="font-size: 12px; color: #888;">${baseUrl.replace(/^https?:\/\//, '')}</div>
        </div>
      </div>
      <p class="info" style="text-align: center;">Simulation approximative de l'aperçu WhatsApp</p>
    </div>
    
    <div class="card">
      <h2>Recommandations pour WhatsApp</h2>
      <ul>
        ${debugInfo.whatsappRecommendations.map(rec => `<li>${rec}</li>`).join('')}
        <li class="warning">Essayez d'ajouter un paramètre de requête aléatoire pour forcer le rafraîchissement du cache: <a href="${baseUrl}?v=${Date.now()}" target="_blank">${baseUrl}?v=${Date.now()}</a></li>
      </ul>
    </div>
    
    <p><a href="/" class="test-link">Retour à la page d'accueil</a></p>
  </body>
  </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(htmlResponse);
}
