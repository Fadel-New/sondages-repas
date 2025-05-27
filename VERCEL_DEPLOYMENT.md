# Déploiement sur Vercel

Ce document explique comment déployer correctement l'application sur Vercel.

## Préparation pour le déploiement en production

Avant de déployer sur Vercel:

1. Préparez votre schéma Prisma pour PostgreSQL:
   ```bash
   npm run use-postgres
   ```
   
   Ce script vous demandera l'URL de votre base de données PostgreSQL et configurera automatiquement votre projet.

## Variables d'environnement requises

Assurez-vous de configurer ces variables d'environnement dans les paramètres du projet Vercel:

1. `JWT_SECRET`: Une chaîne secrète d'au moins 32 caractères pour sécuriser les sessions
   - Exemple: `ma-cle-secrete-tres-longue-et-complexe-pour-vercel`

2. `DATABASE_URL`: L'URL de connexion à votre base de données PostgreSQL
   - Exemple: `postgresql://user:password@host:port/database`
   - Note: Pour une configuration facile, utilisez Vercel Postgres ou un service externe comme Supabase, Neon, etc.

3. `ADMIN_USERNAME`: Le nom d'utilisateur administrateur (optionnel, par défaut "admin")

4. `ADMIN_PASSWORD`: Le mot de passe administrateur (optionnel, par défaut "password123")

## Étapes de déploiement

1. Créez une base de données PostgreSQL:
   - Option 1: Via [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - Option 2: Via un service comme [Supabase](https://supabase.com), [Neon](https://neon.tech) ou [Railway](https://railway.app)

2. Préparez votre schéma pour PostgreSQL:
   ```bash
   npm run use-postgres
   ```

3. Connectez votre dépôt GitHub à Vercel

4. Configurez les variables d'environnement mentionnées ci-dessus dans les paramètres du projet Vercel

5. Déployez votre projet

6. Votre application devrait fonctionner immédiatement, car le script de build Vercel exécute automatiquement:
   - La génération du client Prisma
   - Les migrations de la base de données
   - L'initialisation du compte administrateur

## Résolution des problèmes courants

- **Erreur "Missing password"**: Vérifiez que `JWT_SECRET` est correctement configuré dans les variables d'environnement Vercel
- **Erreurs de base de données**: Vérifiez que `DATABASE_URL` pointe vers une base de données PostgreSQL accessible
- **Erreur "file system" ou "SQLITE_READONLY"**: Cela indique que vous essayez d'utiliser SQLite en production. Assurez-vous d'avoir:
  1. Utilisé le script `npm run use-postgres` avant le déploiement
  2. Configuré correctement l'URL de votre base de données PostgreSQL
  3. Utilisé le schéma PostgreSQL dans votre déploiement

## Comment tester localement la configuration de production

Pour tester localement que votre configuration fonctionne avec PostgreSQL:

1. Installez PostgreSQL localement ou créez une base de données distante pour tester
2. Exécutez `npm run use-postgres` et fournissez l'URL de connexion
3. Exécutez `npx prisma migrate deploy` pour appliquer les migrations
4. Lancez l'application avec `npm run dev` et vérifiez qu'elle fonctionne correctement
5. Avant de revenir au développement normal, vous pouvez exécuter `npm run use-sqlite` pour revenir à SQLite
