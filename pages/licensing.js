git add pages/licensing.js
git commit -m "new licensing page"
git push
git add pages/licensing.js
git commit -m "new licensing page"
git push
git add pages/licensing.js
git commit -m "new licensing page"
git push
ls pages/licensing.js
import Head from 'next/head';
import Link from 'next/link';
import Nav from '../components/Nav';
import { useState } from 'react';

const LICENSES = [
  { key:'desktop',    label:'Desktop',      price:'From £25', icon:'/icons/others-52.svg' },
  { key:'webfont',    label:'Webfont',      price:'From £45', icon:'/icons/phone-13.svg'  },
  { key:'webapp',     label:'Web App',      price:'From £35', icon:'/icons/grid-05.svg'   },
  { key:'digitalads', label:'Digital Ads',  price:'From £35', icon:'/icons/tech-06.svg'   },
  { key:'app',        label:'App',          price:'From £55', icon:'/icons/tech-07.svg'   },
  { key:'server',     label:'Server',       price:'From £75', icon:'/icons/grid-08.svg'   },
  { key:'broadcast',  label:'Broadcast',    price:'From £85', icon:'/icons/phone-05.svg'  },
  { key:'brand',      label:'Brand Font',   price:'From £95', icon:'/icons/others-08.svg' },
  { key:'enterprise', label:'Corporate',    price:'POA',      icon:'/icons/others-24.svg' },
  { key:'trial',      label:'Trial',        price:'Free',     icon:'/icons/photo-04.svg'  },
];

const TABLE_ROWS = [
  { label:'Commercial use',         values:[true, true, true, true, true, true, true, true, true, false] },
  { label:'Perpetual license',      values:[true, true, true, true, true, true, true, true, true, false] },
  { label:'Print & static image',   values:[true, false,false,false,false,false,false,true, true, true]  },
  { label:'Web embed (@font-face)', values:[false,true, true, true, false,false,false,false,true, false] },
  { label:'App / server / eBook',   values:[false,false,false,false,true, true, false,false,true, false] },
  { label:'Video & broadcast',      values:[false,false,false,false,false,false,true, false,true, false] },
  { label:'Trademark / logo',       values:[false,false,false,false,false,false,false,true, true, false] },
  { label:'Digital advertising',    values:[false,false,false,true, false,false,false,false,true, false] },
  { label:'Supplier access',        values:[false,false,false,false,false,false,false,false,true, false] },
  { label:'Use across territories', values:[true, true, true, true, true, true, true, true, true, false] },
];

