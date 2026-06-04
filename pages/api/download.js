import { validateToken } from '../../lib/tokens';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'No token provided' });

  const result = validateToken(token);
  if (!result.valid) {
    return res.status(403).json({ error: result.error });
  }

  const { fontSlug } = result.orderData;

  // Font files must be placed in /private-fonts/ (not in /public/)
  // On Vercel: upload to Vercel Blob and fetch from there
  // For now serve from local private-fonts directory
  const fontsDir = path.join(process.cwd(), 'private-fonts', fontSlug);

  if (!fs.existsSync(fontsDir)) {
    return res.status(404).json({ error: 'Font files not found. Contact support@hypefortype.com' });
  }

  // Stream a zip of all font files
  const archiver = require('archiver');
  const archive = archiver('zip', { zlib: { level: 9 } });

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="hypefortype-${fontSlug}.zip"`);

  archive.pipe(res);
  archive.directory(fontsDir, false);
  await archive.finalize();
}
