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
  ALPHABET:    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
  NUMERALS:    '0123456789'.split(''),
  PUNCTUATION: '.,;:!?\'"-—…()[]{}@#$%&*+<>='.split(''),
  ACCENTS:     'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖØÙÚÛÜÝàáâãäåæçèéêëìíîïñòóôõöøùúûüý'.split(''),
  ALL:         'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,;:!?'.split(''),
};

const LICENSE_TYPES = [
  { key: 'desktop',          label: 'DESKTOP' },
  { key: 'webfont',          label: 'WEBFONT' },
  { key: 'app',              label: 'APP' },
  { key: 'broadcast',        label: 'BROADCAST' },
  { key: 'brand',            label: 'BRAND FONT' },
  { key: 'enterprise',       label: 'ENTERPRISE' },
  { key: 'enterprise-group', label: 'GROUP ENTERPRISE' },
];

const DESKTOP_SEATS = [1,2,5,10,25,50,100];
const WEB_PAGEVIEWS = ['10,000','50,000','100,000','250,000','500,000','1,000,000','UNLIMITED'];
const PREVIEW_TEXT  = 'Zen samurai packs quartz koi jade silk.';

// Exact hex values from Figma screenshots
const BLUE         = '#1B1AFF';
const BLUE_DIM     = 'rgba(27,26,255,0.12)';
const PANEL_BG     = '#1B1AFF';   // panel sections use blue outline/bg on selected
const DARK_PANEL   = '#0E0E1A';   // main panel background (dark navy)
const DROPDOWN_BG  = '#1B1AFF1A'; // dropdown background (blue tinted)
const DROPDOWN_BDR = '#1B1AFF';   // dropdown border
const DIVIDER      = '#1C1D2F';   // divider lines
const TRIAL_BDR    = '#1C1D2F';   // free trial button outline
const TRIAL_TXT    = '#8A95A6';   // free trial text
const SLIDER_LINE  = '#1C1D2F';   // slider track
const WR_BG        = '#080917';   // weight row background
const SG = "'Space Grotesk', sans-serif";
const SM = "'Space Mono', monospace";
const DET = "'Determination', monospace";