const DETAILS = [
  {
    key:'desktop', label:'Desktop', eulaKey:'desktop', icon:'/icons/others-52.svg',
    points:[
      'For freelancers, studios, agencies, and companies.',
      'Install on up to the licensed number of computers.',
      'Create print documents, static images, and digital artwork (PDF, JPEG, PNG etc.)',
      'One-time fee, perpetual license — no renewals required.',
      'Does not cover web embedding, apps, video, or logo trademark use.',
      'Font files may not be shared with or redistributed to third parties.',
    ],
  },
  {
    key:'webfont', label:'Webfont', eulaKey:'webfont', icon:'/icons/phone-13.svg',
    points:[
      'Embed font files via @font-face as live text on websites.',
      'One license covers one domain or URL.',
      'One-time fee, perpetual license.',
      'May not be used to create static graphics or logos.',
      'Does not cover apps, servers, video, or broadcast use.',
      'Font files may not be redistributed to third parties.',
    ],
  },
  {
    key:'webapp', label:'Web App', eulaKey:'webapp', icon:'/icons/grid-05.svg',
    points:[
      'Embed fonts in browser-based web applications.',
      'Covers dynamic rendering within a single web application.',
      'One-time fee, perpetual license.',
      'Does not cover native mobile or desktop app embedding.',
      'Does not cover print, broadcast, or logo use.',
      'Font files may not be redistributed or exposed to end users.',
    ],
  },
  {
    key:'digitalads', label:'Digital Ads', eulaKey:'digitalads', icon:'/icons/tech-06.svg',
    points:[
      'Use fonts in digital advertising campaigns.',
      'Covers banner ads, social media ads, and display advertising.',
      'One-time fee, perpetual license per campaign.',
      'Does not cover broadcast, video, or app embedding.',
      'Does not cover print or physical advertising without Desktop license.',
      'Font files may not be shared with ad networks or third parties.',
    ],
  },
  {
    key:'app', label:'App', eulaKey:'app', icon:'/icons/tech-07.svg',
    points:[
      'Embed fonts in iOS, Android, desktop software, games, or eBooks.',
      'One license covers one app title across all platforms and updates.',
      'One-time fee, perpetual license.',
      'May not be used in apps allowing end users to create custom typesetting.',
      'Font files may not be exposed in app source code or redistributed.',
      'Does not cover web, broadcast, or logo trademark use.',
    ],
  },
  {
    key:'server', label:'Server', eulaKey:'server', icon:'/icons/grid-08.svg',
    points:[
      'Embed fonts on servers for dynamic document or image generation.',
      'Covers PDF generation, image rendering, and server-side processing.',
      'One license per server or service endpoint.',
      'One-time fee, perpetual license.',
      'Does not cover web embedding, apps, or broadcast use.',
      'Font files may not be redistributed or made available for download.',
    ],
  },
  {
    key:'broadcast', label:'Broadcast', eulaKey:'broadcast', icon:'/icons/phone-05.svg',
    points:[
      'Use fonts in TV, film, cinema, or streaming video productions.',
      'One license per single title (film, series, or campaign).',
      'One-time fee, perpetual license.',
      'Does not cover web embedding, apps, or logo trademark use.',
      'May not be used to create static documents or physical products.',
      'Font files may not be redistributed to third parties.',
    ],
  },
  {
    key:'brand', label:'Brand Font', eulaKey:'brand', icon:'/icons/others-08.svg',
    points:[
      'Design a logo, wordmark, or device mark with permission to trademark it.',
      'Font outlines may be modified exclusively for logo creation.',
      'Covers all print and static digital use of the logo.',
      'One-time fee, perpetual license.',
      'Does not cover web embedding, apps, or broadcast without additional licenses.',
      'Font files may not be redistributed to clients or third parties.',
    ],
  },
  {
    key:'enterprise', label:'Corporate', eulaKey:'enterprise', icon:'/icons/others-24.svg',
    points:[
      'Unlimited use across the entire corporate entity.',
      'Covers all employees, all departments, all projects.',
      'Includes affiliated suppliers: agencies, advertisers, and service providers.',
      'Covers desktop, web, app, broadcast, and brand use in one license.',
      'One-time fee, perpetual license.',
      'Does not cover OEM usage or sublicensing to external third parties.',
    ],
  },
  {
    key:'trial', label:'Trial Font', eulaKey:'trial', icon:'/icons/photo-04.svg',
    points:[
      'Download free to evaluate font integration in your designs.',
      'For internal testing and design comps only.',
      'Numerals 0–9 are not included in trial versions.',
      'May not be used for any commercial purpose whatsoever.',
      'May not be used in client work, publications, or distributed products.',
      'May not be resold or redistributed to third parties.',
    ],
  },
];

