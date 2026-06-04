# HypeForType — Deployment Guide

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add your font files
Place font files in `/public/fonts/` for web display:
```
public/fonts/
  ui/
    determination.ttf
    DigitalDisco.ttf
  babalove/
    Babalove-Regular.otf
    Babalove-Bold.otf
    ... (all weights)
  nanami/
    Nanami-Book.otf
    ... (all weights)
  [slug]/
    [font-files]
```

Place the SAME font files in `/private-fonts/` for secure downloads:
```
private-fonts/
  babalove/
    Babalove-Regular.otf
    ... (all files for download)
  nanami/
    ...
```

**Folder slug mapping:**
- BABALOVE → babalove
- BAQ ROUNDED → baq-rounded
- BOMKIN → bomkin
- CROP → crop
- Do It Again → do-it-again
- EBISU → ebisu
- ELECTRO → electro
- HEADLINED SOLID → headlined-solid
- HEADLINED → headlined
- HIROKO → hiroko
- LIPPY → lippy
- MIYAGI → miyagi
- MONINO PRO → monino-pro
- MONOLITE → monolite
- NANAMI → nanami
- NANAMI HANDMADE → nanami-handmade
- NANAMI PRO → nanami-pro
- NANAMI ROUNDED PRO → nanami-rounded-pro
- NEROLINIA → nerolina
- RIKA → rika
- ROKA → roka
- SHINE PRO → shine-pro
- SOBEK → sobek
- VOW NEUE → vow-neue
- YORK HANDWRITING → york-handwriting
- YUKI → yuki
- YOKO → yume
- YUKO → yumo

### 3. Environment variables
Copy `.env.example` to `.env.local` — credentials are already filled in.

For Vercel deployment, add these in the Vercel dashboard under Settings → Environment Variables:
- PAYPAL_CLIENT_ID
- PAYPAL_SECRET
- PAYPAL_ENV=live
- NEXT_PUBLIC_PAYPAL_CLIENT_ID
- DOWNLOAD_SECRET
- NEXT_PUBLIC_BASE_URL

### 4. Run locally
```bash
npm run dev
```
Visit http://localhost:3000

### 5. Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

## Important: Secure Font Downloads on Vercel

The `/private-fonts/` directory cannot be deployed to Vercel (50MB function limit + not supported for binary files). For production:

**Option A — Vercel Blob (recommended):**
1. Enable Vercel Blob in your project dashboard
2. Upload all font zips to Blob storage
3. Update `/pages/api/download.js` to fetch from Blob URL

**Option B — Simple approach for now:**
Deploy to a VPS (DigitalOcean/Hetzner) where the full filesystem is available.
The rest of the site works perfectly on Vercel — only the actual file serving needs a workaround.

For now the download page will show a "contact support" message if font files aren't found — customers can email you and you manually send the zip. This lets you go live immediately.

## Pages
- `/` — Homepage with all 28 fonts
- `/typefaces/[slug]` — Individual font page with PayPal buy button
- `/cart` — Shopping cart
- `/download` — Secure download page (token-gated)
- `/licensing` — License tiers explained
- `/faq` — FAQ
- `/privacy` — Privacy policy
- `/contact` — Contact

## Support
Update contact emails in `/pages/contact.js` and `/pages/faq.js`
