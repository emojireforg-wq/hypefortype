import Head from 'next/head';
import Link from 'next/link';
import Nav from '../components/Nav';

const LICENSES = [
  { key:'desktop',    label:'Desktop',    price:'From £25', icon:'🖥' },
  { key:'web',        label:'Web',        price:'From £35', icon:'🌐' },
  { key:'app',        label:'App',        price:'From £55', icon:'📱' },
  { key:'broadcast',  label:'Broadcast',  price:'From £85', icon:'📺' },
  { key:'brand',      label:'Logo',       price:'From £95', icon:'®'  },
  { key:'enterprise', label:'Corporate',  price:'POA',      icon:'🏢' },
  { key:'trial',      label:'Trial',      price:'Free',     icon:'🎁' },
];

const TABLE_ROWS = [
  { label:'Commercial use',         values:[true, true, true, true, true, true, false] },
  { label:'Perpetual',              values:[true, true, true, true, true, true, true]  },
  { label:'Print & static image',   values:[true, false,false,false,true, true, true]  },
  { label:'Web embed (@font-face)', values:[false,true, false,false,false,true, false] },
  { label:'Trademark / logo',       values:[false,false,false,false,true, true, false] },
  { label:'App / server / eBook',   values:[false,false,true, true, false,true, false] },
  { label:'Used by suppliers',      values:[false,false,false,false,false,true, false] },
  { label:'Use across territories', values:[true, true, true, true, true, true, false] },
  { label:'Exclusive license',      values:[false,false,false,false,false,false,false] },
  { label:'OEM usage',              values:[false,false,false,false,false,false,false] },
];

const DETAILS = [
  {
    key:'desktop', label:'Desktop', icon:'🖥',
    points:[
      'For freelancers, studios, agencies, and companies.',
      'Create documents and static images for print or digital use (PDF, JPEG, PNG etc.)',
      'One-time fee, perpetual license.',
      'Does not cover logo design, web embedding, apps, eBooks, video, or server use.',
      'You may not resell or redistribute font files to third parties.',
    ],
  },
  {
    key:'web', label:'Web', icon:'🌐',
    points:[
      'Embed font files via @font-face as dynamic text on a website.',
      '1 license covers 1 domain or URL.',
      'One-time fee, perpetual license.',
      'Cannot be used to create graphics or logos for display on surfaces or products.',
      'Does not apply to apps, servers, or video/broadcast use.',
    ],
  },
  {
    key:'app', label:'App / eBook', icon:'📱',
    points:[
      'Embed fonts in software, mobile apps, games, internal servers, and eBooks.',
      'One license covers one app/software/eBook title across all platforms and updates.',
      'One-time fee, perpetual license.',
      'May not be used in apps that allow end users to create custom vector typesetting.',
      'May not resell or redistribute font files as part of app source code.',
    ],
  },
  {
    key:'broadcast', label:'Video / Broadcast', icon:'📺',
    points:[
      'Use fonts in TV, cinema, or Video On Demand streaming productions.',
      'One license per single title (film, series, or campaign). Multiple titles need multiple licenses.',
      'One-time fee, perpetual license.',
      'May not be used to create documents, static images, or logos.',
      'May not embed in websites, apps, eBooks, or other software.',
    ],
  },
  {
    key:'brand', label:'Logo', icon:'®',
    points:[
      'Design a logo, wordmark, or device mark with permission to trademark it.',
      'You may modify font outlines exclusively for logo creation purposes.',
      'One-time fee, perpetual license.',
      'Does not cover web embedding, apps, eBooks, broadcast, or server use.',
      'May not resell or redistribute font files to third parties including clients.',
    ],
  },
  {
    key:'enterprise', label:'Corporate', icon:'🏢',
    points:[
      'Single corporate entity with unlimited employees and CPUs.',
      'Includes affiliated suppliers: agencies, advertisers, retailers, and service providers.',
      'Covers desktop, web, and device uses for full 360° brand communications.',
      'One-time fee, perpetual license.',
      'Does not cover OEM (Original Equipment Manufacturer) usage.',
    ],
  },
  {
    key:'trial', label:'Trial', icon:'🎁',
    points:[
      'Download free to test font integration in your designs.',
      'You may share trial fonts with third parties for evaluation.',
      'Numerals 0–9 are not included in trial versions.',
      'Cannot be used for any commercial purpose.',
      'May not be resold to third parties.',
    ],
  },
];

