#!/bin/bash

# Script pour vérifier et déployer les modifications pour le partage social
echo "Vérification et déploiement des modifications pour le partage social..."

# Générer l'image optimisée pour les réseaux sociaux
echo "Génération de l'image optimisée pour les réseaux sociaux..."
node scripts/optimize-social-image.js

# Construire le projet pour la production
echo "Construction du projet pour la production..."
npm run build

# Afficher les informations sur l'image générée
echo "Informations sur l'image générée :"
du -h public/images/repas-social.jpeg

echo ""
echo "====================================="
echo "Déploiement terminé !"
echo "====================================="
echo ""
echo "Pour tester le partage sur WhatsApp :"
echo "1. Accédez à votre URL déployée (avec ?v=$(date +%s) pour éviter le cache)"
echo "2. Partagez cette URL sur WhatsApp"
echo "3. Utilisez les outils de débogage depuis le tableau de bord d'administration"
echo ""
echo "Note : Si les prévisualisations ne fonctionnent toujours pas, essayez l'URL avec un nouveau paramètre :"
echo "https://votre-domaine.vercel.app/?v=$(date +%s)"
echo ""
