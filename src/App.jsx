import { useState, useEffect, useRef, useCallback } from "react";

// ─── UNIVERSAL BUSINESS OS ───────────────────────────────────────────────────
// Ye config dynamically load hoti hai Firestore se (onboarding ke baad)
// Har business apni details onboarding mein dalta hai

// Dynamic config getters - onboarding ke baad automatically set hoti hain
const getBrandConfig = () => window.__BOS_CONFIG || {};
let firebaseConfig   = window.__BOS_FB_CONFIG || {};
let OWNER_EMAIL      = getBrandConfig().ownerEmail  || "";
let BRAND_WA         = getBrandConfig().whatsapp    || "";
let WEBSITE_URL      = getBrandConfig().website     || "#";
let LOGO             = getBrandConfig().logo        || "PASTE_LOGO_BASE64_HERE";

// Config ko refresh karne ka function (onboarding ke baad call hota hai)
function refreshBrandConfig() {
  const cfg = window.__BOS_CONFIG || {};
  OWNER_EMAIL  = cfg.ownerEmail  || "";
  BRAND_WA     = cfg.whatsapp    || "";
  WEBSITE_URL  = cfg.website     || "#";
  LOGO         = cfg.logo        || "PASTE_LOGO_BASE64_HERE";
  firebaseConfig = window.__BOS_FB_CONFIG || firebaseConfig;
}

// Business categories list
const BUSINESS_CATEGORIES = [
  { id:"ecommerce",   icon:"🛍️", label:"E-Commerce / Products",    color:"#6366f1" },
  { id:"food",        icon:"🍽️", label:"Food & Restaurant",         color:"#f59e0b" },
  { id:"services",    icon:"⚙️", label:"Services (Salon, Clinic…)", color:"#10b981" },
  { id:"digital",     icon:"💻", label:"Digital / Freelance",       color:"#3b82f6" },
  { id:"fashion",     icon:"👗", label:"Fashion & Apparel",         color:"#ec4899" },
  { id:"real_estate", icon:"🏠", label:"Real Estate",               color:"#8b5cf6" },
  { id:"education",   icon:"📚", label:"Education & Coaching",      color:"#06b6d4" },
  { id:"health",      icon:"❤️", label:"Health & Wellness",         color:"#ef4444" },
  { id:"tech",        icon:"🚀", label:"Tech & SaaS",               color:"#14b8a6" },
  { id:"beauty",      icon:"💄", label:"Beauty & Cosmetics",        color:"#f472b6" },
  { id:"automotive",  icon:"🚗", label:"Automotive",                color:"#64748b" },
  { id:"travel",      icon:"✈️", label:"Travel & Tourism",          color:"#0ea5e9" },
  { id:"finance",     icon:"💰", label:"Finance & Consulting",      color:"#84cc16" },
  { id:"media",       icon:"🎬", label:"Media & Entertainment",     color:"#a855f7" },
  { id:"perfume",     icon:"🌸", label:"Perfume & Fragrance",       color:"#C9A84C" },
  { id:"other",       icon:"🌐", label:"Other Business",            color:"#94a3b8" },
];



// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
const C = {
  bg:        "#060504",
  gold:      "#C9A84C",
  goldL:     "#E8C87A",
  cream:     "#F5EFE6",
  border:    "rgba(201,164,76,0.15)",
  muted:     "rgba(245,239,230,0.4)",
  card:      "rgba(255,255,255,0.022)",
  cardHov:   "rgba(255,255,255,0.04)",
  red:       "#ef4444",
  green:     "#34d399",
  blue:      "#60a5fa",
  purple:    "#a78bfa",
  pink:      "#f472b6",
};
const goldGrad = `linear-gradient(135deg, ${C.gold}, ${C.goldL})`;
const glassBg  = "rgba(255,255,255,0.03)";

// ─── BRAND DATA ──────────────────────────────────────────────────────────────
const PRODUCTS_INITIAL = [
  { id:"shahkar",    name:"Shahkar",       subtitle:"The Masterpiece",        gender:"Men",    emoji:"♛", color:"#8B6914",
    top:"Bergamot, Lavender, Black Pepper", heart:"Cedarwood, Tonka Bean, Sage", base:"Amber, Leather, Oakmoss",
    longevity:"8-10 hrs", season:"Autumn/Winter", occasion:"Evening, Formal",
    story:"Crafted for those who lead with quiet authority.", vibe:"Strength · Serenity · Confidence",
    price:0, stock:50, sold:0 },
  { id:"meherban",   name:"Meherban",      subtitle:"The Gracious One",       gender:"Men",    emoji:"🌿", color:"#2D6A4F",
    top:"Cardamom, Mandarin, Fresh Green", heart:"Jasmine, Nutmeg, Cedarwood", base:"Sandalwood, Amber, Musk",
    longevity:"7-9 hrs", season:"Spring/Winter", occasion:"Daily, Casual",
    story:"For the man who carries warmth wherever he walks.", vibe:"Kindness · Calm · Presence",
    price:0, stock:50, sold:0 },
  { id:"gulnaz",     name:"Gulnaz",        subtitle:"The Flower of Beauty",   gender:"Women",  emoji:"🌸", color:"#9D3B6B",
    top:"Bergamot, Pink Pepper, Pear", heart:"Jasmine, Rose, Lily of Valley", base:"Sandalwood, Vanilla, Musk",
    longevity:"6-8 hrs", season:"Spring/Summer", occasion:"Daytime, Romantic",
    story:"Bloom like you were always meant to.", vibe:"Grace · Elegance · Inner Peace",
    price:0, stock:50, sold:0 },
  { id:"noorjahan",  name:"Noor-e-Jahan",  subtitle:"Light of the World",     gender:"Women",  emoji:"✨", color:"#7B4FBF",
    top:"Bergamot, Orange Blossom, Neroli", heart:"Jasmine, Tuberose, Magnolia", base:"Amber, Sandalwood, White Musk",
    longevity:"7-9 hrs", season:"Spring/Autumn", occasion:"Special Occasions",
    story:"She walks in, and the room remembers her.", vibe:"Royalty · Sophistication · Luminosity",
    price:0, stock:50, sold:0 },
  { id:"rooh",       name:"Rooh",          subtitle:"The Soul",               gender:"Unisex", emoji:"☯", color:"#1E6E8C",
    top:"Bergamot, Green Tea, Lavender", heart:"Sage, Jasmine, White Tea", base:"Cedarwood, Musk, Amber",
    longevity:"7-9 hrs", season:"All-year", occasion:"Meditation, Everyday",
    story:"Find yourself in the silence between breaths.", vibe:"Serenity · Mindfulness · Balance",
    price:0, stock:50, sold:0 },
  { id:"rawaan",     name:"Rawaan",        subtitle:"The Free Spirit",        gender:"Unisex", emoji:"🦋", color:"#C95D2A",
    top:"Grapefruit, Lemon, Pink Pepper", heart:"Cardamom, Jasmine, Lavender", base:"Cedarwood, Vetiver, Musk",
    longevity:"7-9 hrs", season:"Spring/Summer", occasion:"Travel, Adventure",
    story:"Life is short — move, breathe, be alive.", vibe:"Freedom · Energy · Passion",
    price:0, stock:50, sold:0 },
];

const TEAM_ROLES = {
  owner:            { label:"👑 CEO / Owner",          color:C.gold    },
  aceo:             { label:"🔱 Assistant CEO",         color:C.goldL   },
  sales:            { label:"📈 Sales Manager",         color:C.green   },
  marketing:        { label:"📊 Marketing Manager",     color:C.purple  },
  content_planner:  { label:"📅 Content Planner",       color:C.blue    },
  content_shooter:  { label:"🎬 Content Shooter",       color:C.pink    },
  social_media:     { label:"📱 Social Media Manager",  color:"#38bdf8" },
  customer_service: { label:"💬 Customer Service",      color:"#fb923c" },
  packaging:        { label:"📦 Packaging & Dispatch",   color:C.green   },
  inventory:        { label:"🗃️ Inventory Manager",     color:"#fbbf24" },
  member:           { label:"👥 Team Member",            color:"#86efac" },
  viewer:           { label:"👁️ Viewer",                 color:"#93c5fd" },
};

const LOYALTY_LEVELS = [
  { name:"Bronze", min:10,  color:"#CD7F32", icon:"🥉", pointsPerOrder:5,  discountPct:5  },
  { name:"Silver", min:50,  color:"#C0C0C0", icon:"🥈", pointsPerOrder:7,  discountPct:10 },
  { name:"Gold",   min:100, color:C.gold,    icon:"🥇", pointsPerOrder:10, discountPct:15 },
];

const getAI_MODULES = () => {
  const bn = getBrandConfig().businessName || "this business";
  const tl = getBrandConfig().tagline || "";
  const cat = getBrandConfig().categoryLabel || "business";
  return {
  ceo:      { icon:"♛", label:"CEO Strategy",    desc:"Strategic vision & brand leadership",   system:`CEO strategic advisor for ${bn} (${cat})${tl?". Tagline: "+tl:""}. Help with strategy, vision, pricing, launch planning. Reply in user's language.` },
  strategy: { icon:"🎯", label:"Brand Strategy",  desc:"Positioning, market & growth analysis", system:`Brand Strategy AI for ${bn}. Positioning, market analysis, growth, competitive landscape. Reply in user's language.` },
  marketing:{ icon:"📣", label:"Marketing AI",    desc:"Campaigns, ads & digital marketing",    system:`Marketing AI for ${bn}. Campaigns, ad creatives, budget, digital marketing, influencers. Reply in user's language.` },
  sales:    { icon:"📈", label:"Sales AI",         desc:"Sales pitches & closing strategies",    system:`Sales AI for ${bn}. Sales pitches, pricing, objection handling, order management, closing deals. Reply in user's language.` },
  inventory:{ icon:"📦", label:"Inventory AI",    desc:"Stock management & supply chain",       system:`Inventory AI for ${bn}. Stock management, reorder points, supply chain, product availability. Reply in user's language.` },
  social:   { icon:"📱", label:"Social Media AI", desc:"Instagram, TikTok & viral content",     system:`Social Media AI for ${bn}. Instagram/TikTok/Facebook captions, hashtags, viral content ideas, growth. Reply in user's language.` },
  support:  { icon:"💬", label:"Customer AI",     desc:"Customer replies & complaint handling", system:`Customer Service AI for ${bn}. Professional customer replies, complaint handling, FAQ responses. Reply in user's language.` },
  content:  { icon:"✍️", label:"Content AI",      desc:"Content calendars & video scripts",     system:`Content AI for ${bn}. Content calendars, video scripts, shoot briefs, reel ideas. Reply in user's language.` },
  visual:   { icon:"🎬", label:"Visual AI",       desc:"Shoot planning & photography tips",     system:`Visual Direction AI for ${bn}. Shoot planning, shot lists, product photography tips, aesthetic direction. Reply in user's language.` },
  dispatch: { icon:"🚚", label:"Dispatch AI",     desc:"Packaging, courier & returns",          system:`Operations AI for ${bn}. Packaging, courier selection, dispatch, tracking, returns. Reply in user's language.` },
  hr:       { icon:"👥", label:"Team AI",         desc:"Team management & hiring",              system:`HR AI for ${bn}. Team management, roles, performance, hiring, onboarding. Reply in user's language.` },
  };
};
const AI_MODULES = getAI_MODULES();

const ROLE_AI_MAP = {
  owner:            ["ceo","strategy","marketing","sales","inventory","social","support","content","visual","dispatch","hr"],
  aceo:             ["ceo","strategy","marketing","sales","inventory","social","support","content"],
  sales:            ["sales","support","social"],
  marketing:        ["marketing","social","content","strategy"],
  content_planner:  ["content","social","marketing"],
  content_shooter:  ["content","visual"],
  social_media:     ["social","content","marketing"],
  customer_service: ["support","sales"],
  packaging:        ["dispatch","inventory"],
  inventory:        ["inventory","dispatch"],
  member:           ["sales","support"],
  viewer:           ["ceo"],
};

const ACCESS = (role) => ({
  dashboard:     true,
  products:      true,
  productsEdit:  ["owner","aceo"].includes(role),
  ai:            true,
  admin:         ["owner","aceo","sales","customer_service","packaging","inventory"].includes(role),
  team:          ["owner","aceo"].includes(role),
  guide:         true,
  addOrders:     ["owner","aceo","sales","customer_service"].includes(role),
  deleteOrders:  ["owner","aceo"].includes(role),
  inventoryEdit: ["owner","aceo","packaging","inventory"].includes(role),
  managePoints:  ["owner","aceo"].includes(role),
  waNotify:      ["owner","aceo","sales","customer_service"].includes(role),
  analytics:     ["owner","aceo","sales","marketing"].includes(role),
  expenses:      ["owner","aceo"].includes(role),
  coupons:       ["owner","aceo","sales"].includes(role),
  teamPerf:      ["owner","aceo"].includes(role),
  influencer:    ["owner","aceo"].includes(role),
  contentCal:    ["owner","aceo","sales","marketing","social_media"].includes(role),
  followup:      ["owner","aceo","sales","customer_service"].includes(role),
  returns:       ["owner","aceo","sales","customer_service"].includes(role),
});

const DEFAULT_TASKS = [
  { id:"t1", text:"Finalize product prices",         done:false, priority:"high"   },
  { id:"t2", text:"Instagram setup & bio",           done:false, priority:"high"   },
  { id:"t3", text:"Product photography shoot",       done:false, priority:"high"   },
  { id:"t4", text:"Design packaging labels",         done:false, priority:"medium" },
  { id:"t5", text:"Plan launch campaign",            done:false, priority:"medium" },
  { id:"t6", text:"Website go-live",                 done:false, priority:"high"   },
];

// ─── FIREBASE (CDN) ──────────────────────────────────────────────────────────
let fb_app, fb_auth, fb_db;
let signIn, createUser, signOutFn, onAuthChange, updateProf;
let fsDoc, fsSet, fsGet, fsColl, fsAdd, fsGetDocs, fsUpdate, fsDel, fsQuery, fsOrderBy, fsServerTime, fsRunTransaction;

async function loadFirebase() {
  const { initializeApp }              = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
  const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
          signOut, onAuthStateChanged, updateProfile } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
  const { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs,
          updateDoc, deleteDoc, query, orderBy, serverTimestamp, runTransaction } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

  fb_app    = initializeApp(firebaseConfig);
  fb_auth   = getAuth(fb_app);
  fb_db     = getFirestore(fb_app);
  signIn    = signInWithEmailAndPassword;
  createUser= createUserWithEmailAndPassword;
  signOutFn = signOut;
  onAuthChange = onAuthStateChanged;
  updateProf   = updateProfile;
  fsDoc     = doc; fsSet = setDoc; fsGet = getDoc; fsColl = collection;
  fsAdd     = addDoc; fsGetDocs = getDocs; fsUpdate = updateDoc;
  fsDel     = deleteDoc; fsQuery = query; fsOrderBy = orderBy; fsServerTime = serverTimestamp;
  fsRunTransaction = runTransaction;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const getLoyaltyLevel = (pts) => {
  if (pts >= 100) return LOYALTY_LEVELS[2];
  if (pts >= 50)  return LOYALTY_LEVELS[1];
  if (pts >= 10)  return LOYALTY_LEVELS[0];
  return null;
};
const fmtRs = (n) => `Rs. ${Number(n||0).toLocaleString("en-PK")}`;

// ─── ORDER ID SYSTEM ─────────────────────────────────────────────────────────
const PRODUCT_CODES = {
  shahkar:   "SHK",
  meherban:  "MEH",
  gulnaz:    "GUL",
  noorjahan: "NOJ",
  rooh:      "ROH",
  rawaan:    "RAV",
};

function getProductCode(productName) {
  if (!productName) return "ORD";
  const key = productName.toLowerCase().replace(/[\s\-]/g, "");
  return PRODUCT_CODES[key] || productName.substring(0, 3).toUpperCase();
}

function getTodayYYMMDD() {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}${mm}${dd}`;
}

async function generateOrderId(productName, db) {
  const productCode = getProductCode(productName);
  const dateStr     = getTodayYYMMDD();
  const counterKey  = `${dateStr}-${productCode}`;

  if (db && fsRunTransaction && fsDoc) {
    try {
      const counterRef = fsDoc(db, "orderCounters", counterKey);
      const newCount   = await fsRunTransaction(db, async (txn) => {
        const snap = await txn.get(counterRef);
        const current = snap.exists() ? (snap.data().count || 0) : 0;
        const next    = current + 1;
        txn.set(counterRef, { count: next, date: dateStr, product: productCode });
        return next;
      });
      return `ASK-${dateStr}-${productCode}-${String(newCount).padStart(3, "0")}`;
    } catch (e) {
      console.warn("Order counter transaction failed, using fallback:", e);
    }
  }

  const suffix = Date.now().toString().slice(-3);
  return `ASK-${dateStr}-${productCode}-${suffix}`;
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  btn: (variant="gold", extra={}) => ({
    padding:"10px 20px", borderRadius:8, fontFamily:"DM Sans, sans-serif",
    fontWeight:600, fontSize:13, cursor:"pointer", border:"none", transition:"all .2s",
    ...(variant==="gold"   ? { background:goldGrad, color:C.bg }  : {}),
    ...(variant==="ghost"  ? { background:"transparent", color:C.gold, border:`1px solid ${C.gold}` } : {}),
    ...(variant==="red"    ? { background:"rgba(239,68,68,0.15)", color:C.red, border:"1px solid rgba(239,68,68,0.3)" } : {}),
    ...(variant==="green"  ? { background:"rgba(52,211,153,0.15)", color:C.green, border:"1px solid rgba(52,211,153,0.3)" } : {}),
    ...extra
  }),
  card: (extra={}) => ({
    background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:20,
    transition:"all .2s", ...extra
  }),
  input: (extra={}) => ({
    background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}`, borderRadius:8,
    color:C.cream, fontFamily:"DM Sans, sans-serif", fontSize:14, padding:"10px 14px",
    outline:"none", width:"100%", boxSizing:"border-box", ...extra
  }),
  badge: (color) => ({
    display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:11,
    fontWeight:600, fontFamily:"DM Sans, sans-serif", background:`${color}22`, color,
    border:`1px solid ${color}44`,
  }),
  pill: (extra={}) => ({
    display:"inline-block", padding:"2px 10px", borderRadius:20, fontSize:11,
    background:`${C.gold}15`, color:C.gold, border:`1px solid ${C.gold}25`,
    fontFamily:"DM Sans, sans-serif", ...extra
  }),
  label: () => ({
    fontFamily:"DM Sans, sans-serif", fontSize:12, color:C.muted,
    marginBottom:4, display:"block", letterSpacing:.5
  }),
  heading: (size=16, extra={}) => ({
    fontFamily:"Cinzel, serif", fontSize:size, color:C.cream,
    letterSpacing:1, margin:0, ...extra
  }),
  serif: (size=28, extra={}) => ({
    fontFamily:"Cormorant Garamond, serif", fontSize:size, color:C.cream,
    fontWeight:700, margin:0, ...extra
  }),
  select: () => ({
    background:"#1C1710", border:`1px solid ${C.border}`, borderRadius:8,
    color:C.cream, fontFamily:"DM Sans, sans-serif", fontSize:13,
    padding:"8px 12px", cursor:"pointer", outline:"none",
  }),
};

