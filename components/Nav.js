import Link from 'next/link';

export default function Nav({ buyLabel, onBuy }) {
  return (
    <nav style={{
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      alignItems: 'stretch',
      borderBottom: '1px solid var(--border-dark)',
      background: 'var(--bg)',
      position: 'sticky',
      top: 0,
      zIndex: 200,
      height: '52px',
    }}>
      {/* Logo */}
      <Link href="/" style={{
        fontFamily: "'Determination', monospace",
        fontSize: '1rem',
        letterSpacing: '.06em',
        textTransform: 'uppercase',
        color: 'var(--white)',
        padding: '0 1.6rem',
        borderRight: '1px solid var(--border-dark)',
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
      }}>
        HypeForType
      </Link>

      {/* Links */}
      <div style={{ display: 'flex', alignItems: 'stretch', overflowX: 'auto' }}>
        {['Typefaces','Licensing','FAQ','Contact'].map(n => (
          <Link key={n}
            href={n === 'Typefaces' ? '/' : '/' + n.toLowerCase()}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '.08em',
              textTransform: 'uppercase',
              color: '#444',
              padding: '0 1.2rem',
              borderRight: '1px solid var(--border-dark)',
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              transition: 'color .15s',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--white)'}
            onMouseLeave={e => e.target.style.color = '#444'}>
            {n}
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', alignItems: 'stretch', borderLeft: '1px solid var(--border-dark)' }}>
        {buyLabel && onBuy ? (
          <button onClick={onBuy} style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px', fontWeight: 700,
            letterSpacing: '.1em', textTransform: 'uppercase',
            color: '#fff', background: 'var(--blue)',
            border: 'none', padding: '0 1.6rem',
            whiteSpace: 'nowrap', transition: 'opacity .15s',
          }}
            onMouseEnter={e => e.target.style.opacity = '.85'}
            onMouseLeave={e => e.target.style.opacity = '1'}>
            {buyLabel}
          </button>
        ) : (
          <Link href="/cart" style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px', fontWeight: 700,
            letterSpacing: '.1em', textTransform: 'uppercase',
            color: '#fff', background: 'var(--blue)',
            padding: '0 1.6rem',
            display: 'flex', alignItems: 'center',
            whiteSpace: 'nowrap',
          }}>
            Cart
          </Link>
        )}
      </div>
    </nav>
  );
}
