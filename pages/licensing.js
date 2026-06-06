import Head from 'next/head';
import Link from 'next/link';
import Nav from '../components/Nav';

const LICENSES = [
  { key: 'desktop',   label: 'Desktop',    price: 'From £25', icon: '⬛' },
  { key: 'web',       label: 'Webfont',    price: 'From £35', icon: '⬛' },
  { key: 'app',       label: 'App',        price: 'From £55', icon: '⬛' },
  { key: 'broadcast', label: 'Broadcast',  price: 'From £85', icon: '⬛' },
  { key: 'brand',     label: 'Brand Logo', price: 'From £95', icon: '⬛' },
  { key: 'enterprise',label: 'Enterprise', price: 'POA',      icon: '⬛' },
  { key: 'trial',     label: 'Trial',      price: 'Free',     icon: '⬛' },
];

const ROWS = [
  { label: 'Commercial use',           values: [true,  true,  true,  true,  true,  true,  false] },
  { label: 'Perpetual license',        values: [true,  true,  true,  true,  true,  true,  false] },
  { label: 'Print & static image',     values: [true,  false, false, false, true,  true,  true]  },
  { label: 'Web embed (@font-face)',    values: [false, true,  false, false, false, true,  false] },
  { label: 'Trademark / logo use',     values: [false, false, false, false, true,  true,  false] },
  { label: 'App / server / eBook',     values: [false, false, true,  false, false, true,  false] },
  { label: 'Video & broadcast',        values: [false, false, false, true,  false, true,  false] },
  { label: 'Use across territories',   values: [true,  true,  true,  true,  true,  true,  false] },
  { label: 'Supplier / agency use',    values: [false, false, false, false, false, true,  false] },
  { label: 'Sublicensing to clients',  values: [false, false, false, false, false, false, false] },
];

const DETAILS = [
  {
    key: 'desktop',
    label: 'Desktop',
    desc: 'For freelancers, studios, agencies and companies. Install on up to the licensed number of computers and create documents, print artwork, and static images. One-time fee, perpetual license.',
    covers: ['Print documents (PDF, JPEG, PNG etc.)', 'Static images for digital use', 'Presentations and pitch decks', 'Packaging and product design'],
    notCovers: ['Website embedding via @font-face', 'App or software embedding', 'Video and broadcast production', 'Logo trademark registration'],
  },
  {
    key: 'web',
    label: 'Webfont',
    desc: 'Embed font files into your CSS via @font-face for use on websites as dynamic text. Licensed per domain. One-time fee, perpetual license.',
    covers: ['@font-face embedding on licensed domain', 'Dynamic text on websites', 'Web applications (display only)'],
    notCovers: ['Logo or trademark design', 'Print and static image use', 'App embedding or server use', 'Video or broadcast'],
  },
  {
    key: 'app',
    label: 'App',
    desc: 'Embed fonts in mobile apps, desktop software, games, internal servers, or eBooks. One license per app title, unlimited platforms and updates. One-time fee.',
    covers: ['iOS and Android apps', 'Desktop software', 'Games', 'Internal servers', 'eBooks (EPUB, PDF)'],
    notCovers: ['Web embedding', 'Video or broadcast', 'Trademark logo use'],
  },
  {
    key: 'broadcast',
    label: 'Broadcast',
    desc: 'Use fonts in video productions, TV, film, streaming content, and online video. Licensed per production or series. One-time fee.',
    covers: ['TV and film titles', 'Streaming content (Netflix, YouTube etc.)', 'Online video and social media video', 'Digital signage'],
    notCovers: ['Web embedding', 'App embedding', 'Logo trademark use'],
  },
  {
    key: 'brand',
    label: 'Brand Logo',
    desc: 'Use the font as the basis for a trademark, wordmark, or registered logo. Includes print and static image rights. One-time fee.',
    covers: ['Wordmark and trademark registration', 'Logo design', 'All print and static image use', 'Brand identity across media'],
    notCovers: ['Web embedding (requires separate Webfont license)', 'App embedding', 'Video production'],
  },
  {
    key: 'enterprise',
    label: 'Enterprise',
    desc: 'Unlimited use across your entire organisation — all employees, all projects, all media types. Covers web, app, print, video, and brand use. Priced on application.',
    covers: ['All license types in one', 'Unlimited seats', 'All territories', 'Supplier and agency access', 'Annual or perpetual options'],
    notCovers: ['Sublicensing to third parties outside the organisation'],
  },
  {
    key: 'trial',
    label: 'Trial',
    desc: 'Evaluate fonts before purchasing. Trial fonts are watermarked or limited in glyph count and may only be used for internal testing and design comps. Not for commercial use.',
    covers: ['Personal evaluation', 'Internal design comps', 'Testing in layouts'],
    notCovers: ['Commercial use of any kind', 'Client work', 'Publication or distribution'],
  },
];

