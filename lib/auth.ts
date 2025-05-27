// lib/auth.ts
import { getIronSession } from 'iron-session';
import { NextApiRequest, NextApiResponse, GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from 'next';
// jwt supprimé car non utilisé
import prisma from './db';
import bcrypt from 'bcryptjs'; // Vous aurez besoin d'installer bcryptjs: npm install bcryptjs @types/bcryptjs

const sessionOptions = {
  password: process.env.JWT_SECRET as string, // Doit être une chaîne secrète de 32 caractères minimum
  cookieName: 'myapp_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production', // Mettre à true en production (HTTPS)
  },
};

// Déclarez la structure de votre session
declare module 'iron-session' {
  interface IronSessionData {
    admin?: {
      username: string;
      isLoggedIn: true;
    };
  }
}

// Étendre le type IncomingMessage pour inclure la propriété session
declare module 'http' {
  interface IncomingMessage {
    session?: import('iron-session').IronSession<import('iron-session').IronSessionData>;
  }
}

export function withSessionRoute(handler: NextApiHandler) {
  return async function newHandler(req: NextApiRequest, res: NextApiResponse) {
    req.session = await getIronSession(req, res, sessionOptions);
    return handler(req, res);
  };
}

// HOC pour protéger les pages SSR
export function withSessionSsr<P extends Record<string, unknown> = Record<string, unknown>>(
  handler: (
    context: GetServerSidePropsContext,
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
  return async function newHandler(context: GetServerSidePropsContext) {
    context.req.session = await getIronSession(context.req, context.res, sessionOptions);
    return handler(context);
  };
}

// Fonction pour créer un utilisateur admin au démarrage si non existant (simplifié)
export async function ensureAdminUser() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'password123';

  try {
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.admin.create({
        data: {
          username,
          password: hashedPassword,
          updatedAt: new Date(), // Ajouté pour satisfaire le schéma Prisma
        },
      });
      console.log('Admin user created:', username);
    }
  } catch (error) {
    console.error('Error ensuring admin user:', error);
  }
}

// Appelez cette fonction une fois au démarrage du serveur (par exemple, dans _app.tsx ou un script de démarrage)
// Pour la simplicité, nous pourrions l'appeler au début de l'API de login
