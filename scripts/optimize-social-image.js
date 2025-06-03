// scripts/optimize-social-image.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Dimensions recommandées pour les aperçus sur les réseaux sociaux
// Elles correspondent aux dimensions que WhatsApp et la plupart des réseaux sociaux attendent
const SOCIAL_WIDTH = 1200;
const SOCIAL_HEIGHT = 630;

// Chemin de l'image source
const sourceImagePath = path.join(__dirname, '..', 'public', 'images', 'repas.jpeg');

// Chemin de l'image optimisée pour le partage social
const targetImagePath = path.join(__dirname, '..', 'public', 'images', 'repas-social.jpeg');

// Vérifier si l'image source existe
if (!fs.existsSync(sourceImagePath)) {
  console.error(`L'image source ${sourceImagePath} n'existe pas.`);
  process.exit(1);
}

// Optimiser l'image pour les réseaux sociaux
sharp(sourceImagePath)
  .resize({
    width: SOCIAL_WIDTH,
    height: SOCIAL_HEIGHT,
    fit: 'cover',
    position: 'center'
  })
  .jpeg({ quality: 90 })
  .toFile(targetImagePath)
  .then(info => {
    console.log('Image optimisée pour les réseaux sociaux créée avec succès:');
    console.log(info);
    console.log(`Chemin: ${targetImagePath}`);
  })
  .catch(err => {
    console.error('Erreur lors de l\'optimisation de l\'image:', err);
  });
