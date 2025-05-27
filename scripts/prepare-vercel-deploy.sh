#!/bin/bash

# Script de préparation pour le déploiement Vercel
# Ce script corrige les problèmes de configuration en vue du déploiement

echo "🚀 Préparation du déploiement Vercel..."

# 1. S'assurer que nous avons le bon schéma Prisma pour PostgreSQL
echo "📄 Mise à jour du schéma Prisma pour PostgreSQL..."
cp prisma/schema.production.prisma prisma/schema.prisma
echo "✅ Schéma Prisma mis à jour pour PostgreSQL"

# 2. Vérifier s'il y a un fichier .env.local
if [ -f .env.local ]; then
  echo "🔎 Fichier .env.local trouvé, vérification de la configuration..."
  # Vérifier si DATABASE_URL est configuré pour PostgreSQL
  if grep -q "DATABASE_URL=\"file:" .env.local; then
    echo "⚠️ DATABASE_URL est configuré pour SQLite, modification pour PostgreSQL..."
    # Demander une URL PostgreSQL
    read -p "Entrez l'URL de connexion PostgreSQL (postgresql://...) : " PG_URL
    
    # Vérifier que l'URL commence par postgresql:// ou postgres://
    if [[ ! $PG_URL =~ ^postgres(ql)?:// ]]; then
      echo "❌ L'URL doit commencer par postgresql:// ou postgres://"
      echo "Exemple: postgresql://utilisateur:mot_de_passe@hôte:port/base_de_données"
      exit 1
    fi
    
    # Remplacer l'URL dans le fichier .env.local
    sed -i "s|DATABASE_URL=.*|DATABASE_URL=\"$PG_URL\"|g" .env.local
    echo "✅ DATABASE_URL mis à jour dans .env.local"
  else
    echo "✅ DATABASE_URL semble correctement configuré dans .env.local"
  fi
else
  echo "📝 Création d'un nouveau fichier .env.local pour PostgreSQL..."
  read -p "Entrez l'URL de connexion PostgreSQL (postgresql://...) : " PG_URL
  
  # Vérifier que l'URL commence par postgresql:// ou postgres://
  if [[ ! $PG_URL =~ ^postgres(ql)?:// ]]; then
    echo "❌ L'URL doit commencer par postgresql:// ou postgres://"
    echo "Exemple: postgresql://utilisateur:mot_de_passe@hôte:port/base_de_données"
    exit 1
  fi
  
  # Créer le fichier .env.local
  echo "DATABASE_URL=\"$PG_URL\"" > .env.local
  echo "JWT_SECRET=\"$(openssl rand -hex 32)\"" >> .env.local
  echo "✅ Fichier .env.local créé avec succès"
fi

# 3. Générer le client Prisma
echo "🔄 Génération du client Prisma..."
npx prisma generate
echo "✅ Client Prisma généré"

# 4. Conseils pour Vercel
echo ""
echo "🚀 PRÊT POUR LE DÉPLOIEMENT VERCEL 🚀"
echo ""
echo "Assurez-vous de configurer ces variables d'environnement dans votre projet Vercel:"
echo "  - DATABASE_URL: $(grep DATABASE_URL .env.local | cut -d '=' -f2)"
echo "  - JWT_SECRET: (valeur secrète d'au moins 32 caractères)"
echo "  - NODE_ENV: production"
echo ""
echo "Merci d'utiliser le script de préparation Vercel!"