const EULAS = {
  desktop: {
    title: 'Desktop Font License Agreement',
    body: `HYPEFORTYPE DESKTOP FONT LICENSE AGREEMENT

Last updated: 2026

PLEASE READ THIS AGREEMENT CAREFULLY BEFORE INSTALLING OR USING THE FONT SOFTWARE.

1. GRANT OF LICENSE
HypeForType ("Licensor") grants you ("Licensee") a non-exclusive, non-transferable, perpetual license to install and use the font software ("Font") on the number of computers specified at the time of purchase within a single legal entity.

2. PERMITTED USES
You may use the Font to:
(a) Create printed documents, packaging, and marketing materials;
(b) Create static digital images (JPEG, PNG, PDF, etc.) for print or screen display;
(c) Create presentations and pitch decks for internal or client use.

3. RESTRICTIONS
You may NOT:
(a) Embed the Font in websites via @font-face or any other web embedding method;
(b) Embed the Font in mobile apps, desktop software, games, or eBooks;
(c) Use the Font in video, film, television, or broadcast productions;
(d) Use the Font as the basis for a trademark, wordmark, or registered logo without a separate Brand Font License;
(e) Install the Font on more computers than the licensed number;
(f) Redistribute, sell, sublicense, or transfer the Font files to any third party;
(g) Modify the Font software itself (modifying outlines for use in static artwork is permitted).

4. THIRD PARTY USE
Your clients and suppliers must obtain their own license if they require access to the Font files. Sending font files to a third party (including print shops, agencies, or clients) is not permitted under this license.

5. OWNERSHIP
The Font remains the intellectual property of HypeForType at all times. This license grants a right to use the Font, not ownership of the Font software.

6. TERMINATION
This license terminates automatically if you breach any of its terms. Upon termination, you must destroy all copies of the Font in your possession.

7. WARRANTY DISCLAIMER
The Font is provided "as is" without warranty of any kind. HypeForType makes no warranties, express or implied, regarding fitness for a particular purpose.

8. LIMITATION OF LIABILITY
HypeForType's liability shall not exceed the original purchase price of the Font license.

9. GOVERNING LAW
This agreement is governed by the laws of England and Wales.

© 2026 HypeForType. All rights reserved.`,
  },
  webfont: {
    title: 'Webfont License Agreement',
    body: `HYPEFORTYPE WEBFONT LICENSE AGREEMENT

Last updated: 2026

1. GRANT OF LICENSE
HypeForType grants you a non-exclusive, non-transferable, perpetual license to embed the Font using @font-face CSS on the single domain or URL specified at the time of purchase.

2. PERMITTED USES
You may use the Font to:
(a) Render live, dynamic text on the licensed website domain;
(b) Display the Font across all pages within the licensed domain;
(c) Use the Font in web-based interfaces on the licensed domain.

3. RESTRICTIONS
You may NOT:
(a) Use the Font on any domain other than the licensed domain without purchasing an additional license;
(b) Use the Font to create static graphics, illustrations, logos, or artworks;
(c) Embed the Font in native mobile or desktop applications;
(d) Use the Font in video, film, or broadcast productions;
(e) Expose raw font files for download by end users;
(f) Redistribute, sell, or sublicense the Font files to any third party;
(g) Use the Font on a subdomain without written confirmation from HypeForType that it is covered.

4. SUBDOMAINS
Each subdomain (e.g. blog.yourdomain.com) requires confirmation from HypeForType as to whether it is covered under the single-domain license or requires a separate license.

5. OWNERSHIP
The Font remains the intellectual property of HypeForType at all times.

6. TERMINATION
This license terminates automatically upon breach of any terms herein.

7. GOVERNING LAW
This agreement is governed by the laws of England and Wales.

© 2026 HypeForType. All rights reserved.`,
  },
  webapp: {
    title: 'Web App Font License Agreement',
    body: `HYPEFORTYPE WEB APP FONT LICENSE AGREEMENT

Last updated: 2026

1. GRANT OF LICENSE
HypeForType grants you a non-exclusive, non-transferable, perpetual license to embed the Font within a single browser-based web application.

2. PERMITTED USES
You may use the Font to:
(a) Render text within the licensed web application interface;
(b) Display the Font to end users of the web application;
(c) Use the Font across all features and pages within the single licensed application.

3. RESTRICTIONS
You may NOT:
(a) Use the Font outside the licensed web application;
(b) Embed the Font in native iOS, Android, or desktop applications;
(c) Use the Font to generate downloadable documents containing the Font as an embedded resource;
(d) Expose raw font files for download or access by end users;
(e) Use the Font in video, broadcast, or print productions;
(f) Redistribute or sublicense the Font to any third party.

4. OWNERSHIP
The Font remains the intellectual property of HypeForType at all times.

5. GOVERNING LAW
This agreement is governed by the laws of England and Wales.

© 2026 HypeForType. All rights reserved.`,
  },
  digitalads: {
    title: 'Digital Advertising Font License Agreement',
    body: `HYPEFORTYPE DIGITAL ADVERTISING FONT LICENSE AGREEMENT

Last updated: 2026

1. GRANT OF LICENSE
HypeForType grants you a non-exclusive, non-transferable, perpetual license to use the Font in digital advertising materials for the campaign or period specified at purchase.

2. PERMITTED USES
You may use the Font to:
(a) Create banner advertisements, display ads, and rich media ads;
(b) Create social media advertising assets (static and animated);
(c) Create email marketing graphics and HTML email templates;
(d) Create digital out-of-home advertising content.

3. RESTRICTIONS
You may NOT:
(a) Use the Font in broadcast, television, or video-on-demand advertising without a separate Broadcast License;
(b) Embed the Font in web applications or websites via @font-face without a separate Webfont License;
(c) Use the Font in print advertising without a separate Desktop License;
(d) Share or distribute the Font files with ad networks, publishers, or third-party vendors;
(e) Use the Font beyond the scope of the licensed campaign without purchasing an additional license.

4. THIRD PARTY VENDORS
Font files may not be shared with advertising agencies, media buyers, or ad networks. All parties requiring access to the Font must obtain their own license.

5. OWNERSHIP
The Font remains the intellectual property of HypeForType at all times.

6. GOVERNING LAW
This agreement is governed by the laws of England and Wales.

© 2026 HypeForType. All rights reserved.`,
  },
  app: {
    title: 'App Font License Agreement',
    body: `HYPEFORTYPE APP FONT LICENSE AGREEMENT

Last updated: 2026

1. GRANT OF LICENSE
HypeForType grants you a non-exclusive, non-transferable, perpetual license to embed the Font in the single application title specified at purchase, across all supported platforms and versions.

2. PERMITTED USES
You may use the Font to:
(a) Embed the Font in a single iOS, Android, or cross-platform mobile application;
(b) Embed the Font in a single desktop software application or game;
(c) Embed the Font in a single eBook title (EPUB, PDF, or equivalent format);
(d) Distribute the application to unlimited end users on any platform.

3. RESTRICTIONS
You may NOT:
(a) Use this license for more than one application title;
(b) Embed the Font in an application that allows end users to select, access, or export the Font for use outside the application;
(c) Embed the Font in any application that provides typesetting or font-selection tools to end users;
(d) Expose the raw Font files within the application package in a manner accessible to end users;
(e) Use the Font on websites, servers, or in video/broadcast productions;
(f) Redistribute the Font files to any third party.

4. UPDATES AND PLATFORMS
A single App License covers all updates, versions, and platforms for the one licensed application title.

5. OWNERSHIP
The Font remains the intellectual property of HypeForType at all times.

6. GOVERNING LAW
This agreement is governed by the laws of England and Wales.

© 2026 HypeForType. All rights reserved.`,
  },
  server: {
    title: 'Server Font License Agreement',
    body: `HYPEFORTYPE SERVER FONT LICENSE AGREEMENT

Last updated: 2026

1. GRANT OF LICENSE
HypeForType grants you a non-exclusive, non-transferable, perpetual license to install and use the Font on a server environment for the purpose of automated document or image generation.

2. PERMITTED USES
You may use the Font to:
(a) Generate PDF documents server-side using the Font;
(b) Render images containing the Font via server-side processing;
(c) Use the Font within internal business automation workflows;
(d) Generate personalised documents at scale for legitimate business purposes.

3. RESTRICTIONS
You may NOT:
(a) Make the Font available for download to end users or third parties via the server;
(b) Use the Font in a service that allows third parties to access or use the Font for their own purposes;
(c) Use the Font for web embedding via @font-face without a separate Webfont License;
(d) Use the Font in broadcast, video, or app productions;
(e) Redistribute or sublicense the Font to any third party.

4. SCOPE
One Server License covers one server or service endpoint. Additional servers or endpoints require additional licenses.

5. OWNERSHIP
The Font remains the intellectual property of HypeForType at all times.

6. GOVERNING LAW
This agreement is governed by the laws of England and Wales.

© 2026 HypeForType. All rights reserved.`,
  },
  broadcast: {
    title: 'Broadcast Font License Agreement',
    body: `HYPEFORTYPE BROADCAST FONT LICENSE AGREEMENT

Last updated: 2026

1. GRANT OF LICENSE
HypeForType grants you a non-exclusive, non-transferable, perpetual license to use the Font in the single production title specified at purchase across all distribution platforms.

2. PERMITTED USES
You may use the Font to:
(a) Create title sequences, credits, and on-screen text for film or television;
(b) Create content for streaming platforms (Netflix, Amazon, Disney+, YouTube, etc.);
(c) Create online video content including social media video and branded content;
(d) Create digital signage and out-of-home video displays.

3. RESTRICTIONS
You may NOT:
(a) Use this license for more than one production title;
(b) Use the Font to create static print materials, packaging, or logos;
(c) Embed the Font in websites, apps, or server environments without separate licenses;
(d) Redistribute or share the Font files with production partners, studios, or post-production vendors;
(e) Use the Font beyond the scope of the single licensed production title.

4. PRODUCTION PARTNERS
All studios, post-production houses, or agencies working on the licensed production must use Font files provided by the licensee. The Font files may not be transferred to production partners permanently; they must be deleted upon completion of the production.

5. OWNERSHIP
The Font remains the intellectual property of HypeForType at all times.

6. GOVERNING LAW
This agreement is governed by the laws of England and Wales.

© 2026 HypeForType. All rights reserved.`,
  },
  brand: {
    title: 'Brand Font License Agreement',
    body: `HYPEFORTYPE BRAND FONT LICENSE AGREEMENT

Last updated: 2026

1. GRANT OF LICENSE
HypeForType grants you a non-exclusive, perpetual license to use the Font as the basis for a trademark, wordmark, or registered brand logo, and to use that logo across all static print and digital media.

2. PERMITTED USES
You may use the Font to:
(a) Design a logo, wordmark, monogram, or device mark for trademark registration;
(b) Modify Font outlines exclusively for the purpose of creating the logo;
(c) Use the final logo across all print and digital media including packaging, signage, stationery, and static digital formats;
(d) Provide the final logo artwork (not the Font files) to third parties for production purposes.

3. RESTRICTIONS
You may NOT:
(a) Use the Font itself (unmodified or as live text) beyond the creation of the logo without additional licenses;
(b) Embed the Font in websites via @font-face without a separate Webfont License;
(c) Embed the Font in apps, software, or server environments without a separate App or Server License;
(d) Use the Font in video or broadcast productions without a separate Broadcast License;
(e) Redistribute or transfer the raw Font files to any third party, including your client;
(f) Use this license to create multiple logos for different clients — one license covers one logo for one brand.

4. TRADEMARK REGISTRATION
This license explicitly permits trademark registration of a logo created using the Font. HypeForType retains no claim over the trademark created by the Licensee.

5. OWNERSHIP
The Font remains the intellectual property of HypeForType at all times. The logo design created by the Licensee is owned by the Licensee.

6. GOVERNING LAW
This agreement is governed by the laws of England and Wales.

© 2026 HypeForType. All rights reserved.`,
  },
  enterprise: {
    title: 'Corporate Font License Agreement',
    body: `HYPEFORTYPE CORPORATE FONT LICENSE AGREEMENT

Last updated: 2026

1. GRANT OF LICENSE
HypeForType grants the corporate entity ("Licensee") a non-exclusive, non-transferable, perpetual license to use the Font across all internal departments, employees, and affiliated suppliers for the full scope of the entity's brand communications.

2. PERMITTED USES
The Corporate License covers all of the following use types within the single corporate entity:
(a) Desktop installation on all computers across all employees;
(b) Web embedding via @font-face on all owned and operated domains;
(c) Embedding in corporate apps, internal software, and eBooks;
(d) Use in video, broadcast, and streaming productions;
(e) Use as the basis for brand logos and trademarks;
(f) Use in digital advertising campaigns;
(g) Server-side document and image generation;
(h) Distribution of Font-embedded materials to affiliated suppliers, agencies, and service providers for the purpose of producing materials on behalf of the corporate entity.

3. RESTRICTIONS
You may NOT:
(a) Sublicense or resell the Font to any third party outside the corporate entity;
(b) Use the Font for OEM (Original Equipment Manufacturer) purposes — i.e. embedding the Font in hardware or software products sold to third parties;
(c) Allow affiliated suppliers to use the Font for projects other than those produced on behalf of the Licensee.

4. AFFILIATED SUPPLIERS
Agencies, design studios, print suppliers, and other service providers may use the Font solely for the purpose of producing materials on behalf of the Licensee. They may not use the Font for their own projects or other clients.

5. OWNERSHIP
The Font remains the intellectual property of HypeForType at all times.

6. PRICING
Corporate licenses are priced on application based on the size of the organisation and scope of use. Contact HypeForType to discuss pricing.

7. GOVERNING LAW
This agreement is governed by the laws of England and Wales.

© 2026 HypeForType. All rights reserved.`,
  },
  trial: {
    title: 'Trial Font License Agreement',
    body: `HYPEFORTYPE TRIAL FONT LICENSE AGREEMENT

Last updated: 2026

1. GRANT OF LICENSE
HypeForType grants you a non-exclusive, non-transferable, revocable license to use the trial version of the Font solely for the purpose of personal evaluation and internal design testing.

2. PERMITTED USES
You may use the Trial Font to:
(a) Evaluate the Font for potential purchase;
(b) Create internal design mockups and layout tests;
(c) Test the Font within your design software or workflow.

3. RESTRICTIONS
You may NOT:
(a) Use the Trial Font for any commercial purpose whatsoever;
(b) Use the Trial Font in client work, whether paid or unpaid;
(c) Publish, distribute, or display any work created using the Trial Font publicly;
(d) Use the Trial Font in websites, apps, video, or broadcast productions;
(e) Use the Trial Font as the basis for a logo or trademark;
(f) Resell or redistribute the Trial Font files to any third party;
(g) Attempt to reconstruct, reverse-engineer, or derive a full commercial font from the Trial Font.

4. LIMITATIONS
Trial fonts provided by HypeForType are limited versions and may exclude certain glyphs (including numerals 0–9) or contain watermarking. These limitations are intentional and may not be circumvented.

5. UPGRADE
To use the Font commercially, you must purchase the appropriate commercial license. Trial use does not grant any rights beyond those explicitly stated herein.

6. TERMINATION
HypeForType reserves the right to revoke this license at any time. Upon termination, all copies of the Trial Font must be deleted.

7. GOVERNING LAW
This agreement is governed by the laws of England and Wales.

© 2026 HypeForType. All rights reserved.`,
  },
};

