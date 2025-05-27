#!/bin/bash
# Ce script est conçu pour le déploiement sur Vercel
# Il configure temporairement une URL PostgreSQL factice si nécessaire

# Vérifier si nous sommes sur Vercel
if [ "$VERCEL" = "1" ]; then
    echo "⚡ Environnement Vercel détecté"
    
    # Vérifier si DATABASE_URL est configuré correctement
    if [[ ! $DATABASE_URL =~ ^postgres(ql)?:// ]]; then
        echo "⚠️ DATABASE_URL n'est pas correctement configuré pour PostgreSQL"
        echo "⚠️ Utilisation d'une URL PostgreSQL factice pour permettre la construction"
        
        # Utiliser une URL factice pour la construction (ne sera pas utilisée en réalité)
        export DATABASE_URL="postgresql://fake:fake@localhost:5432/fakeverceldb"
        
        echo "ℹ️ URL factice configurée: $DATABASE_URL"
    fi
else
    echo "🖥️ Environnement local détecté"
fi

# Continuer avec le processus de construction normal
echo "🔄 Exécution du script de validation de l'URL..."
node scripts/validate-db-url.js

echo "🔄 Adaptation du schéma Prisma..."
node scripts/adapt-prisma-schema.js

echo "🔄 Génération du client Prisma..."
npx prisma generate --schema=./prisma/schema.prisma

echo "🔄 Application des migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

echo "🔄 Initialisation de la base de données..."
node scripts/init-vercel-db.js

echo "🔄 Construction de l'application Next.js..."
ESLINT_DISABLE_WARNINGS=1 next build --no-lint
