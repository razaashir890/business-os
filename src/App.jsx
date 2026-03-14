<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Omnibrand — Universal Brand OS</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --gold:#B47B2B;
  --gold-l:#D4A044;
  --gold-d:#8A5E1E;
  --gold-pale:#B47B2B18;
  --bg:#080807;
  --s1:#0E0D0B;
  --s2:#141310;
  --s3:#1C1A16;
  --border:#2A2820;
  --border-l:#3A3630;
  --text:#EDE9E0;
  --text-m:#888878;
  --text-d:#4A4840;
}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;font-weight:300;overflow-x:hidden;cursor:none}

/* Custom cursor */
#cursor{position:fixed;width:8px;height:8px;background:var(--gold);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:transform 0.1s}
#cursor-ring{position:fixed;width:32px;height:32px;border:0.5px solid var(--gold);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:all 0.18s ease;opacity:0.5}

/* Scrollbar */
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:var(--s1)}
::-webkit-scrollbar-thumb{background:var(--gold-d);border-radius:2px}

/* Noise overlay */
body::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");opacity:0.018;pointer-events:none;z-index:1;mix-blend-mode:overlay}

/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:500;padding:1.5rem 4rem;display:flex;align-items:center;justify-content:space-between;transition:all 0.4s}
nav.scrolled{background:rgba(8,8,7,0.92);backdrop-filter:blur(12px);border-bottom:0.5px solid var(--border);padding:1rem 4rem}
.nav-logo{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:300;letter-spacing:0.22em;color:var(--gold);text-decoration:none}
.nav-links{display:flex;gap:2.5rem;list-style:none}
.nav-links a{color:var(--text-m);text-decoration:none;font-size:13px;letter-spacing:0.08em;transition:color 0.2s}
.nav-links a:hover{color:var(--gold)}
.nav-cta{padding:9px 22px;border:0.5px solid var(--gold);color:var(--gold);font-size:12px;letter-spacing:0.12em;text-decoration:none;transition:all 0.25s;font-family:'DM Sans',sans-serif}
.nav-cta:hover{background:var(--gold);color:var(--bg)}

/* HERO */
.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;position:relative;overflow:hidden;padding:8rem 2rem 4rem}

/* Geometric bg lines */
.hero-geo{position:absolute;inset:0;overflow:hidden;z-index:0}
.geo-ring{position:absolute;border-radius:50%;border:0.5px solid var(--gold);opacity:0;animation:ringIn 2s forwards}
.geo-ring:nth-child(1){width:600px;height:600px;top:50%;left:50%;transform:translate(-50%,-50%);animation-delay:0.2s}
.geo-ring:nth-child(2){width:900px;height:900px;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0;animation-delay:0.5s}
.geo-ring:nth-child(3){width:1200px;height:1200px;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0;animation-delay:0.8s}
.geo-line-h{position:absolute;top:50%;left:0;right:0;height:0.5px;background:var(--gold);opacity:0.06}
.geo-line-v{position:absolute;left:50%;top:0;bottom:0;width:0.5px;background:var(--gold);opacity:0.06}
@keyframes ringIn{to{opacity:0.08}}

.hero-content{position:relative;z-index:2;max-width:860px}
.hero-eyebrow{font-size:11px;letter-spacing:0.45em;color:var(--gold);margin-bottom:2rem;opacity:0;animation:fadeUp 0.8s 0.3s forwards}
.hero-title{font-family:'Cormorant Garamond',serif;font-size:clamp(52px,8vw,96px);font-weight:300;line-height:1.05;letter-spacing:0.02em;margin-bottom:2rem;opacity:0;animation:fadeUp 0.8s 0.5s forwards}
.hero-title em{font-style:italic;color:var(--gold)}
.hero-sub{font-size:16px;color:var(--text-m);line-height:1.8;max-width:520px;margin:0 auto 3rem;font-weight:300;opacity:0;animation:fadeUp 0.8s 0.7s forwards}
.hero-btns{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;opacity:0;animation:fadeUp 0.8s 0.9s forwards}
.btn-primary{padding:14px 36px;background:var(--gold);color:var(--bg);font-size:13px;letter-spacing:0.12em;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.25s}
.btn-primary:hover{background:var(--gold-l);transform:translateY(-1px)}
.btn-outline{padding:14px 36px;border:0.5px solid var(--border-l);color:var(--text-m);font-size:13px;letter-spacing:0.1em;background:none;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.25s;text-decoration:none;display:inline-flex;align-items:center}
.btn-outline:hover{border-color:var(--gold);color:var(--gold)}

