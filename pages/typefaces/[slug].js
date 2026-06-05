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
  UPPERCASE:   'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  LOWERCASE:   'abcdefghijklmnopqrstuvwxyz'.split(''),
  NUMERALS:    '0123456789'.split(''),
  PUNCTUATION: '.,;:!?\'"-—…()[]{}@#$%&*+<>='.split(''),
  ACCENTS:     'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖØÙÚÛÜÝàáâãäåæçèéêëìíîïñòóôõöøùúûüý'.split(''),
  ALL:         'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,;:!?'.split(''),
};

const LICENSE_TYPES = [
  { key: 'desktop',    label: 'Desktop' },
  { key: 'webfont',    label: 'Webfont' },
  { key: 'app',        label: 'App' },
  { key: 'broadcast',  label: 'Broadcast' },
  { key: 'brand',      label: 'Brand Font' },
  { key: 'enterprise', label: 'Enterprise' },
  { key: 'enterprise-group', label: 'Group Enterprise' },
];

const DESKTOP_SEATS   = [1,2,5,10,25,50,100];
const WEB_PAGEVIEWS   = ['10,000','50,000','100,000','250,000','500,000','1,000,000','Unlimited'];
const PREVIEW_TEXT    = 'Zen samurai packs quartz koi jade silk.';

