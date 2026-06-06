import Head from 'next/head';
import Link from 'next/link';
import Nav from '../components/Nav';
import { fonts, pricing } from '../lib/fonts';
import { useState, useEffect, useRef } from 'react';

const HERO_FONT = fonts.find(f => f.slug === 'nanami') || fonts[0];
const FILTERS = ['All','Display','Japanese','Handmade','Rounded','Pro'];

function startPrice(f) {
  const t = pricing[f.isFamily ? 'family' : 'single'];
  return t.desktop.price;
}

export default function Home() {
  const [preview,  setPreview]  = useState('');
  const [filter,   setFilter]   = useState('All');
  const [heroText, setHeroText] = useState('Type.\nLoud.');
  const [mouse,    setMouse]    = useState({ x: 0.5, y: 0.5 });
  const [clock,    setClock]    = useState('');
  const heroRef = useRef(null);

  useEffect(() => {
    const tick = () => setClock(new Date().toUTCString().split(' ')[4] + ' UTC');
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Parallax mouse tracking on hero
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const handle = (e) => {
      const r = hero.getBoundingClientRect();
      setMouse({
        x: (e.clientX - r.left) / r.width,
        y: (e.clientY - r.top)  / r.height,
      });
    };
    hero.addEventListener('mousemove', handle);
    return () => hero.removeEventListener('mousemove', handle);
  }, []);

  const filtered = filter === 'All'
    ? fonts
    : fonts.filter(f => f.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())));

  const px = (mouse.x - 0.5) * 28;
  const py = (mouse.y - 0.5) * 16;

  return (
    <>
      <Head>
        <title>HypeForType — Independent Type Foundry</title>
        <meta name="description" content="28 distinctive typefaces for designers, brands and studios. London." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {fonts.map(f => f.styles.map(s => (
          <style key={`${f.slug}-${s.file}`}>{`
            @font-face {
              font-family: '${f.name}';
              src: url('/fonts/${f.slug}/${encodeURIComponent(s.file)}');
              font-weight: ${s.weight};
              font-style: ${s.oblique ? 'italic' : 'normal'};
              font-display: swap;
            }
          `}</style>
        )))}
        <style>{`
          /* ── Hero ─────────────────── */
          .hero {
            position: relative;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            overflow: hidden;
            background: var(--bg);
            padding-top: 48px;
          }
          .hero-bg-glyph {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: clamp(40vw, 55vw, 62vw);
            line-height: 1;
            color: rgba(26,26,255,0.07);
            pointer-events: none;
            user-select: none;
            will-change: transform;
            transition: transform 0.08s ease-out;
            white-space: nowrap;
          }
          .hero-content {
            position: relative;
            z-index: 2;
            padding: clamp(2rem,5vw,4rem) clamp(1.4rem,4vw,3.5rem);
            padding-bottom: clamp(3rem,6vw,5rem);
          }
          .hero-eyebrow {
            display: flex;
            gap: 1.5rem;
            align-items: center;
            margin-bottom: 1.8rem;
          }
          .hero-eyebrow span {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 11px;
            font-weight: 500;
            letter-spacing: .14em;
            text-transform: uppercase;
            color: rgba(255,255,255,0.25);
          }
          .hero-eyebrow .dot {
            width: 4px; height: 4px;
            border-radius: 50%;
            background: var(--blue);
            flex-shrink: 0;
          }
          .hero-headline {
            font-size: clamp(5rem, 14vw, 14rem);
            line-height: 0.92;
            letter-spacing: -0.03em;
            color: var(--white);
            margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
            white-space: pre-line;
          }
          .hero-bottom {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            flex-wrap: wrap;
            gap: 1.5rem;
          }
          .hero-desc {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 13px;
            color: rgba(255,255,255,0.35);
            line-height: 1.7;
            max-width: 36ch;
          }
          .hero-actions {
            display: flex;
            gap: 1rem;
            align-items: center;
            flex-wrap: wrap;
          }
          .btn-primary {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: .1em;
            text-transform: uppercase;
            color: #fff;
            background: var(--blue);
            border: none;
            padding: 13px 28px;
            display: inline-block;
            transition: opacity .2s;
          }
          .btn-primary:hover { opacity: 0.8; }
          .btn-ghost {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 12px;
            font-weight: 500;
            letter-spacing: .1em;
            text-transform: uppercase;
            color: rgba(255,255,255,0.4);
            background: transparent;
            border: 1px solid rgba(255,255,255,0.1);
            padding: 12px 24px;
            display: inline-block;
            transition: all .2s;
          }
          .btn-ghost:hover {
            border-color: rgba(255,255,255,0.3);
            color: var(--white);
          }

          /* ── Preview input overlay ── */
          .preview-overlay {
            position: absolute;
            top: 48px; left: 0; right: 0;
            z-index: 3;
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0 clamp(1.4rem,4vw,3.5rem);
            height: 52px;
            border-bottom: 1px solid var(--border);
            background: rgba(8,8,15,0.6);
            backdrop-filter: blur(8px);
          }
          .preview-label {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: .18em;
            text-transform: uppercase;
            color: var(--blue);
            white-space: nowrap;
            flex-shrink: 0;
          }
          .preview-input {
            background: transparent;
            border: none;
            outline: none;
            font-family: 'Space Grotesk', sans-serif;
            font-size: 13px;
            color: rgba(255,255,255,0.5);
            width: 100%;
            caret-color: var(--blue);
          }
          .preview-input::placeholder { color: rgba(255,255,255,0.15); }

          /* ── Stats bar ────────────── */
          .stats-bar {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            border-top: 1px solid var(--border);
            border-bottom: 1px solid var(--border);
          }
          .stat-cell {
            padding: clamp(1.2rem,3vw,2rem) clamp(1.4rem,3vw,2.5rem);
            border-right: 1px solid var(--border);
          }
          .stat-cell:last-child { border-right: none; }
          .stat-num {
            font-family: 'Determination', monospace;
            font-size: clamp(2rem, 4vw, 3.5rem);
            color: var(--white);
            line-height: 1;
            margin-bottom: .4rem;
          }
          .stat-label {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 11px;
            font-weight: 500;
            letter-spacing: .1em;
            text-transform: uppercase;
            color: rgba(255,255,255,0.2);
          }

          /* ── Ticker ───────────────── */
          .ticker-wrap {
            overflow: hidden;
            border-bottom: 1px solid var(--border);
            padding: 10px 0;
            background: var(--blue);
          }
          .ticker-track {
            display: flex;
            animation: tickerScroll 22s linear infinite;
            white-space: nowrap;
          }
          .ticker-item {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: .16em;
            text-transform: uppercase;
            color: rgba(255,255,255,0.55);
            padding-right: 3rem;
          }

          /* ── Filter bar ───────────── */
          .filter-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px clamp(1.4rem,3vw,2.5rem);
            border-bottom: 1px solid var(--border);
            gap: 1rem;
            flex-wrap: wrap;
          }
          .filter-pills { display: flex; gap: 6px; flex-wrap: wrap; }
          .pill {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: .1em;
            text-transform: uppercase;
            padding: 5px 13px;
            border: 1px solid var(--border);
            background: transparent;
            color: rgba(255,255,255,0.25);
            cursor: pointer;
            transition: all .15s;
          }
          .pill:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.6); }
          .pill.active { background: var(--blue); border-color: var(--blue); color: #fff; }
          .filter-count {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 11px;
            color: rgba(255,255,255,0.18);
            letter-spacing: .06em;
            white-space: nowrap;
          }

          /* ── Grid header ──────────── */
          .grid-head {
            display: grid;
            grid-template-columns: 64px 1fr 140px 120px 130px;
            gap: 0;
            padding: 7px clamp(1.4rem,3vw,2.5rem);
            border-bottom: 1px solid var(--border);
            background: var(--bg2);
          }
          .grid-head span {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: .12em;
            text-transform: uppercase;
            color: rgba(255,255,255,0.12);
          }

          /* ── Font rows ────────────── */
          .font-row {
            display: grid;
            grid-template-columns: 64px 1fr 140px 120px 130px;
            align-items: center;
            border-bottom: 1px solid var(--border);
            padding: 0 clamp(1.4rem,3vw,2.5rem);
            min-height: 120px;
            text-decoration: none;
            color: inherit;
            position: relative;
            overflow: hidden;
            transition: background .15s;
            gap: 0;
          }
          .font-row::before {
            content: '';
            position: absolute;
            left: 0; top: 0; bottom: 0;
            width: 0;
            background: var(--blue);
            transition: width .2s ease;
          }
          .font-row:hover::before { width: 3px; }
          .font-row:hover { background: rgba(26,26,255,0.04); }
          .font-row:hover .row-name { color: var(--white); }
          .font-row:hover .row-cta { opacity: 1; transform: translateX(0); }
          .font-row:hover .row-price { color: var(--white); }

          .row-idx {
            font-family: 'DigitalDisco', monospace;
            font-size: 10px;
            color: rgba(255,255,255,0.12);
            letter-spacing: .1em;
            padding-left: 3px;
          }
          .row-name-wrap { min-width: 0; padding-right: 1rem; }
          .row-name {
            font-size: clamp(3rem, 6vw, 5.2rem);
            line-height: 1;
            color: rgba(255,255,255,0.55);
            letter-spacing: -.01em;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            transition: color .15s;
            margin-bottom: 5px;
          }
          .row-meta {
            display: flex;
            gap: 8px;
            align-items: center;
          }
          .badge-new {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 9px; font-weight: 700;
            letter-spacing: .08em; text-transform: uppercase;
            padding: 2px 6px;
            background: var(--blue);
            color: #fff;
          }
          .badge-pro {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 9px; font-weight: 600;
            letter-spacing: .08em; text-transform: uppercase;
            padding: 2px 6px;
            border: 1px solid var(--border);
            color: rgba(255,255,255,0.2);
          }
          .row-styles {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 11px;
            color: rgba(255,255,255,0.18);
          }
          .row-cat {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 11px; font-weight: 500;
            letter-spacing: .06em; text-transform: uppercase;
            color: rgba(255,255,255,0.2);
          }
          .row-price {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 13px; font-weight: 600;
            color: rgba(255,255,255,0.3);
            transition: color .15s;
          }
          .row-cta {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 10px; font-weight: 700;
            letter-spacing: .1em; text-transform: uppercase;
            background: var(--blue);
            color: #fff;
            border: none;
            padding: 8px 16px;
            opacity: 0;
            transform: translateX(8px);
            transition: opacity .2s, transform .2s;
            white-space: nowrap;
            display: flex; align-items: center; gap: 6px;
          }
          .row-cta-wrap {
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }

          /* ── Footer ───────────────── */
          .site-footer {
            border-top: 1px solid var(--border);
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            margin-top: 6rem;
            background: var(--bg2);
          }
          .footer-copy {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 11px;
            color: rgba(255,255,255,0.15);
            letter-spacing: .06em;
            text-transform: uppercase;
            padding: 1.4rem 1.8rem;
          }
          .footer-links {
            border-left: 1px solid var(--border);
            border-right: 1px solid var(--border);
            display: flex;
            gap: 2rem;
            align-items: center;
            padding: 1.4rem 2rem;
          }
          .footer-link {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 11px; font-weight: 500;
            letter-spacing: .1em; text-transform: uppercase;
            color: rgba(255,255,255,0.18);
            transition: color .2s;
          }
          .footer-link:hover { color: var(--white); }
          .footer-loc {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 11px;
            color: rgba(255,255,255,0.15);
            letter-spacing: .06em;
            text-transform: uppercase;
            padding: 1.4rem 1.8rem;
            text-align: right;
          }
        `}</style>
      </Head>

      <Nav />

      {/* ─────────────────────── HERO ─────────────────────── */}
      <section className="hero" ref={heroRef}>

        {/* Massive background glyph — parallax */}
        <div className="hero-bg-glyph"
          style={{
            fontFamily: `'${HERO_FONT.name}', monospace`,
            transform: `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`,
          }}>
          N
        </div>

        {/* Preview bar just below nav */}
        <div className="preview-overlay">
          <span className="preview-label">Preview</span>
          <input
            className="preview-input"
            value={preview}
            onChange={e => setPreview(e.target.value)}
            maxLength={40}
            placeholder="Type to preview all fonts below..."
          />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,0.12)', letterSpacing: '.1em', flexShrink: 0 }}>
            {clock}
          </span>
        </div>

        {/* Hero content — bottom anchored */}
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span>Independent Type Foundry</span>
            <div className="dot" />
            <span>London</span>
            <div className="dot" />
            <span>Est. 2024</span>
          </div>

          <h1 className="hero-headline"
            style={{ fontFamily: `'${HERO_FONT.name}', monospace` }}>
            {heroText}
          </h1>

          <div className="hero-bottom">
            <p className="hero-desc">
              28 distinctive typefaces for designers, brands and studios.
              Display, Japanese, Handmade and Pro families.
              Desktop · Web · App · Broadcast licenses.
            </p>
            <div className="hero-actions">
              <a href="#typefaces" className="btn-primary">Browse Typefaces →</a>
              <Link href="/typefaces/nanami" className="btn-ghost">Try Nanami Free</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────── STATS ────────────────────── */}
      <div className="stats-bar">
        {[
          ['28',     'Typefaces'],
          ['£25',    'Starting price'],
          ['4',      'License types'],
          ['Instant','Download'],
        ].map(([n, l]) => (
          <div key={l} className="stat-cell">
            <div className="stat-num">{n}</div>
            <div className="stat-label">{l}</div>
          </div>
        ))}
      </div>

      {/* ─────────────────────── TICKER ───────────────────── */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="ticker-item">
              28 Typefaces &nbsp;·&nbsp; Display &nbsp;·&nbsp; Japanese &nbsp;·&nbsp; Handmade &nbsp;·&nbsp; Desktop License &nbsp;·&nbsp; Web License &nbsp;·&nbsp; App License &nbsp;·&nbsp; Broadcast &nbsp;·&nbsp; Instant Download &nbsp;·&nbsp; PayPal Secure &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ─────────────────────── GRID ─────────────────────── */}
      <section id="typefaces">

        {/* Filter bar */}
        <div className="filter-bar">
          <div className="filter-pills">
            {FILTERS.map(f => (
              <button key={f} className={`pill${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
          <span className="filter-count">{filtered.length} typeface{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Column headers */}
        <div className="grid-head">
          <span>No.</span>
          <span>Typeface</span>
          <span>Category</span>
          <span>Styles</span>
          <span>Price</span>
        </div>

        {/* Font rows */}
        {filtered.map(f => (
          <Link key={f.slug} href={`/typefaces/${f.slug}`} className="font-row">

            <span className="row-idx">{f.idx}</span>

            <div className="row-name-wrap">
              <div className="row-name" style={{ fontFamily: `'${f.name}', monospace` }}>
                {preview.trim() || f.name}
              </div>
              <div className="row-meta">
                {f.hot && <span className="badge-new">New</span>}
                {f.pro && <span className="badge-pro">Pro</span>}
                <span className="row-styles">{f.styles.length} {f.styles.length === 1 ? 'style' : 'styles'}</span>
              </div>
            </div>

            <span className="row-cat">{f.tags[0]}</span>

            <span className="row-styles" style={{ color: 'rgba(255,255,255,0.18)' }}>
              {f.styles.length} {f.styles.length === 1 ? 'style' : 'styles'}
            </span>

            <div className="row-cta-wrap">
              <span className="row-price">from £{startPrice(f)}</span>
              <div style={{ width: '1rem' }} />
              <button className="row-cta">Buy →</button>
            </div>

          </Link>
        ))}
      </section>

      {/* ─────────────────────── FOOTER ───────────────────── */}
      <footer className="site-footer">
        <span className="footer-copy">© 2026 HypeForType</span>
        <div className="footer-links">
          {['Licensing','FAQ','Privacy','Contact'].map(t => (
            <Link key={t} href={'/' + t.toLowerCase()} className="footer-link">{t}</Link>
          ))}
        </div>
        <span className="footer-loc">London · Online</span>
      </footer>
    </>
  );
}
