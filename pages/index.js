import Head from 'next/head';
import Link from 'next/link';
import Nav from '../components/Nav';
import { fonts } from '../lib/fonts';
import { useState, useEffect, useRef } from 'react';

const int = "'Inter', sans-serif";
const det = "'Determination', monospace";
const dd  = "'DigitalDisco', monospace";
const border = '1px solid var(--border)';

const HERO_FONTS = ['Babalove','Headlined','Nanami','Ebisu','Crop','Vow Neue'];
const FILTERS = ['All','Display','Japanese','Handmade','Rounded','Pro'];

export default function Home() {
  const [preview, setPreview]     = useState('');
  const [filter, setFilter]       = useState('All');
  const [heroIdx, setHeroIdx]     = useState(0);
  const [heroText, setHeroText]   = useState('HypeForType');
  const [clock, setClock]         = useState('');
  const [dateStr, setDateStr]     = useState('');
  const [mounted, setMounted]     = useState(false);
  const heroRef = useRef(null);

  // Clock
  useEffect(() => {
    const tick = () => setClock(new Date().toUTCString().split(' ')[4] + ' UTC');
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);

  // Date
  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase());
    setMounted(true);
  }, []);

  // Cycle hero font every 3s
  useEffect(() => {
    const id = setInterval(() => setHeroIdx(i => (i + 1) % HERO_FONTS.length), 3000);
    return () => clearInterval(id);
  }, []);

  const heroFont = HERO_FONTS[heroIdx];
  const heroFontData = fonts.find(f => f.name === heroFont) || fonts[0];

  const filtered = filter === 'All'
    ? fonts
    : fonts.filter(f => f.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())));

  return (
    <>
      <Head>
        <title>HypeForType — Type Foundry</title>
        <meta name="description" content="28 distinctive typefaces for designers, brands, and studios." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {fonts.map(f => f.styles.map(s => (
          <style key={`${f.slug}-${s.file}`}>{`@font-face{font-family:'${f.name}';src:url('/fonts/${f.slug}/${encodeURIComponent(s.file)}');font-weight:${s.weight};font-style:${s.oblique?'italic':'normal'};font-display:swap;}`}</style>
        )))}
        <style>{`
          @keyframes fadeSlide {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .hero-text {
            animation: fadeSlide 0.6s ease forwards;
          }
          .font-cell:hover .cell-desc {
            opacity: 1;
            transform: translateY(0);
          }
          .cell-desc {
            opacity: 0;
            transform: translateY(4px);
            transition: all 0.2s ease;
          }
          .filter-btn {
            background: transparent;
            border: 1px solid #1e1e1e;
            color: #555;
            font-family: 'Inter', sans-serif;
            font-size: 11px;
            font-weight: 500;
            letter-spacing: .06em;
            text-transform: uppercase;
            padding: 6px 14px;
            cursor: pointer;
            transition: all .15s;
          }
          .filter-btn:hover, .filter-btn.active {
            background: var(--blue);
            border-color: var(--blue);
            color: #fff;
          }
          .font-cell {
            border-bottom: ${border};
            cursor: pointer;
            position: relative;
            overflow: hidden;
            display: block;
            text-decoration: none;
            transition: background .12s;
          }
          .font-cell:hover {
            background: #0f0f0f;
          }
          .font-cell.featured {
            grid-column: span 2;
          }
          .fc-name {
            transition: color .15s;
            color: #888;
          }
          .font-cell:hover .fc-name {
            color: var(--white);
          }
        `}</style>
      </Head>

      <Nav />

      {/* HERO */}
      <section ref={heroRef} style={{
        borderBottom: border,
        padding: 'clamp(3rem,8vw,6rem) clamp(1.2rem,4vw,3rem)',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'flex-end',
        gap: '2rem',
        minHeight: 'clamp(240px, 35vw, 420px)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background font name watermark */}
        <div style={{
          position: 'absolute', bottom: '-0.15em', left: '-0.02em',
          fontFamily: `'${heroFont}', monospace`,
          fontSize: 'clamp(8rem,22vw,18rem)',
          lineHeight: 1, color: '#0f0f0f',
          pointerEvents: 'none', userSelect: 'none',
          whiteSpace: 'nowrap', zIndex: 0,
          transition: 'font-family 0.5s ease',
        }} aria-hidden>
          {heroText || 'HypeForType'}
        </div>

        {/* Foreground text */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.2rem' }}>
            <span style={{ fontFamily:dd, fontSize:'10px', color:'#2a2a2a', letterSpacing:'.2em', textTransform:'uppercase' }}>
              {heroFontData.idx}
            </span>
            {heroFontData.hot && (
              <span style={{ fontFamily:int, fontSize:'10px', fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', padding:'2px 7px', border:'1px solid var(--blue-brd)', color:'var(--blue)', background:'var(--blue-dim)' }}>New</span>
            )}
          </div>
          <h1 key={heroFont} className="hero-text" style={{
            fontFamily: `'${heroFont}', monospace`,
            fontSize: 'clamp(3.5rem,10vw,8.5rem)',
            lineHeight: .95,
            color: 'var(--white)',
            letterSpacing: '-.01em',
            marginBottom: '1.5rem',
          }}>
            {heroText || heroFont}
          </h1>
          <p style={{ fontFamily:int, fontSize:'13px', color:'#444', maxWidth:'38ch', lineHeight:1.6, marginBottom:'2rem' }}>
            {heroFontData.description}
          </p>
          <div style={{ display:'flex', gap:'.8rem', alignItems:'center', flexWrap:'wrap' }}>
            <Link href={`/typefaces/${heroFontData.slug}`} style={{
              fontFamily:int, fontSize:'12px', fontWeight:600,
              letterSpacing:'.06em', textTransform:'uppercase',
              background:'var(--white)', color:'#0c0c0c',
              padding:'10px 22px', display:'inline-block',
              transition:'opacity .15s',
            }}
              onMouseEnter={e=>e.target.style.opacity='.85'}
              onMouseLeave={e=>e.target.style.opacity='1'}>
              View {heroFont} →
            </Link>
            <span style={{ fontFamily:int, fontSize:'11px', color:'#333' }}>
              {heroFontData.styles.length} {heroFontData.styles.length === 1 ? 'style' : 'styles'} · {heroFontData.tags.join(', ')}
            </span>
          </div>
        </div>

        {/* Right — preview input */}
        <div style={{ position:'relative', zIndex:1, textAlign:'right' }}>
          <div style={{ fontFamily:int, fontSize:'11px', color:'#333', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:'.5rem' }}>
            Type to preview
          </div>
          <input
            value={heroText}
            onChange={e => setHeroText(e.target.value)}
            maxLength={20}
            placeholder={heroFont}
            style={{
              background:'transparent', border:'none', borderBottom:'1px solid #2a2a2a',
              outline:'none', color:'var(--white)', textAlign:'right',
              fontFamily:int, fontSize:'13px', width:'180px',
              caretColor:'var(--blue)', paddingBottom:'4px',
            }}
          />
        </div>
      </section>

      {/* TICKER + FILTER ROW */}
      <div style={{ borderBottom:border, display:'flex', alignItems:'stretch', justifyContent:'space-between', background:'var(--bg2)' }}>
        <div style={{ padding:'8px 1.4rem', display:'flex', alignItems:'center', gap:'1rem', overflow:'hidden', flex:1 }}>
          <span style={{ fontFamily:int, fontSize:'11px', color:'#333', letterSpacing:'.06em', textTransform:'uppercase', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            28 Typefaces — Desktop · Web · App · Broadcast — PayPal Secure
          </span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 1.4rem', borderLeft:border, flexShrink:0 }}>
          {FILTERS.map(f => (
            <button key={f} className={`filter-btn${filter===f?' active':''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <div style={{ borderLeft:border, padding:'8px 1.4rem', display:'flex', alignItems:'center', flexShrink:0 }}>
          <span style={{ fontFamily:dd, fontSize:'11px', color:'#2e2e2e', letterSpacing:'.1em' }}>{clock}</span>
        </div>
      </div>

      {/* PREVIEW BAR */}
      <div style={{ background:'var(--bg)', borderBottom:'1px solid var(--blue-brd)', padding:'.8rem 1.4rem', display:'flex', alignItems:'center', gap:'1rem' }}>
        <span style={{ fontFamily:int, fontSize:'12px', fontWeight:500, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--blue)', opacity:.8, whiteSpace:'nowrap', flexShrink:0 }}>
          Preview all →
        </span>
        <input
          value={preview} onChange={e=>setPreview(e.target.value)} maxLength={40}
          placeholder="Type anything to preview every font at once..."
          style={{ background:'transparent', border:'none', outline:'none', color:'var(--white)', fontFamily:det, fontSize:'1.4rem', width:'100%', caretColor:'var(--blue)', minWidth:0 }}
        />
      </div>

      {/* GRID HEADER */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderBottom:border }}>
        <div style={{ fontFamily:int, fontSize:'11px', fontWeight:500, letterSpacing:'.08em', textTransform:'uppercase', color:'#333', padding:'8px 1.2rem', borderRight:border, display:'flex', justifyContent:'space-between' }}>
          <span>Typeface</span>
          <span>{filtered.length} {filter !== 'All' ? filter : 'total'}</span>
        </div>
        <div style={{ fontFamily:int, fontSize:'11px', fontWeight:500, letterSpacing:'.08em', textTransform:'uppercase', color:'#333', padding:'8px 1.2rem', display:'flex', justifyContent:'space-between' }}>
          <span>Category · Styles</span>
          <span>A → Z</span>
        </div>
      </div>

      {/* FONT GRID */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)' }}>
        {filtered.map((f, i) => {
          const isFeatured = (f.hot || f.pro) && i < 6;
          return (
            <Link key={f.slug} href={`/typefaces/${f.slug}`}
              className={`font-cell${isFeatured ? ' featured' : ''}`}
              style={{ borderRight: !isFeatured && i%2===0 ? border : 'none' }}>

              {/* Top meta row */}
              <div style={{ padding:'6px 1.2rem 5px', borderBottom:'1px solid #121212', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontFamily:dd, fontSize:'10px', color:'#2a2a2a', letterSpacing:'.1em' }}>{f.idx}</span>
                <div style={{ display:'flex', gap:4 }}>
                  {f.hot && <span style={{ fontFamily:int, fontSize:'10px', fontWeight:600, letterSpacing:'.05em', textTransform:'uppercase', padding:'2px 6px', border:'1px solid var(--blue-brd)', color:'var(--blue)', background:'var(--blue-dim)' }}>New</span>}
                  {f.pro && <span style={{ fontFamily:int, fontSize:'10px', fontWeight:600, letterSpacing:'.05em', textTransform:'uppercase', padding:'2px 6px', border:'1px solid #252525', color:'#484848' }}>Pro</span>}
                </div>
              </div>

              {/* Font name + meta */}
              <div style={{ padding: isFeatured ? 'clamp(1.2rem,3vw,2rem) 1.2rem clamp(1rem,2.5vw,1.8rem)' : 'clamp(.6rem,1.8vw,1rem) 1.2rem clamp(.5rem,1.5vw,.9rem)', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                <div style={{ flex:1, minWidth:0, paddingRight:'1rem' }}>
                  <div className="fc-name" style={{
                    fontFamily: `'${f.name}', monospace`,
                    fontSize: isFeatured ? 'clamp(2.8rem,6vw,5.5rem)' : 'clamp(1.9rem,4.2vw,3.6rem)',
                    lineHeight: .95,
                    letterSpacing: '-.01em',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                  }}>
                    {preview.trim() || f.name}
                  </div>
                  {/* Description fades in on hover */}
                  {isFeatured && (
                    <p className="cell-desc" style={{ fontFamily:int, fontSize:'12px', color:'#3a3a3a', lineHeight:1.6, marginTop:'.8rem', maxWidth:'50ch' }}>
                      {f.description}
                    </p>
                  )}
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <span style={{ display:'block', fontFamily:int, fontSize:'11px', fontWeight:500, color:'#333', letterSpacing:'.04em', textTransform:'uppercase', lineHeight:2 }}>{f.tags.join(' · ')}</span>
                  <span style={{ display:'block', fontFamily:int, fontSize:'11px', color:'#2a2a2a', letterSpacing:'.04em', textTransform:'uppercase' }}>{f.styles.length} {f.styles.length===1?'style':'styles'}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* DATA STRIP */}
      <div style={{ borderTop:border, padding:'10px 1.4rem', display:'flex', gap:'2.5rem', background:'var(--bg2)', flexWrap:'wrap', alignItems:'center' }}>
        {[['Typefaces','28'],['Updated', mounted ? dateStr : ''],['Licenses','Desktop · Web · App · Broadcast'],['Payments','PayPal Secure']].map(([l,v])=>(
          <div key={l} style={{ display:'flex', gap:8, alignItems:'center' }}>
            <span style={{ fontFamily:int, fontSize:'11px', fontWeight:500, color:'#2e2e2e', letterSpacing:'.08em', textTransform:'uppercase' }}>{l}</span>
            <span style={{ fontFamily:int, fontSize:'12px', color:'#404040' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop:border, display:'grid', gridTemplateColumns:'1fr auto 1fr', background:'var(--bg2)' }}>
        <span style={{ fontFamily:int, fontSize:'11px', color:'#2e2e2e', letterSpacing:'.06em', textTransform:'uppercase', padding:'1.1rem 1.4rem' }}>
          © 2026 HypeForType — All rights reserved
        </span>
        <div style={{ borderLeft:border, borderRight:border, display:'flex', gap:'1.8rem', alignItems:'center', padding:'1.1rem 1.8rem', flexWrap:'wrap' }}>
          {['Licensing','FAQ','Privacy','Contact'].map(t=>(
            <Link key={t} href={'/'+t.toLowerCase()}
              style={{ fontFamily:int, fontSize:'11px', fontWeight:500, color:'#383838', letterSpacing:'.08em', textTransform:'uppercase', transition:'color .12s' }}
              onMouseEnter={e=>e.target.style.color='var(--white)'}
              onMouseLeave={e=>e.target.style.color='#383838'}>
              {t}
            </Link>
          ))}
        </div>
        <span style={{ fontFamily:int, fontSize:'11px', color:'#2e2e2e', letterSpacing:'.06em', textTransform:'uppercase', padding:'1.1rem 1.4rem', textAlign:'right' }}>
          London · Online
        </span>
      </footer>
    </>
  );
}
