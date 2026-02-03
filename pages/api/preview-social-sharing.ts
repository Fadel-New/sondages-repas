// pages/api/preview-social-sharing.ts
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Cette API permet de prévisualiser comment l'URL de votre site sera partagée sur les réseaux sociaux
 * Elle retourne une page HTML qui simule l'aspect du partage sans dépendre d'outils externes
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // URL à prévisualiser - par défaut l'URL racine
  const url = req.query.url as string || process.env.NEXT_PUBLIC_DOMAIN || 'https://sondages-repas.vercel.app';

  // Créer un URL pour l'image (basé sur l'URL du site)
  const baseUrl = new URL(url).origin;
  const imageUrl = `${baseUrl}/images/repas-social.jpeg`;
  const cacheBusterUrl = `${url}?v=${Date.now()}`;
  
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
                margin-bottom: 10px;
            }
            .button:hover {
                background: #434190;
            }
            .mt-4 {
                margin-top: 1rem;
            }
            .preview {
                max-width: 400px;
                margin: 20px auto;
                border: 1px solid #ddd;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .preview-image {
                height: 200px;
                overflow: hidden;
            }
            .preview-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            .preview-content {
                padding: 12px;
            }
            .preview-title {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 4px;
            }
            .preview-desc {
                font-size: 14px;
                color: #666;
                margin-bottom: 6px;
            }
            .preview-url {
                font-size: 12px;
                color: #888;
            }
            .meta-tags {
                background: #f8fafc;
                padding: 15px;
                border-radius: 5px;
                margin-top: 20px;
                overflow-x: auto;
                border: 1px solid #e2e8f0;
            }
            .tag-item {
                margin-bottom: 6px;
            }
            .tag-name {
                font-weight: bold;
                color: #4a5568;
            }
            .verification-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin-top: 20px;
            }
            .verification-grid > div {
                background-color: white;
                padding: 15px;
                border-radius: 8px;
                border: 1px solid #e2e8f0;
            }
            .verification-title {
                font-weight: bold;
                margin-bottom: 10px;
                color: #4a5568;
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
            <div class="preview-label">🔍 Simulation d'aperçu sur WhatsApp</div>
            
            <div class="preview">
                <div class="preview-image">
                    <img src="${imageUrl}" alt="Aperçu social">
                </div>
                <div class="preview-content">
                    <div class="preview-title">Sondage Easy Meal - Ghana (Achimota)</div>
                    <div class="preview-desc">Participez au sondage Easy Meal destiné aux étudiants à Achimota (Accra)...</div>
                    <div class="preview-url">${new URL(url).hostname}</div>
                </div>
            </div>
            
            <h3 style="margin-top: 30px;">Meta Tags Open Graph détectés</h3>
            <div class="meta-tags">
                <div class="tag-item"><span class="tag-name">og:title:</span> Sondage Easy Meal - Ghana (Achimota)</div>
                <div class="tag-item"><span class="tag-name">og:description:</span> Participez au sondage Easy Meal destiné aux étudiants à Achimota (Accra)...</div>
                <div class="tag-item"><span class="tag-name">og:image:</span> ${imageUrl}</div>
                <div class="tag-item"><span class="tag-name">og:url:</span> ${url}</div>
                <div class="tag-item"><span class="tag-name">og:type:</span> website</div>
                <div class="tag-item"><span class="tag-name">og:site_name:</span> Easy Meal - Ghana</div>
                <div class="tag-item"><span class="tag-name">og:image:width:</span> 1200</div>
                <div class="tag-item"><span class="tag-name">og:image:height:</span> 630</div>
            </div>
            
            <h3 style="margin-top: 30px;">Outils de vérification</h3>
            <div class="verification-grid">
                <div>
                    <div class="verification-title">Vérifier l'image</div>
                    <p>Si l'image ne s'affiche pas ci-dessus, elle pourrait ne pas être accessible :</p>
                    <a href="${imageUrl}" target="_blank" class="button">Tester l'image directement</a>
                </div>
                <div>
                    <div class="verification-title">Tester le partage</div>
                    <p>Pour tester le véritable partage avec suppression du cache :</p>
                    <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(cacheBusterUrl)}" target="_blank" class="button">Partager sur WhatsApp</a>
                </div>
            </div>
        </div>

        <div class="mt-4">
            <a href="/" class="button">Retour à l'accueil</a>
            <a href="https://cards-dev.twitter.com/validator" target="_blank" class="button">Validateur Twitter Card</a>
            <a href="https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(url)}" target="_blank" class="button">Validateur Facebook</a>
            <a href="/og-validator.html" target="_blank" class="button">Validateur personnalisé</a>
        </div>
        
        <div class="mt-4" style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 10px; border-radius: 4px;">
            <p><strong>Note:</strong> Les aperçus réels peuvent varier légèrement selon les plateformes. WhatsApp met en cache les aperçus, donc pour tester une nouvelle version, utilisez le lien "Partager sur WhatsApp" ci-dessus qui inclut un paramètre pour contourner le cache.</p>
        </div>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
