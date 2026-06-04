import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { fonts, pricing } from '../../lib/fonts';
import { useState, useRef, useEffect } from 'react';
import Script from 'next/script';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

// Kanji sets per font category for decorative use
const KANJI = {
  Japanese:    ['字','体','形','美','力','光','影','道','心','空','時','夢'],
  'Japanese Pro': ['字','体','形','美','力','光','影','道','心','空','時','夢'],
  'Rounded Pro': ['丸','柔','美','和','円','温','優','軽','雅','清'],
  Display:     ['力','威','大','烈','猛','剛','強','爆','激','迫'],
  Handmade:    ['手','書','心','情','感','想','詩','文','筆','艺'],
  Pro:         ['業','技','匠','精','達','完','熟','巧','工','術'],
  default:     ['美','形','字','体','光','道','心','夢','力','空'],
};

function getKanji(tags) {
  for (const tag of tags) {
    if (KANJI[tag]) return KANJI[tag];
  }
  return KANJI.default;
}

// Specimen images — only for nanami-rounded-pro right now
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

const glyphSets = {
  uppercase:   'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  lowercase:   'abcdefghijklmnopqrstuvwxyz'.split(''),
  numerals:    '0123456789'.split(''),
  punctuation: '.,;:!?\'"-—…()[]{}@#$%&*'.split(''),
  accents:     'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖØÙÚÛÜÝàáâãäåæçèéêëìíîïñòóôõöøùúûüý'.split(''),
};

