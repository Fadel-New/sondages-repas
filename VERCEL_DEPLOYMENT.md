# Guide de déploiement sur Vercel

Ce guide explique comment déployer correctement l'application sur Vercel avec PostgreSQL.

## Prérequis

1. Un compte [Vercel](https://vercel.com/)
2. Une base de données PostgreSQL
   - Option recommandée : [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - Alternatives : [Supabase](https://supabase.com), [Neon](https://neon.tech), [Railway](https://railway.app)

## Déploiement simplifié (IMPORTANT!)

Nous avons automatisé le processus de déploiement pour qu'il fonctionne même sans configurer DATABASE_URL au préalable.
Cependant, **il est essentiel de configurer les variables d'environnement après le premier déploiement**:

1. Faites votre premier déploiement sur Vercel en connectant votre dépôt GitHub
2. Une fois le déploiement initial terminé, **configurez les variables d'environnement** dans le tableau de bord Vercel
3. Redéployez l'application pour qu'elle utilise ces variables d'environnement

Sans cette étape, votre application ne pourra pas accéder à une vraie base de données en production!

## Variables d'environnement requises

Assurez-vous de configurer ces variables d'environnement dans les paramètres du projet Vercel:

1. `JWT_SECRET`: Une chaîne secrète d'au moins 32 caractères pour sécuriser les sessions
   - Exemple: `ma-cle-secrete-tres-longue-et-complexe-pour-vercel`

2. `DATABASE_URL`: L'URL de connexion à votre base de données PostgreSQL via un pool de connexions
   - **IMPORTANT**: L'URL doit obligatoirement commencer par `postgresql://` ou `postgres://`
   - Format: `postgresql://utilisateur:mot_de_passe@hôte:port/base_de_données?pgbouncer=true`
   - Exemple avec Supabase: `postgresql://postgres.[ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true`

3. `DIRECT_URL`: L'URL de connexion directe à votre base de données PostgreSQL (pour les migrations)
   - Format: `postgresql://utilisateur:mot_de_passe@hôte:port/base_de_données`
   - Exemple avec Supabase: `postgresql://postgres.[ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`

4. (Optionnel) `ADMIN_USERNAME` et `ADMIN_PASSWORD`: Pour définir les identifiants d'administrateur
   - Exemple: `admin` et `mot_de_passe_securise`

## Conseils pour les URL de base de données

Si vous utilisez des mots de passe contenant des caractères spéciaux comme `@`, `&`, `#`, etc., assurez-vous qu'ils sont correctement encodés pour URL:

- `@` devient `%40`
- `&` devient `%26`
- `#` devient `%23`
- `%` devient `%25`

Exemple:
- Mot de passe original: `p@ssw0rd&123`
- Version encodée dans l'URL: `p%40ssw0rd%26123`

## Configuration pour Supabase

Si vous utilisez Supabase comme fournisseur de base de données PostgreSQL:

1. Créez un projet sur Supabase et accédez à la section Base de données
2. Dans "Connection Pooling", copiez l'URL de connexion pour `DATABASE_URL`
3. Dans "Connection String", copiez l'URL directe pour `DIRECT_URL`
4. Ajoutez ces URLs à vos variables d'environnement Vercel

## Résolution des problèmes courants

### Problème : Erreur "Cannot find module '@prisma/client'"

**Solution** : Ce problème se produit quand le client Prisma n'est pas généré correctement. Vérifiez dans votre tableau de bord de déploiement Vercel que `postinstall` s'exécute bien.

### Problème : Erreur "the URL must start with the protocol postgresql:// or postgres://"

**Solution** :
- Vérifiez que `DATABASE_URL` est correctement configuré avec une URL PostgreSQL valide
- Assurez-vous que l'URL commence bien par `postgresql://` ou `postgres://`
- Vérifiez que les caractères spéciaux sont correctement encodés

### Problème : Erreur "schema.prisma not found"

**Solution** : Vérifiez que le chemin vers le fichier schema.prisma est correct. Le déploiement utilise `--schema=./prisma/schema.prisma`.

### Problème : Erreur de connexion à la base de données

**Solution** :
- Vérifiez que l'URL de connexion est correcte
- Assurez-vous que la base de données est accessible depuis Vercel
- Vérifiez que l'utilisateur de la base de données a les permissions nécessaires
- Pour Supabase, vérifiez que votre adresse IP est autorisée dans la configuration du réseau

### Problème : Erreur "Unknown file extension .ts"

**Solution** : Ce problème a été résolu en convertissant les scripts TypeScript en JavaScript pour la compatibilité avec Vercel.

### Problème : Erreur "Missing password" avec Iron Session

**Solution** : Vérifiez que `JWT_SECRET` est correctement configuré dans les variables d'environnement Vercel.
