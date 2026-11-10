import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleSuggestionHttp } from '../server/suggestionHandler';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await handleSuggestionHttp(req, res);
}