export default function Licensing() {
  return (
    <>
      <Head>
        <title>Font Licensing — HypeForType</title>
        <meta name="description" content="HypeForType font licensing — Desktop, Web, App, Broadcast, Logo, Corporate, Trial. Perpetual one-time fee licenses." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          :root{--bg:#000;--bg2:#06060f;--blue:#1b1aff;--white:#e8e8ff;--t2:#7888c0;--t3:#4a5488;--t4:#282c52;--border:#0e0f28}
          html,body{background:var(--bg);color:var(--white);font-family:'Space Grotesk',sans-serif;-webkit-font-smoothing:antialiased}
          a{text-decoration:none;color:inherit}
          ::-webkit-scrollbar{width:3px}
          ::-webkit-scrollbar-track{background:var(--bg)}
          ::-webkit-scrollbar-thumb{background:var(--border)}

          .wrap{max-width:1100px;margin:0 auto;padding:calc(48px + 3rem) 2rem 6rem}

          /* Hero */
          .eyebrow{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--blue);margin-bottom:.8rem}
          .h1{font-size:clamp(2rem,5vw,4rem);font-weight:700;line-height:.95;color:var(--white);margin-bottom:1rem}
          .sub{font-size:14px;color:var(--t2);line-height:1.7;max-width:520px;margin-bottom:2.5rem}

          /* Section label */
          .sec{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--t3);padding-bottom:.7rem;border-bottom:1px solid var(--border);margin-bottom:1.5rem;margin-top:3rem}

          /* License type icons row */
          .icons-row{display:grid;grid-template-columns:repeat(7,1fr);gap:1px;background:var(--border);border:1px solid var(--border);margin-bottom:3rem}
          @media(max-width:700px){.icons-row{grid-template-columns:repeat(4,1fr)}}
          .icon-cell{background:var(--bg2);padding:1.4rem 1rem;text-align:center;display:flex;flex-direction:column;align-items:center;gap:.5rem;transition:background .15s;cursor:default}
          .icon-cell:hover{background:#0a0b1f}
          .icon-emoji{font-size:1.8rem;line-height:1}
          .icon-label{font-family:'Space Mono',monospace;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--white)}
          .icon-price{font-family:'Space Mono',monospace;font-size:9px;color:var(--blue);letter-spacing:.04em}

          /* Comparison table */
          .table-wrap{overflow-x:auto;margin-bottom:0}
          table{width:100%;border-collapse:collapse;min-width:700px}
          thead th{font-family:'Space Mono',monospace;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:.7rem .5rem;text-align:center;border-bottom:1px solid var(--blue);color:var(--white);background:var(--bg2)}
          thead th:first-child{text-align:left;color:var(--t3);border-bottom-color:var(--border);padding-left:0;min-width:160px}
          tbody td{padding:.55rem .5rem;border-bottom:1px solid var(--border);text-align:center;font-size:14px}
          tbody td:first-child{text-align:left;font-size:11px;color:var(--t2);font-family:'Space Grotesk',sans-serif;padding-left:0}
          tbody tr:hover td{background:rgba(27,26,255,0.04)}
          .yes{color:var(--blue)}
          .no{color:var(--t4)}

          /* Details */
          .details{display:flex;flex-direction:column;gap:0}
          .detail-row{display:grid;grid-template-columns:200px 1fr;gap:2rem;padding:1.5rem 0;border-bottom:1px solid var(--border);align-items:start}
          @media(max-width:600px){.detail-row{grid-template-columns:1fr}}
          .detail-head{display:flex;align-items:center;gap:.7rem}
          .detail-icon{font-size:1.4rem}
          .detail-label{font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--white)}
          .detail-points{list-style:none;display:flex;flex-direction:column;gap:.4rem}
          .detail-point{font-size:12px;color:var(--t2);line-height:1.6;padding-left:1rem;position:relative}
          .detail-point::before{content:'—';position:absolute;left:0;color:var(--t4)}

          /* CTA */
          .cta-box{border:1px solid var(--border);padding:2rem;display:flex;justify-content:space-between;align-items:center;gap:2rem;flex-wrap:wrap;margin-top:3rem}
          .cta-title{font-size:16px;font-weight:700;margin-bottom:.3rem}
          .cta-sub{font-size:12px;color:var(--t2)}
          .cta-btn{font-family:'Space Mono',monospace;font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#fff;background:var(--blue);padding:12px 24px;border:none;cursor:pointer;white-space:nowrap;box-shadow:0 0 20px rgba(27,26,255,0.3);transition:opacity .15s;display:inline-block}
          .cta-btn:hover{opacity:.85}

          /* Footer */
          .ft{border-top:1px solid var(--border);display:grid;grid-template-columns:1fr auto 1fr;margin-top:6rem;background:var(--bg2)}
          .ft-copy{font-size:11px;color:rgba(255,255,255,0.15);letter-spacing:.06em;text-transform:uppercase;padding:1.4rem 1.8rem;font-family:'Space Grotesk',sans-serif}
          .ft-links{border-left:1px solid var(--border);border-right:1px solid var(--border);display:flex;gap:2rem;align-items:center;padding:1.4rem 2rem}
          .ft-link{font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,0.18);transition:color .2s;font-family:'Space Grotesk',sans-serif}
          .ft-link:hover{color:var(--white)}
          .ft-loc{font-size:11px;color:rgba(255,255,255,0.15);letter-spacing:.06em;text-transform:uppercase;padding:1.4rem 1.8rem;text-align:right;font-family:'Space Grotesk',sans-serif}
        `}</style>
      </Head>

      <Nav />

      <div className="wrap">

        {/* Hero */}
        <div className="eyebrow">HypeForType — Licensing</div>
        <h1 className="h1">What license<br/>do you need?</h1>
        <p className="sub">Have a look at the comparison chart below for an overview of all licenses we provide. All are one-time fee, perpetual — no subscriptions, no renewals.</p>

        {/* Icon row */}
        <div className="icons-row">
          {LICENSES.map(l => (
            <div key={l.key} className="icon-cell">
              <span className="icon-emoji">{l.icon}</span>
              <span className="icon-label">{l.label}</span>
              <span className="icon-price">{l.price}</span>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="sec">License comparison</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th></th>
                {LICENSES.map(l => <th key={l.key}>{l.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((row, i) => (
                <tr key={i}>
                  <td>{row.label}</td>
                  {row.values.map((v, j) => (
                    <td key={j}>
                      {v ? <span className="yes">✓</span> : <span className="no">✕</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* License details */}
        <div className="sec">Licensing details</div>
        <div className="details">
          {DETAILS.map(d => (
            <div key={d.key} className="detail-row">
              <div className="detail-head">
                <span className="detail-icon">{d.icon}</span>
                <span className="detail-label">{d.label}</span>
              </div>
              <ul className="detail-points">
                {d.points.map((p, i) => (
                  <li key={i} className="detail-point">{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="cta-box">
          <div>
            <div className="cta-title">Need a custom license?</div>
            <div className="cta-sub">Enterprise, group, or bespoke arrangements — we'll sort it out.</div>
          </div>
          <Link href="/contact" className="cta-btn">Get in touch →</Link>
        </div>

      </div>

      <footer className="ft">
        <span className="ft-copy">© 2026 HypeForType</span>
        <div className="ft-links">
          {['Licensing','FAQ','Privacy','Contact'].map(t => (
            <Link key={t} href={'/'+t.toLowerCase()} className="ft-link">{t}</Link>
          ))}
        </div>
        <span className="ft-loc">London · Online</span>
      </footer>
    </>
  );
}
