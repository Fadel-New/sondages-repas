// pages/api/preview-social-sharing.ts
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Cette API permet de prévisualiser comment l'URL de votre site sera partagée sur les réseaux sociaux
 * Elle retourne une page HTML qui utilise un outil de prévisualisation pour montrer l'aspect du partage
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // URL à prévisualiser - par défaut l'URL racine
  const url = req.query.url as string || process.env.NEXT_PUBLIC_DOMAIN || 'https://sondages-repas.vercel.app';
  
  // HTML de la page de prévisualisation
  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Prévisualisation du partage sur les réseaux sociaux</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                max-width: 1000px;
                margin: 0 auto;
                padding: 20px;
                background: #f5f5f5;
            }
            h1 {
                color: #2c5282;
            }
            .preview-container {
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                margin: 20px 0;
            }
            .preview-label {
                font-size: 1.2em;
                font-weight: bold;
                margin-bottom: 10px;
                color: #4a5568;
            }
            iframe {
                width: 100%;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
            }
            .url-display {
                padding: 10px;
                background: #e2e8f0;
                border-radius: 4px;
                word-break: break-all;
                margin: 10px 0;
            }
            .button {
                display: inline-block;
                background: #4c51bf;
                color: white;
                padding: 10px 15px;
                border-radius: 4px;
                text-decoration: none;
                margin-right: 10px;
            }
            .button:hover {
                background: #434190;
            }
            .mt-4 {
                margin-top: 1rem;
            }
        </style>
    </head>
    <body>
        <h1>Prévisualisation du partage sur les réseaux sociaux</h1>
        <p>Cette page vous permet de voir comment votre site apparaîtra lorsqu'il sera partagé sur WhatsApp, Facebook, Twitter et autres réseaux sociaux.</p>
        
        <div class="url-display">
            URL prévisualisée: <strong>${url}</strong>
        </div>
        
        <div class="preview-container">
            <div class="preview-label">🔍 Prévisualisation WhatsApp et Facebook:</div>
            <iframe src="https://www.opengraph.xyz/url/${encodeURIComponent(url)}" height="600"></iframe>
        </div>

        <div class="mt-4">
            <a href="/" class="button">Retour à l'accueil</a>
            <a href="https://cards-dev.twitter.com/validator" target="_blank" class="button">Validateur Twitter Card</a>
            <a href="https://developers.facebook.com/tools/debug/" target="_blank" class="button">Validateur Facebook</a>
        </div>

        <p class="mt-4"><strong>Note:</strong> Si l'aperçu ne s'affiche pas correctement, vous pouvez utiliser les validateurs liés ci-dessus pour vérifier directement vos balises Open Graph.</p>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
