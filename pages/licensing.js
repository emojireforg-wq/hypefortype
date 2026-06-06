import Head from 'next/head';
import Link from 'next/link';
import Nav from '../components/Nav';

const LICENSES = [
  { key:'desktop',    label:'Desktop',      price:'From £25', icon:'/icons/others-52.svg' },
  { key:'desktop2',   label:'Desktop Pro',  price:'From £35', icon:'/icons/tech-06.svg'   },
  { key:'webfont',    label:'Webfont',      price:'From £45', icon:'/icons/phone-13.svg'  },
  { key:'web',        label:'Web App',      price:'From £35', icon:'/icons/grid-05.svg'   },
  { key:'app',        label:'App',          price:'From £55', icon:'/icons/tech-07.svg'   },
  { key:'server',     label:'Server',       price:'From £75', icon:'/icons/grid-08.svg'   },
  { key:'broadcast',  label:'Broadcast',    price:'From £85', icon:'/icons/phone-05.svg'  },
  { key:'brand',      label:'Brand Font',   price:'From £95', icon:'/icons/others-08.svg' },
  { key:'enterprise', label:'Corporate',    price:'POA',      icon:'/icons/others-24.svg' },
  { key:'annual',     label:'Annual',       price:'From £15', icon:'/icons/photo-09.svg'  },
  { key:'trial',      label:'Trial',        price:'Free',     icon:'/icons/photo-04.svg'  },
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
    key:'desktop', label:'Desktop', icon:'/icons/others-52.svg',
    points:[
      'For freelancers, studios, agencies, and companies.',
      'Create documents and static images for print or digital use (PDF, JPEG, PNG etc.)',
      'One-time fee, perpetual license.',
      'Does not cover logo design, web embedding, apps, eBooks, video, or server use.',
      'You may not resell or redistribute font files to third parties.',
    ],
  },
  {
    key:'web', label:'Web App', icon:'/icons/grid-05.svg',
    points:[
      'Embed font files via @font-face as dynamic text on a website.',
      '1 license covers 1 domain or URL.',
      'One-time fee, perpetual license.',
      'Cannot be used to create graphics or logos for display on surfaces or products.',
      'Does not apply to apps, servers, or video/broadcast use.',
    ],
  },
  {
    key:'app', label:'App', icon:'/icons/tech-07.svg',
    points:[
      'Embed fonts in software, mobile apps, games, internal servers, and eBooks.',
      'One license covers one app/software/eBook title across all platforms and updates.',
      'One-time fee, perpetual license.',
      'May not be used in apps that allow end users to create custom vector typesetting.',
      'May not resell or redistribute font files as part of app source code.',
    ],
  },
  {
    key:'broadcast', label:'Broadcast', icon:'/icons/phone-05.svg',
    points:[
      'Use fonts in TV, cinema, or Video On Demand streaming productions.',
      'One license per single title (film, series, or campaign). Multiple titles need multiple licenses.',
      'One-time fee, perpetual license.',
      'May not be used to create documents, static images, or logos.',
      'May not embed in websites, apps, eBooks, or other software.',
    ],
  },
  {
    key:'brand', label:'Brand Font', icon:'/icons/others-08.svg',
    points:[
      'Design a logo, wordmark, or device mark with permission to trademark it.',
      'You may modify font outlines exclusively for logo creation purposes.',
      'One-time fee, perpetual license.',
      'Does not cover web embedding, apps, eBooks, broadcast, or server use.',
      'May not resell or redistribute font files to third parties including clients.',
    ],
  },
  {
    key:'enterprise', label:'Corporate', icon:'/icons/others-24.svg',
    points:[
      'Single corporate entity with unlimited employees and CPUs.',
      'Includes affiliated suppliers: agencies, advertisers, retailers, and service providers.',
      'Covers desktop, web, and device uses for full 360° brand communications.',
      'One-time fee, perpetual license.',
      'Does not cover OEM (Original Equipment Manufacturer) usage.',
    ],
  },
  {
    key:'trial', label:'Trial', icon:'/icons/photo-04.svg',
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
          html{scroll-behavior:smooth}
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
          .sub{font-size:17px;color:var(--t2);line-height:1.75;max-width:580px;margin-bottom:2.5rem}

          /* Section label */
          .sec{font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--t3);padding-bottom:.7rem;border-bottom:1px solid var(--border);margin-bottom:1.5rem;margin-top:3rem}

          /* License type icons row */
          .icons-row{display:grid;grid-template-columns:repeat(6,1fr);gap:1px;background:var(--border);border:1px solid var(--border);margin-bottom:3rem}
          @media(max-width:700px){.icons-row{grid-template-columns:repeat(3,1fr)}}
          .icon-cell{background:var(--bg2);padding:1.8rem 1.2rem;text-align:center;display:flex;flex-direction:column;align-items:center;gap:.5rem;transition:background .15s;cursor:pointer}
          .icon-cell:hover{background:#0a0b1f}
          .icon-img{width:32px;height:32px}
          .icon-label{font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--white)}
          .icon-price{font-family:'Space Mono',monospace;font-size:11px;color:var(--blue);letter-spacing:.04em}

          /* Comparison table */
          .table-wrap{overflow-x:auto;margin-bottom:0}
          table{width:100%;border-collapse:collapse;min-width:700px}
          thead th{font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:.9rem .8rem;text-align:center;border-bottom:1px solid var(--blue);color:var(--white);background:var(--bg2)}
          thead th:first-child{text-align:left;color:var(--t3);border-bottom-color:var(--border);padding-left:0;min-width:160px}
          tbody td{padding:.7rem .8rem;border-bottom:1px solid var(--border);text-align:center;font-size:16px}
          tbody td:first-child{text-align:left;font-size:14px;color:var(--t2);font-family:'Space Grotesk',sans-serif;padding-left:0}
          tbody tr:hover td{background:rgba(27,26,255,0.04)}
          .yes{color:var(--blue)}
          .no{color:var(--t4)}

          /* Details */
          .details{display:flex;flex-direction:column;gap:0}
          .detail-row{display:grid;grid-template-columns:220px 1fr;gap:2.5rem;padding:2rem 0;border-bottom:1px solid var(--border);align-items:start}
          @media(max-width:600px){.detail-row{grid-template-columns:1fr}}
          .detail-head{display:flex;align-items:center;gap:.7rem}
          .detail-icon{font-size:1.4rem}
          .detail-label{font-family:'Space Mono',monospace;font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--white)}
          .detail-points{list-style:none;display:flex;flex-direction:column;gap:.4rem}
          .detail-point{font-size:14px;color:var(--t2);line-height:1.7;padding-left:1.2rem;position:relative;margin-bottom:.2rem}
          .detail-point::before{content:'—';position:absolute;left:0;color:var(--t4)}

          /* CTA */
          .cta-box{border:1px solid var(--border);padding:2rem;display:flex;justify-content:space-between;align-items:center;gap:2rem;flex-wrap:wrap;margin-top:3rem}
          .cta-title{font-size:20px;font-weight:700;margin-bottom:.4rem}
          .cta-sub{font-size:15px;color:var(--t2)}
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
            <a key={l.key} className="icon-cell" href={`#license-${l.key}`} style={{textDecoration:"none"}}>
              <img src={l.icon} alt={l.label} style={{width:'32px',height:'32px',filter:'invert(1) sepia(1) saturate(5) hue-rotate(200deg)',opacity:0.85}} />
              <span className="icon-label">{l.label}</span>
              <span className="icon-price">{l.price}</span>
            </a>
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
            <div key={d.key} id={`license-${d.key}`} className="detail-row" style={{scrollMarginTop:"120px"}}>
              <div className="detail-head">
                <img src={d.icon} alt={d.label} style={{width:'24px',height:'24px',filter:'invert(1) sepia(1) saturate(5) hue-rotate(200deg)',opacity:0.85,flexShrink:0}} />
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
