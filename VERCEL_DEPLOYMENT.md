# Guide de déploiement sur Vercel

Ce guide explique comment déployer correctement l'application sur Vercel avec PostgreSQL.

## Prérequis

1. Un compte [Vercel](https://vercel.com/)
2. Une base de données PostgreSQL
   - Option recommandée : [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - Alternatives : [Supabase](https://supabase.com), [Neon](https://neon.tech), [Railway](https://railway.app)

## Préparation pour le déploiement en production

Le schéma Prisma est désormais configuré automatiquement pour utiliser PostgreSQL en production. Vous n'avez pas besoin de faire de modifications manuelles.

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

### 1. Préparation de la base de données PostgreSQL

Créez une base de données PostgreSQL et notez l'URL de connexion au format :
```
postgresql://utilisateur:mot_de_passe@hôte:port/base_de_données
```

### 2. Configuration du projet sur Vercel

1. Connectez votre dépôt GitHub à Vercel
2. Dans les paramètres du projet, configurez les variables d'environnement suivantes :
   - `DATABASE_URL` : L'URL de connexion à votre base de données PostgreSQL
   - `JWT_SECRET` : Une chaîne aléatoire d'au moins 32 caractères
   - `ADMIN_USERNAME` : Nom d'utilisateur admin (optionnel)
   - `ADMIN_PASSWORD` : Mot de passe admin (optionnel)

### 3. Déploiement

Le processus de déploiement sur Vercel exécutera automatiquement :
1. La génération du client Prisma
2. Les migrations de base de données pour créer les tables
3. La création d'un utilisateur admin par défaut
4. La construction de l'application Next.js

## Dépannage

### Problème : Erreur "Schema not found"

**Solution** : Vérifiez que le chemin vers le fichier schema.prisma est correct. Le déploiement utilise `--schema=./prisma/schema.prisma`.

### Problème : Erreur de connexion à la base de données

**Solution** :
- Vérifiez que l'URL de connexion est correcte
- Assurez-vous que la base de données est accessible depuis Vercel
- Vérifiez que l'utilisateur de la base de données a les permissions nécessaires

### Problème : Erreur "Unknown file extension .ts"

**Solution** : Ce problème a été résolu en convertissant les scripts TypeScript en JavaScript pour la compatibilité avec Vercel.

### Problème : Erreur "Missing password" avec Iron Session

**Solution** : Vérifiez que `JWT_SECRET` est correctement configuré dans les variables d'environnement Vercel.

### Problème : Erreur "SQLITE_READONLY"

**Solution** : Cette erreur indique que vous essayez d'utiliser SQLite en production. Notre configuration utilise maintenant automatiquement PostgreSQL en production.

## Comment tester localement la configuration de production

Pour tester localement que votre configuration fonctionne avec PostgreSQL:

1. Installez PostgreSQL localement ou créez une base de données distante pour tester
2. Exécutez `npm run use-postgres` et fournissez l'URL de connexion
3. Exécutez `npx prisma migrate deploy` pour appliquer les migrations
4. Lancez l'application avec `npm run dev` et vérifiez qu'elle fonctionne correctement
5. Avant de revenir au développement normal, vous pouvez exécuter `npm run use-sqlite` pour revenir à SQLite