export default function Licensing() {
  return (
    <>
      <Head>
        <title>Font Licensing — HypeForType</title>
        <meta name="description" content="HypeForType font licensing options — Desktop, Webfont, App, Broadcast, Brand Logo, Enterprise and Trial. Find the right license for your project." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          :root {
            --bg: #000; --bg2: #06060f; --blue: #1b1aff;
            --white: #e8e8ff; --t2: #7888c0; --t3: #4a5488; --t4: #282c52;
            --border: #0e0f28;
          }
          html, body { background: var(--bg); color: var(--white); font-family: 'Space Grotesk', sans-serif; -webkit-font-smoothing: antialiased; }
          a { text-decoration: none; color: inherit; }
          ::-webkit-scrollbar { width: 3px; }
          ::-webkit-scrollbar-track { background: var(--bg); }
          ::-webkit-scrollbar-thumb { background: var(--border); }

          .page-wrap { max-width: 1200px; margin: 0 auto; padding: 4rem 2rem 6rem; padding-top: calc(48px + 4rem); }

          /* Hero */
          .lic-hero { border-bottom: 1px solid var(--border); padding-bottom: 3rem; margin-bottom: 3rem; }
          .lic-eyebrow { font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: var(--blue); margin-bottom: 1rem; }
          .lic-title { font-size: clamp(2.5rem, 6vw, 5rem); line-height: .95; color: var(--white); font-weight: 700; margin-bottom: 1.5rem; }
          .lic-sub { font-size: 16px; color: var(--t2); line-height: 1.7; max-width: 600px; }

          /* Comparison table */
          .table-wrap { overflow-x: auto; margin-bottom: 4rem; }
          .lic-table { width: 100%; border-collapse: collapse; min-width: 900px; }
          .lic-table th { font-family: 'Space Mono', monospace; font-size: 9px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; padding: 1rem .8rem .6rem; text-align: center; border-bottom: 2px solid var(--blue); color: var(--white); background: var(--bg2); position: sticky; top: 48px; z-index: 10; }
          .lic-table th:first-child { text-align: left; color: var(--t3); border-bottom-color: var(--border); }
          .th-price { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 600; color: var(--blue); letter-spacing: 0; text-transform: none; margin-top: 4px; display: block; }
          .lic-table td { padding: .7rem .8rem; border-bottom: 1px solid var(--border); text-align: center; font-size: 13px; }
          .lic-table td:first-child { text-align: left; font-family: 'Space Grotesk', sans-serif; font-size: 12px; color: var(--t2); font-weight: 500; padding-left: 0; }
          .lic-table tr:hover td { background: rgba(27,26,255,0.04); }
          .check { color: var(--blue); font-size: 16px; }
          .cross { color: var(--t4); font-size: 14px; }

          /* License cards */
          .section-title { font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: var(--t3); margin-bottom: 2rem; padding-bottom: .8rem; border-bottom: 1px solid var(--border); }
          .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1px; background: var(--border); border: 1px solid var(--border); margin-bottom: 4rem; }
          .card { background: var(--bg2); padding: 1.8rem; display: flex; flex-direction: column; gap: 1rem; transition: background .15s; }
          .card:hover { background: #0a0b1f; }
          .card-head { display: flex; justify-content: space-between; align-items: flex-start; }
          .card-label { font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--white); }
          .card-price { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--blue); letter-spacing: .06em; }
          .card-desc { font-size: 12px; color: var(--t2); line-height: 1.7; }
          .card-covers { display: flex; flex-direction: column; gap: .4rem; }
          .covers-label { font-family: 'Space Mono', monospace; font-size: 9px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--t3); margin-bottom: .2rem; }
          .cover-item { display: flex; align-items: flex-start; gap: .5rem; font-size: 11px; color: var(--t2); line-height: 1.5; }
          .cover-dot { color: var(--blue); flex-shrink: 0; margin-top: 2px; font-size: 8px; }
          .not-item { display: flex; align-items: flex-start; gap: .5rem; font-size: 11px; color: var(--t4); line-height: 1.5; }
          .not-dot { color: var(--t4); flex-shrink: 0; margin-top: 2px; font-size: 8px; }
          .card-cta { margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border); }
          .card-btn { font-family: 'Space Mono', monospace; font-size: 9px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #fff; background: var(--blue); border: none; padding: 10px 18px; cursor: pointer; transition: opacity .15s; display: inline-block; }
          .card-btn:hover { opacity: .85; }

          /* Contact */
          .contact-box { border: 1px solid var(--border); padding: 2.5rem; display: flex; justify-content: space-between; align-items: center; gap: 2rem; flex-wrap: wrap; }
          .contact-title { font-size: 18px; font-weight: 700; color: var(--white); margin-bottom: .5rem; }
          .contact-sub { font-size: 13px; color: var(--t2); }
          .contact-btn { font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #fff; background: var(--blue); padding: 14px 28px; border: none; cursor: pointer; white-space: nowrap; transition: opacity .15s; display: inline-block; box-shadow: 0 0 20px rgba(27,26,255,0.3); }
          .contact-btn:hover { opacity: .85; }

          /* Footer */
          .lic-footer { border-top: 1px solid var(--border); display: grid; grid-template-columns: 1fr auto 1fr; margin-top: 6rem; background: var(--bg2); }
          .footer-copy { font-family: 'Space Grotesk', sans-serif; font-size: 11px; color: rgba(255,255,255,0.15); letter-spacing: .06em; text-transform: uppercase; padding: 1.4rem 1.8rem; }
          .footer-links { border-left: 1px solid var(--border); border-right: 1px solid var(--border); display: flex; gap: 2rem; align-items: center; padding: 1.4rem 2rem; }
          .footer-link { font-family: 'Space Grotesk', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,0.18); transition: color .2s; }
          .footer-link:hover { color: var(--white); }
          .footer-loc { font-family: 'Space Grotesk', sans-serif; font-size: 11px; color: rgba(255,255,255,0.15); letter-spacing: .06em; text-transform: uppercase; padding: 1.4rem 1.8rem; text-align: right; }
        `}</style>
      </Head>

      <Nav />

      <div className="page-wrap">

        {/* Hero */}
        <div className="lic-hero">
          <div className="lic-eyebrow">HypeForType &mdash; Licensing</div>
          <h1 className="lic-title">What license<br/>do you need?</h1>
          <p className="lic-sub">All licenses are perpetual, one-time fee purchases. No subscriptions. No renewals. Buy once, use forever. Compare below and contact us if you need something custom.</p>
        </div>

        {/* Comparison table */}
        <div className="section-title">License comparison</div>
        <div className="table-wrap">
          <table className="lic-table">
            <thead>
              <tr>
                <th></th>
                {LICENSES.map(l => (
                  <th key={l.key}>
                    {l.label}
                    <span className="th-price">{l.price}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={i}>
                  <td>{row.label}</td>
                  {row.values.map((v, j) => (
                    <td key={j}>
                      {v
                        ? <span className="check">&#10003;</span>
                        : <span className="cross">&#10005;</span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail cards */}
        <div className="section-title">License details</div>
        <div className="cards">
          {DETAILS.map(d => (
            <div key={d.key} className="card">
              <div className="card-head">
                <span className="card-label">{d.label}</span>
                <span className="card-price">{LICENSES.find(l => l.key === d.key)?.price}</span>
              </div>
              <p className="card-desc">{d.desc}</p>
              <div className="card-covers">
                <div className="covers-label">Covers</div>
                {d.covers.map((c, i) => (
                  <div key={i} className="cover-item">
                    <span className="cover-dot">&#9632;</span>
                    {c}
                  </div>
                ))}
              </div>
              <div className="card-covers">
                <div className="covers-label">Does not cover</div>
                {d.notCovers.map((c, i) => (
                  <div key={i} className="not-item">
                    <span className="not-dot">&#9632;</span>
                    {c}
                  </div>
                ))}
              </div>
              <div className="card-cta">
                <Link href="/" className="card-btn">Browse fonts &rarr;</Link>
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="contact-box">
          <div>
            <div className="contact-title">Need a custom license?</div>
            <div className="contact-sub">Enterprise, group, or bespoke arrangements — we&rsquo;ll sort it out.</div>
          </div>
          <Link href="/contact" className="contact-btn">Get in touch &rarr;</Link>
        </div>

      </div>

      <footer className="lic-footer">
        <span className="footer-copy">&copy; 2026 HypeForType</span>
        <div className="footer-links">
          {['Licensing','FAQ','Privacy','Contact'].map(t => (
            <Link key={t} href={'/' + t.toLowerCase()} className="footer-link">{t}</Link>
          ))}
        </div>
        <span className="footer-loc">London &middot; Online</span>
      </footer>
    </>
  );
}
