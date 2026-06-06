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
  ALL:         'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,;:!?\'"-—…()[]{}@#$%&*'.split(''),
};

const LICENSE_TYPES = [
  { key:'desktop',   label:'Desktop',         sub:'seats',     subLabel:'Number of seats (installations)', desc:'installation on {n} computer{s}' },
  { key:'webfont',   label:'Webfont',          sub:'pageviews', subLabel:'Monthly pageviews', desc:'up to {n} pageviews/month' },
  { key:'app',       label:'App',              sub:null,        desc:'Single mobile or desktop application' },
  { key:'broadcast', label:'Broadcast',        sub:null,        desc:'TV, film and streaming productions' },
  { key:'brand',     label:'Brand Font',       sub:null,        desc:'Primary brand typeface across all media' },
  { key:'enterprise',label:'Enterprise',       sub:null,        desc:'Unlimited use within one organisation' },
  { key:'group',     label:'Group Enterprise', sub:null,        desc:'Unlimited use across multiple organisations' },
];

const SEAT_OPTIONS      = [1,2,5,10,25,50,100];
const PAGEVIEW_OPTIONS  = ['10,000','50,000','100,000','250,000','500,000','1,000,000','Unlimited'];
const ZEN_SENTENCE      = 'Zen samurai packs quartz koi jade silk.';


const FONT_PHRASES = {
  'babalove':          'Love is bold.',
  'baq-rounded':       'Round the world.',
  'bomkin':            'Break the mold.',
  'crop':              'Sharp & clean.',
  'do-it-again':       'Do it again.',
  'ebisu':             'Tokyo nights.',
  'electro':           'Live wire.',
  'headlined':         'Make headlines.',
  'headlined-solid':   'Own the page.',
  'hiroko':            'Still water runs deep.',
  'hiruko':            'Between two worlds.',
  'kono':              'This is now.',
  'letro':             'Letters that move.',
  'lippy':             'Say it loud.',
  'miyagi':            'Balance everything.',
  'monino-pro':        'Precision built.',
  'monolite':          'One line. Pure.',
  'nanami':            '美しい文字。',
  'nanami-handmade':   'Written by hand.',
  'nanami-rounded-pro':'Soft power.',
  'nanami-3d':         'Depth of field.',
  'nanami-extended':   'Reach further.',
  'nerolina':          'Refined by nature.',
  'odyssea':           'Set sail.',
  'patisserie':        'Sweet precision.',
  'rika':              'Urban edge.',
  'roka':              'Stand firm.',
  'roxic':             'Rule breaker.',
  'shine-pro':         'Catch the light.',
  'sobek':             'Ancient power.',
  'soto':              'Outside the lines.',
  'squoosh-gothic':    'Compressed. Intense.',
  'vow-neue':          'A promise kept.',
  'yoko':              '横書きの美。',
  'york-handwriting':  'Written with care.',
  'yuki':              '雪のように。',
  'yuko':              'Gentle strength.',
  'yume':              '夢を見ている。',
  'yumo':              'Flow state.',
};

