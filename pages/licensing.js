import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

const CHANNELS = [
  {
    id: 'desktop',
    name: 'Desktop',
    description: 'Print, layout & static design work',
    detail: 'Install on workstations for InDesign, Illustrator, Figma and print production.',
    icon: '⬛',
    tiers: [{ label: 'Indie', sub: '< £100k revenue', price: 25 }, { label: 'Small Biz', sub: '£100k – £1m', price: 49 }, { label: 'Mid-Market', sub: '£1m – £10m', price: 149 }],
  },
  {
    id: 'webfont',
    name: 'Webfont',
    description: 'Live text via @font-face',
    detail: 'Serve fonts on your domain for live browser text rendering.',
    icon: '🌐',
    tiers: [{ label: 'Indie', sub: '< £100k revenue', price: 29 }, { label: 'Small Biz', sub: '£100k – £1m', price: 59 }, { label: 'Mid-Market', sub: '£1m – £10m', price: 179 }],
  },
  {
    id: 'web_app',
    name: 'Web App',
    description: 'Interactive browser applications',
    detail: 'SaaS tools, dashboards, and interactive web experiences.',
    icon: '⚡',
    tiers: [{ label: 'Indie', sub: '< £100k revenue', price: 49 }, { label: 'Small Biz', sub: '£100k – £1m', price: 149 }, { label: 'Mid-Market', sub: '£1m – £10m', price: 449 }],
  },
  {
    id: 'digital_ads',
    name: 'Digital Ads',
    description: 'HTML5 & social campaigns',
    detail: 'Banner ads, social posts, and paid digital advertising creative.',
    icon: '📣',
    tiers: [{ label: 'Indie', sub: '< £100k revenue', price: 39 }, { label: 'Small Biz', sub: '£100k – £1m', price: 99 }, { label: 'Mid-Market', sub: '£1m – £10m', price: 299 }],
  },
  {
    id: 'app_ebook',
    name: 'App / eBook',
    description: 'iOS, Android & digital publishing',
    detail: 'Native mobile apps, desktop software, and fixed-layout digital publications.',
    icon: '📱',
    tiers: [{ label: 'Indie', sub: '< £100k revenue', price: 79 }, { label: 'Small Biz', sub: '£100k – £1m', price: 249 }, { label: 'Mid-Market', sub: '£1m – £10m', price: 749 }],
  },
  {
    id: 'server',
    name: 'Server',
    description: 'Dynamic backend generation',
    detail: 'Server-side PDF generation, automated image rendering, and dynamic document processing.',
    icon: '🖥',
    tiers: [{ label: 'Indie', sub: '< £100k revenue', price: 149 }, { label: 'Small Biz', sub: '£100k – £1m', price: 449 }, { label: 'Mid-Market', sub: '£1m – £10m', price: 1299 }],
  },
  {
    id: 'broadcast',
    name: 'Broadcast',
    description: 'TV, film & streaming titles',
    detail: 'On-screen text, title sequences, and motion graphics in video productions.',
    icon: '🎬',
    tiers: [{ label: 'Indie', sub: '< £100k revenue', price: 199 }, { label: 'Small Biz', sub: '£100k – £1m', price: 599 }, { label: 'Mid-Market', sub: '£1m – £10m', price: 1799 }],
  },
  {
    id: 'brand_font',
    name: 'Brand Font',
    description: 'Logo & trademark use',
    detail: 'Primary logos, wordmarks, and device marks. Mandatory for any trademark registration.',
    icon: '◆',
    tiers: [{ label: 'Indie', sub: '< £100k revenue', price: 150 }, { label: 'Small Biz', sub: '£100k – £1m', price: 450 }, { label: 'Mid-Market', sub: '£1m – £10m', price: 2500 }],
  },
]

