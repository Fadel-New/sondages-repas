// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute, ensureAdminUser } from '../../lib/auth';
import prisma from '../../lib/db';
import bcrypt from 'bcryptjs';

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await ensureAdminUser(); // S'assurer que l'admin existe (pour la démo)

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Authentification réussie, enregistrer dans la session
    req.session.admin = {
      username: admin.username,
      isLoggedIn: true,
    };
    await req.session.save();

    return res.status(200).json({ message: 'Login successful', username: admin.username });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default withSessionRoute(loginRoute);