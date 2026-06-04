import Head from 'next/head';
import Link from 'next/link';
import { fonts, pricing } from '../../lib/fonts';
import { useState, useRef, useEffect } from 'react';
import Script from 'next/script';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

const SPECIMENS = {
  'nanami-rounded-pro': [1,2,3,4,5,6].map(i => `/specimens/nanami-rounded-pro-${i}.jpg`),
};

const GLYPH_SETS = {
  UPP: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  LOW: 'abcdefghijklmnopqrstuvwxyz'.split(''),
  NUM: '0123456789'.split(''),
  PUN: '.,;:!?\'"-—…()[]{}@#$%&*+<>='.split(''),
  ACC: 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖØÙÚÛÜÝàáâãäåæçèéêëìíîïñòóôõöøùúûüý'.split(''),
};

const LICENSE_TYPES = [
  { key: 'desktop',    label: 'Desktop',          icon: '🖥' },
  { key: 'webfont',    label: 'Webfont',           icon: '🌐' },
  { key: 'app',        label: 'App',               icon: '📱' },
  { key: 'broadcast',  label: 'Broadcast',         icon: '📺' },
  { key: 'brand',      label: 'Brand Font',        icon: '✦' },
  { key: 'enterprise', label: 'Enterprise',        icon: '🏢' },
  { key: 'enterprise-group', label: 'Group Enterprise', icon: '🏗' },
];

const DESKTOP_SEATS = [1, 2, 5, 10, 25, 50, 100];
const WEB_PAGEVIEWS = ['10,000','50,000','100,000','250,000','500,000','1,000,000','Unlimited'];

const LOREM = `Gentle curves meet geometric precision. Every terminal softens without apology. Every weight carries its own distinct gravity.`;

const BG_SWATCHES   = ['#000000','#0a0a0f','#ffffff','#f5f4f0','#1a1a2e','#0d1117'];
const TEXT_SWATCHES = ['#f2f1eb','#cbced3','#000000','#325eff','#ffffff','#9097a1'];

const C = {
  bg:      '#000000',
  surface: '#0a0a0f',
  srf2:    '#0f0f1a',
  bdr:     '#1c1c2e',
  bdrHi:   '#2a2a45',
  accent:  '#325eff',
  aDim:    'rgba(50,94,255,0.12)',
  aBdr:    'rgba(50,94,255,0.4)',
  aGlow:   '0 0 8px rgba(50,94,255,0.45)',
  t1:      '#cbced3',
  t2:      '#b0b1b6',
  t3:      '#9097a1',
  t4:      '#4a4d56',
  white:   '#f2f1eb',
  sg:      "'Space Grotesk', sans-serif",
  sm:      "'Space Mono', monospace",
  det:     "'Determination', monospace",
};

