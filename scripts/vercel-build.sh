# Script pour Vercel Build Step
# Assurez-vous de configurer ce script dans votre Vercel Build Command

# Valider la variable d'environnement DATABASE_URL
echo "Validant la variable DATABASE_URL..."
node scripts/validate-db-url.js

# Génération du client Prisma
npx prisma generate --schema=./prisma/schema.prisma

# Application des migrations si nécessaire
# Cette commande crée les tables dans votre base de données PostgreSQL
# sans besoin de confirmer manuellement (--force)
npx prisma migrate deploy --schema=./prisma/schema.prisma --force

# Insertion des données initiales (comme l'utilisateur admin)
node scripts/init-vercel-db.js
