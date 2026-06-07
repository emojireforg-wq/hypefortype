import Head from 'next/head';
import Link from 'next/link';
import { fonts, pricing } from '../lib/fonts';
import { useState, useRef, useEffect } from 'react';
import Script from 'next/script';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

const SPECIMENS = {
  'baq-rounded': [
    '/specimens/baq-rounded/baq-rounded-frame-1-o.jpg',
    '/specimens/baq-rounded/baq-rounded-frame-1-_2_-o.jpg',
    '/specimens/baq-rounded/baq-rounded-frame-1-_3_-o.jpg',
  ],
};

const GLYPH_SETS = {
  ALPHABET:    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
  NUMERALS:    '0123456789'.split(''),
  PUNCTUATION: ".,;:!?'\"-\u2014\u2026()[]{}@#$%&*+<>=".split(''),
  ACCENTS:     '\xc0\xc1\xc2\xc3\xc4\xc5\xc6\xc7\xc8\xc9\xca\xcb\xcc\xcd\xce\xcf\xd1\xd2\xd3\xd4\xd5\xd6\xd8\xd9\xda\xdb\xdc\xdd\xe0\xe1\xe2\xe3\xe4\xe5\xe6\xe7\xe8\xe9\xea\xeb\xec\xed\xee\xef\xf1\xf2\xf3\xf4\xf5\xf6\xf8\xf9\xfa\xfb\xfc\xfd'.split(''),
  ALL:         'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split(''),
};

const LICENSE_TYPES = [
  { key:'desktop',    label:'Desktop',         desc:'For installation on computers.' },
  { key:'webfont',    label:'Webfont',          desc:'For use on websites.' },
  { key:'app',        label:'App',              desc:'For embedding in a mobile or desktop app.' },
  { key:'broadcast',  label:'Broadcast',        desc:'For TV, film and streaming.' },
  { key:'brand',      label:'Brand Font',       desc:'As a primary brand typeface across all media.' },
  { key:'enterprise', label:'Enterprise',       desc:'Unlimited use within one organisation.' },
];

const SEAT_OPTIONS     = [1,2,5,10,25,50,100];
const PAGEVIEW_OPTIONS = ['10,000','50,000','100,000','250,000','500,000','1,000,000','Unlimited'];
const ZEN_SENTENCE     = 'Zen samurai packs quartz koi jade silk.';

