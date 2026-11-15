import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleEngineerHttp } from '../server/engineerHandler.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await handleEngineerHttp(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not save that just now.' });
  }
}
