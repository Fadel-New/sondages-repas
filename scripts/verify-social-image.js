// scripts/verify-social-image.js
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

// Chemin de l'image pour le partage social
const socialImagePath = path.join(__dirname, '..', 'public', 'images', 'repas-social.jpeg');

// Vérifier si l'image existe localement
console.log('Vérification de l\'image de partage social...');

if (fs.existsSync(socialImagePath)) {
  const stats = fs.statSync(socialImagePath);
  const fileSizeInKB = stats.size / 1024;
  
  console.log(`✅ L'image existe : ${socialImagePath}`);
  console.log(`📊 Taille : ${fileSizeInKB.toFixed(2)} KB`);
  
  // Vérifier les dimensions (nous avons besoin de sharp pour cela)
  try {
    const sharp = require('sharp');
    sharp(socialImagePath)
      .metadata()
      .then(metadata => {
        console.log(`📏 Dimensions : ${metadata.width} x ${metadata.height} pixels`);
        console.log(`🖼️ Format : ${metadata.format}`);
        
        // Vérifier si les dimensions sont optimales pour le partage social
        if (metadata.width === 1200 && metadata.height === 630) {
          console.log('✅ Les dimensions sont optimales pour le partage social (1200x630)');
        } else {
          console.warn(`⚠️ Les dimensions ne sont pas optimales pour le partage social. Recommandé : 1200x630, Actuel : ${metadata.width}x${metadata.height}`);
        }
      })
      .catch(err => {
        console.error('❌ Impossible de lire les métadonnées de l\'image:', err);
      });
  } catch (err) {
    console.log('ℹ️ Module sharp non disponible. Installation : npm install sharp');
  }
  
  // Créer une URL pour tester le partage WhatsApp
  console.log('\nPour tester le partage sur WhatsApp :');
  console.log('1. Déployez votre site sur Vercel');
  console.log('2. Partagez cette URL (elle inclut un paramètre de cache-busting) :');
  console.log(`   https://sondages-repas.vercel.app/?v=${Date.now()}`);
  console.log('3. Ou utilisez les outils de test intégrés :');
  console.log('   - /api/debug-social-meta     (rapport détaillé avec validateurs)');
  console.log('   - /api/check-social-image    (vérification technique de l\'image)');
  console.log('   - /og-validator.html         (validateur local sans dépendance externe)');
  console.log('\nℹ️ WhatsApp met en cache les aperçus. L\'ajout d\'un paramètre de requête unique force le rafraîchissement du cache.');
} else {
  console.error('❌ L\'image n\'existe pas :', socialImagePath);
  console.log('\nVeuillez exécuter le script d\'optimisation d\'image :');
  console.log('node scripts/optimize-social-image.js');
}

// Fonction pour tester l'accessibilité d'une URL
function testUrlAccess(url, onResult) {
  const client = url.startsWith('https:') ? https : http;
  
  const req = client.get(url, (res) => {
    if (res.statusCode === 200) {
      onResult(null, res.statusCode);
    } else {
      onResult(new Error(`Status Code: ${res.statusCode}`), res.statusCode);
    }
    res.resume();
  });
  
  req.on('error', (err) => {
    onResult(err);
  });
  
  req.end();
}