.hero-stat-row{display:flex;gap:4rem;justify-content:center;margin-top:6rem;padding-top:3rem;border-top:0.5px solid var(--border);opacity:0;animation:fadeUp 0.8s 1.1s forwards;flex-wrap:wrap;gap:3rem}
.hero-stat-num{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:300;color:var(--gold);letter-spacing:0.04em;display:block}
.hero-stat-label{font-size:11px;letter-spacing:0.2em;color:var(--text-d);display:block;margin-top:4px}

@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}

/* SECTION BASE */
section{position:relative;z-index:2}
.section-inner{max-width:1100px;margin:0 auto;padding:7rem 2rem}
.section-label{font-size:10px;letter-spacing:0.5em;color:var(--gold);margin-bottom:1rem;display:block}
.section-title{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,5vw,56px);font-weight:300;line-height:1.1;margin-bottom:1.5rem}
.section-sub{font-size:15px;color:var(--text-m);line-height:1.8;max-width:540px;font-weight:300}

/* BRANDS TICKER */
.ticker-wrap{background:var(--s1);border-top:0.5px solid var(--border);border-bottom:0.5px solid var(--border);padding:1.2rem 0;overflow:hidden;position:relative;z-index:2}
.ticker-track{display:flex;gap:0;animation:ticker 28s linear infinite;width:max-content}
.ticker-item{padding:0 3rem;font-size:11px;letter-spacing:0.35em;color:var(--text-d);white-space:nowrap;border-right:0.5px solid var(--border)}
.ticker-item span{color:var(--gold);margin-right:0.5rem}
@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* HOW IT WORKS */
.how-bg{background:var(--s1)}
.steps-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:0;margin-top:4rem;border:0.5px solid var(--border)}
.step-card{padding:2.5rem;border-right:0.5px solid var(--border);border-bottom:0.5px solid var(--border);transition:background 0.3s;position:relative;overflow:hidden}
.step-card:hover{background:var(--s2)}
.step-card::before{content:'';position:absolute;bottom:0;left:0;height:2px;width:0;background:var(--gold);transition:width 0.4s}
.step-card:hover::before{width:100%}
.step-num{font-family:'Cormorant Garamond',serif;font-size:48px;font-weight:300;color:var(--gold);opacity:0.2;line-height:1;margin-bottom:1rem}
.step-title{font-size:16px;font-weight:500;margin-bottom:0.75rem;letter-spacing:0.04em}
.step-desc{font-size:13px;color:var(--text-m);line-height:1.7;font-weight:300}

/* FEATURES */
.features-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-top:4rem}
.feature-card{background:var(--s2);border:0.5px solid var(--border);padding:2rem;transition:all 0.3s;position:relative;overflow:hidden}
.feature-card:hover{border-color:var(--gold-d);background:var(--s3)}
.feature-card.featured{border-color:var(--gold-d);background:var(--gold-pale)}
.feature-icon{width:40px;height:40px;border:0.5px solid var(--border-l);display:flex;align-items:center;justify-content:center;margin-bottom:1.25rem;color:var(--gold)}
.feature-title{font-size:16px;font-weight:500;margin-bottom:0.75rem;letter-spacing:0.03em}
.feature-desc{font-size:13px;color:var(--text-m);line-height:1.7;font-weight:300}
.feature-tag{position:absolute;top:1.25rem;right:1.25rem;font-size:9px;letter-spacing:0.25em;color:var(--gold);border:0.5px solid var(--gold-d);padding:3px 8px}

/* BRAND TYPES */
.brand-types-bg{background:var(--s1)}
.types-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1px;margin-top:4rem;background:var(--border)}
.type-card{background:var(--s1);padding:2rem 1.5rem;text-align:center;transition:all 0.3s;cursor:default}
.type-card:hover{background:var(--s2)}
.type-icon{font-size:28px;display:block;margin-bottom:1rem;filter:grayscale(0.3)}
.type-name{font-size:13px;font-weight:500;letter-spacing:0.08em;margin-bottom:0.4rem}
.type-ex{font-size:11px;color:var(--text-d);letter-spacing:0.04em}

/* MODULES SHOWCASE */
.modules-list{margin-top:4rem;display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem}
.module-item{display:flex;align-items:center;gap:12px;padding:1rem 1.25rem;border:0.5px solid var(--border);transition:all 0.25s}
.module-item:hover{border-color:var(--gold-d);background:var(--gold-pale)}
.module-dot{width:6px;height:6px;background:var(--gold);border-radius:50%;flex-shrink:0}
.module-name{font-size:13px;letter-spacing:0.05em;font-weight:400}
.module-sub{font-size:11px;color:var(--text-d);margin-top:1px}

