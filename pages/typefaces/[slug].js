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

// ── Palette (extracted from NBA Top Shot) ──────────────────────────
const C = {
  bg:         '#000000',   // pure black body
  surface:    '#0a0a0f',   // card/panel surface
  surface2:   '#0f0f1a',   // slightly lighter surface
  border:     '#1c1c2e',   // subtle border
  borderBright:'#2a2a45',  // hover border
  accent:     '#9747FF',   // neon violet — primary accent
  accentDim:  'rgba(151,71,255,0.15)',
  accentBorder:'rgba(151,71,255,0.35)',
  blue:       '#101c50',   // button bg (deep navy)
  blueLight:  '#b6ccfd',   // label text (periwinkle — "Rare" colour)
  text1:      '#cbced3',   // primary title — near-white warm
  text2:      '#b0b1b6',   // body description — mid grey
  text3:      '#9097a1',   // meta/secondary — muted grey
  text4:      '#4a4d56',   // dimmed/inactive
  white:      '#f2f1eb',   // pure white moments
};

export default function FontPage({ font }) {
  const [activeStyle,    setActiveStyle]    = useState(0);
  const [previewText,    setPreviewText]    = useState('');
  const [fontSize,       setFontSize]       = useState(80);
  const [letterSpacing,  setLetterSpacing]  = useState(0);
  const [selectedLicense,setSelectedLicense]= useState('desktop');
  const [glyphSet,       setGlyphSet]       = useState('UPP');
  const [activeSpecimen, setActiveSpecimen] = useState(0);
  const [paypalReady,    setPaypalReady]    = useState(false);
  const [purchasing,     setPurchasing]     = useState(false);
  const paypalRef = useRef(null);

  const tiers      = pricing[font.isFamily ? 'family' : 'single'];
  const style      = font.styles[activeStyle];
  const fontFamily = `'${font.name}', monospace`;
  const displayText = previewText.trim() || font.name;
  const kanji      = getKanji(font.tags);
  const specimens  = SPECIMENS[font.slug] || [];

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

  const slab = (label, value) => (
    <div style={{ borderRight: `1px solid ${C.border}`, padding: '0 1.4rem', display:'flex', flexDirection:'column', gap:4 }}>
      <span style={{ fontFamily:"'Determination',monospace", fontSize:'1.5rem', color: C.text1, lineHeight:1 }}>{value}</span>
      <span style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', color: C.text4 }}>{label}</span>
    </div>
  );

  return (
    <>
      <Head>
        <title>{font.name} — HypeForType</title>
        <meta name="description" content={font.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {font.styles.map(s => (
          <style key={s.file}>{`@font-face{font-family:'${font.name}';src:url('/fonts/${font.slug}/${encodeURIComponent(s.file)}');font-weight:${s.weight};font-style:${s.oblique?'italic':'normal'};font-display:swap;}`}</style>
        ))}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html, body { background: ${C.bg} !important; color: ${C.text1} !important; font-family: 'Inter', sans-serif !important; -webkit-font-smoothing: antialiased; }

          /* ── Scrollbar ── */
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: ${C.bg}; }
          ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }

          /* ── Nav ── */
          .nav {
            position: sticky; top: 0; z-index: 200;
            display: grid; grid-template-columns: auto 1fr auto auto;
            height: 52px; border-bottom: 1px solid ${C.border};
            background: rgba(0,0,0,0.9); backdrop-filter: blur(12px);
          }
          .nav-logo {
            font-family: 'Determination', monospace; font-size: .9rem;
            letter-spacing: .08em; text-transform: uppercase;
            color: ${C.text1}; padding: 0 1.4rem;
            border-right: 1px solid ${C.border};
            display: flex; align-items: center; text-decoration: none;
            transition: color .15s;
          }
          .nav-logo:hover { color: ${C.white}; }
          .nav-back {
            font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500;
            letter-spacing: .08em; text-transform: uppercase;
            color: ${C.text4}; padding: 0 1.2rem;
            border-right: 1px solid ${C.border};
            display: flex; align-items: center; text-decoration: none; transition: color .15s;
          }
          .nav-back:hover { color: ${C.text1}; }
          .nav-title {
            font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
            color: ${C.text2}; padding: 0 1.4rem;
            display: flex; align-items: center; flex: 1;
          }
          .nav-trial {
            font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600;
            letter-spacing: .08em; text-transform: uppercase;
            color: ${C.blueLight}; padding: 0 1.4rem;
            border-left: 1px solid ${C.border};
            display: flex; align-items: center; cursor: pointer;
            background: none; border-top: none; border-bottom: none; border-right: none;
            transition: color .15s;
          }
          .nav-trial:hover { color: ${C.white}; }
          .nav-buy {
            font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700;
            letter-spacing: .1em; text-transform: uppercase;
            color: #fff; background: ${C.accent};
            padding: 0 1.6rem; display: flex; align-items: center;
            text-decoration: none; transition: opacity .15s;
          }
          .nav-buy:hover { opacity: .85; }

          /* ── Hero ── */
          .hero {
            display: grid; grid-template-columns: 1fr 320px;
            border-bottom: 1px solid ${C.border};
            height: calc(100vh - 52px); max-height: 840px; min-height: 560px;
          }
          .hero-canvas {
            padding: clamp(1.8rem,4vw,3rem);
            border-right: 1px solid ${C.border};
            display: flex; flex-direction: column;
            position: relative; overflow: hidden;
            background: ${C.bg};
          }
          .hero-kanji-bg {
            position: absolute; bottom: -0.1em; right: -0.02em;
            font-family: 'Hiragino Sans', 'Yu Gothic', 'Noto Sans CJK JP', sans-serif;
            font-size: clamp(16rem,28vw,26rem); line-height: 1;
            color: rgba(151,71,255,0.04);
            pointer-events: none; user-select: none;
          }
          .hero-eyebrow {
            font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700;
            letter-spacing: .18em; text-transform: uppercase;
            color: ${C.blueLight}; margin-bottom: .8rem;
          }
          .hero-live-text {
            flex: 1; display: flex; align-items: center;
            position: relative; z-index: 1; overflow: hidden;
          }
          .hero-type {
            line-height: .92; letter-spacing: -.02em;
            word-break: break-word; width: 100%;
            transition: font-size .08s ease, letter-spacing .08s ease;
          }
          .hero-edit-bar {
            display: flex; align-items: center; gap: .6rem;
            border-top: 1px solid ${C.border}; padding-top: 1rem; margin-top: auto;
            position: relative; z-index: 1;
          }
          .hero-edit-label {
            font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700;
            letter-spacing: .14em; text-transform: uppercase; color: ${C.accent}; flex-shrink: 0;
          }
          .hero-edit-input {
            flex: 1; background: transparent; border: none; outline: none;
            font-family: 'Inter', sans-serif; font-size: 13px; color: ${C.text2};
            caret-color: ${C.accent};
          }
          .hero-edit-input::placeholder { color: ${C.text4}; }
          .hero-meta-row {
            display: flex; margin-top: 1rem; border: 1px solid ${C.border};
          }

          /* ── Glyph Panel ── */
          .gp {
            background: ${C.surface}; display: flex; flex-direction: column;
            overflow: hidden;
          }
          .gp-head {
            padding: 14px 18px;
            border-bottom: 1px solid ${C.border};
            display: flex; justify-content: space-between; align-items: center;
            flex-shrink: 0;
          }
          .gp-title {
            font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700;
            letter-spacing: .18em; text-transform: uppercase; color: ${C.text1};
          }
          .gp-ver {
            font-family: 'DigitalDisco', monospace; font-size: 10px;
            color: ${C.text4}; letter-spacing: .1em;
          }
          .gp-scroll { flex: 1; overflow-y: auto; padding: 0 18px; }
          .gp-row {
            padding: 14px 0; border-bottom: 1px solid ${C.border};
          }
          .gp-row:last-child { border-bottom: none; }
          .gp-row-head {
            display: flex; justify-content: space-between; margin-bottom: 10px;
          }
          .gp-lbl { font-family: 'Inter', sans-serif; font-size: 11px; color: ${C.text3}; font-weight: 500; }
          .gp-val { font-family: 'Inter', sans-serif; font-size: 11px; color: ${C.text1}; font-weight: 600; }
          .gp-slider {
            width: 100%; height: 2px; -webkit-appearance: none; appearance: none;
            background: ${C.border}; outline: none; border-radius: 1px; cursor: pointer;
          }
          .gp-slider::-webkit-slider-thumb {
            -webkit-appearance: none; width: 14px; height: 14px;
            border-radius: 50%; background: ${C.accent}; cursor: pointer;
            box-shadow: 0 0 8px rgba(151,71,255,0.6);
          }
          .gp-range-labels {
            display: flex; justify-content: space-between; margin-top: 5px;
          }
          .gp-range-labels span {
            font-family: 'Inter', sans-serif; font-size: 10px; color: ${C.text4};
          }
          .gp-weights {
            display: grid; grid-template-columns: 1fr 1fr; gap: 5px;
          }
          .gp-wbtn {
            font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500;
            padding: 7px 8px; border: 1px solid ${C.border};
            background: transparent; color: ${C.text3};
            cursor: pointer; text-align: left; transition: all .15s; border-radius: 2px;
          }
          .gp-wbtn:hover { border-color: ${C.borderBright}; color: ${C.text1}; }
          .gp-wbtn.on { background: ${C.accentDim}; border-color: ${C.accent}; color: ${C.white}; }
          .gp-glyph-tabs {
            display: flex; border: 1px solid ${C.border}; margin-bottom: 10px;
          }
          .gp-gtab {
            flex: 1; font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600;
            letter-spacing: .06em; text-transform: uppercase;
            padding: 6px 4px; background: transparent;
            color: ${C.text4}; border: none; cursor: pointer; transition: all .15s;
          }
          .gp-gtab:hover { color: ${C.text2}; }
          .gp-gtab.on { background: ${C.accentDim}; color: ${C.blueLight}; }
          .gp-glyphs {
            display: grid; grid-template-columns: repeat(4,1fr); gap: 4px;
          }
          .gp-glyph {
            aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
            background: ${C.surface2}; border: 1px solid ${C.border};
            font-size: 1.3rem; color: ${C.text1}; cursor: default;
            transition: all .15s; border-radius: 2px;
          }
          .gp-glyph:hover { background: ${C.accentDim}; border-color: ${C.accent}; }
          .gp-kanji-row { display: flex; gap: 10px; flex-wrap: wrap; }
          .gp-kanji {
            font-family: 'Hiragino Sans', 'Yu Gothic', 'Noto Sans CJK JP', sans-serif;
            font-size: 1.5rem; color: ${C.text4}; transition: color .2s; cursor: default;
          }
          .gp-kanji:hover { color: ${C.accent}; }

          /* ── Stats bar ── */
          .stats-bar {
            display: flex; border-bottom: 1px solid ${C.border};
            background: ${C.surface};
          }

          /* ── Ticker / kanji strip ── */
          .kanji-strip {
            overflow: hidden; padding: 12px 0;
            border-bottom: 1px solid ${C.border};
            background: ${C.surface};
          }
          .kanji-track {
            display: flex; gap: 2.5rem;
            animation: ticker 18s linear infinite; white-space: nowrap;
          }
          .kanji-char {
            font-family: 'Hiragino Sans', 'Yu Gothic', 'Noto Sans CJK JP', sans-serif;
            font-size: 1.6rem; color: rgba(151,71,255,0.2);
          }
          @keyframes ticker {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }

          /* ── Specimens ── */
          .specimens-section {
            padding: clamp(2rem,4vw,3rem);
            border-bottom: 1px solid ${C.border};
          }
          .section-title {
            font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700;
            letter-spacing: .18em; text-transform: uppercase;
            color: ${C.blueLight}; margin-bottom: 1.4rem;
          }
          .specimen-main {
            margin-bottom: 1rem; border: 1px solid ${C.border}; overflow: hidden;
          }
          .specimen-main img { width: 100%; display: block; }
          .specimen-grid {
            display: grid; grid-template-columns: repeat(3,1fr); gap: 8px;
          }
          .specimen-thumb {
            cursor: pointer; border: 2px solid transparent;
            transition: border-color .15s; overflow: hidden;
          }
          .specimen-thumb.on { border-color: ${C.accent}; }
          .specimen-thumb img {
            width: 100%; display: block; aspect-ratio: 4/3; object-fit: cover;
            transition: transform .3s; filter: brightness(0.85);
          }
          .specimen-thumb:hover img { transform: scale(1.03); filter: brightness(1); }
          .specimen-thumb.on img { filter: brightness(1); }

          /* ── Weights ── */
          .weights-section { border-bottom: 1px solid ${C.border}; }
          .weights-head {
            padding: 10px clamp(1.4rem,4vw,3rem);
            border-bottom: 1px solid ${C.border};
            background: ${C.surface};
          }
          .weight-row {
            display: grid; grid-template-columns: 130px 1fr auto;
            align-items: center; gap: 1.5rem;
            padding: 1rem clamp(1.4rem,4vw,3rem);
            border-bottom: 1px solid ${C.border};
            cursor: pointer; transition: background .12s;
          }
          .weight-row:hover { background: ${C.surface}; }
          .weight-row.on { background: ${C.surface2}; }
          .weight-row:last-child { border-bottom: none; }
          .weight-name {
            font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500;
            letter-spacing: .08em; text-transform: uppercase; color: ${C.text3};
          }
          .weight-sample {
            font-size: clamp(1.4rem,3vw,2.6rem); line-height: 1;
            color: ${C.text1}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
            transition: color .15s;
          }
          .weight-row:hover .weight-sample { color: ${C.white}; }
          .weight-num {
            font-family: 'DigitalDisco', monospace; font-size: 10px;
            color: ${C.text4}; letter-spacing: .1em;
          }

          /* ── Buy ── */
          .buy-section {
            display: grid; grid-template-columns: 1fr 1fr;
            border-bottom: 1px solid ${C.border};
          }
          .buy-left {
            padding: clamp(2rem,4vw,3rem);
            border-right: 1px solid ${C.border};
          }
          .buy-right { padding: clamp(2rem,4vw,3rem); }
          .license-tabs { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 2rem; }
          .lic-tab {
            font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600;
            letter-spacing: .08em; text-transform: uppercase;
            padding: 7px 14px; border: 1px solid ${C.border};
            background: transparent; color: ${C.text3}; cursor: pointer; transition: all .15s;
          }
          .lic-tab:hover { border-color: ${C.borderBright}; color: ${C.text1}; }
          .lic-tab.on { background: ${C.accentDim}; border-color: ${C.accent}; color: ${C.blueLight}; }
          .price-display {
            font-family: 'Determination', monospace;
            font-size: clamp(3rem,6vw,5rem); line-height: 1;
            color: ${C.white}; margin-bottom: .4rem;
          }
          .price-desc {
            font-family: 'Inter', sans-serif; font-size: 12px;
            color: ${C.text3}; margin-bottom: 2rem;
          }
          .trust-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 2rem; }
          .trust-item { display: flex; align-items: flex-start; gap: 10px; }
          .trust-dot {
            width: 5px; height: 5px; border-radius: 50%; background: ${C.accent};
            flex-shrink: 0; margin-top: 5px; box-shadow: 0 0 6px rgba(151,71,255,0.6);
          }
          .trust-text {
            font-family: 'Inter', sans-serif; font-size: 12px;
            color: ${C.text3}; line-height: 1.55;
          }
          .trial-btn {
            width: 100%; font-family: 'Inter', sans-serif;
            font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
            padding: 13px; border: 1px solid ${C.border};
            background: transparent; color: ${C.text3}; cursor: pointer; transition: all .15s;
            margin-bottom: 8px; display: block;
          }
          .trial-btn:hover { border-color: ${C.accent}; color: ${C.blueLight}; }
          .trial-note {
            font-family: 'Inter', sans-serif; font-size: 11px;
            color: ${C.text4}; text-align: center;
          }

          /* ── Footer ── */
          .fp-footer {
            display: flex; justify-content: space-between; align-items: center;
            padding: 1.2rem clamp(1.4rem,4vw,3rem);
            background: ${C.surface}; border-top: 1px solid ${C.border};
          }
          .fp-footer span {
            font-family: 'Inter', sans-serif; font-size: 11px;
            color: ${C.text4}; letter-spacing: .06em; text-transform: uppercase;
          }
          .fp-footer-links { display: flex; gap: 1.5rem; }
          .fp-footer a {
            font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500;
            letter-spacing: .08em; text-transform: uppercase;
            color: ${C.text4}; text-decoration: none; transition: color .15s;
          }
          .fp-footer a:hover { color: ${C.text1}; }
        `}</style>
      </Head>

      <Script src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=GBP`} onReady={() => setPaypalReady(true)} />

      {/* ── NAV ─────────────────────────────────── */}
      <nav className="nav">
        <Link href="/" className="nav-logo">HypeForType</Link>
        <Link href="/" className="nav-back">← All Typefaces</Link>
        <span className="nav-title">{font.name}</span>
        <button className="nav-trial" onClick={() => window.location.href=`/api/trial?slug=${font.slug}`}>
          Free Trial
        </button>
        <a href="#buy" className="nav-buy">Buy {font.name} →</a>
      </nav>

      {/* ── HERO: live canvas + glyph panel ─────── */}
      <section className="hero">

        {/* LEFT — live type canvas */}
        <div className="hero-canvas">
          <div className="hero-kanji-bg">{kanji[0]}</div>

          <div style={{ position:'relative', zIndex:1, marginBottom:'.8rem' }}>
            <div className="hero-eyebrow">{font.idx} — {font.tags.join(' · ')}</div>
          </div>

          {/* THE LIVE TYPE */}
          <div className="hero-live-text">
            <div className="hero-type" style={{
              fontFamily,
              fontWeight: style.weight,
              fontStyle: style.oblique ? 'italic' : 'normal',
              fontSize: fontSize + 'px',
              letterSpacing: letterSpacing + '%',
              color: C.white,
            }}>
              {displayText}
            </div>
          </div>

          {/* Edit input */}
          <div className="hero-edit-bar">
            <span className="hero-edit-label">↑ Edit</span>
            <input className="hero-edit-input"
              value={previewText}
              onChange={e => setPreviewText(e.target.value)}
              placeholder={font.name}
              maxLength={60}
            />
          </div>

          {/* Meta slabs */}
          <div className="hero-meta-row">
            {slab('Weights', font.styles.length)}
            {slab('Glyphs', font.glyphCount + '+')}
            {slab('Released', font.released)}
            <div style={{ padding:'0 1.4rem', display:'flex', flexDirection:'column', gap:4 }}>
              <span style={{ fontFamily:"'Determination',monospace", fontSize:'1.5rem', color:C.text1, lineHeight:1 }}>
                {font.pro ? 'Pro' : font.hot ? 'New' : 'Retail'}
              </span>
              <span style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', color:C.text4 }}>Status</span>
            </div>
          </div>
        </div>

        {/* RIGHT — glyph panel */}
        <div className="gp">
          <div className="gp-head">
            <span className="gp-title">Glyph Panel</span>
            <span className="gp-ver">V1.0</span>
          </div>
          <div className="gp-scroll">

            {/* Weight */}
            <div className="gp-row">
              <div className="gp-row-head">
                <span className="gp-lbl">Weight</span>
                <span className="gp-val">{style.name} · {style.weight}</span>
              </div>
              <div className="gp-weights">
                {font.styles.map((s,i) => (
                  <button key={i} className={`gp-wbtn${activeStyle===i?' on':''}`}
                    onClick={() => setActiveStyle(i)}
                    style={{ fontFamily, fontWeight: s.weight }}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="gp-row">
              <div className="gp-row-head">
                <span className="gp-lbl">Size</span>
                <span className="gp-val">{fontSize}px</span>
              </div>
              <input type="range" className="gp-slider" min="20" max="200" value={fontSize} onChange={e => setFontSize(+e.target.value)} />
              <div className="gp-range-labels"><span>20</span><span>200</span></div>
            </div>

            {/* Letter Spacing */}
            <div className="gp-row">
              <div className="gp-row-head">
                <span className="gp-lbl">Letter Spacing</span>
                <span className="gp-val">{letterSpacing > 0 ? '+' : ''}{letterSpacing}%</span>
              </div>
              <input type="range" className="gp-slider" min="-10" max="30" value={letterSpacing} onChange={e => setLetterSpacing(+e.target.value)} />
              <div className="gp-range-labels"><span>−10</span><span>+30</span></div>
            </div>

            {/* Glyphs */}
            <div className="gp-row">
              <div className="gp-row-head">
                <span className="gp-lbl">Glyphs</span>
              </div>
              <div className="gp-glyph-tabs">
                {Object.keys(GLYPH_SETS).map(k => (
                  <button key={k} className={`gp-gtab${glyphSet===k?' on':''}`} onClick={() => setGlyphSet(k)}>{k}</button>
                ))}
              </div>
              <div className="gp-glyphs">
                {GLYPH_SETS[glyphSet].slice(0,16).map((g,i) => (
                  <div key={i} className="gp-glyph" style={{ fontFamily, fontWeight: style.weight }}>{g}</div>
                ))}
              </div>
            </div>

            {/* Kanji */}
            <div className="gp-row">
              <div className="gp-row-head">
                <span className="gp-lbl">Kanji Mix</span>
              </div>
              <div className="gp-kanji-row">
                {kanji.map((k,i) => <span key={i} className="gp-kanji">{k}</span>)}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────── */}
      <div className="stats-bar">
        {[
          ['Languages', font.languages],
          ['OpenType', font.opentype],
          ['Styles', font.styles.length + ' weights'],
          ['Family', font.isFamily ? 'Yes' : 'Single'],
        ].map(([k,v]) => (
          <div key={k} style={{ borderRight:`1px solid ${C.border}`, padding:'1rem 1.6rem', display:'flex', flexDirection:'column', gap:4 }}>
            <span style={{ fontFamily:"'Inter',sans-serif", fontSize:12, fontWeight:600, color:C.text2 }}>{v}</span>
            <span style={{ fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', color:C.text4 }}>{k}</span>
          </div>
        ))}
        <div style={{ flex:1, padding:'1rem 1.6rem', display:'flex', alignItems:'center' }}>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:C.text3, lineHeight:1.6, maxWidth:'60ch' }}>{font.description}</p>
        </div>
      </div>

      {/* ── KANJI STRIP ─────────────────────────── */}
      <div className="kanji-strip">
        <div className="kanji-track">
          {[...kanji,...kanji,...kanji,...kanji].map((k,i) => (
            <span key={i} className="kanji-char">{k}</span>
          ))}
        </div>
      </div>

      {/* ── SPECIMEN IMAGES ─────────────────────── */}
      {specimens.length > 0 && (
        <div className="specimens-section">
          <div className="section-title">Type Specimens</div>
          <div className="specimen-main">
            <img src={specimens[activeSpecimen]} alt={`${font.name} specimen ${activeSpecimen+1}`} />
          </div>
          <div className="specimen-grid">
            {specimens.map((src,i) => (
              <div key={i} className={`specimen-thumb${activeSpecimen===i?' on':''}`} onClick={() => setActiveSpecimen(i)}>
                <img src={src} alt={`${font.name} specimen ${i+1}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ALL WEIGHTS ─────────────────────────── */}
      <div className="weights-section">
        <div className="weights-head">
          <div className="section-title" style={{ margin:0 }}>All Weights</div>
        </div>
        {font.styles.map((s,i) => (
          <div key={i} className={`weight-row${activeStyle===i?' on':''}`} onClick={() => setActiveStyle(i)}>
            <span className="weight-name">{s.name}</span>
            <span className="weight-sample" style={{ fontFamily, fontWeight:s.weight, fontStyle:s.oblique?'italic':'normal' }}>
              {previewText.trim() || 'The quick brown fox'}
            </span>
            <span className="weight-num">{s.weight}</span>
          </div>
        ))}
      </div>

      {/* ── BUY ─────────────────────────────────── */}
      <div className="buy-section" id="buy">
        <div className="buy-left">
          <div className="section-title">License & Purchase</div>
          <div className="license-tabs">
            {Object.entries(tiers).map(([key, tier]) => (
              <button key={key} className={`lic-tab${selectedLicense===key?' on':''}`} onClick={() => setSelectedLicense(key)}>
                {tier.label}
              </button>
            ))}
          </div>
          <div className="price-display">£{tiers[selectedLicense].price}</div>
          <div className="price-desc">{tiers[selectedLicense].desc}</div>
          <div ref={paypalRef} style={{ minHeight:44 }}>
            {purchasing && <span style={{ fontFamily:"'Inter',sans-serif", fontSize:13, color:C.text3 }}>Processing...</span>}
          </div>
        </div>

        <div className="buy-right">
          <div>
            <div className="section-title">What's Included</div>
            <div className="trust-list">
              {[
                `${font.styles.length} font file${font.styles.length>1?'s':''} (.otf / .ttf)`,
                `${font.glyphCount}+ glyphs including Latin Extended`,
                font.opentype !== 'Standard' ? `OpenType: ${font.opentype}` : 'Full OpenType support',
                'Instant download after purchase',
                'Commercial use perpetual license',
                'PayPal Secure checkout',
              ].map((item,i) => (
                <div key={i} className="trust-item">
                  <div className="trust-dot" />
                  <span className="trust-text">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <button className="trial-btn" onClick={() => window.location.href=`/api/trial?slug=${font.slug}`}>
              Download Free Trial
            </button>
            <p className="trial-note">For mockups only · Not for commercial use</p>
          </div>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────── */}
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