export default function FontPage({ font }) {
  const [activeStyle,     setActiveStyle]     = useState(0);
  const [previewText,     setPreviewText]      = useState('');
  const [fontSize,        setFontSize]         = useState(120);
  const [letterSpacing,   setLetterSpacing]    = useState(0);
  const [lineHeight,      setLineHeight]       = useState(1.0);
  const [glyphSet,        setGlyphSet]         = useState('ALPHABET');
  const [activeSpecimen,  setActiveSpecimen]   = useState(0);
  const [licenseType,     setLicenseType]      = useState('desktop');
  const [desktopSeats,    setDesktopSeats]     = useState(1);
  const [webPageviews,    setWebPageviews]     = useState('10,000');
  const [weightMode,      setWeightMode]       = useState('single');
  const [selectedWeights, setSelectedWeights]  = useState(new Set([0]));
  const [focusedGlyph,    setFocusedGlyph]     = useState(null);
  const [addedIdx,        setAddedIdx]         = useState(null);
  const [cartCount,       setCartCount]        = useState(0);
  const [toastMsg,        setToastMsg]         = useState('');
  const [showToast,       setShowToast]        = useState(false);
  const [paypalReady,     setPaypalReady]      = useState(false);
  const [purchasing,      setPurchasing]       = useState(false);
  const [animation,       setAnimation]        = useState(null);
  const [mockupPrompt,    setMockupPrompt]     = useState('');
  const [mockupResult,    setMockupResult]     = useState(null);
  const [mockupLoading,   setMockupLoading]    = useState(false);
  const paypalRef = useRef(null);
  const stageRef  = useRef(null);

  const tiers     = pricing[font.isFamily ? 'family' : 'single'];
  const style     = font.styles[activeStyle];
  const ff        = `'${font.name}', monospace`;
  const specimens = SPECIMENS[font.slug] || [];
  const fi        = fonts.findIndex(f => f.slug === font.slug);
  const prevFont  = fonts[(fi - 1 + fonts.length) % fonts.length];
  const nextFont  = fonts[(fi + 1) % fonts.length];
  const allGlyphs = GLYPH_SETS[glyphSet];
  const weightCount = weightMode === 'full' ? font.styles.length : selectedWeights.size;
  const basePrice = tiers?.desktop?.price || 45;
  const estPrice  = weightMode === 'full' ? Math.round(basePrice * 1.8) : basePrice * weightCount;

  const licDef = LICENSE_TYPES.find(l => l.key === licenseType);
  const licDesc = licDef?.desc
    .replace('{n}', licenseType === 'desktop' ? desktopSeats : webPageviews)
    .replace('{s}', desktopSeats === 1 ? '' : 's') || '';

  useEffect(() => {
    try { setCartCount(JSON.parse(localStorage.getItem('hft_cart') || '[]').length); } catch(_) {}
  }, [addedIdx]);

  const toggleWeight = (i) => {
    setSelectedWeights(prev => {
      const n = new Set(prev);
      if (n.has(i) && n.size > 1) n.delete(i); else n.add(i);
      return n;
    });
  };

  const addToCart = (styleIdx, e) => {
    e?.stopPropagation();
    const s = font.styles[styleIdx];
    const item = { slug: font.slug, name: font.name, style: s.name, weight: s.weight, license: licenseType };
    try {
      const existing = JSON.parse(localStorage.getItem('hft_cart') || '[]');
      localStorage.setItem('hft_cart', JSON.stringify([...existing, item]));
    } catch(_) {}
    setAddedIdx(styleIdx);
    setToastMsg(`${font.name} ${s.name} added to cart`);
    setShowToast(true);
    setTimeout(() => { setShowToast(false); setAddedIdx(null); }, 2500);
  };

  useEffect(() => {
    if (!paypalReady || !paypalRef.current) return;
    paypalRef.current.innerHTML = '';
    window.paypal?.Buttons({
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
      style: { layout:'horizontal', color:'blue', shape:'rect', label:'buynow', height:44, tagline:false },
    })?.render(paypalRef.current);
  }, [paypalReady, licenseType, estPrice, font]);

  const generateMockup = async () => {
    if (!mockupPrompt.trim()) return;
    setMockupLoading(true);
    setMockupResult(null);
    try {
      const res = await fetch('/api/anthropic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          messages: [{
            role: 'user',
            content: 'Creative director task. Brief: "' + mockupPrompt + '". Font: "' + font.name + '". Respond with ONLY a raw JSON object, no markdown fences, no explanation. Schema: {"headline":"max 3 words","subline":"max 6 words","bg":"dark hex e.g. #0a0a14","accent":"light hex e.g. #f0e8d0","label":"context type e.g. PACKAGING"}'
          }]
        })
      });
      const data = await res.json();
      const text = (data.content?.[0]?.text || '').trim();
      // Strip any markdown fences
      const clean = text.replace(/```json|```/g, '').trim();
      // Find the JSON object
      const match = clean.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('No JSON found');
      setMockupResult(JSON.parse(match[0]));
    } catch(e) {
      setMockupResult({ error: true, msg: e.message });
    }
    setMockupLoading(false);
  };

  const SG = "'Space Grotesk', sans-serif";
  const SM = "'Space Mono', monospace";
  const DET = "'Determination', monospace";
  const BLUE = '#1b1aff';
  const DARK = '#000000';
  const BDR = '#0e0f28';

  return (
    <>
      <Head>
        <title>{font.name} — HypeForType</title>
        <meta name="description" content={font.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        {font.styles.map(s => (
          <style key={s.file}>{`@font-face{font-family:'${font.name}';src:url('/fonts/${font.slug}/${encodeURIComponent(s.file)}');font-weight:${s.weight};font-style:${s.oblique?'italic':'normal'};font-display:swap;}`}</style>
        ))}
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          html,body{background:#000000!important;color:#e8e8ff!important;font-family:'Space Grotesk', sans-serif!important;-webkit-font-smoothing:antialiased;}
          ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#000000}::-webkit-scrollbar-thumb{background:#0e0f28}
          a{text-decoration:none;color:inherit}button{cursor:pointer}
          select,option{background:#06060f;color:#e8e8ff;}

          /* NAV */
          .nav{
            position:sticky;top:0;z-index:200;
            display:grid;grid-template-columns:auto auto 1fr auto auto auto;
            height:44px;border-bottom:1px solid #0e0f28;
            background:rgba(10,11,26,0.95);backdrop-filter:blur(10px);
          }
          .nav-back{font-family:'Space Mono', monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#4a5488;padding:0 1rem;border-right:1px solid #0e0f28;display:flex;align-items:center;transition:color .15s;}
          .nav-back:hover{color:#e8e8ff;}
          .nav-prev{font-family:'Space Mono', monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#4a5488;padding:0 1rem;border-right:1px solid #0e0f28;display:flex;align-items:center;transition:color .15s;white-space:nowrap;}
          .nav-prev:hover{color:#e8e8ff;}
          .nav-space{flex:1;}
          .nav-next{font-family:'Space Mono', monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#4a5488;padding:0 1rem;border-left:1px solid #0e0f28;border-right:1px solid #0e0f28;display:flex;align-items:center;transition:color .15s;white-space:nowrap;}
          .nav-next:hover{color:#e8e8ff;}
          .nav-buy{font-family:'Space Mono', monospace;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#fff;background:#1b1aff;padding:0 1.4rem;display:flex;align-items:center;transition:all .2s;box-shadow:0 0 20px rgba(27,26,255,0.4);}
          .nav-buy:hover{opacity:.9;box-shadow:0 0 30px rgba(27,26,255,0.7);}

          /* LAYOUT */
          .page-wrap{display:grid;grid-template-columns:1fr 340px;min-height:calc(100vh - 44px);}

          /* LEFT */
          .left{border-right:1px solid #0e0f28;display:flex;flex-direction:column;}

          /* Stage */
          .stage-wrap{position:relative;flex:1;min-height:320px;display:flex;align-items:center;justify-content:center;overflow:hidden;cursor:text;}
          .stage-textarea{position:absolute;inset:0;width:100%;height:100%;background:transparent;border:none;outline:none;resize:none;color:transparent;caret-color:#1b1aff;font-size:16px;padding:2rem;z-index:2;cursor:text;}
          .stage-text{pointer-events:none;width:100%;word-break:break-word;transition:font-size .08s,letter-spacing .08s,line-height .08s;}
          .stage-hint{position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);font-family:'Space Mono', monospace;font-size:9px;color:#282c52;letter-spacing:.2em;text-transform:uppercase;pointer-events:none;white-space:nowrap;}

          /* Glyph focus */
          .glyph-focus{position:fixed;inset:0;background:rgba(10,11,26,.95);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:500;cursor:pointer;}
          .glyph-focus-label{font-family:'Space Mono', monospace;font-size:11px;color:#4a5488;letter-spacing:.1em;margin-top:1rem;}

          /* Meta strip */
          .meta-strip{display:flex;border-top:1px solid #0e0f28;border-bottom:1px solid #0e0f28;flex-shrink:0;}
          .meta-cell{flex:1;padding:.6rem 1rem;border-right:1px solid #0e0f28;display:flex;flex-direction:column;gap:2px;}
          .meta-cell:last-child{border-right:none;}
          .meta-val{font-family:'Determination', monospace;font-size:1.3rem;color:#e8e8ff;line-height:1;}
          .meta-key{font-family:'Space Mono', monospace;font-size:9px;color:#4a5488;letter-spacing:.12em;text-transform:uppercase;}
          .meta-lang{font-family:'Space Grotesk', sans-serif;font-size:13px;color:#e8e8ff;font-weight:500;}

          /* Long desc — muted, readable */
          .long-desc{padding:.8rem 1rem;border-bottom:1px solid #0e0f28;}
          .long-desc p{font-family:'Space Grotesk', sans-serif;font-size:12px;color:#4a5488;line-height:1.75;font-weight:400;}

          /* TYPE LAB */
          .typelab{padding:0;border-bottom:1px solid #0e0f28;}
          .typelab-head{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#e8e8ff;padding:10px 1rem 8px;border-bottom:1px solid #0e0f28;}
          .anim-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:8px;}
          .anim-btn{font-family:'Space Mono',monospace;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:8px 6px;border:1px solid #0e0f28;background:transparent;color:#4a5488;cursor:pointer;transition:all .2s;text-align:center;}
          .anim-btn:hover{border-color:#1b1aff;color:#e8e8ff;background:rgba(27,26,255,0.08);}
          .anim-btn.on{background:rgba(27,26,255,0.15);border-color:#1b1aff;color:#1b1aff;}
          .mockup-area{padding:8px;border-top:1px solid #0e0f28;}
          .mockup-input-row{display:flex;gap:4px;margin-bottom:8px;}
          .mockup-input{flex:1;background:#000;border:1px solid #0e0f28;color:#e8e8ff;font-family:'Space Grotesk',sans-serif;font-size:11px;padding:7px 10px;outline:none;transition:border-color .2s;}
          .mockup-input:focus{border-color:#1b1aff;}
          .mockup-input::placeholder{color:#282c52;}
          .mockup-gen-btn{font-family:'Space Mono',monospace;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:7px 12px;background:#1b1aff;color:#fff;border:none;cursor:pointer;transition:opacity .2s;white-space:nowrap;}
          .mockup-gen-btn:hover{opacity:.85;}
          .mockup-gen-btn:disabled{opacity:.4;cursor:not-allowed;}
          .mockup-canvas{position:relative;width:100%;height:160px;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;border:1px solid #0e0f28;}
          .mockup-watermark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:10;}
          .mockup-watermark span{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);transform:rotate(-20deg);white-space:nowrap;text-shadow:0 0 20px rgba(0,0,0,0.8);}
          .mockup-loading{font-family:'Space Mono',monospace;font-size:9px;color:#4a5488;letter-spacing:.1em;text-transform:uppercase;animation:pulse 1.2s ease-in-out infinite;}
          @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}

          /* Animations */
          @keyframes wave{0%,100%{transform:translateY(0)}25%{transform:translateY(-8px)}75%{transform:translateY(8px)}}
          @keyframes glitch{0%,100%{text-shadow:none;transform:none}20%{text-shadow:-2px 0 #f00,2px 0 #0ff;transform:skew(-1deg)}40%{text-shadow:2px 0 #f00,-2px 0 #0ff;transform:skew(1deg)}60%{text-shadow:-1px 0 #f00,1px 0 #0ff;transform:none}}
          @keyframes neon{0%,100%{text-shadow:0 0 10px #1b1aff,0 0 20px #1b1aff,0 0 40px #1b1aff}50%{text-shadow:0 0 5px #1b1aff,0 0 10px #1b1aff}}
          @keyframes gravity{0%{transform:translateY(-40px);opacity:0}60%{transform:translateY(4px)}80%{transform:translateY(-2px)}100%{transform:translateY(0);opacity:1}}
          @keyframes fadechar{from{opacity:0;filter:blur(4px)}to{opacity:1;filter:blur(0)}}
          .anim-wave .stage-display-inner{animation:wave 1.2s ease-in-out infinite;}
          .anim-glitch .stage-display-inner{animation:glitch 0.4s steps(1) infinite;}
          .anim-neon .stage-display-inner{animation:neon 1.5s ease-in-out infinite;}
          .anim-gravity .stage-display-inner{animation:gravity 0.6s cubic-bezier(.22,.61,.36,1) forwards;}
          .anim-fade .stage-display-inner span{display:inline-block;animation:fadechar .4s ease forwards;opacity:0;}

          /* Glyph section */
          .glyph-section{border-bottom:1px solid #0e0f28;}
          .glyph-tabs{display:flex;border-bottom:1px solid #0e0f28;}
          .g-tab{font-family:'Space Mono', monospace;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:8px 14px;background:transparent;color:#4a5488;border:none;border-right:1px solid #0e0f28;cursor:pointer;transition:all .15s;}
          .g-tab:hover{color:#e8e8ff;}
          .g-tab.on{color:#1b1aff;}
          .g-count{font-family:'Space Mono', monospace;font-size:9px;color:#282c52;padding:0 .8rem;margin-left:auto;display:flex;align-items:center;flex-shrink:0;}
          .g-grid{display:flex;flex-wrap:wrap;gap:0;padding:.5rem;}
          .g-cell{display:flex;flex-direction:column;align-items:center;justify-content:center;width:88px;height:88px;cursor:pointer;transition:background .12s;border:1px solid transparent;}
          .g-cell:hover{background:rgba(27,26,255,0.12);border-color:#1b1aff;}
          .g-char{font-size:2.2rem;color:#e8e8ff;line-height:1;}
          .g-code{font-family:'Space Mono', monospace;font-size:8px;color:#282c52;margin-top:3px;letter-spacing:.04em;}
          .g-hint{font-family:'Space Mono', monospace;font-size:9px;color:#282c52;padding:4px 1rem 8px;letter-spacing:.06em;}

          /* RIGHT PANEL */
          .panel{background:#06060f;display:flex;flex-direction:column;overflow-y:auto;position:sticky;top:44px;height:calc(100vh - 44px);}
          .panel-row{padding:10px 16px;border-bottom:1px solid #0e0f28;}
          .panel-label{font-family:'Space Mono', monospace;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#e8e8ff;margin-bottom:8px;}
          .panel-sublabel{font-family:'Space Grotesk', sans-serif;font-size:11px;color:#4a5488;margin-bottom:6px;}

          /* Sliders */
          .slider-row{display:flex;align-items:center;gap:.5rem;margin-bottom:6px;}
          .slider-name{font-family:'Space Grotesk', sans-serif;font-size:12px;color:#7888c0;flex-shrink:0;width:56px;}
          .slider{flex:1;height:2px;-webkit-appearance:none;appearance:none;background:rgba(27,26,255,0.28);outline:none;border-radius:1px;cursor:pointer;}
          .slider::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#1b1aff;cursor:pointer;}
          .slider-val{font-family:'Space Mono', monospace;font-size:10px;color:#7888c0;flex-shrink:0;width:36px;text-align:right;}

          /* Weight dropdown */
          .w-drop{width:100%;background:#000000;border:1px solid #1b1aff;color:#e8e8ff;font-family:'Space Mono', monospace;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:8px 10px;outline:none;cursor:pointer;-webkit-appearance:none;appearance:none;text-align:left;}

          /* Tools */
          .tools-icons{display:flex;gap:.5rem;flex-wrap:wrap;font-size:2rem;}

          /* License */
          .lic-drop-wrap{position:relative;margin-bottom:6px;}
          .lic-drop{width:100%;background:#000000;border:1px solid #1b1aff;color:#e8e8ff;font-family:'Space Mono', monospace;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:9px 12px;outline:none;cursor:pointer;-webkit-appearance:none;appearance:none;}
          .lic-arrow{position:absolute;right:10px;top:50%;transform:translateY(-50%);color:#4a5488;pointer-events:none;}
          .sub-drop-wrap{position:relative;margin-bottom:4px;}
          .sub-drop{width:100%;background:#000000;border:1px solid #1b1aff;color:#1b1aff;font-family:'Space Mono', monospace;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:8px 10px;outline:none;cursor:pointer;-webkit-appearance:none;appearance:none;}
          .lic-hint{font-family:'Space Mono', monospace;font-size:9px;color:#4a5488;letter-spacing:.06em;margin-top:4px;}

          /* Weight selection */
          .wm-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid #0e0f28;margin-bottom:8px;}
          .wm-btn{font-family:'Space Mono', monospace;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:8px;border:none;background:transparent;color:#4a5488;cursor:pointer;transition:all .15s;}
          .wm-btn.on{background:transparent;color:#1b1aff;border-bottom:2px solid #1b1aff;}
          .wp-list{display:flex;flex-direction:column;gap:0;max-height:180px;overflow-y:auto;}
          .wp-row{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border:1px solid #0e0f28;border-top:none;cursor:pointer;transition:all .15s;}
          .wp-row:first-child{border-top:1px solid #0e0f28;}
          .wp-row:hover{background:rgba(27,26,255,0.10);}
          .wp-row.on{background:rgba(27,26,255,0.12);box-shadow:inset 0 0 0 1px #1b1aff;}
          .wp-name{font-family:'Space Grotesk', sans-serif;font-size:12px;color:#7888c0;}
          .wp-row.on .wp-name{color:#e8e8ff;}
          .wp-chk{width:18px;height:18px;border:1px solid #282c52;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;}
          .wp-row.on .wp-chk{background:#1b1aff;border-color:#1b1aff;}

          /* Price */
          .price-ctx{font-family:'Space Mono', monospace;font-size:10px;color:#4a5488;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;}
          .price-big{font-family:'Determination', monospace;font-size:3rem;color:#e8e8ff;line-height:1;margin-bottom:10px;}

          /* Buttons */
          .trial-btn{width:100%;font-family:'Space Mono', monospace;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#7888c0;background:transparent;border:1px solid #1b1aff;padding:11px;cursor:pointer;transition:all .15s;text-align:center;display:block;margin-top:6px;}
          .trial-btn:hover{border-color:#1b1aff;color:#e8e8ff;background:rgba(27,26,255,0.1);box-shadow:0 0 12px rgba(27,26,255,0.3);}

          /* Trust */
          .trust-list{display:flex;flex-direction:column;gap:5px;padding:10px 16px;}
          .trust-item{display:flex;align-items:center;gap:8px;}
          .trust-dot{width:5px;height:5px;border-radius:50%;background:#1b1aff;flex-shrink:0;}
          .trust-txt{font-family:'Space Grotesk', sans-serif;font-size:11px;color:#4a5488;}

          /* All weights section */
          .weights-sec{border-top:1px solid #0e0f28;}
          .weights-hd{display:flex;align-items:center;gap:.5rem;padding:8px 1.2rem;border-bottom:1px solid #0e0f28;background:#06060f;}
          .weights-hd-txt{font-family:'Space Mono', monospace;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#e8e8ff;}
          .wr{display:grid;grid-template-columns:120px 1fr auto;align-items:center;padding:0 1.2rem;border-bottom:1px solid #0e0f28;min-height:72px;cursor:pointer;transition:background .12s;}
          .wr:hover{background:#06060f;}
          .wr.on{background:#06060f;}
          .wr-name{font-family:'Space Mono', monospace;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#4a5488;flex-shrink:0;}
          .wr-sample{font-size:clamp(2rem,3.5vw,3.4rem);line-height:1;color:#c0c8f0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 1rem;transition:color .12s;}
          .wr:hover .wr-sample,.wr.on .wr-sample{color:#e8e8ff;}
          .wr-add{font-family:'Space Mono', monospace;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#fff;background:#1b1aff;border:none;padding:8px 14px;cursor:pointer;transition:all .15s;white-space:nowrap;flex-shrink:0;}
          .wr-add:hover{opacity:.85;}
          .wr-add.added{background:#1a6b3a;}

          /* Ticker */
          .ticker-wrap{overflow:hidden;padding:8px 0;border-top:1px solid #0e0f28;}
          .ticker-track{display:flex;gap:1.5rem;animation:tickr 22s linear infinite;white-space:nowrap;}
          .ticker-char{font-size:1.6rem;color:rgba(27,26,255,0.22);letter-spacing:.05em;}
          @keyframes tickr{from{transform:translateX(0)}to{transform:translateX(-50%)}}

          /* Specimens */
          .spec-sec{padding:1.5rem;border-top:1px solid #0e0f28;}
          .spec-main{margin-bottom:.6rem;overflow:hidden;border:1px solid #0e0f28;}
          .spec-main img{width:100%;display:block;}
          .spec-thumbs{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;}
          .spec-thumb{cursor:pointer;border:2px solid transparent;overflow:hidden;transition:border-color .15s;}
          .spec-thumb.on{border-color:#1b1aff;}
          .spec-thumb img{width:100%;display:block;aspect-ratio:4/3;object-fit:cover;filter:brightness(.7);transition:all .2s;}
          .spec-thumb:hover img,.spec-thumb.on img{filter:brightness(1);}

          /* Toast */
          .toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(20px);background:#1a6b3a;color:#fff;font-family:'Space Grotesk', sans-serif;font-size:12px;font-weight:600;padding:10px 24px;opacity:0;transition:all .3s;z-index:999;pointer-events:none;white-space:nowrap;}
          .toast.show{opacity:1;transform:translateX(-50%) translateY(0);}

          /* Footer */
          .fp-ft{display:flex;justify-content:space-between;align-items:center;padding:.8rem 1.2rem;border-top:1px solid #0e0f28;background:#06060f;}
          .fp-ft-hft{font-family:'Space Mono', monospace;font-size:11px;font-weight:700;color:#4a5488;letter-spacing:.1em;}
          .fp-ft-copy{font-family:'Space Mono', monospace;font-size:10px;color:#282c52;letter-spacing:.06em;text-transform:uppercase;}
          .fp-ft-links{display:flex;gap:1.5rem;}
          .fp-ft a{font-family:'Space Mono', monospace;font-size:10px;color:#4a5488;letter-spacing:.1em;text-transform:uppercase;transition:color .15s;}
          .fp-ft a:hover{color:#e8e8ff;}
        `}</style>
      </Head>

      <Script src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=GBP`} onReady={() => setPaypalReady(true)} />

      {/* NAV */}
      <nav className="nav">
        <Link href="/" className="nav-back">← ALL</Link>
        <Link href={`/typefaces/${prevFont.slug}`} className="nav-prev">← {prevFont.name.toUpperCase()}</Link>
        <div className="nav-space" />
        <Link href={`/typefaces/${nextFont.slug}`} className="nav-next">{nextFont.name.toUpperCase()} →</Link>
        <a href="#buy" className="nav-buy">BUY →</a>
      </nav>

      {/* GLYPH FULLSCREEN */}
      {focusedGlyph && (
        <div className="glyph-focus" onClick={() => setFocusedGlyph(null)}>
          <div style={{ fontFamily:ff, fontWeight:style.weight, fontSize:'clamp(8rem,18vw,16rem)', lineHeight:1, color:'#e8e8ff' }}>
            {focusedGlyph}
          </div>
          <div className="glyph-focus-label">U+{focusedGlyph.charCodeAt(0).toString(16).toUpperCase().padStart(4,'0')} · Click to close</div>
        </div>
      )}

      {/* MAIN */}
      <div className="page-wrap">

        {/* LEFT */}
        <div className="left">

          {/* Live stage */}
          <div className={`stage-wrap${animation ? ' anim-'+animation : ''}`}
            ref={stageRef}
            onClick={e => { if (!mockupResult?.headline) { e.currentTarget.querySelector('textarea')?.focus(); setAnimation(null); } }}>
            <textarea
              className="stage-textarea"
              value={previewText}
              onChange={e => { setPreviewText(e.target.value); setAnimation(null); }}
              maxLength={80} spellCheck={false} autoCorrect="off" autoComplete="off"
              style={{ display: mockupResult?.headline ? 'none' : undefined }}
            />

            {/* MOCKUP TAKEOVER — fills entire stage */}
            {mockupResult?.headline && (
              <div style={{
                position:'absolute', inset:0, zIndex:10,
                background: mockupResult.bg || '#050510',
                display:'flex', flexDirection:'column',
                alignItems:'center', justifyContent:'center',
                padding:'2.5rem',
              }}>
                {/* Dismiss X */}
                <button onClick={() => setMockupResult(null)} style={{
                  position:'absolute', top:12, right:14,
                  fontFamily:"'Space Mono',monospace", fontSize:11,
                  color:'rgba(255,255,255,0.4)', background:'transparent',
                  border:'1px solid rgba(255,255,255,0.1)', padding:'4px 10px',
                  cursor:'pointer', letterSpacing:'.1em', transition:'all .15s',
                  zIndex:20,
                }}
                  onMouseEnter={e => { e.target.style.color='#fff'; e.target.style.borderColor='rgba(255,255,255,0.4)'; }}
                  onMouseLeave={e => { e.target.style.color='rgba(255,255,255,0.4)'; e.target.style.borderColor='rgba(255,255,255,0.1)'; }}>
                  ✕ CLOSE
                </button>

                {/* Context label */}
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:'rgba(255,255,255,0.3)', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:'1.5rem' }}>
                  {mockupResult.label || 'MOCKUP'} — {font.name}
                </div>

                {/* Main headline in the actual font */}
                <div style={{
                  fontFamily: ff,
                  fontWeight: style.weight,
                  fontSize: 'clamp(3rem,8vw,7rem)',
                  color: mockupResult.accent || '#fff',
                  letterSpacing:'-.02em',
                  lineHeight: .9,
                  textAlign:'center',
                  marginBottom:'1rem',
                }}>
                  {mockupResult.headline}
                </div>

                {/* Subline */}
                <div style={{
                  fontFamily: ff,
                  fontWeight: 300,
                  fontSize: 'clamp(.7rem,1.5vw,1.1rem)',
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing:'.14em',
                  textTransform:'uppercase',
                  textAlign:'center',
                }}>
                  {mockupResult.subline}
                </div>

                {/* Watermark — diagonal, prominent, uncopyable */}
                <div style={{
                  position:'absolute', inset:0,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  pointerEvents:'none', zIndex:15, overflow:'hidden',
                }}>
                  <div style={{
                    fontFamily:"'Space Mono',monospace",
                    fontSize:'clamp(.8rem,2vw,1.2rem)',
                    color:'rgba(255,255,255,0.18)',
                    letterSpacing:'.15em',
                    textTransform:'uppercase',
                    transform:'rotate(-25deg)',
                    whiteSpace:'nowrap',
                    textShadow:'0 0 30px rgba(0,0,0,0.8)',
                    userSelect:'none',
                  }}>
                    UNLICENSED PREVIEW · HYPERFLURO · UNLICENSED PREVIEW · HYPERFLURO
                  </div>
                </div>

                {/* Bottom CTA */}
                <div style={{ position:'absolute', bottom:14, left:0, right:0, textAlign:'center' }}>
                  <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:'rgba(255,255,255,0.25)', letterSpacing:'.12em', textTransform:'uppercase' }}>
                    License {font.name} to use this design commercially
                  </span>
                </div>
              </div>
            )}
            <div className="stage-text" style={{ position:'relative', zIndex:1, width:'100%', padding:'2rem' }}>
              <div className="stage-display-inner" style={{
                fontFamily: ff,
                fontWeight: style.weight,
                fontStyle: style.oblique ? 'italic' : 'normal',
                fontSize: fontSize + 'px',
                letterSpacing: letterSpacing + '%',
                lineHeight: lineHeight,
                color: animation === 'neon' ? '#fff' : '#e8e8ff',
                wordBreak: 'break-word',
              }}>
                {animation === 'fade'
                  ? (previewText || fontPhrase).split('').map((ch,i) => (
                      <span key={i} style={{ animationDelay: i*0.06+'s' }}>{ch}</span>
                    ))
                  : (previewText || fontPhrase)
                }
              </div>
            </div>
            {!previewText && !animation && <div className="stage-hint">CLICK ANYWHERE TO TYPE...</div>}
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

          {/* Long description — readable grey */}
          <div className="long-desc">
            <p>{font.longDescription || font.description}</p>
          </div>

          {/* Glyph grid */}
          <div className="glyph-section">
            <div className="glyph-tabs">
              {Object.keys(GLYPH_SETS).map(k => (
                <button key={k} className={`g-tab${glyphSet===k?' on':''}`} onClick={() => setGlyphSet(k)}>
                  {k.charAt(0)+k.slice(1).toLowerCase()}
                </button>
              ))}
              <span className="g-count">{allGlyphs.length} shown · {font.glyphCount}+ total</span>
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

        </div>

        {/* RIGHT PANEL */}
        <div className="panel">

          {/* Font weight */}
          <div className="panel-row">
            <div className="panel-label">Font Weight</div>
            <select className="w-drop" value={activeStyle} onChange={e => setActiveStyle(+e.target.value)}>
              {font.styles.map((s,i) => (
                <option key={i} value={i}>{font.name.toUpperCase()} {s.name.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Sliders */}
          <div className="panel-row">
            <div className="slider-row">
              <span className="slider-name">Size</span>
              <input type="range" className="slider" min="12" max="200" value={fontSize} onChange={e => setFontSize(+e.target.value)} />
              <span className="slider-val">{fontSize}px</span>
            </div>
            <div className="slider-row">
              <span className="slider-name">Spacing</span>
              <input type="range" className="slider" min="-10" max="30" value={letterSpacing} onChange={e => setLetterSpacing(+e.target.value)} />
              <span className="slider-val">{letterSpacing > 0 ? '+' : ''}{letterSpacing.toFixed(2)}</span>
            </div>
            <div className="slider-row">
              <span className="slider-name">Height</span>
              <input type="range" className="slider" min="5" max="25" value={Math.round(lineHeight*10)} onChange={e => setLineHeight(+e.target.value/10)} />
              <span className="slider-val">{lineHeight.toFixed(2)}</span>
            </div>
          </div>

          {/* TYPE LAB */}
          <div className="typelab">
            <div className="typelab-head">Type Lab</div>

            {/* Animation triggers */}
            <div className="anim-grid">
              {[
                { key:'wave',    label:'Wave',    desc:'Flowing motion' },
                { key:'glitch',  label:'Glitch',  desc:'Cyberpunk static' },
                { key:'neon',    label:'Neon',    desc:'Glow pulse' },
                { key:'gravity', label:'Gravity', desc:'Drop in' },
                { key:'fade',    label:'Fade In', desc:'Letter reveal' },
              ].map(a => (
                <button key={a.key}
                  className={`anim-btn${animation===a.key?' on':''}`}
                  onClick={() => {
                    setAnimation(animation===a.key ? null : a.key);
                  }}
                  title={a.desc}>
                  {a.label}
                </button>
              ))}
            </div>

            {/* AI Mockup Generator */}
            <div className="mockup-area">
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color:'#4a5488', marginBottom:6 }}>
                AI Mockup — Powered by Claude
              </div>
              <div className="mockup-input-row">
                <input
                  className="mockup-input"
                  value={mockupPrompt}
                  onChange={e => setMockupPrompt(e.target.value)}
                  onKeyDown={e => e.key==='Enter' && generateMockup()}
                  placeholder="e.g. luxury perfume brand..."
                  maxLength={60}
                />
                <button className="mockup-gen-btn" onClick={generateMockup} disabled={mockupLoading || !mockupPrompt.trim()}>
                  {mockupLoading ? '...' : 'GEN'}
                </button>
              </div>

              {!mockupResult && !mockupLoading && (
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:'#282c52', lineHeight:1.6 }}>
                  Describe a context → Claude generates a live mockup with {font.name} applied. Purchase to use without watermark.
                </div>
              )}
              {mockupLoading && (
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:'#4a5488', letterSpacing:'.1em', textTransform:'uppercase', padding:'6px 0' }}>
                  <span className="mockup-loading">Generating...</span>
                </div>
              )}
              {mockupResult?.error && (
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:'#f55', padding:'4px 0' }}>
                  Failed — try again
                </div>
              )}
            </div>
          </div>

          {/* License type */}
          <div className="panel-row" id="buy">
            <div className="panel-label">License Type</div>
            <div className="lic-drop-wrap">
              <select className="lic-drop" value={licenseType} onChange={e => setLicenseType(e.target.value)}>
                {LICENSE_TYPES.map(l => <option key={l.key} value={l.key}>{l.label.toUpperCase()}</option>)}
              </select>
              <span className="lic-arrow">▾</span>
            </div>

            {licenseType === 'desktop' && (
              <>
                <div className="panel-sublabel">Number of seats <span style={{ color:'#1b1aff' }}>(installations)</span></div>
                <div className="sub-drop-wrap">
                  <select className="sub-drop" value={desktopSeats} onChange={e => setDesktopSeats(+e.target.value)}>
                    {SEAT_OPTIONS.map(s => <option key={s} value={s}>{s} SEAT{s>1?'S':''}</option>)}
                  </select>
                  <span className="lic-arrow" style={{ color:'#4a5488' }}>▾</span>
                </div>
                <div className="lic-hint">installation on {desktopSeats} computer{desktopSeats>1?'s':''}</div>
              </>
            )}
            {licenseType === 'webfont' && (
              <>
                <div className="panel-sublabel">Monthly pageviews</div>
                <div className="sub-drop-wrap">
                  <select className="sub-drop" value={webPageviews} onChange={e => setWebPageviews(e.target.value)}>
                    {PAGEVIEW_OPTIONS.map(p => <option key={p} value={p}>{p.toUpperCase()} PV/MO</option>)}
                  </select>
                  <span className="lic-arrow" style={{ color:'#4a5488' }}>▾</span>
                </div>
              </>
            )}
            {!['desktop','webfont'].includes(licenseType) && (
              <div className="lic-hint">{licDesc}</div>
            )}
          </div>

          {/* Weight selection */}
          <div className="panel-row">
            <div className="panel-label">Weight Selection</div>
            <div className="wm-grid">
              <button className={`wm-btn${weightMode==='single'?' on':''}`} onClick={() => setWeightMode('single')}>Individual</button>
              <button className={`wm-btn${weightMode==='full'?' on':''}`} onClick={() => setWeightMode('full')}>Full Family</button>
            </div>
            {weightMode === 'single' ? (
              <div className="wp-list">
                {font.styles.map((s,i) => (
                  <div key={i} className={`wp-row${selectedWeights.has(i)?' on':''}`} onClick={() => toggleWeight(i)}>
                    <span className="wp-name">{font.name} {s.name}</span>
                    <div className="wp-chk">
                      {selectedWeights.has(i) && <span style={{ color:'#fff', fontSize:11 }}>✓</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontFamily:SG, fontSize:11, color:'#7888c0', paddingTop:4 }}>
                All {font.styles.length} weights — best value
              </div>
            )}
          </div>

          {/* Price + PayPal */}
          <div className="panel-row">
            <div className="price-ctx">{weightCount} WEIGHT{weightCount>1?'S':''} · {licenseType.toUpperCase()}</div>
            <div className="price-big">£{estPrice}</div>
            <div ref={paypalRef} style={{ minHeight:44 }}>
              {purchasing && <span style={{ fontFamily:SG, fontSize:12, color:'#7888c0' }}>Processing...</span>}
            </div>
            <button className="trial-btn" onClick={() => window.location.href=`/api/trial?slug=${font.slug}`}>
              Free Trial Download
            </button>
          </div>

          {/* Trust */}
          <div className="trust-list">
            {[`${font.styles.length} font files`,`${font.glyphCount}+ glyphs`,'Instant download','Perpetual license','PayPal Secure'].map((item,i) => (
              <div key={i} className="trust-item">
                <div className="trust-dot" />
                <span className="trust-txt">{item}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('').map((ch,i) => (
            <span key={i} className="ticker-char" style={{ fontFamily:ff, fontWeight:style.weight }}>{ch}</span>
          ))}
        </div>
      </div>

      {/* SPECIMENS */}
      {specimens.length > 0 && (
        <div className="spec-sec">
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
        <div className="weights-hd">
          <span className="weights-hd-txt">All Weights</span>
        </div>
        {font.styles.map((s,i) => (
          <div key={i} className={`wr${activeStyle===i?' on':''}`} onClick={() => setActiveStyle(i)}>
            <span className="wr-name">{s.name.toUpperCase()}</span>
            <span className="wr-sample" style={{ fontFamily:ff, fontWeight:s.weight, fontStyle:s.oblique?'italic':'normal' }}>
              {previewText || ZEN_SENTENCE}
            </span>
            <button className={`wr-add${addedIdx===i?' added':''}`} onClick={e => addToCart(i, e)}>
              {addedIdx===i ? '✓ ADDED' : 'ADD +'}
            </button>
          </div>
        ))}
      </div>

      {/* TOAST */}
      <div className={`toast${showToast?' show':''}`}>{toastMsg}</div>

      {/* FOOTER */}
      <footer className="fp-ft">
        <span className="fp-ft-hft">HF</span>
        <span className="fp-ft-copy">Copyright 2026 © HypeFluro</span>
        <div className="fp-ft-links">
          <Link href="/licensing">Licensing</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact</Link>
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
