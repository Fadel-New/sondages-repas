// scripts/validate-db-url.js
// Script pour valider l'URL de la base de données avant le build

function validateDatabaseUrl() {
  console.log('Validating DATABASE_URL environment variable...');
  
  // Vérifier si DATABASE_URL est défini
  const dbUrl = process.env.DATABASE_URL;
  
  if (!dbUrl) {
    console.error('\x1b[31m%s\x1b[0m', '❌ ERROR: DATABASE_URL environment variable is not set!');
    console.error('\x1b[31m%s\x1b[0m', 'Please set DATABASE_URL in your Vercel environment variables to a valid PostgreSQL connection string.');
    console.error('\x1b[31m%s\x1b[0m', 'Example: postgresql://username:password@hostname:5432/database');
    process.exit(1);
  }
  
  // Vérifier que l'URL commence par postgresql:// ou postgres://
  if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
    console.error('\x1b[31m%s\x1b[0m', '❌ ERROR: DATABASE_URL must start with postgresql:// or postgres://');
    console.error('\x1b[31m%s\x1b[0m', `Current value starts with: ${dbUrl.substring(0, Math.min(10, dbUrl.length))}...`);
    console.error('\x1b[31m%s\x1b[0m', 'Please update your Vercel environment variables with a valid PostgreSQL connection string.');
    console.error('\x1b[31m%s\x1b[0m', 'Example: postgresql://username:password@hostname:5432/database');
    process.exit(1);
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