/* PRICING */
.pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-top:4rem}
.price-card{border:0.5px solid var(--border);padding:2.5rem;position:relative;transition:all 0.3s}
.price-card:hover{border-color:var(--gold-d)}
.price-card.popular{border-color:var(--gold);background:var(--gold-pale)}
.popular-badge{position:absolute;top:-1px;left:50%;transform:translateX(-50%);background:var(--gold);color:var(--bg);font-size:9px;letter-spacing:0.25em;padding:4px 16px;font-family:'DM Sans',sans-serif}
.price-plan{font-size:11px;letter-spacing:0.3em;color:var(--text-m);margin-bottom:1.5rem}
.price-amount{font-family:'Cormorant Garamond',serif;font-size:52px;font-weight:300;line-height:1;margin-bottom:0.25rem}
.price-amount sup{font-size:18px;vertical-align:super}
.price-period{font-size:12px;color:var(--text-d);margin-bottom:2rem}
.price-features{list-style:none;margin-bottom:2rem;display:flex;flex-direction:column;gap:10px}
.price-features li{font-size:13px;color:var(--text-m);padding-left:1.25rem;position:relative;font-weight:300}
.price-features li::before{content:'';position:absolute;left:0;top:7px;width:5px;height:1px;background:var(--gold);opacity:0.6}
.btn-plan{width:100%;padding:12px;border:0.5px solid var(--border-l);background:transparent;color:var(--text-m);font-size:12px;letter-spacing:0.15em;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.25s}
.btn-plan:hover,.price-card.popular .btn-plan{background:var(--gold);border-color:var(--gold);color:var(--bg)}

/* TESTIMONIALS */
.testimonials-bg{background:var(--s1)}
.testimonials-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem;margin-top:4rem}
.testimonial-card{border:0.5px solid var(--border);padding:2rem;transition:all 0.3s}
.testimonial-card:hover{border-color:var(--gold-d)}
.t-quote{font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:300;font-style:italic;line-height:1.7;color:var(--text);margin-bottom:1.5rem}
.t-author{display:flex;align-items:center;gap:12px}
.t-avatar{width:36px;height:36px;border-radius:50%;background:var(--gold-pale);border:0.5px solid var(--gold-d);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:500;color:var(--gold)}
.t-name{font-size:13px;font-weight:500}
.t-role{font-size:11px;color:var(--text-d);letter-spacing:0.05em}
.t-stars{color:var(--gold);font-size:11px;margin-bottom:1rem;letter-spacing:0.1em}

/* FAQ */
.faq-list{margin-top:4rem;max-width:720px}
.faq-item{border-bottom:0.5px solid var(--border);overflow:hidden}
.faq-q{width:100%;background:none;border:none;color:var(--text);padding:1.5rem 0;text-align:left;font-size:15px;font-family:'DM Sans',sans-serif;font-weight:400;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:color 0.2s;letter-spacing:0.02em}
.faq-q:hover{color:var(--gold)}
.faq-icon{font-size:18px;color:var(--gold);transition:transform 0.3s;flex-shrink:0}
.faq-a{font-size:13px;color:var(--text-m);line-height:1.8;padding:0 0 1.5rem;font-weight:300;display:none}
.faq-item.open .faq-a{display:block}
.faq-item.open .faq-icon{transform:rotate(45deg)}

/* CTA SECTION */
.cta-section{text-align:center;padding:8rem 2rem;position:relative;overflow:hidden}
.cta-bg-ring{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border-radius:50%;border:0.5px solid var(--gold);opacity:0.06}
.cta-title{font-family:'Cormorant Garamond',serif;font-size:clamp(40px,6vw,72px);font-weight:300;margin-bottom:1.5rem;line-height:1.1}
.cta-sub{font-size:15px;color:var(--text-m);margin-bottom:3rem;font-weight:300;line-height:1.7}
.cta-form{display:flex;gap:0;max-width:440px;margin:0 auto 1.5rem;border:0.5px solid var(--border-l)}
.cta-input{flex:1;background:transparent;border:none;padding:14px 18px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:13px;outline:none}
.cta-input::placeholder{color:var(--text-d)}
.cta-btn{padding:14px 24px;background:var(--gold);border:none;color:var(--bg);font-size:12px;letter-spacing:0.12em;cursor:pointer;font-family:'DM Sans',sans-serif;white-space:nowrap;transition:background 0.2s}
.cta-btn:hover{background:var(--gold-l)}
.cta-note{font-size:11px;color:var(--text-d);letter-spacing:0.08em}

