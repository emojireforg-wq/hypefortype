import Head from 'next/head';
import Link from 'next/link';
import Nav from '../components/Nav';
import { fonts, pricing } from '../lib/fonts';
import { useState, useEffect } from 'react';

const FILTERS = ['All', 'Display', 'Japanese', 'Handmade', 'Rounded', 'Pro'];

// Pick a featured font for the hero
const HERO = fonts.find(f => f.slug === 'nanami') || fonts[0];

export default function Home() {
  const [preview, setPreview] = useState('');
  const [filter,  setFilter]  = useState('All');
  const [clock,   setClock]   = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => setClock(new Date().toUTCString().split(' ')[4] + ' UTC');
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const filtered = filter === 'All'
    ? fonts
    : fonts.filter(f => f.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())));

  const startingPrice = (f) => {
    const tiers = pricing[f.isFamily ? 'family' : 'single'];
    return tiers.desktop.price;
  };

  return (
    <>
      <Head>
        <title>HypeForType — Type Foundry</title>
        <meta name="description" content="28 distinctive typefaces for designers, brands, and studios. Desktop, Web, App and Broadcast licenses." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {fonts.map(f => f.styles.map(s => (
          <style key={`${f.slug}-${s.file}`}>{`@font-face{font-family:'${f.name}';src:url('/fonts/${f.slug}/${encodeURIComponent(s.file)}');font-weight:${s.weight};font-style:${s.oblique?'italic':'normal'};font-display:swap;}`}</style>
        )))}
        <style>{`
          .font-row {
            display: grid;
            grid-template-columns: 80px 1fr auto auto;
            align-items: center;
            border-bottom: 1px solid var(--border-dark);
            padding: 0 1.6rem;
            min-height: 72px;
            text-decoration: none;
            color: inherit;
            transition: background .12s;
            gap: 1.5rem;
          }
          .font-row:hover { background: #111; }
          .font-row:hover .row-name { color: #fff; }
          .font-row:hover .row-cta { opacity: 1; }
          .row-name {
            font-size: clamp(1.6rem, 3.5vw, 3rem);
            line-height: 1;
            color: #777;
            letter-spacing: -.01em;
            transition: color .12s;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .row-cta {
            opacity: 0;
            background: var(--blue);
            color: #fff;
            font-family: 'Inter', sans-serif;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: .08em;
            text-transform: uppercase;
            padding: 8px 16px;
            border: none;
            white-space: nowrap;
            transition: opacity .12s;
          }
          .filter-pill {
            font-family: 'Inter', sans-serif;
            font-size: 11px;
            font-weight: 500;
            letter-spacing: .08em;
            text-transform: uppercase;
            padding: 6px 14px;
            border: 1px solid #222;
            background: transparent;
            color: #444;
            cursor: pointer;
            transition: all .15s;
          }
          .filter-pill:hover, .filter-pill.active {
            background: var(--blue);
            border-color: var(--blue);
            color: #fff;
          }
          .ticker-inner {
            display: flex;
            gap: 0;
            animation: ticker 30s linear infinite;
            white-space: nowrap;
          }
          .hero-input::placeholder { color: #333; }
        `}</style>
      </Head>

      <Nav />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 420px',
        borderBottom: '1px solid var(--border-dark)',
        minHeight: 'clamp(320px, 42vw, 520px)',
      }}>

        {/* LEFT — big specimen + preview */}
        <div style={{
          background: 'var(--blue)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(1.8rem,4vw,3rem)',
          borderRight: '1px solid rgba(0,0,0,.2)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Massive background letter */}
          <div style={{
            position: 'absolute',
            bottom: '-0.2em',
            right: '-0.05em',
            fontFamily: `'${HERO.name}', monospace`,
            fontSize: 'clamp(14rem, 30vw, 28rem)',
            lineHeight: 1,
            color: 'rgba(0,0,0,.15)',
            pointerEvents: 'none',
            userSelect: 'none',
          }} aria-hidden>
            Aa
          </div>

          {/* Top label */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: '1.2rem' }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)' }}>
                Type Foundry — London
              </span>
              <span style={{ fontFamily: "'DigitalDisco', monospace", fontSize: '11px', color: 'rgba(255,255,255,.35)', letterSpacing: '.1em' }}>
                {clock}
              </span>
            </div>

            <h1 style={{
              fontFamily: `'${HERO.name}', monospace`,
              fontSize: 'clamp(2.8rem, 7vw, 6.5rem)',
              lineHeight: .95,
              color: '#fff',
              letterSpacing: '-.01em',
              marginBottom: '1rem',
              position: 'relative', zIndex: 1,
            }}>
              {preview.trim() || 'Type. Loud.'}
            </h1>

            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,.55)', lineHeight: 1.65, maxWidth: '36ch', position: 'relative', zIndex: 1 }}>
              28 distinctive typefaces for designers, brands and studios. Desktop, Web, App and Broadcast licenses.
            </p>
          </div>

          {/* Bottom — preview input */}
          <div style={{ position: 'relative', zIndex: 1, marginTop: '2rem' }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: '8px' }}>
              ↑ Type to preview all fonts
            </div>
            <input
              className="hero-input"
              value={preview}
              onChange={e => setPreview(e.target.value)}
              maxLength={30}
              placeholder="Your text here..."
              style={{
                background: 'rgba(0,0,0,.25)',
                border: '1px solid rgba(255,255,255,.15)',
                outline: 'none',
                color: '#fff',
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                width: '100%',
                padding: '10px 14px',
                caretColor: '#fff',
              }}
            />
          </div>
        </div>

        {/* RIGHT — trust panel */}
        <div style={{
          background: 'var(--panel)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(1.8rem,4vw,3rem)',
        }}>
          <div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#999', marginBottom: '2rem' }}>
              Why HypeForType
            </div>

            {[
              ['28', 'Distinctive typefaces'],
              ['4', 'License types'],
              ['£25', 'Starting price'],
              ['Instant', 'Download after purchase'],
            ].map(([val, label]) => (
              <div key={label} style={{ borderBottom: '1px solid var(--border-light)', padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: "'Determination', monospace", fontSize: '1.6rem', color: '#0a0a0a', letterSpacing: '.02em' }}>{val}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 500, color: '#888', letterSpacing: '.06em', textTransform: 'uppercase' }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem' }}>
            <Link href="/typefaces/nanami" style={{
              display: 'block',
              background: '#0a0a0a',
              color: '#fff',
              fontFamily: "'Inter', sans-serif",
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              padding: '14px 20px',
              textAlign: 'center',
              transition: 'background .15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--blue)'}
              onMouseLeave={e => e.currentTarget.style.background = '#0a0a0a'}>
              Browse All Typefaces →
            </Link>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#aaa', textAlign: 'center', marginTop: '10px' }}>
              Secure checkout via PayPal
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ──────────────────────────────────────────── */}
      <div style={{
        borderBottom: '1px solid var(--border-dark)',
        background: 'var(--blue)',
        overflow: 'hidden',
        padding: '8px 0',
      }}>
        <div className="ticker-inner">
          {[...Array(4)].map((_, i) => (
            <span key={i} style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,.6)',
              paddingRight: '4rem',
            }}>
              28 Typefaces &nbsp;·&nbsp; Desktop Licenses &nbsp;·&nbsp; Web Licenses &nbsp;·&nbsp; App Licenses &nbsp;·&nbsp; Broadcast Licenses &nbsp;·&nbsp; Instant Download &nbsp;·&nbsp; PayPal Secure &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── FILTER + GRID HEADER ────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-dark)',
        padding: '10px 1.6rem',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f} className={`filter-pill${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#333', letterSpacing: '.06em' }}>
          {filtered.length} typeface{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── COLUMN HEADERS ──────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr auto auto',
        gap: '1.5rem',
        padding: '6px 1.6rem',
        borderBottom: '1px solid var(--border-dark)',
        background: 'var(--bg2)',
      }}>
        {['No.', 'Typeface', 'Category', 'From'].map(h => (
          <span key={h} style={{ fontFamily: "'Inter', sans-serif", fontSize: '10px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: '#2a2a2a' }}>
            {h}
          </span>
        ))}
      </div>

      {/* ── FONT LIST ───────────────────────────────────────── */}
      <div>
        {filtered.map((f) => (
          <Link key={f.slug} href={`/typefaces/${f.slug}`} className="font-row">

            {/* Index */}
            <span style={{ fontFamily: "'DigitalDisco', monospace", fontSize: '10px', color: '#2a2a2a', letterSpacing: '.1em' }}>
              {f.idx}
            </span>

            {/* Name */}
            <div style={{ minWidth: 0 }}>
              <div className="row-name" style={{ fontFamily: `'${f.name}', monospace` }}>
                {preview.trim() || f.name}
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px', alignItems: 'center' }}>
                {f.hot && <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', padding: '2px 6px', background: 'var(--blue)', color: '#fff' }}>New</span>}
                {f.pro && <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '9px', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', padding: '2px 6px', border: '1px solid #222', color: '#444' }}>Pro</span>}
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#2a2a2a' }}>
                  {f.styles.length} {f.styles.length === 1 ? 'style' : 'styles'}
                </span>
              </div>
            </div>

            {/* Category */}
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 500, color: '#2d2d2d', letterSpacing: '.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              {f.tags[0]}
            </span>

            {/* Price + CTA */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: 600, color: '#333', whiteSpace: 'nowrap' }}>
                from £{startingPrice(f)}
              </span>
              <button className="row-cta">Buy →</button>
            </div>
          </Link>
        ))}
      </div>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--border-dark)',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        background: 'var(--bg2)',
        marginTop: '4rem',
      }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#2e2e2e', letterSpacing: '.06em', textTransform: 'uppercase', padding: '1.2rem 1.6rem' }}>
          © 2026 HypeForType
        </span>
        <div style={{ borderLeft: '1px solid var(--border-dark)', borderRight: '1px solid var(--border-dark)', display: 'flex', gap: '2rem', alignItems: 'center', padding: '1.2rem 2rem' }}>
          {['Licensing','FAQ','Privacy','Contact'].map(t => (
            <Link key={t} href={'/' + t.toLowerCase()}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 500, color: '#2e2e2e', letterSpacing: '.08em', textTransform: 'uppercase', transition: 'color .12s' }}
              onMouseEnter={e => e.target.style.color = 'var(--white)'}
              onMouseLeave={e => e.target.style.color = '#2e2e2e'}>
              {t}
            </Link>
          ))}
        </div>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#2e2e2e', letterSpacing: '.06em', textTransform: 'uppercase', padding: '1.2rem 1.6rem', textAlign: 'right' }}>
          London · Online
        </span>
      </footer>
    </>
  );
}
