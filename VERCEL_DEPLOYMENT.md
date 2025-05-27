# Déploiement sur Vercel

Ce document explique comment déployer correctement l'application sur Vercel.

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

1. Connectez votre dépôt GitHub à Vercel

2. Configurez les variables d'environnement mentionnées ci-dessus dans les paramètres du projet Vercel

3. Si vous utilisez Vercel Postgres:
   - Créez une base de données dans l'interface Vercel
   - Les variables d'environnement seront automatiquement configurées

4. Déployez votre projet

5. Après le premier déploiement, exécutez manuellement les migrations Prisma si nécessaire:
   - Allez dans les "Deployments" sur Vercel
   - Sélectionnez votre déploiement
   - Cliquez sur "Functions"
   - Trouvez une fonction API (comme api/login)
   - Cliquez sur "Logs"
   - Vérifiez s'il y a des erreurs liées à la base de données

## Résolution des problèmes courants

- **Erreur "Missing password"**: Vérifiez que `JWT_SECRET` est correctement configuré
- **Erreurs de base de données**: Vérifiez que `DATABASE_URL` pointe vers une base de données accessible
- **Erreur "file system"**: Assurez-vous d'utiliser une base de données PostgreSQL et non SQLite
