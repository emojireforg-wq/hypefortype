import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  const { slug, file } = req.query;
  if (!slug || !file) return res.status(400).json({ error: 'Missing slug or file' });

  const safeFile = path.basename(file);
  const fontPath = path.join(process.cwd(), 'public', 'fonts', slug, safeFile);

  if (!fs.existsSync(fontPath)) {
    return res.status(404).json({ error: 'Font not found', path: fontPath });
  }

  try {
    const opentype = (await import('opentype.js')).default;
    const buffer = fs.readFileSync(fontPath);
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    const font = opentype.parse(arrayBuffer);
    
    const glyphs = [];
    for (let i = 0; i < font.glyphs.length; i++) {
      const glyph = font.glyphs.get(i);
      if (glyph.unicode && glyph.unicode > 31 && glyph.unicode < 65536) {
        glyphs.push({
          unicode: glyph.unicode,
          char: String.fromCodePoint(glyph.unicode),
          hex: 'U+' + glyph.unicode.toString(16).toUpperCase().padStart(4, '0'),
        });
      }
    }

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json({ count: glyphs.length, glyphs });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
