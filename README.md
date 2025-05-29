# Sondage sur les solutions de repas

Ce projet est une plateforme de sondage qui permet aux utilisateurs de répondre à un questionnaire sur leurs habitudes alimentaires et leurs besoins en matière de repas. Les administrateurs peuvent consulter et analyser les réponses soumises.

## Technologies utilisées

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de données**: PostgreSQL via Prisma
- **Authentication**: Iron Session

## Fonctionnalités

- **Formulaire de sondage**: Interface utilisateur pour recueillir les réponses
- **Panel d'administration**: Tableau de bord pour visualiser et analyser les réponses
- **Export CSV**: Export des données pour analyse externe
- **Authentification**: Protection des données administratives

## Installation

### Prérequis

- Node.js 20+
- npm ou yarn

### Configuration

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/sondages-repas.git
   cd sondages-repas
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement :
   ```bash
   cp .env.example .env.local
   # Modifiez les valeurs dans .env.local avec vos informations de connexion PostgreSQL
   ```

4. Générez le client Prisma et appliquez les migrations :
   ```bash
   npm run prisma:generate
   npm run prisma:migrate init_postgres
   ```

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Déploiement sur Vercel

Ce projet est configuré pour fonctionner sur Vercel en utilisant PostgreSQL en production.

### Prérequis pour le déploiement

1. Un compte Vercel
2. Une base de données PostgreSQL (via Vercel Postgres ou un service externe)

### Instructions de déploiement

1. Importez votre projet dans Vercel
2. Configurez les variables d'environnement suivantes:
   - `DATABASE_URL`: URL de connexion à votre base de données PostgreSQL
   - `JWT_SECRET`: Chaîne secrète d'au moins 32 caractères
   - `ADMIN_USERNAME`: (Optionnel) Nom d'utilisateur admin
   - `ADMIN_PASSWORD`: (Optionnel) Mot de passe admin

3. Déployez l'application

Pour des instructions détaillées, consultez notre [Guide de déploiement Vercel](./VERCEL_DEPLOYMENT.md).

### Informations importantes

- Le projet utilise PostgreSQL dans tous les environnements (développement et production)
- Utilisez Prisma Studio pour explorer la base de données : `npm run prisma:studio`

### Résolution des problèmes courants de déploiement

#### Erreur "the URL must start with the protocol postgresql:// or postgres://"

Cette erreur survient lorsque la variable d'environnement `DATABASE_URL` n'est pas correctement configurée.

**Solution**:
1. Vérifiez que vous avez défini `DATABASE_URL` dans les variables d'environnement de Vercel
2. Assurez-vous que la valeur commence exactement par `postgresql://` ou `postgres://`
3. Format correct: `postgresql://utilisateur:mot_de_passe@hôte:port/base_de_données`

#### Erreur de connexion PostgreSQL

Si vous rencontrez des erreurs de connexion à la base de données, vérifiez les points suivants :

**Solution**:
1. Assurez-vous que les variables `DATABASE_URL` et `DIRECT_URL` sont correctement configurées
2. Vérifiez que les identifiants PostgreSQL sont corrects et que les caractères spéciaux sont bien URL-encodés
3. Assurez-vous que votre adresse IP est autorisée dans les règles de pare-feu de votre base de données PostgreSQL