// Figma-extracted palette
const C = {
  bg:      '#000000',
  panel:   '#1e1d22',   // right panel — extracted from Figma
  srf2:    '#0a0917',   // weight row tint — extracted
  bdr:     '#2a2a2a',   // general border
  glyphBdr:'#7c7c7c',   // glyph cell border — extracted from Figma
  accent:  '#1b1afe',   // buy button blue — extracted from Figma
  aDim:    'rgba(27,26,254,0.12)',
  aGlow:   '0 0 8px rgba(27,26,254,0.5)',
  t1:      '#ffffff',   // primary text pure white
  t2:      '#b0b1b6',
  t3:      '#9097a1',
  t4:      '#555560',
  white:   '#ffffff',
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
  const [glyphSet,        setGlyphSet]         = useState('UPPERCASE');
  const [activeSpecimen,  setActiveSpecimen]   = useState(0);
  const [viewMode,        setViewMode]         = useState('display');
  const [bgColor,         setBgColor]          = useState('#000000');
  const [textColor,       setTextColor]        = useState('#ffffff');
  const [focusedGlyph,    setFocusedGlyph]     = useState(null);
  const [licenseType,     setLicenseType]      = useState('desktop');
  const [desktopSeats,    setDesktopSeats]     = useState(1);
  const [webPageviews,    setWebPageviews]     = useState('10,000');
  const [weightMode,      setWeightMode]       = useState('single');
  const [selectedWeights, setSelectedWeights]  = useState(new Set([0]));
  const [paypalReady,     setPaypalReady]      = useState(false);
  const [purchasing,      setPurchasing]       = useState(false);
  const [cart,            setCart]             = useState([]);
  const [addedIdx,        setAddedIdx]         = useState(null);
  const [showToast,       setShowToast]        = useState(false);
  const [toastMsg,        setToastMsg]         = useState('');
  const inputRef  = useRef(null);
  const paypalRef = useRef(null);

  useEffect(() => {
    try { setCart(JSON.parse(localStorage.getItem('hft_cart') || '[]')); } catch(e) {}
  }, []);

  const tiers     = pricing[font.isFamily ? 'family' : 'single'];
  const style     = font.styles[activeStyle];
  const fontFamily= `'${font.name}', monospace`;
  const specimens = SPECIMENS[font.slug] || [];
  const fontIdx   = fonts.findIndex(f => f.slug === font.slug);
  const prevFont  = fonts[(fontIdx - 1 + fonts.length) % fonts.length];
  const nextFont  = fonts[(fontIdx + 1) % fonts.length];
  const allGlyphs = GLYPH_SETS[glyphSet];
  const displayText = previewText || 'AaBbCcDd';
  const basePrice   = tiers?.desktop?.price || 45;
  const weightCount = weightMode === 'full' ? font.styles.length : selectedWeights.size;
  const estimatedPrice = weightMode === 'full'
    ? (tiers?.bundle?.price || basePrice * 1.8).toFixed(0)
    : (basePrice * weightCount).toFixed(0);

  const toggleWeight = (i) => {
    if (weightMode === 'full') return;
    setSelectedWeights(prev => {
      const next = new Set(prev);
      if (next.has(i) && next.size > 1) next.delete(i); else next.add(i);
      return next;
    });
  };

  const addToCart = (e, styleIdx) => {
    e.stopPropagation();
    const s = font.styles[styleIdx];
    const item = { slug: font.slug, name: font.name, style: s.name, weight: s.weight, license: licenseType };
    const newCart = [...cart, item];
    setCart(newCart);
    try { localStorage.setItem('hft_cart', JSON.stringify(newCart)); } catch(e) {}
    setAddedIdx(styleIdx);
    setToastMsg(`${font.name} ${s.name} added`);
    setShowToast(true);
    setTimeout(() => { setShowToast(false); setAddedIdx(null); }, 2500);
  };

  useEffect(() => {
    if (!paypalReady || !paypalRef.current) return;
    paypalRef.current.innerHTML = '';
    window.paypal.Buttons({
      createOrder: async () => {
        const res = await fetch('/api/paypal-create', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: estimatedPrice, description: `${font.name} — ${licenseType}` }),
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
      style: { layout:'horizontal', color:'blue', shape:'rect', label:'buynow', height:44, tagline:false },
    }).render(paypalRef.current);
  }, [paypalReady, licenseType, estimatedPrice, font]);

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
          html,body{background:#000!important;color:#fff!important;font-family:${C.sg}!important;-webkit-font-smoothing:antialiased;}
          ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#000}::-webkit-scrollbar-thumb{background:#333}
          a{text-decoration:none;color:inherit;}button{cursor:pointer;}
          select,option{background:${C.panel};color:#fff;}

          /* ── NAV ── */
          .nav{
            position:sticky;top:0;z-index:200;
            display:grid;grid-template-columns:1fr auto 1fr;
            height:44px;border-bottom:1px solid #1a1a1a;
            background:rgba(0,0,0,0.95);backdrop-filter:blur(12px);
          }
          .nav-left{display:flex;align-items:stretch;gap:0;}
          .nav-pill{
            font-family:${C.sg};font-size:11px;font-weight:500;
            letter-spacing:.06em;text-transform:uppercase;
            color:#888;padding:0 14px;
            border:1px solid #2a2a2a;margin:7px 0 7px 8px;
            display:flex;align-items:center;gap:6px;
            transition:color .15s,border-color .15s;white-space:nowrap;
          }
          .nav-pill:hover{color:#fff;border-color:#555;}
          .nav-pill-font{
            font-family:${C.sg};font-size:11px;font-weight:600;
            letter-spacing:.04em;
            color:#ccc;padding:0 14px;
            border:1px solid #2a2a2a;margin:7px 0 7px 6px;
            display:flex;align-items:center;
            white-space:nowrap;
          }
          .nav-center{
            font-family:${C.det};font-size:.82rem;
            letter-spacing:.1em;text-transform:uppercase;
            color:#fff;display:flex;align-items:center;justify-content:center;
            padding:0 1rem;
          }
          .nav-right{display:flex;align-items:stretch;justify-content:flex-end;gap:0;}
          .nav-next{
            font-family:${C.sg};font-size:11px;font-weight:500;
            letter-spacing:.06em;text-transform:uppercase;
            color:#888;padding:0 14px;
            border:1px solid #2a2a2a;margin:7px 6px 7px 0;
            display:flex;align-items:center;
            transition:color .15s;white-space:nowrap;
          }
          .nav-next:hover{color:#fff;border-color:#555;}
          .nav-trial{
            font-family:${C.sg};font-size:11px;font-weight:600;
            letter-spacing:.08em;text-transform:uppercase;
            color:${C.accent};background:transparent;
            border:none;padding:0 14px;
            display:flex;align-items:center;transition:opacity .15s;
          }
          .nav-trial:hover{opacity:.7;}
          .nav-buy{
            font-family:${C.sg};font-size:11px;font-weight:700;
            letter-spacing:.1em;text-transform:uppercase;
            color:#fff;background:${C.accent};
            padding:0 20px;display:flex;align-items:center;
            transition:opacity .15s;
          }
          .nav-buy:hover{opacity:.85;}

          /* ── MAIN LAYOUT ── */
          .main-wrap{display:grid;grid-template-columns:1fr 300px;min-height:calc(100vh - 44px);}

          /* ── LEFT CANVAS ── */
          .canvas{border-right:1px solid #1a1a1a;display:flex;flex-direction:column;transition:background .25s;}
          .toolbar{
            display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;
            padding:6px 1rem;border-bottom:1px solid #1a1a1a;
            background:rgba(0,0,0,0.6);flex-shrink:0;
          }
          .tb-lbl{font-family:${C.sm};font-size:9px;color:#444;letter-spacing:.12em;text-transform:uppercase;}
          .tb-sep{width:1px;height:14px;background:#222;}
          .tb-btn{font-family:${C.sg};font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:4px 10px;border:1px solid #222;background:transparent;color:#555;transition:all .15s;}
          .tb-btn:hover{border-color:#444;color:#ccc;}
          .tb-btn.on{background:${C.aDim};border-color:${C.accent};color:${C.accent};}
          .tb-sw{width:16px;height:16px;border:1px solid #333;cursor:pointer;transition:all .15s;flex-shrink:0;}
          .tb-sw:hover,.tb-sw.on{border-color:${C.accent};box-shadow:${C.aGlow};}

          /* Stage */
          .stage-wrap{position:relative;height:260px;flex-shrink:0;}
          .stage-input{position:absolute;inset:0;width:100%;height:100%;background:transparent;border:none;outline:none;resize:none;color:transparent;caret-color:${C.accent};font-size:16px;padding:2rem;z-index:2;cursor:text;}
          .stage-display{position:absolute;inset:0;display:flex;align-items:center;padding:2rem;pointer-events:none;overflow:hidden;}
          .stage-text{width:100%;line-height:.92;letter-spacing:-.02em;word-break:break-word;}
          .stage-body{width:100%;max-width:58ch;}
          .stage-hint{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);font-family:${C.sm};font-size:9px;color:${C.accent};letter-spacing:.18em;text-transform:uppercase;pointer-events:none;white-space:nowrap;}

          /* Focused glyph */
          .glyph-focus{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:500;cursor:pointer;}
          .glyph-focus-meta{font-family:${C.sm};font-size:10px;color:#555;letter-spacing:.1em;margin-top:1rem;}

          /* Meta strip */
          .meta-strip{display:flex;align-items:center;border-top:1px solid #1a1a1a;padding:1rem;gap:1.5rem;flex-shrink:0;}
          .meta-num{font-family:${C.det};font-size:1.4rem;color:#fff;line-height:1;}
          .meta-key{font-family:${C.sg};font-size:9px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#444;margin-top:2px;}
          .meta-divider{color:#1e1d22;font-size:1.2rem;}
          .meta-desc{font-family:${C.sg};font-size:11px;color:#555;line-height:1.6;max-width:55ch;padding-top:.2rem;}

          /* ── RIGHT PANEL ── */
          .panel{background:${C.panel};display:flex;flex-direction:column;overflow-y:auto;max-height:calc(100vh - 44px);position:sticky;top:44px;}
          .panel-head{padding:10px 14px;border-bottom:1px solid #111;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;}
          .panel-title{font-family:${C.sg};font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#888;}
          .panel-ver{font-family:${C.sm};font-size:9px;color:#444;}
          .ps{padding:11px 14px;border-bottom:1px solid #111;}
          .ps-head{display:flex;justify-content:space-between;margin-bottom:8px;}
          .ps-lbl{font-family:${C.sg};font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#888;}
          .ps-val{font-family:${C.sm};font-size:10px;color:#ccc;}
          .p-select{width:100%;background:#111;border:1px solid #333;color:#fff;font-family:${C.sg};font-size:11px;font-weight:600;padding:8px 10px;outline:none;cursor:pointer;-webkit-appearance:none;appearance:none;transition:border-color .15s;}
          .p-select:focus{border-color:${C.accent};}
          .slider{width:100%;height:2px;-webkit-appearance:none;appearance:none;background:#333;outline:none;border-radius:1px;cursor:pointer;}
          .slider::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border-radius:50%;background:${C.accent};cursor:pointer;box-shadow:${C.aGlow};}
          .rng{display:flex;justify-content:space-between;margin-top:4px;}
          .rng span{font-family:${C.sm};font-size:9px;color:#444;}

          /* Tools section */
          .tools-section{padding:10px 14px;border-bottom:1px solid #111;}
          .tools-icons{display:flex;gap:10px;align-items:center;margin-top:8px;}
          .tool-icon{width:36px;height:36px;background:#111;border:1px solid #333;display:flex;align-items:center;justify-content:center;font-size:1.1rem;cursor:pointer;transition:border-color .15s;}
          .tool-icon:hover{border-color:${C.accent};}
          .tool-icon.on{border-color:${C.accent};background:${C.aDim};}

          /* License */
          .lic-wrap{position:relative;}
          .lic-arrow{position:absolute;right:10px;top:50%;transform:translateY(-50%);color:#555;pointer-events:none;font-size:10px;}
          .lic-sub-lbl{font-family:${C.sg};font-size:10px;color:#666;margin-bottom:5px;margin-top:8px;}
          .lic-desc{font-family:${C.sg};font-size:10px;color:#555;margin-top:6px;line-height:1.5;font-style:italic;}

          /* Weight selection */
          .wm-tabs{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:8px;}
          .wm-tab{font-family:${C.sg};font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:7px;border:1px solid #333;background:transparent;color:#555;cursor:pointer;transition:all .15s;text-align:center;}
          .wm-tab:hover{border-color:#555;color:#ccc;}
          .wm-tab.on{background:${C.aDim};border-color:${C.accent};color:${C.accent};}
          .wp-list{display:flex;flex-direction:column;gap:3px;max-height:180px;overflow-y:auto;}
          .wp-row{display:flex;align-items:center;justify-content:space-between;padding:7px 8px;border:1px solid #222;cursor:pointer;transition:all .15s;}
          .wp-row:hover{border-color:#444;}
          .wp-row.on{background:${C.aDim};border-color:${C.accent};}
          .wp-name{font-family:${C.sg};font-size:11px;color:#aaa;}
          .wp-row.on .wp-name{color:#fff;}
          .wp-check{width:14px;height:14px;border:1px solid #333;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;}
          .wp-row.on .wp-check{background:${C.accent};border-color:${C.accent};}

          /* Price */
          .price-block{padding:12px 14px;border-bottom:1px solid #111;}
          .price-context{font-family:${C.sg};font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#555;margin-bottom:4px;}
          .price-big{font-family:${C.det};font-size:3rem;color:#fff;line-height:1;margin-bottom:12px;}
          .trial-btn{width:100%;font-family:${C.sg};font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#666;background:transparent;border:1px solid #333;padding:10px;transition:all .15s;margin-top:8px;}
          .trial-btn:hover{border-color:${C.accent};color:${C.accent};}
          .trust-list{padding:10px 14px;display:flex;flex-direction:column;gap:6px;}
          .trust-item{display:flex;align-items:flex-start;gap:7px;}
          .trust-dot{width:4px;height:4px;border-radius:50%;background:${C.accent};flex-shrink:0;margin-top:5px;box-shadow:${C.aGlow};}
          .trust-txt{font-family:${C.sg};font-size:10px;color:#555;line-height:1.5;}

          /* ── GLYPH STRIP ── */
          .glyph-section{border-top:1px solid #1a1a1a;border-bottom:1px solid #1a1a1a;background:#000;}
          .glyph-tabs{display:flex;border-bottom:1px solid #1a1a1a;}
          .g-tab{font-family:${C.sg};font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:9px 16px;background:transparent;color:#555;border:none;border-right:1px solid #1a1a1a;cursor:pointer;transition:all .15s;}
          .g-tab:hover{color:#ccc;}
          .g-tab.on{color:#fff;background:${C.aDim};}
          .g-count{font-family:${C.sm};font-size:9px;color:#444;padding:9px 14px;margin-left:auto;}
          .glyph-grid{display:flex;flex-wrap:wrap;padding:14px 16px;gap:5px;}
          .g-cell{
            width:52px;height:52px;
            display:flex;align-items:center;justify-content:center;
            background:#000;border:1px solid ${C.glyphBdr};
            font-size:1.15rem;color:#fff;
            cursor:pointer;transition:all .12s;flex-shrink:0;
          }
          .g-cell:hover{background:${C.aDim};border-color:${C.accent};transform:scale(1.08);}
          .g-hint{font-family:${C.sm};font-size:9px;color:#333;padding:0 16px 12px;width:100%;}

          /* ── ALL WEIGHTS ── */
          .weights-section{border-bottom:1px solid #1a1a1a;}
          .weights-header{padding:10px 1.2rem;border-bottom:1px solid #1a1a1a;}
          .weights-title{font-family:${C.sg};font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#555;}
          .wr{display:grid;grid-template-columns:80px 1fr auto;align-items:center;gap:1rem;padding:1.1rem 1.2rem;border-bottom:1px solid #0d0d0d;cursor:pointer;transition:background .12s;background:${C.srf2};}
          .wr:hover{background:#100f20;}
          .wr.on{background:#12103a;}
          .wr-name{font-family:${C.sg};font-size:9px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#555;}
          .wr-sample{font-size:clamp(1.5rem,3vw,2.8rem);line-height:1;color:#fff;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
          .add-btn{font-family:${C.sg};font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#fff;background:${C.accent};border:none;padding:7px 12px;cursor:pointer;transition:all .15s;white-space:nowrap;flex-shrink:0;}
          .add-btn:hover{opacity:.8;}
          .add-btn.done{background:#1a5c30;}

          /* ── SPECIMENS ── */
          .specimen-banner{
            background:${C.accent};padding:10px 1.4rem;
            font-family:${C.sg};font-size:11px;font-weight:600;
            letter-spacing:.08em;text-transform:uppercase;color:#fff;
            white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
          }
          .specimen-section{border-bottom:1px solid #1a1a1a;position:relative;}
          .specimen-sub{font-family:${C.sm};font-size:9px;color:#555;letter-spacing:.12em;text-transform:uppercase;padding:8px 1.4rem;border-bottom:1px solid #1a1a1a;}
          .specimen-stage{position:relative;overflow:hidden;}
          .specimen-stage img{width:100%;display:block;}
          .specimen-arrow{position:absolute;top:50%;transform:translateY(-50%);background:${C.accent};border:none;color:#fff;width:36px;height:52px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;cursor:pointer;z-index:5;transition:opacity .15s;}
          .specimen-arrow:hover{opacity:.8;}
          .specimen-arrow-left{left:0;}
          .specimen-arrow-right{right:0;}

          /* ── FOOTER ── */
          .fp-footer{display:grid;grid-template-columns:auto 1fr auto;align-items:center;padding:1rem 1.4rem;border-top:1px solid #1a1a1a;background:#000;gap:1rem;}
          .footer-logo{font-family:${C.det};font-size:.9rem;letter-spacing:.1em;color:#fff;}
          .footer-copy{font-family:${C.sg};font-size:10px;color:#333;text-align:center;text-transform:uppercase;letter-spacing:.06em;}
          .footer-links{display:flex;gap:1.5rem;justify-content:flex-end;}
          .footer-link{font-family:${C.sg};font-size:10px;color:#333;letter-spacing:.08em;text-transform:uppercase;transition:color .15s;}
          .footer-link:hover{color:#fff;}

          /* ── TOAST ── */
          .toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(20px);background:#1a5c30;color:#fff;font-family:${C.sg};font-size:12px;font-weight:600;padding:10px 24px;opacity:0;transition:all .3s;z-index:999;pointer-events:none;white-space:nowrap;letter-spacing:.06em;}
          .toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
        `}</style>
      </Head>

      <Script src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=GBP`} onReady={() => setPaypalReady(true)} />

      {/* ── NAV ── */}
      <nav className="nav">
        <div className="nav-left">
          <Link href="/" className="nav-pill">← All</Link>
          <Link href={`/typefaces/${prevFont.slug}`} className="nav-pill-font">← {prevFont.name}</Link>
        </div>
        <Link href="/" className="nav-center">HypeForType</Link>
        <div className="nav-right">
          <Link href={`/typefaces/${nextFont.slug}`} className="nav-next">{nextFont.name} →</Link>
          <button className="nav-trial" onClick={() => window.location.href=`/api/trial?slug=${font.slug}`}>Trial</button>
          <a href="#buy" className="nav-buy">BUY →</a>
        </div>
      </nav>

      {/* ── MAIN GRID ── */}
      <div className="main-wrap">

        {/* LEFT CANVAS */}
        <div className="canvas" style={{ background: bgColor }}>

          {/* Fullscreen glyph */}
          {focusedGlyph && (
            <div className="glyph-focus" onClick={() => setFocusedGlyph(null)} style={{ background: bgColor + 'f2' }}>
              <div style={{ fontFamily, fontWeight:style.weight, fontSize:'clamp(10rem,20vw,16rem)', lineHeight:1, color:textColor }}>
                {focusedGlyph}
              </div>
              <div className="glyph-focus-meta">U+{focusedGlyph.charCodeAt(0).toString(16).toUpperCase().padStart(4,'0')} · Click to close</div>
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
            {['#000000','#0a0a0f','#ffffff','#f5f4f0','#1a1a2e','#0d1117'].map(c => (
              <div key={c} className={`tb-sw${bgColor===c?' on':''}`} style={{ background:c }} onClick={() => setBgColor(c)} />
            ))}
            <div className="tb-sep" />
            <span className="tb-lbl">Text</span>
            {['#ffffff','#cbced3','#000000','#1b1afe','#f5f4f0','#9097a1'].map(c => (
              <div key={c} className={`tb-sw${textColor===c?' on':''}`} style={{ background:c }} onClick={() => setTextColor(c)} />
            ))}
          </div>

          {/* Stage */}
          <div className="stage-wrap" style={{ background:bgColor }}>
            <textarea ref={inputRef} className="stage-input" value={previewText} onChange={e => setPreviewText(e.target.value)} maxLength={80} spellCheck={false} autoCorrect="off" autoComplete="off" />
            <div className="stage-display">
              {viewMode === 'body' ? (
                <div className="stage-body" style={{ fontFamily, fontWeight:style.weight, fontSize:Math.min(fontSize,20)+'px', lineHeight:lineHeight+0.6, color:textColor }}>
                  {previewText || 'Zen samurai packs quartz koi jade silk. The art of type is the art of thought made visible.'}
                </div>
              ) : (
                <div className="stage-text" style={{ fontFamily, fontWeight:style.weight, fontStyle:style.oblique?'italic':'normal', fontSize:(viewMode==='headline'?Math.max(fontSize,64):fontSize)+'px', letterSpacing:letterSpacing+'%', lineHeight:lineHeight, color:textColor }}>
                  {displayText}
                </div>
              )}
            </div>
            {!previewText && <div className="stage-hint">CLICK ANYWHERE TO TYPE...</div>}
          </div>

          {/* Meta strip */}
          <div className="meta-strip">
            <div>
              <div className="meta-num">{String(font.styles.length).padStart(2,'0')}</div>
              <div className="meta-key">Weights</div>
            </div>
            <span className="meta-divider">♥</span>
            <div>
              <div className="meta-num">{font.glyphCount}</div>
              <div className="meta-key">Glyphs</div>
            </div>
            <span className="meta-divider">✦</span>
            <div>
              <div className="meta-num">{font.languages || 54}</div>
              <div className="meta-key">Languages</div>
            </div>
            <span className="meta-divider">☺</span>
            <div className="meta-desc">{font.description}</div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Type Panel</span>
            <span className="panel-ver">V1.0</span>
          </div>

          {/* Font Weight */}
          <div className="ps">
            <div className="ps-head"><span className="ps-lbl">Font Weight</span><span className="ps-val">{style.weight}</span></div>
            <div className="lic-wrap">
              <select className="p-select" value={activeStyle} onChange={e => setActiveStyle(+e.target.value)}>
                {font.styles.map((s,i) => <option key={i} value={i}>{font.name} {s.name}</option>)}
              </select>
              <span className="lic-arrow">▾</span>
            </div>
          </div>

          {/* Size */}
          <div className="ps">
            <div className="ps-head"><span className="ps-lbl">Size</span><span className="ps-val">{fontSize}px</span></div>
            <input type="range" className="slider" min="12" max="200" value={fontSize} onChange={e => setFontSize(+e.target.value)} />
            <div className="rng"><span>12</span><span>200</span></div>
          </div>

          {/* Spacing */}
          <div className="ps">
            <div className="ps-head"><span className="ps-lbl">Spacing</span><span className="ps-val">{letterSpacing > 0?'+':''}{letterSpacing}.00</span></div>
            <input type="range" className="slider" min="-10" max="30" value={letterSpacing} onChange={e => setLetterSpacing(+e.target.value)} />
            <div className="rng"><span>−10</span><span>+30</span></div>
          </div>

          {/* Height */}
          <div className="ps">
            <div className="ps-head"><span className="ps-lbl">Height</span><span className="ps-val">{lineHeight.toFixed(2)}</span></div>
            <input type="range" className="slider" min="5" max="25" value={Math.round(lineHeight*10)} onChange={e => setLineHeight(+e.target.value/10)} />
            <div className="rng"><span>0.5</span><span>2.5</span></div>
          </div>

          {/* Tools */}
          <div className="tools-section">
            <div className="ps-lbl">Tools</div>
            <div className="tools-icons">
              <div className={`tool-icon${viewMode==='display'?' on':''}`} onClick={() => setViewMode('display')} title="Display">Aa</div>
              <div className={`tool-icon${viewMode==='body'?' on':''}`} onClick={() => setViewMode('body')} title="Body">🎨</div>
              <div className={`tool-icon${viewMode==='headline'?' on':''}`} onClick={() => setViewMode('headline')} title="Headline">❤️</div>
              <div className="tool-icon" onClick={() => inputRef.current?.focus()} title="Type">👆</div>
            </div>
          </div>

          {/* License Type */}
          <div className="ps" id="buy">
            <div className="ps-head"><span className="ps-lbl">License Type</span></div>
            <div className="lic-wrap">
              <select className="p-select" value={licenseType} onChange={e => setLicenseType(e.target.value)}>
                {LICENSE_TYPES.map(l => <option key={l.key} value={l.key}>{l.label}</option>)}
              </select>
              <span className="lic-arrow">▾</span>
            </div>

            {licenseType === 'desktop' && (
              <>
                <div className="lic-sub-lbl">Number of seats (Installations)</div>
                <div className="lic-wrap">
                  <select className="p-select" value={desktopSeats} onChange={e => setDesktopSeats(+e.target.value)}>
                    {DESKTOP_SEATS.map(s => <option key={s} value={s}>{s} {s===1?'seat':'seats'}</option>)}
                  </select>
                  <span className="lic-arrow">▾</span>
                </div>
                <div className="lic-desc">Installation on {desktopSeats} {desktopSeats===1?'computer':'computers'}</div>
              </>
            )}

            {licenseType === 'webfont' && (
              <>
                <div className="lic-sub-lbl">Monthly pageviews</div>
                <div className="lic-wrap">
                  <select className="p-select" value={webPageviews} onChange={e => setWebPageviews(e.target.value)}>
                    {WEB_PAGEVIEWS.map(p => <option key={p} value={p}>{p} pageviews/mo</option>)}
                  </select>
                  <span className="lic-arrow">▾</span>
                </div>
              </>
            )}

            {!['desktop','webfont'].includes(licenseType) && (
              <div className="lic-desc">
                {licenseType==='app' && 'For embedding in a single application.'}
                {licenseType==='broadcast' && 'For TV, film and broadcast productions.'}
                {licenseType==='brand' && 'Primary brand typeface across all media.'}
                {licenseType==='enterprise' && 'Unlimited seats within one organisation.'}
                {licenseType==='enterprise-group' && 'Unlimited across multiple organisations.'}
              </div>
            )}
          </div>

          {/* Weight Selection */}
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
                    <span className="wp-name">{font.name} {s.name}</span>
                    <div className="wp-check">{selectedWeights.has(i) && <span style={{color:'#fff',fontSize:9}}>✓</span>}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontFamily:C.sg, fontSize:11, color:'#888', padding:'4px 0' }}>
                All {font.styles.length} weights — best value
              </div>
            )}
          </div>

          {/* Price */}
          <div className="price-block">
            <div className="price-context">{weightCount} {weightCount===1?'weight':'weights'} · {licenseType.toUpperCase()}</div>
            <div className="price-big">£{estimatedPrice}</div>
            <div ref={paypalRef} style={{ minHeight:44 }}>
              {purchasing && <span style={{fontFamily:C.sg,fontSize:12,color:'#666'}}>Processing...</span>}
            </div>
            <button className="trial-btn" onClick={() => window.location.href=`/api/trial?slug=${font.slug}`}>
              FREE TRIAL DOWNLOAD
            </button>
          </div>

          {/* Trust */}
          <div className="trust-list">
            {[`${font.styles.length} font files`,`${font.glyphCount}+ glyphs`,'Instant download','Perpetual license','PayPal Secure'].map((t,i) => (
              <div key={i} className="trust-item">
                <div className="trust-dot" />
                <span className="trust-txt">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── GLYPH STRIP ── */}
      <div className="glyph-section">
        <div className="glyph-tabs">
          {Object.keys(GLYPH_SETS).map(k => (
            <button key={k} className={`g-tab${glyphSet===k?' on':''}`} onClick={() => setGlyphSet(k)}>
              {k.charAt(0)+k.slice(1).toLowerCase()}
            </button>
          ))}
          <span className="g-count">{allGlyphs.length} glyphs</span>
        </div>
        <div className="glyph-grid">
          {allGlyphs.map((g,i) => (
            <div key={i} className="g-cell" style={{ fontFamily, fontWeight:style.weight }} onClick={() => setFocusedGlyph(g)}>
              {g}
            </div>
          ))}
        </div>
        <div className="g-hint">Click any glyph to enlarge · {font.glyphCount}+ total glyphs</div>
      </div>

      {/* ── ABC TICKER ── */}
      <div style={{ overflow:'hidden', padding:'10px 0', borderBottom:'1px solid #1a1a1a' }}>
        <div style={{ display:'flex', gap:'1.2rem', animation:'tickr 22s linear infinite', whiteSpace:'nowrap' }}>
          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('').map((ch,i) => (
            <span key={i} style={{ fontFamily, fontWeight:style.weight, fontSize:'1.8rem', color:'rgba(27,26,254,0.22)' }}>{ch}</span>
          ))}
        </div>
        <style>{`@keyframes tickr{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      </div>

      {/* ── ALL WEIGHTS ── */}
      <div className="weights-section">
        <div className="weights-header">
          <div className="weights-title">All Weights</div>
        </div>
        {font.styles.map((s,i) => (
          <div key={i} className={`wr${activeStyle===i?' on':''}`} onClick={() => setActiveStyle(i)}>
            <span className="wr-name">{s.name}</span>
            <span className="wr-sample" style={{ fontFamily, fontWeight:s.weight, fontStyle:s.oblique?'italic':'normal' }}>
              {previewText || PREVIEW_TEXT}
            </span>
            <button className={`add-btn${addedIdx===i?' done':''}`} onClick={e => addToCart(e,i)}>
              {addedIdx===i ? '✓ ADDED' : 'ADD +'}
            </button>
          </div>
        ))}
      </div>

      {/* ── SPECIMENS ── */}
      {specimens.length > 0 && (
        <div className="specimen-section">
          <div style={{ padding:'9px 1.4rem', borderBottom:'1px solid #1a1a1a' }}>
            <div className="weights-title">Specimen Designs</div>
          </div>
          <div className="specimen-banner">
            TYPE IS THE VOICE OF A BRAND. WHEN IT SPEAKS WITH CLARITY, CONFIDENCE, AND CHARACTER, THE BRAND DOESN'T JUST GET SEEN — IT GETS FELT.
          </div>
          <div className="specimen-sub">HYPERFLURO PRESENTS: {font.name.toUpperCase()} — A GLOBAL BEST-SELLER TRUSTED BY BRANDS EVERYWHERE.</div>
          <div className="specimen-stage">
            <button className="specimen-arrow specimen-arrow-left" onClick={() => setActiveSpecimen(p => (p-1+specimens.length)%specimens.length)}>◄</button>
            <img src={specimens[activeSpecimen]} alt={`${font.name} specimen`} />
            <button className="specimen-arrow specimen-arrow-right" onClick={() => setActiveSpecimen(p => (p+1)%specimens.length)}>►</button>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="fp-footer">
        <div className="footer-logo">HF</div>
        <div className="footer-copy">COPYRIGHT 2026 © HYPEFLURO</div>
        <div className="footer-links">
          {['Licensing','FAQ','Contact'].map(t => <Link key={t} href={'/'+t.toLowerCase()} className="footer-link">{t}</Link>)}
        </div>
      </footer>

      {/* Toast */}
      <div className={`toast${showToast?' show':''}`}>
        {toastMsg} · <Link href="/cart" style={{color:'#fff',textDecoration:'underline'}}>View Cart</Link>
      </div>
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
