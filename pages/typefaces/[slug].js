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
  { key:'desktop',   label:'Desktop',         desc:'For installation on computers.' },
  { key:'webfont',   label:'Webfont',          desc:'For use on websites.' },
  { key:'app',       label:'App',              desc:'For embedding in a mobile or desktop app.' },
  { key:'broadcast', label:'Broadcast',        desc:'For TV, film and streaming.' },
  { key:'brand',     label:'Brand Font',       desc:'As a primary brand typeface.' },
  { key:'enterprise',label:'Enterprise',       desc:'Unlimited use within one organisation.' },
  { key:'group',     label:'Group Enterprise', desc:'Unlimited use across multiple organisations.' },
];

const DESKTOP_SEATS  = [1,2,5,10,25,50,100];
const WEB_PAGEVIEWS  = ['10,000','50,000','100,000','250,000','500,000','1,000,000','Unlimited'];
const BG_SWATCHES    = ['#000000','#0a0a0f','#ffffff','#f5f4f0','#1a1a2e','#0d1117'];
const TEXT_SWATCHES  = ['#f2f1eb','#cbced3','#000000','#325eff','#ffffff','#9097a1'];
const JP_PROVERB     = '七転び八起き — Fall seven times, stand up eight.';

const A = '#325eff';
const ADIM = 'rgba(50,94,255,0.12)';
const BDR = '#1c1c2e';

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
  const [licenseType,     setLicenseType]      = useState('desktop');
  const [desktopSeats,    setDesktopSeats]     = useState(1);
  const [webPageviews,    setWebPageviews]     = useState('10,000');
  const [weightMode,      setWeightMode]       = useState('single');
  const [selectedWeights, setSelectedWeights] = useState(new Set([0]));
  const [addedIdx,        setAddedIdx]         = useState(null);
  const [toastMsg,        setToastMsg]         = useState('');
  const [showToast,       setShowToast]        = useState(false);
  const [paypalReady,     setPaypalReady]      = useState(false);
  const [purchasing,      setPurchasing]       = useState(false);
  const [cartCount,       setCartCount]        = useState(0);
  const paypalRef = useRef(null);

  const tiers      = pricing[font.isFamily ? 'family' : 'single'];
  const style      = font.styles[activeStyle];
  const ff         = `'${font.name}', monospace`;
  const specimens  = SPECIMENS[font.slug] || [];
  const fi         = fonts.findIndex(f => f.slug === font.slug);
  const prevFont   = fonts[(fi - 1 + fonts.length) % fonts.length];
  const nextFont   = fonts[(fi + 1) % fonts.length];
  const allGlyphs  = GLYPH_SETS[glyphSet];
  const weightCount = weightMode === 'full' ? font.styles.length : selectedWeights.size;
  const basePrice  = tiers?.desktop?.price || 25;
  const estPrice   = weightMode === 'full' ? (basePrice * 2) : (basePrice * weightCount);

  const toggleWeight = (i) => {
    setSelectedWeights(prev => {
      const n = new Set(prev);
      if (n.has(i) && n.size > 1) n.delete(i); else n.add(i);
      return n;
    });
  };

  const addToCart = (styleIdx, e) => {
    e.stopPropagation();
    const s = font.styles[styleIdx];
    const item = { slug: font.slug, name: font.name, style: s.name, weight: s.weight, license: licenseType };
    try {
      const existing = JSON.parse(localStorage.getItem('hft_cart') || '[]');
      localStorage.setItem('hft_cart', JSON.stringify([...existing, item]));
    } catch(_) {}
    setAddedIdx(styleIdx);
    setToastMsg(`${font.name} ${s.name} added`);
    setShowToast(true);
    setTimeout(() => { setShowToast(false); setAddedIdx(null); }, 2500);
  };

  useEffect(() => {
    try { setCartCount(JSON.parse(localStorage.getItem('hft_cart') || '[]').length); } catch(_) {}
  }, [addedIdx]);

  useEffect(() => {
    if (!paypalReady || !paypalRef.current) return;
    paypalRef.current.innerHTML = '';
    window.paypal.Buttons({
      createOrder: async () => {
        const res = await fetch('/api/paypal-create', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: estPrice, description: `${font.name} — ${licenseType}` }),
        });
        return (await res.json()).orderId;
      },
      onApprove: async (data) => {
        setPurchasing(true);
        const res = await fetch('/api/paypal-capture', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: data.orderID, fontSlug: font.slug, licenseTier: licenseType }),
        });
        const r = await res.json();
        if (r.success) window.location.href = `/download?token=${r.token}`;
        setPurchasing(false);
      },
      style: { layout:'horizontal', color:'black', shape:'rect', label:'buynow', height:40, tagline:false },
    }).render(paypalRef.current);
  }, [paypalReady, licenseType, estPrice, font]);

  const sg = "'Space Grotesk', sans-serif";
  const sm = "'Space Mono', monospace";
  const det = "'Determination', monospace";

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
          html,body{background:#000!important;color:#cbced3!important;font-family:'Space Grotesk',sans-serif!important;-webkit-font-smoothing:antialiased;}
          ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#000}::-webkit-scrollbar-thumb{background:#1c1c2e}
          a{text-decoration:none;color:inherit}button{cursor:pointer}select,option{background:#0a0a0f;color:#cbced3;}

          /* NAV — logo centre, left/right groups */
          .nav{position:sticky;top:0;z-index:200;display:grid;grid-template-columns:1fr auto 1fr;height:48px;border-bottom:1px solid #1c1c2e;background:rgba(0,0,0,0.93);backdrop-filter:blur(12px);}
          .nav-left{display:flex;align-items:stretch;}
          .nav-back{font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:#4a4d56;padding:0 1rem;border-right:1px solid #1c1c2e;display:flex;align-items:center;transition:color .15s;}
          .nav-back:hover{color:#cbced3;}
          .nav-font-name{font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:600;color:#b0b1b6;padding:0 1rem;display:flex;align-items:center;}
          .nav-logo{font-family:'Determination',monospace;font-size:.85rem;letter-spacing:.08em;text-transform:uppercase;color:#f2f1eb;padding:0 1.6rem;border-left:1px solid #1c1c2e;border-right:1px solid #1c1c2e;display:flex;align-items:center;justify-content:center;white-space:nowrap;}
          .nav-right{display:flex;align-items:stretch;justify-content:flex-end;}
          .nav-arrow{font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:500;color:#4a4d56;padding:0 .9rem;border-left:1px solid #1c1c2e;display:flex;align-items:center;transition:color .15s;white-space:nowrap;max-width:150px;overflow:hidden;text-overflow:ellipsis;}
          .nav-arrow:hover{color:#cbced3;}
          .nav-trial{font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#325eff;padding:0 1.2rem;border-left:1px solid #1c1c2e;border-right:1px solid #1c1c2e;display:flex;align-items:center;background:none;border-top:none;border-bottom:none;transition:opacity .15s;}
          .nav-trial:hover{opacity:.75;}
          .nav-buy{font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#fff;background:#325eff;padding:0 1.4rem;display:flex;align-items:center;transition:opacity .15s;}
          .nav-buy:hover{opacity:.85;}

          /* MAIN GRID */
          .page-grid{display:grid;grid-template-columns:1fr 300px;border-bottom:1px solid #1c1c2e;}

          /* CANVAS */
          .canvas{border-right:1px solid #1c1c2e;display:flex;flex-direction:column;transition:background .25s;}
          .toolbar{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;padding:7px 1.2rem;border-bottom:1px solid #1c1c2e;background:rgba(0,0,0,0.5);}
          .tb-lbl{font-family:'Space Mono',monospace;font-size:9px;color:#4a4d56;letter-spacing:.12em;text-transform:uppercase;}
          .tb-sep{width:1px;height:14px;background:#1c1c2e;}
          .tb-btn{font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:4px 10px;border:1px solid #1c1c2e;background:transparent;color:#4a4d56;transition:all .15s;}
          .tb-btn:hover{border-color:#2a2a45;color:#cbced3;}
          .tb-btn.on{background:rgba(50,94,255,0.12);border-color:#325eff;color:#325eff;}
          .tb-sw{width:17px;height:17px;border:1px solid #1c1c2e;cursor:pointer;transition:all .15s;flex-shrink:0;}
          .tb-sw:hover,.tb-sw.on{border-color:#325eff;box-shadow:0 0 8px rgba(50,94,255,0.45);}

          /* Stage */
          .stage-wrap{position:relative;height:280px;flex-shrink:0;}
          .stage-input{position:absolute;inset:0;width:100%;height:100%;background:transparent;border:none;outline:none;resize:none;color:transparent;caret-color:#325eff;font-size:16px;padding:clamp(1.5rem,3vw,2.5rem);z-index:2;cursor:text;spellcheck:false;}
          .stage-display{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:clamp(1.5rem,3vw,2.5rem);pointer-events:none;overflow:hidden;}
          .stage-text{width:100%;line-height:.92;letter-spacing:-.02em;word-break:break-word;}
          .stage-body{width:100%;max-width:58ch;}
          .stage-hint{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);font-family:'Space Mono',monospace;font-size:9px;color:#4a4d56;letter-spacing:.12em;text-transform:uppercase;pointer-events:none;white-space:nowrap;}

          /* Glyph focus overlay */
          .glyph-focus{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:500;cursor:pointer;}
          .glyph-focus-meta{font-family:'Space Mono',monospace;font-size:10px;color:#4a4d56;letter-spacing:.1em;margin-top:1rem;}

          /* Meta strip */
          .meta-strip{display:flex;border-top:1px solid #1c1c2e;}
          .meta-cell{flex:1;padding:.7rem .9rem;border-right:1px solid #1c1c2e;display:flex;flex-direction:column;gap:3px;}
          .meta-cell:last-child{border-right:none;}
          .meta-val{font-family:'Determination',monospace;font-size:1.1rem;color:#cbced3;line-height:1;}
          .meta-key{font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#4a4d56;}

          /* PANEL */
          .panel{background:#0a0a0f;display:flex;flex-direction:column;overflow-y:auto;max-height:calc(100vh - 48px);position:sticky;top:48px;}
          .panel-head{padding:11px 16px;border-bottom:1px solid #1c1c2e;display:flex;justify-content:space-between;align-items:center;}
          .panel-title{font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#cbced3;}
          .panel-ver{font-family:'Space Mono',monospace;font-size:9px;color:#4a4d56;}
          .ps{padding:12px 16px;border-bottom:1px solid #1c1c2e;}
          .ps-head{display:flex;justify-content:space-between;margin-bottom:9px;}
          .ps-lbl{font-family:'Space Grotesk',sans-serif;font-size:11px;color:#9097a1;font-weight:500;}
          .ps-val{font-family:'Space Mono',monospace;font-size:10px;color:#cbced3;}
          .w-sel{width:100%;background:#0f0f1a;border:1px solid #1c1c2e;color:#cbced3;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:500;padding:8px 10px;outline:none;cursor:pointer;transition:border-color .15s;-webkit-appearance:none;appearance:none;}
          .w-sel:focus{border-color:#325eff;}
          .slider{width:100%;height:2px;-webkit-appearance:none;appearance:none;background:#1c1c2e;outline:none;border-radius:1px;cursor:pointer;}
          .slider::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;border-radius:50%;background:#325eff;cursor:pointer;box-shadow:0 0 8px rgba(50,94,255,0.45);}
          .rng{display:flex;justify-content:space-between;margin-top:4px;}
          .rng span{font-family:'Space Mono',monospace;font-size:9px;color:#4a4d56;}

          /* LICENSE */
          .lic-wrap{position:relative;margin-bottom:8px;}
          .lic-sel{width:100%;background:#0f0f1a;border:1px solid #325eff;color:#325eff;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:600;padding:9px 12px;outline:none;cursor:pointer;-webkit-appearance:none;appearance:none;transition:all .15s;}
          .lic-arrow{position:absolute;right:10px;top:50%;transform:translateY(-50%);color:#4a4d56;pointer-events:none;font-size:10px;}
          .sub-lbl{font-family:'Space Grotesk',sans-serif;font-size:10px;color:#9097a1;margin-bottom:5px;}
          .sub-sel{width:100%;background:#0f0f1a;border:1px solid #1c1c2e;color:#cbced3;font-family:'Space Grotesk',sans-serif;font-size:11px;padding:7px 10px;outline:none;cursor:pointer;-webkit-appearance:none;appearance:none;}
          .sub-sel:focus{border-color:#325eff;}
          .lic-desc{font-family:'Space Grotesk',sans-serif;font-size:11px;color:#4a4d56;margin-top:8px;line-height:1.5;}

          /* WEIGHT PICKER */
          .wm-tabs{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:8px;}
          .wm-tab{font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:7px;border:1px solid #1c1c2e;background:transparent;color:#4a4d56;cursor:pointer;transition:all .15s;text-align:center;}
          .wm-tab:hover{border-color:#2a2a45;color:#cbced3;}
          .wm-tab.on{background:rgba(50,94,255,0.12);border-color:#325eff;color:#325eff;}
          .wp-list{display:flex;flex-direction:column;gap:3px;}
          .wp-row{display:flex;align-items:center;justify-content:space-between;padding:6px 8px;border:1px solid #1c1c2e;cursor:pointer;transition:all .15s;}
          .wp-row:hover{border-color:#2a2a45;}
          .wp-row.on{background:rgba(50,94,255,0.12);border-color:#325eff;}
          .wp-name{font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:500;color:#b0b1b6;}
          .wp-num{font-family:'Space Mono',monospace;font-size:9px;color:#4a4d56;}
          .wp-chk{width:14px;height:14px;border:1px solid #1c1c2e;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;}
          .wp-row.on .wp-chk{background:#325eff;border-color:#325eff;}
          .wp-row.on .wp-name{color:#f2f1eb;}

          /* PRICE */
          .price-ctx{font-family:'Space Grotesk',sans-serif;font-size:10px;color:#4a4d56;margin-bottom:6px;}
          .price-big{font-family:'Determination',monospace;font-size:2.6rem;color:#f2f1eb;line-height:1;margin-bottom:3px;}
          .price-note{font-family:'Space Grotesk',sans-serif;font-size:10px;color:#4a4d56;margin-bottom:12px;font-style:italic;}
          .trial-btn{width:100%;font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#9097a1;background:transparent;border:1px solid #1c1c2e;padding:9px;transition:all .15s;margin-top:6px;display:block;text-align:center;cursor:pointer;}
          .trial-btn:hover{border-color:#325eff;color:#325eff;}
          .trust-list{display:flex;flex-direction:column;gap:7px;padding:12px 16px;}
          .trust-item{display:flex;align-items:flex-start;gap:8px;}
          .trust-dot{width:4px;height:4px;border-radius:50%;background:#325eff;flex-shrink:0;margin-top:5px;box-shadow:0 0 6px rgba(50,94,255,0.5);}
          .trust-txt{font-family:'Space Grotesk',sans-serif;font-size:11px;color:#9097a1;line-height:1.5;}

          /* GLYPH STRIP */
          .glyph-strip{border-bottom:1px solid #1c1c2e;}
          .glyph-tabs{display:flex;border-bottom:1px solid #1c1c2e;}
          .g-tab{font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;padding:9px 18px;background:transparent;color:#4a4d56;border:none;border-right:1px solid #1c1c2e;cursor:pointer;transition:all .15s;}
          .g-tab:hover{color:#b0b1b6;}
          .g-tab.on{background:rgba(50,94,255,0.12);color:#325eff;}
          .g-count{font-family:'Space Mono',monospace;font-size:9px;color:#4a4d56;padding:0 1rem;margin-left:auto;display:flex;align-items:center;}
          .g-grid{display:flex;flex-wrap:wrap;padding:12px 16px;gap:4px;}
          .g-cell{width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:#000;border:1px solid #1c1c2e;font-size:1.1rem;color:#fff;cursor:pointer;transition:all .12s;}
          .g-cell:hover{background:rgba(50,94,255,0.12);border-color:#325eff;transform:scale(1.1);}
          .g-hint{font-family:'Space Mono',monospace;font-size:9px;color:#4a4d56;padding:4px 16px 12px;}

          /* ALL WEIGHTS */
          .weights-sec{border-bottom:1px solid #1c1c2e;}
          .sec-hd-row{padding:10px clamp(1.2rem,3vw,2.5rem);border-bottom:1px solid #1c1c2e;border-top:1px solid #1c1c2e;}
          .sec-hd{font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#325eff;}
          .wr{display:grid;grid-template-columns:110px 1fr auto;align-items:center;gap:1rem;padding:1.2rem clamp(1.2rem,3vw,2.5rem);border-bottom:1px solid #1c1c2e;cursor:pointer;transition:background .12s;}
          .wr:hover{background:#0a0a0f;}
          .wr.on{background:#0f0f1a;}
          .wr-name{font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:#9097a1;}
          .wr-sample{font-size:clamp(1.8rem,3.5vw,3.2rem);line-height:1;color:#cbced3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;transition:color .12s;}
          .wr:hover .wr-sample{color:#f2f1eb;}
          .wr-cart{font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#fff;background:#325eff;border:none;padding:8px 14px;cursor:pointer;transition:all .15s;white-space:nowrap;flex-shrink:0;}
          .wr-cart:hover{opacity:.85;}
          .wr-cart.added{background:#1a6b3a;}

          /* ABC TICKER */
          .abc-ticker{overflow:hidden;padding:10px 0;border-bottom:1px solid #1c1c2e;}
          .abc-track{display:flex;gap:1.2rem;animation:tickr 20s linear infinite;white-space:nowrap;}
          .abc-char{font-size:1.8rem;color:rgba(50,94,255,0.22);letter-spacing:.05em;}
          @keyframes tickr{from{transform:translateX(0)}to{transform:translateX(-50%)}}

          /* SPECIMENS */
          .spec-sec{padding:clamp(1.5rem,3vw,2.5rem);border-bottom:1px solid #1c1c2e;}
          .spec-main{margin-bottom:.8rem;border:1px solid #1c1c2e;overflow:hidden;}
          .spec-main img{width:100%;display:block;}
          .spec-thumbs{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;}
          .spec-thumb{cursor:pointer;border:2px solid transparent;overflow:hidden;transition:border-color .15s;}
          .spec-thumb.on{border-color:#325eff;}
          .spec-thumb img{width:100%;display:block;aspect-ratio:4/3;object-fit:cover;filter:brightness(.75);transition:all .2s;}
          .spec-thumb:hover img,.spec-thumb.on img{filter:brightness(1);}

          /* TOAST */
          .toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(20px);background:#1a6b3a;color:#fff;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:600;padding:10px 24px;opacity:0;transition:all .3s;z-index:999;pointer-events:none;white-space:nowrap;display:flex;gap:12px;align-items:center;}
          .toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
          .toast a{color:#fff;text-decoration:underline;font-weight:700;}

          /* FOOTER */
          .fp-ft{display:flex;justify-content:space-between;align-items:center;padding:1rem 1.4rem;border-top:1px solid #1c1c2e;background:#0a0a0f;}
          .fp-ft span{font-family:'Space Grotesk',sans-serif;font-size:11px;color:#4a4d56;text-transform:uppercase;letter-spacing:.06em;}
          .fp-ft-links{display:flex;gap:1.5rem;}
          .fp-ft a{font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:500;color:#4a4d56;text-transform:uppercase;letter-spacing:.08em;transition:color .15s;}
          .fp-ft a:hover{color:#cbced3;}
        `}</style>
      </Head>

      <Script src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=GBP`} onReady={() => setPaypalReady(true)} />

      {/* NAV */}
      <nav className="nav">
        <div className="nav-left">
          <Link href="/" className="nav-back">← All</Link>
          <span className="nav-font-name">{font.name}</span>
        </div>
        <Link href="/" className="nav-logo">HypeForType</Link>
        <div className="nav-right">
          <Link href={`/typefaces/${prevFont.slug}`} className="nav-arrow">‹ {prevFont.name}</Link>
          <Link href={`/typefaces/${nextFont.slug}`} className="nav-arrow">  {nextFont.name} ›</Link>
          <button className="nav-trial" onClick={() => window.location.href=`/api/trial?slug=${font.slug}`}>Trial</button>
          <a href="#buy" className="nav-buy">
            Buy →{cartCount > 0 && <span style={{ marginLeft:6, background:'#fff', color:'#325eff', borderRadius:'50%', width:16, height:16, fontSize:9, fontWeight:700, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>{cartCount}</span>}
          </a>
        </div>
      </nav>

      {/* MAIN GRID */}
      <div className="page-grid">

        {/* CANVAS */}
        <div className="canvas" style={{ background: bgColor }}>

          {focusedGlyph && (
            <div className="glyph-focus" onClick={() => setFocusedGlyph(null)} style={{ background: bgColor + 'f2' }}>
              <div style={{ fontFamily: ff, fontWeight: style.weight, fontSize:'clamp(10rem,22vw,18rem)', lineHeight:1, color: textColor }}>
                {focusedGlyph}
              </div>
              <div className="glyph-focus-meta">U+{focusedGlyph.charCodeAt(0).toString(16).toUpperCase().padStart(4,'0')} · Click to close</div>
            </div>
          )}

          <div className="toolbar">
            <span className="tb-lbl">View</span>
            {['display','headline','body'].map(m => (
              <button key={m} className={`tb-btn${viewMode===m?' on':''}`} onClick={() => setViewMode(m)}>
                {m[0].toUpperCase()+m.slice(1)}
              </button>
            ))}
            <div className="tb-sep" />
            <span className="tb-lbl">Background</span>
            {BG_SWATCHES.map(c => <div key={c} className={`tb-sw${bgColor===c?' on':''}`} style={{ background:c, width:20, height:20 }} onClick={() => setBgColor(c)} title={c} />)}
            <div className="tb-sep" />
            <span className="tb-lbl">Text colour</span>
            {TEXT_SWATCHES.map(c => <div key={c} className={`tb-sw${textColor===c?' on':''}`} style={{ background:c, width:20, height:20 }} onClick={() => setTextColor(c)} title={c} />)}
          </div>

          {/* Hero specimen behind stage — subtle */}
          <div style={{ position:'relative' }}>
          <div className="stage-wrap" style={{ background: bgColor }}>
            <textarea className="stage-input" value={previewText} onChange={e => setPreviewText(e.target.value)} maxLength={80} spellCheck={false} autoCorrect="off" autoComplete="off" />
            <div className="stage-display">
              {viewMode === 'body' ? (
                <div className="stage-body" style={{ fontFamily:ff, fontWeight:style.weight, fontSize:Math.min(fontSize,20)+'px', lineHeight:lineHeight+0.6, color:textColor }}>
                  {previewText || 'Gentle curves meet geometric precision. Every terminal softens without apology. Every weight carries its own distinct gravity.'}
                </div>
              ) : (
                <div className="stage-text" style={{ fontFamily:ff, fontWeight:style.weight, fontStyle:style.oblique?'italic':'normal', fontSize:(viewMode==='headline'?Math.max(fontSize,64):fontSize)+'px', letterSpacing:letterSpacing+'%', lineHeight:lineHeight, color:textColor }}>
                  {previewText || 'AaBbCcDd'}
                </div>
              )}
            </div>
            {!previewText && <div className="stage-hint">Click anywhere to type</div>}
          </div>
          </div>

          <div className="meta-strip">
            {[[font.styles.length,'Weights'],[font.glyphCount+'+','Glyphs'],[font.released,'Released'],[font.pro?'Pro':font.hot?'New':'Retail','Status']].map(([v,k]) => (
              <div key={k} className="meta-cell"><span className="meta-val">{v}</span><span className="meta-key">{k}</span></div>
            ))}
          </div>
        </div>

        {/* PANEL */}
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Type Panel</span>
            <span className="panel-ver">V1.0</span>
          </div>

          {/* Description + Price — top of panel */}
          <div className="ps" style={{ borderBottom:'1px solid #1c1c2e', background:'#0f0f1a' }}>
            <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:12, color:'#9097a1', lineHeight:1.65, marginBottom:14 }}>
              {font.description}
            </p>
            <div className="price-ctx">{weightMode==='full'?`Full family · ${font.styles.length} weights`:`${weightCount} weight${weightCount>1?'s':''} · ${LICENSE_TYPES.find(l=>l.key===licenseType)?.label}`}</div>
            <div className="price-big">£{estPrice}</div>
            <div className="price-note">Indicative — final pricing coming soon</div>
            <div ref={paypalRef} style={{ minHeight:44 }}>
              {purchasing && <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:12, color:'#9097a1' }}>Processing...</span>}
            </div>
            <button className="trial-btn" onClick={() => window.location.href=`/api/trial?slug=${font.slug}`}>Free Trial Download</button>
          </div>

          {/* Weight */}
          <div className="ps">
            <div className="ps-head"><span className="ps-lbl">Weight</span><span className="ps-val">{style.name} · {style.weight}</span></div>
            <select className="w-sel" value={activeStyle} onChange={e => setActiveStyle(+e.target.value)}>
              {font.styles.map((s,i) => <option key={i} value={i}>{s.name} · {s.weight}</option>)}
            </select>
          </div>

          {/* Size */}
          <div className="ps">
            <div className="ps-head"><span className="ps-lbl">Size</span><span className="ps-val">{fontSize}px</span></div>
            <input type="range" className="slider" min="12" max="200" value={fontSize} onChange={e => setFontSize(+e.target.value)} />
            <div className="rng"><span>12</span><span>200</span></div>
          </div>

          {/* Letter Spacing */}
          <div className="ps">
            <div className="ps-head"><span className="ps-lbl">Letter Spacing</span><span className="ps-val">{letterSpacing>0?'+':''}{letterSpacing}%</span></div>
            <input type="range" className="slider" min="-10" max="30" value={letterSpacing} onChange={e => setLetterSpacing(+e.target.value)} />
            <div className="rng"><span>−10</span><span>+30</span></div>
          </div>

          {/* Line Height */}
          <div className="ps">
            <div className="ps-head"><span className="ps-lbl">Line Height</span><span className="ps-val">{(lineHeight+(viewMode==='body'?.6:0)).toFixed(1)}</span></div>
            <input type="range" className="slider" min="5" max="25" value={Math.round(lineHeight*10)} onChange={e => setLineHeight(+e.target.value/10)} />
            <div className="rng"><span>0.5</span><span>2.5</span></div>
          </div>

          {/* License type */}
          <div className="ps" id="buy">
            <div className="ps-head"><span className="ps-lbl">License Type</span></div>
            <div className="lic-wrap">
              <select className="lic-sel" value={licenseType} onChange={e => setLicenseType(e.target.value)}>
                {LICENSE_TYPES.map(l => <option key={l.key} value={l.key}>{l.label}</option>)}
              </select>
              <span className="lic-arrow">▾</span>
            </div>
            {licenseType === 'desktop' && (
              <div style={{ marginTop:8 }}>
                <div className="sub-lbl">Seats (installations)</div>
                <div className="lic-wrap">
                  <select className="sub-sel" value={desktopSeats} onChange={e => setDesktopSeats(+e.target.value)}>
                    {DESKTOP_SEATS.map(s => <option key={s} value={s}>{s} {s===1?'seat':'seats'}</option>)}
                  </select>
                  <span className="lic-arrow">▾</span>
                </div>
              </div>
            )}
            {licenseType === 'webfont' && (
              <div style={{ marginTop:8 }}>
                <div className="sub-lbl">Monthly pageviews</div>
                <div className="lic-wrap">
                  <select className="sub-sel" value={webPageviews} onChange={e => setWebPageviews(e.target.value)}>
                    {WEB_PAGEVIEWS.map(p => <option key={p} value={p}>{p} pageviews/mo</option>)}
                  </select>
                  <span className="lic-arrow">▾</span>
                </div>
              </div>
            )}
            <div className="lic-desc">{LICENSE_TYPES.find(l=>l.key===licenseType)?.desc}</div>
          </div>

          {/* Weight selection */}
          <div className="ps">
            <div className="ps-head"><span className="ps-lbl">Weight Selection</span></div>
            <div className="wm-tabs">
              <button className={`wm-tab${weightMode==='single'?' on':''}`} onClick={() => setWeightMode('single')}>Individual</button>
              <button className={`wm-tab${weightMode==='full'?' on':''}`} onClick={() => setWeightMode('full')}>Full Family</button>
            </div>
            {weightMode === 'single' ? (
              <div className="wp-list">
                {font.styles.map((s,i) => (
                  <div key={i} className={`wp-row${selectedWeights.has(i)?' on':''}`} onClick={() => toggleWeight(i)}>
                    <span className="wp-name" style={{ fontFamily:ff, fontWeight:s.weight }}>{s.name}</span>
                    <span className="wp-num">{s.weight}</span>
                    <div className="wp-chk">{selectedWeights.has(i) && <span style={{ color:'#fff', fontSize:9 }}>✓</span>}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:11, color:'#b0b1b6', padding:'4px 0' }}>
                All {font.styles.length} weights included.
              </div>
            )}
          </div>



          {/* Trust */}
          <div className="trust-list">
            {[`${font.styles.length} font files`,`${font.glyphCount}+ glyphs`,'Instant download','Perpetual commercial license','PayPal Secure'].map((item,i) => (
              <div key={i} className="trust-item">
                <div className="trust-dot" />
                <span className="trust-txt">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GLYPH STRIP */}
      <div className="glyph-strip">
        <div className="glyph-tabs">
          {Object.keys(GLYPH_SETS).map(k => (
            <button key={k} className={`g-tab${glyphSet===k?' on':''}`} onClick={() => setGlyphSet(k)}>
              {k==='UPP'?'Uppercase':k==='LOW'?'Lowercase':k==='NUM'?'Numerals':k==='PUN'?'Punctuation':'Accents'}
            </button>
          ))}
          <span className="g-count">{allGlyphs.length} glyphs</span>
        </div>
        <div className="g-grid">
          {allGlyphs.map((g,i) => (
            <div key={i} className="g-cell" style={{ fontFamily:ff, fontWeight:style.weight }} onClick={() => setFocusedGlyph(g)} title={`U+${g.charCodeAt(0).toString(16).toUpperCase().padStart(4,'0')}`}>
              {g}
            </div>
          ))}
        </div>
        <div className="g-hint">Click any glyph to enlarge · {font.glyphCount}+ total</div>
      </div>

      {/* ABC TICKER */}
      <div className="abc-ticker">
        <div className="abc-track">
          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('').map((ch,i) => (
            <span key={i} className="abc-char" style={{ fontFamily:ff, fontWeight:style.weight }}>{ch}</span>
          ))}
        </div>
      </div>

      {/* SPECIMENS */}
      {specimens.length > 0 && (
        <div className="spec-sec">
          <div className="sec-hd" style={{ marginBottom:'1.2rem' }}>Type Specimens</div>
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
        <div className="sec-hd-row"><div className="sec-hd">All Weights</div></div>
        {font.styles.map((s,i) => (
          <div key={i} className={`wr${activeStyle===i?' on':''}`} onClick={() => setActiveStyle(i)}>
            <span className="wr-name">{s.name}</span>
            <span className="wr-sample" style={{ fontFamily:ff, fontWeight:s.weight, fontStyle:s.oblique?'italic':'normal' }}>
              {previewText || JP_PROVERB}
            </span>
            <button className={`wr-cart${addedIdx===i?' added':''}`} onClick={e => addToCart(i, e)}>
              {addedIdx===i ? '✓ Added' : '+ Cart'}
            </button>
          </div>
        ))}
      </div>

      {/* TOAST */}
      <div className={`toast${showToast?' show':''}`}>
        {toastMsg} · <Link href="/cart">View Cart →</Link>
      </div>

      {/* FOOTER */}
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
