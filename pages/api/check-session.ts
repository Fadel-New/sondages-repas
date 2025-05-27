// pages/api/check-session.ts
import { withSessionRoute } from '../../lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

function sessionStatusRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.admin && req.session.admin.isLoggedIn) {
    res.status(200).json({ admin: req.session.admin });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
}

export default withSessionRoute(sessionStatusRoute);