/* FOOTER */
footer{background:var(--s1);border-top:0.5px solid var(--border);padding:4rem 2rem 2rem}
.footer-inner{max-width:1100px;margin:0 auto}
.footer-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:3rem;margin-bottom:3rem}
.footer-brand{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:300;letter-spacing:0.2em;color:var(--gold);margin-bottom:1rem}
.footer-tagline{font-size:13px;color:var(--text-d);line-height:1.7;font-weight:300;max-width:240px}
.footer-col-title{font-size:10px;letter-spacing:0.4em;color:var(--gold);margin-bottom:1rem}
.footer-links{list-style:none;display:flex;flex-direction:column;gap:8px}
.footer-links a{font-size:13px;color:var(--text-m);text-decoration:none;transition:color 0.2s;font-weight:300}
.footer-links a:hover{color:var(--gold)}
.footer-bottom{display:flex;justify-content:space-between;align-items:center;padding-top:2rem;border-top:0.5px solid var(--border);flex-wrap:wrap;gap:1rem}
.footer-copy{font-size:11px;color:var(--text-d);letter-spacing:0.08em}

/* Divider ornament */
.ornament{display:flex;align-items:center;gap:1rem;margin:0 auto 3rem;max-width:200px}
.ornament-line{flex:1;height:0.5px;background:var(--border-l)}
.ornament-diamond{width:6px;height:6px;background:var(--gold);transform:rotate(45deg);flex-shrink:0}

/* Scroll reveal */
.reveal{opacity:0;transform:translateY(32px);transition:opacity 0.7s,transform 0.7s}
.reveal.visible{opacity:1;transform:translateY(0)}

/* Responsive */
@media(max-width:768px){
  nav{padding:1rem 1.5rem}
  nav.scrolled{padding:0.75rem 1.5rem}
  .nav-links,.nav-cta{display:none}
  .features-grid{grid-template-columns:1fr}
  .pricing-grid{grid-template-columns:1fr}
  .footer-top{grid-template-columns:1fr 1fr}
  .modules-list{grid-template-columns:1fr 1fr}
  .hero-stat-row{gap:2rem}
}
@media(max-width:480px){
  .modules-list{grid-template-columns:1fr}
  .footer-top{grid-template-columns:1fr}
  .steps-grid{grid-template-columns:1fr}
}
</style>
</head>
<body>

<div id="cursor"></div>
<div id="cursor-ring"></div>

<!-- NAV -->
<nav id="nav">
  <a href="#" class="nav-logo">OMNIBRAND</a>
  <ul class="nav-links">
    <li><a href="#how">How It Works</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#pricing">Pricing</a></li>
    <li><a href="#faq">FAQ</a></li>
  </ul>
  <a href="#cta" class="nav-cta">GET STARTED</a>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-geo">
    <div class="geo-ring"></div>
    <div class="geo-ring"></div>
    <div class="geo-ring"></div>
    <div class="geo-line-h"></div>
    <div class="geo-line-v"></div>
  </div>
  <div class="hero-content">
    <p class="hero-eyebrow">UNIVERSAL BRAND OS &nbsp;·&nbsp; EVERY BRAND. ONE SYSTEM.</p>
    <h1 class="hero-title">
      Your brand,<br/><em>fully managed.</em><br/>One platform.
    </h1>
    <p class="hero-sub">
      Omnibrand is the all-in-one operating system for modern businesses. Set up your brand in minutes, manage your team, inventory, sales, AI tools, and loyalty — from one powerful dashboard.
    </p>
    <div class="hero-btns">
      <a href="#cta" class="btn-primary">START FOR FREE</a>
      <a href="#how" class="btn-outline">SEE HOW IT WORKS →</a>
    </div>
    <div class="hero-stat-row">
      <div>
        <span class="hero-stat-num">500+</span>
        <span class="hero-stat-label">BRANDS ONBOARDED</span>
      </div>
      <div>
        <span class="hero-stat-num">12+</span>
        <span class="hero-stat-label">BUSINESS MODULES</span>
      </div>
      <div>
        <span class="hero-stat-num">8</span>
        <span class="hero-stat-label">INDUSTRY CATEGORIES</span>
      </div>
      <div>
        <span class="hero-stat-num">99.9%</span>
        <span class="hero-stat-label">UPTIME GUARANTEED</span>
      </div>
    </div>
  </div>
</section>

