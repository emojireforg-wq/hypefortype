import Head from 'next/head';
import Link from 'next/link';
import { fonts, pricing } from '../../lib/fonts';
import { useState, useRef, useEffect } from 'react';
import Script from 'next/script';

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

const SPECIMENS = {
  'nanami-pro': [1,2,3,4,5,6].map(i => `/specimens/nanami-rounded-pro-${i}.jpg`),
  'babalove': [1,2,3,4,5,6].map(i => `/specimens/babalove/babalove${i}.jpg`),
  'nanami': ['001','002','003','004','005','006','007','008','009','010','011','012','013','014','015'].map(i => `/specimens/nanami/nanami-${i}.png`),
  'monolite': [1,2,3].map(i => `/specimens/monolite/monolite-00${i}.png`),
  'monino-pro': [1,2,3,4,5,6,7,8,9].map(i => `/specimens/monino-pro/${i}.png`),
  'miyagi': ['/specimens/miyagi/miyagi-o.png'],
  'lippy': ['/specimens/lippy/lippy.png','/specimens/lippy/lippy-002.png','/specimens/lippy/lippy-003.png','/specimens/lippy/lippy-004.png','/specimens/lippy/lippy-005.png','/specimens/lippy/lippy-006.png','/specimens/lippy/lippy-007.png'],
  'hiroko': [1,2,3,4,5].map(i => `/specimens/hiroko/hiroko-00${i}.png`),
  'hiruko': ['001','002','004','005','006','007'].map(i => `/specimens/hiruko/hiruko_specimen_${i}.png`),
  'nanami-handmade': [1,2,3,4,5].map(i => `/specimens/nanami-handmade/nanami-handmade-${i}.png`),
  'headlined': ['001','002','003','004','005'].map(i => `/specimens/headlined/headlined-${i}.jpg`),
  'electro': ['001','002','003','004','005','006','007','008'].map(i => `/specimens/electro/electro-${i}.jpg`),
  'ebisu': ['001','002','003','004','005','006','007','008','009','010','011'].map(i => `/specimens/ebisu/ebisu-${i}.jpg`),
  'crop': ['001','002','003','004','005'].map(i => `/specimens/crop/crop-${i}.jpg`),
  'bomkin': [1,2,3,4,6,7].map(i => `/specimens/bomkin/bomkin-${i}.jpg`),
  'baq-rounded': [
    '/specimens/baq-rounded/baq-rounded-frame-1-o.jpg',
    '/specimens/baq-rounded/baq-rounded-frame-1-_2_-o.jpg',
    '/specimens/baq-rounded/baq-rounded-frame-1-_3_-o.jpg',
    '/specimens/baq-rounded/baq-rounded-frame-1-_4_-o.jpg',
    '/specimens/baq-rounded/baq-rounded-frame-1-_5_-o.jpg',
    '/specimens/baq-rounded/baq-rounded-frame-1-_6_-o.jpg',
    '/specimens/baq-rounded/baq-rounded-frame-1-_7_-o.jpg',
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
  { key:'desktop',   label:'Desktop',         desc:'For installation on computers.' },
  { key:'webfont',   label:'Webfont',          desc:'For use on websites.' },
  { key:'app',       label:'App',              desc:'For embedding in a mobile or desktop app.' },
  { key:'broadcast', label:'Broadcast',        desc:'For TV, film and streaming.' },
  { key:'brand',     label:'Brand Font',       desc:'As a primary brand typeface across all media.' },
  { key:'enterprise',label:'Enterprise',       desc:'Unlimited use within one organisation.' },
  { key:'group',     label:'Group Enterprise', desc:'Unlimited use across multiple organisations.' },
];

const SEAT_OPTIONS     = [1,2,5,10,25,50,100];
const PAGEVIEW_OPTIONS = ['10,000','50,000','100,000','250,000','500,000','1,000,000','Unlimited'];
const ZEN_SENTENCE     = 'Zen samurai packs quartz koi jade silk.';

const FONT_PHRASES = {
  'babalove':          'Beauty is power own it.',
  'baq-rounded':       'Bold. Blob. Beautiful.',
  'bomkin':            'Sunday Monday Happy Days',
  'crop':              'MANY MEN WISH DEATH UPON ME',
  'do-it-again':       'LAS VEGAS CASINO NIGHTS',
  'ebisu':             'Tokyo nights.',
  'electro':           'NEON TOKYO 2049',
  'headlined':         'LOSS AFTER LOSS MADE A BOSS',
  'headlined-solid':   'Own the page.',
  'hiroko':            'Concrete walls. Clean lines. Raw power.',
  'hiruko':            'Two cultures. One typeface.',
  'kono':              'This is now.',
  'letro':             'Letters that move.',
  'lippy':             'Bold lips. Bolder type.',
  'miyagi':            'Rewind. Replay. Repeat.',
  'monino-pro':        'Clean. Sharp. Precise.',
  'monolite':          'Form follows function.',
  'nanami':            'Designed in the space between.',
  'nanami-handmade':   'Made by hand. Built to last.',
  'nanami-pro':         'Precision without limits.',
  'nanami-3d':         'Depth of field.',
  'nanami-extended':   'Reach further.',
  'carolinia':         'Refined by nature.',
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
  'yoko':              'Flow with grace.',
  'york-handwriting':  'Written with care.',
  'yuki':              'Light as snow.',
  'yuko':              'Gentle strength.',
  'yume':              'Dream forward.',
  'yumo':              'Flow state.',
};

const DEFAULT_STYLES = {
  'crop': 4,
};

const FONT_SIZES = {
  'babalove': 160,
  'crop': 100,
  'do-it-again': 120,
  'electro': 130,
  'headlined': 120,
  'headlined': 140,
  'headlined-solid': 140,
  'crop': 130,
  'electro': 130,
  'headlined': 120,
};

export default function FontPage({ font }) {
  const [activeStyle,     setActiveStyle]     = useState(DEFAULT_STYLES[font.slug] || 0);
  const [previewText,     setPreviewText]      = useState('');
  const [fontSize,        setFontSize]         = useState(FONT_SIZES[font.slug] || 120);
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
  const [animation,       setAnimation]        = useState(null);
  const [mockupPrompt,    setMockupPrompt]     = useState('');
  const [mockupResult,    setMockupResult]     = useState(null);
  const [mockupLoading,   setMockupLoading]    = useState(false);
  const [allFontGlyphs,   setAllFontGlyphs]    = useState(null);
  const [glyphsLoading,   setGlyphsLoading]    = useState(false);
  const [paypalReady,     setPaypalReady]      = useState(false);
  const [purchasing,      setPurchasing]       = useState(false);
  const paypalRef = useRef(null);

  const tiers      = pricing[font.isFamily ? 'family' : 'single'];
  const style      = font.styles[activeStyle];
  const ff         = "'" + font.name + "', monospace";
  const specimens  = SPECIMENS[font.slug] || [];
  const fi         = fonts.findIndex(f => f.slug === font.slug);
  const prevFont   = fonts[(fi - 1 + fonts.length) % fonts.length];
  const nextFont   = fonts[(fi + 1) % fonts.length];
  const allGlyphs  = GLYPH_SETS[glyphSet];
  const fontPhrase = FONT_PHRASES[font.slug] || font.name;
  const weightCount = weightMode === 'full' ? font.styles.length : selectedWeights.size;
  const basePrice  = tiers && tiers.desktop ? tiers.desktop.price : 45;
  const estPrice   = weightMode === 'full' ? Math.round(basePrice * 1.8) : basePrice * weightCount;
  const licDef     = LICENSE_TYPES.find(l => l.key === licenseType);

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
    e && e.stopPropagation();
    const s = font.styles[styleIdx];
    const item = { slug: font.slug, name: font.name, style: s.name, weight: s.weight, license: licenseType };
    try {
      const existing = JSON.parse(localStorage.getItem('hft_cart') || '[]');
      localStorage.setItem('hft_cart', JSON.stringify([...existing, item]));
    } catch(_) {}
    setAddedIdx(styleIdx);
    setToastMsg(font.name + ' ' + s.name + ' added to cart');
    setShowToast(true);
    setTimeout(() => { setShowToast(false); setAddedIdx(null); }, 2500);
  };

  const fetchAllGlyphs = async () => {
    if (allFontGlyphs) return; // already loaded
    setGlyphsLoading(true);
    try {
      const s = font.styles[activeStyle];
      const res = await fetch('/api/font-glyphs?slug=' + font.slug + '&file=' + encodeURIComponent(s.file));
      const data = await res.json();
      if (data.glyphs) setAllFontGlyphs(data.glyphs);
    } catch(e) {}
    setGlyphsLoading(false);
  };

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
            content: 'Creative director. Brief: "' + mockupPrompt + '". Font: "' + font.name + '". Return ONLY raw JSON, no markdown: {"headline":"max 3 words","subline":"max 6 words","bg":"dark hex","accent":"light hex","label":"context type"}'
          }]
        })
      });
      const data = await res.json();
      const text = (data.content && data.content[0] ? data.content[0].text : '').trim();
      const clean = text.replace(/```json|```/g, '').trim();
      const match = clean.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('No JSON');
      setMockupResult(JSON.parse(match[0]));
    } catch(e) {
      setMockupResult({ error: true });
    }
    setMockupLoading(false);
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

  const BLUE = '#1b1aff';
  const DARK = '#000000';
  const SURF = '#06060f';
  const BDR  = '#0e0f28';
  const T1   = '#e8e8ff';
  const T2   = '#7888c0';
  const T3   = '#4a5488';
  const T4   = '#282c52';

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
          html,body{background:#000!important;color:#e8e8ff!important;font-family:'Space Grotesk',sans-serif!important;-webkit-font-smoothing:antialiased;}
          ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#000}::-webkit-scrollbar-thumb{background:#0e0f28}
          a{text-decoration:none;color:inherit}button{cursor:pointer}
          select,option{background:#06060f;color:#e8e8ff;}

          .nav{position:sticky;top:0;z-index:200;display:grid;grid-template-columns:auto auto 1fr auto auto auto;height:44px;border-bottom:1px solid #0e0f28;background:rgba(0,0,0,0.95);backdrop-filter:blur(10px);}
          .nav-back{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#4a5488;padding:0 1rem;border-right:1px solid #0e0f28;display:flex;align-items:center;transition:color .15s;}
          .nav-back:hover{color:#e8e8ff;}
          .nav-prev{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#4a5488;padding:0 1rem;border-right:1px solid #0e0f28;display:flex;align-items:center;transition:color .15s;white-space:nowrap;max-width:180px;overflow:hidden;text-overflow:ellipsis;}
          .nav-prev:hover{color:#e8e8ff;}
          .nav-space{flex:1;}
          .nav-next{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#4a5488;padding:0 1rem;border-left:1px solid #0e0f28;border-right:1px solid #0e0f28;display:flex;align-items:center;transition:color .15s;white-space:nowrap;max-width:180px;overflow:hidden;text-overflow:ellipsis;}
          .nav-next:hover{color:#e8e8ff;}
          .nav-buy{font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#fff;background:#1b1aff;padding:0 1.4rem;display:flex;align-items:center;transition:opacity .15s;box-shadow:0 0 20px rgba(27,26,255,0.4);}
          .nav-buy:hover{opacity:.85;}

          .page-wrap{display:grid;grid-template-columns:1fr 320px;min-height:calc(100vh - 44px);}

          .left{border-right:1px solid #0e0f28;display:flex;flex-direction:column;}

          .stage-wrap{position:relative;min-height:400px;height:auto;display:flex;align-items:flex-start;justify-content:flex-start;overflow:visible;background:#000;}
          .stage-ce{position:absolute;top:0;left:0;right:0;min-height:100%;z-index:3;padding:2rem;outline:none;cursor:text;color:transparent;-webkit-text-fill-color:transparent;caret-color:#1b1aff;word-break:break-word;white-space:pre-wrap;}
          .stage-display{position:relative;display:flex;align-items:flex-start;padding:2rem;pointer-events:none;z-index:2;width:100%;}
          .stage-inner{width:100%;word-break:break-word;}
          .stage-hint{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);font-family:'Space Mono',monospace;font-size:9px;color:#282c52;letter-spacing:.2em;text-transform:uppercase;pointer-events:none;white-space:nowrap;z-index:4;display:block;}

          .glyph-focus{position:fixed;inset:0;background:rgba(0,0,0,.95);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:500;cursor:pointer;}
          .glyph-focus-lbl{font-family:'Space Mono',monospace;font-size:11px;color:#4a5488;letter-spacing:.1em;margin-top:1rem;}

          .meta-strip{display:flex;border-top:1px solid #0e0f28;flex-shrink:0;}
          .meta-cell{flex:1;padding:.6rem .9rem;border-right:1px solid #0e0f28;display:flex;flex-direction:column;gap:2px;}
          .meta-cell:last-child{border-right:none;}
          .meta-val{font-family:'Determination',monospace;font-size:1.2rem;color:#e8e8ff;line-height:1;}
          .meta-key{font-family:'Space Mono',monospace;font-size:9px;color:#282c52;letter-spacing:.12em;text-transform:uppercase;}
          .meta-lang{font-family:'Space Grotesk',sans-serif;font-size:13px;color:#e8e8ff;font-weight:500;}

          .long-desc{padding:.8rem 1rem;border-bottom:1px solid #0e0f28;}
          .long-desc p{font-family:'Space Grotesk',sans-serif;font-size:12px;color:#4a5488;line-height:1.7;}

          .glyph-section{border-bottom:1px solid #0e0f28;}
          .glyph-tabs{display:flex;border-bottom:1px solid #0e0f28;}
          .g-tab{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:8px 14px;background:transparent;color:#4a5488;border:none;border-right:1px solid #0e0f28;cursor:pointer;transition:all .15s;}
          .g-tab:hover{color:#e8e8ff;}
          .g-tab.on{color:#1b1aff;}
          .g-count{font-family:'Space Mono',monospace;font-size:9px;color:#282c52;padding:0 .8rem;margin-left:auto;display:flex;align-items:center;flex-shrink:0;}
          .g-grid{display:flex;flex-wrap:wrap;gap:0;padding:.5rem;}
          .g-cell{display:flex;flex-direction:column;align-items:center;justify-content:center;width:88px;height:88px;cursor:pointer;transition:background .12s;border:1px solid transparent;}
          .g-cell:hover{background:rgba(27,26,255,0.12);border-color:#1b1aff;}
          .g-char{font-size:2.2rem;color:#e8e8ff;line-height:1;}
          .g-code{font-family:'Space Mono',monospace;font-size:8px;color:#282c52;margin-top:3px;letter-spacing:.04em;}
          .g-hint{font-family:'Space Mono',monospace;font-size:9px;color:#282c52;padding:4px 1rem 8px;letter-spacing:.06em;}

          .panel{background:#06060f;display:flex;flex-direction:column;overflow-y:auto;position:sticky;top:44px;height:calc(100vh - 44px);}
          .panel-row{padding:10px 16px;border-bottom:1px solid #0e0f28;}
          .panel-lbl{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#e8e8ff;margin-bottom:8px;}
          .panel-sublbl{font-family:'Space Grotesk',sans-serif;font-size:11px;color:#4a5488;margin-bottom:6px;}
          .slider-row{display:flex;align-items:center;gap:.5rem;margin-bottom:6px;}
          .slider-nm{font-family:'Space Grotesk',sans-serif;font-size:12px;color:#7888c0;flex-shrink:0;width:56px;}
          .slider{flex:1;height:2px;-webkit-appearance:none;appearance:none;background:rgba(27,26,255,0.25);outline:none;border-radius:1px;cursor:pointer;}
          .slider::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#1b1aff;cursor:pointer;}
          .slider-val{font-family:'Space Mono',monospace;font-size:10px;color:#7888c0;flex-shrink:0;width:40px;text-align:right;}
          .w-drop-wrap{position:relative;}.w-drop{width:100%;background:#000;border:1px solid #1b1aff;color:#e8e8ff;font-family:'Space Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:8px 36px 8px 10px;outline:none;cursor:pointer;-webkit-appearance:none;appearance:none;}.w-drop-arrow{position:absolute;right:10px;top:50%;transform:translateY(-50%);color:#1b1aff;pointer-events:none;font-size:10px;}

          .typelab-head{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#e8e8ff;margin-bottom:8px;}
          .anim-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:10px;}
          .anim-btn{font-family:'Space Mono',monospace;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:8px 6px;border:1px solid #0e0f28;background:transparent;color:#4a5488;cursor:pointer;transition:all .2s;text-align:center;}
          .anim-btn:hover{border-color:#1b1aff;color:#e8e8ff;}
          .anim-btn.on{background:rgba(27,26,255,0.15);border-color:#1b1aff;color:#1b1aff;}
          .mockup-lbl{font-family:'Space Mono',monospace;font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#4a5488;margin-bottom:6px;}
          .mockup-row{display:flex;gap:4px;margin-bottom:6px;}
          .mockup-inp{flex:1;background:#000;border:1px solid #0e0f28;color:#e8e8ff;font-family:'Space Grotesk',sans-serif;font-size:11px;padding:7px 10px;outline:none;transition:border-color .2s;}
          .mockup-inp:focus{border-color:#1b1aff;}
          .mockup-inp::placeholder{color:#282c52;}
          .mockup-btn{font-family:'Space Mono',monospace;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:7px 12px;background:#1b1aff;color:#fff;border:none;cursor:pointer;transition:opacity .2s;white-space:nowrap;}
          .mockup-btn:hover{opacity:.85;}
          .mockup-btn:disabled{opacity:.4;cursor:not-allowed;}
          .mockup-hint{font-family:'Space Mono',monospace;font-size:9px;color:#282c52;line-height:1.6;}
          .mockup-loading{font-family:'Space Mono',monospace;font-size:9px;color:#4a5488;letter-spacing:.1em;text-transform:uppercase;animation:blink 1.2s ease-in-out infinite;}
          @keyframes blink{0%,100%{opacity:.4}50%{opacity:1}}

          .lic-wrap{position:relative;margin-bottom:6px;}
          .lic-drop{width:100%;background:#000;border:1px solid #1b1aff;color:#e8e8ff;font-family:'Space Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:9px 12px;outline:none;cursor:pointer;-webkit-appearance:none;appearance:none;}
          .lic-arrow{position:absolute;right:10px;top:50%;transform:translateY(-50%);color:#1b1aff;pointer-events:none;font-size:10px;}
          .sub-wrap{position:relative;margin-bottom:4px;}
          .sub-drop{width:100%;background:#000;border:1px solid #1b1aff;color:#1b1aff;font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:8px 10px;outline:none;cursor:pointer;-webkit-appearance:none;appearance:none;}
          .lic-hint{font-family:'Space Mono',monospace;font-size:9px;color:#4a5488;letter-spacing:.06em;margin-top:4px;}

          .wm-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid #0e0f28;margin-bottom:8px;}
          .wm-btn{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:8px;border:none;background:transparent;color:#4a5488;cursor:pointer;transition:all .15s;}
          .wm-btn.on{color:#1b1aff;border-bottom:2px solid #1b1aff;}
          .wp-list{display:flex;flex-direction:column;gap:0;max-height:200px;overflow-y:auto;}
          .wp-row{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border:1px solid #0e0f28;border-top:none;cursor:pointer;transition:all .15s;}
          .wp-row:first-child{border-top:1px solid #0e0f28;}
          .wp-row:hover{background:rgba(27,26,255,0.08);}
          .wp-row.on{background:rgba(27,26,255,0.1);box-shadow:inset 0 0 0 1px #1b1aff;}
          .wp-name{font-family:'Space Grotesk',sans-serif;font-size:12px;color:#7888c0;}
          .wp-row.on .wp-name{color:#e8e8ff;}
          .wp-chk{width:18px;height:18px;border:1px solid #282c52;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s;}
          .wp-row.on .wp-chk{background:#1b1aff;border-color:#1b1aff;}

          .price-ctx{font-family:'Space Mono',monospace;font-size:10px;color:#4a5488;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;}
          .price-big{font-family:'Determination',monospace;font-size:3rem;color:#e8e8ff;line-height:1;margin-bottom:10px;}
          .trial-btn{width:100%;font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#4a5488;background:transparent;border:1px solid #1b1aff;padding:11px;cursor:pointer;transition:all .15s;text-align:center;display:block;margin-top:6px;}
          .trial-btn:hover{color:#1b1aff;background:rgba(27,26,255,0.08);}
          .trust-list{display:flex;flex-direction:column;gap:5px;padding:10px 16px;}
          .trust-item{display:flex;align-items:center;gap:8px;}
          .trust-dot{width:5px;height:5px;border-radius:50%;background:#1b1aff;flex-shrink:0;box-shadow:0 0 6px rgba(27,26,255,0.6);}
          .trust-txt{font-family:'Space Grotesk',sans-serif;font-size:11px;color:#4a5488;}

          .weights-sec{border-top:1px solid #0e0f28;}
          .weights-hd{padding:8px 1.2rem;border-bottom:1px solid #0e0f28;background:#06060f;}
          .weights-hd-txt{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#e8e8ff;}
          .wr{display:grid;grid-template-columns:120px 1fr auto;align-items:center;padding:0.6rem 1.2rem;border-bottom:1px solid #0e0f28;min-height:96px;cursor:pointer;transition:background .12s;overflow:visible;}
          .wr:hover{background:#0a0f35;}
          .wr.on{background:#0a0f35;}
          .wr-name{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#4a5488;flex-shrink:0;}
          .wr-sample{font-size:clamp(2rem,3.5vw,3.4rem);line-height:1.2;color:#cbcde8;overflow:visible;text-overflow:ellipsis;white-space:nowrap;padding:0.2rem 1rem;transition:color .12s;}
          .wr:hover .wr-sample,.wr.on .wr-sample{color:#e8e8ff;}
          .wr-add{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#fff;background:#1b1aff;border:none;padding:8px 14px;cursor:pointer;transition:all .15s;white-space:nowrap;flex-shrink:0;}
          .wr-add:hover{opacity:.85;}
          .wr-add.added{background:#1a6b3a;}

          .ticker-wrap{overflow:hidden;padding:8px 0;border-top:1px solid #0e0f28;}
          .ticker-track{display:flex;gap:1.5rem;animation:tickr 22s linear infinite;white-space:nowrap;}
          .ticker-char{font-size:1.6rem;color:rgba(27,26,255,0.2);letter-spacing:.05em;}
          @keyframes tickr{from{transform:translateX(0)}to{transform:translateX(-50%)}}

          .spec-sec{padding:1.5rem;border-top:1px solid #0e0f28;}
          .spec-main{margin-bottom:.6rem;overflow:hidden;border:1px solid #0e0f28;}
          .spec-main img{width:100%;display:block;}
          .spec-thumbs{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;}
          .spec-thumb{cursor:pointer;border:2px solid transparent;overflow:hidden;transition:border-color .15s;}
          .spec-thumb.on{border-color:#1b1aff;}
          .spec-thumb img{width:100%;display:block;aspect-ratio:4/3;object-fit:cover;filter:brightness(.7);transition:all .2s;}
          .spec-thumb:hover img,.spec-thumb.on img{filter:brightness(1);}

          .toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%) translateY(20px);background:#1a6b3a;color:#fff;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:600;padding:10px 24px;opacity:0;transition:all .3s;z-index:999;pointer-events:none;white-space:nowrap;}
          .toast.show{opacity:1;transform:translateX(-50%) translateY(0);}


          .sticky-buy{position:fixed;bottom:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:12px 2rem;background:rgba(0,0,0,0.97);border-top:1px solid #1b1aff;backdrop-filter:blur(12px);box-shadow:0 -4px 30px rgba(27,26,255,0.2);}
          .sticky-buy-info{display:flex;align-items:center;gap:1.5rem;flex:1;min-width:0;}
          .sticky-buy-name{font-family:'Space Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#e8e8ff;white-space:nowrap;}
          .sticky-buy-meta{font-family:'Space Mono',monospace;font-size:10px;color:#4a5488;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;}
          .sticky-buy-price{font-family:'Determination',monospace;font-size:1.8rem;color:#e8e8ff;line-height:1;flex-shrink:0;}
          .sticky-buy-actions{display:flex;align-items:center;gap:8px;flex-shrink:0;}
          .sticky-trial{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#4a5488;background:transparent;border:1px solid #0e0f28;padding:10px 16px;cursor:pointer;transition:all .15s;white-space:nowrap;}
          .sticky-trial:hover{border-color:#1b1aff;color:#1b1aff;}
          .sticky-cta{font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#fff;background:#1b1aff;border:none;padding:12px 24px;cursor:pointer;transition:opacity .15s;white-space:nowrap;box-shadow:0 0 20px rgba(27,26,255,0.4);}
          .sticky-cta:hover{opacity:.85;}
          .page-bottom-pad{height:72px;}
          .fp-ft{display:flex;justify-content:space-between;align-items:center;padding:.8rem 1.2rem;border-top:1px solid #0e0f28;background:#06060f;}
          .fp-ft-hft{font-family:'Space Mono',monospace;font-size:11px;font-weight:700;color:#4a5488;letter-spacing:.1em;}
          .fp-ft-copy{font-family:'Space Mono',monospace;font-size:10px;color:#282c52;letter-spacing:.06em;text-transform:uppercase;}
          .fp-ft-links{display:flex;gap:1.5rem;}
          .fp-ft a{font-family:'Space Mono',monospace;font-size:10px;color:#4a5488;letter-spacing:.1em;text-transform:uppercase;transition:color .15s;}
          .fp-ft a:hover{color:#e8e8ff;}

          @keyframes wave{0%,100%{transform:translateY(0)}25%{transform:translateY(-8px)}75%{transform:translateY(8px)}}
          @keyframes glitch{0%,100%{text-shadow:none;transform:none}20%{text-shadow:-2px 0 #f00,2px 0 #0ff;transform:skew(-1deg)}60%{text-shadow:2px 0 #f00,-2px 0 #0ff;transform:skew(1deg)}}
          @keyframes neon{0%,100%{text-shadow:0 0 10px #1b1aff,0 0 20px #1b1aff,0 0 40px #1b1aff}50%{text-shadow:0 0 5px #1b1aff,0 0 10px #1b1aff}}
          @keyframes gravity{0%{transform:translateY(-40px);opacity:0}60%{transform:translateY(4px)}100%{transform:translateY(0);opacity:1}}
          @keyframes fadechar{from{opacity:0;filter:blur(4px)}to{opacity:1;filter:blur(0)}}
          .anim-wave .stage-inner{animation:wave 1.2s ease-in-out infinite;}
          .anim-glitch .stage-inner{animation:glitch 0.4s steps(1) infinite;}
          .anim-neon .stage-inner{animation:neon 1.5s ease-in-out infinite;}
          .anim-gravity .stage-inner{animation:gravity 0.6s cubic-bezier(.22,.61,.36,1) forwards;}
          .anim-fade .stage-inner span{display:inline-block;animation:fadechar .4s ease forwards;opacity:0;}
        `}</style>
      </Head>

      <Script src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=GBP`} onReady={() => setPaypalReady(true)} />

      {/* NAV */}
      <nav className="nav">
        <Link href="/" className="nav-back">&#8592; ALL</Link>
        <Link href={`/typefaces/${prevFont.slug}`} className="nav-prev">&#8592; {prevFont.name.toUpperCase()}</Link>
        <div className="nav-space" />
        <Link href={`/typefaces/${nextFont.slug}`} className="nav-next">{nextFont.name.toUpperCase()} &#8594;</Link>
        <a href="#buy" className="nav-buy">BUY &#8594;</a>
      </nav>

      {/* GLYPH FULLSCREEN */}
      {focusedGlyph && (
        <div className="glyph-focus" onClick={() => setFocusedGlyph(null)}>
          <div style={{ fontFamily:ff, fontWeight:style.weight, fontSize:'clamp(8rem,18vw,16rem)', lineHeight:1, color:'#e8e8ff' }}>
            {focusedGlyph}
          </div>
          <div className="glyph-focus-lbl">U+{focusedGlyph.charCodeAt(0).toString(16).toUpperCase().padStart(4,'0')} &middot; Click to close</div>
        </div>
      )}

      <div className="page-wrap">
        {/* LEFT */}
        <div className="left">

          {/* Stage */}
          <div className={`stage-wrap${animation ? ' anim-' + animation : ''}`}
            onClick={e => { if (!mockupResult || !mockupResult.headline) { e.currentTarget.querySelector('[contenteditable]') && e.currentTarget.querySelector('[contenteditable]').focus(); setAnimation(null); } }}>

            {/* Mockup takeover */}
            {mockupResult && mockupResult.headline && (
              <div style={{ position:'absolute', inset:0, zIndex:10, background:mockupResult.bg || '#050510', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2.5rem' }}>
                <button onClick={() => setMockupResult(null)} style={{ position:'absolute', top:12, right:14, fontFamily:"'Space Mono',monospace", fontSize:11, color:'rgba(255,255,255,0.4)', background:'transparent', border:'1px solid rgba(255,255,255,0.1)', padding:'4px 10px', cursor:'pointer', letterSpacing:'.1em', zIndex:20 }}>
                  &#10005; CLOSE
                </button>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:'rgba(255,255,255,0.3)', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:'1.5rem' }}>
                  {mockupResult.label || 'MOCKUP'} &mdash; {font.name}
                </div>
                <div style={{ fontFamily:ff, fontWeight:style.weight, fontSize:'clamp(3rem,8vw,7rem)', color:mockupResult.accent || '#fff', letterSpacing:'-.02em', lineHeight:.9, textAlign:'center', marginBottom:'1rem' }}>
                  {mockupResult.headline}
                </div>
                <div style={{ fontFamily:ff, fontWeight:300, fontSize:'clamp(.7rem,1.5vw,1.1rem)', color:'rgba(255,255,255,0.5)', letterSpacing:'.14em', textTransform:'uppercase', textAlign:'center' }}>
                  {mockupResult.subline}
                </div>
                <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none', zIndex:15, overflow:'hidden' }}>
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:'clamp(.8rem,2vw,1.2rem)', color:'rgba(255,255,255,0.18)', letterSpacing:'.15em', textTransform:'uppercase', transform:'rotate(-25deg)', whiteSpace:'nowrap', userSelect:'none' }}>
                    UNLICENSED PREVIEW &middot; HYPERFLURO &middot; UNLICENSED PREVIEW &middot; HYPERFLURO
                  </div>
                </div>
                <div style={{ position:'absolute', bottom:14, left:0, right:0, textAlign:'center' }}>
                  <span style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:'rgba(255,255,255,0.25)', letterSpacing:'.12em', textTransform:'uppercase' }}>
                    License {font.name} to use this design commercially
                  </span>
                </div>
              </div>
            )}

            {/* Contenteditable — cursor matches text size */}
            {(!mockupResult || !mockupResult.headline) && (
              <div
                contentEditable={true}
                suppressContentEditableWarning={true}
                className="stage-ce"
                onInput={e => { setPreviewText(e.currentTarget.textContent || ''); setAnimation(null); }}
                onKeyDown={e => { if (e.key === 'Enter') e.preventDefault(); }}
                spellCheck={false}
                style={{
                  fontFamily: ff,
                  fontWeight: style.weight,
                  fontStyle: style.oblique ? 'italic' : 'normal',
                  fontSize: fontSize + 'px',
                  letterSpacing: letterSpacing + '%',
                  lineHeight: lineHeight,
                }}
              />
            )}

            {/* Visual display layer */}
            {(!mockupResult || !mockupResult.headline) && (
              <div className="stage-display">
                <div className="stage-inner" style={{ fontFamily:ff, fontWeight:style.weight, fontStyle:style.oblique?'italic':'normal', fontSize:fontSize+'px', letterSpacing:letterSpacing+'%', lineHeight:lineHeight, color: animation === 'neon' ? '#fff' : '#e8e8ff' }}>
                  {animation === 'fade'
                    ? (previewText || fontPhrase).split('').map((ch, i) => (
                        <span key={i} style={{ animationDelay: i * 0.06 + 's' }}>{ch}</span>
                      ))
                    : (previewText || fontPhrase)
                  }
                </div>
              </div>
            )}

            {!previewText && !animation && (!mockupResult || !mockupResult.headline) && (
              <div className="stage-hint">CLICK ANYWHERE TO TYPE...</div>
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

          {/* Glyph grid */}
          <div className="glyph-section">
            <div className="glyph-tabs">
              {Object.keys(GLYPH_SETS).map(k => (
                <button key={k} className={`g-tab${glyphSet===k?' on':''}`} onClick={() => { setGlyphSet(k); if (k === 'ALL') fetchAllGlyphs(); }}>
                  {k.charAt(0) + k.slice(1).toLowerCase()}
                </button>
              ))}
              <span className="g-count">{glyphSet === "ALL" && allFontGlyphs ? allFontGlyphs.length + " shown" : allGlyphs.length + " shown"} &middot; {font.glyphCount}+ total</span>
            </div>
            <div className="g-grid">
              {glyphSet === 'ALL' ? (
                glyphsLoading ? (
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:'#4a5488', padding:'1rem', gridColumn:'1/-1' }}>Loading all glyphs...</div>
                ) : allFontGlyphs ? (
                  allFontGlyphs.map((g,i) => (
                    <div key={i} className="g-cell" onClick={() => setFocusedGlyph(g.char)}>
                      <span className="g-char" style={{ fontFamily:ff, fontWeight:style.weight }}>{g.char}</span>
                      <span className="g-code">{g.hex}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:'#4a5488', padding:'1rem', gridColumn:'1/-1' }}>Click ALL to load glyphs</div>
                )
              ) : (
                allGlyphs.map((g,i) => (
                  <div key={i} className="g-cell" onClick={() => setFocusedGlyph(g)}>
                    <span className="g-char" style={{ fontFamily:ff, fontWeight:style.weight }}>{g}</span>
                    <span className="g-code">U+{g.charCodeAt(0).toString(16).toUpperCase().padStart(4,'0')}</span>
                  </div>
                ))
              )}
            </div>
            <div className="g-hint">Click any glyph to enlarge</div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="panel">

          {/* Weight */}
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

          {/* TYPE LAB */}
          <div className="panel-row">
            <div className="typelab-head">Type Lab</div>
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
            <div className="mockup-lbl">AI Mockup &mdash; Powered by Claude</div>
            <div className="mockup-row">
              <input className="mockup-inp" value={mockupPrompt} onChange={e => setMockupPrompt(e.target.value)}
                onKeyDown={e => e.key==='Enter' && generateMockup()}
                placeholder="e.g. luxury perfume brand..." maxLength={60} />
              <button className="mockup-btn" onClick={generateMockup} disabled={mockupLoading || !mockupPrompt.trim()}>
                {mockupLoading ? '...' : 'GEN'}
              </button>
            </div>
            {mockupLoading && <div className="mockup-loading">Generating concept...</div>}
            {mockupResult && mockupResult.error && <div style={{ fontFamily:"'Space Mono',monospace", fontSize:9, color:'#f55', padding:'4px 0' }}>Failed &mdash; try again</div>}
            {!mockupResult && !mockupLoading && (
              <div className="mockup-hint">
                Type a brief &#8594; see {font.name} in context.<br/>
                Purchase license to use without watermark.
              </div>
            )}
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
                <div className="panel-sublbl">Number of seats <span style={{ color:'#1b1aff' }}>(installations)</span></div>
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
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:11, color:'#7888c0', paddingTop:4 }}>
                All {font.styles.length} weights &mdash; best value
              </div>
            )}
          </div>

          {/* Price */}
          <div className="panel-row">
            <div className="price-ctx">{weightCount} WEIGHT{weightCount>1?'S':''} &middot; {licenseType.toUpperCase()}</div>
            <div className="price-big">&#163;{estPrice}</div>
            <div ref={paypalRef} style={{ minHeight:44 }}>
              {purchasing && <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:12, color:'#7888c0' }}>Processing...</span>}
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

      {/* ALL WEIGHTS */}
      <div className="weights-sec">
        <div className="weights-hd"><span className="weights-hd-txt">All Weights</span></div>
        {font.styles.map((s,i) => (
          <div key={i} className={`wr${activeStyle===i?' on':''}`} onClick={() => setActiveStyle(i)}>
            <span className="wr-name">{s.name.toUpperCase()}</span>
            <span className="wr-sample" style={{ fontFamily:ff, fontWeight:s.weight, fontStyle:s.oblique?'italic':'normal' }}>
              {previewText || ZEN_SENTENCE}
            </span>
            <button className={`wr-add${addedIdx===i?' added':''}`} onClick={e => addToCart(i, e)}>
              {addedIdx===i ? '&#10003; ADDED' : 'ADD +'}
            </button>
          </div>
        ))}
      </div>

      {/* TOAST */}
      <div className={`toast${showToast?' show':''}`}>{toastMsg}</div>

      {/* STICKY BOTTOM BUY BAR */}
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

      {/* FOOTER */}
      <footer className="fp-ft">
        <span className="fp-ft-hft">HF</span>
        <span className="fp-ft-copy">Copyright 2026 &copy; HypeFluro</span>
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
