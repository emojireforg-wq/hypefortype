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
      </Head>

      <Nav />

      {/* STATUS BAR */}
      <div style={{ background:'var(--bg2)', borderBottom:border, padding:'4px 1.2rem', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'1rem', overflow:'hidden' }}>
        <span style={{ fontFamily:dd, fontSize:'clamp(.28rem,.7vw,.42rem)', letterSpacing:'.16em', textTransform:'uppercase', color:'#2e2e2e', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          28 Typefaces — Desktop · Web · App · Broadcast Licenses — Secure Checkout via PayPal
        </span>
        <span style={{ fontFamily:dd, fontSize:'clamp(.28rem,.7vw,.42rem)', letterSpacing:'.16em', textTransform:'uppercase', color:'#2e2e2e', whiteSpace:'nowrap' }}>{clock}</span>
      </div>

      {/* PREVIEW BAR */}
      <div style={{ background:'var(--bg)', borderBottom:'1px solid var(--blue-brd)', padding:'clamp(.7rem,2vw,1.1rem) 1.2rem', display:'flex', alignItems:'center', gap:'.8rem' }}>
        <span style={{ fontFamily:dd, fontSize:'clamp(.32rem,.8vw,.46rem)', letterSpacing:'.2em', textTransform:'uppercase', color:'var(--blue)', opacity:.55, whiteSpace:'nowrap', flexShrink:0 }}>Preview →</span>
        <input
          value={preview} onChange={e=>setPreview(e.target.value)} maxLength={40}
          placeholder="Type anything to preview all fonts..."
          style={{ background:'transparent', border:'none', outline:'none', color:'var(--white)', fontFamily:det, fontSize:sz+'rem', width:'100%', caretColor:'var(--blue)', minWidth:0 }}
        />
        <div style={{ display:'flex', gap:3, flexShrink:0 }}>
          {['A−','A+'].map((l,i)=>(
            <button key={l} onClick={()=>setSz(s=>Math.max(.7,Math.min(5,s+(i?+.3:-.3))))} style={{ fontFamily:dd, fontSize:'clamp(.32rem,.8vw,.46rem)', color:'var(--dim)', border:border, padding:'3px 7px', background:'transparent', letterSpacing:'.1em', transition:'all .12s' }}
              onMouseEnter={e=>{e.target.style.color='var(--white)';e.target.style.borderColor='var(--blue)'}} onMouseLeave={e=>{e.target.style.color='var(--dim)';e.target.style.borderColor='var(--border)'}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* GRID HEADER */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderBottom:border }}>
        {['Typeface · A → Z','Typeface · Series'].map((t,i)=>(
          <div key={i} style={{ fontFamily:dd, fontSize:'clamp(.28rem,.7vw,.4rem)', letterSpacing:'.2em', textTransform:'uppercase', color:'#2c2c2c', padding:'5px 1rem', display:'flex', justifyContent:'space-between', borderRight:i===0?border:'none' }}>
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
            <div style={{ padding:'4px .9rem 3px', borderBottom:'1px solid #141414', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontFamily:dd, fontSize:'clamp(.26rem,.65vw,.36rem)', color:'#272727', letterSpacing:'.12em' }}>{f.idx}</span>
              <div style={{ display:'flex', gap:3 }}>
                {f.hot && <span style={{ fontFamily:dd, fontSize:'clamp(.24rem,.6vw,.34rem)', letterSpacing:'.08em', textTransform:'uppercase', padding:'1px 4px', border:'1px solid var(--blue-brd)', color:'var(--blue)', background:'var(--blue-dim)' }}>New</span>}
                {f.pro && <span style={{ fontFamily:dd, fontSize:'clamp(.24rem,.6vw,.34rem)', letterSpacing:'.08em', textTransform:'uppercase', padding:'1px 4px', border:'1px solid #2e2e2e', color:'#424242' }}>Pro</span>}
              </div>
            </div>
            <div style={{ padding:'clamp(.45rem,1.5vw,.7rem) .9rem clamp(.4rem,1.2vw,.65rem)', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
              <div className="fc-name" style={{ fontFamily:`'${f.name}', monospace`, fontSize:'clamp(.95rem,2.2vw,1.85rem)', lineHeight:1, color:'#aaa', letterSpacing:'.02em', flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', paddingRight:'.5rem', transition:'color .1s' }}>
                {preview.trim() || f.name}
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <span style={{ display:'block', fontFamily:dd, fontSize:'clamp(.24rem,.6vw,.34rem)', color:'#2a2a2a', letterSpacing:'.1em', textTransform:'uppercase', lineHeight:1.9 }}>{f.tags.join(' · ')}</span>
                <span style={{ display:'block', fontFamily:dd, fontSize:'clamp(.24rem,.6vw,.34rem)', color:'#232323', letterSpacing:'.1em', textTransform:'uppercase' }}>{f.styles.length} {f.styles.length===1?'style':'styles'}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* DATA STRIP */}
      <div style={{ borderTop:border, padding:'5px 1.2rem', display:'flex', gap:'2rem', background:'var(--bg2)', flexWrap:'wrap' }}>
        {[['Typefaces','28'],['Families','Headlined · Nanami · BAQ · Yuki'],['Updated',dateStr],['Payments','PayPal Secure']].map(([l,v])=>(
          <div key={l} style={{ display:'flex', gap:5, alignItems:'center' }}>
            <span style={{ fontFamily:dd, fontSize:'clamp(.24rem,.6vw,.34rem)', color:'#272727', letterSpacing:'.12em', textTransform:'uppercase' }}>{l}</span>
            <span style={{ fontFamily:det, fontSize:'clamp(.28rem,.7vw,.4rem)', color:'#404040', letterSpacing:'.04em' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop:border, display:'grid', gridTemplateColumns:'1fr auto 1fr', background:'var(--bg2)' }}>
        <span style={{ fontFamily:dd, fontSize:'clamp(.24rem,.65vw,.36rem)', color:'#272727', letterSpacing:'.12em', textTransform:'uppercase', padding:'.8rem 1rem' }}>© 2026 HypeForType — All rights reserved</span>
        <div style={{ borderLeft:border, borderRight:border, display:'flex', gap:'1rem', alignItems:'center', padding:'.8rem 1.2rem', flexWrap:'wrap' }}>
          {['Licensing','FAQ','Privacy','Contact'].map(t=>(
            <Link key={t} href={'/'+t.toLowerCase()} style={{ fontFamily:dd, fontSize:'clamp(.24rem,.65vw,.36rem)', color:'#2e2e2e', letterSpacing:'.14em', textTransform:'uppercase', transition:'color .12s' }}
              onMouseEnter={e=>e.target.style.color='var(--blue)'} onMouseLeave={e=>e.target.style.color='#2e2e2e'}>
              {t}
            </Link>
          ))}
        </div>
        <span style={{ fontFamily:dd, fontSize:'clamp(.24rem,.65vw,.36rem)', color:'#272727', letterSpacing:'.12em', textTransform:'uppercase', padding:'.8rem 1rem', textAlign:'right' }}>London · Online</span>
      </footer>
    </>
  );
}