export default function FontPage({ font }) {
  const [activeStyle,      setActiveStyle]      = useState(0);
  const [previewText,      setPreviewText]       = useState('');
  const [fontSize,         setFontSize]          = useState(72);
  const [letterSpacing,    setLetterSpacing]     = useState(0);
  const [selectedLicense,  setSelectedLicense]   = useState('desktop');
  const [glyphSet,         setGlyphSet]          = useState('uppercase');
  const [activeSpecimen,   setActiveSpecimen]    = useState(0);
  const [paypalReady,      setPaypalReady]       = useState(false);
  const [purchasing,       setPurchasing]        = useState(false);
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
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: tier.price, description: `${font.name} — ${tier.label} License` }),
        });
        const data = await res.json();
        return data.orderId;
      },
      onApprove: async (data) => {
        setPurchasing(true);
        const res = await fetch('/api/paypal-capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: data.orderID, fontSlug: font.slug, licenseTier: selectedLicense }),
        });
        const result = await res.json();
        if (result.success) window.location.href = `/download?token=${result.token}`;
        setPurchasing(false);
      },
      style: { layout: 'horizontal', color: 'black', shape: 'rect', label: 'buynow', height: 40, tagline: false },
    }).render(paypalRef.current);
  }, [paypalReady, selectedLicense, font]);

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
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body, html { background: #fafaf8 !important; color: #0a0a0a !important; font-family: 'Inter', sans-serif !important; }
          :root { --bg: #fafaf8 !important; --bg2: #f2f1eb !important; --white: #0a0a0a !important; --border: #e8e7e2 !important; }

          /* ── Nav ── */
          .fp-nav {
            position: sticky; top: 0; z-index: 100;
            display: grid; grid-template-columns: auto 1fr auto auto;
            align-items: stretch; height: 52px;
            border-bottom: 1px solid #e8e7e2;
            background: rgba(250,250,248,0.9);
            backdrop-filter: blur(10px);
          }
          .fp-nav-logo {
            font-family: 'Determination', monospace;
            font-size: .9rem; letter-spacing: .06em; text-transform: uppercase;
            color: #0a0a0a; padding: 0 1.4rem;
            border-right: 1px solid #e8e7e2;
            display: flex; align-items: center; text-decoration: none;
          }
          .fp-nav-back {
            font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500;
            letter-spacing: .08em; text-transform: uppercase;
            color: #aaa; padding: 0 1.2rem;
            display: flex; align-items: center; gap: .5rem;
            text-decoration: none; transition: color .15s;
            border-right: 1px solid #e8e7e2;
          }
          .fp-nav-back:hover { color: #0a0a0a; }
          .fp-nav-title {
            font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600;
            color: #0a0a0a; padding: 0 1.4rem;
            display: flex; align-items: center; flex: 1;
          }
          .fp-nav-trial {
            font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600;
            letter-spacing: .08em; text-transform: uppercase;
            color: #0a0a0a; padding: 0 1.4rem;
            display: flex; align-items: center;
            border-left: 1px solid #e8e7e2;
            text-decoration: none; transition: color .15s; cursor: pointer;
            background: none; border-top: none; border-bottom: none; border-right: none;
          }
          .fp-nav-trial:hover { color: #1A1AFF; }
          .fp-nav-buy {
            font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700;
            letter-spacing: .1em; text-transform: uppercase;
            color: #fff; background: #1A1AFF;
            padding: 0 1.6rem; display: flex; align-items: center;
            text-decoration: none; transition: opacity .15s;
          }
          .fp-nav-buy:hover { opacity: .85; }

          /* ── Hero ── */
          .fp-hero {
            display: grid;
            grid-template-columns: 1fr 340px;
            border-bottom: 1px solid #e8e7e2;
            min-height: 520px;
          }
          .fp-hero-left {
            padding: clamp(2.5rem,5vw,4rem);
            border-right: 1px solid #e8e7e2;
            display: flex; flex-direction: column;
            justify-content: space-between;
            position: relative; overflow: hidden;
          }
          .fp-hero-kanji {
            position: absolute; top: -0.1em; right: -0.05em;
            font-size: clamp(12rem,22vw,20rem);
            line-height: 1; color: rgba(26,26,255,0.04);
            pointer-events: none; user-select: none;
            font-family: 'Hiragino Sans', 'Yu Gothic', sans-serif;
          }
          .fp-eyebrow {
            font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700;
            letter-spacing: .18em; text-transform: uppercase; color: #1A1AFF;
            margin-bottom: 1rem;
          }
          .fp-hero-name {
            font-size: clamp(3.5rem, 9vw, 8rem);
            line-height: .92; letter-spacing: -.02em;
            color: #0a0a0a; margin-bottom: 1.2rem;
          }
          .fp-hero-desc {
            font-family: 'Inter', sans-serif; font-size: 13px;
            color: #666; line-height: 1.7; max-width: 48ch;
            margin-bottom: 2rem;
          }
          .fp-meta-row {
            display: flex; gap: 2rem; flex-wrap: wrap;
          }
          .fp-meta-item { }
          .fp-meta-val {
            font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600;
            color: #0a0a0a;
          }
          .fp-meta-key {
            font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 500;
            letter-spacing: .1em; text-transform: uppercase; color: #aaa;
            margin-top: 2px;
          }

          /* ── Glyph Panel ── */
          .glyph-panel {
            background: #0a0a0a; color: #f2f1eb;
            display: flex; flex-direction: column;
          }
          .gp-header {
            padding: 14px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            display: flex; justify-content: space-between; align-items: center;
          }
          .gp-title {
            font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700;
            letter-spacing: .18em; text-transform: uppercase; color: #fff;
          }
          .gp-version {
            font-family: 'DigitalDisco', monospace; font-size: 10px;
            color: rgba(255,255,255,0.25); letter-spacing: .1em;
          }
          .gp-body { padding: 0 20px; flex: 1; overflow-y: auto; }
          .gp-row {
            padding: 14px 0;
            border-bottom: 1px solid rgba(255,255,255,0.06);
          }
          .gp-row-head {
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 10px;
          }
          .gp-label {
            font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500;
            color: rgba(255,255,255,0.5);
          }
          .gp-value {
            font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600;
            color: #fff;
          }
          .gp-slider {
            width: 100%; height: 2px;
            -webkit-appearance: none; appearance: none;
            background: rgba(255,255,255,0.1);
            outline: none; border-radius: 1px;
          }
          .gp-slider::-webkit-slider-thumb {
            -webkit-appearance: none; appearance: none;
            width: 14px; height: 14px; border-radius: 50%;
            background: #1A1AFF; cursor: pointer;
          }
          .gp-slider-labels {
            display: flex; justify-content: space-between; margin-top: 5px;
          }
          .gp-slider-labels span {
            font-family: 'Inter', sans-serif; font-size: 10px;
            color: rgba(255,255,255,0.2);
          }
          .gp-weights {
            display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
            margin-top: 2px;
          }
          .gp-weight-btn {
            font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500;
            padding: 7px 10px; border: 1px solid rgba(255,255,255,0.08);
            background: transparent; color: rgba(255,255,255,0.4);
            cursor: pointer; text-align: left; transition: all .15s;
          }
          .gp-weight-btn:hover { border-color: rgba(255,255,255,0.2); color: #fff; }
          .gp-weight-btn.active { background: #1A1AFF; border-color: #1A1AFF; color: #fff; }
          .gp-glyphs {
            display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;
            margin-top: 8px;
          }
          .gp-glyph {
            aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
            background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
            font-size: 1.4rem; color: #fff; cursor: default;
            transition: background .15s;
          }
          .gp-glyph:hover { background: rgba(26,26,255,0.2); }
          .gp-glyph-tabs {
            display: flex; gap: 0; margin-bottom: 10px; border: 1px solid rgba(255,255,255,0.08);
          }
          .gp-glyph-tab {
            font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600;
            letter-spacing: .08em; text-transform: uppercase;
            padding: 6px 10px; background: transparent;
            color: rgba(255,255,255,0.3); border: none; cursor: pointer;
            transition: all .15s; flex: 1;
          }
          .gp-glyph-tab.active { background: rgba(26,26,255,0.3); color: #fff; }
          .gp-kanji-row {
            display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px;
          }
          .gp-kanji {
            font-size: 1.6rem; color: rgba(255,255,255,0.15);
            font-family: 'Hiragino Sans', 'Yu Gothic', sans-serif;
            transition: color .2s; cursor: default;
          }
          .gp-kanji:hover { color: rgba(26,26,255,0.8); }

          /* ── Interactive specimen ── */
          .fp-specimen {
            border-bottom: 1px solid #e8e7e2;
            background: #fff;
          }
          .fp-specimen-toolbar {
            display: flex; align-items: center; gap: 1rem;
            padding: 10px 1.4rem;
            border-bottom: 1px solid #e8e7e2;
            flex-wrap: wrap;
          }
          .fp-specimen-input {
            flex: 1; min-width: 200px;
            font-family: 'Inter', sans-serif; font-size: 13px;
            border: none; outline: none; background: transparent;
            color: #0a0a0a;
          }
          .fp-specimen-input::placeholder { color: #ccc; }
          .fp-size-control {
            display: flex; align-items: center; gap: 8px; flex-shrink: 0;
          }
          .fp-size-label {
            font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500;
            letter-spacing: .08em; text-transform: uppercase; color: #aaa;
          }
          .fp-size-slider {
            width: 120px; height: 2px; -webkit-appearance: none; appearance: none;
            background: #e0e0e0; outline: none; border-radius: 1px;
          }
          .fp-size-slider::-webkit-slider-thumb {
            -webkit-appearance: none; width: 12px; height: 12px;
            border-radius: 50%; background: #1A1AFF; cursor: pointer;
          }
          .fp-size-val {
            font-family: 'DigitalDisco', monospace; font-size: 10px; color: #aaa;
            width: 30px;
          }
          .fp-specimen-stage {
            padding: clamp(2rem,5vw,4rem) clamp(1.4rem,4vw,3rem);
            min-height: 200px;
            display: flex; align-items: center;
            overflow: hidden;
          }
          .fp-specimen-text {
            line-height: .95; letter-spacing: -.01em;
            color: #0a0a0a; word-break: break-word;
            width: 100%;
          }

          /* ── Specimens grid ── */
          .fp-specimens-section {
            padding: clamp(2.5rem,5vw,4rem) clamp(1.4rem,4vw,3rem);
            border-bottom: 1px solid #e8e7e2;
          }
          .fp-section-title {
            font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700;
            letter-spacing: .18em; text-transform: uppercase; color: #aaa;
            margin-bottom: 1.6rem;
          }
          .fp-specimens-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }
          .fp-specimen-card {
            cursor: pointer; overflow: hidden;
            border: 2px solid transparent; transition: border-color .15s;
          }
          .fp-specimen-card.active { border-color: #1A1AFF; }
          .fp-specimen-card img {
            width: 100%; display: block;
            aspect-ratio: 4/3; object-fit: cover;
            transition: transform .3s ease;
          }
          .fp-specimen-card:hover img { transform: scale(1.02); }
          .fp-specimen-main {
            margin-bottom: 1.2rem;
            border: 1px solid #e8e7e2; overflow: hidden;
          }
          .fp-specimen-main img {
            width: 100%; display: block;
          }

          /* ── Weights showcase ── */
          .fp-weights {
            border-bottom: 1px solid #e8e7e2;
          }
          .fp-weight-row {
            display: grid; grid-template-columns: 120px 1fr auto;
            align-items: center; gap: 1.5rem;
            padding: 1rem clamp(1.4rem,4vw,3rem);
            border-bottom: 1px solid #f0efe9;
            cursor: pointer; transition: background .12s;
          }
          .fp-weight-row:hover { background: #f5f4f0; }
          .fp-weight-row.active { background: #f5f4f0; }
          .fp-weight-row:last-child { border-bottom: none; }
          .fp-weight-name {
            font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500;
            letter-spacing: .08em; text-transform: uppercase; color: #aaa;
          }
          .fp-weight-sample {
            font-size: clamp(1.4rem, 3vw, 2.8rem); line-height: 1;
            color: #0a0a0a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
          }
          .fp-weight-num {
            font-family: 'DigitalDisco', monospace; font-size: 10px;
            color: #ccc; letter-spacing: .1em; white-space: nowrap;
          }

          /* ── Buy section ── */
          .fp-buy {
            display: grid; grid-template-columns: 1fr 1fr;
            border-bottom: 1px solid #e8e7e2;
          }
          .fp-buy-left {
            padding: clamp(2rem,4vw,3.5rem);
            border-right: 1px solid #e8e7e2;
          }
          .fp-license-tabs {
            display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 2rem;
          }
          .fp-license-tab {
            font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600;
            letter-spacing: .08em; text-transform: uppercase;
            padding: 8px 16px; border: 1px solid #e0dfd8;
            background: transparent; color: #aaa; cursor: pointer; transition: all .15s;
          }
          .fp-license-tab:hover { border-color: #0a0a0a; color: #0a0a0a; }
          .fp-license-tab.active { background: #0a0a0a; border-color: #0a0a0a; color: #fff; }
          .fp-price-big {
            font-family: 'Determination', monospace;
            font-size: clamp(3rem,7vw,5.5rem); line-height: 1;
            color: #0a0a0a; margin-bottom: .5rem;
          }
          .fp-license-desc {
            font-family: 'Inter', sans-serif; font-size: 12px; color: #888;
            margin-bottom: 2rem;
          }
          .fp-buy-right {
            padding: clamp(2rem,4vw,3.5rem);
            display: flex; flex-direction: column; justify-content: space-between;
          }
          .fp-trust-items { display: flex; flex-direction: column; gap: 12px; margin-bottom: 2rem; }
          .fp-trust-item {
            display: flex; align-items: flex-start; gap: 10px;
          }
          .fp-trust-dot {
            width: 6px; height: 6px; border-radius: 50%; background: #1A1AFF;
            flex-shrink: 0; margin-top: 5px;
          }
          .fp-trust-text {
            font-family: 'Inter', sans-serif; font-size: 12px; color: #666; line-height: 1.5;
          }

          /* ── Kanji strip ── */
          .fp-kanji-strip {
            overflow: hidden; padding: 1.2rem 0;
            border-bottom: 1px solid #e8e7e2;
            display: flex; gap: 0;
          }
          .fp-kanji-scroll {
            display: flex; gap: 2.5rem;
            animation: tickerScroll 20s linear infinite;
            white-space: nowrap;
          }
          .fp-kanji-char {
            font-size: 1.8rem; color: rgba(26,26,255,0.12);
            font-family: 'Hiragino Sans', 'Yu Gothic', sans-serif;
          }

          @keyframes tickerScroll {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }

          /* ── Footer ── */
          .fp-footer {
            display: flex; justify-content: space-between; align-items: center;
            padding: 1.2rem clamp(1.4rem,4vw,3rem);
            background: #fafaf8; border-top: 1px solid #e8e7e2;
          }
          .fp-footer-left {
            font-family: 'Inter', sans-serif; font-size: 11px; color: #bbb;
            letter-spacing: .06em; text-transform: uppercase;
          }
          .fp-footer-links { display: flex; gap: 1.5rem; }
          .fp-footer-link {
            font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500;
            color: #bbb; letter-spacing: .08em; text-transform: uppercase;
            text-decoration: none; transition: color .15s;
          }
          .fp-footer-link:hover { color: #0a0a0a; }
        `}</style>
      </Head>

      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=GBP`}
        onReady={() => setPaypalReady(true)}
      />

      {/* ── NAV ─────────────────────────────────── */}
      <nav className="fp-nav">
        <Link href="/" className="fp-nav-logo">HypeForType</Link>
        <Link href="/" className="fp-nav-back">← All Typefaces</Link>
        <span className="fp-nav-title">{font.name}</span>
        <button className="fp-nav-trial" onClick={() => window.location.href=`/api/trial?slug=${font.slug}`}>
          Free Trial
        </button>
        <a href="#buy" className="fp-nav-buy">Buy {font.name} →</a>
      </nav>

      {/* ── HERO ────────────────────────────────── */}
      <section className="fp-hero">

        {/* Left — name + meta */}
        <div className="fp-hero-left">
          {/* Background kanji watermark */}
          <div className="fp-hero-kanji">{kanji[0]}</div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="fp-eyebrow">{font.idx} — {font.tags.join(' · ')}</div>
            <h1 className="fp-hero-name" style={{ fontFamily }}>{font.name}</h1>
            <p className="fp-hero-desc">{font.description}</p>

            <div className="fp-meta-row">
              {[
                [font.styles.length + (font.styles.length === 1 ? ' style' : ' styles'), 'Weights'],
                [font.glyphCount + '+', 'Glyphs'],
                [font.languages, 'Languages'],
                [font.released, 'Released'],
              ].map(([v, k]) => (
                <div key={k} className="fp-meta-item">
                  <div className="fp-meta-val">{v}</div>
                  <div className="fp-meta-key">{k}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Kanji decoration row */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', position: 'relative', zIndex: 1 }}>
            {kanji.slice(0, 6).map((k, i) => (
              <span key={i} style={{
                fontFamily: "'Hiragino Sans', 'Yu Gothic', sans-serif",
                fontSize: '1.4rem',
                color: i === 0 ? 'rgba(26,26,255,0.5)' : `rgba(26,26,255,${0.12 - i * 0.015})`,
                transition: 'color .2s',
              }}>{k}</span>
            ))}
          </div>
        </div>

        {/* Right — Glyph Panel */}
        <div className="glyph-panel">
          <div className="gp-header">
            <span className="gp-title">Glyph Panel</span>
            <span className="gp-version">V1.0</span>
          </div>

          <div className="gp-body">

            {/* Weight selector */}
            <div className="gp-row">
              <div className="gp-row-head">
                <span className="gp-label">Weight</span>
                <span className="gp-value">{style.name} {style.weight}</span>
              </div>
              <div className="gp-weights">
                {font.styles.map((s, i) => (
                  <button key={i} className={`gp-weight-btn${activeStyle === i ? ' active' : ''}`}
                    onClick={() => setActiveStyle(i)}
                    style={{ fontFamily: `'${font.name}', monospace`, fontWeight: s.weight }}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Font size */}
            <div className="gp-row">
              <div className="gp-row-head">
                <span className="gp-label">Size</span>
                <span className="gp-value">{fontSize}px</span>
              </div>
              <input type="range" className="gp-slider"
                min="24" max="180" value={fontSize}
                onChange={e => setFontSize(+e.target.value)} />
              <div className="gp-slider-labels"><span>24</span><span>180</span></div>
            </div>

            {/* Letter spacing */}
            <div className="gp-row">
              <div className="gp-row-head">
                <span className="gp-label">Letter Spacing</span>
                <span className="gp-value">{letterSpacing > 0 ? '+' : ''}{letterSpacing}%</span>
              </div>
              <input type="range" className="gp-slider"
                min="-10" max="30" value={letterSpacing}
                onChange={e => setLetterSpacing(+e.target.value)} />
              <div className="gp-slider-labels"><span>−10</span><span>+30</span></div>
            </div>

            {/* Glyph inspector */}
            <div className="gp-row">
              <div className="gp-row-head" style={{ marginBottom: '8px' }}>
                <span className="gp-label">Glyphs</span>
              </div>
              <div className="gp-glyph-tabs">
                {Object.keys(glyphSets).map(k => (
                  <button key={k} className={`gp-glyph-tab${glyphSet === k ? ' active' : ''}`}
                    onClick={() => setGlyphSet(k)}>
                    {k.slice(0, 3).toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="gp-glyphs">
                {glyphSets[glyphSet].slice(0, 16).map((g, i) => (
                  <div key={i} className="gp-glyph"
                    style={{ fontFamily: `'${font.name}', monospace`, fontWeight: style.weight }}>
                    {g}
                  </div>
                ))}
              </div>
            </div>

            {/* Kanji decoration */}
            <div className="gp-row">
              <div className="gp-row-head">
                <span className="gp-label">Kanji Mix</span>
              </div>
              <div className="gp-kanji-row">
                {kanji.map((k, i) => (
                  <span key={i} className="gp-kanji">{k}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── INTERACTIVE SPECIMEN ─────────────────── */}
      <section className="fp-specimen">
        <div className="fp-specimen-toolbar">
          <input className="fp-specimen-input"
            value={previewText}
            onChange={e => setPreviewText(e.target.value)}
            placeholder={`Type to preview ${font.name}...`}
          />
          <div className="fp-size-control">
            <span className="fp-size-label">Size</span>
            <input type="range" className="fp-size-slider"
              min="24" max="200" value={fontSize}
              onChange={e => setFontSize(+e.target.value)} />
            <span className="fp-size-val">{fontSize}</span>
          </div>
        </div>
        <div className="fp-specimen-stage">
          <div className="fp-specimen-text"
            style={{
              fontFamily,
              fontWeight: style.weight,
              fontSize: fontSize + 'px',
              letterSpacing: letterSpacing + '%',
            }}>
            {displayText}
          </div>
        </div>
      </section>

      {/* ── KANJI STRIP ──────────────────────────── */}
      <div className="fp-kanji-strip">
        <div className="fp-kanji-scroll">
          {[...kanji, ...kanji, ...kanji, ...kanji].map((k, i) => (
            <span key={i} className="fp-kanji-char">{k}</span>
          ))}
        </div>
      </div>

      {/* ── SPECIMEN IMAGES (if available) ───────── */}
      {specimens.length > 0 && (
        <section className="fp-specimens-section">
          <div className="fp-section-title">Type Specimens</div>

          {/* Main large specimen */}
          <div className="fp-specimen-main">
            <img
              src={specimens[activeSpecimen]}
              alt={`${font.name} specimen ${activeSpecimen + 1}`}
            />
          </div>

          {/* Thumbnail grid */}
          <div className="fp-specimens-grid">
            {specimens.map((src, i) => (
              <div key={i}
                className={`fp-specimen-card${activeSpecimen === i ? ' active' : ''}`}
                onClick={() => setActiveSpecimen(i)}>
                <img src={src} alt={`${font.name} specimen ${i + 1}`} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── WEIGHTS SHOWCASE ─────────────────────── */}
      <section className="fp-weights">
        <div style={{ padding: '1rem clamp(1.4rem,4vw,3rem)', borderBottom: '1px solid #e8e7e2' }}>
          <div className="fp-section-title" style={{ margin: 0 }}>All Weights</div>
        </div>
        {font.styles.map((s, i) => (
          <div key={i}
            className={`fp-weight-row${activeStyle === i ? ' active' : ''}`}
            onClick={() => setActiveStyle(i)}>
            <span className="fp-weight-name">{s.name}</span>
            <span className="fp-weight-sample"
              style={{ fontFamily, fontWeight: s.weight, fontStyle: s.oblique ? 'italic' : 'normal' }}>
              {previewText.trim() || 'The quick brown fox'}
            </span>
            <span className="fp-weight-num">{s.weight}</span>
          </div>
        ))}
      </section>

      {/* ── BUY ──────────────────────────────────── */}
      <section className="fp-buy" id="buy">
        <div className="fp-buy-left">
          <div className="fp-section-title" style={{ marginBottom: '1.5rem' }}>License & Purchase</div>

          <div className="fp-license-tabs">
            {Object.entries(tiers).map(([key, tier]) => (
              <button key={key}
                className={`fp-license-tab${selectedLicense === key ? ' active' : ''}`}
                onClick={() => setSelectedLicense(key)}>
                {tier.label}
              </button>
            ))}
          </div>

          <div className="fp-price-big">£{tiers[selectedLicense].price}</div>
          <div className="fp-license-desc">{tiers[selectedLicense].desc}</div>

          <div ref={paypalRef} style={{ minHeight: 44 }}>
            {purchasing && (
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#666' }}>
                Processing...
              </div>
            )}
          </div>
        </div>

        <div className="fp-buy-right">
          <div>
            <div className="fp-section-title" style={{ marginBottom: '1.2rem' }}>What's included</div>
            <div className="fp-trust-items">
              {[
                `${font.styles.length} font file${font.styles.length > 1 ? 's' : ''} (.otf / .ttf)`,
                `${font.glyphCount}+ glyphs including Latin Extended`,
                font.opentype !== 'Standard' ? `OpenType features: ${font.opentype}` : 'Full OpenType support',
                'Instant download after purchase',
                'Commercial use perpetual license',
                'PayPal Secure checkout',
              ].map((item, i) => (
                <div key={i} className="fp-trust-item">
                  <div className="fp-trust-dot" />
                  <span className="fp-trust-text">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <button
              onClick={() => window.location.href = `/api/trial?slug=${font.slug}`}
              style={{
                width: '100%', fontFamily: "'Inter', sans-serif",
                fontSize: 12, fontWeight: 600, letterSpacing: '.08em',
                textTransform: 'uppercase', padding: '13px',
                border: '1px solid #e0dfd8', background: 'transparent',
                color: '#666', cursor: 'pointer', transition: 'all .15s',
                marginBottom: 8,
              }}
              onMouseEnter={e => { e.target.style.borderColor = '#0a0a0a'; e.target.style.color = '#0a0a0a'; }}
              onMouseLeave={e => { e.target.style.borderColor = '#e0dfd8'; e.target.style.color = '#666'; }}>
              Download Free Trial
            </button>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#bbb', textAlign: 'center' }}>
              Trial fonts for mockups only · Not for commercial use
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────── */}
      <footer className="fp-footer">
        <span className="fp-footer-left">© 2026 HypeForType · {font.name}</span>
        <div className="fp-footer-links">
          {['Licensing','FAQ','Contact'].map(t => (
            <Link key={t} href={'/' + t.toLowerCase()} className="fp-footer-link">{t}</Link>
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
