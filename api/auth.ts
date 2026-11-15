import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleAuthHttp } from '../server/authHandler.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await handleAuthHttp(req, res);
}
