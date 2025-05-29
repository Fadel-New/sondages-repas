// pages/api/login-direct.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../lib/auth';
import prisma from '../../lib/db';
import bcrypt from 'bcryptjs';

async function loginDirectRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Chercher l'utilisateur dans la base de données
    const admin = await prisma.admin.findUnique({
      where: {
        username: username
      }
    });

    // Si l'utilisateur n'est pas trouvé
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Vérifier le mot de passe avec bcrypt
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (passwordMatch) {
      // Authentification réussie, enregistrer dans la session
      req.session.admin = {
        username: admin.username,
        isLoggedIn: true,
      };
      await req.session.save();

      return res.status(200).json({ message: 'Login successful', username: admin.username });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default withSessionRoute(loginDirectRoute);
