import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Nav({ buyLabel, onBuy }) {
  const router = useRouter();
  return (
    <nav style={{ display:'grid', gridTemplateColumns:'auto 1fr auto', alignItems:'stretch', borderBottom:'1px solid var(--border)', background:'var(--bg)', position:'sticky', top:0, zIndex:200 }}>
      <Link href="/" style={{ fontFamily:'var(--det)', fontSize:'clamp(.9rem,2vw,1.15rem)', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--white)', padding:'.85rem 1.4rem', borderRight:'1px solid var(--border)', display:'flex', alignItems:'center', whiteSpace:'nowrap' }}>
        HypeForType
      </Link>
      <div style={{ display:'flex', alignItems:'stretch', overflowX:'auto' }}>
        {['Typefaces','Licensing','Studio','News'].map(n => (
          <Link key={n} href={n==='Typefaces'?'/':'/'+n.toLowerCase()} style={{ fontFamily:'var(--dd)', fontSize:'11px', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--dim)', padding:'0 clamp(.8rem,2vw,1.2rem)', borderRight:'1px solid var(--border)', display:'flex', alignItems:'center', whiteSpace:'nowrap', transition:'color .15s' }}
            onMouseEnter={e=>e.target.style.color='var(--white)'} onMouseLeave={e=>e.target.style.color='var(--dim)'}>
            {n}
          </Link>
        ))}
      </div>
      <div style={{ display:'flex', alignItems:'stretch', borderLeft:'1px solid var(--border)' }}>
        {buyLabel && onBuy && (
          <button onClick={onBuy} style={{ fontFamily:'var(--det)', fontSize:'clamp(.7rem,1.4vw,.9rem)', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--white)', background:'var(--blue)', border:'none', padding:'0 clamp(14px,2.5vw,22px)', whiteSpace:'nowrap', transition:'opacity .15s' }}
            onMouseEnter={e=>e.target.style.opacity='.85'} onMouseLeave={e=>e.target.style.opacity='1'}>
            {buyLabel}
          </button>
        )}
        {!buyLabel && (
          <Link href="/cart" style={{ fontFamily:'var(--det)', fontSize:'clamp(.7rem,1.4vw,.9rem)', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--white)', background:'var(--blue)', padding:'0 clamp(14px,2.5vw,22px)', display:'flex', alignItems:'center', whiteSpace:'nowrap' }}>
            Checkout
          </Link>
        )}
      </div>
    </nav>
  );
}
