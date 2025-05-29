// scripts/validate-db-url.js
// Script pour valider l'URL de la base de données PostgreSQL avant le build

function validateDatabaseUrl() {
  console.log('Validating DATABASE_URL and DIRECT_URL environment variables...');
  
  // Déterminer l'environnement d'exécution
  const isVercel = process.env.VERCEL === '1';
  const isProduction = process.env.NODE_ENV === 'production' || isVercel;
  console.log(`Running in ${isProduction ? 'production' : 'development'} environment`);
  console.log(`Vercel environment: ${isVercel ? 'Yes' : 'No'}`);
  
  // Vérifier si DATABASE_URL est défini
  const dbUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;
  
  if (!dbUrl) {
    console.error('\x1b[31m%s\x1b[0m', '❌ ERROR: DATABASE_URL environment variable is not set!');
    console.error('\x1b[31m%s\x1b[0m', 'Please set DATABASE_URL in your environment variables.');
    process.exit(1);
  }
  
  // Vérifier que l'URL commence par postgresql:// ou postgres://
  if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
    // Sur Vercel, si un script spécial a défini une URL postgres factice pour la construction, on l'accepte
    if (isVercel && dbUrl.includes('fakeverceldb')) {
      console.warn('\x1b[33m%s\x1b[0m', '⚠️ Using fake PostgreSQL URL for Vercel build');
      console.warn('\x1b[33m%s\x1b[0m', '⚠️ Make sure to set a real DATABASE_URL in Vercel environment variables before deployment');
    } else {
      console.error('\x1b[31m%s\x1b[0m', '❌ ERROR: DATABASE_URL must start with postgresql:// or postgres://');
      console.error('\x1b[31m%s\x1b[0m', `Current value starts with: ${dbUrl.substring(0, Math.min(10, dbUrl.length))}...`);
      console.error('\x1b[31m%s\x1b[0m', 'Please update your environment variables with a valid PostgreSQL connection string.');
      console.error('\x1b[31m%s\x1b[0m', 'Example: postgresql://username:password@hostname:5432/database');
      process.exit(1);
    }
  }
  
  // Vérifier DIRECT_URL pour les migrations Prisma (facultatif)
  if (!directUrl && !isVercel) {
    console.warn('\x1b[33m%s\x1b[0m', '⚠️ WARNING: DIRECT_URL environment variable is not set');
    console.warn('\x1b[33m%s\x1b[0m', 'This is recommended for connecting directly to PostgreSQL for Prisma migrations');
  } else if (directUrl && !directUrl.startsWith('postgresql://') && !directUrl.startsWith('postgres://')) {
    console.warn('\x1b[33m%s\x1b[0m', '⚠️ WARNING: DIRECT_URL should start with postgresql:// or postgres://');
  }
  
  console.log('\x1b[32m%s\x1b[0m', '✅ DATABASE_URL validation passed');
  
  // Extraire le hostname pour vérification supplémentaire
  try {
    let hostname = null;
    // Utiliser une regex pour extraire le hostname
    const match = dbUrl.match(/postgres(ql)?:\/\/[^:]+:[^@]+@([^:]+):/);
    
    if (match && match[2]) {
      hostname = match[2];
      console.log(`✅ Hostname identified: ${hostname}`);
    } else if (!isVercel || !dbUrl.includes('fakeverceldb')) {
      console.warn('\x1b[33m%s\x1b[0m', '⚠️ Could not parse hostname from DATABASE_URL');
    }
  } catch (error) {
    console.warn('\x1b[33m%s\x1b[0m', '⚠️ Error parsing DATABASE_URL:', error.message);
  }
}

// Exécuter la validation
validateDatabaseUrl();