export default function TestPage() {
  const font = fonts.find(f => f.slug === 'baq-rounded') || fonts[0];
  const [activeStyle,     setActiveStyle]    = useState(0);
  const [previewText,     setPreviewText]    = useState('');
  const [fontSize,        setFontSize]       = useState(120);
  const [letterSpacing,   setLetterSpacing]  = useState(0);
  const [lineHeight,      setLineHeight]     = useState(1.0);
  const [glyphSet,        setGlyphSet]       = useState('ALPHABET');
  const [activeSpecimen,  setActiveSpecimen] = useState(0);
  const [licenseType,     setLicenseType]    = useState('desktop');
  const [desktopSeats,    setDesktopSeats]   = useState(1);
  const [webPageviews,    setWebPageviews]   = useState('10,000');
  const [weightMode,      setWeightMode]     = useState('single');
  const [selectedWeights, setSelectedWeights] = useState(new Set([0]));
  const [focusedGlyph,    setFocusedGlyph]  = useState(null);
  const [addedIdx,        setAddedIdx]       = useState(null);
  const [toastMsg,        setToastMsg]       = useState('');
  const [showToast,       setShowToast]      = useState(false);
  const [animation,       setAnimation]      = useState(null);
  const [paypalReady,     setPaypalReady]    = useState(false);
  const [purchasing,      setPurchasing]     = useState(false);
  const paypalRef = useRef(null);

  const tiers      = pricing[font.isFamily ? 'family' : 'single'];
  const style      = font.styles[activeStyle];
  const ff         = "'" + font.name + "', monospace";
  const specimens  = SPECIMENS[font.slug] || [];
  const allGlyphs  = GLYPH_SETS[glyphSet];
  const fontPhrase = 'Bold. Blob. Beautiful.';
  const weightCount = weightMode === 'full' ? font.styles.length : selectedWeights.size;
  const basePrice  = tiers && tiers.desktop ? tiers.desktop.price : 45;
  const estPrice   = weightMode === 'full' ? Math.round(basePrice * 1.8) : basePrice * weightCount;
  const licDef     = LICENSE_TYPES.find(l => l.key === licenseType);

  const toggleWeight = (i) => {
    setSelectedWeights(prev => {
      const n = new Set(prev);
      if (n.has(i) && n.size > 1) n.delete(i); else n.add(i);
      return n;
    });
  };

  const addToCart = (styleIdx, e) => {
    e && e.stopPropagation();
    setAddedIdx(styleIdx);
    setToastMsg(font.name + ' ' + font.styles[styleIdx].name + ' added');
    setShowToast(true);
    setTimeout(() => { setShowToast(false); setAddedIdx(null); }, 2500);
  };

  useEffect(() => {
    if (!paypalReady || !paypalRef.current) return;
    paypalRef.current.innerHTML = '';
    window.paypal && window.paypal.Buttons({
      createOrder: async () => {
        const res = await fetch('/api/paypal-create', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: estPrice, description: font.name + ' — ' + licenseType }),
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
        if (r.success) window.location.href = '/download?token=' + r.token;
        setPurchasing(false);
      },
      style: { layout:'horizontal', color:'black', shape:'rect', label:'buynow', height:44, tagline:false },
    }).render(paypalRef.current);
  }, [paypalReady, licenseType, estPrice, font]);

  return (
    <>
      <Head>
        <title>TEST PAGE — {font.name} — HypeForType</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        {font.styles.map(s => (
          <style key={s.file}>{`@font-face{font-family:'${font.name}';src:url('/fonts/${font.slug}/${encodeURIComponent(s.file)}');font-weight:${s.weight};font-style:${s.oblique?'italic':'normal'};font-display:swap;}`}</style>
        ))}
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          html,body{background:#000;color:#e8e8ff;font-family:'Space Grotesk',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;}
          ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#000}::-webkit-scrollbar-thumb{background:#0e0f28}
          a{text-decoration:none;color:inherit;}button{cursor:pointer;}
          select,option{background:#06060f;color:#e8e8ff;}

          /* NAV */
          .nav{position:sticky;top:0;z-index:200;display:flex;align-items:stretch;height:48px;border-bottom:1px solid #0e0f28;background:rgba(0,0,0,0.95);backdrop-filter:blur(10px);}
          .nav-back{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#4a5488;padding:0 1rem;border-right:1px solid #0e0f28;display:flex;align-items:center;transition:color .15s;}
          .nav-back:hover{color:#e8e8ff;}
          .nav-title{font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#e8e8ff;padding:0 1.5rem;display:flex;align-items:center;flex:1;}
          .nav-test-badge{font-family:'Space Mono',monospace;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#ff0;background:#333;padding:4px 10px;margin-left:1rem;}
          .nav-buy{font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#fff;background:#1b1aff;padding:0 1.4rem;display:flex;align-items:center;}

          /* TWO COLUMN LAYOUT */
          .page-wrap{display:flex;flex-direction:row;align-items:flex-start;min-height:calc(100vh - 48px);}
          .left{flex:1;min-width:0;border-right:1px solid #0e0f28;display:flex;flex-direction:column;}
          .panel{width:320px;flex-shrink:0;background:#06060f;display:flex;flex-direction:column;position:sticky;top:48px;height:calc(100vh - 48px);overflow-y:auto;}

          /* STAGE */
          .stage-wrap{position:relative;min-height:400px;display:flex;align-items:flex-start;justify-content:flex-start;overflow:visible;background:#000;}
          .stage-ce{position:absolute;top:0;left:0;right:0;min-height:100%;z-index:3;padding:2rem;outline:none;cursor:text;color:transparent;-webkit-text-fill-color:transparent;caret-color:#1b1aff;word-break:break-word;white-space:pre-wrap;}
          .stage-display{position:relative;display:flex;align-items:flex-start;padding:2rem;pointer-events:none;z-index:2;width:100%;}
          .stage-inner{width:100%;word-break:break-word;}
          .stage-hint{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);font-family:'Space Mono',monospace;font-size:9px;color:#282c52;letter-spacing:.2em;text-transform:uppercase;pointer-events:none;white-space:nowrap;z-index:4;}

          /* META */
          .meta-strip{display:flex;border-top:1px solid #0e0f28;flex-shrink:0;}
          .meta-cell{flex:1;padding:.6rem .9rem;border-right:1px solid #0e0f28;display:flex;flex-direction:column;gap:2px;}
          .meta-cell:last-child{border-right:none;}
          .meta-val{font-size:1.2rem;color:#e8e8ff;line-height:1;font-weight:700;}
          .meta-key{font-family:'Space Mono',monospace;font-size:9px;color:#282c52;letter-spacing:.12em;text-transform:uppercase;}
          .meta-lang{font-size:13px;color:#e8e8ff;font-weight:500;}

          /* DESC */
          .long-desc{padding:.8rem 1rem;border-bottom:1px solid #0e0f28;}
          .long-desc p{font-size:12px;color:#4a5488;line-height:1.7;}

          /* GLYPHS */
          .glyph-section{border-bottom:1px solid #0e0f28;}
          .glyph-tabs{display:flex;border-bottom:1px solid #0e0f28;}
          .g-tab{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:8px 14px;background:transparent;color:#4a5488;border:none;border-right:1px solid #0e0f28;cursor:pointer;transition:all .15s;}
          .g-tab:hover{color:#e8e8ff;}
          .g-tab.on{color:#1b1aff;}
          .g-count{font-family:'Space Mono',monospace;font-size:9px;color:#282c52;padding:0 .8rem;margin-left:auto;display:flex;align-items:center;}
          .g-grid{display:flex;flex-wrap:wrap;padding:.5rem;}
          .g-cell{display:flex;flex-direction:column;align-items:center;justify-content:center;width:88px;height:88px;cursor:pointer;transition:background .12s;border:1px solid transparent;}
          .g-cell:hover{background:rgba(27,26,255,0.12);border-color:#1b1aff;}
          .g-char{font-size:2.2rem;color:#e8e8ff;line-height:1;}
          .g-code{font-family:'Space Mono',monospace;font-size:8px;color:#282c52;margin-top:3px;}
          .g-hint{font-family:'Space Mono',monospace;font-size:9px;color:#282c52;padding:4px 1rem 8px;}

          /* TICKER */
          .ticker-wrap{overflow:hidden;padding:8px 0;border-top:1px solid #0e0f28;}
          .ticker-track{display:flex;gap:1.5rem;animation:tickr 22s linear infinite;white-space:nowrap;}
          .ticker-char{font-size:1.6rem;color:rgba(27,26,255,0.2);}
          @keyframes tickr{from{transform:translateX(0)}to{transform:translateX(-50%)}}

          /* SPECIMENS */
          .spec-sec{padding:1.5rem;border-top:1px solid #0e0f28;}
          .spec-main{margin-bottom:.6rem;overflow:hidden;border:1px solid #0e0f28;}
          .spec-main img{width:100%;display:block;}
          .spec-thumbs{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;}
          .spec-thumb{cursor:pointer;border:2px solid transparent;overflow:hidden;transition:border-color .15s;}
          .spec-thumb.on{border-color:#1b1aff;}
          .spec-thumb img{width:100%;display:block;aspect-ratio:4/3;object-fit:cover;filter:brightness(.7);transition:all .2s;}
          .spec-thumb:hover img,.spec-thumb.on img{filter:brightness(1);}

          /* ALL WEIGHTS */
          .weights-sec{border-top:1px solid #0e0f28;}
          .weights-hd{padding:8px 1.2rem;border-bottom:1px solid #0e0f28;background:#06060f;}
          .weights-hd-txt{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#e8e8ff;}
          .wr{display:grid;grid-template-columns:120px 1fr auto;align-items:center;padding:0.6rem 1.2rem;border-bottom:1px solid #0e0f28;min-height:96px;cursor:pointer;transition:background .12s;}
          .wr:hover,.wr.on{background:#0a0f35;}
          .wr-name{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#4a5488;}
          .wr-sample{font-size:clamp(2rem,3.5vw,3.4rem);line-height:1.2;color:#cbcde8;padding:0.2rem 1rem;white-space:nowrap;overflow:hidden;}
          .wr:hover .wr-sample,.wr.on .wr-sample{color:#e8e8ff;}
          .wr-add{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#fff;background:#1b1aff;border:none;padding:8px 14px;cursor:pointer;white-space:nowrap;}
          .wr-add.added{background:#1a6b3a;}

          /* PANEL */
          .panel-row{padding:10px 16px;border-bottom:1px solid #0e0f28;}
          .panel-lbl{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#e8e8ff;margin-bottom:8px;}
          .panel-sublbl{font-size:11px;color:#4a5488;margin-bottom:6px;}
          .slider-row{display:flex;align-items:center;gap:.5rem;margin-bottom:6px;}
          .slider-nm{font-size:12px;color:#7888c0;flex-shrink:0;width:56px;}
          .slider{flex:1;height:2px;-webkit-appearance:none;appearance:none;background:rgba(27,26,255,0.25);outline:none;border-radius:1px;cursor:pointer;}
          .slider::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#1b1aff;cursor:pointer;}
          .slider-val{font-family:'Space Mono',monospace;font-size:10px;color:#7888c0;width:40px;text-align:right;}
          .w-drop-wrap{position:relative;}
          .w-drop{width:100%;background:#000;border:1px solid #1b1aff;color:#e8e8ff;font-family:'Space Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:8px 36px 8px 10px;outline:none;cursor:pointer;-webkit-appearance:none;appearance:none;}
          .w-drop-arrow{position:absolute;right:10px;top:50%;transform:translateY(-50%);color:#1b1aff;pointer-events:none;font-size:10px;}
          .anim-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:10px;}
          .anim-btn{font-family:'Space Mono',monospace;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:8px 6px;border:1px solid #0e0f28;background:transparent;color:#4a5488;cursor:pointer;transition:all .2s;text-align:center;}
          .anim-btn:hover{border-color:#1b1aff;color:#e8e8ff;}
          .anim-btn.on{background:rgba(27,26,255,0.15);border-color:#1b1aff;color:#1b1aff;}
          .lic-wrap{position:relative;margin-bottom:6px;}
          .lic-drop{width:100%;background:#000;border:1px solid #1b1aff;color:#e8e8ff;font-family:'Space Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:9px 12px;outline:none;cursor:pointer;-webkit-appearance:none;appearance:none;}
          .lic-arrow{position:absolute;right:10px;top:50%;transform:translateY(-50%);color:#1b1aff;pointer-events:none;font-size:10px;}
          .sub-wrap{position:relative;margin-bottom:4px;}
          .sub-drop{width:100%;background:#000;border:1px solid #1b1aff;color:#1b1aff;font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:8px 10px;outline:none;cursor:pointer;-webkit-appearance:none;appearance:none;}
          .lic-hint{font-family:'Space Mono',monospace;font-size:9px;color:#4a5488;letter-spacing:.06em;margin-top:4px;}
          .wm-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid #0e0f28;margin-bottom:8px;}
          .wm-btn{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:8px;border:none;background:transparent;color:#4a5488;cursor:pointer;transition:all .15s;}
          .wm-btn.on{color:#1b1aff;border-bottom:2px solid #1b1aff;}
          .wp-list{display:flex;flex-direction:column;max-height:200px;overflow-y:auto;}
          .wp-row{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border:1px solid #0e0f28;border-top:none;cursor:pointer;transition:all .15s;}
          .wp-row:first-child{border-top:1px solid #0e0f28;}
          .wp-row:hover,.wp-row.on{background:rgba(27,26,255,0.1);}
          .wp-name{font-size:12px;color:#7888c0;}
          .wp-chk{width:18px;height:18px;border:1px solid #282c52;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
          .wp-row.on .wp-chk{background:#1b1aff;border-color:#1b1aff;}

          /* PRICE */
          .price-ctx{font-family:'Space Mono',monospace;font-size:10px;color:#4a5488;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;}
          .price-big{font-size:3rem;color:#e8e8ff;line-height:1;margin-bottom:10px;font-weight:700;}
          .trial-btn{width:100%;font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#4a5488;background:transparent;border:1px solid #1b1aff;padding:11px;cursor:pointer;transition:all .15s;text-align:center;display:block;margin-top:6px;}
          .trial-btn:hover{color:#1b1aff;}
          .trust-list{display:flex;flex-direction:column;gap:5px;padding:10px 16px;}
          .trust-item{display:flex;align-items:center;gap:8px;}
          .trust-dot{width:5px;height:5px;border-radius:50%;background:#1b1aff;flex-shrink:0;}
          .trust-txt{font-size:11px;color:#4a5488;}

          /* TOAST */
          .toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(20px);background:#1a6b3a;color:#fff;font-size:12px;font-weight:600;padding:10px 24px;opacity:0;transition:all .3s;z-index:999;pointer-events:none;white-space:nowrap;}
          .toast.show{opacity:1;transform:translateX(-50%) translateY(0);}

          /* STICKY BUY BAR */
          .sticky-buy{position:fixed;bottom:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:12px 2rem;background:rgba(0,0,0,0.97);border-top:1px solid #1b1aff;backdrop-filter:blur(12px);}
          .sticky-buy-info{display:flex;align-items:center;gap:1.5rem;flex:1;min-width:0;}
          .sticky-buy-name{font-family:'Space Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#e8e8ff;white-space:nowrap;}
          .sticky-buy-meta{font-family:'Space Mono',monospace;font-size:10px;color:#4a5488;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;}
          .sticky-buy-price{font-size:1.8rem;color:#e8e8ff;line-height:1;flex-shrink:0;font-weight:700;}
          .sticky-buy-actions{display:flex;align-items:center;gap:8px;flex-shrink:0;}
          .sticky-trial{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#4a5488;background:transparent;border:1px solid #0e0f28;padding:10px 16px;cursor:pointer;transition:all .15s;white-space:nowrap;}
          .sticky-trial:hover{border-color:#1b1aff;color:#1b1aff;}
          .sticky-cta{font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#fff;background:#1b1aff;border:none;padding:12px 24px;cursor:pointer;white-space:nowrap;}
          .page-bottom-pad{height:72px;}

          /* FOOTER */
          .fp-ft{display:flex;justify-content:space-between;align-items:center;padding:.8rem 1.2rem;border-top:1px solid #0e0f28;background:#06060f;}
          .fp-ft a{font-family:'Space Mono',monospace;font-size:10px;color:#4a5488;letter-spacing:.1em;text-transform:uppercase;transition:color .15s;}
          .fp-ft a:hover{color:#e8e8ff;}

          /* ANIMATIONS */
          @keyframes wave{0%,100%{transform:translateY(0)}25%{transform:translateY(-8px)}75%{transform:translateY(8px)}}
          @keyframes glitch{0%,100%{text-shadow:none;transform:none}20%{text-shadow:-2px 0 #f00,2px 0 #0ff;transform:skew(-1deg)}60%{text-shadow:2px 0 #f00,-2px 0 #0ff;transform:skew(1deg)}}
          @keyframes neon{0%,100%{text-shadow:0 0 10px #1b1aff,0 0 20px #1b1aff,0 0 40px #1b1aff}50%{text-shadow:0 0 5px #1b1aff,0 0 10px #1b1aff}}
          @keyframes gravity{0%{transform:translateY(-40px);opacity:0}60%{transform:translateY(4px)}100%{transform:translateY(0);opacity:1}}
          .anim-wave .stage-inner{animation:wave 1.2s ease-in-out infinite;}
          .anim-glitch .stage-inner{animation:glitch 0.4s steps(1) infinite;}
          .anim-neon .stage-inner{animation:neon 1.5s ease-in-out infinite;}
          .anim-gravity .stage-inner{animation:gravity 0.6s cubic-bezier(.22,.61,.36,1) forwards;}
        `}</style>
      </Head>

      <Script src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=GBP`} onReady={() => setPaypalReady(true)} />

      {/* NAV */}
      <nav className="nav">
        <Link href="/" className="nav-back">&#8592; ALL</Link>
        <div className="nav-title">
          {font.name.toUpperCase()}
          <span className="nav-test-badge">TEST PAGE</span>
        </div>
        <a href="#buy" className="nav-buy">BUY &#8594;</a>
      </nav>

      {/* GLYPH FULLSCREEN */}
      {focusedGlyph && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.95)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:500, cursor:'pointer' }} onClick={() => setFocusedGlyph(null)}>
          <div style={{ fontFamily:ff, fontWeight:style.weight, fontSize:'clamp(8rem,18vw,16rem)', lineHeight:1, color:'#e8e8ff' }}>
            {focusedGlyph}
          </div>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:11, color:'#4a5488', letterSpacing:'.1em', marginTop:'1rem' }}>
            U+{focusedGlyph.charCodeAt(0).toString(16).toUpperCase().padStart(4,'0')} &middot; Click to close
          </div>
        </div>
      )}

      {/* TWO COLUMN LAYOUT */}
      <div className="page-wrap">

        {/* ── LEFT COLUMN ── */}
        <div className="left">

          {/* Stage */}
          <div className={`stage-wrap${animation ? ' anim-' + animation : ''}`}>
            <div
              contentEditable={true}
              suppressContentEditableWarning={true}
              className="stage-ce"
              onInput={e => { setPreviewText(e.currentTarget.textContent || ''); setAnimation(null); }}
              onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
              spellCheck={false}
              style={{ fontFamily:ff, fontWeight:style.weight, fontStyle:style.oblique?'italic':'normal', fontSize:fontSize+'px', letterSpacing:letterSpacing+'%', lineHeight:lineHeight }}
            />
            <div className="stage-display">
              <div className="stage-inner" style={{ fontFamily:ff, fontWeight:style.weight, fontStyle:style.oblique?'italic':'normal', fontSize:fontSize+'px', letterSpacing:letterSpacing+'%', lineHeight:lineHeight, color:'#e8e8ff' }}>
                {previewText || fontPhrase}
              </div>
            </div>
            {!previewText && !animation && (
              <div className="stage-hint">CLICK TO TYPE...</div>
            )}
          </div>

          {/* Meta strip */}
          <div className="meta-strip">
            <div className="meta-cell">
              <span className="meta-val">{String(font.styles.length).padStart(2,'0')}</span>
              <span className="meta-key">Weights</span>
            </div>
            <div className="meta-cell">
              <span className="meta-val">{font.glyphCount}</span>
              <span className="meta-key">Glyphs</span>
            </div>
            <div className="meta-cell" style={{ flex:2 }}>
              <span className="meta-lang">{font.languages}</span>
              <span className="meta-key">Languages</span>
            </div>
          </div>

          {/* Description */}
          <div className="long-desc">
            <p>{font.longDescription || font.description}</p>
          </div>

          {/* Glyphs */}
          <div className="glyph-section">
            <div className="glyph-tabs">
              {Object.keys(GLYPH_SETS).map(k => (
                <button key={k} className={`g-tab${glyphSet===k?' on':''}`} onClick={() => setGlyphSet(k)}>
                  {k.charAt(0) + k.slice(1).toLowerCase()}
                </button>
              ))}
              <span className="g-count">{allGlyphs.length} shown &middot; {font.glyphCount}+ total</span>
            </div>
            <div className="g-grid">
              {allGlyphs.map((g,i) => (
                <div key={i} className="g-cell" onClick={() => setFocusedGlyph(g)}>
                  <span className="g-char" style={{ fontFamily:ff, fontWeight:style.weight }}>{g}</span>
                  <span className="g-code">U+{g.charCodeAt(0).toString(16).toUpperCase().padStart(4,'0')}</span>
                </div>
              ))}
            </div>
            <div className="g-hint">Click any glyph to enlarge</div>
          </div>

          {/* Ticker */}
          <div className="ticker-wrap">
            <div className="ticker-track">
              {'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('').map((ch,i) => (
                <span key={i} className="ticker-char" style={{ fontFamily:ff, fontWeight:style.weight }}>{ch}</span>
              ))}
            </div>
          </div>

          {/* Specimens */}
          {specimens.length > 0 && (
            <div className="spec-sec">
              <div className="spec-main"><img src={specimens[activeSpecimen]} alt={font.name + ' specimen'} /></div>
              <div className="spec-thumbs">
                {specimens.map((src,i) => (
                  <div key={i} className={`spec-thumb${activeSpecimen===i?' on':''}`} onClick={() => setActiveSpecimen(i)}>
                    <img src={src} alt={'specimen ' + (i+1)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Weights */}
          <div className="weights-sec">
            <div className="weights-hd"><span className="weights-hd-txt">All Weights</span></div>
            {font.styles.map((s,i) => (
              <div key={i} className={`wr${activeStyle===i?' on':''}`} onClick={() => setActiveStyle(i)}>
                <span className="wr-name">{s.name.toUpperCase()}</span>
                <span className="wr-sample" style={{ fontFamily:ff, fontWeight:s.weight, fontStyle:s.oblique?'italic':'normal' }}>
                  {previewText || ZEN_SENTENCE}
                </span>
                <button className={`wr-add${addedIdx===i?' added':''}`} onClick={e => addToCart(i, e)}>
                  {addedIdx===i ? '\u2713 ADDED' : 'ADD +'}
                </button>
              </div>
            ))}
          </div>

        </div>
        {/* ── END LEFT COLUMN ── */}

        {/* ── RIGHT PANEL ── */}
        <div className="panel">

          {/* Weight selector */}
          <div className="panel-row">
            <div className="panel-lbl">Font Weight</div>
            <div className="w-drop-wrap">
              <select className="w-drop" value={activeStyle} onChange={e => setActiveStyle(+e.target.value)}>
                {font.styles.map((s,i) => (
                  <option key={i} value={i}>{font.name.toUpperCase()} {s.name.toUpperCase()}</option>
                ))}
              </select>
              <span className="w-drop-arrow">&#9660;</span>
            </div>
          </div>

          {/* Sliders */}
          <div className="panel-row">
            <div className="slider-row">
              <span className="slider-nm">Size</span>
              <input type="range" className="slider" min="12" max="200" value={fontSize} onChange={e => setFontSize(+e.target.value)} />
              <span className="slider-val">{fontSize}px</span>
            </div>
            <div className="slider-row">
              <span className="slider-nm">Spacing</span>
              <input type="range" className="slider" min="-10" max="30" value={letterSpacing} onChange={e => setLetterSpacing(+e.target.value)} />
              <span className="slider-val">{letterSpacing > 0 ? '+' : ''}{letterSpacing.toFixed(2)}</span>
            </div>
            <div className="slider-row">
              <span className="slider-nm">Height</span>
              <input type="range" className="slider" min="5" max="25" value={Math.round(lineHeight*10)} onChange={e => setLineHeight(+e.target.value/10)} />
              <span className="slider-val">{lineHeight.toFixed(2)}</span>
            </div>
          </div>

          {/* Type Lab */}
          <div className="panel-row">
            <div className="panel-lbl">Type Lab</div>
            <div className="anim-grid">
              {[
                { key:'wave',    label:'Wave' },
                { key:'glitch',  label:'Glitch' },
                { key:'neon',    label:'Neon' },
                { key:'gravity', label:'Gravity' },
                { key:'fade',    label:'Fade In' },
              ].map(a => (
                <button key={a.key} className={`anim-btn${animation===a.key?' on':''}`}
                  onClick={() => setAnimation(animation===a.key ? null : a.key)}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* License */}
          <div className="panel-row" id="buy">
            <div className="panel-lbl">License Type</div>
            <div className="lic-wrap">
              <select className="lic-drop" value={licenseType} onChange={e => setLicenseType(e.target.value)}>
                {LICENSE_TYPES.map(l => <option key={l.key} value={l.key}>{l.label.toUpperCase()}</option>)}
              </select>
              <span className="lic-arrow">&#9660;</span>
            </div>
            {licenseType === 'desktop' && (
              <div style={{ marginTop:8 }}>
                <div className="panel-sublbl">Number of seats</div>
                <div className="sub-wrap">
                  <select className="sub-drop" value={desktopSeats} onChange={e => setDesktopSeats(+e.target.value)}>
                    {SEAT_OPTIONS.map(s => <option key={s} value={s}>{s} SEAT{s>1?'S':''}</option>)}
                  </select>
                  <span className="lic-arrow">&#9660;</span>
                </div>
                <div className="lic-hint">installation on {desktopSeats} computer{desktopSeats>1?'s':''}</div>
              </div>
            )}
            {licenseType === 'webfont' && (
              <div style={{ marginTop:8 }}>
                <div className="panel-sublbl">Monthly pageviews</div>
                <div className="sub-wrap">
                  <select className="sub-drop" value={webPageviews} onChange={e => setWebPageviews(e.target.value)}>
                    {PAGEVIEW_OPTIONS.map(p => <option key={p} value={p}>{p.toUpperCase()} PV/MO</option>)}
                  </select>
                  <span className="lic-arrow">&#9660;</span>
                </div>
              </div>
            )}
            {!['desktop','webfont'].includes(licenseType) && (
              <div className="lic-hint">{licDef ? licDef.desc : ''}</div>
            )}
          </div>

          {/* Weight selection */}
          <div className="panel-row">
            <div className="panel-lbl">Weight Selection</div>
            <div className="wm-grid">
              <button className={`wm-btn${weightMode==='single'?' on':''}`} onClick={() => setWeightMode('single')}>Individual</button>
              <button className={`wm-btn${weightMode==='full'?' on':''}`} onClick={() => setWeightMode('full')}>Full Family</button>
            </div>
            {weightMode === 'single' ? (
              <div className="wp-list">
                {font.styles.map((s,i) => (
                  <div key={i} className={`wp-row${selectedWeights.has(i)?' on':''}`} onClick={() => toggleWeight(i)}>
                    <span className="wp-name" style={{ fontFamily:ff, fontWeight:s.weight }}>{font.name} {s.name}</span>
                    <div className="wp-chk">{selectedWeights.has(i) && <span style={{ color:'#fff', fontSize:11 }}>&#10003;</span>}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize:11, color:'#7888c0', paddingTop:4 }}>
                All {font.styles.length} weights &mdash; best value
              </div>
            )}
          </div>

          {/* Price */}
          <div className="panel-row">
            <div className="price-ctx">{weightCount} WEIGHT{weightCount>1?'S':''} &middot; {licenseType.toUpperCase()}</div>
            <div className="price-big">&#163;{estPrice}</div>
            <div ref={paypalRef} style={{ minHeight:44 }}>
              {purchasing && <span style={{ fontSize:12, color:'#7888c0' }}>Processing...</span>}
            </div>
            <button className="trial-btn" onClick={() => window.location.href = `/api/trial?slug=${font.slug}`}>
              Free Trial Download
            </button>
          </div>

          {/* Trust */}
          <div className="trust-list">
            {[font.styles.length + ' font files', font.glyphCount + '+ glyphs', 'Instant download', 'Perpetual commercial license', 'PayPal Secure'].map((item,i) => (
              <div key={i} className="trust-item">
                <div className="trust-dot" />
                <span className="trust-txt">{item}</span>
              </div>
            ))}
          </div>

        </div>
        {/* ── END RIGHT PANEL ── */}

      </div>
      {/* ── END PAGE WRAP ── */}

      {/* Toast */}
      <div className={`toast${showToast?' show':''}`}>{toastMsg}</div>

      {/* Sticky buy bar */}
      <div className="sticky-buy">
        <div className="sticky-buy-info">
          <span className="sticky-buy-name">{font.name}</span>
          <span className="sticky-buy-meta">{weightCount} weight{weightCount>1?'s':''} &middot; {licenseType}</span>
        </div>
        <div className="sticky-buy-price">&#163;{estPrice}</div>
        <div className="sticky-buy-actions">
          <button className="sticky-trial" onClick={() => window.location.href=`/api/trial?slug=${font.slug}`}>
            Free Trial
          </button>
          <button className="sticky-cta" onClick={() => { const el = document.getElementById('buy'); el && el.scrollIntoView({ behavior:'smooth' }); }}>
            Buy Now &#8594;
          </button>
        </div>
      </div>

      <div className="page-bottom-pad" />

      {/* Footer */}
      <footer className="fp-ft">
        <span style={{ fontFamily:"'Space Mono',monospace", fontSize:11, fontWeight:700, color:'#4a5488', letterSpacing:'.1em' }}>HF</span>
        <div style={{ display:'flex', gap:'1.5rem' }}>
          <Link href="/licensing">Licensing</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </footer>
    </>
  );
}
