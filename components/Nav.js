import Link from 'next/link';
import Image from 'next/image';

export default function Nav({ buyLabel, onBuy }) {
  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 300,
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'stretch',
      height: '48px',
      borderBottom: '1px solid var(--border)',
      background: 'rgba(8,8,15,0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>

      {/* Left — nav links */}
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        {['Typefaces','Licensing','FAQ','Contact'].map(n => (
          <Link key={n}
            href={n === 'Typefaces' ? '/' : '/' + n.toLowerCase()}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '11px', fontWeight: 500,
              letterSpacing: '.1em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              padding: '0 1.2rem',
              display: 'flex', alignItems: 'center',
              whiteSpace: 'nowrap',
              transition: 'color .2s',
              borderRight: '1px solid var(--border)',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}>
            {n}
          </Link>
        ))}
      </div>

      {/* Centre — logo */}
      <Link href="/" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 1.6rem',
        borderLeft: '1px solid var(--border)',
        borderRight: '1px solid var(--border)',
      }}>
        <Image src="/hft-logo.svg" alt="HypeForType" width={120} height={28} style={{ height: '22px', width: 'auto' }} priority />
      </Link>

      {/* Right — cart / buy */}
      <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'flex-end', borderLeft: '1px solid var(--border)' }}>
        {buyLabel && onBuy ? (
          <button onClick={onBuy} style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '11px', fontWeight: 700,
            letterSpacing: '.1em', textTransform: 'uppercase',
            color: '#fff', background: 'var(--blue)',
            border: 'none', padding: '0 1.6rem',
            cursor: 'pointer',
            transition: 'opacity .2s',
          }}
            onMouseEnter={e => e.target.style.opacity = '.8'}
            onMouseLeave={e => e.target.style.opacity = '1'}>
            {buyLabel}
          </button>
        ) : (
          <Link href="/cart" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '11px', fontWeight: 700,
            letterSpacing: '.1em', textTransform: 'uppercase',
            color: '#fff', background: 'var(--blue)',
            padding: '0 1.6rem',
            display: 'flex', alignItems: 'center',
            transition: 'opacity .2s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            Cart
          </Link>
        )}
      </div>

    </nav>
  );
}
