// scripts/fix-env-vars.js
const fs = require('fs');
const path = require('path');

function fixEnvFile() {
  console.log('Checking and fixing environment variables...');
  
  // Path to .env file
  const envPath = path.join(__dirname, '../.env');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file does not exist!');
    return;
  }
  
  let envContent = fs.readFileSync(envPath, 'utf8');
  console.log('Original .env content (partial):', envContent.substring(0, 100) + '...');
  
  // Check if the URL includes special characters that might need proper escaping
  if (envContent.includes('DATABASE_URL=')) {
    console.log('DATABASE_URL found in .env file');
    
    // Look for common special characters in URLs that might cause issues if not escaped properly
    const specialChars = ['%', '@', '&', '#', ':', '+'];
    specialChars.forEach(char => {
      if (envContent.includes(char)) {
        console.log(`Special character found: ${char}`);
      }
    });
    
    // Suggestion: If you know there might be escaping issues, use a well-formed URL with proper encoding
    console.log('Creating a backup of the original .env file');
    fs.writeFileSync(envPath + '.bak', envContent);
    
    // Suggest creating a corrected URL if needed
    console.log('Please ensure your DATABASE_URL and DIRECT_URL have proper escaping for special characters.');
    console.log('If you have % in passwords, they should be URL encoded as %25');
    console.log('If you have @ in passwords, they should be URL encoded as %40');
  } else {
    console.log('DATABASE_URL not found in .env file!');
  }
}

fixEnvFile();
