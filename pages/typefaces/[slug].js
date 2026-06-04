import Head from 'next/head';
import Link from 'next/link';
import { fonts, pricing } from '../../lib/fonts';
import { useState, useRef, useEffect } from 'react';
import Script from 'next/script';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

const KANJI = {
  Japanese:      ['字','体','形','美','力','光','影','道','心','空','時','夢'],
  'Japanese Pro':['字','体','形','美','力','光','影','道','心','空','時','夢'],
  'Rounded Pro': ['丸','柔','美','和','円','温','優','軽','雅','清'],
  Display:       ['力','威','大','烈','猛','剛','強','爆','激','迫'],
  Handmade:      ['手','書','心','情','感','想','詩','文','筆','艺'],
  Pro:           ['業','技','匠','精','達','完','熟','巧','工','術'],
  default:       ['美','形','字','体','光','道','心','夢','力','空'],
};
function getKanji(tags) {
  for (const t of tags) if (KANJI[t]) return KANJI[t];
  return KANJI.default;
}

const SPECIMENS = {
  'nanami-rounded-pro': [
    '/specimens/nanami-rounded-pro-1.jpg',
    '/specimens/nanami-rounded-pro-2.jpg',
    '/specimens/nanami-rounded-pro-3.jpg',
    '/specimens/nanami-rounded-pro-4.jpg',
    '/specimens/nanami-rounded-pro-5.jpg',
    '/specimens/nanami-rounded-pro-6.jpg',
  ],
};

const GLYPH_SETS = {
  UPP: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  LOW: 'abcdefghijklmnopqrstuvwxyz'.split(''),
  NUM: '0123456789'.split(''),
  PUN: '.,;:!?\'"-—…()[]{}@#$%&*'.split(''),
  ACC: 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖØÙÚÛÜÝàáâãäåæçèéêëìíîïñòóôõöøùúûüý'.split(''),
};

const LOREM = `Gentle curves meet geometric precision. A typeface designed for the space between structure and warmth — where every terminal softens without apology, and every weight carries its own distinct gravity. Set in body text, headlines, packaging, or screen. Nanami Rounded Pro performs across every context with quiet confidence.`;

// NBA blue — #325eff (extracted from screenshot)
const C = {
  bg:           '#000000',
  surface:      '#0a0a0f',
  surface2:     '#0f0f1a',
  border:       '#1c1c2e',
  borderBright: '#2a2a45',
  accent:       '#325eff',   // NBA blue extracted
  accentDim:    'rgba(50,94,255,0.15)',
  accentBorder: 'rgba(50,94,255,0.4)',
  accentGlow:   '0 0 10px rgba(50,94,255,0.5)',
  text1:        '#cbced3',
  text2:        '#b0b1b6',
  text3:        '#9097a1',
  text4:        '#4a4d56',
  white:        '#f2f1eb',
  sg:           "'Space Grotesk', sans-serif",
  sm:           "'Space Mono', monospace",
  det:          "'Determination', monospace",
};

const BG_OPTIONS   = ['#000000','#0a0a0f','#ffffff','#f5f4f0','#1a1a2e','#0d1117'];
const TEXT_OPTIONS = ['#f2f1eb','#cbced3','#000000','#325eff','#ffffff','#9097a1'];