// ─── GLOBAL CSS ──────────────────────────────────────────────────────────────
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&display=swap');
      * { box-sizing:border-box; margin:0; padding:0; }
      body { background:${C.bg}; color:${C.cream}; font-family:"DM Sans",sans-serif; overflow-x:hidden; }
      ::-webkit-scrollbar { width:3px; height:3px; }
      ::-webkit-scrollbar-track { background:transparent; }
      ::-webkit-scrollbar-thumb { background:${C.gold}; border-radius:2px; }
      select option { background:#1C1710; color:${C.cream}; }
      input::placeholder, textarea::placeholder { color:${C.muted}; }
      input:focus, textarea:focus, select:focus { border-color:${C.gold} !important; }
      @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      @keyframes spin    { to{transform:rotate(360deg)} }
      @keyframes shimmer { 0%,100%{background-position:200% center} 50%{background-position:0% center} }
      @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
      @keyframes popIn   { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:scale(1)} }
      @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

      /* ── PERFUME MIST ANIMATIONS ─────────────────────────────── */
      @keyframes logoPulse {
        0%  { filter: drop-shadow(0 0 4px rgba(201,164,76,0.2)) brightness(1); transform: scale(1); }
        30% { filter: drop-shadow(0 0 22px rgba(201,164,76,0.9)) drop-shadow(0 0 40px rgba(201,164,76,0.5)) brightness(1.12); transform: scale(1.04); }
        60% { filter: drop-shadow(0 0 8px rgba(201,164,76,0.3)) brightness(1.02); transform: scale(1); }
        100%{ filter: drop-shadow(0 0 4px rgba(201,164,76,0.2)) brightness(1); transform: scale(1); }
      }
      @keyframes brandShine {
        0%,100%{ background-position:200% center; text-shadow:none; opacity:1; }
        28%    { background-position:200% center; opacity:1; }
        30%    { background-position:100% center; text-shadow: 0 0 20px rgba(201,164,76,0.95), 0 0 40px rgba(201,164,76,0.6), 0 0 80px rgba(201,164,76,0.3); opacity:1; letter-spacing:0.08em; }
        55%    { background-position:0%   center; text-shadow: 0 0 8px rgba(201,164,76,0.4); opacity:1; letter-spacing:0.02em; }
        100%   { background-position:200% center; }
      }
      @keyframes mistDot {
        0%   { opacity:0; transform:translate(0,0) scale(0.3); }
        15%  { opacity:0.8; }
        100% { opacity:0; transform:translate(var(--mx),var(--my)) scale(var(--ms)); }
      }
      @keyframes mistCloud {
        0%   { opacity:0; transform:translate(-4px,0) scale(0.6) skewX(-5deg); }
        20%  { opacity:0.18; }
        70%  { opacity:0.08; }
        100% { opacity:0; transform:translate(var(--cx),var(--cy)) scale(var(--cs)) skewX(3deg); }
      }
      .fadeUp { animation:fadeUp .35s ease forwards; }
      .card-hover:hover { transform:translateY(-2px); background:rgba(255,255,255,0.04) !important; }
      .btn-gold:hover { opacity:.88; transform:translateY(-1px); }
      .btn-ghost:hover { background:rgba(201,164,76,0.08) !important; }
    `}</style>
  );
}

// ─── SPINNER ─────────────────────────────────────────────────────────────────
function Spinner({ size=32, center=false }) {
  const el = (
    <div style={{ width:size, height:size, borderRadius:"50%",
      border:`2px solid ${C.border}`, borderTopColor:C.gold,
      animation:"spin .8s linear infinite" }} />
  );
  if (!center) return el;
  return <div style={{ display:"flex", justifyContent:"center", alignItems:"center", padding:40 }}>{el}</div>;
}

// ─── MODAL OVERLAY ───────────────────────────────────────────────────────────
function Modal({ children, onClose, maxWidth=480 }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.75)", zIndex:1000,
      display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:"#0E0B07", border:`1px solid ${C.border}`, borderRadius:16,
        padding:28, maxWidth, width:"100%", animation:"popIn .25s ease forwards", maxHeight:"90vh", overflowY:"auto" }}>
        {children}
      </div>
    </div>
  );
}

// ─── LOADING SCREEN ──────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", gap:24, background:C.bg }}>
      {LOGO !== "PASTE_LOGO_BASE64_HERE"
        ? <img src={LOGO} alt="Logo" style={{ height:80,
            animation:"logoPulse 3s ease-in-out infinite",
            willChange:"filter" }} />
        : <div style={{ ...S.heading(28), color:C.gold, animation:"float 2s ease infinite" }}>✦</div>}
      <Spinner size={44} />
      <p style={{ color:C.muted, fontFamily:"Cormorant Garamond, serif", fontStyle:"italic", fontSize:16 }}>
        {getBrandConfig().tagline || "Khushboo That Speaks for You."}
      </p>
    </div>
  );
}

// ─── LOGIN SCREEN ────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [mode, setMode]   = useState("in");
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [name,  setName]  = useState("");
  const [err,   setErr]   = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setErr(""); setLoading(true);
    try {
      let cred;
      if (mode==="in") {
        cred = await signIn(fb_auth, email, pass);
      } else {
        cred = await createUser(fb_auth, email, pass);
        if (name) await updateProf(cred.user, { displayName: name });
      }
      onLogin(cred.user);
    } catch(e) {
      setErr(e.message.replace("Firebase: ","").replace(/\(auth.*\)\./,""));
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:C.bg, padding:20 }}>
      <div style={{ width:"100%", maxWidth:420, animation:"fadeUp .4s ease" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          {LOGO !== "PASTE_LOGO_BASE64_HERE"
            ? <img src={LOGO} alt={getBrandConfig().businessName || "Brand Logo"} style={{ height:80,
                filter:"drop-shadow(0 0 16px rgba(201,164,76,0.35))", marginBottom:16 }} />
            : <div style={{ fontSize:48, marginBottom:12, filter:"drop-shadow(0 0 12px rgba(201,164,76,0.4))" }}>🌸</div>}
          <h1 style={{ ...S.heading(24), background:goldGrad, WebkitBackgroundClip:"text",
            WebkitTextFillColor:"transparent", backgroundSize:"200%", animation:"shimmer 3s ease infinite",
            marginBottom:6 }}>{getBrandConfig().businessName || "#AS KHUSHBOO"}</h1>
          <p style={{ fontFamily:"Cormorant Garamond, serif", fontStyle:"italic", color:C.muted, fontSize:15 }}>
            {getBrandConfig().tagline || "Khushboo That Speaks for You."}
          </p>
          <p style={{ fontSize:11, color:C.muted, letterSpacing:2, marginTop:8, fontFamily:"DM Sans, sans-serif" }}>
            {(getBrandConfig().businessName||"TEAM").toUpperCase()} · PORTAL
          </p>
        </div>

        <div style={{ ...S.card(), padding:32 }}>
          <div style={{ display:"flex", background:"rgba(255,255,255,0.03)", borderRadius:10,
            padding:4, marginBottom:24, gap:4 }}>
            {[["in","Sign In"],["up","New Account"]].map(([k,l]) => (
              <button key={k} onClick={()=>setMode(k)} style={{
                flex:1, padding:"9px 0", borderRadius:8, border:"none", cursor:"pointer",
                fontFamily:"DM Sans, sans-serif", fontWeight:600, fontSize:13, transition:"all .2s",
                background: mode===k ? goldGrad : "transparent",
                color: mode===k ? C.bg : C.muted,
              }}>{l}</button>
            ))}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {mode==="up" && (
              <div>
                <span style={S.label()}>Full Name</span>
                <input style={S.input()} placeholder="Aapka naam" value={name} onChange={e=>setName(e.target.value)} />
              </div>
            )}
            <div>
              <span style={S.label()}>Email</span>
              <input style={S.input()} type="email" placeholder="email@example.com"
                value={email} onChange={e=>setEmail(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handle()} />
            </div>
            <div>
              <span style={S.label()}>Password</span>
              <input style={S.input()} type="password" placeholder="••••••••"
                value={pass} onChange={e=>setPass(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&handle()} />
            </div>

            {err && <p style={{ color:C.red, fontSize:13, padding:"8px 12px",
              background:"rgba(239,68,68,0.08)", borderRadius:8, border:"1px solid rgba(239,68,68,0.2)" }}>
              {err}</p>}

            <button onClick={handle} disabled={loading}
              style={{ ...S.btn("gold"), padding:"13px 0", width:"100%",
                opacity:loading?.6:1, marginTop:4 }} className="btn-gold">
              {loading ? <Spinner size={18} /> : (mode==="in" ? "Sign In →" : "Create Account →")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HEADER ──────────────────────────────────────────────────────────────────
function MistParticles() {
  const DOTS = [
    { mx:"38px",  my:"-18px", ms:"1.8", delay:"0s",    dur:"2.2s", size:3,  color:"rgba(201,164,76,0.55)"  },
    { mx:"52px",  my:"-28px", ms:"2.2", delay:"0.15s", dur:"2.5s", size:2,  color:"rgba(201,164,76,0.4)"   },
    { mx:"30px",  my:"-12px", ms:"1.5", delay:"0.3s",  dur:"1.9s", size:2,  color:"rgba(220,190,110,0.5)"  },
    { mx:"62px",  my:"-8px",  ms:"2.6", delay:"0.08s", dur:"2.8s", size:2,  color:"rgba(201,164,76,0.35)"  },
    { mx:"44px",  my:"-34px", ms:"1.4", delay:"0.45s", dur:"2.1s", size:1.5,color:"rgba(255,230,160,0.45)" },
    { mx:"70px",  my:"-20px", ms:"2.0", delay:"0.22s", dur:"2.6s", size:2,  color:"rgba(201,164,76,0.3)"   },
    { mx:"22px",  my:"-22px", ms:"1.6", delay:"0.55s", dur:"2.3s", size:1.5,color:"rgba(201,164,76,0.4)"   },
    { mx:"80px",  my:"-14px", ms:"2.4", delay:"0.38s", dur:"3.0s", size:1.5,color:"rgba(220,190,110,0.3)"  },
  ];
  const CLOUDS = [
    { cx:"55px",  cy:"-22px", cs:"3.2", delay:"0.1s",  dur:"2.8s" },
    { cx:"75px",  cy:"-10px", cs:"2.6", delay:"0.35s", dur:"3.2s" },
    { cx:"40px",  cy:"-30px", cs:"2.8", delay:"0.6s",  dur:"2.6s" },
    { cx:"90px",  cy:"-18px", cs:"3.5", delay:"0.2s",  dur:"3.4s" },
  ];
  return (
    <div style={{ position:"absolute", top:"50%", left:0, width:0, height:0, pointerEvents:"none", overflow:"visible" }}>
      {DOTS.map((d,i)=>(
        <div key={i} style={{
          position:"absolute",
          width:d.size, height:d.size,
          borderRadius:"50%",
          background:d.color,
          boxShadow:`0 0 ${d.size*3}px ${d.color}`,
          "--mx": d.mx, "--my": d.my, "--ms": d.ms,
          animation:`mistDot ${d.dur} ease-out ${d.delay} 5s`,
          animationIterationCount:"infinite",
          willChange:"transform,opacity",
        }} />
      ))}
      {CLOUDS.map((c,i)=>(
        <div key={"c"+i} style={{
          position:"absolute",
          width:12, height:8,
          borderRadius:"50%",
          background:`radial-gradient(ellipse, rgba(201,164,76,0.12) 0%, transparent 70%)`,
          "--cx": c.cx, "--cy": c.cy, "--cs": c.cs,
          animation:`mistCloud ${c.dur} ease-out ${c.delay} 5s`,
          animationIterationCount:"infinite",
          willChange:"transform,opacity",
        }} />
      ))}
    </div>
  );
}

function Header({ user, role, points, onSignOut }) {
  const lvl = getLoyaltyLevel(points);
  return (
    <div style={{ background:"rgba(6,5,4,0.96)", backdropFilter:"blur(16px)",
      borderBottom:`1px solid ${C.border}`, padding:"12px 24px",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      flexWrap:"wrap", gap:12, position:"sticky", top:0, zIndex:100 }}>

      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
          {LOGO !== "PASTE_LOGO_BASE64_HERE"
            ? <img src={LOGO} alt="Logo" style={{ height:52, position:"relative", zIndex:2,
                animation:"logoPulse 5s ease-in-out infinite",
                willChange:"filter,transform" }} />
            : <span style={{ fontSize:32, position:"relative", zIndex:2,
                animation:"logoPulse 5s ease-in-out infinite",
                display:"inline-block" }}>🌸</span>}
          <MistParticles />
        </div>
        <div>
          <h1 style={{ ...S.heading(17),
            background:`linear-gradient(90deg, ${C.gold} 0%, #ffe8a0 30%, ${C.goldL} 50%, #ffe8a0 70%, ${C.gold} 100%)`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            backgroundSize:"300%",
            animation:"brandShine 5s ease-in-out infinite",
            transition:"letter-spacing 0.4s ease",
            willChange:"background-position" }}>
            {getBrandConfig().businessName || "#AS KHUSHBOO"}
          </h1>
          <p style={{ fontSize:11, color:C.muted, fontFamily:"Cormorant Garamond, serif",
            fontStyle:"italic" }}>{getBrandConfig().tagline || "Khushboo That Speaks for You."}</p>
        </div>
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
        <a href="https://instagram.com/askhushbooofficial" target="_blank" rel="noreferrer" title="Instagram"
          style={{ width:34,height:34,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",
            background:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
            textDecoration:"none",transition:"opacity .2s",flexShrink:0 }}
          onMouseEnter={e=>e.currentTarget.style.opacity=".8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        <a href="https://www.facebook.com/profile.php?id=61579181322424" target="_blank" rel="noreferrer" title="Facebook"
          style={{ width:34,height:34,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",
            background:"#1877F2",textDecoration:"none",transition:"opacity .2s",flexShrink:0 }}
          onMouseEnter={e=>e.currentTarget.style.opacity=".8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        <a href="https://tiktok.com/@askhushbooofficial" target="_blank" rel="noreferrer" title="TikTok"
          style={{ width:34,height:34,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",
            background:"#000",border:"1px solid #333",textDecoration:"none",transition:"opacity .2s",flexShrink:0 }}
          onMouseEnter={e=>e.currentTarget.style.opacity=".8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
          </svg>
        </a>
        <a href="https://youtube.com/@ASKhushbooOfficial" target="_blank" rel="noreferrer" title="YouTube"
          style={{ width:34,height:34,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",
            background:"#FF0000",textDecoration:"none",transition:"opacity .2s",flexShrink:0 }}
          onMouseEnter={e=>e.currentTarget.style.opacity=".8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
        <a href={`https://wa.me/${BRAND_WA}`} target="_blank" rel="noreferrer" title="WhatsApp"
          style={{ width:34,height:34,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",
            background:"#25D366",textDecoration:"none",transition:"opacity .2s",flexShrink:0 }}
          onMouseEnter={e=>e.currentTarget.style.opacity=".8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
        <a href={WEBSITE_URL} target="_blank" rel="noreferrer" title="Website"
          style={{ width:34,height:34,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",
            background:goldGrad,textDecoration:"none",transition:"opacity .2s",flexShrink:0 }}
          onMouseEnter={e=>e.currentTarget.style.opacity=".8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#060504">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        </a>

        <div style={{ height:32, width:1, background:C.border }} />

        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end" }}>
          <span style={{ fontSize:13, fontWeight:600 }}>{user?.displayName || user?.email?.split("@")[0]}</span>
          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
            <span style={S.badge((TEAM_ROLES[role]||TEAM_ROLES.member).color)}>
              {(TEAM_ROLES[role]||TEAM_ROLES.member).label}
            </span>
            {lvl && <span style={S.badge(lvl.color)}>{lvl.icon} {lvl.name}</span>}
          </div>
        </div>

        <button onClick={onSignOut} style={{ ...S.btn("ghost"), padding:"6px 12px", fontSize:12 }}
          className="btn-ghost">Sign Out</button>
      </div>
    </div>
  );
}

// ─── TAB BAR ─────────────────────────────────────────────────────────────────
function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display:"flex", gap:4, padding:"16px 24px 0", flexWrap:"wrap" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={()=>onChange(t.id)} style={{
          padding:"9px 18px", borderRadius:24, border:"none", cursor:"pointer",
          fontFamily:"DM Sans, sans-serif", fontWeight:600, fontSize:13, transition:"all .2s",
          background: active===t.id ? goldGrad : "rgba(255,255,255,0.04)",
          color: active===t.id ? C.bg : C.muted,
          boxShadow: active===t.id ? `0 0 16px ${C.gold}30` : "none",
        }}>{t.icon} {t.label}</button>
      ))}
    </div>
  );
}

// ─── PROGRESS BAR ────────────────────────────────────────────────────────────
function ProgressBar({ pct, color=C.gold, height=4, label="" }) {
  return (
    <div>
      {label && <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ fontSize:11, color:C.muted }}>{label}</span>
        <span style={{ fontSize:11, color }}>{Math.round(pct)}%</span>
      </div>}
      <div style={{ background:`${C.gold}15`, borderRadius:height, height, overflow:"hidden" }}>
        <div style={{ width:`${Math.min(100,pct)}%`, height:"100%", borderRadius:height,
          background:`linear-gradient(90deg, ${color}, ${color}cc)`, transition:"width .6s ease" }} />
      </div>
    </div>
  );
}

// ─── WA POPUP ────────────────────────────────────────────────────────────────
function buildCustomerMsg(order) {
  const LINE  = "--------------------";
  const notes = order.notes ? "\nNote: " + order.notes : "";
  return (
    "Salam, " + order.customer + "!\n\n" +
    "Thank you for shopping with *" + (getBrandConfig().businessName||"#AS KHUSHBOO") + "*.\n" +
    "Your order has been placed and is now being processed.\n\n" +
    LINE + "\n" +
    "       *ORDER DETAILS*\n" +
    LINE + "\n\n" +
    "*Order ID:*     " + order.orderId + "\n" +
    "*Product:*      " + order.product + "\n" +
    "*Quantity:*     " + order.qty + " bottle(s)\n" +
    "*Total Amount:* Rs. " + Number(order.revenue).toLocaleString("en-PK") + "\n" +
    "*Channel:*      " + order.channel + "\n" +
    "*Status:*       Pending Confirmation\n\n" +
    LINE + "\n" +
    "       *NEXT STEPS*\n" +
    LINE + "\n\n" +
    "- Your order has been received successfully.\n" +
    "- Our team will confirm and prepare your order shortly.\n" +
    "- Once dispatched, you will receive a delivery update." +
    notes + "\n\n" +
    "If you have any questions, please contact us on this number.\n\n" +
    "_" + (getBrandConfig().tagline||"Quality You Can Trust") + "_\n" +
    "*" + (getBrandConfig().businessName||"Brand") + "*\n" +
    WEBSITE_URL
  );
}

function buildBrandNotifyMsg(order) {
  const SEP     = "-------------------";
  const addedBy = order.addedBy ? "\n* Added By: " + order.addedBy : "";
  const notes   = order.notes   ? "\n* Notes: " + order.notes : "";
  return (
    "NEW ORDER ALERT - " + (getBrandConfig().businessName||"Business")\n\n" +
    SEP + "\n" +
    "Order ID: " + order.orderId + "\n" +
    "Product: " + order.product + " x " + order.qty + "\n" +
    "Total Amount: Rs. " + Number(order.revenue).toLocaleString("en-PK") + "\n" +
    "Customer: " + order.customer + "\n" +
    "Phone: " + (order.phone || "Not provided") + "\n" +
    "Channel: " + order.channel + "\n" +
    "Status: Pending" +
    addedBy + notes + "\n" +
    SEP + "\n\n" +
    "ACTION REQUIRED\n" +
    "Please review and process this order. Update the order status after confirmation or dispatch."
  );
}

// ─── NEW: DISPATCH WA MESSAGE ─────────────────────────────────────────────────
function buildDispatchMsg(order) {
  return (
    "Salam *" + order.customer + "*!\n\n" +
    "Aapka *" + (getBrandConfig().businessName||"Brand") + "* order dispatch ho gaya hai!\n\n" +
    "--------------------\n" +
    "*Order ID:* " + order.orderId + "\n" +
    "*Product:* " + order.product + " x " + order.qty + "\n" +
    "*Amount:* Rs. " + Number(order.revenue).toLocaleString("en-PK") + "\n" +
    "*Status:* Dispatched\n" +
    "--------------------\n\n" +
    "Aapka order raste mein hai — jald hi pohonch jayega!\n\n" +
    "_" + (getBrandConfig().tagline||"Quality You Can Trust") + "_\n" +
    "*" + (getBrandConfig().businessName||"Brand") + "* | " + WEBSITE_URL
  );
}

// ─── NEW: ORDER STATUS PIPELINE COMPONENT ────────────────────────────────────
const STATUS_PIPELINE = [
  { key:"pending",    label:"Pending",    icon:"🕐", color:"#fbbf24" },
  { key:"confirmed",  label:"Confirmed",  icon:"✅", color:"#60a5fa" },
  { key:"packed",     label:"Packed",     icon:"📦", color:"#f472b6" },
  { key:"dispatched", label:"Dispatched", icon:"🚚", color:"#a78bfa" },
  { key:"delivered",  label:"Delivered",  icon:"🎉", color:"#34d399" },
];

function OrderPipeline({ order, onStatusChange, access }) {
  const currentIdx = STATUS_PIPELINE.findIndex(s => s.key === order.status);
  const waNum = order.phone
    ? "92" + order.phone.replace(/^0/, "").replace(/\D/g, "")
    : null;

  return (
    <div style={{ marginTop:10, padding:"12px 14px",
      background:"rgba(255,255,255,0.02)", borderRadius:10,
      border:`1px solid ${C.border}` }}>
      {/* Pipeline Steps */}
      <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:10, overflowX:"auto" }}>
        {STATUS_PIPELINE.map((s, i) => {
          const isDone    = i < currentIdx;
          const isCurrent = i === currentIdx;
          return (
            <div key={s.key} style={{ display:"flex", alignItems:"center" }}>
              <div
                onClick={() => access.admin && onStatusChange(s.key)}
                title={access.admin ? `Set to ${s.label}` : ""}
                style={{
                  display:"flex", flexDirection:"column", alignItems:"center",
                  gap:3, padding:"6px 8px", borderRadius:8,
                  cursor: access.admin ? "pointer" : "default",
                  background: isCurrent ? `${s.color}20` : isDone ? "rgba(52,211,153,0.08)" : "transparent",
                  border: isCurrent ? `1px solid ${s.color}60` : "1px solid transparent",
                  transition:"all .2s", minWidth:64, textAlign:"center",
                  transform: isCurrent ? "scale(1.05)" : "scale(1)",
                }}>
                <span style={{ fontSize:16 }}>{isDone ? "✅" : s.icon}</span>
                <span style={{ fontSize:9, fontWeight: isCurrent ? 700 : 400,
                  color: isCurrent ? s.color : isDone ? C.green : C.muted,
                  fontFamily:"DM Sans, sans-serif" }}>{s.label}</span>
              </div>
              {i < STATUS_PIPELINE.length - 1 && (
                <div style={{ width:16, height:2, flexShrink:0,
                  background: isDone ? C.green : C.border,
                  transition:"background .3s" }} />
              )}
            </div>
          );
        })}
      </div>
      {/* Dispatch WA Button — only when dispatched and phone available */}
      {order.status === "dispatched" && waNum && (
        <a
          href={`https://wa.me/${waNum}?text=${encodeURIComponent(buildDispatchMsg(order))}`}
          target="_blank" rel="noreferrer"
          style={{ ...S.btn("green", {
            display:"inline-flex", alignItems:"center",
            gap:6, fontSize:11, padding:"6px 12px", textDecoration:"none"
          }) }}>
          🚚 Dispatch WA Bhejo
        </a>
      )}
    </div>
  );
}

