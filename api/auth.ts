import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleAuthHttp } from '../server/authHandler.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await handleAuthHttp(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sign-in could not be completed.' });
  }
}