export default function FontPage({ font }) {
  const [activeStyle,     setActiveStyle]     = useState(0);
  const [previewText,     setPreviewText]      = useState('');
  const [fontSize,        setFontSize]         = useState(80);
  const [letterSpacing,   setLetterSpacing]    = useState(0);
  const [lineHeight,      setLineHeight]       = useState(1.0);
  const [selectedLicense, setSelectedLicense]  = useState('desktop');
  const [glyphSet,        setGlyphSet]         = useState('UPP');
  const [activeSpecimen,  setActiveSpecimen]   = useState(0);
  const [viewMode,        setViewMode]         = useState('display'); // display | headline | body
  const [bgColor,         setBgColor]          = useState('#000000');
  const [textColor,       setTextColor]        = useState('#f2f1eb');
  const [focusedGlyph,    setFocusedGlyph]     = useState(null);
  const [paypalReady,     setPaypalReady]      = useState(false);
  const [purchasing,      setPurchasing]       = useState(false);
  const paypalRef = useRef(null);

  const tiers       = pricing[font.isFamily ? 'family' : 'single'];
  const style       = font.styles[activeStyle];
  const fontFamily  = `'${font.name}', monospace`;
  const displayText = previewText.trim() || font.name;
  const kanji       = getKanji(font.tags);
  const specimens   = SPECIMENS[font.slug] || [];
  const fontIdx     = fonts.findIndex(f => f.slug === font.slug);
  const prevFont    = fonts[fontIdx - 1] || fonts[fonts.length - 1];
  const nextFont    = fonts[fontIdx + 1] || fonts[0];

  useEffect(() => {
    if (!paypalReady || !paypalRef.current) return;
    paypalRef.current.innerHTML = '';
    const tier = tiers[selectedLicense];
    window.paypal.Buttons({
      createOrder: async () => {
        const res = await fetch('/api/paypal-create', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: tier.price, description: `${font.name} — ${tier.label} License` }),
        });
        return (await res.json()).orderId;
      },
      onApprove: async (data) => {
        setPurchasing(true);
        const res = await fetch('/api/paypal-capture', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: data.orderID, fontSlug: font.slug, licenseTier: selectedLicense }),
        });
        const result = await res.json();
        if (result.success) window.location.href = `/download?token=${result.token}`;
        setPurchasing(false);
      },
      style: { layout: 'horizontal', color: 'black', shape: 'rect', label: 'buynow', height: 40, tagline: false },
    }).render(paypalRef.current);
  }, [paypalReady, selectedLicense, font]);

  const currentGlyphs = GLYPH_SETS[glyphSet];

  return (
    <>
      <Head>
        <title>{font.name} — HypeForType</title>
        <meta name="description" content={font.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
        {font.styles.map(s => (
          <style key={s.file}>{`@font-face{font-family:'${font.name}';src:url('/fonts/${font.slug}/${encodeURIComponent(s.file)}');font-weight:${s.weight};font-style:${s.oblique?'italic':'normal'};font-display:swap;}`}</style>
        ))}
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html, body { background: #000 !important; color: ${C.text1} !important; font-family: ${C.sg} !important; -webkit-font-smoothing: antialiased; }
          ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: #000; } ::-webkit-scrollbar-thumb { background: #1c1c2e; }
          a { text-decoration: none; color: inherit; }
          button { cursor: pointer; }

          /* NAV */
          .nav {
            position: sticky; top: 0; z-index: 200;
            display: grid; grid-template-columns: auto auto 1fr auto auto auto;
            height: 48px; border-bottom: 1px solid ${C.border};
            background: rgba(0,0,0,0.92); backdrop-filter: blur(12px);
          }
          .nav-logo { font-family:${C.det}; font-size:.85rem; letter-spacing:.08em; text-transform:uppercase; color:${C.white}; padding:0 1.2rem; border-right:1px solid ${C.border}; display:flex; align-items:center; }
          .nav-back { font-family:${C.sg}; font-size:11px; font-weight:500; letter-spacing:.08em; text-transform:uppercase; color:${C.text4}; padding:0 1.2rem; border-right:1px solid ${C.border}; display:flex; align-items:center; transition:color .15s; }
          .nav-back:hover { color:${C.text1}; }
          .nav-prev, .nav-next { font-family:${C.sg}; font-size:11px; font-weight:600; color:${C.text4}; padding:0 .9rem; border-right:1px solid ${C.border}; display:flex; align-items:center; transition:color .15s; white-space:nowrap; overflow:hidden; max-width:140px; }
          .nav-prev:hover, .nav-next:hover { color:${C.text1}; }
          .nav-next { border-right:none; border-left:1px solid ${C.border}; }
          .nav-trial { font-family:${C.sg}; font-size:11px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:${C.accent}; padding:0 1.2rem; border-left:1px solid ${C.border}; border-right:1px solid ${C.border}; display:flex; align-items:center; background:none; border-top:none; border-bottom:none; transition:opacity .15s; }
          .nav-trial:hover { opacity:.75; }
          .nav-buy { font-family:${C.sg}; font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#fff; background:${C.accent}; padding:0 1.4rem; display:flex; align-items:center; transition:opacity .15s; }
          .nav-buy:hover { opacity:.85; }

          /* LAYOUT */
          .page-layout { display:grid; grid-template-columns:1fr 300px; min-height:calc(100vh - 48px); }

          /* LEFT CANVAS */
          .canvas {
            border-right:1px solid ${C.border};
            display:flex; flex-direction:column;
            transition: background .3s;
            min-height: calc(100vh - 48px);
          }
          .canvas-toolbar {
            display:flex; align-items:center; gap:.5rem; flex-wrap:wrap;
            padding:8px 1.4rem; border-bottom:1px solid ${C.border};
            background:rgba(0,0,0,0.6); flex-shrink:0;
          }
          .tb-label { font-family:${C.sm}; font-size:9px; color:${C.text4}; letter-spacing:.12em; text-transform:uppercase; flex-shrink:0; }
          .tb-sep { width:1px; height:16px; background:${C.border}; flex-shrink:0; }
          .tb-btn { font-family:${C.sg}; font-size:10px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; padding:4px 10px; border:1px solid ${C.border}; background:transparent; color:${C.text4}; transition:all .15s; }
          .tb-btn:hover { border-color:${C.borderBright}; color:${C.text1}; }
          .tb-btn.on { background:${C.accentDim}; border-color:${C.accent}; color:${C.accent}; }
          .tb-swatch { width:18px; height:18px; border:1px solid ${C.border}; cursor:pointer; transition:border-color .15s; flex-shrink:0; }
          .tb-swatch:hover, .tb-swatch.on { border-color:${C.accent}; outline:1px solid ${C.accent}; }

          /* Focused glyph overlay */
          .glyph-focus {
            position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
            background:rgba(0,0,0,0.92); z-index:10; cursor:pointer;
          }
          .glyph-focus-char { font-size:clamp(12rem,30vw,24rem); line-height:1; }
          .glyph-focus-label { font-family:${C.sm}; font-size:11px; color:${C.text4}; letter-spacing:.1em; margin-top:1rem; }

          /* Live display area */
          .canvas-stage {
            flex:1; padding:clamp(1.8rem,4vw,3rem);
            display:flex; align-items:center; justify-content:center; overflow:hidden;
            position:relative; cursor:text;
          }
          .canvas-headline-text {
            width:100%; line-height:.92; letter-spacing:-.02em; word-break:break-word;
            transition: font-size .08s, letter-spacing .08s, line-height .08s;
          }
          .canvas-body-text {
            width:100%; max-width:60ch;
            transition: font-size .08s, line-height .08s;
          }
          .canvas-edit-bar {
            display:flex; align-items:center; gap:.6rem;
            border-top:1px solid ${C.border}; padding:10px 1.4rem;
            flex-shrink:0;
          }
          .canvas-edit-label { font-family:${C.sm}; font-size:9px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:${C.accent}; flex-shrink:0; }
          .canvas-edit-input { flex:1; background:transparent; border:none; outline:none; font-family:${C.sg}; font-size:13px; color:${C.text2}; caret-color:${C.accent}; }
          .canvas-edit-input::placeholder { color:${C.text4}; }

          /* Meta strip */
          .meta-strip { display:flex; border-top:1px solid ${C.border}; flex-shrink:0; }
          .meta-cell { flex:1; padding:.8rem 1rem; border-right:1px solid ${C.border}; display:flex; flex-direction:column; gap:3px; }
          .meta-cell:last-child { border-right:none; }
          .meta-val { font-family:${C.det}; font-size:1.2rem; color:${C.text1}; line-height:1; }
          .meta-key { font-family:${C.sg}; font-size:9px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:${C.text4}; margin-top:2px; }

          /* RIGHT PANEL */
          .panel { background:${C.surface}; display:flex; flex-direction:column; overflow-y:auto; }
          .panel-head { padding:12px 16px; border-bottom:1px solid ${C.border}; display:flex; justify-content:space-between; align-items:center; flex-shrink:0; position:sticky; top:0; background:${C.surface}; z-index:5; }
          .panel-title { font-family:${C.sg}; font-size:10px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:${C.text1}; }
          .panel-ver { font-family:${C.sm}; font-size:9px; color:${C.text4}; }
          .panel-section { padding:14px 16px; border-bottom:1px solid ${C.border}; }
          .panel-section:last-child { border-bottom:none; }
          .ps-head { display:flex; justify-content:space-between; margin-bottom:10px; }
          .ps-lbl { font-family:${C.sg}; font-size:11px; color:${C.text3}; font-weight:500; }
          .ps-val { font-family:${C.sm}; font-size:10px; color:${C.text1}; }

          /* Weight dropdown */
          .weight-select { width:100%; background:${C.surface2}; border:1px solid ${C.border}; color:${C.text1}; font-family:${C.sg}; font-size:12px; font-weight:500; padding:8px 10px; outline:none; cursor:pointer; transition:border-color .15s; }
          .weight-select:focus { border-color:${C.accent}; }

          /* Sliders */
          .panel-slider { width:100%; height:2px; -webkit-appearance:none; appearance:none; background:${C.border}; outline:none; border-radius:1px; cursor:pointer; }
          .panel-slider::-webkit-slider-thumb { -webkit-appearance:none; width:13px; height:13px; border-radius:50%; background:${C.accent}; cursor:pointer; box-shadow:${C.accentGlow}; }
          .range-labels { display:flex; justify-content:space-between; margin-top:4px; }
          .range-labels span { font-family:${C.sm}; font-size:9px; color:${C.text4}; }

          /* Glyph inspector */
          .glyph-count { font-family:${C.sm}; font-size:9px; color:${C.text4}; margin-bottom:8px; }
          .glyph-tabs { display:flex; border:1px solid ${C.border}; margin-bottom:8px; }
          .gtab { flex:1; font-family:${C.sg}; font-size:9px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; padding:5px 2px; background:transparent; color:${C.text4}; border:none; cursor:pointer; transition:all .15s; }
          .gtab:hover { color:${C.text2}; }
          .gtab.on { background:${C.accentDim}; color:${C.accent}; }
          .glyph-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:3px; }
          .glyph-cell { aspect-ratio:1; display:flex; align-items:center; justify-content:center; background:${C.surface2}; border:1px solid ${C.border}; font-size:1.1rem; color:${C.text1}; cursor:pointer; transition:all .15s; border-radius:1px; }
          .glyph-cell:hover { background:${C.accentDim}; border-color:${C.accent}; color:#fff; transform:scale(1.05); }

          /* Colour pickers */
          .colour-row { display:flex; gap:6px; flex-wrap:wrap; }
          .colour-swatch { width:22px; height:22px; border:1px solid ${C.border}; cursor:pointer; transition:all .15s; border-radius:1px; }
          .colour-swatch:hover, .colour-swatch.on { border-color:${C.accent}; box-shadow:${C.accentGlow}; transform:scale(1.1); }

          /* Buy section in panel */
          .panel-buy { padding:16px; border-bottom:1px solid ${C.border}; }
          .lic-tabs { display:flex; flex-wrap:wrap; gap:4px; margin-bottom:12px; }
          .lic-tab { font-family:${C.sg}; font-size:10px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; padding:5px 10px; border:1px solid ${C.border}; background:transparent; color:${C.text3}; cursor:pointer; transition:all .15s; }
          .lic-tab:hover { border-color:${C.borderBright}; color:${C.text1}; }
          .lic-tab.on { background:${C.accentDim}; border-color:${C.accent}; color:${C.accent}; }
          .price-big { font-family:${C.det}; font-size:2.8rem; color:${C.white}; line-height:1; margin-bottom:4px; }
          .price-desc { font-family:${C.sg}; font-size:11px; color:${C.text3}; margin-bottom:14px; }
          .buy-btn { width:100%; font-family:${C.sg}; font-size:12px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#fff; background:${C.accent}; border:none; padding:13px; transition:opacity .15s; margin-bottom:6px; }
          .buy-btn:hover { opacity:.85; }
          .trial-btn { width:100%; font-family:${C.sg}; font-size:11px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:${C.text3}; background:transparent; border:1px solid ${C.border}; padding:10px; transition:all .15s; margin-bottom:8px; }
          .trial-btn:hover { border-color:${C.accent}; color:${C.accent}; }
          .trust-list { display:flex; flex-direction:column; gap:8px; margin-top:12px; }
          .trust-item { display:flex; align-items:flex-start; gap:8px; }
          .trust-dot { width:4px; height:4px; border-radius:50%; background:${C.accent}; flex-shrink:0; margin-top:5px; box-shadow:${C.accentGlow}; }
          .trust-text { font-family:${C.sg}; font-size:11px; color:${C.text3}; line-height:1.5; }

          /* Specimens */
          .specimens-section { padding:clamp(1.5rem,3vw,2.5rem); border-top:1px solid ${C.border}; }
          .section-title { font-family:${C.sg}; font-size:10px; font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:${C.accent}; margin-bottom:1.2rem; }
          .specimen-main { margin-bottom:.8rem; border:1px solid ${C.border}; overflow:hidden; }
          .specimen-main img { width:100%; display:block; }
          .specimen-thumbs { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
          .specimen-thumb { cursor:pointer; border:2px solid transparent; overflow:hidden; transition:border-color .15s; }
          .specimen-thumb.on { border-color:${C.accent}; }
          .specimen-thumb img { width:100%; display:block; aspect-ratio:4/3; object-fit:cover; filter:brightness(.8); transition:all .25s; }
          .specimen-thumb:hover img, .specimen-thumb.on img { filter:brightness(1); }

          /* Weights full list */
          .weights-list { border-top:1px solid ${C.border}; }
          .weight-row-full { display:grid; grid-template-columns:110px 1fr 40px; align-items:center; gap:1rem; padding:.8rem clamp(1.4rem,3vw,2.5rem); border-bottom:1px solid ${C.border}; cursor:pointer; transition:background .12s; }
          .weight-row-full:hover { background:${C.surface}; }
          .weight-row-full.on { background:${C.surface2}; }
          .wr-name { font-family:${C.sg}; font-size:10px; font-weight:500; letter-spacing:.08em; text-transform:uppercase; color:${C.text3}; }
          .wr-sample { font-size:clamp(1.2rem,2.5vw,2.2rem); line-height:1; color:${C.text1}; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; transition:color .12s; }
          .weight-row-full:hover .wr-sample { color:${C.white}; }
          .wr-num { font-family:${C.sm}; font-size:9px; color:${C.text4}; text-align:right; }

          /* Kanji ticker */
          .kanji-strip { overflow:hidden; padding:10px 0; border-top:1px solid ${C.border}; }
          .kanji-track { display:flex; gap:2rem; animation:tickr 18s linear infinite; white-space:nowrap; }
          .kanji-char { font-size:2rem; color:rgba(50,94,255,0.25); }
          @keyframes tickr { from{transform:translateX(0)} to{transform:translateX(-50%)} }

          /* Footer */
          .fp-footer { display:flex; justify-content:space-between; align-items:center; padding:1rem 1.4rem; border-top:1px solid ${C.border}; background:${C.surface}; }
          .fp-footer span { font-family:${C.sg}; font-size:11px; color:${C.text4}; text-transform:uppercase; letter-spacing:.06em; }
          .fp-footer-links { display:flex; gap:1.5rem; }
          .fp-footer a { font-family:${C.sg}; font-size:11px; font-weight:500; color:${C.text4}; text-transform:uppercase; letter-spacing:.08em; transition:color .15s; }
          .fp-footer a:hover { color:${C.text1}; }
        `}</style>
      </Head>

      <Script src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=GBP`} onReady={() => setPaypalReady(true)} />

      {/* ── NAV ─────────────────────── */}
      <nav className="nav">
        <Link href="/" className="nav-logo">HypeForType</Link>
        <Link href="/" className="nav-back">← All</Link>
        <Link href={`/typefaces/${prevFont.slug}`} className="nav-prev">‹ {prevFont.name}</Link>
        <Link href={`/typefaces/${nextFont.slug}`} className="nav-next">{nextFont.name} ›</Link>
        <button className="nav-trial" onClick={() => window.location.href=`/api/trial?slug=${font.slug}`}>Trial</button>
        <a href="#buy" className="nav-buy">Buy →</a>
      </nav>

      {/* ── MAIN LAYOUT ─────────────── */}
      <div className="page-layout">

        {/* ── LEFT: CANVAS ────────────── */}
        <div className="canvas" style={{ background: bgColor }}>

          {/* Focused glyph overlay */}
          {focusedGlyph && (
            <div className="glyph-focus" onClick={() => setFocusedGlyph(null)} style={{ background: bgColor + 'f0' }}>
              <div style={{ textAlign: 'center' }}>
                <div className="glyph-focus-char" style={{ fontFamily, fontWeight: style.weight, color: textColor }}>{focusedGlyph}</div>
                <div className="glyph-focus-label">Click to close · U+{focusedGlyph.charCodeAt(0).toString(16).toUpperCase().padStart(4,'0')}</div>
              </div>
            </div>
          )}

          {/* Toolbar */}
          <div className="canvas-toolbar">
            <span className="tb-label">View</span>
            {['display','headline','body'].map(m => (
              <button key={m} className={`tb-btn${viewMode===m?' on':''}`} onClick={() => setViewMode(m)}>
                {m.charAt(0).toUpperCase()+m.slice(1)}
              </button>
            ))}
            <div className="tb-sep" />
            <span className="tb-label">BG</span>
            {BG_OPTIONS.map(c => (
              <div key={c} className={`tb-swatch${bgColor===c?' on':''}`} style={{ background: c }} onClick={() => setBgColor(c)} title={c} />
            ))}
            <div className="tb-sep" />
            <span className="tb-label">Text</span>
            {TEXT_OPTIONS.map(c => (
              <div key={c} className={`tb-swatch${textColor===c?' on':''}`} style={{ background: c }} onClick={() => setTextColor(c)} title={c} />
            ))}
          </div>

          {/* Stage */}
          <div className="canvas-stage" onClick={() => { if (!focusedGlyph) document.querySelector('.canvas-edit-input')?.focus(); }}>
            {viewMode === 'body' ? (
              <div className="canvas-body-text" style={{
                fontFamily, fontWeight: style.weight,
                fontSize: Math.min(fontSize, 22) + 'px',
                lineHeight: lineHeight + 0.5,
                color: textColor,
              }}>
                {previewText.trim() || LOREM}
              </div>
            ) : (
              <div className="canvas-headline-text" style={{
                fontFamily, fontWeight: style.weight,
                fontStyle: style.oblique ? 'italic' : 'normal',
                fontSize: (viewMode === 'headline' ? Math.max(fontSize, 60) : fontSize) + 'px',
                letterSpacing: letterSpacing + '%',
                lineHeight: lineHeight,
                color: textColor,
              }}>
                {displayText}
              </div>
            )}
          </div>

          {/* Edit bar */}
          <div className="canvas-edit-bar">
            <span className="canvas-edit-label">↑ Type</span>
            <input className="canvas-edit-input"
              value={previewText}
              onChange={e => setPreviewText(e.target.value)}
              placeholder={font.name}
              maxLength={80}
              style={{ color: textColor === '#000000' || textColor === '#0d1117' ? C.text2 : textColor }}
            />
          </div>

          {/* Meta strip */}
          <div className="meta-strip">
            {[
              [font.styles.length, 'Weights'],
              [font.glyphCount + '+', 'Glyphs'],
              [font.released, 'Released'],
              [font.pro ? 'Pro' : font.hot ? 'New' : 'Retail', 'Status'],
            ].map(([v,k]) => (
              <div key={k} className="meta-cell">
                <span className="meta-val">{v}</span>
                <span className="meta-key">{k}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: PANEL ────────────── */}
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Glyph Panel</span>
            <span className="panel-ver">V1.0</span>
          </div>

          {/* Weight */}
          <div className="panel-section">
            <div className="ps-head">
              <span className="ps-lbl">Weight</span>
              <span className="ps-val">{style.weight}</span>
            </div>
            <select className="weight-select" value={activeStyle} onChange={e => setActiveStyle(+e.target.value)}>
              {font.styles.map((s,i) => (
                <option key={i} value={i}>{s.name} · {s.weight}</option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div className="panel-section">
            <div className="ps-head">
              <span className="ps-lbl">Size</span>
              <span className="ps-val">{fontSize}px</span>
            </div>
            <input type="range" className="panel-slider" min="12" max="200" value={fontSize} onChange={e => setFontSize(+e.target.value)} />
            <div className="range-labels"><span>12</span><span>200</span></div>
          </div>

          {/* Letter Spacing */}
          <div className="panel-section">
            <div className="ps-head">
              <span className="ps-lbl">Letter Spacing</span>
              <span className="ps-val">{letterSpacing > 0 ? '+' : ''}{letterSpacing}%</span>
            </div>
            <input type="range" className="panel-slider" min="-10" max="30" value={letterSpacing} onChange={e => setLetterSpacing(+e.target.value)} />
            <div className="range-labels"><span>−10</span><span>+30</span></div>
          </div>

          {/* Line Height */}
          <div className="panel-section">
            <div className="ps-head">
              <span className="ps-lbl">Line Height</span>
              <span className="ps-val">{(lineHeight + (viewMode === 'body' ? 0.5 : 0)).toFixed(1)}</span>
            </div>
            <input type="range" className="panel-slider" min="0" max="20" value={Math.round(lineHeight * 10)} onChange={e => setLineHeight(+e.target.value / 10)} />
            <div className="range-labels"><span>0.8</span><span>2.8</span></div>
          </div>

          {/* Glyphs */}
          <div className="panel-section">
            <div className="ps-head">
              <span className="ps-lbl">Glyphs</span>
              <span className="ps-val">{font.glyphCount}+</span>
            </div>
            <div className="glyph-tabs">
              {Object.keys(GLYPH_SETS).map(k => (
                <button key={k} className={`gtab${glyphSet===k?' on':''}`} onClick={() => setGlyphSet(k)}>{k}</button>
              ))}
            </div>
            <div className="glyph-grid">
            <div className="glyph-grid" style={{ maxHeight: 300, overflowY: "auto" }}>
              {currentGlyphs.map((g,i) => (
                <div key={i} className="glyph-cell"
                  style={{ fontFamily, fontWeight: style.weight }}
                  onClick={() => setFocusedGlyph(g)}>
                  {g}
                </div>
              ))}
            </div>
            <div style={{ fontFamily: C.sm, fontSize: 9, color: C.text4, marginTop: 5, textAlign: "right" }}>
              {currentGlyphs.length} glyphs · click to enlarge
            </div>
            )}
          </div>



          {/* BUY — in panel, visible near fold */}
          <div className="panel-buy" id="buy">
            <div className="ps-head" style={{ marginBottom: 10 }}>
              <span className="ps-lbl">License</span>
            </div>
            <div className="lic-tabs">
              {Object.entries(tiers).map(([key, tier]) => (
                <button key={key} className={`lic-tab${selectedLicense===key?' on':''}`} onClick={() => setSelectedLicense(key)}>
                  {tier.label}
                </button>
              ))}
            </div>
            <div className="price-big">£{tiers[selectedLicense].price}</div>
            <div className="price-desc">{tiers[selectedLicense].desc}</div>
            <div ref={paypalRef} style={{ minHeight: 44 }}>
              {purchasing && <span style={{ fontFamily: C.sg, fontSize: 12, color: C.text3 }}>Processing...</span>}
            </div>
            <button className="trial-btn" onClick={() => window.location.href=`/api/trial?slug=${font.slug}`}>
              Free Trial Download
            </button>
            <div className="trust-list">
              {[
                `${font.styles.length} font file${font.styles.length>1?'s':''} included`,
                `${font.glyphCount}+ glyphs`,
                'Instant download',
                'Perpetual commercial license',
              ].map((item,i) => (
                <div key={i} className="trust-item">
                  <div className="trust-dot" />
                  <span className="trust-text">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── BELOW FOLD ──────────────── */}

      {/* Font ticker — ABC in the actual font */}
      <div className="kanji-strip">
        <div className="kanji-track">
          {[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].split('').map((ch,i) => (
            <span key={i} className="kanji-char" style={{ fontFamily, fontWeight: style.weight, fontSize: '2rem', color: 'rgba(50,94,255,0.25)', letterSpacing: '.05em' }}>{ch}</span>
          ))}
        </div>
      </div>

      {/* Specimen images */}
      {specimens.length > 0 && (
        <div className="specimens-section">
          <div className="section-title">Type Specimens</div>
          <div className="specimen-main">
            <img src={specimens[activeSpecimen]} alt={`${font.name} specimen ${activeSpecimen+1}`} />
          </div>
          <div className="specimen-thumbs">
            {specimens.map((src,i) => (
              <div key={i} className={`specimen-thumb${activeSpecimen===i?' on':''}`} onClick={() => setActiveSpecimen(i)}>
                <img src={src} alt={`specimen ${i+1}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All weights */}
      <div className="weights-list">
        <div style={{ padding:'10px clamp(1.4rem,3vw,2.5rem)', borderBottom:`1px solid ${C.border}`, borderTop:`1px solid ${C.border}` }}>
          <div className="section-title" style={{ margin:0 }}>All Weights</div>
        </div>
        {font.styles.map((s,i) => (
          <div key={i} className={`weight-row-full${activeStyle===i?' on':''}`} onClick={() => setActiveStyle(i)}>
            <span className="wr-name">{s.name}</span>
            <span className="wr-sample" style={{ fontFamily, fontWeight:s.weight, fontStyle:s.oblique?'italic':'normal' }}>
              {previewText.trim() || 'The quick brown fox'}
            </span>
            <span className="wr-num">{s.weight}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="fp-footer">
        <span>© 2026 HypeForType · {font.name}</span>
        <div className="fp-footer-links">
          {['Licensing','FAQ','Contact'].map(t => (
            <Link key={t} href={'/'+t.toLowerCase()}>{t}</Link>
          ))}
        </div>
      </footer>
    </>
  );
}

export async function getStaticPaths() {
  return { paths: fonts.map(f => ({ params: { slug: f.slug } })), fallback: false };
}
export async function getStaticProps({ params }) {
  const font = fonts.find(f => f.slug === params.slug);
  return font ? { props: { font } } : { notFound: true };
}
