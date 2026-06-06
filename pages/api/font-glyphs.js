import path from 'path';
import fs from 'fs';
import opentype from 'opentype.js';

export default async function handler(req, res) {
  const { slug, file } = req.query;
  if (!slug || !file) return res.status(400).json({ error: 'Missing slug or file' });

  // Security: no path traversal
  const safeFile = path.basename(file);
  const fontPath = path.join(process.cwd(), 'public', 'fonts', slug, safeFile);

  if (!fs.existsSync(fontPath)) {
    return res.status(404).json({ error: 'Font not found', path: fontPath });
  }

  try {
    const font = opentype.loadSync(fontPath);
    const glyphs = [];

    for (let i = 0; i < font.glyphs.length; i++) {
      const glyph = font.glyphs.get(i);
      // Only include glyphs with a unicode codepoint and a name (skip .notdef etc)
      if (glyph.unicode && glyph.unicode > 31) {
        glyphs.push({
          unicode: glyph.unicode,
          char: String.fromCodePoint(glyph.unicode),
          name: glyph.name || '',
          hex: 'U+' + glyph.unicode.toString(16).toUpperCase().padStart(4, '0'),
        });
      }
    }

    // Cache for 1 hour
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json({ count: glyphs.length, glyphs });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
