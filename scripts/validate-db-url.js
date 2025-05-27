// scripts/validate-db-url.js
// Script pour valider l'URL de la base de données avant le build

function validateDatabaseUrl() {
  console.log('Validating DATABASE_URL environment variable...');
  
  // Déterminer l'environnement d'exécution
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  console.log(`Running in ${isProduction ? 'production' : 'development'} environment`);
  
  // Vérifier si DATABASE_URL est défini
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error('\x1b[31m%s\x1b[0m', '❌ ERROR: DATABASE_URL environment variable is not set!');
    console.error('\x1b[31m%s\x1b[0m', 'Please set DATABASE_URL in your environment variables.');
    process.exit(1);
  }
  
  // En production (ou sur Vercel), on doit avoir une URL PostgreSQL
  if (isProduction) {
    if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
      console.error('\x1b[31m%s\x1b[0m', '❌ ERROR: In production, DATABASE_URL must start with postgresql:// or postgres://');
      console.error('\x1b[31m%s\x1b[0m', `Current value starts with: ${dbUrl.substring(0, Math.min(10, dbUrl.length))}...`);
      console.error('\x1b[31m%s\x1b[0m', 'Please update your Vercel environment variables with a valid PostgreSQL connection string.');
      console.error('\x1b[31m%s\x1b[0m', 'Example: postgresql://username:password@hostname:5432/database');
      process.exit(1);
    }
  } else {
    // En développement, on peut utiliser SQLite ou PostgreSQL
    if (dbUrl.startsWith('file:')) {
      console.log('\x1b[32m%s\x1b[0m', '✅ Using SQLite database in development mode');
    } else if (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://')) {
      console.log('\x1b[32m%s\x1b[0m', '✅ Using PostgreSQL database in development mode');
    } else {
      console.warn('\x1b[33m%s\x1b[0m', '⚠️ WARNING: DATABASE_URL has an unrecognized format');
      console.warn('\x1b[33m%s\x1b[0m', 'Expected format for SQLite: file:./path/to/db');
      console.warn('\x1b[33m%s\x1b[0m', 'Expected format for PostgreSQL: postgresql://username:password@hostname:5432/database');
      // En développement, on continue quand même
    }
  }
  
  // Vérifier que l'URL contient un nom d'hôte
  try {
    const url = new URL(dbUrl);
    if (!url.hostname) {
      console.error('\x1b[31m%s\x1b[0m', '❌ ERROR: DATABASE_URL is missing a hostname');
      console.error('\x1b[31m%s\x1b[0m', 'Please provide a valid PostgreSQL connection string.');
      process.exit(1);
    }
    
    console.log('\x1b[32m%s\x1b[0m', '✅ DATABASE_URL validation passed!');
    console.log(`   Protocol: ${url.protocol}`);
    console.log(`   Host: ${url.hostname}`);
    console.log(`   Database path: ${url.pathname}`);
    
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ ERROR: DATABASE_URL is not a valid URL');
    console.error('\x1b[31m%s\x1b[0m', 'Please ensure it follows the format: postgresql://username:password@hostname:5432/database');
    process.exit(1);
  }
}

validateDatabaseUrl();