<!-- TICKER -->
<div class="ticker-wrap">
  <div class="ticker-track" id="ticker">
    <span class="ticker-item"><span>✦</span> FASHION &amp; APPAREL</span>
    <span class="ticker-item"><span>✦</span> FRAGRANCE &amp; LUXURY</span>
    <span class="ticker-item"><span>✦</span> FOOD &amp; RESTAURANT</span>
    <span class="ticker-item"><span>✦</span> SALON &amp; BEAUTY</span>
    <span class="ticker-item"><span>✦</span> RETAIL &amp; E-COMMERCE</span>
    <span class="ticker-item"><span>✦</span> TECH &amp; SAAS</span>
    <span class="ticker-item"><span>✦</span> HEALTHCARE</span>
    <span class="ticker-item"><span>✦</span> ELECTRONICS</span>
    <span class="ticker-item"><span>✦</span> FASHION &amp; APPAREL</span>
    <span class="ticker-item"><span>✦</span> FRAGRANCE &amp; LUXURY</span>
    <span class="ticker-item"><span>✦</span> FOOD &amp; RESTAURANT</span>
    <span class="ticker-item"><span>✦</span> SALON &amp; BEAUTY</span>
    <span class="ticker-item"><span>✦</span> RETAIL &amp; E-COMMERCE</span>
    <span class="ticker-item"><span>✦</span> TECH &amp; SAAS</span>
    <span class="ticker-item"><span>✦</span> HEALTHCARE</span>
    <span class="ticker-item"><span>✦</span> ELECTRONICS</span>
  </div>
</div>

<!-- HOW IT WORKS -->
<section class="how-bg" id="how">
  <div class="section-inner">
    <div class="reveal">
      <span class="section-label">HOW IT WORKS</span>
      <h2 class="section-title">Up and running<br/><em>in four steps.</em></h2>
      <p class="section-sub">No technical knowledge needed. No developers required. Set up your entire Brand OS in under 10 minutes.</p>
    </div>
    <div class="steps-grid reveal">
      <div class="step-card">
        <div class="step-num">01</div>
        <div class="step-title">Choose Your Category</div>
        <div class="step-desc">Select your business type from 8 industry categories. Omnibrand auto-configures the perfect setup for your brand.</div>
      </div>
      <div class="step-card">
        <div class="step-num">02</div>
        <div class="step-title">Set Your Identity</div>
        <div class="step-desc">Enter your brand name, tagline, color theme, and location. Your OS instantly reflects your brand's visual identity.</div>
      </div>
      <div class="step-card">
        <div class="step-num">03</div>
        <div class="step-title">Configure Modules</div>
        <div class="step-desc">Select the modules and AI tools your brand needs. Enable orders, inventory, loyalty, WhatsApp, analytics and more.</div>
      </div>
      <div class="step-card">
        <div class="step-num">04</div>
        <div class="step-title">Invite Your Team</div>
        <div class="step-desc">Assign roles to your team members. Each role gets exactly the access they need — nothing more, nothing less.</div>
      </div>
    </div>
  </div>
</section>

<!-- BRAND TYPES -->
<section class="brand-types-bg">
  <div class="section-inner">
    <div class="reveal" style="text-align:center;max-width:600px;margin:0 auto 0">
      <span class="section-label">FOR EVERY BUSINESS</span>
      <h2 class="section-title">Built for<br/><em>any industry.</em></h2>
    </div>
    <div class="types-grid reveal">
      <div class="type-card">
        <span class="type-icon">🌸</span>
        <div class="type-name">FRAGRANCE</div>
        <div class="type-ex">Luxury · Perfume</div>
      </div>
      <div class="type-card">
        <span class="type-icon">👗</span>
        <div class="type-name">FASHION</div>
        <div class="type-ex">Clothing · Apparel</div>
      </div>
      <div class="type-card">
        <span class="type-icon">🍕</span>
        <div class="type-name">FOOD</div>
        <div class="type-ex">Restaurant · Cafe</div>
      </div>
      <div class="type-card">
        <span class="type-icon">💅</span>
        <div class="type-name">BEAUTY</div>
        <div class="type-ex">Salon · Spa</div>
      </div>
      <div class="type-card">
        <span class="type-icon">🛍️</span>
        <div class="type-name">RETAIL</div>
        <div class="type-ex">Store · E-commerce</div>
      </div>
      <div class="type-card">
        <span class="type-icon">📱</span>
        <div class="type-name">TECH</div>
        <div class="type-ex">SaaS · Apps</div>
      </div>
      <div class="type-card">
        <span class="type-icon">🔌</span>
        <div class="type-name">ELECTRONICS</div>
        <div class="type-ex">Devices · Gadgets</div>
      </div>
      <div class="type-card">
        <span class="type-icon">🏥</span>
        <div class="type-name">HEALTHCARE</div>
        <div class="type-ex">Clinic · Pharmacy</div>
      </div>
    </div>
  </div>
</section>