const UMBRELLAS = [
  {
    name: 'Corporate',
    price: '£20,000',
    eligibility: 'One entity up to £50m revenue',
    coverage: 'All 8 channels, all internal employees',
    supplier: 'External agencies fully cleared',
    highlight: false,
  },
  {
    name: 'Enterprise',
    price: '£80,000',
    eligibility: 'One entity over £50m revenue',
    coverage: 'Unlimited global deployment across every medium',
    supplier: 'All contracted third parties cleared',
    highlight: true,
  },
  {
    name: 'Global Enterprise',
    price: '£POA',
    eligibility: 'Multiple entities under a global group',
    coverage: 'Unlimited across every entity globally',
    supplier: 'Full group-wide protection',
    highlight: false,
  },
]

export default function Licensing() {
  const [activeChannel, setActiveChannel] = useState('desktop')
  const [activeTier, setActiveTier] = useState(0)

  const channel = CHANNELS.find(c => c.id === activeChannel)

  return (
    <>
      <Head>
        <title>Licensing — HypeForType</title>
      </Head>

      <div className="licensing-page">

        <nav className="nav">
          <div className="nav-links">
            <Link href="/">Typefaces</Link>
            <Link href="/licensing" className="active">Licensing</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <Link href="/" className="nav-logo">
            <img src="/hft-logo.svg" alt="HypeForType" />
          </Link>
          <Link href="/cart" className="nav-cart">Cart</Link>
        </nav>

        <section className="hero">
          <div className="hero-label">LICENSING HUB</div>
          <h1 className="hero-title">Type.<br />Licensed<br />Correctly.</h1>
          <p className="hero-sub">
            We believe font designers should be paid fairly, and brands should be licensed accurately.
            Our modular licensing model scales naturally with the financial footprint of the end-client.
          </p>
          <div className="hero-divider" />
        </section>

        <section className="section-intro">
          <div className="section-tag">01 — STANDALONE CHANNELS</div>
          <h2 className="section-title">Self-Serve Matrix</h2>
          <p className="section-desc">
            Select your deployment channel and the revenue tier that matches your end-client.
            Standard channels do not permit third-party supplier access or multi-channel crossovers.
          </p>
        </section>

        <section className="channel-section">
          <div className="channel-tabs">
            {CHANNELS.map(c => (
              <button
                key={c.id}
                className={`channel-tab ${activeChannel === c.id ? 'active' : ''}`}
                onClick={() => setActiveChannel(c.id)}
              >
                <span className="tab-icon">{c.icon}</span>
                <span className="tab-name">{c.name}</span>
              </button>
            ))}
          </div>

          <div className="channel-detail">
            <div className="channel-info">
              <div className="channel-name-large">{channel.name}</div>
              <div className="channel-desc-large">{channel.description}</div>
              <p className="channel-detail-text">{channel.detail}</p>
            </div>

            <div className="tier-cards">
              {channel.tiers.map((tier, i) => (
                <button
                  key={i}
                  className={`tier-card ${activeTier === i ? 'active' : ''}`}
                  onClick={() => setActiveTier(i)}
                >
                  <div className="tier-label">{tier.label}</div>
                  <div className="tier-sub">{tier.sub}</div>
                  <div className="tier-price">£{tier.price.toLocaleString()}</div>
                  <div className="tier-cta">{activeTier === i ? 'Selected ✓' : 'Select'}</div>
                </button>
              ))}
            </div>

            <div className="channel-action">
              <Link href={`/?license=${activeChannel}&tier=${activeTier}`} className="btn-primary">
                Browse Typefaces → Apply License
              </Link>
              <p className="channel-note">One-time fee · Perpetual license · Instant download</p>
            </div>
          </div>
        </section>

        <section className="matrix-section">
          <div className="matrix-label">FULL PRICING MATRIX</div>
          <div className="matrix-scroll">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th className="col-channel">Channel</th>
                  <th>Indie <span>{'< £100k'}</span></th>
                  <th>Small Biz <span>£100k–£1m</span></th>
                  <th>Mid-Market <span>£1m–£10m</span></th>
                </tr>
              </thead>
              <tbody>
                {CHANNELS.map(c => (
                  <tr
                    key={c.id}
                    className={activeChannel === c.id ? 'active-row' : ''}
                    onClick={() => setActiveChannel(c.id)}
                  >
                    <td className="col-channel">
                      <span className="row-icon">{c.icon}</span>
                      <span className="row-name">{c.name}</span>
                      <span className="row-desc">{c.description}</span>
                    </td>
                    {c.tiers.map((t, i) => (
                      <td key={i} className="price-cell">£{t.price.toLocaleString()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="matrix-note">
            ↑ Click any row to select that channel above. If your client has over £10m in revenue,
            requires cross-platform deployment, or needs to share font assets — you must secure an Umbrella License below.
          </p>
        </section>

        <section className="umbrella-intro">
          <div className="section-tag">02 — CORPORATE UMBRELLAS</div>
          <h2 className="section-title">Complete Coverage.<br />Zero Restrictions.</h2>
          <p className="section-desc">
            Large corporations purchase flat-fee entity-wide frameworks.
            One license. Every channel. Every employee. Every supplier.
          </p>
        </section>

        <section className="umbrella-section">
          {UMBRELLAS.map((u, i) => (
            <div key={i} className={`umbrella-card ${u.highlight ? 'featured' : ''}`}>
              {u.highlight && <div className="featured-badge">MOST POPULAR</div>}
              <div className="umbrella-name">{u.name}</div>
              <div className="umbrella-price">{u.price}</div>
              <div className="umbrella-divider" />
              <ul className="umbrella-features">
                <li><span className="feat-label">Eligibility</span>{u.eligibility}</li>
                <li><span className="feat-label">Coverage</span>{u.coverage}</li>
                <li><span className="feat-label">Suppliers</span>{u.supplier}</li>
                <li><span className="feat-label">Duration</span>Perpetual · One-time fee</li>
              </ul>
              <a href="mailto:licensing@hypefortype.com" className={`umbrella-btn ${u.highlight ? 'btn-featured' : ''}`}>
                {u.price === '£POA' ? 'Contact Sales' : 'Enquire Now'}
              </a>
            </div>
          ))}
        </section>

        <section className="grant-section">
          <div className="grant-inner">
            <div className="grant-tag">DESIGNER INCENTIVE</div>
            <h3 className="grant-title">30% Creative Sourcing Grant</h3>
            <p className="grant-text">
              When you secure a Corporate or Enterprise Umbrella license for your client,
              HypeForType pays you a 30% Creative Sourcing Grant on the total license value.
              Disbursed within 5 business days of cleared funds on wire transfers.
            </p>
            <div className="grant-stats">
              <div className="grant-stat">
                <div className="stat-num">£6,000</div>
                <div className="stat-label">Corporate Grant</div>
              </div>
              <div className="grant-stat featured">
                <div className="stat-num">£24,000</div>
                <div className="stat-label">Enterprise Grant</div>
              </div>
              <div className="grant-stat">
                <div className="stat-num">30%</div>
                <div className="stat-label">On every wire</div>
              </div>
            </div>
            <Link href="/contact" className="btn-primary">Learn About the Grant →</Link>
          </div>
        </section>

        <section className="faq-strip">
          <div className="faq-item">
            <div className="faq-q">Which tier applies to me?</div>
            <div className="faq-a">Select the revenue tier of the end-client whose project the font will be used in — not your own studio revenue.</div>
          </div>
          <div className="faq-item">
            <div className="faq-q">Can I use one license across multiple channels?</div>
            <div className="faq-a">No. Each channel requires its own license. For multi-channel use, a Corporate Umbrella is more cost-effective.</div>
          </div>
          <div className="faq-item">
            <div className="faq-q">Do I need a Brand Font license for every logo?</div>
            <div className="faq-a">Yes. Any use in a primary logo, wordmark, or trademark requires a Brand Font license scaled to the client's revenue.</div>
          </div>
        </section>

        <section className="footer-cta">
          <h3>Not sure which license you need?</h3>
          <p>Email us and we'll point you in the right direction.</p>
          <a href="mailto:licensing@hypefortype.com" className="btn-primary">licensing@hypefortype.com</a>
        </section>

      </div>

      <style jsx>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .licensing-page { background: #0a0a0a; color: #f0f0f0; min-height: 100vh; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        .nav { display: flex; align-items: center; justify-content: space-between; padding: 20px 40px; border-bottom: 1px solid #1e1e1e; position: sticky; top: 0; background: #0a0a0a; z-index: 100; }
        .nav-links { display: flex; gap: 32px; }
        .nav-links a { color: #666; text-decoration: none; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; transition: color 0.2s; }
        .nav-links a:hover, .nav-links a.active { color: #f0f0f0; }
        .nav-logo img { height: 28px; }
        .nav-cart { color: #666; text-decoration: none; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; }
        .nav-cart:hover { color: #f0f0f0; }
        .hero { padding: 100px 40px 60px; max-width: 1200px; margin: 0 auto; }
        .hero-label { font-size: 11px; letter-spacing: 0.2em; color: #444; text-transform: uppercase; margin-bottom: 32px; }
        .hero-title { font-size: clamp(64px, 10vw, 140px); font-weight: 900; line-height: 0.9; letter-spacing: -0.03em; text-transform: uppercase; margin-bottom: 40px; }
        .hero-sub { max-width: 520px; font-size: 16px; line-height: 1.6; color: #888; }
        .hero-divider { margin-top: 80px; height: 1px; background: #1e1e1e; }
        .section-intro { padding: 80px 40px 40px; max-width: 1200px; margin: 0 auto; }
        .section-tag { font-size: 11px; letter-spacing: 0.2em; color: #444; text-transform: uppercase; margin-bottom: 20px; }
        .section-title { font-size: clamp(32px, 5vw, 56px); font-weight: 900; letter-spacing: -0.03em; text-transform: uppercase; margin-bottom: 20px; line-height: 1; }
        .section-desc { max-width: 560px; font-size: 15px; line-height: 1.65; color: #777; }
        .channel-section { padding: 0 40px 80px; max-width: 1200px; margin: 0 auto; }
        .channel-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 48px; border-bottom: 1px solid #1e1e1e; padding-bottom: 32px; }
        .channel-tab { display: flex; align-items: center; gap: 8px; padding: 10px 18px; background: transparent; border: 1px solid #222; color: #666; cursor: pointer; font-size: 13px; letter-spacing: 0.05em; text-transform: uppercase; transition: all 0.2s; font-family: inherit; }
        .channel-tab:hover { border-color: #444; color: #f0f0f0; }
        .channel-tab.active { border-color: #f0f0f0; background: #f0f0f0; color: #0a0a0a; }
        .tab-icon { font-size: 14px; }
        .tab-name { font-weight: 600; }
        .channel-detail { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }
        .channel-name-large { font-size: 48px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.03em; margin-bottom: 8px; }
        .channel-desc-large { font-size: 14px; color: #555; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px; }
        .channel-detail-text { font-size: 15px; line-height: 1.65; color: #888; margin-bottom: 40px; }
        .channel-action { margin-top: 8px; }
        .channel-note { margin-top: 12px; font-size: 12px; color: #444; letter-spacing: 0.05em; }
        .tier-cards { display: flex; flex-direction: column; gap: 12px; }
        .tier-card { display: grid; grid-template-columns: 1fr 1fr auto auto; align-items: center; gap: 16px; padding: 20px 24px; background: #111; border: 1px solid #1e1e1e; cursor: pointer; text-align: left; transition: all 0.2s; font-family: inherit; color: #f0f0f0; width: 100%; }
        .tier-card:hover { border-color: #444; background: #151515; }
        .tier-card.active { border-color: #f0f0f0; background: #f0f0f0; color: #0a0a0a; }
        .tier-label { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
        .tier-sub { font-size: 12px; opacity: 0.5; }
        .tier-price { font-size: 22px; font-weight: 900; letter-spacing: -0.02em; }
        .tier-cta { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.6; white-space: nowrap; }
        .tier-card.active .tier-cta { opacity: 1; font-weight: 700; }
        .btn-primary { display: inline-block; padding: 14px 28px; background: #f0f0f0; color: #0a0a0a; text-decoration: none; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; transition: all 0.2s; border: none; cursor: pointer; font-family: inherit; }
        .btn-primary:hover { background: #fff; }
        .matrix-section { padding: 0 40px 80px; max-width: 1200px; margin: 0 auto; }
        .matrix-label { font-size: 11px; letter-spacing: 0.2em; color: #333; text-transform: uppercase; margin-bottom: 24px; }
        .matrix-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .matrix-table { width: 100%; border-collapse: collapse; min-width: 600px; }
        .matrix-table thead th { text-align: left; padding: 14px 16px; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #444; border-bottom: 1px solid #1e1e1e; font-weight: 600; }
        .matrix-table thead th span { display: block; font-size: 10px; color: #333; letter-spacing: 0.05em; margin-top: 2px; font-weight: 400; }
        .matrix-table tbody tr { border-bottom: 1px solid #111; cursor: pointer; transition: background 0.15s; }
        .matrix-table tbody tr:hover { background: #111; }
        .matrix-table tbody tr.active-row { background: #151515; }
        .matrix-table td { padding: 16px; font-size: 14px; color: #888; }
        .col-channel { display: flex; align-items: center; gap: 12px; min-width: 200px; }
        .row-icon { font-size: 16px; }
        .row-name { font-weight: 700; color: #f0f0f0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; }
        .row-desc { font-size: 11px; color: #444; display: block; margin-top: 2px; }
        .price-cell { font-weight: 700; font-size: 15px; color: #f0f0f0; letter-spacing: -0.01em; }
        .active-row .price-cell { color: #fff; }
        .matrix-note { margin-top: 24px; font-size: 13px; color: #444; line-height: 1.6; border-left: 2px solid #222; padding-left: 16px; }
        .umbrella-intro { padding: 80px 40px 40px; max-width: 1200px; margin: 0 auto; border-top: 1px solid #1e1e1e; }
        .umbrella-section { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; padding: 0 40px 80px; max-width: 1200px; margin: 0 auto; }
        .umbrella-card { padding: 48px 36px; background: #0f0f0f; border: 1px solid #1a1a1a; position: relative; transition: border-color 0.2s; }
        .umbrella-card:hover { border-color: #333; }
        .umbrella-card.featured { background: #f0f0f0; color: #0a0a0a; border-color: #f0f0f0; }
        .featured-badge { position: absolute; top: 20px; right: 20px; font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; background: #0a0a0a; color: #f0f0f0; padding: 4px 10px; font-weight: 700; }
        .umbrella-name { font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #666; margin-bottom: 16px; font-weight: 600; }
        .umbrella-card.featured .umbrella-name { color: #888; }
        .umbrella-price { font-size: 48px; font-weight: 900; letter-spacing: -0.03em; margin-bottom: 32px; line-height: 1; }
        .umbrella-divider { height: 1px; background: #1e1e1e; margin-bottom: 32px; }
        .umbrella-card.featured .umbrella-divider { background: #ddd; }
        .umbrella-features { list-style: none; display: flex; flex-direction: column; gap: 16px; margin-bottom: 40px; }
        .umbrella-features li { font-size: 13px; line-height: 1.5; color: #777; }
        .umbrella-card.featured .umbrella-features li { color: #555; }
        .feat-label { display: block; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #444; margin-bottom: 4px; font-weight: 700; }
        .umbrella-card.featured .feat-label { color: #aaa; }
        .umbrella-btn { display: block; text-align: center; padding: 14px; border: 1px solid #333; color: #666; text-decoration: none; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.2s; }
        .umbrella-btn:hover { border-color: #f0f0f0; color: #f0f0f0; }
        .btn-featured { background: #0a0a0a; color: #f0f0f0; border-color: #0a0a0a; }
        .btn-featured:hover { background: #111; border-color: #111; color: #fff; }
        .grant-section { background: #0f0f0f; border-top: 1px solid #1a1a1a; border-bottom: 1px solid #1a1a1a; padding: 80px 40px; }
        .grant-inner { max-width: 1200px; margin: 0 auto; }
        .grant-tag { font-size: 11px; letter-spacing: 0.2em; color: #444; text-transform: uppercase; margin-bottom: 20px; }
        .grant-title { font-size: clamp(32px, 4vw, 48px); font-weight: 900; text-transform: uppercase; letter-spacing: -0.03em; margin-bottom: 20px; }
        .grant-text { max-width: 560px; font-size: 15px; line-height: 1.65; color: #777; margin-bottom: 48px; }
        .grant-stats { display: flex; gap: 2px; margin-bottom: 48px; }
        .grant-stat { padding: 32px 40px; background: #111; border: 1px solid #1a1a1a; flex: 1; }
        .grant-stat.featured { background: #f0f0f0; color: #0a0a0a; }
        .stat-num { font-size: 36px; font-weight: 900; letter-spacing: -0.03em; margin-bottom: 8px; }
        .stat-label { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #666; }
        .grant-stat.featured .stat-label { color: #888; }
        .faq-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; max-width: 1200px; margin: 0 auto; padding: 80px 40px; border-bottom: 1px solid #1a1a1a; }
        .faq-item { padding: 0 40px 0 0; border-right: 1px solid #1a1a1a; }
        .faq-item:last-child { padding-right: 0; border-right: none; padding-left: 40px; }
        .faq-item:nth-child(2) { padding-left: 40px; }
        .faq-q { font-size: 15px; font-weight: 700; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.03em; }
        .faq-a { font-size: 13px; line-height: 1.6; color: #666; }
        .footer-cta { text-align: center; padding: 100px 40px; max-width: 1200px; margin: 0 auto; }
        .footer-cta h3 { font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; margin-bottom: 12px; }
        .footer-cta p { color: #666; margin-bottom: 32px; font-size: 15px; }
        @media (max-width: 768px) {
          .nav { padding: 16px 20px; }
          .nav-links { gap: 16px; }
          .nav-links a { font-size: 11px; }
          .hero { padding: 60px 20px 40px; }
          .section-intro { padding: 60px 20px 32px; }
          .channel-section { padding: 0 20px 60px; }
          .matrix-section { padding: 0 20px 60px; }
          .umbrella-intro { padding: 60px 20px 32px; }
          .umbrella-section { grid-template-columns: 1fr; padding: 0 20px 60px; }
          .faq-strip { grid-template-columns: 1fr; gap: 40px; padding: 60px 20px; }
          .faq-item { padding: 0; border-right: none; border-bottom: 1px solid #1a1a1a; padding-bottom: 32px; }
          .faq-item:last-child { padding-left: 0; border-bottom: none; }
          .faq-item:nth-child(2) { padding-left: 0; }
          .footer-cta { padding: 60px 20px; }
          .grant-section { padding: 60px 20px; }
          .grant-stats { flex-direction: column; }
          .channel-detail { grid-template-columns: 1fr; gap: 32px; }
          .tier-card { grid-template-columns: 1fr auto; }
          .tier-sub { display: none; }
          .tier-cta { display: none; }
        }
      `}</style>
    </>
  )
}
