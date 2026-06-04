import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: 'No font specified' });

  // Trial: serve only the first/Regular weight file
  const trialsDir = path.join(process.cwd(), 'private-fonts', slug, 'trial');
  const fontsDir = path.join(process.cwd(), 'private-fonts', slug);

  let trialFile = null;
  const checkDir = fs.existsSync(trialsDir) ? trialsDir : fontsDir;
  if (fs.existsSync(checkDir)) {
    const files = fs.readdirSync(checkDir).filter(f => /\.(otf|ttf|woff2?)$/i.test(f));
    // Pick regular/book/normal first
    trialFile = files.find(f => /regular|book|normal/i.test(f)) || files[0];
  }

  if (!trialFile) {
    return res.status(404).json({ error: 'Trial not available' });
  }

  const filePath = path.join(checkDir, trialFile);
  const ext = path.extname(trialFile).toLowerCase();
  const mimeTypes = { '.otf': 'font/otf', '.ttf': 'font/ttf', '.woff': 'font/woff', '.woff2': 'font/woff2' };

  res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="HypeForType-${slug}-Trial${ext}"`);
  fs.createReadStream(filePath).pipe(res);
}