<!-- FEATURES -->
<section id="features">
  <div class="section-inner">
    <div class="reveal">
      <span class="section-label">FEATURES</span>
      <h2 class="section-title">Everything your<br/><em>brand needs.</em></h2>
      <p class="section-sub">12 powerful modules, each built for real business operations. Not just software — a complete operating system.</p>
    </div>
    <div class="features-grid reveal">
      <div class="feature-card featured">
        <div class="feature-tag">AI POWERED</div>
        <div class="feature-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 3a7 7 0 110 14A7 7 0 0112 5zm0 2a5 5 0 100 10A5 5 0 0012 7z"/></svg>
        </div>
        <div class="feature-title">AI Business Suite</div>
        <div class="feature-desc">Three specialized AI assistants — Marketing AI for content & campaigns, Sales AI for scripts & objection handling, and Strategy AI for business decisions. All powered by Claude.</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/></svg>
        </div>
        <div class="feature-title">Order Management</div>
        <div class="feature-desc">Complete order lifecycle from placement to delivery. 5-stage pipeline, multi-channel tracking, WhatsApp notifications, and real-time status updates.</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.4L12 1 3.5 3.4v8.1c0 5.2 3.7 10.1 8.5 11.5 4.8-1.4 8.5-6.3 8.5-11.5V3.4z"/></svg>
        </div>
        <div class="feature-title">Inventory & Stock</div>
        <div class="feature-desc">Live stock tracking, low stock alerts, product profiles with margin calculations, category management, and auto-reorder notifications.</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </div>
        <div class="feature-title">Loyalty Program</div>
        <div class="feature-desc">4-tier loyalty system (Bronze → Silver → Gold → Platinum) with automated points tracking, tier progression, and personalized perks per tier.</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/></svg>
        </div>
        <div class="feature-title">Analytics Dashboard</div>
        <div class="feature-desc">Revenue tracking, category breakdowns, monthly trends, top product reports, and net profit calculations — all in real time.</div>
      </div>
      <div class="feature-card">
        <div class="feature-tag">POPULAR</div>
        <div class="feature-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>
        </div>
        <div class="feature-title">WhatsApp Integration</div>
        <div class="feature-desc">Pre-built message templates for order confirmations, dispatch alerts, loyalty updates, and payment reminders. One-click send to customers and team.</div>
      </div>
    </div>
  </div>
</section>

<!-- MODULES -->
<section style="background:var(--s1)">
  <div class="section-inner">
    <div class="reveal" style="text-align:center;max-width:600px;margin:0 auto 0">
      <span class="section-label">ALL MODULES</span>
      <h2 class="section-title">12 modules.<br/><em>One dashboard.</em></h2>
    </div>
    <div class="modules-list reveal">
      <div class="module-item"><div class="module-dot"></div><div><div class="module-name">Dashboard</div><div class="module-sub">Live KPIs & overview</div></div></div>
      <div class="module-item"><div class="module-dot"></div><div><div class="module-name">Order Management</div><div class="module-sub">End-to-end order lifecycle</div></div></div>
      <div class="module-item"><div class="module-dot"></div><div><div class="module-name">Inventory & Stock</div><div class="module-sub">Real-time stock control</div></div></div>
      <div class="module-item"><div class="module-dot"></div><div><div class="module-name">E-Commerce Hub</div><div class="module-sub">Listings, promos & SEO</div></div></div>
      <div class="module-item"><div class="module-dot"></div><div><div class="module-name">Dispatch & Delivery</div><div class="module-sub">Logistics tracking</div></div></div>
      <div class="module-item"><div class="module-dot"></div><div><div class="module-name">Loyalty Program</div><div class="module-sub">4-tier rewards system</div></div></div>
      <div class="module-item"><div class="module-dot"></div><div><div class="module-name">Analytics & Reports</div><div class="module-sub">Revenue & profit insights</div></div></div>
      <div class="module-item"><div class="module-dot"></div><div><div class="module-name">Marketing AI</div><div class="module-sub">Content & campaign AI</div></div></div>
      <div class="module-item"><div class="module-dot"></div><div><div class="module-name">Sales AI</div><div class="module-sub">Scripts & objection AI</div></div></div>
      <div class="module-item"><div class="module-dot"></div><div><div class="module-name">Strategy AI</div><div class="module-sub">CEO-level business AI</div></div></div>
      <div class="module-item"><div class="module-dot"></div><div><div class="module-name">Team & HR</div><div class="module-sub">Staff & payroll mgmt</div></div></div>
      <div class="module-item"><div class="module-dot"></div><div><div class="module-name">WhatsApp Business</div><div class="module-sub">Automated messaging</div></div></div>
    </div>
  </div>
