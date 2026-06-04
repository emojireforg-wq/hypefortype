import Link from 'next/link';

const inter = "'Inter', sans-serif";
const det = "'Determination', monospace";
const dd = "'DigitalDisco', monospace";
const border = '1px solid var(--border)';

export default function Nav({ buyLabel, onBuy }) {
  return (
    <nav style={{ display:'grid', gridTemplateColumns:'auto 1fr auto', alignItems:'stretch', borderBottom:border, background:'var(--bg)', position:'sticky', top:0, zIndex:200 }}>
      <Link href="/" style={{ fontFamily:det, fontSize:'clamp(.9rem,2vw,1.15rem)', letterSpacing:'.06em', textTransform:'uppercase', color:'var(--white)', padding:'.85rem 1.4rem', borderRight:border, display:'flex', alignItems:'center', whiteSpace:'nowrap' }}>
        HypeForType
      </Link>
      <div style={{ display:'flex', alignItems:'stretch', overflowX:'auto' }}>
        {['Typefaces','Licensing','Studio','News'].map(n => (
          <Link key={n} href={n==='Typefaces'?'/':'/'+n.toLowerCase()}
            style={{ fontFamily:inter, fontSize:'12px', fontWeight:500, letterSpacing:'.04em', textTransform:'uppercase', color:'#555', padding:'0 clamp(.8rem,2vw,1.2rem)', borderRight:border, display:'flex', alignItems:'center', whiteSpace:'nowrap', transition:'color .15s' }}
            onMouseEnter={e=>e.target.style.color='var(--white)'} onMouseLeave={e=>e.target.style.color='#555'}>
            {n}
          </Link>
        ))}
      </div>
      <div style={{ display:'flex', alignItems:'stretch', borderLeft:border }}>
        {buyLabel && onBuy && (
          <button onClick={onBuy} style={{ fontFamily:inter, fontSize:'12px', fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', color:'var(--white)', background:'var(--blue)', border:'none', padding:'0 clamp(14px,2.5vw,22px)', whiteSpace:'nowrap', transition:'opacity .15s' }}
            onMouseEnter={e=>e.target.style.opacity='.85'} onMouseLeave={e=>e.target.style.opacity='1'}>
            {buyLabel}
          </button>
        )}
        {!buyLabel && (
          <Link href="/cart" style={{ fontFamily:inter, fontSize:'12px', fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', color:'var(--white)', background:'var(--blue)', padding:'0 clamp(14px,2.5vw,22px)', display:'flex', alignItems:'center', whiteSpace:'nowrap' }}>
            Checkout
          </Link>
        )}
      </div>
    </nav>
  );
}
