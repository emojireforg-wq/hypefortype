import Head from 'next/head';
import Nav from '../components/Nav';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { pricing } from '../lib/fonts';
import Script from 'next/script';

const dd = "'DigitalDisco', monospace";
const det = "'Determination', monospace";
const b = '1px solid var(--border)';
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [paypalReady, setPaypalReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const paypalRef = useRef(null);

  useEffect(() => {
    try { setCart(JSON.parse(localStorage.getItem('hft_cart') || '[]')); } catch(e) { setCart([]); }
  }, []);

  const remove = (idx) => {
    const c = cart.filter((_,i)=>i!==idx);
    setCart(c);
    localStorage.setItem('hft_cart', JSON.stringify(c));
  };

  const total = cart.reduce((sum, item) => {
    const tiers = pricing[item.isFamily ? 'family' : 'single'];
    return sum + (tiers[item.license]?.price || 0);
  }, 0);

  useEffect(() => {
    if (!paypalReady || !paypalRef.current || cart.length === 0) return;
    paypalRef.current.innerHTML = '';
    window.paypal.Buttons({
      createOrder: async () => {
        const desc = cart.map(i => i.name).join(', ') + ' — License Bundle';
        const res = await fetch('/api/paypal-create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total, description: desc }),
        });
        const data = await res.json();
        return data.orderId;
      },
      onApprove: async (data) => {
        setProcessing(true);
        // Capture each item and collect download tokens
        const tokens = [];
        for (const item of cart) {
          const res = await fetch('/api/paypal-capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: data.orderID, fontSlug: item.slug, licenseTier: item.license }),
          });
          const result = await res.json();
          if (result.token) tokens.push({ name: item.name, token: result.token });
        }
        localStorage.removeItem('hft_cart');
        // Redirect to download page with first token; email will handle the rest
        if (tokens.length > 0) window.location.href = `/download?token=${tokens[0].token}`;
        setProcessing(false);
      },
      style: { layout:'vertical', color:'black', shape:'rect', label:'buynow', height:45 },
    }).render(paypalRef.current);
  }, [paypalReady, cart, total]);

  return (
    <>
      <Head><title>Cart — HypeForType</title></Head>
      <Script src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=GBP`} onReady={() => setPaypalReady(true)} />
      <Nav />

      <div style={{ borderBottom:b, padding:'.45rem 1.2rem', display:'flex', justifyContent:'space-between' }}>
        <span style={{ fontFamily:dd, fontSize:'.4rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--dim)' }}>Cart</span>
        <span style={{ fontFamily:dd, fontSize:'.4rem', letterSpacing:'.14em', textTransform:'uppercase', color:'#2a2a2a' }}>{cart.length} item{cart.length!==1?'s':''}</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', minHeight:'60vh' }}>
        {/* ITEMS */}
        <div style={{ borderRight:b }}>
          {cart.length === 0 ? (
            <div style={{ padding:'3rem 1.2rem', textAlign:'center' }}>
              <div style={{ fontFamily:det, fontSize:'1.2rem', color:'var(--dim)', marginBottom:'1rem' }}>Your cart is empty</div>
              <Link href="/" style={{ fontFamily:dd, fontSize:'.44rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--blue)' }}>← Browse Typefaces</Link>
            </div>
          ) : cart.map((item, i) => {
            const tiers = pricing[item.isFamily ? 'family' : 'single'];
            const tier = tiers[item.license];
            return (
              <div key={i} style={{ borderBottom:b, display:'grid', gridTemplateColumns:'1fr auto', alignItems:'center', padding:'1rem 1.2rem' }}>
                <div>
                  <Link href={`/typefaces/${item.slug}`} style={{ fontFamily:det, fontSize:'1.1rem', color:'var(--white)', letterSpacing:'.02em', display:'block', marginBottom:'.3rem' }}>{item.name}</Link>
                  <span style={{ fontFamily:dd, fontSize:'.38rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--dim)' }}>{tier?.label} License · £{tier?.price}</span>
                </div>
                <button onClick={()=>remove(i)} style={{ fontFamily:dd, fontSize:'.36rem', letterSpacing:'.12em', textTransform:'uppercase', color:'#333', background:'transparent', border:b, padding:'4px 8px', transition:'all .12s' }}
                  onMouseEnter={e=>{e.target.style.color='var(--white)';e.target.style.borderColor='#333'}} onMouseLeave={e=>{e.target.style.color='#333';e.target.style.borderColor='var(--border)'}}>
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        {/* ORDER SUMMARY */}
        <div style={{ padding:'1.4rem' }}>
          <div style={{ fontFamily:dd, fontSize:'.4rem', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--dim)', marginBottom:'1rem' }}>Order Summary</div>
          {cart.map((item, i) => {
            const tiers = pricing[item.isFamily ? 'family' : 'single'];
            const tier = tiers[item.license];
            return (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'.35rem 0', borderBottom:'1px solid #111' }}>
                <span style={{ fontFamily:dd, fontSize:'.38rem', letterSpacing:'.08em', color:'#444' }}>{item.name} — {tier?.label}</span>
                <span style={{ fontFamily:det, fontSize:'.5rem', color:'var(--dim)' }}>£{tier?.price}</span>
              </div>
            );
          })}
          <div style={{ display:'flex', justifyContent:'space-between', padding:'.7rem 0', borderTop:'1px solid var(--dim)', marginTop:'.3rem', marginBottom:'1.2rem' }}>
            <span style={{ fontFamily:dd, fontSize:'.44rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--white)' }}>Total</span>
            <span style={{ fontFamily:det, fontSize:'1.2rem', color:'var(--white)' }}>£{total}</span>
          </div>

          {cart.length > 0 && (
            processing ? (
              <div style={{ fontFamily:dd, fontSize:'.44rem', letterSpacing:'.14em', textTransform:'uppercase', color:'var(--dim)', padding:'12px 0' }}>Processing...</div>
            ) : (
              <div ref={paypalRef} />
            )
          )}

          <div style={{ fontFamily:dd, fontSize:'.34rem', letterSpacing:'.12em', textTransform:'uppercase', color:'#282828', textAlign:'center', marginTop:'.8rem' }}>
            Secure checkout via PayPal · Instant download after payment
          </div>
        </div>
      </div>
    </>
  );
}