</section>

<!-- PRICING -->
<section id="pricing">
  <div class="section-inner">
    <div class="reveal" style="text-align:center;max-width:560px;margin:0 auto 0">
      <span class="section-label">PRICING</span>
      <h2 class="section-title">Simple,<br/><em>transparent pricing.</em></h2>
      <p class="section-sub" style="margin:0 auto">Choose the plan that fits your brand. Upgrade or downgrade anytime.</p>
    </div>
    <div class="pricing-grid reveal">
      <div class="price-card">
        <div class="price-plan">STARTER</div>
        <div class="price-amount"><sup>PKR</sup>4,999</div>
        <div class="price-period">per month</div>
        <ul class="price-features">
          <li>1 Brand Setup</li>
          <li>5 Team Members</li>
          <li>6 Core Modules</li>
          <li>Basic Analytics</li>
          <li>WhatsApp Integration</li>
          <li>Email Support</li>
        </ul>
        <button class="btn-plan">GET STARTED</button>
      </div>
      <div class="price-card popular">
        <div class="popular-badge">MOST POPULAR</div>
        <div class="price-plan">GROWTH</div>
        <div class="price-amount"><sup>PKR</sup>9,999</div>
        <div class="price-period">per month</div>
        <ul class="price-features">
          <li>1 Brand Setup</li>
          <li>15 Team Members</li>
          <li>All 12 Modules</li>
          <li>AI Business Suite</li>
          <li>Advanced Analytics</li>
          <li>Loyalty Program</li>
          <li>Priority Support</li>
        </ul>
        <button class="btn-plan">GET STARTED</button>
      </div>
      <div class="price-card">
        <div class="price-plan">ENTERPRISE</div>
        <div class="price-amount">Custom</div>
        <div class="price-period">contact for pricing</div>
        <ul class="price-features">
          <li>Multiple Brands</li>
          <li>Unlimited Team</li>
          <li>All Modules + Custom</li>
          <li>Dedicated AI Models</li>
          <li>White-label Option</li>
          <li>Dedicated Manager</li>
          <li>SLA Guarantee</li>
        </ul>
        <button class="btn-plan">CONTACT SALES</button>
      </div>
    </div>
  </div>
</section>

