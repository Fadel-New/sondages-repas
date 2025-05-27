# Sondage sur les solutions de repas

Ce projet est une plateforme de sondage qui permet aux utilisateurs de répondre à un questionnaire sur leurs habitudes alimentaires et leurs besoins en matière de repas. Les administrateurs peuvent consulter et analyser les réponses soumises.

## Technologies utilisées

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de données**: 
  - Développement: SQLite via Prisma
  - Production: PostgreSQL via Prisma
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
   cp .env.production.example .env.local
   # Modifiez les valeurs dans .env.local selon vos besoins
   ```

4. Initialisez la base de données SQLite (développement) :
   ```bash
   npm run init-sqlite
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

- Le système basculera automatiquement vers PostgreSQL en environnement de production
- Pour tester la configuration PostgreSQL en local, utilisez `npm run use-postgres`
- Pour revenir à SQLite en local, utilisez `npm run use-sqlite`
