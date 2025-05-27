// scripts/init-vercel-db.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Initialisation de la base de données pour Vercel...');

  // Vérifier si nous utilisons une URL factice sur Vercel
  const isVercel = process.env.VERCEL === '1';
  const dbUrl = process.env.DATABASE_URL || '';
  
  if (isVercel && dbUrl.includes('fakeverceldb')) {
    console.log('⚠️ URL de base de données factice détectée. Initialisation de la base de données ignorée.');
    console.log('⚠️ L\'administrateur sera créé lors du premier déploiement avec une vraie URL PostgreSQL.');
    return;
  }

  try {
    // Vérifier si un administrateur existe déjà
    const adminCount = await prisma.admin.count();
    
    if (adminCount === 0) {
      // Créer l'utilisateur admin s'il n'existe pas
      const username = process.env.ADMIN_USERNAME || 'admin';
      const password = process.env.ADMIN_PASSWORD || 'password123';
      
      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await prisma.admin.create({
        data: {
          username,
          password: hashedPassword,
        }
      });
      
      console.log(`✅ Utilisateur admin créé avec le nom d'utilisateur: ${username}`);
    } else {
      console.log('✅ Un utilisateur admin existe déjà, aucun besoin d\'en créer un nouveau');
    }
  } catch (error) {
    console.error('⚠️ Erreur lors de l\'initialisation de la base de données:', error.message);
    
    // Si nous sommes sur Vercel en mode construction, on ne veut pas faire échouer le build
    if (isVercel) {
      console.log('⚠️ Comme nous sommes sur Vercel, nous continuons le processus de construction');
    } else {
      throw error;
    }
  }
}

main()
  .catch((e) => {
    console.error('Erreur lors de l\'initialisation de la base de données:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