<!-- TESTIMONIALS -->
<section class="testimonials-bg">
  <div class="section-inner">
    <div class="reveal" style="text-align:center;max-width:560px;margin:0 auto 0">
      <span class="section-label">TESTIMONIALS</span>
      <h2 class="section-title">Brands that<br/><em>trust Omnibrand.</em></h2>
    </div>
    <div class="testimonials-grid reveal">
      <div class="testimonial-card">
        <div class="t-stars">★ ★ ★ ★ ★</div>
        <div class="t-quote">"Omnibrand ne hamare puri operations ko transform kar diya. Pehle 5 alag tools use karte the, ab sab ek jagah hai."</div>
        <div class="t-author">
          <div class="t-avatar">AK</div>
          <div><div class="t-name">Asim Khan</div><div class="t-role">FOUNDER · LUXE FRAGRANCE CO.</div></div>
        </div>
      </div>
      <div class="testimonial-card">
        <div class="t-stars">★ ★ ★ ★ ★</div>
        <div class="t-quote">"The AI modules alone are worth it. Our sales team uses the Sales AI every single day for customer pitches and objection handling."</div>
        <div class="t-author">
          <div class="t-avatar">SR</div>
          <div><div class="t-name">Sara Rehman</div><div class="t-role">CEO · NOVA FASHION HOUSE</div></div>
        </div>
      </div>
      <div class="testimonial-card">
        <div class="t-stars">★ ★ ★ ★ ★</div>
        <div class="t-quote">"Setup wizard se 10 minute mein poora system configure ho gaya. Mujhe koi developer hire nahi karna para. Absolutely brilliant."</div>
        <div class="t-author">
          <div class="t-avatar">MH</div>
          <div><div class="t-name">Muhammad Hassan</div><div class="t-role">OWNER · METRO ELECTRONICS</div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section id="faq">
  <div class="section-inner">
    <div class="reveal">
      <span class="section-label">FAQ</span>
      <h2 class="section-title">Common<br/><em>questions.</em></h2>
    </div>
    <div class="faq-list reveal">
      <div class="faq-item">
        <button class="faq-q" onclick="toggleFaq(this)">Kya Omnibrand kisi bhi business ke liye kaam karta hai? <span class="faq-icon">+</span></button>
        <div class="faq-a">Haan — Omnibrand 8 different industry categories support karta hai: Fragrance, Fashion, Food, Beauty, Retail, Tech, Electronics, aur Healthcare. Setup wizard aapki brand type ke mutabiq automatically system configure kar deta hai.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q" onclick="toggleFaq(this)">Kya technical knowledge ki zaroorat hai? <span class="faq-icon">+</span></button>
        <div class="faq-a">Bilkul nahi. Omnibrand completely no-code hai. Setup wizard mein apna brand configure karein aur 10 minutes mein poora system ready ho jata hai. Koi developer ya technical background ki zaroorat nahi.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q" onclick="toggleFaq(this)">AI modules kaise kaam karte hain? <span class="faq-icon">+</span></button>
        <div class="faq-a">Omnibrand ke AI modules Claude AI se powered hain. Har module aapki specific brand type ke liye trained hai — Marketing AI content banata hai, Sales AI scripts aur objection handling karta hai, aur Strategy AI CEO-level business guidance deta hai.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q" onclick="toggleFaq(this)">Team roles kaise manage hote hain? <span class="faq-icon">+</span></button>
        <div class="faq-a">Har role ko specific modules ka access milta hai. Maslan, Cashier sirf Orders aur Loyalty dekh sakta hai, jabke Owner sab kuch dekh sakta hai. Yeh automatically configure hota hai aapki brand type ke mutabiq.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q" onclick="toggleFaq(this)">WhatsApp integration kaise kaam karta hai? <span class="faq-icon">+</span></button>
        <div class="faq-a">Omnibrand mein pre-built WhatsApp message templates hain — order confirmation, dispatch alerts, loyalty updates, payment reminders. Ek click se customer ya team member ko WhatsApp message directly send hota hai.</div>
      </div>
      <div class="faq-item">
        <button class="faq-q" onclick="toggleFaq(this)">Kya main plan change kar sakta hoon? <span class="faq-icon">+</span></button>
        <div class="faq-a">Haan, aap kisi bhi waqt apna plan upgrade ya downgrade kar sakte hain. Koi lock-in period nahi hai. Monthly subscription hai aur cancel karna bhi easy hai.</div>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta-section" id="cta">
  <div class="cta-bg-ring" style="width:600px;height:600px;"></div>
  <div class="cta-bg-ring" style="width:900px;height:900px;"></div>
  <div style="position:relative;z-index:2">
    <div class="ornament"><div class="ornament-line"></div><div class="ornament-diamond"></div><div class="ornament-line"></div></div>
    <h2 class="cta-title reveal">Ready to run your<br/><em>brand smarter?</em></h2>
    <p class="cta-sub reveal">Join 500+ brands already using Omnibrand.<br/>Free 14-day trial. No credit card required.</p>
    <div class="cta-form reveal">
      <input class="cta-input" type="email" placeholder="Enter your email address"/>
      <button class="cta-btn">GET STARTED</button>
    </div>
    <p class="cta-note reveal">FREE 14-DAY TRIAL &nbsp;·&nbsp; NO CREDIT CARD &nbsp;·&nbsp; CANCEL ANYTIME</p>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-inner">
    <div class="footer-top">
      <div>
        <div class="footer-brand">OMNIBRAND</div>
        <div class="footer-tagline">The universal operating system for modern brands. Every business. One platform.</div>
      </div>
      <div>
        <div class="footer-col-title">PRODUCT</div>
        <ul class="footer-links">
          <li><a href="#how">How It Works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#">Changelog</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">COMPANY</div>
        <ul class="footer-links">
          <li><a href="#">About</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
      <div>
        <div class="footer-col-title">LEGAL</div>
        <ul class="footer-links">
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">Refund Policy</a></li>
          <li><a href="#">Cookie Policy</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-copy">© 2026 OMNIBRAND. ALL RIGHTS RESERVED.</div>
      <div class="footer-copy">EVERY BRAND. ONE SYSTEM. &nbsp;✦</div>
    </div>
  </div>
</footer>

<script>
// Custom cursor
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px';
  cur.style.top = e.clientY + 'px';
  setTimeout(() => {
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
  }, 60);
});
document.querySelectorAll('a,button,.step-card,.feature-card,.price-card,.type-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.transform = 'translate(-50%,-50%) scale(1.6)';
    ring.style.borderColor = '#D4A044';
    ring.style.opacity = '0.9';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.borderColor = '#B47B2B';
    ring.style.opacity = '0.5';
  });
});

// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// FAQ toggle
function toggleFaq(btn) {
  const item = btn.parentElement;
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}

// Ticker duplicate for seamless loop
const track = document.getElementById('ticker');
track.innerHTML += track.innerHTML;
</script>
</body>
</html>
