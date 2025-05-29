// scripts/verify-db-urls.js
/**
 * This script verifies that database URLs are properly formatted
 * It tries to parse the URLs to detect any issues
 */

const { URL } = require('url');

function validateDatabaseUrl(url, type) {
  console.log(`\nValidating ${type}...`);
  
  try {
    // Check if the URL is defined
    if (!url) {
      console.error(`❌ ${type} is not defined`);
      return false;
    }
    
    // Check if it starts with postgresql:// or postgres://
    if (!url.startsWith('postgresql://') && !url.startsWith('postgres://')) {
      console.error(`❌ ${type} does not start with postgresql:// or postgres://`);
      return false;
    }
    
    // Try to parse the URL
    const parsedUrl = new URL(url);
    
    // Print URL components for debugging
    console.log(`- Protocol: ${parsedUrl.protocol}`);
    console.log(`- Username: ${parsedUrl.username}`);
    console.log(`- Password: ${parsedUrl.password ? '***hidden***' : 'No password'}`);
    console.log(`- Hostname: ${parsedUrl.hostname}`);
    console.log(`- Port: ${parsedUrl.port}`);
    console.log(`- Pathname: ${parsedUrl.pathname}`);
    console.log(`- Search params: ${parsedUrl.search}`);
    
    console.log(`✅ ${type} is valid`);
    return true;
  } catch (error) {
    console.error(`❌ Error validating ${type}:`, error.message);
    return false;
  }
}

// Get the URLs from environment variables
const databaseUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;

console.log('Database URL Validation Tool');
console.log('===========================');

// Validate both URLs
const databaseUrlValid = validateDatabaseUrl(databaseUrl, 'DATABASE_URL');
const directUrlValid = validateDatabaseUrl(directUrl, 'DIRECT_URL');

// Summary
console.log('\nValidation Summary:');
console.log('----------------');
console.log(`DATABASE_URL: ${databaseUrlValid ? '✅ Valid' : '❌ Invalid'}`);
console.log(`DIRECT_URL: ${directUrlValid ? '✅ Valid' : '❌ Invalid'}`);

if (databaseUrlValid && directUrlValid) {
  console.log('\n✅ All database URLs are valid and properly formatted.');
  process.exit(0);
} else {
  console.error('\n❌ One or more database URLs have issues. Please fix them before continuing.');
  process.exit(1);
}
