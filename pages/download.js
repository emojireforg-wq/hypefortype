import Head from 'next/head';
import { useState, useEffect } from 'react';

const dd = "'DigitalDisco', monospace";
const det = "'Determination', monospace";

export default function Download() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) { setStatus('error'); setMessage('No download token found. Please check your email.'); return; }
    setStatus('ready');
    setMessage('Your download is ready. Click below to download your fonts.');
    // Auto-trigger download
    setTimeout(() => { window.location.href = `/api/download?token=${token}`; }, 1500);
  }, []);

  return (
    <>
      <Head><title>Download — HypeForType</title></Head>
      <div style={{ background:'var(--bg)', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
        <div style={{ fontFamily:det, fontSize:'clamp(1.5rem,4vw,2.5rem)', color:'var(--white)', marginBottom:'1rem', letterSpacing:'.04em' }}>HypeForType</div>
        <div style={{ border:'1px solid var(--border)', padding:'2rem 2.5rem', maxWidth:480, width:'100%', textAlign:'center' }}>
          {status === 'loading' && <div style={{ fontFamily:dd, fontSize:'.5rem', letterSpacing:'.16em', textTransform:'uppercase', color:'var(--dim)' }}>Validating token...</div>}
          {status === 'ready' && (
            <>
              <div style={{ fontFamily:dd, fontSize:'.44rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#3a3a3a', marginBottom:'1rem' }}>Purchase confirmed</div>
              <div style={{ fontFamily:dd, fontSize:'.52rem', letterSpacing:'.1em', color:'var(--white)', marginBottom:'1.5rem', lineHeight:1.7 }}>{message}</div>
              <div style={{ fontFamily:dd, fontSize:'.4rem', letterSpacing:'.12em', textTransform:'uppercase', color:'var(--dim)', marginBottom:'1.5rem' }}>Starting download automatically...</div>
              <a href={`/api/download?token=${typeof window!=='undefined'?new URLSearchParams(window.location.search).get('token'):''}`}
                style={{ fontFamily:det, fontSize:'.6rem', letterSpacing:'.08em', textTransform:'uppercase', color:'var(--white)', background:'var(--blue)', padding:'12px 2rem', display:'inline-block', textDecoration:'none', transition:'opacity .15s' }}>
                Download Fonts
              </a>
              <div style={{ fontFamily:dd, fontSize:'.36rem', letterSpacing:'.12em', textTransform:'uppercase', color:'#282828', marginTop:'1.2rem' }}>
                This link is valid for 48 hours and can only be used once.
              </div>
            </>
          )}
          {status === 'error' && (
            <>
              <div style={{ fontFamily:det, fontSize:'.8rem', color:'#E24B4A', letterSpacing:'.04em', marginBottom:'1rem' }}>Download Error</div>
              <div style={{ fontFamily:dd, fontSize:'.48rem', letterSpacing:'.1em', color:' var(--dim)', lineHeight:1.7, marginBottom:'1.5rem' }}>{message}</div>
              <div style={{ fontFamily:dd, fontSize:'.38rem', letterSpacing:'.12em', textTransform:'uppercase', color:'#282828' }}>
                Contact <a href="mailto:support@hypefortype.com" style={{ color:'var(--blue)' }}>support@hypefortype.com</a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
