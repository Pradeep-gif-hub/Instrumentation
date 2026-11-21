import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleFeedbackHttp } from '../server/feedbackHandler.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await handleFeedbackHttp(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'That could not be saved. Try again.' });
  }
}
