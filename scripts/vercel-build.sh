# Script pour Vercel Build Step
# Assurez-vous de configurer ce script dans votre Vercel Build Command

# Génération du client Prisma
npx prisma generate

# Application des migrations si nécessaire
# Cette commande crée les tables dans votre base de données PostgreSQL
# sans besoin de confirmer manuellement (--force)
npx prisma migrate deploy --force

# Insertion des données initiales (comme l'utilisateur admin)
npx ts-node --transpile-only scripts/init-vercel-db.ts
