// pages/api/logout.ts
import { withSessionRoute } from '../../lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy();
  res.status(200).json({ message: 'Logged out' });
}

export default withSessionRoute(logoutRoute);