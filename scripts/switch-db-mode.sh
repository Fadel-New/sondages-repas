#!/bin/bash

# Ce script aide à basculer entre les configurations de développement et de production pour Prisma

MODE=$1

if [ "$MODE" = "dev" ]; then
  echo "Passage au mode développement (SQLite)..."
  cp prisma/schema.sqlite.prisma prisma/schema.prisma
  echo "DATABASE_URL=\"file:../prisma.db\"" > .env.local
  echo "Configuration de développement activée!"
  
elif [ "$MODE" = "prod" ]; then
  echo "Passage au mode production (PostgreSQL)..."
  cp prisma/schema.production.prisma prisma/schema.prisma
  
  # Demander l'URL de la base de données PostgreSQL
  read -p "Entrez l'URL de la base de données PostgreSQL: " DB_URL
  echo "DATABASE_URL=\"$DB_URL\"" > .env.local
  echo "JWT_SECRET=\"$(openssl rand -hex 32)\"" >> .env.local
  echo "Configuration de production activée!"
  
else
  echo "Usage: $0 [dev|prod]"
  echo "  dev  : Configure Prisma pour le développement avec SQLite"
  echo "  prod : Configure Prisma pour la production avec PostgreSQL"
  exit 1
fi

# Générer le client Prisma avec la nouvelle configuration
npx prisma generate

echo "Prisma client mis à jour avec succès!"
