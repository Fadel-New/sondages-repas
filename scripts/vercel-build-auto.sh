#!/bin/bash
# Ce script est conçu pour le déploiement sur Vercel
# Il vérifie les variables d'environnement essentielles pour PostgreSQL

# Vérifier si nous sommes sur Vercel
if [ "$VERCEL" = "1" ]; then
    echo "⚡ Environnement Vercel détecté"
    
    # Vérifier si DATABASE_URL et DIRECT_URL sont configurés correctement
    if [[ ! $DATABASE_URL =~ ^postgres(ql)?:// ]]; then
        echo "❌ ERREUR: DATABASE_URL n'est pas correctement configuré pour PostgreSQL"
        echo "❌ Le déploiement risque d'échouer sans une URL PostgreSQL valide"
        
        # Utiliser une URL factice pour la construction (ne sera pas utilisée en réalité)
        export DATABASE_URL="postgresql://fake:fake@localhost:5432/fakeverceldb"
        
        echo "ℹ️ URL factice configurée: $DATABASE_URL"
    else
        echo "✅ DATABASE_URL correctement configuré pour PostgreSQL"
    fi
    
    if [[ ! $DIRECT_URL =~ ^postgres(ql)?:// ]]; then
        echo "⚠️ DIRECT_URL n'est pas correctement configuré pour PostgreSQL"
        echo "⚠️ Les migrations pourraient échouer sans cette variable"
        # Pas besoin d'une URL factice pour DIRECT_URL car il est optionnel pour la construction
    else
        echo "✅ DIRECT_URL correctement configuré pour PostgreSQL"
    fi
else
    echo "🖥️ Environnement local détecté"
fi

# Continuer avec le processus de construction normal
echo "🔄 Exécution du script de validation de l'URL..."
node scripts/validate-db-url.js

echo "🔄 Génération du client Prisma..."
npx prisma generate --schema=./prisma/schema.prisma

echo "🔄 Application des migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

echo "🔄 Création de l'utilisateur admin par défaut..."
node scripts/init-admin.js

echo "🔄 Construction de l'application Next.js..."
ESLINT_DISABLE_WARNINGS=1 next build --no-lint
