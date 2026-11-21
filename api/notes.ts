import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleNotesHttp } from '../server/notesHandler.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await handleNotesHttp(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'The notes could not be opened. Try again.' });
  }
}