export default function Licensing() {
  const [activeEula, setActiveEula] = useState(null);

  return (
    <>
      <Head>
        <title>Font Licensing — HypeForType</title>
        <meta name="description" content="HypeForType font licensing — Desktop, Webfont, App, Broadcast, Brand Font, Corporate, Trial. Perpetual one-time fee licenses." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          html{scroll-behavior:smooth}
          :root{--bg:#000;--bg2:#06060f;--blue:#1b1aff;--white:#e8e8ff;--t2:#7888c0;--t3:#4a5488;--t4:#282c52;--border:#0e0f28}
          html,body{background:var(--bg);color:var(--white);font-family:'Space Grotesk',sans-serif;-webkit-font-smoothing:antialiased}
          a{text-decoration:none;color:inherit}
          ::-webkit-scrollbar{width:3px}
          ::-webkit-scrollbar-track{background:var(--bg)}
          ::-webkit-scrollbar-thumb{background:var(--border)}

          .wrap{max-width:1100px;margin:0 auto;padding:calc(48px + 3rem) 2rem 6rem}

          .eyebrow{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--blue);margin-bottom:.8rem}
          .h1{font-size:clamp(2rem,5vw,4rem);font-weight:700;line-height:.95;color:var(--white);margin-bottom:1rem}
          .sub{font-size:17px;color:var(--t2);line-height:1.75;max-width:580px;margin-bottom:2.5rem}

          .sec{font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--t3);padding-bottom:.7rem;border-bottom:1px solid var(--border);margin-bottom:1.5rem;margin-top:3rem}

          .icons-row{display:grid;grid-template-columns:repeat(5,1fr);gap:1px;background:var(--border);border:1px solid var(--border);margin-bottom:3rem}
          @media(max-width:700px){.icons-row{grid-template-columns:repeat(3,1fr)}}
          .icon-cell{background:var(--bg2);padding:1.8rem 1.2rem;text-align:center;display:flex;flex-direction:column;align-items:center;gap:.5rem;transition:background .15s;cursor:pointer}
          .icon-cell:hover{background:#0a0b1f}
          .icon-label{font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--white)}
          .icon-price{font-family:'Space Mono',monospace;font-size:11px;color:var(--blue);letter-spacing:.04em}

          .table-wrap{overflow-x:auto;margin-bottom:0}
          table{width:100%;border-collapse:collapse;min-width:700px}
          thead th{font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:.9rem .8rem;text-align:center;border-bottom:1px solid var(--blue);color:var(--white);background:var(--bg2)}
          thead th:first-child{text-align:left;color:var(--t3);border-bottom-color:var(--border);padding-left:0;min-width:160px}
          tbody td{padding:.7rem .8rem;border-bottom:1px solid var(--border);text-align:center;font-size:16px}
          tbody td:first-child{text-align:left;font-size:14px;color:var(--t2);font-family:'Space Grotesk',sans-serif;padding-left:0}
          tbody tr:hover td{background:rgba(27,26,255,0.04)}
          .yes{color:var(--blue)}
          .no{color:var(--t4)}

          .details{display:flex;flex-direction:column;gap:0}
          .detail-row{display:grid;grid-template-columns:220px 1fr auto;gap:2.5rem;padding:2rem 0;border-bottom:1px solid var(--border);align-items:start}
          @media(max-width:700px){.detail-row{grid-template-columns:1fr}}
          .detail-head{display:flex;align-items:center;gap:.7rem}
          .detail-label{font-family:'Space Mono',monospace;font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--white)}
          .detail-points{list-style:none;display:flex;flex-direction:column;gap:.4rem}
          .detail-point{font-size:14px;color:var(--t2);line-height:1.7;padding-left:1.2rem;position:relative;margin-bottom:.2rem}
          .detail-point::before{content:'→';position:absolute;left:0;color:var(--blue)}
          .eula-btn{font-family:'Space Mono',monospace;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--blue);background:transparent;border:1px solid var(--blue);padding:10px 16px;cursor:pointer;white-space:nowrap;transition:all .15s;align-self:flex-start;margin-top:.2rem}
          .eula-btn:hover{background:var(--blue);color:#fff}

          .cta-box{border:1px solid var(--border);padding:2rem;display:flex;justify-content:space-between;align-items:center;gap:2rem;flex-wrap:wrap;margin-top:3rem}
          .cta-title{font-size:20px;font-weight:700;margin-bottom:.4rem}
          .cta-sub{font-size:15px;color:var(--t2)}
          .cta-btn{font-family:'Space Mono',monospace;font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#fff;background:var(--blue);padding:12px 24px;border:none;cursor:pointer;white-space:nowrap;box-shadow:0 0 20px rgba(27,26,255,0.3);transition:opacity .15s;display:inline-block}
          .cta-btn:hover{opacity:.85}

          /* EULA Modal */
          .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:500;display:flex;align-items:center;justify-content:center;padding:2rem}
          .modal{background:var(--bg2);border:1px solid var(--border);max-width:740px;width:100%;max-height:80vh;display:flex;flex-direction:column}
          .modal-head{display:flex;justify-content:space-between;align-items:center;padding:1.4rem 2rem;border-bottom:1px solid var(--border);flex-shrink:0}
          .modal-title{font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--white)}
          .modal-close{font-family:'Space Mono',monospace;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;background:transparent;border:1px solid var(--border);color:var(--t3);padding:8px 14px;cursor:pointer;transition:all .15s}
          .modal-close:hover{border-color:var(--white);color:var(--white)}
          .modal-body{padding:2rem;overflow-y:auto;font-size:13px;color:var(--t2);line-height:1.8;white-space:pre-wrap;font-family:'Space Grotesk',sans-serif}

          .ft{border-top:1px solid var(--border);display:grid;grid-template-columns:1fr auto 1fr;margin-top:6rem;background:var(--bg2)}
          .ft-copy{font-size:11px;color:rgba(255,255,255,0.15);letter-spacing:.06em;text-transform:uppercase;padding:1.4rem 1.8rem;font-family:'Space Grotesk',sans-serif}
          .ft-links{border-left:1px solid var(--border);border-right:1px solid var(--border);display:flex;gap:2rem;align-items:center;padding:1.4rem 2rem}
          .ft-link{font-size:11px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,0.18);transition:color .2s;font-family:'Space Grotesk',sans-serif}
          .ft-link:hover{color:var(--white)}
          .ft-loc{font-size:11px;color:rgba(255,255,255,0.15);letter-spacing:.06em;text-transform:uppercase;padding:1.4rem 1.8rem;text-align:right;font-family:'Space Grotesk',sans-serif}
        `}</style>
      </Head>

      <Nav />

      <div className="wrap">
        <div className="eyebrow">HypeForType — Licensing</div>
        <h1 className="h1">What license<br/>do you need?</h1>
        <p className="sub">All licenses are perpetual, one-time fee. No subscriptions. No renewals. Buy once, own forever. Click a license type to jump to its details.</p>

        {/* Icon row */}
        <div className="icons-row">
          {LICENSES.map(l => (
            <a key={l.key} className="icon-cell" href={`#license-${l.key}`} style={{textDecoration:'none'}}>
              <img src={l.icon} alt={l.label} style={{width:'32px',height:'32px',filter:'invert(1) sepia(1) saturate(5) hue-rotate(200deg)',opacity:0.85}} />
              <span className="icon-label">{l.label}</span>
              <span className="icon-price">{l.price}</span>
            </a>
          ))}
        </div>

        {/* Comparison table */}
        <div className="sec">License comparison</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th></th>
                {LICENSES.map(l => <th key={l.key}>{l.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((row, i) => (
                <tr key={i}>
                  <td>{row.label}</td>
                  {row.values.map((v, j) => (
                    <td key={j}>{v ? <span className="yes">✓</span> : <span className="no">✕</span>}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* License details */}
        <div className="sec">Licensing details</div>
        <div className="details">
          {DETAILS.map(d => (
            <div key={d.key} id={`license-${d.key}`} className="detail-row" style={{scrollMarginTop:'120px'}}>
              <div className="detail-head">
                <img src={d.icon} alt={d.label} style={{width:'24px',height:'24px',filter:'invert(1) sepia(1) saturate(5) hue-rotate(200deg)',opacity:0.85,flexShrink:0}} />
                <span className="detail-label">{d.label}</span>
              </div>
              <ul className="detail-points">
                {d.points.map((p, i) => (
                  <li key={i} className="detail-point">{p}</li>
                ))}
              </ul>
              <button className="eula-btn" onClick={() => setActiveEula(d.eulaKey)}>
                View {d.label} EULA
              </button>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="cta-box">
          <div>
            <div className="cta-title">Need a custom license?</div>
            <div className="cta-sub">Enterprise, group, or bespoke arrangements — we'll sort it out.</div>
          </div>
          <Link href="/contact" className="cta-btn">Get in touch →</Link>
        </div>
      </div>

      {/* EULA Modal */}
      {activeEula && EULAS[activeEula] && (
        <div className="modal-overlay" onClick={() => setActiveEula(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <span className="modal-title">{EULAS[activeEula].title}</span>
              <button className="modal-close" onClick={() => setActiveEula(null)}>✕ Close</button>
            </div>
            <div className="modal-body">{EULAS[activeEula].body}</div>
          </div>
        </div>
      )}

      <footer className="ft">
        <span className="ft-copy">© 2026 HypeForType</span>
        <div className="ft-links">
          {['Licensing','FAQ','Privacy','Contact'].map(t => (
            <Link key={t} href={'/'+t.toLowerCase()} className="ft-link">{t}</Link>
          ))}
        </div>
        <span className="ft-loc">London · Online</span>
      </footer>
    </>
  );
}
