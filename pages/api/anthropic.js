import { Anthropic } from '@anthropic-ai/sdk';

const ipTracker = new Map();
const DAILY_LIMIT = 3; 

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress;

  const today = new Date().toDateString();
  let userStats = ipTracker.get(ip) || { date: today, count: 0 };

  if (userStats.date !== today) {
    userStats.date = today;
    userStats.count = 0;
  }

  if (userStats.count >= DAILY_LIMIT) {
    return res.status(429).json({ error: `Daily limit of ${DAILY_LIMIT} generations reached.` });
  }

  const { mockupPrompt, fontName } = req.body;
  if (!mockupPrompt || !fontName) return res.status(400).json({ error: 'Missing prompt parameters.' });

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 1000,
      system: `You are an elite creative director. Generate responsive SVG/HTML styling representing a premium packaging box or poster layout using the font "${fontName}". You MUST visibly stamp a bold watermark text "UNLICENSED · HYPERFLURO" across the design. Return ONLY raw SVG/HTML code without markdown fences.`,
      messages: [{ role: 'user', content: `Context: ${mockupPrompt}` }],
    });

    userStats.count += 1;
    ipTracker.set(ip, userStats);
    return res.status(200).json({ result: response.content[0].text });
  } catch (error) {
    return res.status(500).json({ error: 'AI credits exhausted or configuration missing.' });
  }
}
