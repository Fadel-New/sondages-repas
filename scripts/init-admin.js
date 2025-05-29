// scripts/init-admin.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

/**
 * Script pour initialiser un utilisateur administrateur par défaut dans la base de données
 * À utiliser lors de la première configuration ou du déploiement
 */

async function createDefaultAdmin() {
  console.log('Initialisation de l\'utilisateur admin par défaut...');
  
  // Récupérer les informations d'admin depuis les variables d'environnement ou utiliser des valeurs par défaut
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
  
  // Hasher le mot de passe pour plus de sécurité
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
  
  // Instancier le client Prisma
  const prisma = new PrismaClient();
  
  try {
    console.log(`Vérification si l'admin '${adminUsername}' existe déjà...`);
    
    // Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.admin.findUnique({
      where: {
        username: adminUsername
      }
    });
    
    if (existingAdmin) {
      console.log(`✅ L'administrateur '${adminUsername}' existe déjà dans la base de données.`);
      // Optionnel: mettre à jour le mot de passe si nécessaire
      if (process.env.UPDATE_ADMIN_PASSWORD === 'true') {
        await prisma.admin.update({
          where: { username: adminUsername },
          data: { password: hashedPassword }
        });
        console.log(`✅ Mot de passe mis à jour pour l'administrateur '${adminUsername}'.`);
      }
    } else {
      // Créer un nouvel administrateur
      const newAdmin = await prisma.admin.create({
        data: {
          username: adminUsername,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      
      console.log(`✅ Administrateur '${adminUsername}' créé avec succès (ID: ${newAdmin.id}).`);
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la fonction principale
createDefaultAdmin()
  .then(() => {
    console.log('✅ Script terminé avec succès.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur dans le script:', error);
    process.exit(1);
  });
