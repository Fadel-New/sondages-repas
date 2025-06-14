// scripts/init-vercel-db.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Initialisation de la base de données pour Vercel...');

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
    
    console.log(`Utilisateur admin créé avec le nom d'utilisateur: ${username}`);
  } else {
    console.log('Un utilisateur admin existe déjà, aucun besoin d\'en créer un nouveau');
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
