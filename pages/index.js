import Head from 'next/head';
import Link from 'next/link';
import Nav from '../components/Nav';
import { fonts, pricing } from '../lib/fonts';
import { useState } from 'react';

const FILTERS = ['All','Display','Japanese','Handmade','Rounded','Pro'];

function startPrice(f) {
  const t = pricing[f.isFamily ? 'family' : 'single'];
  return t.desktop.price;
}

export default function Home() {
  const [preview, setPreview] = useState('');
  const [filter,  setFilter]  = useState('All');

  const filtered = filter === 'All'
    ? fonts
    : fonts.filter(f => f.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())));

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
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          :root {
            --bg:    #000;
            --bg2:   #06060f;
            --blue:  #1b1aff;
            --white: #e8e8ff;
            --t2:    #7888c0;
            --t3:    #4a5488;
            --t4:    #282c52;
            --border:#0e0f28;
          }
          html, body {
            background: var(--bg);
            color: var(--white);
            font-family: 'Space Grotesk', sans-serif;
            -webkit-font-smoothing: antialiased;
          }
          a { text-decoration: none; color: inherit; }
          button { cursor: pointer; }
          ::-webkit-scrollbar { width: 3px; }
          ::-webkit-scrollbar-track { background: var(--bg); }
          ::-webkit-scrollbar-thumb { background: var(--border); }

          /* ── Stats bar ─────────────── */
          .stats-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 2rem;
            height: 44px;
            border-bottom: 1px solid var(--border);
            background: var(--bg2);
          }
          .stats-left {
            font-family: 'Space Mono', monospace;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: .12em;
            text-transform: uppercase;
            color: var(--white);
          }
          .stats-left span {
            color: var(--blue);
          }
          .stats-dots {
            display: flex;
            align-items: center;
            gap: .6rem;
            font-family: 'Space Mono', monospace;
            font-size: 10px;
            color: var(--t3);
            letter-spacing: .08em;
            text-transform: uppercase;
          }
          .stats-dot { color: var(--border); }
          .stats-right {
            font-family: 'Space Mono', monospace;
            font-size: 10px;
            color: var(--t3);
            letter-spacing: .08em;
            text-transform: uppercase;
          }

          /* ── Preview bar ───────────── */
          .preview-bar {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            padding: 0 2rem;
            height: 72px;
            border-bottom: 1px solid var(--border);
            background: var(--bg);
            position: sticky;
            top: 48px;
            z-index: 99;
          }
          .preview-label {
            font-family: 'Space Mono', monospace;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: .12em;
            text-transform: uppercase;
            color: var(--t3);
            flex-shrink: 0;
          }
          .preview-input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            font-family: 'Space Grotesk', sans-serif;
            font-size: 22px;
            color: var(--white);
            caret-color: var(--blue);
          }
          .preview-input::placeholder { color: var(--t4); font-size: 22px; }





          /* ── Font rows ──────────────── */
          .font-row {
            display: grid;
            grid-template-columns: 3rem 1fr 10rem 6rem 10rem;
            align-items: center;
            padding: 0.8rem 2rem;
            min-height: 120px;
            border-bottom: 1px solid var(--border);
            cursor: pointer;
            position: relative;
            overflow: visible;
            gap: 1rem;
            transition: background .15s;
          }
          .font-row::before {
            content: '';
            position: absolute;
            left: 0; top: 0; bottom: 0;
            width: 0;
            background: var(--blue);
            transition: width .2s;
          }
          .font-row:hover::before { width: 3px; }
          .font-row:hover { background: rgba(27,26,255,0.04); }
          .font-row:hover .row-name { color: var(--white); }
          .font-row:hover .row-cta { opacity: 1; transform: translateX(0); }
          .font-row:hover .row-price { color: var(--white); }

          .row-idx {
            font-family: 'Space Mono', monospace;
            font-size: 10px;
            color: var(--t4);
            letter-spacing: .06em;
          }
          .row-name-wrap { min-width: 0; padding-right: 1rem; }
          .row-name {
            font-size: clamp(3rem, 6vw, 5.2rem);
            line-height: 1;
            color: rgba(255,255,255,0.55);
            overflow: visible;
            text-overflow: clip;
            white-space: nowrap;
            transition: color .2s;
          }
          .row-meta {
            display: flex;
            align-items: center;
            gap: .5rem;
            margin-top: .3rem;
          }
          .badge-new {
            font-family: 'Space Mono', monospace;
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
      <div style={{ height: "48px" }} />

      {/* ── Preview bar ── */}
      <div className="preview-bar">
        <span className="preview-label">Preview</span>
        <input
          className="preview-input"
          value={preview}
          onChange={e => setPreview(e.target.value)}
          maxLength={40}
          placeholder="Type to preview all fonts..."
        />
      </div>
        <div className="stats-dots">
          <span>Desktop</span>
          <span className="stats-dot">&middot;</span>
          <span>Web</span>
          <span className="stats-dot">&middot;</span>
          <span>App</span>
          <span className="stats-dot">&middot;</span>
          <span>Broadcast</span>
        </div>
        <div className="stats-right">London &middot; Est. 2024</div>
      </div>

{/* ── Column headers ── */}

      {/* ── Font rows ── */}
      <section id="typefaces" style={{ paddingTop: "0" }}>
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
            <span className="row-styles">{f.styles.length} {f.styles.length === 1 ? 'style' : 'styles'}</span>
            <div className="row-cta-wrap">
              <span className="row-price">from £{startPrice(f)}</span>
              <div style={{ width: '1rem' }} />
              <button className="row-cta">Buy &rarr;</button>
            </div>
          </Link>
        ))}
      </section>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <span className="footer-copy">&copy; 2026 HypeForType</span>
        <div className="footer-links">
          {['Licensing','FAQ','Privacy','Contact'].map(t => (
            <Link key={t} href={'/' + t.toLowerCase()} className="footer-link">{t}</Link>
          ))}
        </div>
        <span className="footer-loc">London &middot; Online</span>
      </footer>
      {/* ── Fixed bottom bar ── */}
      <div className="bottom-bar">
        <div className="bottom-bar-left">
          <span>{fonts.length}</span> Families &nbsp;&middot;&nbsp; <span>400+</span> Weights &nbsp;&middot;&nbsp; Trusted by <span>25,000+</span> Designers
        </div>
        <div className="bottom-bar-mid">
          <span>Desktop</span><span className="bottom-bar-dot">&middot;</span>
          <span>Web</span><span className="bottom-bar-dot">&middot;</span>
          <span>App</span><span className="bottom-bar-dot">&middot;</span>
          <span>Broadcast</span>
        </div>
        <div className="bottom-bar-right">London &middot; Est. 2024</div>
      </div>
      <div className="page-bottom-pad" />
    </>
  );
}
