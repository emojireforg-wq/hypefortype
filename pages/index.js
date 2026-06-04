import Head from 'next/head';
import Link from 'next/link';
import Nav from '../components/Nav';
import { fonts } from '../lib/fonts';
import { useState, useEffect } from 'react';

const dd = "'DigitalDisco', monospace";
const det = "'Determination', monospace";
const border = '1px solid var(--border)';

export default function Home() {
  const [preview, setPreview] = useState('');
  const [sz, setSz] = useState(2);
  const [clock, setClock] = useState('');
  const [dateStr, setDateStr] = useState('');
  const accentSet = new Set([0,4,9,13,16,19,22,25]);

  useEffect(() => {
    const tick = () => setClock(new Date().toUTCString().split(' ')[4] + ' GMT');
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase());
  }, []);

  return (
    <>
      <Head>
        <title>HypeForType — Type Foundry</title>
        <meta name="description" content="28 distinctive typefaces for designers, brands, and studios. Desktop, Web, App and Broadcast licenses." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {fonts.map(f => f.styles.map(s => (
          <style key={`${f.slug}-${s.file}`}>{`@font-face{font-family:'${f.name}';src:url('/fonts/${f.slug}/${encodeURIComponent(s.file)}');font-weight:${s.weight};font-style:${s.oblique?'italic':'normal'};font-display:swap;}`}</style>
        )))}
      </Head>

      <Nav />

      {/* STATUS BAR */}
      <div style={{ background:'var(--bg2)', borderBottom:border, padding:'6px 1.2rem', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'1rem', overflow:'hidden' }}>
        <span style={{ fontFamily:dd, fontSize:'11px', letterSpacing:'.12em', textTransform:'uppercase', color:'#3a3a3a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          28 Typefaces — Desktop · Web · App · Broadcast Licenses — Secure Checkout via PayPal
        </span>
        <span style={{ fontFamily:dd, fontSize:'11px', letterSpacing:'.12em', textTransform:'uppercase', color:'#3a3a3a', whiteSpace:'nowrap' }}>{clock}</span>
      </div>

      {/* PREVIEW BAR */}
      <div style={{ background:'var(--bg)', borderBottom:'1px solid var(--blue-brd)', padding:'clamp(.9rem,2.5vw,1.4rem) 1.2rem', display:'flex', alignItems:'center', gap:'1rem' }}>
        <span style={{ fontFamily:dd, fontSize:'12px', letterSpacing:'.2em', textTransform:'uppercase', color:'var(--blue)', opacity:.7, whiteSpace:'nowrap', flexShrink:0 }}>Preview →</span>
        <input
          value={preview} onChange={e=>setPreview(e.target.value)} maxLength={40}
          placeholder="Type anything to preview all fonts..."
          style={{ background:'transparent', border:'none', outline:'none', color:'var(--white)', fontFamily:det, fontSize:sz+'rem', width:'100%', caretColor:'var(--blue)', minWidth:0 }}
        />
        <div style={{ display:'flex', gap:4, flexShrink:0 }}>
          {['A−','A+'].map((l,i)=>(
            <button key={l} onClick={()=>setSz(s=>Math.max(.7,Math.min(5,s+(i?+.3:-.3))))} style={{ fontFamily:dd, fontSize:'11px', color:'var(--dim)', border:border, padding:'4px 9px', background:'transparent', letterSpacing:'.1em', transition:'all .12s' }}
              onMouseEnter={e=>{e.target.style.color='var(--white)';e.target.style.borderColor='var(--blue)'}} onMouseLeave={e=>{e.target.style.color='var(--dim)';e.target.style.borderColor='var(--border)'}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* GRID HEADER */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderBottom:border }}>
        {['Typeface · A → Z','Typeface · Series'].map((t,i)=>(
          <div key={i} style={{ fontFamily:dd, fontSize:'11px', letterSpacing:'.16em', textTransform:'uppercase', color:'#363636', padding:'7px 1rem', display:'flex', justifyContent:'space-between', borderRight:i===0?border:'none' }}>
            <span>{t.split(' · ')[0]}</span><span>{t.split(' · ')[1]}</span>
          </div>
        ))}
      </div>

      {/* FONT GRID */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)' }}>
        {fonts.map((f, i) => (
          <Link key={f.slug} href={`/typefaces/${f.slug}`}
            style={{ borderBottom:border, borderRight:i%2===0?border:'none', padding:0, cursor:'pointer', position:'relative', overflow:'hidden', display:'block', textDecoration:'none', borderLeft:accentSet.has(i)?'2px solid rgba(68,85,255,0.45)':'none' }}
            onMouseEnter={e=>{e.currentTarget.style.background='#111';e.currentTarget.querySelector('.fc-name').style.color='var(--white)'}}
            onMouseLeave={e=>{e.currentTarget.style.background='var(--bg)';e.currentTarget.querySelector('.fc-name').style.color='#aaa'}}>
            <div style={{ padding:'5px .9rem 4px', borderBottom:'1px solid #141414', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontFamily:dd, fontSize:'11px', color:'#333', letterSpacing:'.1em' }}>{f.idx}</span>
              <div style={{ display:'flex', gap:4 }}>
                {f.hot && <span style={{ fontFamily:dd, fontSize:'10px', letterSpacing:'.08em', textTransform:'uppercase', padding:'2px 5px', border:'1px solid var(--blue-brd)', color:'var(--blue)', background:'var(--blue-dim)' }}>New</span>}
                {f.pro && <span style={{ fontFamily:dd, fontSize:'10px', letterSpacing:'.08em', textTransform:'uppercase', padding:'2px 5px', border:'1px solid #2e2e2e', color:'#424242' }}>Pro</span>}
              </div>
            </div>
            <div style={{ padding:'clamp(.6rem,1.8vw,.95rem) .9rem clamp(.5rem,1.5vw,.8rem)', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
              <div className="fc-name" style={{ fontFamily:`'${f.name}', monospace`, fontSize:'clamp(1.9rem,4.2vw,3.6rem)', lineHeight:1, color:'#aaa', letterSpacing:'.02em', flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', paddingRight:'.5rem', transition:'color .1s' }}>
                {preview.trim() || f.name}
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <span style={{ display:'block', fontFamily:dd, fontSize:'11px', color:'#333', letterSpacing:'.1em', textTransform:'uppercase', lineHeight:2 }}>{f.tags.join(' · ')}</span>
                <span style={{ display:'block', fontFamily:dd, fontSize:'11px', color:'#2d2d2d', letterSpacing:'.1em', textTransform:'uppercase' }}>{f.styles.length} {f.styles.length===1?'style':'styles'}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* DATA STRIP */}
      <div style={{ borderTop:border, padding:'7px 1.2rem', display:'flex', gap:'2rem', background:'var(--bg2)', flexWrap:'wrap' }}>
        {[['Typefaces','28'],['Families','Headlined · Nanami · BAQ · Yuki'],['Updated',dateStr],['Payments','PayPal Secure']].map(([l,v])=>(
          <div key={l} style={{ display:'flex', gap:6, alignItems:'center' }}>
            <span style={{ fontFamily:dd, fontSize:'11px', color:'#333', letterSpacing:'.12em', textTransform:'uppercase' }}>{l}</span>
            <span style={{ fontFamily:det, fontSize:'12px', color:'#484848', letterSpacing:'.04em' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop:border, display:'grid', gridTemplateColumns:'1fr auto 1fr', background:'var(--bg2)' }}>
        <span style={{ fontFamily:dd, fontSize:'11px', color:'#333', letterSpacing:'.12em', textTransform:'uppercase', padding:'1rem 1.2rem' }}>© 2026 HypeForType — All rights reserved</span>
        <div style={{ borderLeft:border, borderRight:border, display:'flex', gap:'1.5rem', alignItems:'center', padding:'1rem 1.4rem', flexWrap:'wrap' }}>
          {['Licensing','FAQ','Privacy','Contact'].map(t=>(
            <Link key={t} href={'/'+t.toLowerCase()} style={{ fontFamily:dd, fontSize:'11px', color:'#3a3a3a', letterSpacing:'.14em', textTransform:'uppercase', transition:'color .12s' }}
              onMouseEnter={e=>e.target.style.color='var(--blue)'} onMouseLeave={e=>e.target.style.color='#3a3a3a'}>
              {t}
            </Link>
          ))}
        </div>
        <span style={{ fontFamily:dd, fontSize:'11px', color:'#333', letterSpacing:'.12em', textTransform:'uppercase', padding:'1rem 1.2rem', textAlign:'right' }}>London · Online</span>
      </footer>
    </>
  );
}