function WAPopup({ order, onClose }) {
  const [step, setStep] = useState(1);
  const [customerSent, setCustomerSent] = useState(false);
  const [brandSent,    setBrandSent]    = useState(false);

  const customerNum = order.phone
    ? "92" + order.phone.replace(/^0/, "").replace(/\D/g, "")
    : null;

  const customerUrl = customerNum
    ? `https://wa.me/${customerNum}?text=${encodeURIComponent(buildCustomerMsg(order))}`
    : null;
  const brandUrl = `https://wa.me/${BRAND_WA}?text=${encodeURIComponent(buildBrandNotifyMsg(order))}`;

  const handleCustomer = () => {
    window.open(customerUrl, "_blank");
    setCustomerSent(true);
    setTimeout(() => setStep(2), 800);
  };

  const handleBrand = () => {
    window.open(brandUrl, "_blank");
    setBrandSent(true);
    setTimeout(() => setStep(3), 800);
  };

  return (
    <Modal onClose={onClose} maxWidth={500}>
      <div style={{ textAlign:"center", marginBottom:20 }}>
        <div style={{ fontSize:44, marginBottom:8 }}>✅</div>
        <h2 style={{ ...S.heading(20), color:C.green, marginBottom:4 }}>Order Successfully Saved!</h2>
        <p style={{ color:C.muted, fontSize:13 }}>
          Order <b style={{ color:C.gold }}>{order.orderId}</b> — ab notifications bhejo
        </p>
      </div>

      <div style={{ ...S.card({ border:`1px solid ${C.gold}30`, marginBottom:20, padding:16 }) }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {[
            ["🧴 Product", `${order.product} × ${order.qty}`],
            ["💰 Amount",  `Rs. ${Number(order.revenue).toLocaleString("en-PK")}`],
            ["👤 Customer", order.customer],
            ["📱 Phone",   order.phone || "—"],
            ["📍 Channel", order.channel],
            ["📋 Status",  order.status],
          ].map(([l,v]) => (
            <div key={l} style={{ padding:"8px 10px", background:"rgba(255,255,255,0.03)", borderRadius:8 }}>
              <p style={{ fontSize:10, color:C.muted, marginBottom:2 }}>{l}</p>
              <p style={{ fontSize:13, fontWeight:600 }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:20, alignItems:"center", justifyContent:"center" }}>
        {[
          { n:1, label:"Customer", icon:"👤" },
          { n:2, label:"Brand",    icon:"🏪" },
          { n:3, label:"Done",     icon:"✓"  },
        ].map((s, i) => (
          <div key={s.n} style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:13, fontWeight:700,
              background: step > s.n ? C.green : step === s.n ? C.gold : "rgba(255,255,255,0.05)",
              color: step > s.n || step === s.n ? C.bg : C.muted,
              border: `2px solid ${step >= s.n ? (step > s.n ? C.green : C.gold) : C.border}`,
              transition:"all .3s" }}>
              {step > s.n ? "✓" : s.icon}
            </div>
            <span style={{ fontSize:11, color: step >= s.n ? C.cream : C.muted }}>{s.label}</span>
            {i < 2 && <div style={{ width:20, height:2, background: step > s.n+0.5 ? C.green : C.border, borderRadius:1 }} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {!customerUrl && (
            <div style={{ padding:"10px 14px", background:"rgba(239,68,68,0.08)",
              border:"1px solid rgba(239,68,68,0.3)", borderRadius:8, fontSize:13, color:C.red }}>
              ⚠️ Phone number nahi diya — customer notification skip ho jaayegi
            </div>
          )}
          {customerUrl ? (
            <button onClick={handleCustomer}
              style={{ ...S.btn("green", { padding:"14px", fontSize:14, width:"100%" }) }}>
              {customerSent ? "✓ WhatsApp Opened!" : "📱 Customer Ko Order Confirmation Bhejo"}
            </button>
          ) : (
            <button onClick={()=>setStep(2)}
              style={{ ...S.btn("ghost", { padding:"12px", width:"100%" }) }}>
              Customer Skip → Brand Ko Notify Karo
            </button>
          )}
          <button onClick={onClose} style={{ ...S.btn("ghost", { opacity:.5, fontSize:12 }) }}>
            Baad mein karoonga
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <p style={{ fontSize:13, color:C.muted, textAlign:"center" }}>
            {customerSent ? "✅ Customer ko message chala gaya!" : "Customer step skip kiya"} — Ab brand team ko notify karo
          </p>
          <button onClick={handleBrand}
            style={{ ...S.btn("gold", { padding:"14px", fontSize:14, width:"100%" }) }}>
            {brandSent ? "✓ Brand WA Opened!" : "🏪 Brand Team Ko Notify Karo"}
          </button>
          <button onClick={()=>setStep(3)} style={{ ...S.btn("ghost", { opacity:.5, fontSize:12 }) }}>
            Skip
          </button>
        </div>
      )}

      {step === 3 && (
        <div style={{ textAlign:"center" }}>
          <p style={{ fontSize:13, color:C.muted, marginBottom:16 }}>
            {customerSent && brandSent ? "✅ Customer aur Brand dono ko notify kar diya!" :
             customerSent ? "✅ Customer notify ho gaya" :
             brandSent   ? "✅ Brand notify ho gaya" : "Order saved hai"}
          </p>
          <button onClick={onClose} style={{ ...S.btn("gold", { padding:"12px 40px", fontSize:14 }) }}>
            🎉 Done — Order Close Karo
          </button>
        </div>
      )}
    </Modal>
  );
}

// ─── LEVEL UNLOCK POPUP ───────────────────────────────────────────────────────
function LevelUnlockPopup({ level, onClose }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ textAlign:"center", padding:"10px 0" }}>
        <div style={{ fontSize:64, marginBottom:12, animation:"float 1.5s ease infinite" }}>
          {level.icon}
        </div>
        <h2 style={{ ...S.heading(22), color:level.color, marginBottom:8 }}>
          {level.name} Level Unlock! 🎉
        </h2>
        <p style={{ color:C.muted, marginBottom:20, fontFamily:"Cormorant Garamond, serif",
          fontStyle:"italic", fontSize:16 }}>Mubarak ho!</p>
        <div style={{ ...S.serif(56, { color:level.color, marginBottom:8 }) }}>
          {level.discountPct}%
        </div>
        <p style={{ color:C.cream, fontSize:15, marginBottom:28 }}>
          Discount mil gayi aapko ✨
        </p>
        <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
          <a href={`${WEBSITE_URL}?discount=${level.discountPct}&level=${level.name.toLowerCase()}`}
            target="_blank" rel="noreferrer"
            style={{ ...S.btn("gold"), textDecoration:"none" }}>🛍️ Shop Now</a>
          <button onClick={onClose} style={S.btn("ghost")}>Later</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── DASHBOARD TAB ────────────────────────────────────────────────────────────
function DashboardTab({ orders, products, user, role, points, orderCount, tasks, setTasks, access, db }) {
  const lvl = getLoyaltyLevel(points);
  const nextLvl = LOYALTY_LEVELS.find(l => l.min > points);
  const totalRev = orders.reduce((a,o) => a + Number(o.revenue||0), 0);
  const now = new Date();
  const thisMonth = orders.filter(o => {
    const d = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt||0);
    return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear();
  }).reduce((a,o)=>a+Number(o.revenue||0),0);
  const totalStock = products.reduce((a,p)=>a+Number(p.stock||0),0);
  const totalSold  = products.reduce((a,p)=>a+Number(p.sold||0),0);
  const myOrders   = orders.filter(o=>o.addedById===user?.uid);

  // ── NEW: Low Stock Detection ──────────────────────────────────────────────
  const lowStockProducts = products.filter(p => Number(p.stock || 0) < 10);

  // ── NEW: Daily Summary ────────────────────────────────────────────────────
  const todayOrders = orders.filter(o => {
    const d = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt || 0);
    return d.toDateString() === now.toDateString();
  });
  const todayRev      = todayOrders.reduce((a, o) => a + Number(o.revenue || 0), 0);
  const todayPending  = todayOrders.filter(o => o.status === "pending").length;
  const todayDelivered= todayOrders.filter(o => o.status === "delivered").length;
  const topProductMap = todayOrders.reduce((acc, o) => {
    acc[o.product] = (acc[o.product] || 0) + Number(o.qty || 1);
    return acc;
  }, {});
  const topProd = Object.entries(topProductMap).sort((a, b) => b[1] - a[1])[0];

  const kpis = [
    { icon:"💰", label:"Total Revenue",    value:fmtRs(totalRev),       color:C.gold  },
    { icon:"📅", label:"This Month",       value:fmtRs(thisMonth),      color:C.green },
    { icon:"🧴", label:"Total Stock",      value:`${totalStock} Bottles`,color:C.blue },
    { icon:"📦", label:"Total Sold",       value:`${totalSold} Units`,  color:C.purple},
    { icon:"⭐", label:"My Points",        value:`${points} pts`,       color:lvl?lvl.color:C.muted },
    { icon:"✍️", label:"My Orders",        value:`${myOrders.length} added`, color:"#fb923c" },
  ];

  const doneTasks = tasks.filter(t=>t.done).length;

  const saveTask = async (updated) => {
    setTasks(updated);
    if (!db) return;
    try { await fsUpdate(fsDoc(db,"meta","tasks"), { list: updated }); } catch{}
  };

  return (
    <div className="fadeUp" style={{ padding:"24px", display:"flex", flexDirection:"column", gap:24 }}>

      {/* ── NEW: Low Stock Alert Banner ─────────────────────────────────── */}
      {lowStockProducts.length > 0 && (
        <div style={{
          padding:"14px 18px",
          background:"rgba(239,68,68,0.07)",
          border:"1px solid rgba(239,68,68,0.35)",
          borderRadius:12,
          display:"flex", alignItems:"center", gap:14, flexWrap:"wrap",
          animation:"fadeUp .3s ease"
        }}>
          <span style={{ fontSize:28 }}>⚠️</span>
          <div style={{ flex:1 }}>
            <p style={{ fontWeight:700, color:C.red, fontSize:14, marginBottom:6 }}>
              Low Stock Alert — {lowStockProducts.length} product{lowStockProducts.length > 1 ? "s" : ""} ki stock kam hai!
            </p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {lowStockProducts.map(p => (
                <span key={p.id} style={{ ...S.badge(C.red), fontSize:11 }}>
                  {p.emoji} {p.name}: {p.stock} left
                </span>
              ))}
            </div>
          </div>
          <span style={{ fontSize:11, color:C.red, opacity:.7 }}>
            Inventory tab se stock update karo →
          </span>
        </div>
      )}

      {/* KPI Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:16 }}>
        {kpis.map(k => (
          <div key={k.label} className="card-hover" style={{ ...S.card(), textAlign:"center" }}>
            <div style={{ fontSize:26, marginBottom:8 }}>{k.icon}</div>
            <div style={{ ...S.serif(22, { color:k.color }), marginBottom:4 }}>{k.value}</div>
            <div style={{ fontSize:12, color:C.muted }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Loyalty Status */}
      {(lvl || orderCount >= 0) && (
        <div style={{ ...S.card({ border:`1px solid ${C.gold}33`, background:`${C.gold}08` }) }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
            <div>
              <h3 style={{ ...S.heading(15), marginBottom:8 }}>
                {lvl ? `${lvl.icon} ${lvl.name} Member` : "🎯 Start Earning"}
              </h3>
              {lvl && <p style={{ color:C.muted, fontSize:13 }}>
                {lvl.discountPct}% discount on purchases · {lvl.pointsPerOrder} pts/order
              </p>}
              {!lvl && <p style={{ color:C.muted, fontSize:13 }}>
                10 orders complete karo Bronze level unlock karne ke liye
              </p>}
            </div>
            {lvl && (
              <a href={`${WEBSITE_URL}?discount=${lvl.discountPct}&level=${lvl.name.toLowerCase()}`}
                target="_blank" rel="noreferrer"
                style={{ ...S.btn("gold"), textDecoration:"none" }}>
                🎁 Redeem {lvl.discountPct}% Off
              </a>
            )}
          </div>
          <div style={{ marginTop:16 }}>
            {nextLvl
              ? <ProgressBar pct={(points/nextLvl.min)*100} color={lvl?.color||C.gold}
                  label={`${points} / ${nextLvl.min} pts → ${nextLvl.name}`} />
              : <ProgressBar pct={100} color={C.gold} label="Maximum level reached! 🥇" />
            }
          </div>
        </div>
      )}

      {/* Two columns */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
        {/* Launch Checklist */}
        <div style={S.card()}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h3 style={S.heading(14)}>🚀 Launch Checklist</h3>
            <span style={{ fontSize:13, color:C.gold }}>{doneTasks}/{tasks.length}</span>
          </div>
          <ProgressBar pct={(doneTasks/Math.max(1,tasks.length))*100} />
          <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:8 }}>
            {tasks.map(t => (
              <div key={t.id} onClick={()=>access.admin && saveTask(tasks.map(x=>x.id===t.id?{...x,done:!x.done}:x))}
                style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px",
                  borderRadius:8, background:"rgba(255,255,255,0.02)",
                  cursor:access.admin?"pointer":"default",
                  opacity:t.done?.6:1, transition:"all .2s" }}>
                <span style={{ color:t.done?C.green:C.muted, fontSize:16 }}>
                  {t.done?"✓":"○"}
                </span>
                <span style={{ flex:1, fontSize:13, textDecoration:t.done?"line-through":"none",
                  color:t.done?C.muted:C.cream }}>{t.text}</span>
                <span style={{ ...S.badge(t.priority==="high"?C.red:t.priority==="medium"?"#fbbf24":C.green),
                  fontSize:10 }}>{t.priority}</span>
              </div>
            ))}
          </div>
          {access.admin && (
            <AddTaskInline tasks={tasks} setTasks={saveTask} />
          )}
        </div>

        {/* Recent Orders */}
        <div style={S.card()}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <h3 style={S.heading(14)}>📋 Recent Orders</h3>
          </div>
          {orders.length===0
            ? <p style={{ color:C.muted, fontSize:13, textAlign:"center", padding:20 }}>Abhi koi order nahi</p>
            : orders.slice(0,8).map(o=>(
              <div key={o.orderId} style={{ display:"flex", justifyContent:"space-between",
                alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                <div>
                  <p style={{ fontSize:13, fontWeight:600 }}>{o.product} × {o.qty}</p>
                  <p style={{ fontSize:11, color:C.muted }}>{o.customer}</p>
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ ...S.serif(14, { color:C.gold }) }}>{fmtRs(o.revenue)}</span>
                  {access.waNotify && o.phone && (
                    <a href={`https://wa.me/92${o.phone.replace(/^0/,"").replace(/\D/g,"")}?text=${encodeURIComponent(buildCustomerMsg(o))}`}
                      target="_blank" rel="noreferrer" title="Customer ko WA message bhejo"
                      style={{ fontSize:16, cursor:"pointer", textDecoration:"none" }}>📱</a>
                  )}
                </div>
              </div>
            ))
          }
        </div>
      </div>

      {/* ── NEW: Daily Summary ───────────────────────────────────────────── */}
      <div style={S.card()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h3 style={S.heading(14)}>📅 Aaj Ka Summary</h3>
          <span style={{ fontSize:11, color:C.muted }}>
            {now.toLocaleDateString("en-PK", { weekday:"long", day:"numeric", month:"long" })}
          </span>
        </div>
        {todayOrders.length === 0 ? (
          <p style={{ color:C.muted, fontSize:13, textAlign:"center", padding:"16px 0" }}>
            Aaj abhi koi order nahi aaya 🌙
          </p>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))", gap:12 }}>
            {[
              { icon:"📦", label:"Aaj Orders",   value:todayOrders.length,  color:C.blue   },
              { icon:"💰", label:"Aaj Revenue",  value:fmtRs(todayRev),     color:C.gold   },
              { icon:"🕐", label:"Pending",      value:todayPending,        color:"#fbbf24"},
              { icon:"✅", label:"Delivered",    value:todayDelivered,      color:C.green  },
              ...(topProd ? [{ icon:"🏆", label:"Top Product", value:topProd[0], color:C.purple }] : []),
            ].map(k => (
              <div key={k.label} style={{ textAlign:"center", padding:"12px 8px",
                background:"rgba(255,255,255,0.02)", borderRadius:10 }}>
                <div style={{ fontSize:22, marginBottom:6 }}>{k.icon}</div>
                <div style={{ fontSize:13, fontWeight:700, color:k.color, marginBottom:2 }}>{k.value}</div>
                <div style={{ fontSize:10, color:C.muted }}>{k.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

function AddTaskInline({ tasks, setTasks }) {
  const [text, setText] = useState("");
  const [pri,  setPri]  = useState("medium");
  const add = () => {
    if (!text.trim()) return;
    setTasks([...tasks, { id:"t"+Date.now(), text:text.trim(), done:false, priority:pri }]);
    setText("");
  };
  return (
    <div style={{ display:"flex", gap:8, marginTop:14 }}>
      <input style={{ ...S.input(), flex:1, fontSize:12 }} placeholder="New task..."
        value={text} onChange={e=>setText(e.target.value)}
        onKeyDown={e=>e.key==="Enter"&&add()} />
      <select value={pri} onChange={e=>setPri(e.target.value)} style={{ ...S.select(), fontSize:12 }}>
        <option value="high">High</option>
        <option value="medium">Med</option>
        <option value="low">Low</option>
      </select>
      <button onClick={add} style={S.btn("gold",{padding:"8px 14px"})}>+</button>
    </div>
  );
}

// ─── INVENTORY TAB ────────────────────────────────────────────────────────────
function InventoryTab({ products, setProducts, access, db }) {
  const totalStock = products.reduce((a,p)=>a+Number(p.stock||0),0);
  const totalSold  = products.reduce((a,p)=>a+Number(p.sold||0),0);
  const lowStock   = products.filter(p=>Number(p.stock||0)<10).length;

  const updateStock = async (id, val) => {
    const updated = products.map(p=>p.id===id?{...p,stock:Number(val)}:p);
    setProducts(updated);
    if (!db) return;
    try { await fsUpdate(fsDoc(db,"meta","products"), { list:updated }); } catch{}
  };

  return (
    <div className="fadeUp" style={{ padding:24, display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:16 }}>
        {[
          { icon:"🧴", label:"Total Stock",   value:`${totalStock}`,  color:C.blue },
          { icon:"📤", label:"Total Sold",    value:`${totalSold}`,   color:C.purple },
          { icon:"✦",  label:"Products",      value:`${products.length}`, color:C.gold },
          { icon:"⚠️", label:"Low Stock",     value:`${lowStock}`,    color:C.red },
        ].map(k=>(
          <div key={k.label} className="card-hover" style={{ ...S.card(), textAlign:"center" }}>
            <div style={{ fontSize:26, marginBottom:6 }}>{k.icon}</div>
            <div style={{ ...S.serif(26, { color:k.color }) }}>{k.value}</div>
            <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={S.card()}>
        <h3 style={{ ...S.heading(14), marginBottom:20 }}>📊 Stock Tracker</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {products.map(p => {
            const total = Number(p.stock||0) + Number(p.sold||0);
            const stockPct = total>0 ? (Number(p.stock||0)/total)*100 : 0;
            const soldPct  = total>0 ? (Number(p.sold||0)/total)*100  : 0;
            const isLow = Number(p.stock||0)<10;
            return (
              <div key={p.id} style={{ display:"flex", gap:16, alignItems:"center", flexWrap:"wrap" }}>
                <div style={{ minWidth:180, display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:22 }}>{p.emoji}</span>
                  <div>
                    <p style={{ fontSize:13, fontWeight:600 }}>{p.name}</p>
                    <p style={{ fontSize:11, color:C.muted }}>{p.gender}</p>
                  </div>
                </div>
                <div style={{ flex:1, minWidth:200 }}>
                  <div style={{ display:"flex", gap:4, marginBottom:4 }}>
                    <div style={{ flex:stockPct, height:6, background:`${C.green}cc`,
                      borderRadius:"4px 0 0 4px", minWidth:stockPct>0?4:0 }} />
                    <div style={{ flex:soldPct, height:6, background:`${C.gold}cc`,
                      borderRadius:"0 4px 4px 0", minWidth:soldPct>0?4:0 }} />
                  </div>
                  <div style={{ display:"flex", gap:12, fontSize:11, color:C.muted }}>
                    <span style={{ color:C.green }}>● {p.stock} left</span>
                    <span style={{ color:C.gold }}>● {p.sold} sold</span>
                  </div>
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  {isLow && <span style={{ ...S.badge(C.red), animation:"pulse 1.5s ease infinite", fontSize:10 }}>LOW</span>}
                  {access.inventoryEdit && (
                    <input type="number" min="0" value={p.stock}
                      onChange={e=>updateStock(p.id,e.target.value)}
                      style={{ ...S.input({ width:70, fontSize:12, padding:"6px 8px" }) }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))", gap:16 }}>
        {products.map(p=>(
          <div key={p.id} className="card-hover" style={S.card()}>
            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:12 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:`${p.color}22`,
                border:`1px solid ${p.color}44`, display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:20 }}>{p.emoji}</div>
              <div>
                <p style={S.heading(13)}>{p.name}</p>
                <p style={{ fontSize:11, color:C.muted, fontStyle:"italic" }}>{p.subtitle}</p>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
              {[["Stock",p.stock,C.green],["Sold",p.sold,C.gold],["Price",fmtRs(p.price),C.blue]].map(([l,v,c])=>(
                <div key={l} style={{ textAlign:"center", padding:"8px 4px",
                  background:"rgba(255,255,255,0.02)", borderRadius:8 }}>
                  <div style={{ ...S.serif(16, { color:c }) }}>{v}</div>
                  <div style={{ fontSize:10, color:C.muted }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PRODUCTS TAB ─────────────────────────────────────────────────────────────
function ProductsTab({ products, setProducts, access, db }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:"",subtitle:"",story:"",vibe:"",top:"",heart:"",base:"",longevity:"",season:"",occasion:"",price:0,stock:50,gender:"Unisex",emoji:"✦" });
  const [editId, setEditId] = useState(null);
  const [editPrice, setEditPrice] = useState({});

  const savePrice = async (id, val) => {
    const updated = products.map(p=>p.id===id?{...p,price:Number(val)}:p);
    setProducts(updated);
    setEditPrice(ep=>({...ep,[id]:false}));
    if (!db) return;
    try { await fsUpdate(fsDoc(db,"meta","products"),{list:updated}); } catch{}
  };

  const addProduct = async () => {
    if (!form.name.trim()) return;
    const newP = { ...form, id:"p"+Date.now(), color:C.gold, sold:0 };
    const updated = [...products, newP];
    setProducts(updated);
    setShowAdd(false);
    setForm({ name:"",subtitle:"",story:"",vibe:"",top:"",heart:"",base:"",longevity:"",season:"",occasion:"",price:0,stock:50,gender:"Unisex",emoji:"✦" });
    if (!db) return;
    try { await fsUpdate(fsDoc(db,"meta","products"),{list:updated}); } catch{}
  };

  const genderColor = g => g==="Men"?C.blue:g==="Women"?C.pink:C.purple;

  return (
    <div className="fadeUp" style={{ padding:24 }}>
      {access.productsEdit && (
        <div style={{ marginBottom:24 }}>
          <button onClick={()=>setShowAdd(!showAdd)}
            style={{ ...S.btn("ghost"), marginBottom: showAdd?16:0 }}>
            {showAdd?"✕ Close":"+ Add New Product"}
          </button>
          {showAdd && (
            <div style={{ ...S.card(), animation:"fadeUp .3s ease" }}>
              <h3 style={{ ...S.heading(14), marginBottom:16 }}>New Product</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12 }}>
                {[["name","Name"],["subtitle","Subtitle"],["story","Story"],["vibe","Vibe"],
                  ["top","Top Notes"],["heart","Heart Notes"],["base","Base Notes"],
                  ["longevity","Longevity"],["season","Season"],["occasion","Occasion"],["emoji","Emoji"]].map(([k,l])=>(
                  <div key={k}>
                    <span style={S.label()}>{l}</span>
                    <input style={S.input()} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} />
                  </div>
                ))}
                <div>
                  <span style={S.label()}>Gender</span>
                  <select value={form.gender} onChange={e=>setForm(f=>({...f,gender:e.target.value}))} style={{ ...S.select(), width:"100%" }}>
                    <option>Men</option><option>Women</option><option>Unisex</option>
                  </select>
                </div>
                <div>
                  <span style={S.label()}>Price (Rs.)</span>
                  <input type="number" style={S.input()} value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} />
                </div>
                <div>
                  <span style={S.label()}>Stock</span>
                  <input type="number" style={S.input()} value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))} />
                </div>
              </div>
              <div style={{ display:"flex", gap:10, marginTop:16 }}>
                <button onClick={addProduct} style={S.btn("gold")}>Save Product</button>
                <button onClick={()=>setShowAdd(false)} style={S.btn("ghost")}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:20 }}>
        {products.map(p=>(
          <div key={p.id} className="card-hover" style={S.card()}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ width:50, height:50, borderRadius:12, background:`${p.color}20`,
                border:`1px solid ${p.color}40`, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:24 }}>{p.emoji}</div>
              <span style={S.badge(genderColor(p.gender))}>{p.gender}</span>
            </div>
            <h3 style={{ ...S.heading(16), marginBottom:4 }}>{p.name}</h3>
            <p style={{ fontFamily:"Cormorant Garamond, serif", fontStyle:"italic",
              color:C.muted, fontSize:14, marginBottom:10 }}>{p.subtitle}</p>
            <p style={{ fontSize:12, color:C.muted, fontStyle:"italic", marginBottom:12,
              borderLeft:`2px solid ${C.gold}40`, paddingLeft:10 }}>{p.story}</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:12 }}>
              {(p.vibe||"").split("·").map(v=>v.trim()).filter(Boolean).map(v=>(
                <span key={v} style={S.pill()}>{v}</span>
              ))}
            </div>
            {[["Top",p.top],["Heart",p.heart],["Base",p.base]].map(([l,v])=>(
              <p key={l} style={{ fontSize:12, marginBottom:4 }}>
                <span style={{ color:C.gold, fontWeight:600 }}>{l}: </span>
                <span style={{ color:C.muted }}>{v}</span>
              </p>
            ))}
            <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:10 }}>
              {[p.longevity,p.season,p.occasion].filter(Boolean).map(tag=>(
                <span key={tag} style={{ ...S.badge(C.muted), fontSize:10 }}>{tag}</span>
              ))}
            </div>
            <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${C.border}`,
              display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                {access.productsEdit && editPrice[p.id]
                  ? <div style={{ display:"flex", gap:6 }}>
                      <input type="number" defaultValue={p.price}
                        style={{ ...S.input({ width:80, fontSize:12, padding:"4px 8px" }) }}
                        onBlur={e=>savePrice(p.id, e.target.value)}
                        onKeyDown={e=>e.key==="Enter"&&savePrice(p.id,e.target.value)}
                        autoFocus />
                    </div>
                  : <span
                      onClick={()=>access.productsEdit&&setEditPrice(ep=>({...ep,[p.id]:true}))}
                      title={access.productsEdit?"Click to edit":""}
                      style={{ cursor:access.productsEdit?"pointer":"default",
                        ...S.serif(18, { color:C.gold }) }}>
                      {p.price>0 ? fmtRs(p.price) : "Price TBD"}
                    </span>
                }
              </div>
              <div>
                <ProgressBar pct={p.stock>0?(p.stock/(p.stock+p.sold||1))*100:0}
                  color={p.stock<10?C.red:C.green} height={3} />
                <p style={{ fontSize:10, color:C.muted, textAlign:"right", marginTop:2 }}>
                  {p.stock} in stock
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NEW: CUSTOMER LOYALTY TRACKER TAB ───────────────────────────────────────
function CustomerLoyaltyTab({ orders, access }) {
  const [search, setSearch] = useState("");

  // Auto-build customer profiles from orders
  const customerMap = {};
  orders.forEach(o => {
    const key = (o.phone || o.customer || "").toLowerCase().trim();
    if (!key) return;
    if (!customerMap[key]) {
      customerMap[key] = {
        name: o.customer,
        phone: o.phone || "",
        orders: [],
        totalSpent: 0,
      };
    }
    customerMap[key].orders.push(o);
    customerMap[key].totalSpent += Number(o.revenue || 0);
  });

  const customers = Object.values(customerMap)
    .sort((a, b) => b.orders.length - a.orders.length);

  const getTier = (count) => {
    if (count >= 5) return { label:"🥇 Gold VIP",  color:C.gold    };
    if (count >= 3) return { label:"🥈 Silver",    color:"#C0C0C0" };
    if (count >= 2) return { label:"🥉 Bronze",    color:"#CD7F32" };
    return               { label:"🆕 New",         color:C.muted   };
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const repeatCount = customers.filter(c => c.orders.length > 1).length;

  return (
    <div className="fadeUp" style={{ padding:24, display:"flex", flexDirection:"column", gap:20 }}>

      {/* Summary Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:16 }}>
        {[
          { icon:"👥", label:"Total Customers",   value:customers.length,                                        color:C.blue    },
          { icon:"🔄", label:"Repeat Customers",  value:repeatCount,                                             color:C.gold    },
          { icon:"🥇", label:"Gold VIP (5+ orders)", value:customers.filter(c=>c.orders.length>=5).length,       color:C.gold    },
          { icon:"🥈", label:"Silver (3-4 orders)", value:customers.filter(c=>c.orders.length>=3&&c.orders.length<5).length, color:"#C0C0C0" },
        ].map(k => (
          <div key={k.label} className="card-hover" style={{ ...S.card(), textAlign:"center" }}>
            <div style={{ fontSize:26, marginBottom:6 }}>{k.icon}</div>
            <div style={{ ...S.serif(24, { color:k.color }) }}>{k.value}</div>
            <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <input
        style={S.input({ maxWidth:360 })}
        placeholder="🔍 Customer naam ya phone se dhundho..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Customer List */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.length === 0 && (
          <p style={{ color:C.muted, fontSize:13, textAlign:"center", padding:30 }}>
            {orders.length === 0 ? "Abhi koi orders nahi hain" : "Koi customer nahi mila"}
          </p>
        )}
        {filtered.map((c, i) => {
          const tier  = getTier(c.orders.length);
          const waNum = c.phone
            ? "92" + c.phone.replace(/^0/, "").replace(/\D/g, "")
            : null;
          const lastOrder = c.orders[c.orders.length - 1];
          return (
            <div key={i} className="card-hover" style={S.card()}>
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"center", flexWrap:"wrap", gap:10 }}>
                <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                  <div style={{ width:42, height:42, borderRadius:"50%",
                    background:`${C.gold}15`, border:`1px solid ${C.gold}30`,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
                    👤
                  </div>
                  <div>
                    <p style={{ fontWeight:600, fontSize:14 }}>{c.name}</p>
                    <p style={{ fontSize:12, color:C.muted }}>{c.phone || "Phone nahi"}</p>
                  </div>
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                  <span style={S.badge(tier.color)}>{tier.label}</span>
                  <span style={{ ...S.serif(14, { color:C.gold }) }}>{fmtRs(c.totalSpent)}</span>
                  <span style={S.badge(C.blue)}>{c.orders.length} orders</span>
                  {waNum && (
                    <a href={`https://wa.me/${waNum}`} target="_blank" rel="noreferrer"
                      style={{ ...S.btn("green", { padding:"5px 12px", fontSize:11, textDecoration:"none" }) }}>
                      💬 WA
                    </a>
                  )}
                </div>
              </div>

              {/* Order History Pills */}
              <div style={{ marginTop:12, display:"flex", gap:6, flexWrap:"wrap" }}>
                {c.orders.slice(-5).map((o, j) => (
                  <span key={j} style={{ ...S.pill({ fontSize:10 }) }}>
                    {o.product} · {fmtRs(o.revenue)}
                  </span>
                ))}
                {c.orders.length > 5 && (
                  <span style={{ ...S.pill({ fontSize:10, opacity:.6 }) }}>
                    +{c.orders.length - 5} more
                  </span>
                )}
              </div>

              {/* Last order info */}
              {lastOrder && (
                <p style={{ fontSize:11, color:C.muted, marginTop:8 }}>
                  Last order: {lastOrder.orderId} · {lastOrder.channel}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ─── SALES ANALYTICS TAB ──────────────────────────────────────────────────────
function SalesAnalyticsTab({ orders, products }) {
  const now = new Date();

  // Monthly revenue last 6 months
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("en-PK", { month: "short", year: "2-digit" });
    const rev = orders.filter(o => {
      const od = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt || 0);
      return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
    }).reduce((a, o) => a + Number(o.revenue || 0), 0);
    const count = orders.filter(o => {
      const od = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt || 0);
      return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
    }).length;
    monthlyData.push({ label, rev, count });
  }
  const maxRev = Math.max(...monthlyData.map(m => m.rev), 1);

  // Best selling products
  const productSales = {};
  orders.forEach(o => {
    productSales[o.product] = (productSales[o.product] || 0) + Number(o.qty || 1);
  });
  const bestSellers = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxSold = Math.max(...bestSellers.map(b => b[1]), 1);

  // Channel breakdown
  const channelData = {};
  orders.forEach(o => { channelData[o.channel] = (channelData[o.channel] || 0) + 1; });
  const totalOrds = orders.length || 1;
  const channelColors = {
    Instagram: "#E1306C", WhatsApp: "#25D366", Website: C.gold,
    Facebook: "#1877F2", TikTok: C.cream, "Walk-in": C.purple,
  };

  // KPIs
  const totalRev = orders.reduce((a, o) => a + Number(o.revenue || 0), 0);
  const thisMonthRev = orders.filter(o => {
    const d = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt || 0);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((a, o) => a + Number(o.revenue || 0), 0);
  const avgOrder = orders.length ? Math.round(totalRev / orders.length) : 0;
  const deliveredCount = orders.filter(o => o.status === "delivered").length;
  const convRate = orders.length ? Math.round((deliveredCount / orders.length) * 100) : 0;

  return (
    <div className="fadeUp" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16 }}>
        {[
          { icon: "💰", label: "Total Revenue",    value: fmtRs(totalRev),       color: C.gold   },
          { icon: "📅", label: "This Month",       value: fmtRs(thisMonthRev),   color: C.green  },
          { icon: "📦", label: "Total Orders",     value: orders.length,          color: C.blue   },
          { icon: "🎯", label: "Avg Order Value",  value: fmtRs(avgOrder),        color: C.purple },
          { icon: "✅", label: "Delivery Rate",    value: `${convRate}%`,         color: "#34d399"},
        ].map(k => (
          <div key={k.label} className="card-hover" style={{ ...S.card(), textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{k.icon}</div>
            <div style={{ ...S.serif(20, { color: k.color }), marginBottom: 2 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Monthly Revenue Chart */}
      <div style={S.card()}>
        <h3 style={{ ...S.heading(14), marginBottom: 20 }}>Monthly Revenue — Last 6 Months</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160, padding: "0 8px" }}>
          {monthlyData.map((m, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, color: C.gold, fontWeight: 600 }}>
                {m.rev > 0 ? `${Math.round(m.rev / 1000)}k` : ""}
              </span>
              <div style={{ width: "100%", position: "relative" }}>
                <div style={{
                  width: "100%",
                  height: Math.max(8, (m.rev / maxRev) * 120),
                  background: i === monthlyData.length - 1
                    ? goldGrad
                    : `linear-gradient(180deg, ${C.gold}60, ${C.gold}20)`,
                  borderRadius: "6px 6px 0 0",
                  transition: "height .6s ease",
                  border: i === monthlyData.length - 1 ? `1px solid ${C.gold}` : "none",
                }} />
              </div>
              <span style={{ fontSize: 10, color: C.muted }}>{m.label}</span>
              <span style={{ fontSize: 9, color: C.muted }}>{m.count} orders</span>
            </div>
          ))}
        </div>
      </div>

      {/* Best Sellers + Channel Split */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>

        {/* Best Sellers */}
        <div style={S.card()}>
          <h3 style={{ ...S.heading(14), marginBottom: 16 }}>Best Sellers</h3>
          {bestSellers.length === 0
            ? <p style={{ color: C.muted, fontSize: 13 }}>Abhi koi sales data nahi</p>
            : bestSellers.map(([name, qty], i) => {
              const prod = products.find(p => p.name === name);
              return (
                <div key={name} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ fontSize: 16 }}>{prod?.emoji || "✦"}</span>
                      <span style={{ fontWeight: i === 0 ? 700 : 400 }}>{name}</span>
                      {i === 0 && <span style={{ ...S.badge(C.gold), fontSize: 9 }}>TOP</span>}
                    </span>
                    <span style={{ fontSize: 12, color: C.gold, fontWeight: 600 }}>{qty} sold</span>
                  </div>
                  <div style={{ background: `${C.gold}15`, borderRadius: 4, height: 5, overflow: "hidden" }}>
                    <div style={{ width: `${(qty / maxSold) * 100}%`, height: "100%",
                      background: i === 0 ? goldGrad : `${C.gold}60`, borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
        </div>

        {/* Channel Breakdown */}
        <div style={S.card()}>
          <h3 style={{ ...S.heading(14), marginBottom: 16 }}>Orders by Channel</h3>
          {Object.entries(channelData).length === 0
            ? <p style={{ color: C.muted, fontSize: 13 }}>Abhi koi data nahi</p>
            : Object.entries(channelData)
                .sort((a, b) => b[1] - a[1])
                .map(([ch, cnt]) => (
                  <div key={ch} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{ch}</span>
                      <span style={{ fontSize: 12, color: channelColors[ch] || C.muted, fontWeight: 600 }}>
                        {cnt} orders ({Math.round((cnt / totalOrds) * 100)}%)
                      </span>
                    </div>
                    <div style={{ background: `${C.gold}15`, borderRadius: 4, height: 5, overflow: "hidden" }}>
                      <div style={{ width: `${(cnt / totalOrds) * 100}%`, height: "100%",
                        background: channelColors[ch] || C.gold, borderRadius: 4 }} />
                    </div>
                  </div>
                ))
          }
        </div>
      </div>

      {/* Status Breakdown */}
      <div style={S.card()}>
        <h3 style={{ ...S.heading(14), marginBottom: 16 }}>Order Status Breakdown</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 12 }}>
          {[
            { key: "pending",    label: "Pending",    color: "#fbbf24" },
            { key: "confirmed",  label: "Confirmed",  color: C.blue    },
            { key: "packed",     label: "Packed",     color: C.pink    },
            { key: "dispatched", label: "Dispatched", color: C.purple  },
            { key: "delivered",  label: "Delivered",  color: C.green   },
          ].map(s => {
            const cnt = orders.filter(o => o.status === s.key).length;
            const pct = orders.length ? Math.round((cnt / orders.length) * 100) : 0;
            return (
              <div key={s.key} style={{ textAlign: "center", padding: "12px 8px",
                background: `${s.color}10`, borderRadius: 10, border: `1px solid ${s.color}25` }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color, marginBottom: 4 }}>{cnt}</div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: s.color }}>{pct}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── EXPENSE TRACKER TAB ──────────────────────────────────────────────────────
function ExpenseTrackerTab({ orders, db, access }) {
  const [expenses, setExpenses]   = useState([]);
  const [showForm, setShowForm]   = useState(false);
  const [loading,  setLoading]    = useState(true);
  const [form, setForm] = useState({
    title: "", amount: "", category: "Packaging", date: new Date().toISOString().split("T")[0], notes: ""
  });

  const CATEGORIES = ["Packaging", "Raw Material", "Marketing", "Delivery", "Salary", "Equipment", "Misc"];
  const CAT_COLORS = {
    Packaging: C.blue, "Raw Material": C.purple, Marketing: "#E1306C",
    Delivery: C.gold, Salary: C.green, Equipment: C.pink, Misc: C.muted,
  };

  useEffect(() => {
    const load = async () => {
      if (!db) { setLoading(false); return; }
      try {
        const snap = await fsGet(fsDoc(db, "meta", "expenses"));
        if (snap.exists()) setExpenses(snap.data().list || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, [db]);

  const saveExpenses = async (updated) => {
    setExpenses(updated);
    if (!db) return;
    try {
      await fsUpdate(fsDoc(db, "meta", "expenses"), { list: updated });
    } catch {
      try { await fsSet(fsDoc(db, "meta", "expenses"), { list: updated }); } catch {}
    }
  };

  const addExpense = async () => {
    if (!form.title.trim() || !form.amount) return;
    const newExp = { ...form, id: "exp" + Date.now(), amount: Number(form.amount) };
    await saveExpenses([newExp, ...expenses]);
    setForm({ title: "", amount: "", category: "Packaging", date: new Date().toISOString().split("T")[0], notes: "" });
    setShowForm(false);
  };

  const deleteExpense = async (id) => {
    await saveExpenses(expenses.filter(e => e.id !== id));
  };

  const totalExpenses = expenses.reduce((a, e) => a + Number(e.amount || 0), 0);
  const totalRevenue  = orders.reduce((a, o) => a + Number(o.revenue || 0), 0);
  const netProfit     = totalRevenue - totalExpenses;
  const margin        = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  const catTotals = {};
  expenses.forEach(e => { catTotals[e.category] = (catTotals[e.category] || 0) + Number(e.amount || 0); });

  if (loading) return <Spinner center />;

  return (
    <div className="fadeUp" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
      {/* P&L Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16 }}>
        {[
          { icon: "💰", label: "Total Revenue",  value: fmtRs(totalRevenue),  color: C.gold  },
          { icon: "💸", label: "Total Expenses", value: fmtRs(totalExpenses), color: C.red   },
          { icon: netProfit >= 0 ? "📈" : "📉", label: "Net Profit", value: fmtRs(netProfit), color: netProfit >= 0 ? C.green : C.red },
          { icon: "📊", label: "Profit Margin",  value: `${margin}%`,         color: margin > 30 ? C.green : margin > 10 ? C.gold : C.red },
        ].map(k => (
          <div key={k.label} className="card-hover" style={{ ...S.card(), textAlign: "center",
            border: k.label === "Net Profit" ? `1px solid ${netProfit >= 0 ? C.green : C.red}33` : undefined }}>
            <div style={{ fontSize: 26, marginBottom: 6 }}>{k.icon}</div>
            <div style={{ ...S.serif(20, { color: k.color }), marginBottom: 2 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Add Expense */}
      {access.expenses && (
        <div>
          <button onClick={() => setShowForm(!showForm)} style={S.btn("ghost")}>
            {showForm ? "Close" : "+ Add Expense"}
          </button>
          {showForm && (
            <div style={{ ...S.card({ marginTop: 16, animation: "fadeUp .3s ease" }) }}>
              <h3 style={{ ...S.heading(13), marginBottom: 14 }}>New Expense</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
                <div>
                  <span style={S.label()}>Title *</span>
                  <input style={S.input()} placeholder="e.g. Box purchase" value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div>
                  <span style={S.label()}>Amount (Rs.) *</span>
                  <input type="number" style={S.input()} value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
                </div>
                <div>
                  <span style={S.label()}>Category</span>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    style={{ ...S.select(), width: "100%" }}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <span style={S.label()}>Date</span>
                  <input type="date" style={{ ...S.input(), colorScheme: "dark" }} value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <span style={S.label()}>Notes</span>
                  <input style={S.input()} value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button onClick={addExpense} disabled={!form.title || !form.amount}
                  style={{ ...S.btn("gold", { opacity: !form.title || !form.amount ? .5 : 1 }) }}>
                  Save Expense
                </button>
                <button onClick={() => setShowForm(false)} style={S.btn("ghost")}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Category Breakdown */}
      {Object.keys(catTotals).length > 0 && (
        <div style={S.card()}>
          <h3 style={{ ...S.heading(13), marginBottom: 14 }}>Expense by Category</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.entries(catTotals).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => (
              <div key={cat}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 13 }}>{cat}</span>
                  <span style={{ fontSize: 12, color: CAT_COLORS[cat] || C.gold, fontWeight: 600 }}>
                    {fmtRs(amt)}
                  </span>
                </div>
                <div style={{ background: `${C.gold}15`, borderRadius: 4, height: 5, overflow: "hidden" }}>
                  <div style={{ width: `${(amt / totalExpenses) * 100}%`, height: "100%",
                    background: CAT_COLORS[cat] || C.gold, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expense List */}
      <div style={S.card()}>
        <h3 style={{ ...S.heading(13), marginBottom: 14 }}>
          All Expenses
          <span style={{ fontSize: 12, color: C.muted, fontWeight: 400, marginLeft: 8 }}>
            ({expenses.length} entries)
          </span>
        </h3>
        {expenses.length === 0
          ? <p style={{ color: C.muted, fontSize: 13, textAlign: "center", padding: 24 }}>
              Abhi koi expense record nahi
            </p>
          : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {expenses.map(e => (
                <div key={e.id} style={{ display: "flex", justifyContent: "space-between",
                  alignItems: "center", padding: "10px 14px",
                  background: "rgba(255,255,255,0.02)", borderRadius: 8, flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13 }}>{e.title}</p>
                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                      <span style={{ ...S.badge(CAT_COLORS[e.category] || C.muted), fontSize: 10 }}>{e.category}</span>
                      <span style={{ fontSize: 11, color: C.muted }}>{e.date}</span>
                      {e.notes && <span style={{ fontSize: 11, color: C.muted }}>• {e.notes}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ ...S.serif(16, { color: C.red }), fontWeight: 700 }}>{fmtRs(e.amount)}</span>
                    {access.expenses && (
                      <button onClick={() => deleteExpense(e.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: C.red, fontSize: 15 }}>
                        x
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
}

// ─── TEAM PERFORMANCE TAB ─────────────────────────────────────────────────────
function TeamPerformanceTab({ orders, members, access }) {
  const now = new Date();

  // Build performance per member
  const perfMap = {};
  orders.forEach(o => {
    const key = o.addedById || o.addedBy || "unknown";
    if (!perfMap[key]) {
      perfMap[key] = {
        id: key,
        name: o.addedBy || "Unknown",
        orders: 0,
        revenue: 0,
        delivered: 0,
        thisMonth: 0,
      };
    }
    perfMap[key].orders++;
    perfMap[key].revenue += Number(o.revenue || 0);
    if (o.status === "delivered") perfMap[key].delivered++;
    const od = o.createdAt?.toDate ? o.createdAt.toDate() : new Date(o.createdAt || 0);
    if (od.getMonth() === now.getMonth() && od.getFullYear() === now.getFullYear()) {
      perfMap[key].thisMonth++;
    }
  });

  const perfList = Object.values(perfMap).sort((a, b) => b.revenue - a.revenue);
  const maxRev = Math.max(...perfList.map(p => p.revenue), 1);
  const getRank = (i) => i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;

  return (
    <div className="fadeUp" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 16 }}>
        {[
          { icon: "👥", label: "Active Members", value: perfList.length,                           color: C.blue  },
          { icon: "📦", label: "Total Orders",   value: orders.length,                             color: C.gold  },
          { icon: "💰", label: "Team Revenue",   value: fmtRs(orders.reduce((a,o)=>a+Number(o.revenue||0),0)), color: C.green },
          { icon: "📅", label: "This Month",     value: orders.filter(o=>{
              const d=o.createdAt?.toDate?o.createdAt.toDate():new Date(o.createdAt||0);
              return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();
            }).length + " orders",               color: C.purple},
        ].map(k => (
          <div key={k.label} className="card-hover" style={{ ...S.card(), textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{k.icon}</div>
            <div style={{ ...S.serif(18, { color: k.color }), marginBottom: 2 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      <div style={S.card()}>
        <h3 style={{ ...S.heading(14), marginBottom: 16 }}>Sales Leaderboard</h3>
        {perfList.length === 0
          ? <p style={{ color: C.muted, fontSize: 13, textAlign: "center", padding: 24 }}>
              Abhi koi order data nahi
            </p>
          : perfList.map((p, i) => {
            const member = members.find(m => m.uid === p.id);
            const role   = member ? (TEAM_ROLES[member.role] || TEAM_ROLES.member) : TEAM_ROLES.member;
            return (
              <div key={p.id} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 24, minWidth: 32 }}>{getRank(i)}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
                      <span style={S.badge(role.color)}>{role.label}</span>
                      <span style={S.badge(C.blue)}>{p.orders} orders</span>
                      <span style={S.badge(C.green)}>{p.delivered} delivered</span>
                      <span style={S.badge(C.purple)}>{p.thisMonth} this month</span>
                    </div>
                  </div>
                  <span style={{ ...S.serif(18, { color: C.gold }), fontWeight: 700 }}>
                    {fmtRs(p.revenue)}
                  </span>
                </div>
                <div style={{ background: `${C.gold}15`, borderRadius: 4, height: 6, overflow: "hidden" }}>
                  <div style={{ width: `${(p.revenue / maxRev) * 100}%`, height: "100%",
                    background: i === 0 ? goldGrad : `${C.gold}50`, borderRadius: 4,
                    transition: "width .6s ease" }} />
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

// ─── COUPON MANAGER TAB ───────────────────────────────────────────────────────
function CouponManagerTab({ db, access, orders }) {
  const [coupons,  setCoupons]  = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading,  setLoading]  = useState(true);
  const [copied,   setCopied]   = useState("");
  const [form, setForm] = useState({
    code: "", discount: 10, type: "percent", minOrder: 0,
    expiry: "", usageLimit: 0, description: ""
  });

  useEffect(() => {
    const load = async () => {
      if (!db) { setLoading(false); return; }
      try {
        const snap = await fsGet(fsDoc(db, "meta", "coupons"));
        if (snap.exists()) setCoupons(snap.data().list || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, [db]);

  const saveCoupons = async (updated) => {
    setCoupons(updated);
    if (!db) return;
    try {
      await fsUpdate(fsDoc(db, "meta", "coupons"), { list: updated });
    } catch {
      try { await fsSet(fsDoc(db, "meta", "coupons"), { list: updated }); } catch {}
    }
  };

  const generateCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const prefix = "ASK";
    const rand = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    setForm(f => ({ ...f, code: `${prefix}-${rand}` }));
  };

  const addCoupon = async () => {
    if (!form.code.trim()) return;
    const newC = {
      ...form,
      id: "coup" + Date.now(),
      code: form.code.toUpperCase(),
      discount: Number(form.discount),
      minOrder: Number(form.minOrder),
      usageLimit: Number(form.usageLimit),
      usedCount: 0,
      active: true,
      createdAt: new Date().toISOString().split("T")[0],
    };
    await saveCoupons([newC, ...coupons]);
    setForm({ code: "", discount: 10, type: "percent", minOrder: 0, expiry: "", usageLimit: 0, description: "" });
    setShowForm(false);
  };

  const toggleActive = async (id) => {
    await saveCoupons(coupons.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const deleteCoupon = async (id) => {
    await saveCoupons(coupons.filter(c => c.id !== id));
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(""), 2000);
  };

  const isExpired = (c) => c.expiry && new Date(c.expiry) < new Date();
  const isLimitReached = (c) => c.usageLimit > 0 && c.usedCount >= c.usageLimit;

  const activeCoupons  = coupons.filter(c => c.active && !isExpired(c) && !isLimitReached(c));
  const inactiveCoupons = coupons.filter(c => !c.active || isExpired(c) || isLimitReached(c));

  if (loading) return <Spinner center />;

  return (
    <div className="fadeUp" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 16 }}>
        {[
          { icon: "🎟", label: "Total Coupons",  value: coupons.length,          color: C.gold   },
          { icon: "✅", label: "Active",          value: activeCoupons.length,    color: C.green  },
          { icon: "⏸",  label: "Inactive/Expired",value: inactiveCoupons.length, color: C.muted  },
          { icon: "📊", label: "Total Used",      value: coupons.reduce((a,c)=>a+Number(c.usedCount||0),0), color: C.blue },
        ].map(k => (
          <div key={k.label} className="card-hover" style={{ ...S.card(), textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{k.icon}</div>
            <div style={{ ...S.serif(20, { color: k.color }), marginBottom: 2 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Add Coupon */}
      {access.coupons && (
        <div>
          <button onClick={() => setShowForm(!showForm)} style={S.btn("ghost")}>
            {showForm ? "Close" : "+ Create Coupon"}
          </button>
          {showForm && (
            <div style={{ ...S.card({ marginTop: 16, animation: "fadeUp .3s ease" }) }}>
              <h3 style={{ ...S.heading(13), marginBottom: 14 }}>New Coupon</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
                <div>
                  <span style={S.label()}>Coupon Code *</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input style={{ ...S.input(), flex: 1, textTransform: "uppercase" }}
                      placeholder="ASK-SAVE10" value={form.code}
                      onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} />
                    <button onClick={generateCode} style={{ ...S.btn("ghost", { padding: "8px 10px", fontSize: 11 }) }}>
                      Auto
                    </button>
                  </div>
                </div>
                <div>
                  <span style={S.label()}>Discount Value</span>
                  <input type="number" style={S.input()} value={form.discount}
                    onChange={e => setForm(f => ({ ...f, discount: e.target.value }))} />
                </div>
                <div>
                  <span style={S.label()}>Type</span>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    style={{ ...S.select(), width: "100%" }}>
                    <option value="percent">Percent (%)</option>
                    <option value="flat">Flat (Rs.)</option>
                  </select>
                </div>
                <div>
                  <span style={S.label()}>Min Order (Rs.)</span>
                  <input type="number" style={S.input()} value={form.minOrder}
                    onChange={e => setForm(f => ({ ...f, minOrder: e.target.value }))} />
                </div>
                <div>
                  <span style={S.label()}>Expiry Date</span>
                  <input type="date" style={{ ...S.input(), colorScheme: "dark" }} value={form.expiry}
                    onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))} />
                </div>
                <div>
                  <span style={S.label()}>Usage Limit (0 = unlimited)</span>
                  <input type="number" style={S.input()} value={form.usageLimit}
                    onChange={e => setForm(f => ({ ...f, usageLimit: e.target.value }))} />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <span style={S.label()}>Description</span>
                  <input style={S.input()} placeholder="e.g. Eid special discount"
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button onClick={addCoupon} disabled={!form.code}
                  style={{ ...S.btn("gold", { opacity: !form.code ? .5 : 1 }) }}>
                  Save Coupon
                </button>
                <button onClick={() => setShowForm(false)} style={S.btn("ghost")}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Coupons */}
      <div style={S.card()}>
        <h3 style={{ ...S.heading(13), marginBottom: 14, color: C.green }}>
          Active Coupons ({activeCoupons.length})
        </h3>
        {activeCoupons.length === 0
          ? <p style={{ color: C.muted, fontSize: 13 }}>Koi active coupon nahi</p>
          : activeCoupons.map(c => (
            <div key={c.id} style={{ padding: "12px 14px", marginBottom: 10,
              background: "rgba(52,211,153,0.04)", borderRadius: 10,
              border: `1px solid ${C.green}20`, display: "flex",
              justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700,
                    color: C.gold, letterSpacing: 1 }}>{c.code}</span>
                  <button onClick={() => copyCode(c.code)}
                    style={{ ...S.btn("ghost", { padding: "3px 8px", fontSize: 10 }) }}>
                    {copied === c.code ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ ...S.badge(C.green), fontSize: 10 }}>
                    {c.type === "percent" ? `${c.discount}% OFF` : `Rs.${c.discount} OFF`}
                  </span>
                  {c.minOrder > 0 && <span style={{ ...S.badge(C.blue), fontSize: 10 }}>Min Rs.{c.minOrder}</span>}
                  {c.expiry && <span style={{ ...S.badge(C.muted), fontSize: 10 }}>Exp: {c.expiry}</span>}
                  {c.usageLimit > 0 && (
                    <span style={{ ...S.badge(C.purple), fontSize: 10 }}>
                      {c.usedCount}/{c.usageLimit} used
                    </span>
                  )}
                </div>
                {c.description && <p style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{c.description}</p>}
              </div>
              {access.coupons && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => toggleActive(c.id)}
                    style={{ ...S.btn("ghost", { padding: "5px 10px", fontSize: 11 }) }}>Pause</button>
                  <button onClick={() => deleteCoupon(c.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: C.red, fontSize: 16 }}>x</button>
                </div>
              )}
            </div>
          ))
        }
      </div>

      {/* Inactive */}
      {inactiveCoupons.length > 0 && (
        <div style={S.card()}>
          <h3 style={{ ...S.heading(13), marginBottom: 14, color: C.muted }}>
            Inactive / Expired ({inactiveCoupons.length})
          </h3>
          {inactiveCoupons.map(c => (
            <div key={c.id} style={{ padding: "10px 14px", marginBottom: 8,
              background: "rgba(255,255,255,0.02)", borderRadius: 8, opacity: 0.6,
              display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontFamily: "monospace", fontSize: 14, color: C.muted, letterSpacing: 1 }}>
                  {c.code}
                </span>
                <span style={{ ...S.badge(isExpired(c) ? C.red : C.muted), fontSize: 10 }}>
                  {isExpired(c) ? "Expired" : isLimitReached(c) ? "Limit Reached" : "Paused"}
                </span>
              </div>
              {access.coupons && (
                <div style={{ display: "flex", gap: 8 }}>
                  {!isExpired(c) && !isLimitReached(c) && (
                    <button onClick={() => toggleActive(c.id)}
                      style={{ ...S.btn("ghost", { padding: "4px 10px", fontSize: 11 }) }}>Activate</button>
                  )}
                  <button onClick={() => deleteCoupon(c.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: C.red, fontSize: 15 }}>x</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ─── INFLUENCER TRACKER TAB ───────────────────────────────────────────────────
function InfluencerTrackerTab({ db, access, orders }) {
  const [influencers, setInfluencers] = useState([]);
  const [showForm, setShowForm]       = useState(false);
  const [loading, setLoading]         = useState(true);
  const [form, setForm] = useState({
    name:"", platform:"Instagram", handle:"", code:"", commissionPct:10,
    phone:"", category:"Micro", notes:""
  });

  const PLATFORMS = ["Instagram","TikTok","YouTube","Facebook","Snapchat"];
  const CATEGORIES = ["Nano (1k-10k)","Micro (10k-100k)","Macro (100k-1M)","Mega (1M+)"];
  const PLATFORM_COLORS = {
    Instagram:"#E1306C", TikTok:C.cream, YouTube:"#FF0000",
    Facebook:"#1877F2", Snapchat:"#FFFC00"
  };

  useEffect(() => {
    const load = async () => {
      if (!db) { setLoading(false); return; }
      try {
        const snap = await fsGet(fsDoc(db, "meta", "influencers"));
        if (snap.exists()) setInfluencers(snap.data().list || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, [db]);

  const save = async (updated) => {
    setInfluencers(updated);
    if (!db) return;
    try { await fsUpdate(fsDoc(db,"meta","influencers"),{ list:updated }); }
    catch { try { await fsSet(fsDoc(db,"meta","influencers"),{ list:updated }); } catch {} }
  };

  const addInfluencer = async () => {
    if (!form.name.trim()) return;
    const code = form.code || "ASK-" + form.name.toUpperCase().replace(/\s/g,"").slice(0,5);
    const newInf = { ...form, code, id:"inf"+Date.now(), ordersCount:0, totalSales:0, active:true };
    await save([newInf, ...influencers]);
    setForm({ name:"", platform:"Instagram", handle:"", code:"", commissionPct:10, phone:"", category:"Micro", notes:"" });
    setShowForm(false);
  };

  const updateSales = async (id, ordersCount, totalSales) => {
    await save(influencers.map(inf => inf.id===id ? {...inf, ordersCount:Number(ordersCount), totalSales:Number(totalSales)} : inf));
  };

  const toggleActive = async (id) => {
    await save(influencers.map(inf => inf.id===id ? {...inf, active:!inf.active} : inf));
  };

  const deleteInf = async (id) => { await save(influencers.filter(i => i.id!==id)); };

  const totalCommission = influencers.reduce((a,inf) =>
    a + (inf.totalSales * (inf.commissionPct/100)), 0);
  const totalSales = influencers.reduce((a,inf) => a + Number(inf.totalSales||0), 0);
  const activeCount = influencers.filter(i=>i.active).length;

  if (loading) return <Spinner center />;

  return (
    <div className="fadeUp" style={{ padding:24, display:"flex", flexDirection:"column", gap:24 }}>

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:16 }}>
        {[
          { icon:"🌟", label:"Total Influencers", value:influencers.length,   color:C.gold   },
          { icon:"✅", label:"Active",             value:activeCount,          color:C.green  },
          { icon:"💰", label:"Total Sales via Inf",value:fmtRs(totalSales),   color:C.blue   },
          { icon:"💸", label:"Total Commission",   value:fmtRs(totalCommission), color:C.red },
        ].map(k=>(
          <div key={k.label} className="card-hover" style={{ ...S.card(), textAlign:"center" }}>
            <div style={{ fontSize:24, marginBottom:6 }}>{k.icon}</div>
            <div style={{ ...S.serif(18, { color:k.color }), marginBottom:2 }}>{k.value}</div>
            <div style={{ fontSize:11, color:C.muted }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Add Form */}
      {access.expenses && (
        <div>
          <button onClick={()=>setShowForm(!showForm)} style={S.btn("ghost")}>
            {showForm ? "Close" : "+ Add Influencer"}
          </button>
          {showForm && (
            <div style={{ ...S.card({ marginTop:16, animation:"fadeUp .3s ease" }) }}>
              <h3 style={{ ...S.heading(13), marginBottom:14 }}>New Influencer / Affiliate</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12 }}>
                {[["name","Full Name *"],["handle","Handle / Username"],["phone","Phone (WhatsApp)"],["notes","Notes"]].map(([k,l])=>(
                  <div key={k}>
                    <span style={S.label()}>{l}</span>
                    <input style={S.input()} value={form[k]}
                      onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} />
                  </div>
                ))}
                <div>
                  <span style={S.label()}>Referral Code</span>
                  <input style={S.input()} placeholder="Auto-generate if empty" value={form.code}
                    onChange={e=>setForm(f=>({...f,code:e.target.value.toUpperCase()}))} />
                </div>
                <div>
                  <span style={S.label()}>Commission %</span>
                  <input type="number" style={S.input()} value={form.commissionPct}
                    onChange={e=>setForm(f=>({...f,commissionPct:e.target.value}))} />
                </div>
                <div>
                  <span style={S.label()}>Platform</span>
                  <select value={form.platform} onChange={e=>setForm(f=>({...f,platform:e.target.value}))}
                    style={{ ...S.select(), width:"100%" }}>
                    {PLATFORMS.map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <span style={S.label()}>Category</span>
                  <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}
                    style={{ ...S.select(), width:"100%" }}>
                    {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:"flex", gap:10, marginTop:14 }}>
                <button onClick={addInfluencer} disabled={!form.name}
                  style={{ ...S.btn("gold",{ opacity:!form.name?.5:1 }) }}>Save</button>
                <button onClick={()=>setShowForm(false)} style={S.btn("ghost")}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Influencer Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
        {influencers.length===0
          ? <p style={{ color:C.muted, fontSize:13, padding:24 }}>Abhi koi influencer record nahi</p>
          : influencers.map(inf=>{
            const commission = inf.totalSales * (inf.commissionPct/100);
            const pColor = PLATFORM_COLORS[inf.platform] || C.muted;
            return (
              <div key={inf.id} className="card-hover" style={{ ...S.card(),
                opacity:inf.active?1:.55,
                border:`1px solid ${inf.active?C.border:"rgba(239,68,68,0.2)"}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                  <div>
                    <p style={{ fontWeight:700, fontSize:15 }}>{inf.name}</p>
                    <div style={{ display:"flex", gap:6, marginTop:4, flexWrap:"wrap" }}>
                      <span style={{ ...S.badge(pColor), fontSize:10 }}>{inf.platform}</span>
                      <span style={{ ...S.badge(C.muted), fontSize:10 }}>{inf.category}</span>
                      {inf.handle && <span style={{ fontSize:11, color:C.muted }}>@{inf.handle}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontFamily:"monospace", fontSize:13, color:C.gold, fontWeight:700,
                      letterSpacing:1 }}>{inf.code}</p>
                    <p style={{ fontSize:11, color:C.muted }}>{inf.commissionPct}% commission</p>
                  </div>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                  <div style={{ padding:"8px 10px", background:"rgba(255,255,255,0.02)", borderRadius:8 }}>
                    <p style={{ fontSize:10, color:C.muted }}>Orders via Code</p>
                    <p style={{ fontWeight:700, color:C.blue, fontSize:16 }}>{inf.ordersCount}</p>
                  </div>
                  <div style={{ padding:"8px 10px", background:"rgba(255,255,255,0.02)", borderRadius:8 }}>
                    <p style={{ fontSize:10, color:C.muted }}>Total Sales</p>
                    <p style={{ fontWeight:700, color:C.gold, fontSize:14 }}>{fmtRs(inf.totalSales)}</p>
                  </div>
                  <div style={{ padding:"8px 10px", background:"rgba(255,255,255,0.02)", borderRadius:8 }}>
                    <p style={{ fontSize:10, color:C.muted }}>Commission Due</p>
                    <p style={{ fontWeight:700, color:C.red, fontSize:14 }}>{fmtRs(commission)}</p>
                  </div>
                  <div style={{ padding:"8px 10px", background:"rgba(255,255,255,0.02)", borderRadius:8 }}>
                    <p style={{ fontSize:10, color:C.muted }}>Net (after comm.)</p>
                    <p style={{ fontWeight:700, color:C.green, fontSize:14 }}>{fmtRs(inf.totalSales - commission)}</p>
                  </div>
                </div>

                {/* Update Sales */}
                {access.expenses && (
                  <details style={{ marginBottom:10 }}>
                    <summary style={{ fontSize:12, color:C.gold, cursor:"pointer", marginBottom:8 }}>
                      Update Sales Data
                    </summary>
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                      <div style={{ flex:1 }}>
                        <span style={S.label()}>Orders</span>
                        <input type="number" defaultValue={inf.ordersCount}
                          style={{ ...S.input({ fontSize:12 }) }}
                          onBlur={e=>updateSales(inf.id, e.target.value, inf.totalSales)} />
                      </div>
                      <div style={{ flex:1 }}>
                        <span style={S.label()}>Total Sales (Rs.)</span>
                        <input type="number" defaultValue={inf.totalSales}
                          style={{ ...S.input({ fontSize:12 }) }}
                          onBlur={e=>updateSales(inf.id, inf.ordersCount, e.target.value)} />
                      </div>
                    </div>
                  </details>
                )}

                <div style={{ display:"flex", gap:8, justifyContent:"space-between", alignItems:"center" }}>
                  {inf.phone && (
                    <a href={"https://wa.me/92"+inf.phone.replace(/^0/,"").replace(/\D/g,"")}
                      target="_blank" rel="noreferrer"
                      style={{ ...S.btn("green",{ padding:"5px 12px", fontSize:11, textDecoration:"none" }) }}>
                      WA
                    </a>
                  )}
                  {access.expenses && (
                    <div style={{ display:"flex", gap:6, marginLeft:"auto" }}>
                      <button onClick={()=>toggleActive(inf.id)}
                        style={{ ...S.btn("ghost",{ padding:"5px 10px", fontSize:11 }) }}>
                        {inf.active?"Pause":"Activate"}
                      </button>
                      <button onClick={()=>deleteInf(inf.id)}
                        style={{ background:"none", border:"none", cursor:"pointer", color:C.red, fontSize:15 }}>
                        x
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

// ─── CONTENT CALENDAR TAB ─────────────────────────────────────────────────────
function ContentCalendarTab({ db, access, role }) {
  const [posts, setPosts]       = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");
  const [form, setForm] = useState({
    title:"", platform:"Instagram", type:"Reel", date:"", caption:"",
    hashtags:"", status:"Planned", assignedTo:"", notes:""
  });

  const PLATFORMS   = ["Instagram","TikTok","YouTube","Facebook","All Platforms"];
  const POST_TYPES  = ["Reel","Post","Story","Carousel","Live","YouTube Short"];
  const STATUSES    = ["Planned","In Progress","Shot","Editing","Ready","Published"];
  const STATUS_COLORS = {
    Planned:C.muted, "In Progress":"#fbbf24", Shot:C.blue,
    Editing:C.purple, Ready:C.gold, Published:C.green
  };

  useEffect(()=>{
    const load = async () => {
      if (!db) { setLoading(false); return; }
      try {
        const snap = await fsGet(fsDoc(db,"meta","contentcal"));
        if (snap.exists()) setPosts(snap.data().list || []);
      } catch {}
      setLoading(false);
    };
    load();
  },[db]);

  const save = async (updated) => {
    setPosts(updated);
    if (!db) return;
    try { await fsUpdate(fsDoc(db,"meta","contentcal"),{ list:updated }); }
    catch { try { await fsSet(fsDoc(db,"meta","contentcal"),{ list:updated }); } catch {} }
  };

  const addPost = async () => {
    if (!form.title.trim()) return;
    const newPost = { ...form, id:"post"+Date.now() };
    await save([newPost, ...posts]);
    setForm({ title:"", platform:"Instagram", type:"Reel", date:"", caption:"",
      hashtags:"", status:"Planned", assignedTo:"", notes:"" });
    setShowForm(false);
  };

  const updateStatus = async (id, status) => {
    await save(posts.map(p => p.id===id ? {...p, status} : p));
  };

  const deletePost = async (id) => { await save(posts.filter(p=>p.id!==id)); };

  const filteredPosts = filter==="all" ? posts : posts.filter(p=>p.status===filter);

  const statusCounts = {};
  STATUSES.forEach(s => { statusCounts[s] = posts.filter(p=>p.status===s).length; });

  if (loading) return <Spinner center />;

  return (
    <div className="fadeUp" style={{ padding:24, display:"flex", flexDirection:"column", gap:24 }}>

      {/* Status Overview */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))", gap:12 }}>
        {STATUSES.map(s=>(
          <div key={s} onClick={()=>setFilter(filter===s?"all":s)}
            className="card-hover"
            style={{ ...S.card({ textAlign:"center", cursor:"pointer",
              border:`1px solid ${filter===s?STATUS_COLORS[s]:C.border}`,
              background: filter===s?`${STATUS_COLORS[s]}12`:C.card }) }}>
            <div style={{ ...S.serif(22, { color:STATUS_COLORS[s] }), marginBottom:4 }}>
              {statusCounts[s]}
            </div>
            <div style={{ fontSize:11, color:filter===s?STATUS_COLORS[s]:C.muted }}>{s}</div>
          </div>
        ))}
      </div>

      {/* Add Post */}
      {["owner","aceo","content_planner","content_shooter","social_media","marketing"].includes(role) && (
        <div>
          <button onClick={()=>setShowForm(!showForm)} style={S.btn("ghost")}>
            {showForm?"Close":"+ Add Content Post"}
          </button>
          {showForm && (
            <div style={{ ...S.card({ marginTop:16, animation:"fadeUp .3s ease" }) }}>
              <h3 style={{ ...S.heading(13), marginBottom:14 }}>New Content Post</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12 }}>
                <div style={{ gridColumn:"1/-1" }}>
                  <span style={S.label()}>Post Title / Idea *</span>
                  <input style={S.input()} placeholder="e.g. Shahkar - Morning Routine Reel"
                    value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
                </div>
                <div>
                  <span style={S.label()}>Platform</span>
                  <select value={form.platform} onChange={e=>setForm(f=>({...f,platform:e.target.value}))}
                    style={{ ...S.select(), width:"100%" }}>
                    {PLATFORMS.map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <span style={S.label()}>Content Type</span>
                  <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}
                    style={{ ...S.select(), width:"100%" }}>
                    {POST_TYPES.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <span style={S.label()}>Scheduled Date</span>
                  <input type="date" style={{ ...S.input(), colorScheme:"dark" }} value={form.date}
                    onChange={e=>setForm(f=>({...f,date:e.target.value}))} />
                </div>
                <div>
                  <span style={S.label()}>Assigned To</span>
                  <input style={S.input()} placeholder="Team member name"
                    value={form.assignedTo} onChange={e=>setForm(f=>({...f,assignedTo:e.target.value}))} />
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <span style={S.label()}>Caption Idea</span>
                  <input style={S.input()} placeholder="Post ki caption yahan..."
                    value={form.caption} onChange={e=>setForm(f=>({...f,caption:e.target.value}))} />
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <span style={S.label()}>Hashtags</span>
                  <input style={S.input()} placeholder="#askhushboo #perfume #karachi"
                    value={form.hashtags} onChange={e=>setForm(f=>({...f,hashtags:e.target.value}))} />
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <span style={S.label()}>Notes / Brief</span>
                  <input style={S.input()} value={form.notes}
                    onChange={e=>setForm(f=>({...f,notes:e.target.value}))} />
                </div>
              </div>
              <div style={{ display:"flex", gap:10, marginTop:14 }}>
                <button onClick={addPost} disabled={!form.title}
                  style={{ ...S.btn("gold",{ opacity:!form.title?.5:1 }) }}>Save Post</button>
                <button onClick={()=>setShowForm(false)} style={S.btn("ghost")}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Posts List */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filteredPosts.length===0
          ? <p style={{ color:C.muted, fontSize:13, textAlign:"center", padding:24 }}>
              {filter==="all" ? "Abhi koi content planned nahi" : `Koi ${filter} post nahi`}
            </p>
          : filteredPosts
              .sort((a,b)=> a.date && b.date ? new Date(a.date)-new Date(b.date) : 0)
              .map(post=>(
            <div key={post.id} className="card-hover" style={S.card()}>
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"flex-start", flexWrap:"wrap", gap:10 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6, flexWrap:"wrap" }}>
                    <p style={{ fontWeight:700, fontSize:14 }}>{post.title}</p>
                    <span style={{ ...S.badge(STATUS_COLORS[post.status]||C.muted), fontSize:10 }}>
                      {post.status}
                    </span>
                  </div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:6 }}>
                    <span style={{ ...S.badge(C.blue), fontSize:10 }}>{post.platform}</span>
                    <span style={{ ...S.badge(C.purple), fontSize:10 }}>{post.type}</span>
                    {post.date && <span style={{ ...S.badge(C.gold), fontSize:10 }}>{post.date}</span>}
                    {post.assignedTo && <span style={{ ...S.badge(C.green), fontSize:10 }}>
                      Assigned: {post.assignedTo}
                    </span>}
                  </div>
                  {post.caption && <p style={{ fontSize:12, color:C.muted, marginBottom:4 }}>
                    "{post.caption}"
                  </p>}
                  {post.hashtags && <p style={{ fontSize:11, color:C.gold, opacity:.7 }}>{post.hashtags}</p>}
                  {post.notes && <p style={{ fontSize:11, color:C.muted, marginTop:4, fontStyle:"italic" }}>
                    Note: {post.notes}
                  </p>}
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <select value={post.status} onChange={e=>updateStatus(post.id,e.target.value)}
                    style={{ ...S.select(), fontSize:11, padding:"4px 8px",
                      color:STATUS_COLORS[post.status]||C.muted }}>
                    {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={()=>deletePost(post.id)}
                    style={{ background:"none", border:"none", cursor:"pointer", color:C.red, fontSize:15 }}>
                    x
                  </button>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ─── CUSTOMER FOLLOW-UP REMINDERS TAB ────────────────────────────────────────
function FollowUpTab({ db, access, orders }) {
  const [reminders, setReminders] = useState([]);
  const [showForm, setShowForm]   = useState(false);
  const [loading, setLoading]     = useState(true);
  const [form, setForm] = useState({
    customerName:"", phone:"", message:"", dueDate:"", type:"Follow-up", priority:"medium", orderId:""
  });

  const TYPES = ["Follow-up","Re-order Reminder","Payment Reminder","Feedback Request","Special Offer"];
  const PRIORITY_COLORS = { high:C.red, medium:"#fbbf24", low:C.green };

  useEffect(()=>{
    const load = async () => {
      if (!db) { setLoading(false); return; }
      try {
        const snap = await fsGet(fsDoc(db,"meta","followups"));
        if (snap.exists()) setReminders(snap.data().list || []);
      } catch {}
      setLoading(false);
    };
    load();
  },[db]);

  const save = async (updated) => {
    setReminders(updated);
    if (!db) return;
    try { await fsUpdate(fsDoc(db,"meta","followups"),{ list:updated }); }
    catch { try { await fsSet(fsDoc(db,"meta","followups"),{ list:updated }); } catch {} }
  };

  const addReminder = async () => {
    if (!form.customerName.trim()) return;
    const newR = { ...form, id:"rem"+Date.now(), done:false, createdAt:new Date().toISOString().split("T")[0] };
    await save([newR, ...reminders]);
    setForm({ customerName:"", phone:"", message:"", dueDate:"", type:"Follow-up", priority:"medium", orderId:"" });
    setShowForm(false);
  };

  const toggleDone = async (id) => {
    await save(reminders.map(r => r.id===id ? {...r,done:!r.done} : r));
  };

  const deleteReminder = async (id) => { await save(reminders.filter(r=>r.id!==id)); };

  const today = new Date().toISOString().split("T")[0];
  const overdue  = reminders.filter(r=>!r.done && r.dueDate && r.dueDate < today);
  const dueToday = reminders.filter(r=>!r.done && r.dueDate===today);
  const upcoming = reminders.filter(r=>!r.done && (!r.dueDate || r.dueDate > today));
  const done     = reminders.filter(r=>r.done);

  // Build WA message for reminder
  const buildFollowUpMsg = (r) => {
    const templates = {
      `Follow-up`: `Salam ${r.customerName}! Umeed hai aap theek hain. Hum ${getBrandConfig().businessName||"our"} team ki taraf se puchh rahe hain — aapka order kaisa laga? Koi feedback ho toh zaroor batayein. *Khushboo That Speaks for You*`,
      "Re-order Reminder": `Salam ${r.customerName}! Aapka favourite ${getBrandConfig().businessName||"product"} item khatam hone wala hoga. Stock limited hai — abhi reorder karein! ${WEBSITE_URL}`,
      "Payment Reminder": `Salam ${r.customerName}! Aapke order ka payment pending hai. Please confirm karein taake hum aapka order process kar sakein. Shukriya! *${getBrandConfig().businessName||"us"}*`,
      "Feedback Request": `Salam ${r.customerName}! ${getBrandConfig().businessName||"Our product"} use karne ka experience kaisa raha? Aapka feedback hamein behtar banata hai. Ek short review zaroor dijiye! *${getBrandConfig().businessName||"Team"}*`,
      "Special Offer": r.message || `Salam ${r.customerName}! Sirf aapke liye special offer hai. Details ke liye reply karein! *${getBrandConfig().businessName||"Us"}*`,
    };
    return templates[r.type] || r.message || "";
  };

  if (loading) return <Spinner center />;

  const ReminderCard = ({ r }) => {
    const waNum = r.phone ? "92"+r.phone.replace(/^0/,"").replace(/\D/g,"") : null;
    const isOver = !r.done && r.dueDate && r.dueDate < today;
    return (
      <div style={{ ...S.card({
        border:`1px solid ${r.done ? C.border : isOver ? "rgba(239,68,68,0.3)" : PRIORITY_COLORS[r.priority]+"33"}`,
        opacity: r.done ? .5 : 1
      })}} >
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
          flexWrap:"wrap", gap:10 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:6 }}>
              <span style={{ fontSize:16, cursor:"pointer" }} onClick={()=>toggleDone(r.id)}>
                {r.done ? "✅" : "○"}
              </span>
              <p style={{ fontWeight:700, fontSize:14,
                textDecoration:r.done?"line-through":"none" }}>{r.customerName}</p>
              <span style={{ ...S.badge(PRIORITY_COLORS[r.priority]||C.muted), fontSize:10 }}>
                {r.priority}
              </span>
              <span style={{ ...S.badge(C.blue), fontSize:10 }}>{r.type}</span>
              {isOver && <span style={{ ...S.badge(C.red), fontSize:10, animation:"pulse 1.5s ease infinite" }}>
                OVERDUE
              </span>}
            </div>
            {r.phone && <p style={{ fontSize:12, color:C.muted, marginBottom:4 }}>{r.phone}</p>}
            {r.message && <p style={{ fontSize:12, color:C.muted, fontStyle:"italic" }}>"{r.message}"</p>}
            {r.dueDate && <p style={{ fontSize:11, color:isOver?C.red:C.muted, marginTop:4 }}>
              Due: {r.dueDate}
            </p>}
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {waNum && !r.done && (
              <a href={"https://wa.me/"+waNum+"?text="+encodeURIComponent(buildFollowUpMsg(r))}
                target="_blank" rel="noreferrer"
                style={{ ...S.btn("green",{ padding:"6px 12px", fontSize:11, textDecoration:"none" }) }}>
                WA Send
              </a>
            )}
            <button onClick={()=>deleteReminder(r.id)}
              style={{ background:"none", border:"none", cursor:"pointer", color:C.red, fontSize:15 }}>x</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fadeUp" style={{ padding:24, display:"flex", flexDirection:"column", gap:24 }}>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:16 }}>
        {[
          { icon:"🔴", label:"Overdue",   value:overdue.length,  color:C.red    },
          { icon:"📅", label:"Due Today", value:dueToday.length, color:"#fbbf24"},
          { icon:"⏰", label:"Upcoming",  value:upcoming.length, color:C.blue   },
          { icon:"✅", label:"Completed", value:done.length,     color:C.green  },
        ].map(k=>(
          <div key={k.label} className="card-hover" style={{ ...S.card(), textAlign:"center",
            border: k.label==="Overdue" && overdue.length>0 ? `1px solid ${C.red}44` : undefined }}>
            <div style={{ fontSize:22, marginBottom:6 }}>{k.icon}</div>
            <div style={{ ...S.serif(22, { color:k.color }), marginBottom:2 }}>{k.value}</div>
            <div style={{ fontSize:11, color:C.muted }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Add Reminder */}
      {access.waNotify && (
        <div>
          <button onClick={()=>setShowForm(!showForm)} style={S.btn("ghost")}>
            {showForm?"Close":"+ Add Reminder"}
          </button>
          {showForm && (
            <div style={{ ...S.card({ marginTop:16, animation:"fadeUp .3s ease" }) }}>
              <h3 style={{ ...S.heading(13), marginBottom:14 }}>New Follow-up Reminder</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12 }}>
                <div>
                  <span style={S.label()}>Customer Name *</span>
                  <input style={S.input()} value={form.customerName}
                    onChange={e=>setForm(f=>({...f,customerName:e.target.value}))} />
                </div>
                <div>
                  <span style={S.label()}>Phone (03XXXXXXXXX)</span>
                  <input style={S.input()} placeholder="03001234567" value={form.phone}
                    onChange={e=>setForm(f=>({...f,phone:e.target.value}))} />
                </div>
                <div>
                  <span style={S.label()}>Type</span>
                  <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}
                    style={{ ...S.select(), width:"100%" }}>
                    {TYPES.map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <span style={S.label()}>Priority</span>
                  <select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}
                    style={{ ...S.select(), width:"100%" }}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <span style={S.label()}>Due Date</span>
                  <input type="date" style={{ ...S.input(), colorScheme:"dark" }} value={form.dueDate}
                    onChange={e=>setForm(f=>({...f,dueDate:e.target.value}))} />
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <span style={S.label()}>Custom Message (optional)</span>
                  <input style={S.input()} placeholder="Leave blank to use auto template"
                    value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} />
                </div>
              </div>
              <div style={{ display:"flex", gap:10, marginTop:14 }}>
                <button onClick={addReminder} disabled={!form.customerName}
                  style={{ ...S.btn("gold",{ opacity:!form.customerName?.5:1 }) }}>Save Reminder</button>
                <button onClick={()=>setShowForm(false)} style={S.btn("ghost")}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overdue */}
      {overdue.length>0 && (
        <div>
          <h3 style={{ ...S.heading(13), color:C.red, marginBottom:12 }}>Overdue ({overdue.length})</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {overdue.map(r=><ReminderCard key={r.id} r={r}/>)}
          </div>
        </div>
      )}

      {/* Due Today */}
      {dueToday.length>0 && (
        <div>
          <h3 style={{ ...S.heading(13), color:"#fbbf24", marginBottom:12 }}>Due Today ({dueToday.length})</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {dueToday.map(r=><ReminderCard key={r.id} r={r}/>)}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length>0 && (
        <div>
          <h3 style={{ ...S.heading(13), color:C.blue, marginBottom:12 }}>Upcoming ({upcoming.length})</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {upcoming.map(r=><ReminderCard key={r.id} r={r}/>)}
          </div>
        </div>
      )}

      {/* Done */}
      {done.length>0 && (
        <div>
          <h3 style={{ ...S.heading(13), color:C.muted, marginBottom:12 }}>Completed ({done.length})</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {done.map(r=><ReminderCard key={r.id} r={r}/>)}
          </div>
        </div>
      )}

      {reminders.length===0 && (
        <p style={{ color:C.muted, fontSize:13, textAlign:"center", padding:32 }}>
          Koi follow-up reminder nahi — upar Add karo
        </p>
      )}
    </div>
  );
}

// ─── RETURN & REFUND MANAGER TAB ──────────────────────────────────────────────
function ReturnRefundTab({ db, access, orders }) {
  const [returns, setReturns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading]  = useState(true);
  const [form, setForm] = useState({
    orderId:"", customerName:"", phone:"", product:"",
    reason:"Damaged", refundAmount:0, refundType:"Refund", status:"Pending", notes:""
  });

  const REASONS   = ["Damaged Product","Wrong Item Sent","Customer Changed Mind","Late Delivery","Quality Issue","Other"];
  const REFUND_TYPES = ["Refund","Replacement","Store Credit","Partial Refund"];
  const STATUSES  = ["Pending","Under Review","Approved","Rejected","Completed"];
  const STATUS_COLORS = {
    Pending:"#fbbf24", "Under Review":C.blue, Approved:C.gold,
    Rejected:C.red, Completed:C.green
  };

  useEffect(()=>{
    const load = async () => {
      if (!db) { setLoading(false); return; }
      try {
        const snap = await fsGet(fsDoc(db,"meta","returns"));
        if (snap.exists()) setReturns(snap.data().list || []);
      } catch {}
      setLoading(false);
    };
    load();
  },[db]);

  const save = async (updated) => {
    setReturns(updated);
    if (!db) return;
    try { await fsUpdate(fsDoc(db,"meta","returns"),{ list:updated }); }
    catch { try { await fsSet(fsDoc(db,"meta","returns"),{ list:updated }); } catch {} }
  };

  const addReturn = async () => {
    if (!form.customerName.trim()) return;
    const newR = { ...form, id:"ret"+Date.now(),
      refundAmount:Number(form.refundAmount),
      createdAt:new Date().toISOString().split("T")[0] };
    await save([newR, ...returns]);
    setForm({ orderId:"", customerName:"", phone:"", product:"",
      reason:"Damaged", refundAmount:0, refundType:"Refund", status:"Pending", notes:"" });
    setShowForm(false);
  };

  const updateStatus = async (id, status) => {
    await save(returns.map(r => r.id===id ? {...r, status} : r));
  };

  const deleteReturn = async (id) => { await save(returns.filter(r=>r.id!==id)); };

  const totalRefunded = returns.filter(r=>r.status==="Completed")
    .reduce((a,r)=>a+Number(r.refundAmount||0),0);
  const pendingCount  = returns.filter(r=>r.status==="Pending").length;

  if (loading) return <Spinner center />;

  return (
    <div className="fadeUp" style={{ padding:24, display:"flex", flexDirection:"column", gap:24 }}>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:16 }}>
        {[
          { icon:"📦", label:"Total Returns",    value:returns.length,                              color:C.blue   },
          { icon:"⏳", label:"Pending Review",   value:pendingCount,                                color:"#fbbf24"},
          { icon:"✅", label:"Completed",        value:returns.filter(r=>r.status==="Completed").length, color:C.green },
          { icon:"💸", label:"Total Refunded",   value:fmtRs(totalRefunded),                        color:C.red    },
        ].map(k=>(
          <div key={k.label} className="card-hover" style={{ ...S.card(), textAlign:"center" }}>
            <div style={{ fontSize:24, marginBottom:6 }}>{k.icon}</div>
            <div style={{ ...S.serif(18, { color:k.color }), marginBottom:2 }}>{k.value}</div>
            <div style={{ fontSize:11, color:C.muted }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Add Return */}
      {access.admin && (
        <div>
          <button onClick={()=>setShowForm(!showForm)} style={S.btn("ghost")}>
            {showForm?"Close":"+ Log Return / Refund"}
          </button>
          {showForm && (
            <div style={{ ...S.card({ marginTop:16, animation:"fadeUp .3s ease" }) }}>
              <h3 style={{ ...S.heading(13), marginBottom:14 }}>New Return / Refund</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12 }}>
                <div>
                  <span style={S.label()}>Customer Name *</span>
                  <input style={S.input()} value={form.customerName}
                    onChange={e=>setForm(f=>({...f,customerName:e.target.value}))} />
                </div>
                <div>
                  <span style={S.label()}>Phone</span>
                  <input style={S.input()} value={form.phone}
                    onChange={e=>setForm(f=>({...f,phone:e.target.value}))} />
                </div>
                <div>
                  <span style={S.label()}>Order ID</span>
                  <input style={S.input()} placeholder="ASK-..." value={form.orderId}
                    onChange={e=>setForm(f=>({...f,orderId:e.target.value}))} />
                </div>
                <div>
                  <span style={S.label()}>Product</span>
                  <input style={S.input()} value={form.product}
                    onChange={e=>setForm(f=>({...f,product:e.target.value}))} />
                </div>
                <div>
                  <span style={S.label()}>Return Reason</span>
                  <select value={form.reason} onChange={e=>setForm(f=>({...f,reason:e.target.value}))}
                    style={{ ...S.select(), width:"100%" }}>
                    {REASONS.map(r=><option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <span style={S.label()}>Resolution Type</span>
                  <select value={form.refundType} onChange={e=>setForm(f=>({...f,refundType:e.target.value}))}
                    style={{ ...S.select(), width:"100%" }}>
                    {REFUND_TYPES.map(r=><option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <span style={S.label()}>Refund Amount (Rs.)</span>
                  <input type="number" style={S.input()} value={form.refundAmount}
                    onChange={e=>setForm(f=>({...f,refundAmount:e.target.value}))} />
                </div>
                <div>
                  <span style={S.label()}>Status</span>
                  <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}
                    style={{ ...S.select(), width:"100%" }}>
                    {STATUSES.map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <span style={S.label()}>Notes</span>
                  <input style={S.input()} value={form.notes}
                    onChange={e=>setForm(f=>({...f,notes:e.target.value}))} />
                </div>
              </div>
              <div style={{ display:"flex", gap:10, marginTop:14 }}>
                <button onClick={addReturn} disabled={!form.customerName}
                  style={{ ...S.btn("gold",{ opacity:!form.customerName?.5:1 }) }}>Save</button>
                <button onClick={()=>setShowForm(false)} style={S.btn("ghost")}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Returns List */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {returns.length===0
          ? <p style={{ color:C.muted, fontSize:13, textAlign:"center", padding:32 }}>
              Koi return/refund record nahi
            </p>
          : returns.map(r=>(
            <div key={r.id} style={{ ...S.card() }}>
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"flex-start", flexWrap:"wrap", gap:10 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:6 }}>
                    <p style={{ fontWeight:700, fontSize:14 }}>{r.customerName}</p>
                    <span style={{ ...S.badge(STATUS_COLORS[r.status]||C.muted), fontSize:10 }}>
                      {r.status}
                    </span>
                    <span style={{ ...S.badge(C.blue), fontSize:10 }}>{r.refundType}</span>
                  </div>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:4 }}>
                    {r.orderId && <span style={{ fontSize:11, color:C.muted }}>Order: {r.orderId}</span>}
                    {r.product && <span style={{ fontSize:11, color:C.muted }}>• {r.product}</span>}
                    <span style={{ fontSize:11, color:C.red }}>• {r.reason}</span>
                  </div>
                  {r.notes && <p style={{ fontSize:12, color:C.muted, fontStyle:"italic" }}>{r.notes}</p>}
                  <p style={{ fontSize:11, color:C.muted, marginTop:4 }}>Logged: {r.createdAt}</p>
                </div>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  {r.refundAmount>0 && (
                    <span style={{ ...S.serif(16, { color:C.red }), fontWeight:700 }}>
                      -{fmtRs(r.refundAmount)}
                    </span>
                  )}
                  <select value={r.status} onChange={e=>updateStatus(r.id,e.target.value)}
                    style={{ ...S.select(), fontSize:11, padding:"4px 8px",
                      color:STATUS_COLORS[r.status]||C.muted }}>
                    {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                  {access.deleteOrders && (
                    <button onClick={()=>deleteReturn(r.id)}
                      style={{ background:"none", border:"none", cursor:"pointer", color:C.red, fontSize:15 }}>
                      x
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ─── AI BRAIN TAB ─────────────────────────────────────────────────────────────
function AIBrainTab({ role, products = [], orders = [], db }) {
  const isOwnerOrCeo = ["owner","aceo"].includes(role);

  const [apiKey,     setApiKey]     = useState(() => { try { return localStorage.getItem("gkey")||""; } catch{ return ""; } });
  const [keyInput,   setKeyInput]   = useState("");
  const [showSetup,  setShowSetup]  = useState(false);
  const [testStatus, setTestStatus] = useState("");
  const [keyLoading, setKeyLoading] = useState(true);
  const [active,    setActive]   = useState((ROLE_AI_MAP[role]||["ceo"])[0]);
  const [allChats,  setAllChats] = useState({});
  const [input,     setInput]    = useState("");
  const [thinking,  setThinking] = useState(false);
  const chatRef  = useRef(null);
  const histRef  = useRef({});

  const availMods = ROLE_AI_MAP[role] || ["ceo"];
  const msgs = allChats[active] || [];

  useEffect(() => {
    const loadKey = async () => {
      if (!db) { setKeyLoading(false); return; }
      try {
        const snap = await fsGet(fsDoc(db, "meta", "aiconfig"));
        if (snap.exists()) {
          const k = snap.data().geminiKey || "";
          if (k) {
            setApiKey(k);
            try { localStorage.setItem("gkey", k); } catch {}
          } else {
            const local = localStorage.getItem("gkey") || "";
            if (local) setApiKey(local);
          }
        } else {
          const local = localStorage.getItem("gkey") || "";
          if (local) {
            setApiKey(local);
            try {
              await fsSet(fsDoc(db, "meta", "aiconfig"), { geminiKey: local });
            } catch {}
          }
        }
      } catch(e) {
        const local = localStorage.getItem("gkey") || "";
        if (local) setApiKey(local);
      }
      setKeyLoading(false);
    };
    loadKey();
  }, [db]);

  useEffect(() => {
    const loadChats = async () => {
      if (!db) return;
      try {
        const snap = await fsGet(fsDoc(db, "meta", "aichats"));
        if (snap.exists()) {
          const data = snap.data().chats || {};
          setAllChats(data);
          Object.entries(data).forEach(([mod, chatMsgs]) => {
            histRef.current[mod] = chatMsgs.map(m => ({
              role: m.role === "user" ? "user" : "model",
              parts: [{ text: m.text }]
            }));
          });
        }
      } catch {}
    };
    loadChats();
  }, [db]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs, thinking]);

  const saveKey = async (k) => {
    const trimmed = k.trim();
    setApiKey(trimmed);
    try { localStorage.setItem("gkey", trimmed); } catch {}
    if (db) {
      try {
        await fsUpdate(fsDoc(db, "meta", "aiconfig"), { geminiKey: trimmed });
      } catch {
        try {
          await fsSet(fsDoc(db, "meta", "aiconfig"), { geminiKey: trimmed });
        } catch(e2) {}
      }
    }
    setKeyInput("");
    setShowSetup(false);
    setTestStatus("");
  };

  const saveChats = async (updatedChats) => {
    if (!db) return;
    try {
      await fsUpdate(fsDoc(db, "meta", "aichats"), { chats: updatedChats });
    } catch {
      try {
        await fsSet(fsDoc(db, "meta", "aichats"), { chats: updatedChats });
      } catch(e) {}
    }
  };

  const testKey = async (k) => {
    setTestStatus("testing");
    try {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${k.trim()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: "Hi" }] }],
            generationConfig: { maxOutputTokens: 20 }
          })
        }
      );
      const d = await r.json();
      if (!d.error) {
        setTestStatus("ok");
        await saveKey(k);
        return;
      }
      const code = d.error.code || 0;
      const msg  = d.error.message || "";
      if (code === 429 || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED")) {
        setTestStatus("ok");
        await saveKey(k);
      } else if (code === 403 || msg.includes("PERMISSION_DENIED")) {
        setTestStatus("fail:Permission denied. aistudio.google.com pe Gemini API enable karo.");
      } else {
        setTestStatus("fail:Key check karo — " + msg.slice(0, 80));
      }
    } catch(e) {
      setTestStatus("fail:Network error: " + e.message);
    }
  };

  const clearChat = async () => {
    const updated = { ...allChats, [active]: [] };
    setAllChats(updated);
    histRef.current[active] = [];
    await saveChats(updated);
  };

  const buildLiveContext = () => {
    const lines = [];
    if (products.length > 0) {
      lines.push("=== LIVE STOCK DATA ===");
      let totalStock = 0, totalSold = 0, lowStock = [];
      products.forEach(p => {
        const stock = Number(p.stock||0), sold = Number(p.sold||0);
        totalStock += stock; totalSold += sold;
        if (stock < 10) lowStock.push(p.name);
        lines.push(`• ${p.name}: Stock=${stock}, Sold=${sold}, Price=Rs.${p.price||"TBD"}`);
      });
      lines.push(`Total: ${totalStock} bottles in stock, ${totalSold} sold`);
      if (lowStock.length) lines.push(`LOW STOCK WARNING: ${lowStock.join(", ")}`);
    }
    if (orders.length > 0) {
      lines.push("=== ORDERS SUMMARY ===");
      const revenue = orders.reduce((a,o) => a+Number(o.revenue||0), 0);
      const pending  = orders.filter(o=>o.status==="pending").length;
      const shipped  = orders.filter(o=>o.status==="shipped").length;
      const delivered= orders.filter(o=>o.status==="delivered").length;
      const channels = {};
      orders.forEach(o => { channels[o.channel]=(channels[o.channel]||0)+1; });
      lines.push(`Total Orders: ${orders.length} | Revenue: Rs.${revenue.toLocaleString("en-PK")}`);
      lines.push(`Status — Pending:${pending}, Shipped:${shipped}, Delivered:${delivered}`);
      lines.push(`Channels: ${Object.entries(channels).map(([k,v])=>`${k}(${v})`).join(", ")}`);
    }
    return lines.length > 0
      ? "\n\n[LIVE SOFTWARE DATA]\n" + lines.join("\n") + "\n[/LIVE DATA]"
      : "";
  };

  const send = async () => {
    const txt = input.trim();
    if (!txt || thinking) return;
    if (!apiKey) { setShowSetup(true); return; }

    setInput("");
    setThinking(true);

    const userMsg = { role:"user", text:txt, ts: Date.now() };
    const newMsgs = [...(allChats[active]||[]), userMsg];
    const updatedChats = { ...allChats, [active]: newMsgs };
    setAllChats(updatedChats);

    if (!histRef.current[active]) histRef.current[active] = [];
    histRef.current[active] = [...histRef.current[active], { role:"user", parts:[{text:txt}] }];

    try {
      const mod = AI_MODULES[active];
      const liveData = buildLiveContext();
      let contentsToSend;
      if (histRef.current[active].length === 1) {
        contentsToSend = [{ role:"user", parts:[{ text:"You are: " + mod.system + liveData + "\n\n---\n\nUser: " + txt }] }];
      } else {
        contentsToSend = histRef.current[active];
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        { method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({
            contents: contentsToSend,
            generationConfig:{ maxOutputTokens:8192, temperature:0.7 }
          }) }
      );
      const data = await res.json();

      if (data.error) {
        histRef.current[active] = histRef.current[active].slice(0,-1);
        const c = data.error.code, m = data.error.message||"";
        let err = "❌ ";
        if (m.includes("API_KEY_INVALID") || m.includes("api key not valid") || m.includes("API key not valid")) {
          err += "API Key galat hai!\n\n→ Owner se sahi key set karwao\n→ AI Brain → Key Setup";
        } else if (c===429 || m.includes("quota") || m.includes("RESOURCE_EXHAUSTED")) {
          err += "Free quota khatam! Thodi der baad try karo.";
        } else if (c===403) {
          err += "Permission denied. Owner se check karwao.";
        } else {
          err += `Error ${c}: ${m}`;
        }
        const errMsgs = [...newMsgs, { role:"ai", text:err, ts:Date.now() }];
        const errChats = { ...allChats, [active]: errMsgs };
        setAllChats(errChats);
        await saveChats(errChats);
      } else {
        const parts = data?.candidates?.[0]?.content?.parts || [];
        const text = parts.find(p => p.text && !p.thought)?.text || parts[0]?.text || "";
        if (text) {
          histRef.current[active] = [...histRef.current[active], { role:"model", parts:[{text}] }];
          const aiMsg = { role:"ai", text, ts:Date.now() };
          const finalMsgs = [...newMsgs, aiMsg];
          const finalChats = { ...allChats, [active]: finalMsgs };
          setAllChats(finalChats);
          await saveChats(finalChats);
        } else {
          histRef.current[active] = histRef.current[active].slice(0,-1);
          const errMsgs = [...newMsgs, { role:"ai", text:"⚠️ Khaali response mila. Dobara try karo.", ts:Date.now() }];
          const errChats = { ...allChats, [active]: errMsgs };
          setAllChats(errChats);
        }
      }
    } catch(e) {
      histRef.current[active] = histRef.current[active].slice(0,-1);
      const errMsgs = [...(allChats[active]||[]), userMsg, { role:"ai", text:`🌐 Network error: ${e.message}`, ts:Date.now() }];
      setAllChats({ ...allChats, [active]: errMsgs });
    }
    setThinking(false);
  };

  const mod = AI_MODULES[active];
  const isConnected = !!apiKey;

  if (keyLoading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:300 }}>
      <Spinner size={32}/><span style={{ color:C.muted, marginLeft:12 }}>AI loading...</span>
    </div>
  );

  return (
    <div className="fadeUp" style={{ padding:24, display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ ...S.card({ display:"flex", justifyContent:"space-between", alignItems:"center",
        flexWrap:"wrap", gap:12,
        border:`1px solid ${isConnected ? C.gold+"40" : "rgba(239,68,68,0.3)"}` }) }}>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ width:10, height:10, borderRadius:"50%",
            background: isConnected ? C.green : C.red,
            boxShadow:`0 0 8px ${isConnected ? C.green : C.red}` }}/>
          <div>
            <p style={{ fontSize:13, fontWeight:600, color: isConnected ? C.cream : C.muted }}>
              {isConnected ? "✦ Gemini AI Connected" : "AI Not Connected"}
            </p>
            <p style={{ fontSize:11, color:C.muted }}>
              {isConnected ? "Gemini 2.5 Flash · Free · Shared with team" : "Owner ko key setup karni hai"}
            </p>
          </div>
        </div>
        {isOwnerOrCeo && (
          <button onClick={()=>{ setShowSetup(!showSetup); setKeyInput(""); setTestStatus(""); }}
            style={{ ...S.btn(isConnected?"ghost":"gold", { fontSize:12 }) }}>
            🔑 {isConnected ? "Key Change Karo" : "Key Setup Karo"}
          </button>
        )}
        {!isOwnerOrCeo && !isConnected && (
          <span style={{ fontSize:12, color:C.red }}>⚠️ Owner se AI key set karwao</span>
        )}
      </div>

      {showSetup && isOwnerOrCeo && (
        <div style={{ ...S.card({ border:`1px solid ${C.gold}40`, animation:"fadeUp .2s ease" }) }}>
          <h3 style={{ ...S.heading(14), marginBottom:4 }}>🔑 Gemini API Key Setup</h3>
          <p style={{ fontSize:12, color:C.muted, marginBottom:14, lineHeight:1.7 }}>
            Yeh key <b style={{color:C.gold}}>saari team ke liye</b> save hogi.
            Free key: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
              style={{color:C.gold}}>aistudio.google.com/app/apikey</a>
          </p>
          <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
            <input style={{ ...S.input({ flex:1, minWidth:240, fontFamily:"monospace", fontSize:12 }) }}
              type="text" placeholder="AIzaSy..."
              value={keyInput}
              onChange={e=>{ setKeyInput(e.target.value); setTestStatus(""); }}
              onKeyDown={e=>e.key==="Enter"&&keyInput.trim().length>10&&testKey(keyInput)}/>
            <button onClick={()=>testKey(keyInput)}
              disabled={keyInput.trim().length<10||testStatus==="testing"}
              style={{ ...S.btn("gold", { opacity:keyInput.trim().length<10?.5:1 }) }}>
              {testStatus==="testing" ? "Testing..." : "✓ Test & Save"}
            </button>
            {apiKey && <button onClick={()=>saveKey("")} style={S.btn("red",{padding:"10px 14px"})}>🗑 Remove</button>}
          </div>
          {testStatus==="ok" && (
            <div style={{ padding:"10px 14px", background:"rgba(52,211,153,0.1)",
              border:"1px solid rgba(52,211,153,0.3)", borderRadius:8, fontSize:13, color:C.green }}>
              ✅ Key valid! Saari team ke liye AI connected ho gaya!
            </div>
          )}
          {testStatus.startsWith("fail:") && (
            <div style={{ padding:"10px 14px", background:"rgba(239,68,68,0.08)",
              border:"1px solid rgba(239,68,68,0.3)", borderRadius:8, fontSize:13, color:C.red }}>
              ❌ {testStatus.replace("fail:","")}
            </div>
          )}
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:10 }}>
        {availMods.map(k => {
          const m = AI_MODULES[k]; const isAct = active===k;
          const chatCount = (allChats[k]||[]).length;
          return (
            <div key={k} onClick={()=>setActive(k)} className="card-hover"
              style={{ ...S.card({ cursor:"pointer", textAlign:"center", padding:14, position:"relative",
                border:`1px solid ${isAct?C.gold:C.border}`,
                background: isAct?`${C.gold}10`:C.card }) }}>
              {chatCount>0 && (
                <div style={{ position:"absolute", top:8, right:8, background:C.gold,
                  color:C.bg, borderRadius:"50%", width:16, height:16,
                  fontSize:9, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {chatCount>9?"9+":Math.ceil(chatCount/2)}
                </div>
              )}
              <div style={{ fontSize:26, marginBottom:6 }}>{m.icon}</div>
              <p style={{ fontSize:12, fontWeight:600, color:isAct?C.gold:C.cream }}>{m.label}</p>
              <p style={{ fontSize:10, color:C.muted, marginTop:2 }}>{m.desc}</p>
            </div>
          );
        })}
      </div>

      <div style={{ ...S.card({ display:"flex", alignItems:"center", gap:12 }) }}>
        <span style={{ fontSize:28 }}>{mod.icon}</span>
        <div style={{ flex:1 }}>
          <p style={S.heading(14)}>{mod.label}</p>
          <p style={{ fontSize:12, color:C.muted }}>{mod.desc}</p>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {msgs.length > 0 && (
            <button onClick={clearChat}
              style={{ ...S.btn("ghost", { fontSize:11, padding:"4px 10px", opacity:.6 }) }}>
              🗑 Clear
            </button>
          )}
          <span style={{ ...S.badge(C.green), fontSize:10 }}>Gemini 2.5 Flash</span>
        </div>
      </div>

      <div style={S.card()}>
        <div ref={chatRef} style={{ minHeight:320, maxHeight:440, overflowY:"auto",
          display:"flex", flexDirection:"column", gap:12, padding:"4px 0 16px" }}>

          {msgs.length===0 && (
            <div style={{ flex:1, display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", padding:40, gap:14 }}>
              <span style={{ fontSize:44, filter:"drop-shadow(0 0 12px rgba(201,164,76,0.4))",
                animation:"float 2s ease infinite" }}>✦</span>
              {isConnected ? (
                <>
                  <p style={{ color:C.muted, fontSize:14, fontFamily:"Cormorant Garamond,serif",
                    fontStyle:"italic" }}>{mod.label} se kuch bhi poochho</p>
                  <p style={{ color:C.muted, fontSize:12 }}>Urdu · English · Roman Urdu · Live data included</p>
                </>
              ) : (
                <p style={{ color:C.red, fontSize:13 }}>
                  {isOwnerOrCeo ? "Upar Key Setup karo" : "Owner se API key set karwao"}
                </p>
              )}
            </div>
          )}

          {msgs.map((m,i) => (
            <div key={i} style={{ display:"flex", gap:8,
              justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
              {m.role==="ai" && (
                <div style={{ width:28, height:28, borderRadius:"50%",
                  background:`${C.gold}20`, border:`1px solid ${C.gold}40`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:14, flexShrink:0, marginTop:2 }}>✦</div>
              )}
              <div style={{ maxWidth:"78%", padding:"10px 14px", borderRadius:12, fontSize:13,
                lineHeight:1.7, whiteSpace:"pre-wrap",
                ...(m.role==="user"
                  ? { background:`${C.gold}15`, border:`1px solid ${C.gold}25` }
                  : { background:"rgba(255,255,255,0.04)", border:`1px solid ${C.border}` })
              }}>
                {m.text}
                {m.ts && <div style={{ fontSize:9, color:C.muted, marginTop:4, opacity:.5 }}>
                  {new Date(m.ts).toLocaleTimeString("en-PK",{hour:"2-digit",minute:"2-digit"})}
                </div>}
              </div>
              {m.role==="user" && (
                <div style={{ width:28, height:28, borderRadius:"50%",
                  background:"rgba(255,255,255,0.06)", border:`1px solid ${C.border}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:14, flexShrink:0, marginTop:2 }}>👤</div>
              )}
            </div>
          ))}

          {thinking && (
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <div style={{ width:28, height:28, borderRadius:"50%",
                background:`${C.gold}20`, border:`1px solid ${C.gold}40`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>✦</div>
              <div style={{ display:"flex", gap:4, alignItems:"center" }}>
                {[0,1,2].map(d=>(
                  <div key={d} style={{ width:6, height:6, borderRadius:"50%",
                    background:C.gold, animation:`pulse 1.2s ease ${d*0.2}s infinite` }}/>
                ))}
                <span style={{ color:C.muted, fontSize:12, marginLeft:4, fontStyle:"italic" }}>Thinking...</span>
              </div>
            </div>
          )}
        </div>

        <div style={{ display:"flex", gap:8, paddingTop:12, borderTop:`1px solid ${C.border}` }}>
          <input style={{ ...S.input({ flex:1 }) }}
            placeholder={isConnected ? `${mod.label} se poochho... (Enter = send)` : "Pehle owner se key set karwao"}
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); send(); } }}
            disabled={thinking || !isConnected}/>
          <button onClick={send} disabled={thinking||!input.trim()||!isConnected}
            style={{ ...S.btn("gold",{ width:44, height:44, padding:0, borderRadius:10,
              opacity:thinking||!input.trim()||!isConnected?.4:1, fontSize:18 }) }}>↑</button>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN TAB ────────────────────────────────────────────────────────────────
function AdminTab({ orders, setOrders, products, setProducts, user, role, access, db, onWAPopup, onPointsEarned }) {
  const [sub, setSub] = useState("orders");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ product:"", qty:1, price:0, customer:"", phone:"",
    channel:"Instagram", status:"pending", notes:"", revenue:0 });
  const [rev, setRev] = useState({ total:0, thisMonth:0, lastMonth:0 });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);

  useEffect(()=>{
    const t = orders.reduce((a,o)=>a+Number(o.revenue||0),0);
    setRev(r=>({...r, total:t}));
  },[orders]);

  const ptsPerOrder = 5;

  const saveOrder = async () => {
    if (!form.product || !form.customer) return;
    setLoading(true);
    const orderId = await generateOrderId(form.product, db);
    const newOrd = {
      ...form,
      orderId,
      qty: Number(form.qty),
      price: Number(form.price),
      revenue: Number(form.revenue) || Number(form.qty) * Number(form.price),
      addedBy: user?.displayName || user?.email?.split("@")[0],
      addedById: user?.uid || "local",
      createdAt: new Date().toISOString(),
    };
    try {
      if (db) {
        const ref = await fsAdd(fsColl(db, "orders"), {
          ...newOrd,
          createdAt: fsServerTime(),
        });
        newOrd.firestoreId = ref.id;
      }
      const updProds = products.map(p =>
        p.name === form.product
          ? { ...p, stock: Math.max(0, Number(p.stock) - Number(form.qty)), sold: Number(p.sold) + Number(form.qty) }
          : p
      );
      setProducts(updProds);
      if (db) {
        try { await fsUpdate(fsDoc(db, "meta", "products"), { list: updProds }); } catch {}
      }
      setOrders(o => [newOrd, ...o]);
      onPointsEarned(ptsPerOrder);
      setShowForm(false);
      setForm({ product:"", qty:1, price:0, customer:"", phone:"", channel:"Instagram", status:"pending", notes:"", revenue:0 });
      setTimeout(() => onWAPopup(newOrd), 100);
    } catch (e) {
      console.error("saveOrder error:", e);
      alert("Order save mein masla: " + e.message);
    }
    setLoading(false);
  };

  // ── UPDATED: updateStatus now uses OrderPipeline ───────────────────────────
  const updateStatus = async (orderId, firestoreId, status) => {
    setOrders(o=>o.map(x=>x.orderId===orderId?{...x,status}:x));
    if (!db||!firestoreId) return;
    try { await fsUpdate(fsDoc(db,"orders",firestoreId),{status}); } catch{}
  };

  const deleteOrder = async (ord) => {
    setOrders(o=>o.filter(x=>x.orderId!==ord.orderId));
    if (db&&ord.firestoreId) try { await fsDel(fsDoc(db,"orders",ord.firestoreId)); } catch{}
    setConfirmDel(null);
  };

  return (
    <div className="fadeUp" style={{ padding:24 }}>
      {/* Sub-tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:24 }}>
        {[["orders","📋 Orders"],["revenue","💰 Revenue"],["tasks","✅ Tasks"]].map(([k,l])=>(
          <button key={k} onClick={()=>setSub(k)} style={{
            ...S.btn(sub===k?"gold":"ghost", { padding:"8px 16px" }) }}>{l}</button>
        ))}
      </div>

      {/* Orders Sub-tab */}
      {sub==="orders" && (
        <div>
          {access.addOrders && (
            <div style={{ marginBottom:20 }}>
              <button onClick={()=>setShowForm(!showForm)} style={S.btn("ghost")}>
                {showForm?"✕ Close":"+ Add Order"}
              </button>
              {showForm && (
                <div style={{ ...S.card({ marginTop:16, animation:"fadeUp .3s ease" }) }}>
                  <h3 style={{ ...S.heading(14), marginBottom:16 }}>New Order</h3>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12 }}>
                    <div>
                      <span style={S.label()}>Product *</span>
                      <select
                        value={form.product}
                        onChange={e=>{
                          const prod = products.find(p=>p.name===e.target.value);
                          setForm(f=>({
                            ...f,
                            product:e.target.value,
                            price: prod?.price>0 ? prod.price : f.price,
                            revenue: (prod?.price>0 ? prod.price : f.price) * f.qty
                          }));
                        }}
                        style={{
                          ...S.select(),
                          width:"100%",
                          border: !form.product ? "1px solid rgba(239,68,68,0.5)" : `1px solid ${C.border}`
                        }}
                      >
                        <option value="">— Product select karo —</option>
                        {products.map(p=>(
                          <option key={p.id} value={p.name}>{p.name} (Stock: {p.stock})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span style={S.label()}>Qty</span>
                      <input type="number" min="1" style={S.input()} value={form.qty}
                        onChange={e=>setForm(f=>({ ...f, qty:Number(e.target.value), revenue:Number(e.target.value)*Number(f.price) }))} />
                    </div>
                    <div>
                      <span style={S.label()}>Price (Rs.)</span>
                      <input type="number" style={S.input()} value={form.price}
                        onChange={e=>setForm(f=>({ ...f, price:Number(e.target.value), revenue:Number(f.qty)*Number(e.target.value) }))} />
                    </div>
                    <div>
                      <span style={S.label()}>Customer Name *</span>
                      <input
                        style={{ ...S.input(), border: !form.customer ? "1px solid rgba(239,68,68,0.5)" : `1px solid ${C.border}` }}
                        placeholder="Customer ka naam"
                        value={form.customer}
                        onChange={e=>setForm(f=>({ ...f, customer:e.target.value }))} />
                    </div>
                    <div>
                      <span style={S.label()}>Phone (03XXXXXXXXX)</span>
                      <input style={S.input()} value={form.phone} placeholder="03001234567"
                        onChange={e=>setForm(f=>({ ...f, phone:e.target.value }))} />
                      <p style={{ fontSize:10, color:C.muted, marginTop:3 }}>Phone dena zaroor hai taake WA message ja sake</p>
                    </div>
                    <div>
                      <span style={S.label()}>Channel</span>
                      <select value={form.channel} onChange={e=>setForm(f=>({ ...f, channel:e.target.value }))}
                        style={{ ...S.select(), width:"100%" }}>
                        {["Instagram","WhatsApp","Website","Facebook","TikTok","Walk-in"].map(c=>(
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span style={S.label()}>Status</span>
                      <select value={form.status} onChange={e=>setForm(f=>({ ...f, status:e.target.value }))}
                        style={{ ...S.select(), width:"100%" }}>
                        {["pending","confirmed","packed","dispatched","delivered"].map(s=>(
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ gridColumn:"1/-1" }}>
                      <span style={S.label()}>Notes</span>
                      <input style={S.input()} value={form.notes}
                        onChange={e=>setForm(f=>({ ...f, notes:e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ marginTop:16, paddingTop:16, borderTop:`1px solid ${C.border}`,
                    display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
                    <div>
                      <p style={{ fontSize:13, color:C.muted }}>
                        💰 Total: <span style={{ color:C.gold, fontWeight:700, fontSize:16 }}>{fmtRs(form.qty * form.price)}</span>
                        <span style={{ marginLeft:12, color:C.green }}>+{ptsPerOrder} pts milenge</span>
                      </p>
                      {(!form.product || !form.customer) && (
                        <p style={{ fontSize:11, color:C.red, marginTop:4 }}>
                          ⚠️ {!form.product ? "Product" : "Customer name"} zaroor bharo
                        </p>
                      )}
                    </div>
                    <div style={{ display:"flex", gap:10 }}>
                      <button onClick={saveOrder} disabled={loading || !form.product || !form.customer}
                        style={{ ...S.btn("gold", { opacity: loading || !form.product || !form.customer ? .5 : 1 }) }}>
                        {loading ? <Spinner size={16}/> : "✓ Save Order & Notify"}
                      </button>
                      <button onClick={()=>setShowForm(false)} style={S.btn("ghost")}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── UPDATED Orders Table with Pipeline ────────────────────────── */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {orders.length===0 && (
              <p style={{ color:C.muted, fontSize:13, textAlign:"center", padding:40 }}>
                Abhi koi order nahi
              </p>
            )}
            {orders.map(o=>(
              <div key={o.orderId} style={{ ...S.card() }}>
                {/* Order Header */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
                  flexWrap:"wrap", gap:10, marginBottom:8 }}>
                  <div>
                    <p style={{ fontWeight:700, fontSize:14 }}>{o.product} × {o.qty}</p>
                    <p style={{ fontSize:12, color:C.muted }}>{o.customer} · {o.channel}</p>
                    <p style={{ fontSize:11, color:C.muted, marginTop:2 }}>ID: {o.orderId} · By: {o.addedBy}</p>
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <span style={{ ...S.serif(16, { color:C.gold }) }}>{fmtRs(o.revenue)}</span>
                    {access.waNotify && o.phone && (
                      <a href={`https://wa.me/92${o.phone.replace(/^0/,"").replace(/\D/g,"")}?text=${encodeURIComponent(buildCustomerMsg(o))}`}
                        target="_blank" rel="noreferrer" title="Customer ko WA bhejo"
                        style={{ fontSize:18, textDecoration:"none" }}>📱</a>
                    )}
                    {access.deleteOrders && (
                      <button onClick={()=>setConfirmDel(o)}
                        style={{ background:"none", border:"none", cursor:"pointer", color:C.red, fontSize:16 }}>🗑</button>
                    )}
                  </div>
                </div>

                {/* ── NEW: Visual Status Pipeline ── */}
                <OrderPipeline
                  order={o}
                  access={access}
                  onStatusChange={(newStatus) => updateStatus(o.orderId, o.firestoreId, newStatus)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue Sub-tab */}
      {sub==="revenue" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:20 }}>
          {[["Total Revenue",rev.total],["This Month",rev.thisMonth],["Last Month",rev.lastMonth]].map(([l,v])=>(
            <div key={l} style={S.card()}>
              <p style={{ color:C.muted, fontSize:13, marginBottom:12 }}>{l}</p>
              <div style={{ ...S.serif(32, { color:C.gold }), marginBottom:16 }}>{fmtRs(v)}</div>
              <div style={{ display:"flex", gap:8 }}>
                <input type="number" placeholder="Update..."
                  style={{ ...S.input({ flex:1 }) }}
                  onBlur={e=>setRev(r=>({...r,
                    [l==="Total Revenue"?"total":l==="This Month"?"thisMonth":"lastMonth"]:Number(e.target.value)||v}))} />
                <button style={S.btn("gold",{padding:"8px 12px"})}>Set</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tasks Sub-tab */}
      {sub==="tasks" && (
        <div style={{ maxWidth:600 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
            {(tasks.length?tasks:DEFAULT_TASKS).map(t=>(
              <div key={t.id} style={{ display:"flex", gap:10, alignItems:"center",
                padding:"12px 16px", ...S.card(), cursor:"pointer" }}
                onClick={()=>setTasks(ts=>(ts.length?ts:DEFAULT_TASKS).map(x=>x.id===t.id?{...x,done:!x.done}:x))}>
                <span style={{ color:t.done?C.green:C.muted, fontSize:18 }}>{t.done?"✓":"○"}</span>
                <span style={{ flex:1, textDecoration:t.done?"line-through":"none",
                  color:t.done?C.muted:C.cream }}>{t.text}</span>
                <span style={S.badge(t.priority==="high"?C.red:t.priority==="medium"?"#fbbf24":C.green)}>
                  {t.priority}
                </span>
              </div>
            ))}
          </div>
          <AddTaskInline tasks={tasks.length?tasks:DEFAULT_TASKS} setTasks={t=>setTasks(t)} />
        </div>
      )}

      {/* Delete Confirm */}
      {confirmDel && (
        <Modal onClose={()=>setConfirmDel(null)}>
          <h3 style={{ ...S.heading(16), marginBottom:12 }}>Order Delete Karna Chahte Ho?</h3>
          <p style={{ color:C.muted, fontSize:13, marginBottom:20 }}>
            Order <b style={{ color:C.gold }}>{confirmDel.orderId}</b> — {confirmDel.customer} permanently delete ho jayega.
          </p>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>deleteOrder(confirmDel)} style={S.btn("red")}>Yes, Delete</button>
            <button onClick={()=>setConfirmDel(null)} style={S.btn("ghost")}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── LEADERBOARD ROW ──────────────────────────────────────────────────────────
function LeaderboardRow({ m, i, editId, setEditId, savePoints, removeMember, restoreMember, access }) {
  const [localPts, setLocalPts] = useState(m.points||0);
  const [localCnt, setLocalCnt] = useState(m.orderCount||0);
  const lvl     = getLoyaltyLevel(m.points||0);
  const isEdit  = editId===m.uid;
  const removed = m.role==="removed";

  useEffect(()=>{ setLocalPts(m.points||0); setLocalCnt(m.orderCount||0); },[m.uid, m.points, m.orderCount]);

  return (
    <div style={{ ...S.card(), opacity: removed ? 0.45 : 1,
      border: removed ? `1px solid rgba(255,80,80,0.2)` : undefined }}>
      <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
        <span style={{ ...S.serif(20, { color: removed ? C.muted : i===0?C.gold:i===1?C.goldL:C.muted }), minWidth:28 }}>
          {removed ? "✕" : `#${i+1}`}
        </span>
        <div style={{ flex:1 }}>
          <p style={{ fontWeight:600, fontSize:13 }}>{m.name||m.email}</p>
          {removed
            ? <span style={{ ...S.badge("#ff5050"), fontSize:10 }}>Removed</span>
            : (() => {
                const effectiveRole = (m.email===OWNER_EMAIL || m.role==="owner") ? "owner" : (m.role||"member");
                const roleInfo = TEAM_ROLES[effectiveRole] || TEAM_ROLES.member;
                return <span style={S.badge(roleInfo.color)}>{roleInfo.label}</span>;
              })()
          }
        </div>
        {!removed && lvl && <span style={S.badge(lvl.color)}>{lvl.icon} {lvl.name}</span>}
        <span style={{ ...S.serif(18, { color: removed ? C.muted : C.gold }) }}>{m.points||0} pts</span>
        {access.managePoints && !removed && (
          <button onClick={()=>setEditId(isEdit?null:m.uid)}
            style={S.btn("ghost",{padding:"5px 10px",fontSize:11})}>✏️ Edit</button>
        )}
        {access.managePoints && removed && (
          <button onClick={()=>restoreMember(m.uid)}
            style={S.btn("gold",{padding:"5px 12px",fontSize:11})}>↩ Restore</button>
        )}
      </div>
      {isEdit && !removed && (
        <div style={{ marginTop:12, padding:14, background:"rgba(255,255,255,0.03)",
          borderRadius:10, display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <span style={{ fontSize:13, color:C.muted, minWidth:80 }}>Points:</span>
            <input type="number" value={localPts}
              onChange={e=>setLocalPts(Number(e.target.value))}
              style={{ ...S.input({ width:100 }) }} />
            <button onClick={()=>savePoints(m.uid, localPts, localCnt)}
              style={S.btn("gold",{padding:"6px 14px",fontSize:12})}>Save</button>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <span style={{ fontSize:13, color:C.muted, minWidth:80 }}>Orders:</span>
            <button onClick={()=>setLocalCnt(c=>Math.max(0,c-1))}
              style={S.btn("ghost",{padding:"4px 10px"})}>−</button>
            <span style={{ fontSize:14, minWidth:60, textAlign:"center" }}>{localCnt} orders</span>
            <button onClick={()=>setLocalCnt(c=>c+1)}
              style={S.btn("ghost",{padding:"4px 10px"})}>+</button>
          </div>
          <button onClick={()=>{removeMember(m.uid);setEditId(null);}}
            style={{ ...S.btn("red",{padding:"5px 12px",fontSize:11,alignSelf:"flex-start"}) }}>✕ Remove</button>
        </div>
      )}
    </div>
  );
}

// ─── TEAM TAB ─────────────────────────────────────────────────────────────────
function TeamTab({ members, setMembers, user, access, db }) {
  const [sub, setSub] = useState("members");
  const [editId, setEditId] = useState(null);

  const updateRole = async (uid, newRole) => {
    setMembers(m=>m.map(x=>x.uid===uid?{...x,role:newRole}:x));
    if (!db) return;
    try { await fsUpdate(fsDoc(db,"users",uid),{role:newRole}); } catch{}
  };

  const removeMember = async (uid) => {
    setMembers(m=>m.map(x=>x.uid===uid?{...x,role:"removed"}:x));
    if (!db) return;
    try { await fsUpdate(fsDoc(db,"users",uid),{role:"removed"}); } catch{}
  };

  const restoreMember = async (uid) => {
    setMembers(m=>m.map(x=>x.uid===uid?{...x,role:"member"}:x));
    if (!db) return;
    try { await fsUpdate(fsDoc(db,"users",uid),{role:"member"}); } catch{}
  };

  const savePoints = async (uid, pts, cnt) => {
    setMembers(m=>m.map(x=>x.uid===uid?{...x,points:pts,orderCount:cnt}:x));
    setEditId(null);
    if (!db) return;
    try { await fsUpdate(fsDoc(db,"users",uid),{points:pts,orderCount:cnt}); } catch{}
  };

  const visible = members.filter(m=>m.role!=="removed");
  const allForLb = members.filter(m=>m.role);
  const sorted   = [...allForLb].sort((a,b)=>(b.points||0)-(a.points||0));

  return (
    <div className="fadeUp" style={{ padding:24 }}>
      <div style={{ display:"flex", gap:8, marginBottom:24 }}>
        {[["members","👥 Members"],["loyalty","🏆 Loyalty & Points"],["guide","📖 Role Guide"]].map(([k,l])=>(
          <button key={k} onClick={()=>setSub(k)} style={S.btn(sub===k?"gold":"ghost",{padding:"8px 16px"})}>{l}</button>
        ))}
      </div>

      {sub==="members" && (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                {["Name","Email","Role","Loyalty","Actions"].map(h=>(
                  <th key={h} style={{ padding:"8px 12px", textAlign:"left",
                    color:C.muted, fontFamily:"DM Sans,sans-serif", fontSize:11, fontWeight:600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map(m=>{
                const isOwner = m.email===OWNER_EMAIL || m.role==="owner";
                const lvl = getLoyaltyLevel(m.points||0);
                return (
                  <tr key={m.uid} style={{ borderBottom:`1px solid ${C.border}` }}>
                    <td style={{ padding:"10px 12px", fontWeight:600 }}>{m.name||"—"}</td>
                    <td style={{ padding:"10px 12px", color:C.muted, fontSize:12 }}>{m.email}</td>
                    <td style={{ padding:"10px 12px" }}>
                      {isOwner
                        ? <span style={S.badge(C.gold)}>👑 Owner</span>
                        : <select value={m.role} onChange={e=>updateRole(m.uid,e.target.value)}
                            style={{ ...S.select(), fontSize:12 }}>
                            {Object.entries(TEAM_ROLES).map(([k,v])=>(
                              k!=="owner"&&<option key={k} value={k}>{v.label}</option>
                            ))}
                          </select>
                      }
                    </td>
                    <td style={{ padding:"10px 12px" }}>
                      {lvl ? <span style={S.badge(lvl.color)}>{lvl.icon} {lvl.name}</span>
                           : <span style={{ color:C.muted, fontSize:12 }}>—</span>}
                    </td>
                    <td style={{ padding:"10px 12px" }}>
                      {!isOwner && (
                        <button onClick={()=>removeMember(m.uid)}
                          style={{ ...S.btn("red", { padding:"4px 10px", fontSize:11 }) }}>✕ Remove</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {sub==="loyalty" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16, marginBottom:28 }}>
            {LOYALTY_LEVELS.map(lvl=>(
              <div key={lvl.name} style={{ ...S.card({ border:`1px solid ${lvl.color}33`, textAlign:"center" }) }}>
                <div style={{ fontSize:40, marginBottom:8 }}>{lvl.icon}</div>
                <h3 style={{ ...S.heading(16, { color:lvl.color }), marginBottom:8 }}>{lvl.name}</h3>
                <p style={{ fontSize:12, color:C.muted }}>Min {lvl.min} orders</p>
                <p style={{ fontSize:12, color:C.muted }}>{lvl.pointsPerOrder} pts/order</p>
                <p style={{ fontSize:14, color:lvl.color, fontWeight:700, marginTop:6 }}>{lvl.discountPct}% discount</p>
              </div>
            ))}
          </div>
          <h3 style={{ ...S.heading(14), marginBottom:16 }}>🏆 Leaderboard</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {sorted.map((m,i)=>(
              <LeaderboardRow key={m.uid} m={m} i={i} editId={editId} setEditId={setEditId}
                savePoints={savePoints} removeMember={removeMember} restoreMember={restoreMember} access={access} />
            ))}
          </div>
        </div>
      )}

      {sub==="guide" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16 }}>
          {Object.entries(TEAM_ROLES).map(([key,r])=>(
            <div key={key} style={S.card()}>
              <p style={{ fontWeight:700, fontSize:14, marginBottom:8 }}>{r.label}</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                {(ROLE_AI_MAP[key]||[]).map(k=>(
                  <span key={k} style={{ ...S.pill({ fontSize:10 }) }}>
                    {AI_MODULES[k]?.icon} {AI_MODULES[k]?.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MY GUIDE TAB ─────────────────────────────────────────────────────────────
function MyGuideTab({ role }) {
  const guides = {
    owner: [
      { title:"📊 Dashboard", text:"Aapko saari metrics yahan milti hain — revenue, stock, orders, team ke points. Launch checklist track karo aur recent orders dekho." },
      { title:"⚙ Admin Tab", text:"Orders manage karo — add, update status, delete. Revenue manually update karo. Tasks set karo team ke liye." },
      { title:"👥 Team Tab", text:"Team members ko roles assign karo. Points aur order count manage karo. Leaderboard dekho. Members ko remove bhi kar sakte ho." },
      { title:"✦ Products Tab", text:"Products ki prices edit karo by clicking on price. Naye products add karo form se. Sab kuch auto-save hota hai." },
      { title:"📦 Inventory Tab", text:"Har product ka stock aur sold count track karo. Low stock alert auto show hota hai. Stock directly update kar sakte ho." },
      { title:"✦ AI Brain Tab", text:"Aapke paas saare 11 AI modules hain — Strategy, Marketing, Sales, HR sab. Urdu/English/Roman Urdu mein baat karo." },
      { title:"📱 WhatsApp System", text:"Har order ke baad WA popup aata hai. Customer ko direct message bhejo ya brand number ko notify karo." },
      { title:"👥 Customers Tab", text:"Saare customers ki order history, tier (Bronze/Silver/Gold), total spent, aur WA button yahan milega. Repeat customers auto detect hote hain." },
    ],
    aceo: [
      { title:"🔱 Aapka Role", text:"Assistant CEO ke tor par aap operations dekh sakte hain. Orders, team visibility, AI modules sab available hai." },
      { title:"⚙ Admin Tab", text:"Orders add aur manage karo. Revenue dekho. Tasks update karo." },
      { title:"✦ AI Brain", text:"CEO Strategy, Marketing, Sales, Inventory AI sab available. Decisions ke liye AI se guidance lo." },
    ],
    sales: [
      { title:"📈 Aapka Focus", text:"Orders add karna aur sales track karna aapka main kaam hai." },
      { title:"📋 Order Add Karna", text:"Admin tab mein jao → Orders → Add Order. Product, qty, price, customer name, phone zaroor bharo." },
      { title:"📱 WhatsApp Workflow", text:"Order save hone ke baad popup aata hai. Customer ko direct WA bhejo ya brand number notify karo." },
      { title:"⭐ Loyalty Points", text:"Har order add karne par aapko points milte hain." },
    ],
    marketing: [
      { title:"📊 Aapka Focus", text:"Brand positioning, campaigns aur digital marketing aapka domain hai." },
      { title:"✦ AI Modules", text:"Marketing AI, Social Media AI, Content AI, Brand Strategy AI available hain." },
    ],
    content_planner: [
      { title:"📅 Aapka Focus", text:"Content calendar plan karna aur shoots organize karna aapka kaam hai." },
      { title:"✍️ AI Modules", text:"Content AI, Social Media AI, Marketing AI. Weekly content plan, caption ideas, hashtag strategies." },
    ],
    content_shooter: [
      { title:"🎬 Aapka Focus", text:"Product shoots aur video content create karna." },
      { title:"🎬 AI Modules", text:"Visual AI aur Content AI available hain." },
    ],
    social_media: [
      { title:"📱 Aapka Focus", text:"Instagram, TikTok, Facebook manage karna." },
      { title:"📱 AI Modules", text:"Social Media AI, Content AI, Marketing AI." },
    ],
    customer_service: [
      { title:"💬 Aapka Focus", text:"Customer queries handle karna aur orders track karna." },
      { title:"📋 Order Tracking", text:"Admin tab mein orders ka status pipeline se update karo." },
      { title:"📱 WA Workflow", text:"Order mein phone number ho to WA button se directly message bhej sakte ho." },
      { title:"💬 AI Modules", text:"Customer AI se professional reply drafts lo." },
    ],
    packaging: [
      { title:"📦 Aapka Focus", text:"Orders pack karna aur dispatch karna." },
      { title:"⚙ Admin Tab", text:"Orders mein pipeline se status dispatched/delivered update karo. Dispatch pe automatic WA button aata hai." },
      { title:"🗃️ AI Modules", text:"Dispatch AI aur Inventory AI available." },
    ],
    inventory: [
      { title:"🗃️ Aapka Focus", text:"Stock levels track karna aur update karna." },
      { title:"📦 Inventory Tab", text:"Har product ka stock update karo. Low stock alert (< 10) automatically show hota hai dashboard pe bhi." },
    ],
    member: [
      { title:"👥 Welcome", text:`${getBrandConfig().businessName||"Business"} team mein khush aamdeed!` },
      { title:"📊 Dashboard", text:"Apna loyalty level aur points track karo." },
    ],
    viewer: [
      { title:"👁️ Viewer Access", text:"Aap dashboard aur brand overview dekh sakte hain." },
    ],
  };

  const roleGuide = guides[role] || guides.member;

  return (
    <div className="fadeUp" style={{ padding:24 }}>
      <div style={{ marginBottom:24 }}>
        <h2 style={S.heading(20)}>
          {(TEAM_ROLES[role]||TEAM_ROLES.member).label} — Aapka Guide
        </h2>
        <p style={{ color:C.muted, fontSize:14, marginTop:6 }}>Yahan aapka role, access aur workflow explain hai</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16, marginBottom:24 }}>
        {roleGuide.map((g,i)=>(
          <div key={i} className="card-hover" style={S.card()}>
            <h3 style={{ ...S.heading(14), marginBottom:8 }}>{g.title}</h3>
            <p style={{ fontSize:13, color:C.muted, lineHeight:1.7 }}>{g.text}</p>
          </div>
        ))}
      </div>

      <div style={{ ...S.card({ marginBottom:16 }) }}>
        <h3 style={{ ...S.heading(14), marginBottom:12 }}>📱 WhatsApp Guide</h3>
        {[
          "1. Order add karo Admin tab mein",
          "2. Customer ka phone number zaroor daalo (0XXXXXXXXXX format)",
          "3. Order save hone ke baad popup aata hai",
          "4. 'Customer Ko Message Bhejo' — direct customer WA opens",
          "5. 'Brand WA Ko Notify' — team ko inform karo",
          "6. Jab order dispatch ho — pipeline mein 'Dispatched' click karo, WA button auto-appear hoga",
        ].map((s,i)=>(
          <p key={i} style={{ fontSize:13, color:C.muted, marginBottom:6, paddingLeft:8,
            borderLeft:`2px solid ${C.gold}30` }}>{s}</p>
        ))}
      </div>

      <div style={S.card()}>
        <h3 style={{ ...S.heading(14), marginBottom:12 }}>✦ AI Brain Guide</h3>
        {[
          "1. AI Brain tab mein jao",
          "2. Apna module select karo (role ke hisaab se modules available hain)",
          "3. English, Urdu, ya Roman Urdu mein poochho — AI same language mein reply karta hai",
          "4. Agar AI kaam na kare: Owner se AI key set karwao",
          "5. Free Gemini key: aistudio.google.com → Get API Key → Create API Key",
        ].map((s,i)=>(
          <p key={i} style={{ fontSize:13, color:C.muted, marginBottom:6, paddingLeft:8,
            borderLeft:`2px solid ${C.gold}30` }}>{s}</p>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

// ─── ONBOARDING SCREEN ───────────────────────────────────────────────────────
function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(1);
  const [err,  setErr]  = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessName:"", tagline:"", ownerName:"", ownerEmail:"",
    category:"", whatsapp:"", website:"", logo:"",
    password:"", confirmPassword:"",
    fbApiKey:"", fbProjectId:"", fbAppId:"", fbMessagingSenderId:"",
    primaryColor:"#C9A84C",
    items:[
      {name:"",price:"",description:"",stock:50,emoji:"✦"},
      {name:"",price:"",description:"",stock:50,emoji:"✦"},
      {name:"",price:"",description:"",stock:50,emoji:"✦"},
    ]
  });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const catObj = BUSINESS_CATEGORIES.find(c=>c.id===form.category);
  const col = form.primaryColor || "#C9A84C";
  const goldG = `linear-gradient(135deg, ${col}, ${col}bb)`;

  const validate = () => {
    setErr("");
    if (step===1){
      if (!form.businessName.trim()) return setErr("Business name zaroori hai"), false;
      if (!form.category)            return setErr("Category select karo"), false;
      if (!form.ownerName.trim())    return setErr("Owner name zaroori hai"), false;
    }
    if (step===2){
      if (!form.ownerEmail.trim())                          return setErr("Email zaroori hai"), false;
      if (!form.password || form.password.length<6)         return setErr("Password min 6 characters"), false;
      if (form.password !== form.confirmPassword)           return setErr("Passwords match nahi karte"), false;
      if (!form.fbApiKey.trim())                            return setErr("Firebase API Key zaroori hai"), false;
      if (!form.fbProjectId.trim())                        return setErr("Firebase Project ID zaroori hai"), false;
    }
    return true;
  };

  const handleLaunch = async () => {
    if (!validate()) return;
    setLoading(true); setErr("");
    try {
      const fbCfg = {
        apiKey:            form.fbApiKey,
        authDomain:        `${form.fbProjectId}.firebaseapp.com`,
        projectId:         form.fbProjectId,
        storageBucket:     `${form.fbProjectId}.appspot.com`,
        messagingSenderId: form.fbMessagingSenderId,
        appId:             form.fbAppId,
      };
      window.__BOS_FB_CONFIG = fbCfg;

      const { initializeApp }           = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
      const { getAuth, createUserWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
      const { getFirestore, doc, setDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

      const app  = initializeApp(fbCfg, "bos_onboard_" + Date.now());
      const auth = getAuth(app);
      const db   = getFirestore(app);

      const cred = await createUserWithEmailAndPassword(auth, form.ownerEmail, form.password);

      const brandCfg = {
        businessName: form.businessName,
        tagline:      form.tagline || "",
        ownerName:    form.ownerName,
        ownerEmail:   form.ownerEmail,
        category:     form.category,
        categoryLabel: catObj?.label || form.category,
        categoryIcon:  catObj?.icon  || "🏢",
        primaryColor: form.primaryColor,
        whatsapp:     form.whatsapp  || "",
        website:      form.website   || "",
        logo:         form.logo      || "PASTE_LOGO_BASE64_HERE",
        createdAt:    new Date().toISOString(),
      };

      await setDoc(doc(db,"brand","config"), brandCfg);
      await setDoc(doc(db,"users",cred.user.uid), {
        email: form.ownerEmail, name: form.ownerName,
        role: "owner", points:0, orderCount:0,
        createdAt: serverTimestamp()
      });

      const items = form.items.filter(i=>i.name.trim()).map((i,idx)=>({
        ...i, id:"p"+Date.now()+idx, color:form.primaryColor,
        gender:"All", sold:0, price:Number(i.price)||0, stock:Number(i.stock)||50,
        subtitle:"", story:"", vibe:"", top:"", heart:"", base:"",
        longevity:"", season:"", occasion:"",
      }));
      if (items.length>0) {
        await setDoc(doc(db,"meta","products"),{ list: items });
      }

      try { localStorage.setItem("bos_fb_config", JSON.stringify(fbCfg)); } catch{}

      window.__BOS_CONFIG = brandCfg;
      refreshBrandConfig();
      onComplete({ fbConfig: fbCfg, brand: brandCfg });
    } catch(e) {
      setErr(e.message.replace("Firebase: ","").replace(/\(auth.*\)\./,""));
    }
    setLoading(false);
  };

  const progressW = `${(step/3)*100}%`;

  return (
    <div style={{ minHeight:"100vh", background:"#060504", display:"flex", alignItems:"center", justifyContent:"center", padding:20, fontFamily:"DM Sans,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#060504;color:#F5EFE6;}
        input,textarea,select{background:rgba(255,255,255,0.06);border:1px solid rgba(201,164,76,0.2);color:#F5EFE6;font-family:'DM Sans',sans-serif;border-radius:8px;padding:10px 14px;outline:none;transition:border .2s;width:100%;}
        input:focus,textarea:focus,select:focus{border-color:var(--col)!important;}
        input::placeholder,textarea::placeholder{color:rgba(245,239,230,0.35);}
        select option{background:#1C1710;color:#F5EFE6;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      <div style={{ width:"100%", maxWidth:600, animation:"fadeUp .4s ease", "--col":col }}>
        {/* Title */}
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ fontSize:44, marginBottom:10 }}>🚀</div>
          <h1 style={{ fontFamily:"Cinzel,serif", fontSize:28, fontWeight:700,
            background:`linear-gradient(135deg,${col},${col}bb)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            marginBottom:8 }}>Universal Business OS</h1>
          <p style={{ color:"rgba(245,239,230,0.5)", fontSize:14 }}>Apna business setup karo — 3 asaan steps mein</p>
        </div>

        {/* Progress */}
        <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:99, height:4, marginBottom:28 }}>
          <div style={{ height:"100%", borderRadius:99, background:`linear-gradient(90deg,${col},${col}bb)`, width:progressW, transition:"width .4s ease" }}/>
        </div>

        {/* Steps indicator */}
        <div style={{ display:"flex", justifyContent:"center", gap:20, marginBottom:24 }}>
          {["🏢 Business","🔐 Account","📦 Products"].map((s,i)=>(
            <div key={i} style={{ fontSize:12, fontWeight:600, color: step===i+1?col:"rgba(245,239,230,0.3)", transition:"color .2s" }}>{s}</div>
          ))}
        </div>

        {/* Card */}
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(201,164,76,0.15)", borderRadius:20, padding:28 }}>

          {/* ─── STEP 1: Business Identity ─── */}
          {step===1 && (
            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
              <OLabel>Business Name *</OLabel>
              <input placeholder="e.g. My Brand, Raza Store..." value={form.businessName} onChange={e=>set("businessName",e.target.value)}/>

              <OLabel>Tagline / Slogan</OLabel>
              <input placeholder="e.g. Quality You Can Trust" value={form.tagline} onChange={e=>set("tagline",e.target.value)}/>

              <OLabel>Owner / CEO Name *</OLabel>
              <input placeholder="Aapka naam" value={form.ownerName} onChange={e=>set("ownerName",e.target.value)}/>

              <OLabel>Business Category *</OLabel>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
                {BUSINESS_CATEGORIES.map(cat=>(
                  <button key={cat.id} onClick={()=>set("category",cat.id)}
                    style={{ padding:"10px 6px", borderRadius:10, border:`1.5px solid ${form.category===cat.id?cat.color:"rgba(201,164,76,0.15)"}`,
                      background: form.category===cat.id?`${cat.color}18`:"rgba(255,255,255,0.02)",
                      color: form.category===cat.id?cat.color:"rgba(245,239,230,0.55)",
                      fontSize:10, textAlign:"center", cursor:"pointer", transition:"all .2s" }}>
                    <div style={{ fontSize:18, marginBottom:3 }}>{cat.icon}</div>
                    <div style={{ fontWeight:600, lineHeight:1.2 }}>{cat.label}</div>
                  </button>
                ))}
              </div>

              <OLabel>Brand Primary Color</OLabel>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <input type="color" value={form.primaryColor} onChange={e=>set("primaryColor",e.target.value)} style={{ width:50, height:42, padding:4, cursor:"pointer" }}/>
                <input value={form.primaryColor} onChange={e=>set("primaryColor",e.target.value)} style={{ flex:1 }}/>
              </div>

              <OLabel>WhatsApp Number (923xxxxxxxxx)</OLabel>
              <input placeholder="923001234567" value={form.whatsapp} onChange={e=>set("whatsapp",e.target.value)}/>

              <OLabel>Website (optional)</OLabel>
              <input placeholder="https://yourbrand.com" value={form.website} onChange={e=>set("website",e.target.value)}/>
            </div>
          )}

          {/* ─── STEP 2: Account + Firebase ─── */}
          {step===2 && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ background:"rgba(201,164,76,0.08)", border:"1px solid rgba(201,164,76,0.2)", borderRadius:12, padding:14, fontSize:12, color:"rgba(245,239,230,0.7)", lineHeight:1.7 }}>
                💡 <strong style={{color:col}}>Firebase setup:</strong> console.firebase.google.com → New project → Authentication (Email/Password) + Firestore → Project Settings → Web App → Copy config
              </div>

              <OLabel>Owner Email *</OLabel>
              <input type="email" placeholder="owner@yourbrand.com" value={form.ownerEmail} onChange={e=>set("ownerEmail",e.target.value)}/>

              <OLabel>Password *</OLabel>
              <input type="password" placeholder="Min 6 characters" value={form.password} onChange={e=>set("password",e.target.value)}/>

              <OLabel>Confirm Password *</OLabel>
              <input type="password" placeholder="Dobara likhein" value={form.confirmPassword} onChange={e=>set("confirmPassword",e.target.value)}/>

              <hr style={{ border:"none", borderTop:"1px solid rgba(201,164,76,0.1)", margin:"4px 0" }}/>

              <OLabel>Firebase API Key *</OLabel>
              <input placeholder="AIzaSy..." value={form.fbApiKey} onChange={e=>set("fbApiKey",e.target.value)} style={{ fontFamily:"monospace", fontSize:12 }}/>

              <OLabel>Firebase Project ID *</OLabel>
              <input placeholder="my-business-12345" value={form.fbProjectId} onChange={e=>set("fbProjectId",e.target.value)}/>

              <OLabel>Firebase App ID</OLabel>
              <input placeholder="1:xxx:web:xxx" value={form.fbAppId} onChange={e=>set("fbAppId",e.target.value)}/>

              <OLabel>Messaging Sender ID</OLabel>
              <input placeholder="1048xxxxxxxx" value={form.fbMessagingSenderId} onChange={e=>set("fbMessagingSenderId",e.target.value)}/>
            </div>
          )}

          {/* ─── STEP 3: Products/Services ─── */}
          {step===3 && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ fontSize:13, color:"rgba(245,239,230,0.5)", marginBottom:4 }}>
                {catObj?.icon} Apne pehle 3 {catObj?.label||"items"} add karo (baad mein aur bhi add kar sakte ho)
              </div>
              {form.items.map((item,i)=>(
                <div key={i} style={{ background:"rgba(255,255,255,0.02)", borderRadius:12, padding:16, border:"1px solid rgba(201,164,76,0.1)" }}>
                  <div style={{ fontSize:11, color:col, fontWeight:600, marginBottom:10 }}>ITEM {i+1}</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    <input placeholder="Naam / Title" value={item.name} onChange={e=>{ const it=[...form.items]; it[i]={...it[i],name:e.target.value}; set("items",it); }}/>
                    <div style={{ display:"flex", gap:8 }}>
                      <input placeholder="Price (e.g. 1500)" value={item.price} onChange={e=>{ const it=[...form.items]; it[i]={...it[i],price:e.target.value}; set("items",it); }} style={{ flex:1 }}/>
                      <input placeholder="Emoji (e.g. 🌸)" value={item.emoji} onChange={e=>{ const it=[...form.items]; it[i]={...it[i],emoji:e.target.value}; set("items",it); }} style={{ width:80 }}/>
                    </div>
                    <textarea rows={2} placeholder="Short description..." value={item.description} onChange={e=>{ const it=[...form.items]; it[i]={...it[i],description:e.target.value}; set("items",it); }} style={{ resize:"vertical" }}/>
                  </div>
                </div>
              ))}
              <button onClick={()=>set("items",[...form.items,{name:"",price:"",description:"",stock:50,emoji:"✦"}])}
                style={{ padding:"10px", borderRadius:10, border:"1.5px dashed rgba(201,164,76,0.2)", background:"transparent", color:"rgba(245,239,230,0.4)", fontSize:13, cursor:"pointer" }}>
                + Aur Item Add Karo
              </button>
            </div>
          )}

          {/* Error */}
          {err && (
            <div style={{ marginTop:14, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:10, padding:"10px 14px", color:"#f87171", fontSize:13 }}>
              ⚠️ {err}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display:"flex", gap:10, marginTop:24 }}>
            {step>1 && (
              <button onClick={()=>setStep(s=>s-1)}
                style={{ flex:1, padding:"12px", borderRadius:12, border:"1px solid rgba(201,164,76,0.2)", background:"transparent", color:"rgba(245,239,230,0.6)", fontSize:14, cursor:"pointer" }}>
                ← Back
              </button>
            )}
            {step<3 ? (
              <button onClick={()=>{ if(validate()) setStep(s=>s+1); }}
                style={{ flex:2, padding:"12px", borderRadius:12, border:"none", background:goldG, color:"#060504", fontSize:15, fontWeight:700, cursor:"pointer" }}>
                Next →
              </button>
            ) : (
              <button onClick={handleLaunch} disabled={loading}
                style={{ flex:2, padding:"12px", borderRadius:12, border:"none", background:goldG, color:"#060504", fontSize:15, fontWeight:700, cursor:"pointer", opacity:loading?.7:1 }}>
                {loading ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}><span style={{ width:18,height:18,border:"2px solid #06050488",borderTopColor:"#060504",borderRadius:"50%",animation:"spin .8s linear infinite",display:"inline-block" }}/> Setting up...</span> : "🚀 Business OS Launch Karo!"}
              </button>
            )}
          </div>
        </div>

        <p style={{ textAlign:"center", marginTop:16, color:"rgba(245,239,230,0.25)", fontSize:12 }}>
          Pehle se account hai?{" "}
          <button onClick={()=>onComplete("login")} style={{ background:"none", border:"none", color:col, cursor:"pointer", fontSize:12 }}>
            Sign In karein
          </button>
        </p>
      </div>
    </div>
  );
}

function OLabel({ children }) {
  return <label style={{ display:"block", fontSize:11, fontWeight:600, color:"rgba(245,239,230,0.45)", textTransform:"uppercase", letterSpacing:.8, marginBottom:-10 }}>{children}</label>;
}


// ─── UNIVERSAL APP WRAPPER ────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("init"); // init | onboarding | app
  const [fbConfigReady, setFbConfigReady] = useState(false);
  const [brandLoaded, setBrandLoaded] = useState(false);

  useEffect(() => {
    // Check localStorage for saved firebase config
    try {
      const saved = localStorage.getItem("bos_fb_config");
      if (saved) {
        const cfg = JSON.parse(saved);
        window.__BOS_FB_CONFIG = cfg;
        // Override firebaseConfig for the original App to use
        Object.assign(firebaseConfig, cfg);
        // Try to load brand config
        loadBrandFromFirestore(cfg).then(brand => {
          if (brand) {
            window.__BOS_CONFIG = brand;
            refreshBrandConfig();
            setBrandLoaded(true);
            setFbConfigReady(true);
            setScreen("app");
          } else {
            setScreen("onboarding");
          }
        }).catch(() => setScreen("app")); // if load fails, try app anyway
      } else {
        setScreen("onboarding");
      }
    } catch {
      setScreen("onboarding");
    }
  }, []);

  const loadBrandFromFirestore = async (cfg) => {
    try {
      const { initializeApp, getApps } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
      const { getFirestore, doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
      const existingApps = getApps();
      const app = existingApps.find(a=>a.name==="[DEFAULT]") || initializeApp(cfg);
      const db  = getFirestore(app);
      const snap = await getDoc(doc(db,"brand","config"));
      if (snap.exists()) return snap.data();
      return null;
    } catch { return null; }
  };

  const handleOnboardingComplete = (result) => {
    if (result === "login") {
      setScreen("app");
      return;
    }
    const { fbConfig, brand } = result;
    try { localStorage.setItem("bos_fb_config", JSON.stringify(fbConfig)); } catch{}
    Object.assign(firebaseConfig, fbConfig);
    window.__BOS_CONFIG = brand;
    window.__BOS_FB_CONFIG = fbConfig;
    refreshBrandConfig();
    setBrandLoaded(true);
    setFbConfigReady(true);
    setScreen("app");
  };

  if (screen === "init") {
    return (
      <div style={{ minHeight:"100vh", background:"#060504", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ width:40, height:40, border:"2px solid rgba(201,164,76,0.2)", borderTopColor:"#C9A84C", borderRadius:"50%", animation:"spin .8s linear infinite" }}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (screen === "onboarding") {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // ── ORIGINAL APP LOGIC (unchanged from original) ──────────────────────────
  return <OriginalApp />;
}

// ─── ORIGINAL APP (renamed from export default App) ───────────────────────────
function OriginalApp() {
  const [fbReady, setFbReady] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [role,      setRole]     = useState("member");
  const [points,    setPoints]   = useState(0);
  const [orderCount,setOrderCount]=useState(0);
  const [members,   setMembers]  = useState([]);
  const [orders,    setOrders]   = useState([]);
  const [products,  setProducts] = useState(PRODUCTS_INITIAL);
  const [tasks,     setTasks]    = useState(DEFAULT_TASKS);
  const [tab,       setTab]      = useState("dashboard");
  const [waOrder,   setWaOrder]  = useState(null);
  const [levelPopup,setLevelPopup]=useState(null);
  const [db,        setDb]       = useState(null);
  const prevLevel = useRef(null);

  useEffect(()=>{
    loadFirebase().then(()=>{
      setFbReady(true);
      setDb(fb_db);
      onAuthChange(fb_auth, async (fbUser)=>{
        if (fbUser) {
          setAuthUser(fbUser);
          await loadUserData(fbUser);
        } else {
          setAuthUser(null);
          setAuthLoading(false);
        }
      });
    }).catch(e=>{ console.error("Firebase load error",e); setAuthLoading(false); });
  },[]);

  const loadUserData = async (fbUser) => {
    if (!fb_db) return;
    try {
      const uRef = fsDoc(fb_db,"users",fbUser.uid);
      let uSnap  = await fsGet(uRef);
      let userRole = fbUser.email===OWNER_EMAIL ? "owner" : "member";
      let userPts  = 0, userOrds = 0;

      if (!uSnap.exists()) {
        await fsSet(uRef, {
          email:fbUser.email, role:userRole,
          name:fbUser.displayName||fbUser.email.split("@")[0],
          points:0, orderCount:0, createdAt:fsServerTime()
        });
      } else {
        const d = uSnap.data();
        userRole = fbUser.email===OWNER_EMAIL ? "owner" : (d.role||"member");
        userPts  = d.points||0;
        userOrds = d.orderCount||0;
      }
      setRole(userRole); setPoints(userPts); setOrderCount(userOrds);
      prevLevel.current = getLoyaltyLevel(userPts);

      const oQ   = fsQuery(fsColl(fb_db,"orders"), fsOrderBy("createdAt","desc"));
      const oSnap= await fsGetDocs(oQ);
      const loadedOrders = oSnap.docs.map(d=>({...d.data(), firestoreId:d.id}));
      setOrders(loadedOrders);

      const mSnap = await fsGetDocs(fsColl(fb_db,"users"));
      setMembers(mSnap.docs.map(d=>({...d.data(), uid:d.id})));

      try {
        const metaP = await fsGet(fsDoc(fb_db,"meta","products"));
        if (metaP.exists() && metaP.data().list?.length) setProducts(metaP.data().list);
      } catch{}
      try {
        const metaT = await fsGet(fsDoc(fb_db,"meta","tasks"));
        if (metaT.exists() && metaT.data().list?.length) setTasks(metaT.data().list);
      } catch{}

    } catch(e){ console.error("loadUserData error",e); }
    setAuthLoading(false);
  };

  const handleLogin = async (fbUser) => {
    setAuthUser(fbUser);
    await loadUserData(fbUser);
  };

  const handleSignOut = async () => {
    await signOutFn(fb_auth);
    setAuthUser(null); setRole("member"); setPoints(0); setOrderCount(0);
    setOrders([]); setMembers([]); setProducts(PRODUCTS_INITIAL); setTasks(DEFAULT_TASKS);
  };

  const onPointsEarned = async (pts) => {
    const newPts = points + pts;
    const newCnt = orderCount + 1;
    setPoints(newPts); setOrderCount(newCnt);
    const newLvl = getLoyaltyLevel(newPts);
    if (newLvl && newLvl.name !== prevLevel.current?.name) {
      setLevelPopup(newLvl);
      prevLevel.current = newLvl;
    }
    if (db && authUser) {
      try { await fsUpdate(fsDoc(db,"users",authUser.uid),{points:newPts,orderCount:newCnt}); } catch{}
    }
  };

  if (!fbReady || authLoading) return <><GlobalStyles/><LoadingScreen/></>;
  if (!authUser) return <><GlobalStyles/><LoginScreen onLogin={handleLogin}/></>;

  const access = ACCESS(role);

  // ── UPDATED: Tabs array with Customers tab ────────────────────────────────
  const tabs = [
    { id:"dashboard", icon:"◈",  label:"Dashboard"  },
    { id:"inventory", icon:"📊", label:"Inventory"  },
    { id:"products",  icon:"✦",  label:"Products"   },
    { id:"ai",        icon:"✦",  label:"AI Brain"   },
    ...(access.admin      ? [{ id:"admin",     icon:"⚙",  label:"Admin"      }] : []),
    ...(access.admin      ? [{ id:"customers", icon:"👥", label:"Customers"  }] : []),
    ...(access.analytics  ? [{ id:"analytics", icon:"📈", label:"Analytics"  }] : []),
    ...(access.expenses   ? [{ id:"expenses",  icon:"💸", label:"Expenses"   }] : []),
    ...(access.teamPerf   ? [{ id:"teamperf",  icon:"🏆", label:"Team Stats" }] : []),
    ...(access.coupons    ? [{ id:"coupons",    icon:"🎟", label:"Coupons"     }] : []),
    ...(access.influencer ? [{ id:"influencer", icon:"🌟", label:"Influencers"  }] : []),
    ...(access.contentCal ? [{ id:"content",    icon:"📅", label:"Content"      }] : []),
    ...(access.followup   ? [{ id:"followup",   icon:"🔔", label:"Follow-ups"   }] : []),
    ...(access.returns    ? [{ id:"returns",    icon:"↩",  label:"Returns"      }] : []),
    ...(access.team       ? [{ id:"team",       icon:"👥", label:"Team"         }] : []),
    { id:"guide", icon:"📖", label:"My Guide" },
  ];

  return (
    <>
      <GlobalStyles/>
      <div style={{ minHeight:"100vh", background:C.bg, overflowX:"hidden" }}>
        <Header user={authUser} role={role} points={points} onSignOut={handleSignOut}/>
        <TabBar tabs={tabs} active={tab} onChange={setTab}/>
        <div style={{ padding:"0 0 40px" }}>
          {tab==="dashboard"  && <DashboardTab orders={orders} products={products}
            user={authUser} role={role} points={points} orderCount={orderCount}
            tasks={tasks} setTasks={setTasks} access={access} db={db}/>}
          {tab==="inventory"  && <InventoryTab products={products} setProducts={setProducts}
            access={access} db={db}/>}
          {tab==="products"   && <ProductsTab products={products} setProducts={setProducts}
            access={access} db={db}/>}
          {tab==="ai"         && <AIBrainTab role={role} products={products} orders={orders} db={db}/>}
          {tab==="admin"      && <AdminTab orders={orders} setOrders={setOrders}
            products={products} setProducts={setProducts}
            user={authUser} role={role} access={access} db={db}
            onWAPopup={setWaOrder} onPointsEarned={onPointsEarned}/>}
          {tab==="customers"  && <CustomerLoyaltyTab orders={orders} access={access}/>}
          {tab==="analytics"  && <SalesAnalyticsTab orders={orders} products={products}/>}
          {tab==="expenses"   && <ExpenseTrackerTab orders={orders} db={db} access={access}/>}
          {tab==="teamperf"   && <TeamPerformanceTab orders={orders} members={members} access={access}/>}
          {tab==="coupons"    && <CouponManagerTab db={db} access={access} orders={orders}/>}
          {tab==="influencer" && <InfluencerTrackerTab db={db} access={access} orders={orders}/>}
          {tab==="content"    && <ContentCalendarTab db={db} access={access} role={role}/>}
          {tab==="followup"   && <FollowUpTab db={db} access={access} orders={orders}/>}
          {tab==="returns"    && <ReturnRefundTab db={db} access={access} orders={orders}/>}
          {tab==="team"       && <TeamTab members={members} setMembers={setMembers}
            user={authUser} access={access} db={db}/>}
          {tab==="guide"      && <MyGuideTab role={role}/>}
        </div>
      </div>

      {waOrder    && <WAPopup order={waOrder} onClose={()=>setWaOrder(null)}/>}
      {levelPopup && <LevelUnlockPopup level={levelPopup} onClose={()=>setLevelPopup(null)}/>}
    </>
  );
}
}
