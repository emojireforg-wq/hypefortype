import Head from 'next/head';
import Link from 'next/link';
import { fonts, pricing } from '../../lib/fonts';
import { useState, useRef, useEffect } from 'react';
import Script from 'next/script';

const dd = "'DigitalDisco', monospace";
const det = "'Determination', monospace";
const border = '1px solid var(--border)';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

const glyphSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  lowercase: 'abcdefghijklmnopqrstuvwxyz'.split(''),
  numerals:  '0123456789'.split(''),
  punctuation: '.,;:!?\'"-—…()[]{}«»/\\@#$%&*'.split(''),
  accents: 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖØÙÚÛÜÝàáâãäåæçèéêëìíîïñòóôõöøùúûüý'.split(''),
};

export default function FontPage({ font }) {
  const [activeStyle, setActiveStyle] = useState(0);
  const [previewText, setPreviewText] = useState('');
  const [heroSize, setHeroSize] = useState(9);
  const [selectedLicense, setSelectedLicense] = useState('desktop');
  const [glyphSet, setGlyphSet] = useState('uppercase');
  const [paypalReady, setPaypalReady] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const paypalRef = useRef(null);
  const tiers = pricing[font.isFamily ? 'family' : 'single'];

  const displayText = previewText.trim() || font.name;
  const fontFamily = `'${font.name}', monospace`;

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
        if (result.success) {
          setDownloadUrl(result.downloadUrl);
          window.location.href = `/download?token=${result.token}`;
        }
        setPurchasing(false);
      },
      style: { layout:'horizontal', color:'black', shape:'rect', label:'buynow', height:40, tagline:false },
    }).render(paypalRef.current);
  }, [paypalReady, selectedLicense, font]);

  return (
    <>
      <Head>
        <title>{font.name} — HypeForType</title>
        <meta name="description" content={font.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Embed actual font files from /public/fonts/ */}
        {font.styles.map(s => (
          <style key={s.file}>{`@font-face{font-family:'${font.name}';src:url('/fonts/${font.slug}/${s.file}');font-weight:${s.weight};font-style:${s.oblique?'italic':'normal'};font-display:swap;}`}</style>
        ))}
      </Head>

      <Script src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=GBP`} onReady={() => setPaypalReady(true)} />

      {/* TOP NAV */}
      <nav style={{ display:'grid', gridTemplateColumns:'auto 1fr auto', alignItems:'stretch', borderBottom:border, background:'var(--bg)', position:'sticky', top:0, zIndex:200 }}>
        <Link href="/" style={{ fontFamily:det, fontSize:'clamp(.65rem,2vw,.9rem)', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--white)', padding:'.7rem 1.2rem', borderRight:border, display:'flex', alignItems:'center' }}>HypeForType</Link>
        <div style={{ fontFamily:dd, fontSize:'.44rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--dim)', padding:'0 1.2rem', display:'flex', alignItems:'center', gap:'.5rem' }}>
          <Link href="/" style={{ color:'#333' }}>← All Typefaces</Link>
          <span style={{ color:'#1e1e1e' }}>/</span>
          <span style={{ color:'#555' }}>{font.name}</span>
        </div>
        <div style={{ display:'flex', alignItems:'stretch', borderLeft:border }}>
          <button onClick={() => window.location.href=`/api/trial?slug=${font.slug}`} style={{ fontFamily:dd, fontSize:'.44rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--dim)', padding:'0 1rem', border:'none', background:'transparent', borderRight:border, transition:'color .12s' }}
            onMouseEnter={e=>e.target.style.color='var(--white)'} onMouseLeave={e=>e.target.style.color='var(--dim)'}>
            Trial font
          </button>
          <button onClick={()=>document.getElementById('buy').scrollIntoView({behavior:'smooth'})} style={{ fontFamily:det, fontSize:'clamp(.44rem,1.2vw,.58rem)', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--white)', background:'var(--blue)', border:'none', padding:'0 1.4rem', transition:'opacity .15s' }}
            onMouseEnter={e=>e.target.style.opacity='.85'} onMouseLeave={e=>e.target.style.opacity='1'}>
            Buy {font.name}
          </button>
        </div>
      </nav>

      {/* STICKY SECTION NAV */}
      <div style={{ borderBottom:border, display:'flex', alignItems:'stretch', position:'sticky', top:'37px', zIndex:190, background:'var(--bg)' }}>
        {[['#styles','Styles'],['#try','Try'],['#info','Info'],['#buy','Buy'],['#glyphs','Glyphs']].map(([href,label])=>(
          <a key={href} href={href} style={{ fontFamily:dd, fontSize:'.42rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--dim)', padding:'.5rem 1.2rem', borderRight:border, textDecoration:'none', display:'flex', alignItems:'center', transition:'color .12s' }}
            onMouseEnter={e=>e.target.style.color='var(--white)'} onMouseLeave={e=>e.target.style.color='var(--dim)'}>{label}</a>
        ))}
        <div style={{ marginLeft:'auto', fontFamily:dd, fontSize:'.42rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--dim)', padding:'0 1.2rem', display:'flex', alignItems:'center', borderLeft:border }}>
          {font.styles.length} {font.styles.length===1?'style':'styles'}
        </div>
      </div>

      {/* HERO — giant editable type */}
      <div style={{ borderBottom:border }}>
        <div
          contentEditable suppressContentEditableWarning
          onInput={e => setPreviewText(e.currentTarget.textContent)}
          style={{ fontFamily, fontSize:heroSize+'rem', fontWeight:font.styles[activeStyle]?.weight||'400', lineHeight:.88, color:'var(--white)', padding:'1.5rem 1.2rem .8rem', background:'transparent', outline:'none', width:'100%', caretColor:'var(--blue)', letterSpacing:'-.02em', display:'block', minHeight:'6rem', wordBreak:'break-word' }}>
          {font.name}
        </div>
        <div style={{ borderTop:border, padding:'.5rem 1.2rem', display:'flex', alignItems:'center', gap:'1.5rem', flexWrap:'wrap' }}>
          {font.tags.map(t=><span key={t} style={{ fontFamily:dd, fontSize:'.38rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--dim)' }}>{t}</span>)}
          <div style={{ width:1, height:12, background:'var(--border)' }}/>
          <span style={{ fontFamily:dd, fontSize:'.38rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--blue)', opacity:.7 }}>{font.styles.length} {font.styles.length===1?'style':'styles'}</span>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'.5rem' }}>
            <span style={{ fontFamily:dd, fontSize:'.36rem', letterSpacing:'.1em', color:'#2a2a2a' }}>{Math.round(heroSize*8.5)}pt</span>
            {['A−','A+'].map((l,i)=>(
              <button key={l} onClick={()=>setHeroSize(s=>Math.max(2,Math.min(18,s+(i?1.5:-1.5))))} style={{ fontFamily:dd, fontSize:'.38rem', color:'var(--dim)', border:border, padding:'2px 6px', background:'transparent', transition:'all .12s' }}
                onMouseEnter={e=>{e.target.style.color='var(--white)';e.target.style.borderColor='var(--blue)'}} onMouseLeave={e=>{e.target.style.color='var(--dim)';e.target.style.borderColor='var(--border)'}}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STYLES / WEIGHTS */}
      <div id="styles">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:border, padding:'.45rem 1.2rem' }}>
          <span style={{ fontFamily:dd, fontSize:'.4rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--dim)' }}>Weights &amp; Styles</span>
          <span style={{ fontFamily:dd, fontSize:'.38rem', letterSpacing:'.12em', textTransform:'uppercase', color:'#2a2a2a' }}>Click to activate</span>
        </div>
        {font.styles.map((s, i) => (
          <div key={i} onClick={()=>setActiveStyle(i)}
            style={{ borderBottom:border, display:'grid', gridTemplateColumns:'130px 1fr auto', alignItems:'center', cursor:'pointer', background:activeStyle===i?'#0f0f14':'var(--bg)', transition:'background .1s' }}
            onMouseEnter={e=>{ if(activeStyle!==i) e.currentTarget.style.background='#111'; }} onMouseLeave={e=>{ e.currentTarget.style.background=activeStyle===i?'#0f0f14':'var(--bg)'; }}>
            <div style={{ padding:'.8rem 1.2rem', borderRight:border, display:'flex', flexDirection:'column', gap:4 }}>
              <span style={{ fontFamily:dd, fontSize:'.38rem', letterSpacing:'.14em', textTransform:'uppercase', color:activeStyle===i?'var(--white)':'var(--dim)' }}>{s.name}</span>
              <span style={{ fontFamily:dd, fontSize:'.32rem', letterSpacing:'.1em', color:'#2a2a2a' }}>{s.weight}</span>
            </div>
            <div style={{ padding:'.8rem 1.4rem', fontFamily, fontSize:'clamp(1.2rem,2.5vw,2rem)', fontWeight:s.weight, fontStyle:s.oblique?'italic':'normal', lineHeight:1, color:activeStyle===i?'var(--white)':'#666', overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis', transition:'color .1s' }}>
              {displayText}
            </div>
            <div style={{ padding:'.8rem 1.2rem', borderLeft:border, display:'flex', alignItems:'center' }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:activeStyle===i?'var(--blue)':'var(--border)' }}/>
            </div>
          </div>
        ))}
      </div>

      {/* TRY — multi-size tester */}
      <div id="try">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:border, borderTop:border, padding:'.45rem 1.2rem' }}>
          <span style={{ fontFamily:dd, fontSize:'.4rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--dim)' }}>Type Tester</span>
          <span style={{ fontFamily:dd, fontSize:'.38rem', letterSpacing:'.12em', textTransform:'uppercase', color:'#2a2a2a' }}>Click any field and type</span>
        </div>
        {[{name:'Display',size:'3rem',pt:'72pt'},{name:'Headline',size:'1.8rem',pt:'36pt'},{name:'Body',size:'1rem',pt:'14pt'}].map(t=>(
          <div key={t.name} style={{ borderBottom:border, display:'grid', gridTemplateColumns:'130px 1fr' }}>
            <div style={{ padding:'.7rem 1.2rem', borderRight:border, display:'flex', flexDirection:'column', justifyContent:'center', gap:3 }}>
              <span style={{ fontFamily:dd, fontSize:'.36rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--dim)' }}>{t.name}</span>
              <span style={{ fontFamily:dd, fontSize:'.32rem', letterSpacing:'.1em', color:'#2a2a2a' }}>{t.pt}</span>
            </div>
            <input type="text" placeholder={`Type to test ${font.name} at ${t.pt}...`}
              style={{ background:'transparent', border:'none', outline:'none', color:'var(--white)', fontFamily, fontSize:t.size, fontWeight:font.styles[activeStyle]?.weight||'400', padding:'.7rem 1.2rem', width:'100%', caretColor:'var(--blue)' }}/>
          </div>
        ))}
      </div>

      {/* INFO */}
      <div id="info">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:border, borderTop:border, padding:'.45rem 1.2rem' }}>
          <span style={{ fontFamily:dd, fontSize:'.4rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--dim)' }}>About {font.name}</span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderBottom:border }}>
          <div style={{ padding:'1.4rem 1.2rem', borderRight:border }}>
            <p style={{ fontFamily:dd, fontSize:'.52rem', lineHeight:1.9, color:'#555', letterSpacing:'.04em' }}>{font.description}</p>
          </div>
          <div style={{ padding:'1.4rem 1.2rem' }}>
            {[['Designer','HypeForType'],['Styles',`${font.styles.length} ${font.styles.length===1?'style':'styles'}`],['Format','OTF · TTF · WOFF2'],['Glyphs',font.glyphCount.toLocaleString()],['OpenType',font.opentype],['Languages',font.languages],['Released',font.released]].map(([l,v])=>(
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'.35rem 0', borderBottom:'1px solid #111' }}>
                <span style={{ fontFamily:dd, fontSize:'.36rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#2a2a2a' }}>{l}</span>
                <span style={{ fontFamily:dd, fontSize:'.38rem', letterSpacing:'.08em', color:'var(--dim)' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BUY */}
      <div id="buy">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:border, borderTop:border, padding:'.45rem 1.2rem' }}>
          <span style={{ fontFamily:dd, fontSize:'.4rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--dim)' }}>Licensing</span>
          <span style={{ fontFamily:dd, fontSize:'.38rem', letterSpacing:'.12em', textTransform:'uppercase', color:'#2a2a2a' }}>Select a license type</span>
        </div>
        <div style={{ padding:'1.4rem 1.2rem' }}>
          {/* License tier selector */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:1, background:'var(--border)', marginBottom:'1.2rem' }}>
            {Object.entries(tiers).map(([key, tier]) => (
              <div key={key} onClick={()=>setSelectedLicense(key)} style={{ background:selectedLicense===key?'#0f0f14':'var(--bg)', padding:'1rem .8rem', cursor:'pointer', display:'flex', flexDirection:'column', gap:'.5rem', transition:'background .1s' }}
                onMouseEnter={e=>{ if(selectedLicense!==key) e.currentTarget.style.background='#111'; }} onMouseLeave={e=>{ e.currentTarget.style.background=selectedLicense===key?'#0f0f14':'var(--bg)'; }}>
                <span style={{ fontFamily:dd, fontSize:'.38rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--dim)' }}>{tier.label}</span>
                <span style={{ fontFamily:det, fontSize:'1.1rem', color:selectedLicense===key?'var(--white)':'#555', transition:'color .1s' }}>£{tier.price}</span>
                <span style={{ fontFamily:dd, fontSize:'.32rem', letterSpacing:'.1em', textTransform:'uppercase', color:'#2a2a2a' }}>{tier.desc}</span>
                <div style={{ width:7, height:7, borderRadius:'50%', background:selectedLicense===key?'var(--blue)':'var(--border)', marginTop:'auto' }}/>
              </div>
            ))}
          </div>

          {/* PayPal button */}
          <div style={{ marginBottom:'.8rem' }}>
            {purchasing ? (
              <div style={{ fontFamily:dd, fontSize:'.44rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--dim)', padding:'12px 0' }}>Processing payment...</div>
            ) : (
              <div ref={paypalRef}/>
            )}
          </div>

          <button onClick={()=>window.location.href=`/api/trial?slug=${font.slug}`} style={{ fontFamily:dd, fontSize:'.42rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--dim)', background:'transparent', border:border, padding:'10px 1.4rem', transition:'all .15s', width:'100%', marginBottom:'.6rem' }}
            onMouseEnter={e=>{e.target.style.color='var(--white)';e.target.style.borderColor='#333'}} onMouseLeave={e=>{e.target.style.color='var(--dim)';e.target.style.borderColor='var(--border)'}}>
            Download Free Trial Font
          </button>
          <div style={{ fontFamily:dd, fontSize:'.34rem', letterSpacing:'.12em', textTransform:'uppercase', color:'#282828', textAlign:'center' }}>
            Secure payment via PayPal · Instant download after purchase · License PDF included
          </div>
        </div>
      </div>

      {/* GLYPHS */}
      <div id="glyphs">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:border, borderTop:border, padding:'.45rem 1.2rem' }}>
          <span style={{ fontFamily:dd, fontSize:'.4rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--dim)' }}>Glyph Map — {font.glyphCount.toLocaleString()} glyphs</span>
        </div>
        <div style={{ display:'flex', alignItems:'stretch', borderBottom:border }}>
          {Object.keys(glyphSets).map(k=>(
            <button key={k} onClick={()=>setGlyphSet(k)} style={{ fontFamily:dd, fontSize:'.38rem', letterSpacing:'.14em', textTransform:'uppercase', color:glyphSet===k?'var(--white)':'var(--dim)', padding:'.5rem 1rem', border:'none', borderRight:border, background:glyphSet===k?'#111':'transparent', transition:'all .12s' }}>
              {k.charAt(0).toUpperCase()+k.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(44px,1fr))' }}>
          {glyphSets[glyphSet].map(ch=>(
            <div key={ch} style={{ borderRight:border, borderBottom:border, padding:'10px 4px 6px', display:'flex', flexDirection:'column', alignItems:'center', gap:3, cursor:'default', transition:'background .1s' }}
              onMouseEnter={e=>e.currentTarget.style.background='#111'} onMouseLeave={e=>e.currentTarget.style.background='var(--bg)'}>
              <span style={{ fontFamily, fontSize:'1.2rem', lineHeight:1, color:'#666' }}>{ch}</span>
              <span style={{ fontFamily:dd, fontSize:'.26rem', letterSpacing:'.05em', color:'#282828' }}>U+{ch.charCodeAt(0).toString(16).toUpperCase().padStart(4,'0')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM BUY BAR */}
      <div style={{ borderTop:'2px solid var(--white)', padding:'1.2rem', display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--bg)', flexWrap:'wrap', gap:'1rem' }}>
        <div style={{ fontFamily, fontSize:'clamp(1.5rem,4vw,2.5rem)', color:'var(--white)', letterSpacing:'-.01em' }}>{font.name}</div>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <span style={{ fontFamily:dd, fontSize:'.44rem', letterSpacing:'.1em', textTransform:'uppercase', color:'var(--dim)' }}>
            {tiers[selectedLicense].label} — £{tiers[selectedLicense].price}
          </span>
          <button onClick={()=>document.getElementById('buy').scrollIntoView({behavior:'smooth'})} style={{ fontFamily:det, fontSize:'.58rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--white)', background:'var(--blue)', border:'none', padding:'12px 2rem', transition:'opacity .15s' }}
            onMouseEnter={e=>e.target.style.opacity='.85'} onMouseLeave={e=>e.target.style.opacity='1'}>
            Buy Now
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop:border, display:'grid', gridTemplateColumns:'1fr auto 1fr', background:'var(--bg2)' }}>
        <span style={{ fontFamily:dd, fontSize:'clamp(.22rem,.65vw,.34rem)', color:'#272727', letterSpacing:'.12em', textTransform:'uppercase', padding:'.8rem 1rem' }}>© 2026 HypeForType — All rights reserved</span>
        <div style={{ borderLeft:border, borderRight:border, display:'flex', gap:'1rem', alignItems:'center', padding:'.8rem 1.2rem', flexWrap:'wrap' }}>
          {['Licensing','FAQ','Privacy','Contact'].map(t=>(
            <Link key={t} href={'/'+t.toLowerCase()} style={{ fontFamily:dd, fontSize:'clamp(.22rem,.65vw,.34rem)', color:'#2e2e2e', letterSpacing:'.14em', textTransform:'uppercase', transition:'color .12s' }}
              onMouseEnter={e=>e.target.style.color='var(--blue)'} onMouseLeave={e=>e.target.style.color='#2e2e2e'}>{t}</Link>
          ))}
        </div>
        <span style={{ fontFamily:dd, fontSize:'clamp(.22rem,.65vw,.34rem)', color:'#272727', letterSpacing:'.12em', textTransform:'uppercase', padding:'.8rem 1rem', textAlign:'right' }}>London · Online</span>
      </footer>
    </>
  );
}

export async function getStaticPaths() {
  return { paths: fonts.map(f => ({ params: { slug: f.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const font = fonts.find(f => f.slug === params.slug);
  if (!font) return { notFound: true };
  return { props: { font } };
}
