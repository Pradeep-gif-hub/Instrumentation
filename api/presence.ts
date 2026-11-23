import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handlePresenceHttp } from '../server/presenceHandler.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await handlePresenceHttp(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Live visitors could not be loaded.' });
  }
}
