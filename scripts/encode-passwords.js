// scripts/encode-passwords.js
/**
 * This script properly encodes the database connection passwords
 * for use in the .env file
 */

// Function to properly encode special characters for URL
function encodeSpecialChars(input) {
  // First, standard URL encode the password
  let encoded = encodeURIComponent(input);
  
  // Further encode some characters that may cause issues in connection strings
  // Replace % with %25 FIRST since % is used in other encodings
  // Then handle other problematic characters
  encoded = encoded
    .replace(/%/g, '%25')
    .replace(/\+/g, '%2B')
    .replace(/@/g, '%40')
    .replace(/&/g, '%26')
    .replace(/#/g, '%23')
    .replace(/:/g, '%3A')
    .replace(/\$/g, '%24')
    .replace(/\?/g, '%3F')
    .replace(/=/g, '%3D')
    .replace(/\//g, '%2F');
    
  return encoded;
}

// Original credentials (replace with your actual credentials)
const password = 'L@bT&6WuSD%@6&#';

// Encode the password
const encodedPassword = encodeSpecialChars(password);
console.log('Original password:', password);
console.log('Encoded password for connection string:', encodedPassword);

// Generate the database connection strings
const postgresServer = 'aws-0-eu-central-1.pooler.supabase.com';
const postgresUser = 'postgres.yivkbtcnvfkxmfsiqcoz';
const poolPort = '6543';
const directPort = '5432';
const dbName = 'postgres';

const poolerUrl = `postgresql://${postgresUser}:${encodedPassword}@${postgresServer}:${poolPort}/${dbName}?pgbouncer=true`;
const directUrl = `postgresql://${postgresUser}:${encodedPassword}@${postgresServer}:${directPort}/${dbName}`;

console.log('\nAdd these lines to your .env file:');
console.log(`DATABASE_URL="${poolerUrl}"`);
console.log(`DIRECT_URL="${directUrl}"`);

// Output the full URLs for checking
console.log('\nFull DATABASE_URL:', poolerUrl);
console.log('Full DIRECT_URL:', directUrl);