export default function FontPage({ font }) {
  const [activeStyle,     setActiveStyle]     = useState(0);
  const [previewText,     setPreviewText]      = useState('');
  const [fontSize,        setFontSize]         = useState(72);
  const [letterSpacing,   setLetterSpacing]    = useState(0);
  const [lineHeight,      setLineHeight]       = useState(1.0);
  const [glyphSet,        setGlyphSet]         = useState('UPP');
  const [activeSpecimen,  setActiveSpecimen]   = useState(0);
  const [viewMode,        setViewMode]         = useState('display');
  const [bgColor,         setBgColor]          = useState('#000000');
  const [textColor,       setTextColor]        = useState('#f2f1eb');
  const [focusedGlyph,    setFocusedGlyph]     = useState(null);

  // License state
  const [licenseType,     setLicenseType]      = useState('desktop');
  const [desktopSeats,    setDesktopSeats]      = useState(1);
  const [webPageviews,    setWebPageviews]      = useState('10,000');
  // Weight selection: 'single' | 'full'
  const [weightMode,      setWeightMode]        = useState('single');
  // Which individual weights are selected (indices)
  const [selectedWeights, setSelectedWeights]  = useState(new Set([0]));

  const [paypalReady,     setPaypalReady]      = useState(false);
  const [purchasing,      setPurchasing]       = useState(false);
  const inputRef  = useRef(null);
  const paypalRef = useRef(null);

  const tiers      = pricing[font.isFamily ? 'family' : 'single'];
  const style      = font.styles[activeStyle];
  const fontFamily = `'${font.name}', monospace`;
  const specimens  = SPECIMENS[font.slug] || [];
  const fontIdx    = fonts.findIndex(f => f.slug === font.slug);
  const prevFont   = fonts[(fontIdx - 1 + fonts.length) % fonts.length];
  const nextFont   = fonts[(fontIdx + 1) % fonts.length];
  const allGlyphs  = GLYPH_SETS[glyphSet];
  const DEFAULT_DISPLAY = 'AaBbCcDd';
  const displayText = previewText || DEFAULT_DISPLAY;

  const toggleWeight = (i) => {
    if (weightMode === 'full') return;
    setSelectedWeights(prev => {
      const next = new Set(prev);
      if (next.has(i) && next.size > 1) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  // Base price placeholder logic (will be replaced with real pricing)
  const basePrice = tiers?.desktop?.price || 25;
  const weightCount = weightMode === 'full' ? font.styles.length : selectedWeights.size;
  const estimatedPrice = weightMode === 'full' ? tiers?.bundle?.price || (basePrice * 2) : basePrice * weightCount;

  useEffect(() => {
    if (!paypalReady || !paypalRef.current) return;
    paypalRef.current.innerHTML = '';
    window.paypal.Buttons({
      createOrder: async () => {
        const res = await fetch('/api/paypal-create', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: estimatedPrice, description: `${font.name} — ${licenseType} License` }),
        });
        return (await res.json()).orderId;
      },
      onApprove: async (data) => {
        setPurchasing(true);
        const res = await fetch('/api/paypal-capture', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: data.orderID, fontSlug: font.slug, licenseTier: licenseType }),
        });
        const result = await res.json();
        if (result.success) window.location.href = `/download?token=${result.token}`;
        setPurchasing(false);
      },
      style: { layout:'horizontal', color:'black', shape:'rect', label:'buynow', height:40, tagline:false },
    }).render(paypalRef.current);
  }, [paypalReady, licenseType, font, estimatedPrice]);

  const currentLicense = LICENSE_TYPES.find(l => l.key === licenseType);

  return (
    <>
      <Head>
        <title>{font.name} — HypeForType</title>
        <meta name="description" content={font.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        {font.styles.map(s => (
          <style key={s.file}>{`@font-face{font-family:'${font.name}';src:url('/fonts/${font.slug}/${encodeURIComponent(s.file)}');font-weight:${s.weight};font-style:${s.oblique?'italic':'normal'};font-display:swap;}`}</style>
        ))}
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          html,body{background:#000!important;color:${C.t1}!important;font-family:${C.sg}!important;-webkit-font-smoothing:antialiased;}
          ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#000}::-webkit-scrollbar-thumb{background:${C.bdr}}
          a{text-decoration:none;color:inherit}button{cursor:pointer}
          select,option{background:${C.surface};color:${C.t1};}

          /* NAV */
          .nav{position:sticky;top:0;z-index:200;display:grid;grid-template-columns:auto auto auto 1fr auto auto auto;height:48px;border-bottom:1px solid ${C.bdr};background:rgba(0,0,0,0.93);backdrop-filter:blur(12px);}
          .nav-logo{font-family:${C.det};font-size:.85rem;letter-spacing:.08em;text-transform:uppercase;color:${C.white};padding:0 1.2rem;border-right:1px solid ${C.bdr};display:flex;align-items:center;}
          .nav-back{font-family:${C.sg};font-size:11px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:${C.t4};padding:0 1rem;border-right:1px solid ${C.bdr};display:flex;align-items:center;transition:color .15s;}
          .nav-back:hover{color:${C.t1};}
          .nav-arrow{font-family:${C.sg};font-size:11px;font-weight:500;color:${C.t4};padding:0 .9rem;border-right:1px solid ${C.bdr};display:flex;align-items:center;transition:color .15s;white-space:nowrap;max-width:160px;overflow:hidden;text-overflow:ellipsis;}
          .nav-arrow:hover{color:${C.t1};}
          .nav-arrow-right{border-right:none;border-left:1px solid ${C.bdr};}
          .nav-spacer{flex:1;}
          .nav-trial{font-family:${C.sg};font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:${C.accent};padding:0 1.2rem;border-left:1px solid ${C.bdr};border-right:1px solid ${C.bdr};display:flex;align-items:center;background:none;border-top:none;border-bottom:none;transition:opacity .15s;}
          .nav-trial:hover{opacity:.75;}
          .nav-buy{font-family:${C.sg};font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#fff;background:${C.accent};padding:0 1.4rem;display:flex;align-items:center;transition:opacity .15s;}
          .nav-buy:hover{opacity:.85;}

          /* LAYOUT */
          .page-grid{display:grid;grid-template-columns:1fr 300px;border-bottom:1px solid ${C.bdr};}

          /* CANVAS */
          .canvas{border-right:1px solid ${C.bdr};display:flex;flex-direction:column;transition:background .25s;}
          .toolbar{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;padding:7px 1.2rem;border-bottom:1px solid ${C.bdr};background:rgba(0,0,0,0.5);flex-shrink:0;}
          .tb-lbl{font-family:${C.sm};font-size:9px;color:${C.t4};letter-spacing:.12em;text-transform:uppercase;}
          .tb-sep{width:1px;height:14px;background:${C.bdr};}
          .tb-btn{font-family:${C.sg};font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:4px 10px;border:1px solid ${C.bdr};background:transparent;color:${C.t4};transition:all .15s;}
          .tb-btn:hover{border-color:${C.bdrHi};color:${C.t1};}
          .tb-btn.on{background:${C.aDim};border-color:${C.accent};color:${C.accent};}
          .tb-sw{width:17px;height:17px;border:1px solid ${C.bdr};cursor:pointer;transition:all .15s;flex-shrink:0;}
          .tb-sw:hover,.tb-sw.on{border-color:${C.accent};box-shadow:${C.aGlow};}

          /* Stage */
          .stage-wrap{position:relative;height:280px;flex-shrink:0;}
          .stage-input{position:absolute;inset:0;width:100%;height:100%;background:transparent;border:none;outline:none;resize:none;color:transparent;caret-color:${C.accent};font-size:16px;padding:clamp(1.5rem,3vw,2.5rem);z-index:2;cursor:text;}
          .stage-display{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:clamp(1.5rem,3vw,2.5rem);pointer-events:none;overflow:hidden;}
          .stage-text{width:100%;line-height:.92;letter-spacing:-.02em;word-break:break-word;transition:font-size .08s,letter-spacing .08s,line-height .08s;}
          .stage-body{width:100%;max-width:58ch;transition:font-size .08s,line-height .08s;}
          .stage-hint{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);font-family:${C.sm};font-size:9px;color:${C.t4};letter-spacing:.12em;text-transform:uppercase;pointer-events:none;white-space:nowrap;}

          /* Focused glyph */
          .glyph-focus{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:500;cursor:pointer;}
          .glyph-focus-meta{font-family:${C.sm};font-size:10px;color:${C.t4};letter-spacing:.1em;margin-top:1rem;}

          /* Meta strip */
          .meta-strip{display:flex;border-top:1px solid ${C.bdr};flex-shrink:0;}
          .meta-cell{flex:1;padding:.7rem .9rem;border-right:1px solid ${C.bdr};display:flex;flex-direction:column;gap:3px;}
          .meta-cell:last-child{border-right:none;}
          .meta-val{font-family:${C.det};font-size:1.1rem;color:${C.t1};line-height:1;}
          .meta-key{font-family:${C.sg};font-size:9px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:${C.t4};}

          /* ── GLYPH STRIP (horizontal, below canvas) ── */
          .glyph-strip-section{border-bottom:1px solid ${C.bdr};background:${C.bg};}
          .glyph-strip-toolbar{display:flex;align-items:center;gap:0;border-bottom:1px solid ${C.bdr};}
          .glyph-strip-tab{font-family:${C.sg};font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:8px 18px;background:transparent;color:${C.t4};border:none;border-right:1px solid ${C.bdr};cursor:pointer;transition:all .15s;}
          .glyph-strip-tab:hover{color:${C.t2};}
          .glyph-strip-tab.on{background:${C.aDim};color:${C.accent};}
          .glyph-strip-count{font-family:${C.sm};font-size:9px;color:${C.t4};padding:0 1rem;margin-left:auto;}
          .glyph-strip-grid{
            display:flex;flex-wrap:wrap;
            padding:12px 16px;gap:4px;
          }
          .g-cell{
            width:44px;height:44px;
            display:flex;align-items:center;justify-content:center;
            background:#000;border:1px solid #1c1c2e;
            font-size:1.1rem;color:#fff;
            cursor:pointer;transition:all .12s;flex-shrink:0;
          }
          .g-cell:hover{background:${C.aDim};border-color:${C.accent};transform:scale(1.1);}
          .g-cell-hint{font-family:${C.sm};font-size:9px;color:${C.t4};padding:4px 16px 12px;width:100%;}

          /* PANEL */
          .panel{background:${C.surface};display:flex;flex-direction:column;overflow-y:auto;max-height:calc(100vh - 48px);position:sticky;top:48px;}
          .panel-head{padding:11px 16px;border-bottom:1px solid ${C.bdr};display:flex;justify-content:space-between;align-items:center;flex-shrink:0;}
          .panel-title{font-family:${C.sg};font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${C.t1};}
          .panel-ver{font-family:${C.sm};font-size:9px;color:${C.t4};}
          .ps{padding:12px 16px;border-bottom:1px solid ${C.bdr};}
          .ps:last-child{border-bottom:none;}
          .ps-head{display:flex;justify-content:space-between;margin-bottom:9px;}
          .ps-lbl{font-family:${C.sg};font-size:11px;color:${C.t3};font-weight:500;}
          .ps-val{font-family:${C.sm};font-size:10px;color:${C.t1};}
          .w-select{width:100%;background:${C.srf2};border:1px solid ${C.bdr};color:${C.t1};font-family:${C.sg};font-size:12px;font-weight:500;padding:8px 10px;outline:none;cursor:pointer;transition:border-color .15s;-webkit-appearance:none;appearance:none;}
          .w-select:focus{border-color:${C.accent};}
          .slider{width:100%;height:2px;-webkit-appearance:none;appearance:none;background:${C.bdr};outline:none;border-radius:1px;cursor:pointer;}
          .slider::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;border-radius:50%;background:${C.accent};cursor:pointer;box-shadow:${C.aGlow};}
          .rng-labels{display:flex;justify-content:space-between;margin-top:4px;}
          .rng-labels span{font-family:${C.sm};font-size:9px;color:${C.t4};}

          /* ── LICENSE SECTION ── */
          .license-section{padding:14px 16px;border-bottom:1px solid ${C.bdr};}
          .lic-section-title{font-family:${C.sg};font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.t3};margin-bottom:10px;}

          /* License type dropdown */
          .lic-dropdown-wrap{position:relative;margin-bottom:10px;}
          .lic-dropdown{width:100%;background:${C.srf2};border:1px solid ${C.bdr};color:${C.t1};font-family:${C.sg};font-size:12px;font-weight:600;padding:9px 12px;outline:none;cursor:pointer;transition:border-color .15s;-webkit-appearance:none;appearance:none;}
          .lic-dropdown.selected{border-color:${C.accent};background:${C.aDim};color:${C.accent};}
          .lic-dropdown:focus{border-color:${C.accent};}
          .lic-dropdown-arrow{position:absolute;right:10px;top:50%;transform:translateY(-50%);color:${C.t4};pointer-events:none;font-size:10px;}

          /* Sub-options */
          .lic-sub{margin-top:8px;}
          .lic-sub-label{font-family:${C.sg};font-size:10px;color:${C.t3};margin-bottom:5px;}
          .lic-sub-select{width:100%;background:${C.srf2};border:1px solid ${C.bdr};color:${C.t1};font-family:${C.sg};font-size:11px;padding:7px 10px;outline:none;cursor:pointer;transition:border-color .15s;-webkit-appearance:none;appearance:none;}
          .lic-sub-select:focus{border-color:${C.accent};}

          /* Weight selection */
          .weight-mode-tabs{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:10px;}
          .wm-tab{font-family:${C.sg};font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:7px;border:1px solid ${C.bdr};background:transparent;color:${C.t4};cursor:pointer;transition:all .15s;text-align:center;}
          .wm-tab:hover{border-color:${C.bdrHi};color:${C.t1};}
          .wm-tab.on{background:${C.aDim};border-color:${C.accent};color:${C.accent};}
          .weight-picker{display:flex;flex-direction:column;gap:3px;max-height:160px;overflow-y:auto;}
          .wp-item{display:flex;align-items:center;justify-content:space-between;padding:6px 8px;border:1px solid ${C.bdr};cursor:pointer;transition:all .15s;}
          .wp-item:hover{border-color:${C.bdrHi};}
          .wp-item.on{background:${C.aDim};border-color:${C.accent};}
          .wp-item-name{font-family:${C.sg};font-size:11px;font-weight:500;color:${C.t2};}
          .wp-item-num{font-family:${C.sm};font-size:9px;color:${C.t4};}
          .wp-item-check{width:14px;height:14px;border:1px solid ${C.bdr};background:transparent;transition:all .15s;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
          .wp-item.on .wp-item-check{background:${C.accent};border-color:${C.accent};}
          .wp-item.on .wp-item-name{color:${C.white};}

          /* Price display */
          .price-block{padding:14px 16px;border-bottom:1px solid ${C.bdr};}
          .price-context{font-family:${C.sg};font-size:10px;color:${C.t4};margin-bottom:6px;}
          .price-big{font-family:${C.det};font-size:2.6rem;color:${C.white};line-height:1;margin-bottom:2px;}
          .price-note{font-family:${C.sg};font-size:10px;color:${C.t4};margin-bottom:14px;font-style:italic;}

          /* Paypal + trial */
          .buy-actions{padding:14px 16px;border-bottom:1px solid ${C.bdr};}
          .trial-btn{width:100%;font-family:${C.sg};font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:${C.t3};background:transparent;border:1px solid ${C.bdr};padding:9px;transition:all .15s;margin-top:6px;display:block;text-align:center;}
          .trial-btn:hover{border-color:${C.accent};color:${C.accent};}
          .trust-list{padding:12px 16px;display:flex;flex-direction:column;gap:7px;border-bottom:1px solid ${C.bdr};}
          .trust-item{display:flex;align-items:flex-start;gap:8px;}
          .trust-dot{width:4px;height:4px;border-radius:50%;background:${C.accent};flex-shrink:0;margin-top:5px;box-shadow:${C.aGlow};}
          .trust-txt{font-family:${C.sg};font-size:11px;color:${C.t3};line-height:1.5;}

          /* Below fold */
          .section-hd{font-family:${C.sg};font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${C.accent};}
          .specimens-sec{padding:clamp(1.5rem,3vw,2.5rem);border-bottom:1px solid ${C.bdr};}
          .spec-main{margin-bottom:.8rem;border:1px solid ${C.bdr};overflow:hidden;}
          .spec-main img{width:100%;display:block;}
          .spec-thumbs{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;}
          .spec-thumb{cursor:pointer;border:2px solid transparent;overflow:hidden;transition:border-color .15s;}
          .spec-thumb.on{border-color:${C.accent};}
          .spec-thumb img{width:100%;display:block;aspect-ratio:4/3;object-fit:cover;filter:brightness(.75);transition:all .2s;}
          .spec-thumb:hover img,.spec-thumb.on img{filter:brightness(1);}
          .weights-sec{border-bottom:1px solid ${C.bdr};}
          .wr{display:grid;grid-template-columns:110px 1fr 38px;align-items:center;gap:1rem;padding:.75rem clamp(1.2rem,3vw,2.5rem);border-bottom:1px solid ${C.bdr};cursor:pointer;transition:background .12s;}
          .wr:hover{background:${C.surface};}
          .wr.on{background:${C.srf2};}
          .wr-name{font-family:${C.sg};font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:${C.t3};}
          .wr-sample{font-size:clamp(1.2rem,2.5vw,2.2rem);line-height:1;color:${C.t1};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;transition:color .12s;}
          .wr:hover .wr-sample{color:${C.white};}
          .wr-num{font-family:${C.sm};font-size:9px;color:${C.t4};text-align:right;}

          /* ABC ticker */
          .abc-ticker{overflow:hidden;padding:10px 0;border-bottom:1px solid ${C.bdr};}
          .abc-track{display:flex;gap:1.2rem;animation:tickr 20s linear infinite;white-space:nowrap;}
          .abc-char{font-size:1.8rem;color:rgba(50,94,255,0.22);letter-spacing:.05em;}
          @keyframes tickr{from{transform:translateX(0)}to{transform:translateX(-50%)}}

          /* Footer */
          .fp-ft{display:flex;justify-content:space-between;align-items:center;padding:1rem 1.4rem;border-top:1px solid ${C.bdr};background:${C.surface};}
          .fp-ft span{font-family:${C.sg};font-size:11px;color:${C.t4};text-transform:uppercase;letter-spacing:.06em;}
          .fp-ft-links{display:flex;gap:1.5rem;}
          .fp-ft a{font-family:${C.sg};font-size:11px;font-weight:500;color:${C.t4};text-transform:uppercase;letter-spacing:.08em;transition:color .15s;}
          .fp-ft a:hover{color:${C.t1};}
        `}</style>
      </Head>

      <Script src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=GBP`} onReady={() => setPaypalReady(true)} />

      {/* NAV */}
      <nav className="nav">
        <Link href="/" className="nav-logo">HypeForType</Link>
        <Link href="/" className="nav-back">← All</Link>
        <Link href={`/typefaces/${prevFont.slug}`} className="nav-arrow">‹ {prevFont.name}</Link>
        <div className="nav-spacer" />
        <Link href={`/typefaces/${nextFont.slug}`} className="nav-arrow nav-arrow-right">{nextFont.name} ›</Link>
        <button className="nav-trial" onClick={() => window.location.href=`/api/trial?slug=${font.slug}`}>Trial</button>
        <a href="#buy" className="nav-buy">Buy →</a>
      </nav>

      {/* MAIN GRID */}
      <div className="page-grid">

        {/* LEFT CANVAS */}
        <div className="canvas" style={{ background: bgColor }}>

          {/* Fullscreen glyph */}
          {focusedGlyph && (
            <div className="glyph-focus" onClick={() => setFocusedGlyph(null)} style={{ background: bgColor + 'f2' }}>
              <div style={{ fontFamily, fontWeight: style.weight, fontSize:'clamp(10rem,22vw,18rem)', lineHeight:1, color: textColor }}>
                {focusedGlyph}
              </div>
              <div className="glyph-focus-meta">
                U+{focusedGlyph.charCodeAt(0).toString(16).toUpperCase().padStart(4,'0')} · Click to close
              </div>
            </div>
          )}

          {/* Toolbar */}
          <div className="toolbar">
            <span className="tb-lbl">View</span>
            {['display','headline','body'].map(m => (
              <button key={m} className={`tb-btn${viewMode===m?' on':''}`} onClick={() => setViewMode(m)}>
                {m[0].toUpperCase()+m.slice(1)}
              </button>
            ))}
            <div className="tb-sep" />
            <span className="tb-lbl">BG</span>
            {BG_SWATCHES.map(c => (
              <div key={c} className={`tb-sw${bgColor===c?' on':''}`} style={{ background:c }} onClick={() => setBgColor(c)} />
            ))}
            <div className="tb-sep" />
            <span className="tb-lbl">Text</span>
            {TEXT_SWATCHES.map(c => (
              <div key={c} className={`tb-sw${textColor===c?' on':''}`} style={{ background:c }} onClick={() => setTextColor(c)} />
            ))}
          </div>

          {/* Stage */}
          <div className="stage-wrap" style={{ background: bgColor }}>
            <textarea ref={inputRef} className="stage-input" value={previewText} onChange={e => setPreviewText(e.target.value)} maxLength={80} spellCheck={false} autoCorrect="off" autoComplete="off" />
            <div className="stage-display">
              {viewMode === 'body' ? (
                <div className="stage-body" style={{ fontFamily, fontWeight:style.weight, fontSize:Math.min(fontSize,20)+'px', lineHeight:lineHeight+0.6, color:textColor }}>
                  {previewText || LOREM}
                </div>
              ) : (
                <div className="stage-text" style={{ fontFamily, fontWeight:style.weight, fontStyle:style.oblique?'italic':'normal', fontSize:(viewMode==='headline'?Math.max(fontSize,64):fontSize)+'px', letterSpacing:letterSpacing+'%', lineHeight:lineHeight, color:textColor }}>
                  {displayText}
                </div>
              )}
            </div>
            {!previewText && <div className="stage-hint">Click anywhere to type</div>}
          </div>

          {/* Meta strip */}
          <div className="meta-strip">
            {[[font.styles.length,'Weights'],[font.glyphCount+'+','Glyphs'],[font.released,'Released'],[font.pro?'Pro':font.hot?'New':'Retail','Status']].map(([v,k]) => (
              <div key={k} className="meta-cell"><span className="meta-val">{v}</span><span className="meta-key">{k}</span></div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Type Panel</span>
            <span className="panel-ver">V1.0</span>
          </div>

          {/* Weight */}
          <div className="ps">
            <div className="ps-head"><span className="ps-lbl">Weight</span><span className="ps-val">{style.name} · {style.weight}</span></div>
            <select className="w-select" value={activeStyle} onChange={e => setActiveStyle(+e.target.value)}>
              {font.styles.map((s,i) => <option key={i} value={i}>{s.name} · {s.weight}</option>)}
            </select>
          </div>

          {/* Size */}
          <div className="ps">
            <div className="ps-head"><span className="ps-lbl">Size</span><span className="ps-val">{fontSize}px</span></div>
            <input type="range" className="slider" min="12" max="200" value={fontSize} onChange={e => setFontSize(+e.target.value)} />
            <div className="rng-labels"><span>12</span><span>200</span></div>
          </div>

          {/* Letter Spacing */}
          <div className="ps">
            <div className="ps-head"><span className="ps-lbl">Letter Spacing</span><span className="ps-val">{letterSpacing>0?'+':''}{letterSpacing}%</span></div>
            <input type="range" className="slider" min="-10" max="30" value={letterSpacing} onChange={e => setLetterSpacing(+e.target.value)} />
            <div className="rng-labels"><span>−10</span><span>+30</span></div>
          </div>

          {/* Line Height */}
          <div className="ps">
            <div className="ps-head"><span className="ps-lbl">Line Height</span><span className="ps-val">{(lineHeight+(viewMode==='body'?.6:0)).toFixed(1)}</span></div>
            <input type="range" className="slider" min="5" max="25" value={Math.round(lineHeight*10)} onChange={e => setLineHeight(+e.target.value/10)} />
            <div className="rng-labels"><span>0.5</span><span>2.5</span></div>
          </div>

          {/* ── LICENSE & PURCHASE ── */}
          <div className="license-section" id="buy">
            <div className="lic-section-title">License Type</div>

            {/* License dropdown */}
            <div className="lic-dropdown-wrap">
              <select className={`lic-dropdown selected`} value={licenseType} onChange={e => setLicenseType(e.target.value)}>
                {LICENSE_TYPES.map(l => (
                  <option key={l.key} value={l.key}>{l.icon}  {l.label}</option>
                ))}
              </select>
              <span className="lic-dropdown-arrow">▾</span>
            </div>

            {/* Desktop sub-option: seats */}
            {licenseType === 'desktop' && (
              <div className="lic-sub">
                <div className="lic-sub-label">Number of seats (installations)</div>
                <div className="lic-dropdown-wrap">
                  <select className="lic-sub-select" value={desktopSeats} onChange={e => setDesktopSeats(+e.target.value)}>
                    {DESKTOP_SEATS.map(s => <option key={s} value={s}>{s} {s === 1 ? 'seat' : 'seats'}</option>)}
                  </select>
                  <span className="lic-dropdown-arrow">▾</span>
                </div>
              </div>
            )}

            {/* Webfont sub-option: pageviews */}
            {licenseType === 'webfont' && (
              <div className="lic-sub">
                <div className="lic-sub-label">Monthly pageviews</div>
                <div className="lic-dropdown-wrap">
                  <select className="lic-sub-select" value={webPageviews} onChange={e => setWebPageviews(e.target.value)}>
                    {WEB_PAGEVIEWS.map(p => <option key={p} value={p}>{p} pageviews/mo</option>)}
                  </select>
                  <span className="lic-dropdown-arrow">▾</span>
                </div>
              </div>
            )}

            {/* License description */}
            <div style={{ fontFamily:C.sg, fontSize:11, color:C.t4, marginTop:8, lineHeight:1.5 }}>
              {licenseType === 'desktop' && `For installation on up to ${desktopSeats} computer${desktopSeats > 1 ? 's' : ''}.`}
              {licenseType === 'webfont' && `For use on websites serving up to ${webPageviews} pageviews/month.`}
              {licenseType === 'app' && 'For embedding in a single mobile or desktop application.'}
              {licenseType === 'broadcast' && 'For use in TV, film, streaming and broadcast productions.'}
              {licenseType === 'brand' && 'For use as a primary brand typeface across all media.'}
              {licenseType === 'enterprise' && 'Unlimited seats, domains and usage within one organisation.'}
              {licenseType === 'enterprise-group' && 'Unlimited usage across multiple organisations or subsidiaries.'}
            </div>
          </div>

          {/* Weight selection */}
          <div className="license-section">
            <div className="lic-section-title">Weight Selection</div>
            <div className="weight-mode-tabs">
              <button className={`wm-tab${weightMode==='single'?' on':''}`} onClick={() => setWeightMode('single')}>
                Individual
              </button>
              <button className={`wm-tab${weightMode==='full'?' on':''}`} onClick={() => setWeightMode('full')}>
                Full Family
              </button>
            </div>
            {weightMode === 'single' ? (
              <div className="weight-picker">
                {font.styles.map((s,i) => (
                  <div key={i} className={`wp-item${selectedWeights.has(i)?' on':''}`} onClick={() => toggleWeight(i)}>
                    <span className="wp-item-name" style={{ fontFamily, fontWeight:s.weight }}>{s.name}</span>
                    <span className="wp-item-num">{s.weight}</span>
                    <div className="wp-item-check">
                      {selectedWeights.has(i) && <span style={{ color:'#fff', fontSize:9 }}>✓</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontFamily:C.sg, fontSize:11, color:C.t2, padding:'6px 0' }}>
                All {font.styles.length} weights included — best value.
              </div>
            )}
          </div>

          {/* Price */}
          <div className="price-block">
            <div className="price-context">
              {weightMode === 'full' ? `Full family · ${font.styles.length} weights` : `${weightCount} weight${weightCount>1?'s':''} · ${currentLicense?.label}`}
            </div>
            <div className="price-big">£{estimatedPrice}</div>
            <div className="price-note">Pricing shown is indicative — final pricing coming soon</div>
          </div>

          {/* Actions */}
          <div className="buy-actions">
            <div ref={paypalRef} style={{ minHeight:44 }}>
              {purchasing && <span style={{ fontFamily:C.sg, fontSize:12, color:C.t3 }}>Processing...</span>}
            </div>
            <button className="trial-btn" onClick={() => window.location.href=`/api/trial?slug=${font.slug}`}>
              Free Trial Download
            </button>
          </div>

          {/* Trust */}
          <div className="trust-list">
            {[`${font.styles.length} font files available`,`${font.glyphCount}+ glyphs`,'Instant download','Perpetual commercial license','PayPal Secure'].map((item,i) => (
              <div key={i} className="trust-item">
                <div className="trust-dot" />
                <span className="trust-txt">{item}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── GLYPH STRIP — full width horizontal below the grid ── */}
      <div className="glyph-strip-section">
        <div className="glyph-strip-toolbar">
          {Object.keys(GLYPH_SETS).map(k => (
            <button key={k} className={`glyph-strip-tab${glyphSet===k?' on':''}`} onClick={() => setGlyphSet(k)}>
              {k === 'UPP' ? 'Uppercase' : k === 'LOW' ? 'Lowercase' : k === 'NUM' ? 'Numerals' : k === 'PUN' ? 'Punctuation' : 'Accents'}
            </button>
          ))}
          <span className="glyph-strip-count">{allGlyphs.length} glyphs</span>
        </div>
        <div className="glyph-strip-grid">
          {allGlyphs.map((g,i) => (
            <div key={i} className="g-cell" style={{ fontFamily, fontWeight:style.weight }} onClick={() => setFocusedGlyph(g)} title={`U+${g.charCodeAt(0).toString(16).toUpperCase().padStart(4,'0')}`}>
              {g}
            </div>
          ))}
        </div>
        <div className="g-cell-hint">Click any glyph to enlarge · {font.glyphCount}+ total glyphs in this font</div>
      </div>

      {/* ABC TICKER */}
      <div className="abc-ticker">
        <div className="abc-track">
          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('').map((ch,i) => (
            <span key={i} className="abc-char" style={{ fontFamily, fontWeight:style.weight }}>{ch}</span>
          ))}
        </div>
      </div>

      {/* SPECIMENS */}
      {specimens.length > 0 && (
        <div className="specimens-sec">
          <div className="section-hd" style={{ marginBottom:'1.2rem' }}>Type Specimens</div>
          <div className="spec-main"><img src={specimens[activeSpecimen]} alt={`${font.name} specimen`} /></div>
          <div className="spec-thumbs">
            {specimens.map((src,i) => (
              <div key={i} className={`spec-thumb${activeSpecimen===i?' on':''}`} onClick={() => setActiveSpecimen(i)}>
                <img src={src} alt={`specimen ${i+1}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALL WEIGHTS */}
      <div className="weights-sec">
        <div style={{ padding:'9px clamp(1.2rem,3vw,2.5rem)', borderBottom:`1px solid ${C.bdr}`, borderTop:`1px solid ${C.bdr}` }}>
          <div className="section-hd">All Weights</div>
        </div>
        {font.styles.map((s,i) => (
          <div key={i} className={`wr${activeStyle===i?' on':''}`} onClick={() => setActiveStyle(i)}>
            <span className="wr-name">{s.name}</span>
            <span className="wr-sample" style={{ fontFamily, fontWeight:s.weight, fontStyle:s.oblique?'italic':'normal' }}>
              {previewText || 'The quick brown fox'}
            </span>
            <span className="wr-num">{s.weight}</span>
          </div>
        ))}
      </div>

      <footer className="fp-ft">
        <span>© 2026 HypeForType · {font.name}</span>
        <div className="fp-ft-links">
          {['Licensing','FAQ','Contact'].map(t => <Link key={t} href={'/'+t.toLowerCase()}>{t}</Link>)}
        </div>
      </footer>
    </>
  );
}

export async function getStaticPaths() {
  return { paths: fonts.map(f => ({ params: { slug: f.slug } })), fallback: false };
}
export async function getStaticProps({ params }) {
  const font = fonts.find(f => f.slug === params.slug);
  return font ? { props: { font } } : { notFound: true };
}
