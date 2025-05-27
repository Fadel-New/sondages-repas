// pages/api/login-direct.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute } from '../../lib/auth';
import prisma from '../../lib/db';

// Version simplifiée de la page de connexion qui n'utilise pas bcrypt ni ensureAdminUser
async function loginDirectRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Vérifier directement les identifiants (pour le débogage uniquement)
    // Dans un environnement de production, utilisez bcrypt pour comparer les mots de passe
    if (username === 'admin' && password === 'password123') {
      // Authentification réussie, enregistrer dans la session
      req.session.admin = {
        username: 'admin',
        isLoggedIn: true,
      };
      await req.session.save();

      return res.status(200).json({ message: 'Login successful', username: 'admin' });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default withSessionRoute(loginDirectRoute);