export default function FontPage({ font }) {
  const [activeStyle,     setActiveStyle]     = useState(0);
  const [previewText,     setPreviewText]      = useState('');
  const [fontSize,        setFontSize]         = useState(72);
  const [letterSpacing,   setLetterSpacing]    = useState(0);
  const [lineHeight,      setLineHeight]       = useState(1.0);
  const [glyphSet,        setGlyphSet]         = useState('ALPHABET');
  const [activeSpecimen,  setActiveSpecimen]   = useState(0);
  const [viewMode,        setViewMode]         = useState('DISPLAY');
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

  const tiers      = pricing[font.isFamily ? 'family' : 'single'];
  const style      = font.styles[activeStyle];
  const fontFamily = `'${font.name}', monospace`;
  const specimens  = SPECIMENS[font.slug] || [];
  const fontIdx    = fonts.findIndex(f => f.slug === font.slug);
  const prevFont   = fonts[(fontIdx - 1 + fonts.length) % fonts.length];
  const nextFont   = fonts[(fontIdx + 1) % fonts.length];
  const allGlyphs  = GLYPH_SETS[glyphSet];
  const displayText = previewText || 'AaBbCcDd';
  const basePrice   = tiers?.desktop?.price || 45;
  const weightCount = weightMode === 'full' ? font.styles.length : selectedWeights.size;
  const estimatedPrice = weightMode === 'full'
    ? Math.round(basePrice * 1.8) : basePrice * weightCount;

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
          html,body{background:#000!important;color:#fff!important;font-family:${SG}!important;-webkit-font-smoothing:antialiased;}
          ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#000}::-webkit-scrollbar-thumb{background:#1C1D2F;}
          a{text-decoration:none;color:inherit;}button{cursor:pointer;}
          select,option{background:#0a0916;color:#fff;}

          /* ── NAV ── */
          .nav{
            position:sticky;top:0;z-index:200;
            display:grid;grid-template-columns:1fr auto;
            height:44px;border-bottom:1px solid ${DIVIDER};
            background:#000;
            padding-right:300px;
          }
          .nav-left{display:flex;align-items:stretch;}
          .nav-pill{
            font-family:${DET};font-size:.72rem;
            letter-spacing:.06em;text-transform:uppercase;
            color:#888;padding:0 20px;
            border-right:1px solid ${DIVIDER};
            display:flex;align-items:center;gap:8px;
            transition:color .15s;white-space:nowrap;
          }
          .nav-pill:hover{color:#fff;}
          .nav-pill-font{
            font-family:${DET};font-size:.72rem;
            letter-spacing:.06em;text-transform:uppercase;
            color:#888;padding:0 20px;
            border-right:1px solid ${DIVIDER};
            display:flex;align-items:center;gap:8px;
            transition:color .15s;white-space:nowrap;
          }
          .nav-pill-font:hover{color:#fff;}
          .nav-right{display:flex;align-items:stretch;}
          .nav-next{
            font-family:${DET};font-size:.72rem;
            letter-spacing:.06em;text-transform:uppercase;
            color:#888;padding:0 20px;
            display:flex;align-items:center;
            border-left:1px solid ${DIVIDER};
            transition:color .15s;white-space:nowrap;
          }
          .nav-next:hover{color:#fff;}
          .nav-buy{
            font-family:${DET};font-size:.76rem;
            letter-spacing:.1em;text-transform:uppercase;
            color:#fff;background:${BLUE};
            padding:0 22px;display:flex;align-items:center;
            border-left:1px solid ${DIVIDER};
            transition:opacity .15s;
          }
          .nav-buy:hover{opacity:.85;}

          /* ── MAIN LAYOUT ── */
          .main-wrap{display:block;margin-right:300px;}

          /* ── LEFT CANVAS ── */
          .canvas{border-right:1px solid ${DIVIDER};display:flex;flex-direction:column;transition:background .25s;}

          /* Stage */
          .stage-wrap{position:relative;height:520px;flex-shrink:0;}
          .stage-input{position:absolute;inset:0;width:100%;height:100%;background:transparent;border:none;outline:none;resize:none;color:transparent;caret-color:${BLUE};font-size:16px;padding:2.5rem;z-index:2;cursor:text;}
          .stage-display{position:absolute;inset:0;display:flex;align-items:center;padding:2.5rem;pointer-events:none;overflow:hidden;}
          .stage-text{width:100%;line-height:.92;letter-spacing:-.02em;word-break:break-word;}
          .stage-body{width:100%;max-width:58ch;}
          .stage-hint{
            position:absolute;bottom:14px;left:50%;transform:translateX(-50%);
            font-family:${DET};font-size:.65rem;color:${BLUE};
            letter-spacing:.2em;text-transform:uppercase;
            pointer-events:none;white-space:nowrap;
          }

          /* Meta strip */
          .meta-strip{display:flex;align-items:center;border-top:1px solid ${DIVIDER};padding:1rem 1.4rem;gap:2rem;flex-shrink:0;flex-wrap:wrap;}
          .meta-grp{display:flex;flex-direction:column;gap:4px;}
          .meta-num{font-family:${DET};font-size:1.6rem;color:#ffffff;line-height:1;}
          .meta-key{font-family:${DET};font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:#1B1AFF;}
          .meta-icons{display:flex;align-items:center;height:45px;flex:1;}
          .meta-icons img{height:45px;width:auto;}
          .meta-desc-block{width:100%;border-top:1px solid ${DIVIDER};padding-top:.8rem;margin-top:.2rem;}
          .meta-desc{font-family:${DET};font-size:.65rem;color:#1B1AFF;line-height:1.9;letter-spacing:.02em;}

          /* Glyph focused overlay */
          .glyph-focus{
            position:fixed;inset:0;display:flex;flex-direction:column;
            align-items:center;justify-content:center;z-index:500;cursor:pointer;
            background:rgba(0,0,0,0.95);
          }
          .glyph-focus-card{
            width:280px;height:280px;
            background:#000;border:2px solid ${BLUE};border-radius:16px;
            display:flex;flex-direction:column;align-items:center;justify-content:center;
            position:relative;
          }
          .glyph-focus-code{
            position:absolute;top:14px;left:50%;transform:translateX(-50%);
            font-family:${SM};font-size:10px;color:${BLUE};letter-spacing:.1em;
          }
          .glyph-focus-char{font-size:8rem;line-height:1;color:#fff;}
          .glyph-focus-hint{font-family:${SM};font-size:9px;color:#444;letter-spacing:.1em;margin-top:1.5rem;}

          /* ── RIGHT PANEL ── */
          .panel{
            background:#000;display:flex;flex-direction:column;
            overflow-y:auto;
            position:fixed;
            top:44px;right:0;
            width:300px;
            height:calc(100vh - 44px);
            border-left:1px solid ${DIVIDER};
            z-index:150;
          }
          .ps{padding:22px 20px;border-bottom:1px solid ${DIVIDER};}
          .ps-lbl{
            font-family:${DET};font-size:.85rem;font-weight:700;
            letter-spacing:.1em;text-transform:uppercase;
            color:#fff;margin-bottom:16px;display:block;
            text-decoration:none;
          }
          .ps-slider-row{display:flex;align-items:center;gap:14px;margin-bottom:24px;}
          .ps-slider-lbl{font-family:${DET};font-size:.75rem;color:#fff;width:64px;flex-shrink:0;letter-spacing:.04em;}
          .ps-slider-val{font-family:${DET};font-size:.75rem;color:#fff;width:48px;text-align:right;flex-shrink:0;padding-right:2px;}

          /* Dropdown */
          .dd-wrap{position:relative;margin-bottom:8px;}
          .dd{
            width:100%;
            background:${DARK_PANEL};
            border:1px solid ${BLUE};
            color:#ffffff;
            font-family:${DET};font-size:.72rem;
            font-weight:700;letter-spacing:.08em;text-transform:uppercase;
            padding:14px 40px 14px 16px;
            outline:none;cursor:pointer;
            -webkit-appearance:none;appearance:none;
            transition:border-color .15s;
          }
          .dd:focus{border-color:${BLUE};}
          .dd-arrow{
            position:absolute;right:12px;top:50%;transform:translateY(-50%);
            pointer-events:none;
            width:12px;height:6px;
          }
          .dd-sub{
            width:100%;
            background:${DARK_PANEL};
            border:1px solid ${BLUE};
            color:#335EFF;
            font-family:${DET};font-size:.72rem;
            letter-spacing:.08em;text-transform:uppercase;
            padding:12px 40px 12px 16px;
            outline:none;cursor:pointer;
            -webkit-appearance:none;appearance:none;
            margin-top:8px;
          }
          .dd-sub:focus{border-color:${BLUE};}
          .dd-lbl{font-family:${SG};font-size:13px;font-weight:600;color:#fff;margin-bottom:6px;margin-top:14px;}
          .dd-lbl span{color:#335eff;font-family:${SG};font-weight:400;}
          .dd-hint{font-family:${SM};font-size:10px;color:#8A95A6;margin-top:8px;letter-spacing:.06em;line-height:1.5;}

          /* Slider */
          .slider{
            flex:1;height:2px;-webkit-appearance:none;appearance:none;
            background:${SLIDER_LINE};outline:none;border-radius:1px;cursor:pointer;
          }
          .slider::-webkit-slider-thumb{
            -webkit-appearance:none;width:14px;height:14px;
            border-radius:50%;background:${BLUE};cursor:pointer;
          }

          /* Tools */
          .tools-row{display:flex;gap:16px;align-items:flex-end;margin-top:10px;}
          .tool-btn{
            background:transparent;border:none;
            display:flex;align-items:center;justify-content:center;
            cursor:pointer;transition:opacity .15s;padding:0;
          }
          .tool-btn:hover{opacity:.7;}
          .tool-btn.on{opacity:1;}
          .tool-btn img{object-fit:contain;display:block;}

          /* Weight mode */
          .wm-tabs{display:grid;grid-template-columns:1fr 1fr;gap:0;margin-bottom:8px;border:1px solid ${BLUE};}
          .wm-tab{
            font-family:${DET};font-size:.75rem;font-weight:700;
            letter-spacing:.08em;text-transform:uppercase;
            padding:12px 8px;background:transparent;color:#8A95A6;
            border:none;cursor:pointer;transition:all .15s;text-align:center;
          }
          .wm-tab:first-child{border-right:1px solid ${BLUE};}
          .wm-tab.on{background:${BLUE_DIM};color:${BLUE};}

          /* Weight picker list */
          .wp-list{display:flex;flex-direction:column;gap:4px;max-height:200px;overflow-y:auto;}
          .wp-row{
            display:flex;align-items:center;justify-content:space-between;
            padding:14px 14px;border:1px solid ${DIVIDER};cursor:pointer;transition:all .15s;
          }
          .wp-row:hover{border-color:#444;}
          .wp-row.on{border-color:${BLUE};background:${BLUE_DIM};}
          .wp-name{font-family:${SG};font-size:13px;color:#8A95A6;}
          .wp-row.on .wp-name{color:#fff;}
          .wp-check{
            width:30px;height:30px;border:1px solid #333;
            display:flex;align-items:center;justify-content:center;
            flex-shrink:0;transition:all .15s;border-radius:3px;
          }
          .wp-row.on .wp-check{background:${BLUE};border-color:${BLUE};}

          /* Price */
          .price-block{padding:22px 20px;border-bottom:1px solid ${DIVIDER};}
          .paypal-wrap{position:relative;margin-bottom:0;}
          .paypal-wrap iframe{border-radius:4px!important;}
          .paypal-tint{
            position:absolute;inset:0;
            background:#1B1BFF;
            mix-blend-mode:hue;
            pointer-events:none;
            border-radius:4px;
          }
          .price-context{font-family:${SM};font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#8A95A6;margin-bottom:6px;}
          .price-big{font-family:${DET};font-size:3.5rem;color:#fff;line-height:1;margin-bottom:16px;}
          .trial-btn{
            width:100%;font-family:${DET};font-size:.72rem;
            font-weight:700;letter-spacing:.1em;text-transform:uppercase;
            color:#8A95A6;background:transparent;
            border:1px solid ${TRIAL_BDR};
            padding:15px;transition:all .15s;margin-top:10px;
            border-radius:8px;
          }
          .trial-btn:hover{border-color:${BLUE};color:${BLUE};}

          /* Trust */
          .trust-list{padding:10px 16px;display:flex;flex-direction:column;gap:5px;border-bottom:1px solid ${DIVIDER};}
          .trust-item{display:flex;align-items:flex-start;gap:7px;}
          .trust-dot{width:4px;height:4px;border-radius:50%;background:${BLUE};flex-shrink:0;margin-top:5px;}
          .trust-txt{font-family:${SG};font-size:10px;color:#8A95A6;line-height:1.5;}

          /* ── GLYPH STRIP ── */
          .glyph-section{border-top:1px solid ${DIVIDER};background:#000;}
          .glyph-tabs{display:flex;border-bottom:1px solid ${DIVIDER};}
          .g-tab{
            font-family:${DET};font-size:.68rem;font-weight:700;
            letter-spacing:.08em;text-transform:uppercase;
            padding:10px 16px;background:transparent;color:#555;
            border:none;border-right:1px solid ${DIVIDER};
            cursor:pointer;transition:all .15s;
          }
          .g-tab:hover{color:#ccc;}
          .g-tab.on{color:${BLUE};background:${BLUE_DIM};}
          .g-count{font-family:${SM};font-size:9px;color:#333;padding:10px 14px;margin-left:auto;}
          .glyph-grid{display:flex;flex-wrap:wrap;padding:16px;gap:6px;}
          .g-cell{
            width:72px;height:92px;
            display:flex;flex-direction:column;align-items:center;justify-content:center;
            background:#000;border:1px solid #1B1D30;border-radius:8px;
            position:relative;cursor:pointer;transition:all .12s;flex-shrink:0;
            gap:4px;
          }
          .g-cell:hover{border-color:${BLUE};transform:scale(1.06);}
          .g-cell-code{font-family:${SM};font-size:7px;color:${BLUE};letter-spacing:.06em;position:absolute;top:6px;left:50%;transform:translateX(-50%);white-space:nowrap;}
          .g-cell-char{font-size:2.2rem;color:#ffffff;line-height:1;margin-top:12px;}
          .g-hint{font-family:${SM};font-size:9px;color:#222;padding:0 16px 12px;width:100%;}

          /* ── ALL WEIGHTS ── */
          .weights-section{border-bottom:1px solid ${DIVIDER};margin-right:300px;}
          .weights-header{padding:10px 1.2rem;border-bottom:1px solid ${DIVIDER};}
          .weights-title{font-family:${DET};font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#555;}
          .wr{
            display:grid;grid-template-columns:80px 1fr auto;
            align-items:center;gap:1rem;
            padding:1rem 1.2rem;border-bottom:1px solid #080917;
            cursor:pointer;transition:background .12s;
            background:${WR_BG};
          }
          .wr:hover{background:#100f20;}
          .wr.on{background:#12103a;}
          .wr-name{font-family:${DET};font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${BLUE};}
          .wr-sample{font-size:clamp(1.4rem,2.8vw,2.6rem);line-height:1.1;color:#fff;overflow:hidden;text-overflow:clip;white-space:nowrap;}
          .add-btn{
            font-family:${DET};font-size:.65rem;font-weight:700;
            letter-spacing:.1em;text-transform:uppercase;
            color:#fff;background:${BLUE};border:none;
            padding:7px 12px;cursor:pointer;transition:all .15s;white-space:nowrap;flex-shrink:0;
          }
          .add-btn:hover{opacity:.8;}
          .add-btn.done{background:#1a5c30;}

          /* ── SPECIMEN ── */
          .specimen-section{border-bottom:1px solid ${DIVIDER};margin-right:300px;}
          .specimen-header{padding:9px 1.4rem;border-bottom:1px solid ${DIVIDER};}
          .specimen-banner{
            background:${BLUE};padding:9px 1.4rem;
            font-family:${DET};font-size:.65rem;font-weight:700;
            letter-spacing:.1em;text-transform:uppercase;color:#fff;
            white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
          }
          .specimen-sub{font-family:${SM};font-size:9px;color:#333;letter-spacing:.12em;text-transform:uppercase;padding:7px 1.4rem;border-bottom:1px solid ${DIVIDER};}
          .specimen-stage{position:relative;overflow:hidden;}
          .specimen-stage img{width:100%;display:block;}
          .specimen-arrow{
            position:absolute;top:50%;transform:translateY(-50%);
            background:${BLUE};border:none;color:#fff;
            width:36px;height:52px;display:flex;align-items:center;justify-content:center;
            font-size:1.1rem;cursor:pointer;z-index:5;transition:opacity .15s;
          }
          .specimen-arrow:hover{opacity:.8;}
          .specimen-arrow-left{left:0;}
          .specimen-arrow-right{right:0;}

          /* ── ABC TICKER ── */
          .abc-ticker{overflow:hidden;padding:10px 0;border-bottom:1px solid ${DIVIDER};margin-right:300px;}
          .abc-track{display:flex;gap:1.2rem;animation:tickr 22s linear infinite;white-space:nowrap;}
          .abc-char{font-size:1.8rem;color:rgba(27,26,255,0.22);letter-spacing:.05em;}
          @keyframes tickr{from{transform:translateX(0)}to{transform:translateX(-50%)}}

          /* ── FOOTER ── */
          .fp-footer{
            display:grid;grid-template-columns:auto 1fr auto;
            align-items:center;padding:1rem 1.4rem;
            border-top:1px solid ${DIVIDER};background:#000;gap:1rem;
            margin-right:300px;
          }
          .footer-logo{font-family:${DET};font-size:.9rem;letter-spacing:.1em;color:#fff;}
          .footer-copy{font-family:${SM};font-size:9px;color:#333;text-align:center;text-transform:uppercase;letter-spacing:.08em;}
          .footer-links{display:flex;gap:1.5rem;justify-content:flex-end;}
          .footer-link{font-family:${SM};font-size:9px;color:#333;letter-spacing:.08em;text-transform:uppercase;transition:color .15s;}
          .footer-link:hover{color:#fff;}

          /* ── TOAST ── */
          .toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(20px);background:#1a5c30;color:#fff;font-family:${SG};font-size:12px;font-weight:600;padding:10px 24px;opacity:0;transition:all .3s;z-index:999;pointer-events:none;white-space:nowrap;letter-spacing:.06em;}
          .toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
        `}</style>
      </Head>

      <Script src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=GBP`} onReady={() => setPaypalReady(true)} />

      {/* ── NAV ── */}
      <nav className="nav">
        <div className="nav-left">
          <Link href="/" className="nav-pill">← ALL</Link>
          <Link href={`/typefaces/${prevFont.slug}`} className="nav-pill-font">← {prevFont.name.toUpperCase()}</Link>
        </div>
        <div className="nav-right">
          <Link href={`/typefaces/${nextFont.slug}`} className="nav-next">{nextFont.name.toUpperCase()} →</Link>
          <a href="#buy" className="nav-buy">BUY →</a>
        </div>
      </nav>

      {/* ── MAIN GRID ── */}
      <div className="main-wrap">

        {/* LEFT CANVAS */}
        <div className="canvas" style={{ background: bgColor }}>

          {/* Fullscreen glyph */}
          {focusedGlyph && (
            <div className="glyph-focus" onClick={() => setFocusedGlyph(null)}>
              <div className="glyph-focus-card">
                <div className="glyph-focus-code">U+{focusedGlyph.charCodeAt(0).toString(16).toUpperCase().padStart(4,'0')}</div>
                <div className="glyph-focus-char" style={{ fontFamily, fontWeight: style.weight, color: textColor }}>
                  {focusedGlyph}
                </div>
              </div>
              <div className="glyph-focus-hint">Click to close</div>
            </div>
          )}

          {/* Stage */}
          <div className="stage-wrap" style={{ background: bgColor }}>
            <textarea ref={inputRef} className="stage-input" value={previewText} onChange={e => setPreviewText(e.target.value)} maxLength={80} spellCheck={false} autoCorrect="off" autoComplete="off" />
            <div className="stage-display">
              {viewMode === 'BODY' ? (
                <div className="stage-body" style={{ fontFamily, fontWeight:style.weight, fontSize:Math.min(fontSize,20)+'px', lineHeight:lineHeight+0.6, color:textColor }}>
                  {previewText || 'Zen samurai packs quartz koi jade silk. The art of type is the art of thought made visible.'}
                </div>
              ) : (
                <div className="stage-text" style={{ fontFamily, fontWeight:style.weight, fontStyle:style.oblique?'italic':'normal', fontSize:(viewMode==='HEADLINE'?Math.max(fontSize,64):fontSize)+'px', letterSpacing:letterSpacing+'%', lineHeight:lineHeight, color:textColor }}>
                  {displayText}
                </div>
              )}
            </div>
            {!previewText && <div className="stage-hint">CLICK ANYWHERE TO TYPE...</div>}
          </div>

          {/* Meta strip */}
          <div className="meta-strip">
            <div className="meta-grp">
              <div className="meta-num">{String(font.styles.length).padStart(2,'0')}</div>
              <div className="meta-key">Weights</div>
            </div>
            <div className="meta-grp">
              <div className="meta-num">{font.glyphCount}</div>
              <div className="meta-key">Glyphs</div>
            </div>
            <div className="meta-grp">
              <div className="meta-num">{font.languages || '54'}</div>
              <div className="meta-key">Languages</div>
            </div>
            {/* Icons from SVG */}
            <div className="meta-icons">
              <img src="/elements/icons.svg" alt="icons" />
            </div>
            {/* Description below in blue DET font */}
            <div className="meta-desc-block">
              <div className="meta-desc">{font.longDescription || font.description}</div>
            </div>
          </div>
          {/* ── GLYPH STRIP (inside left column) ── */}
          <div className="glyph-section">
            <div className="glyph-tabs">
              {Object.keys(GLYPH_SETS).map(k => (
                <button key={k} className={`g-tab${glyphSet===k?' on':''}`} onClick={() => setGlyphSet(k)}>
                  {k.charAt(0)+k.slice(1).toLowerCase()}
                </button>
              ))}
              <span className="g-count">{allGlyphs.length} shown · {font.glyphCount}+ total</span>
            </div>
            <div className="glyph-grid">
              {allGlyphs.map((g,i) => (
                <div key={i} className="g-cell" style={{ fontFamily, fontWeight:style.weight }} onClick={() => setFocusedGlyph(g)}>
                  <div className="g-cell-code">U+{g.charCodeAt(0).toString(16).toUpperCase().padStart(4,'0')}</div>
                  <div className="g-cell-char">{g}</div>
                </div>
              ))}
            </div>
            <div className="g-hint">Click any glyph to enlarge</div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="panel">

          {/* FONT WEIGHT */}
          <div className="ps">
            <div className="ps-lbl">Font Weight</div>
            <div className="dd-wrap">
              <select className="dd" value={activeStyle} onChange={e => setActiveStyle(+e.target.value)}>
                {font.styles.map((s,i) => (
                  <option key={i} value={i}>{font.name.toUpperCase()} {s.name.toUpperCase()}</option>
                ))}
              </select>
              <img src="/elements/dropdown-arrow.svg" className="dd-arrow" alt="" />
            </div>

            {/* Size slider */}
            <div className="ps-slider-row" style={{ marginTop: 24 }}>
              <span className="ps-slider-lbl">Size</span>
              <input type="range" className="slider" min="12" max="200" value={fontSize} onChange={e => setFontSize(+e.target.value)} />
              <span className="ps-slider-val">{fontSize}px</span>
            </div>

            {/* Spacing slider */}
            <div className="ps-slider-row">
              <span className="ps-slider-lbl">Spacing</span>
              <input type="range" className="slider" min="-10" max="30" value={letterSpacing} onChange={e => setLetterSpacing(+e.target.value)} />
              <span className="ps-slider-val">{letterSpacing > 0?'+':''}{letterSpacing}.00</span>
            </div>

            {/* Height slider */}
            <div className="ps-slider-row" style={{ marginBottom:0 }}>
              <span className="ps-slider-lbl">Height</span>
              <input type="range" className="slider" min="5" max="25" value={Math.round(lineHeight*10)} onChange={e => setLineHeight(+e.target.value/10)} />
              <span className="ps-slider-val">{lineHeight.toFixed(2)}</span>
            </div>
          </div>

          {/* TOOLS */}
          <div className="ps">
            <div className="ps-lbl">Tools</div>
            <div className="tools-row">
              <button className={`tool-btn${viewMode==='DISPLAY'?' on':''}`} onClick={() => setViewMode('DISPLAY')} title="Display">
                <img src="/elements/tools-aa.svg" alt="Display" style={{ width:52, height:54 }} />
              </button>
              <button className={`tool-btn${viewMode==='BODY'?' on':''}`} onClick={() => setViewMode('BODY')} title="Body text">
                <img src="/elements/tools-colour-picker.svg" alt="Colour" style={{ width:54, height:54 }} />
              </button>
              <button className={`tool-btn${viewMode==='HEADLINE'?' on':''}`} onClick={() => setViewMode('HEADLINE')} title="Headline">
                <img src="/elements/tools-heart.svg" alt="Heart" style={{ width:58, height:52 }} />
              </button>
              <button className="tool-btn" onClick={() => inputRef.current?.focus()} title="Type">
                <img src="/elements/tools-finger.svg" alt="Type" style={{ width:36, height:52 }} />
              </button>
            </div>
          </div>

          {/* LICENSE TYPE */}
          <div className="ps" id="buy">
            <div className="ps-lbl">License Type</div>
            <div className="dd-wrap">
              <select className="dd" value={licenseType} onChange={e => setLicenseType(e.target.value)}>
                {LICENSE_TYPES.map(l => <option key={l.key} value={l.key}>{l.label}</option>)}
              </select>
              <img src="/elements/dropdown-arrow.svg" className="dd-arrow" alt="" />
            </div>

            {licenseType === 'desktop' && (
              <>
                <div className="dd-lbl">Number of seats <span>(installations)</span></div>
                <div className="dd-wrap">
                  <select className="dd-sub" value={desktopSeats} onChange={e => setDesktopSeats(+e.target.value)}>
                    {DESKTOP_SEATS.map(s => <option key={s} value={s}>{s} SEAT{s>1?'S':''}</option>)}
                  </select>
                  <img src="/elements/dropdown-arrow.svg" className="dd-arrow" alt="" />
                </div>
                <div className="dd-hint">installation on {desktopSeats} computer{desktopSeats>1?'s':''}</div>
              </>
            )}

            {licenseType === 'webfont' && (
              <>
                <div className="dd-lbl">Monthly pageviews</div>
                <div className="dd-wrap">
                  <select className="dd-sub" value={webPageviews} onChange={e => setWebPageviews(e.target.value)}>
                    {WEB_PAGEVIEWS.map(p => <option key={p} value={p}>{p} PAGEVIEWS/MO</option>)}
                  </select>
                  <img src="/elements/dropdown-arrow.svg" className="dd-arrow" alt="" />
                </div>
              </>
            )}

            {!['desktop','webfont'].includes(licenseType) && (
              <div className="dd-hint">
                {licenseType==='app'              && 'For embedding in a single application.'}
                {licenseType==='broadcast'        && 'For TV, film and broadcast productions.'}
                {licenseType==='brand'            && 'Primary brand typeface across all media.'}
                {licenseType==='enterprise'       && 'Unlimited seats within one organisation.'}
                {licenseType==='enterprise-group' && 'Unlimited across multiple organisations.'}
              </div>
            )}
          </div>

          {/* WEIGHT SELECTION */}
          <div className="ps">
            <div className="ps-lbl">Weight Selection</div>
            <div className="wm-tabs">
              <button className={`wm-tab${weightMode==='single'?' on':''}`} onClick={() => setWeightMode('single')}>Individual</button>
              <button className={`wm-tab${weightMode==='full'?' on':''}`} onClick={() => setWeightMode('full')}>Full Family</button>
            </div>
            {weightMode === 'single' ? (
              <div className="wp-list">
                {font.styles.map((s,i) => (
                  <div key={i} className={`wp-row${selectedWeights.has(i)?' on':''}`} onClick={() => toggleWeight(i)}>
                    <span className="wp-name">{font.name} {s.name}</span>
                    <div className="wp-check">
                      {selectedWeights.has(i) && <span style={{ color:'#fff', fontSize:11 }}>✓</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontFamily:SG, fontSize:11, color:'#8A95A6', padding:'4px 0' }}>
                All {font.styles.length} weights — best value
              </div>
            )}
          </div>

          {/* PRICE + BUY */}
          <div className="price-block">
            <div className="price-context">{weightCount} {weightCount===1?'weight':'weights'} · {licenseType.toUpperCase()}</div>
            <div className="price-big">£{estimatedPrice}</div>
            <div className="paypal-wrap">
              <div ref={paypalRef} style={{ minHeight:44 }}>
                {purchasing && <span style={{ fontFamily:SG, fontSize:12, color:'#666' }}>Processing...</span>}
              </div>
              <div className="paypal-tint" />
            </div>
            <button className="trial-btn" onClick={() => window.location.href=`/api/trial?slug=${font.slug}`}>
              FREE TRIAL DOWNLOAD
            </button>
          </div>

          {/* TRUST */}
          <div className="trust-list">
            {[`${font.styles.length} font files`, `${font.glyphCount}+ glyphs`, 'Instant download', 'Perpetual license', 'PayPal Secure'].map((t,i) => (
              <div key={i} className="trust-item">
                <div className="trust-dot" />
                <span className="trust-txt">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* ── ABC TICKER ── */}
      <div className="abc-ticker">
        <div className="abc-track">
          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('').map((ch,i) => (
            <span key={i} className="abc-char" style={{ fontFamily, fontWeight:style.weight }}>{ch}</span>
          ))}
        </div>
      </div>

      {/* ── ALL WEIGHTS ── */}
      <div className="weights-section">
        <div className="weights-header"><div className="weights-title">All Weights</div></div>
        {font.styles.map((s,i) => (
          <div key={i} className={`wr${activeStyle===i?' on':''}`} onClick={() => setActiveStyle(i)}>
            <span className="wr-name">{s.name.toUpperCase()}</span>
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
          <div className="specimen-header"><div className="weights-title">Specimen Designs</div></div>
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
        {toastMsg} · <Link href="/cart" style={{ color:'#fff', textDecoration:'underline' }}>View Cart</Link>
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
