import { useState, useEffect, useRef, useCallback } from "react";

// ─── FIREBASE CDN LOADER ─────────────────────────────────────────────────────
let fb_app, fb_auth, fb_db;
let fsDoc, fsColl, fsGet, fsSet, fsUpdate, fsGetDocs, fsQuery, fsOrderBy, fsServerTime, fsAdd, fsWhere;
let signInWithEmail, createUserWithEmail, signOutFn, onAuthStateChange;
let fbReady = false;

function loadFirebase(config) {
  return new Promise((resolve) => {
    if (fbReady) return resolve(true);
    const s1 = document.createElement("script"); s1.type = "module";
    s1.textContent = `
      import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
      import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
      import { getFirestore, doc, collection, getDoc, setDoc, updateDoc, getDocs, query, orderBy, serverTimestamp, addDoc, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
      const app  = initializeApp(${JSON.stringify(config)});
      const auth = getAuth(app);
      const db   = getFirestore(app);
      window.__FB = { app, auth, db, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, doc, collection, getDoc, setDoc, updateDoc, getDocs, query, orderBy, serverTimestamp, addDoc, where };
      window.dispatchEvent(new Event("fb_ready"));
    `;
    document.head.appendChild(s1);
    window.addEventListener("fb_ready", () => {
      const F = window.__FB;
      fb_app = F.app; fb_auth = F.auth; fb_db = F.db;
      fsDoc = F.doc; fsColl = F.collection; fsGet = F.getDoc; fsSet = F.setDoc;
      fsUpdate = F.updateDoc; fsGetDocs = F.getDocs; fsQuery = F.query;
      fsOrderBy = F.orderBy; fsServerTime = F.serverTimestamp; fsAdd = F.addDoc; fsWhere = F.where;
      signInWithEmail = F.signInWithEmailAndPassword;
      createUserWithEmail = F.createUserWithEmailAndPassword;
      signOutFn = F.signOut;
      onAuthStateChange = F.onAuthStateChanged;
      fbReady = true;
      resolve(true);
    }, { once: true });
  });
}

// ─── BUSINESS CATEGORIES ─────────────────────────────────────────────────────
const BUSINESS_CATEGORIES = [
  { id: "ecommerce",    icon: "🛍️",  label: "E-Commerce / Products",     color: "#6366f1" },
  { id: "food",         icon: "🍽️",  label: "Food & Restaurant",          color: "#f59e0b" },
  { id: "services",     icon: "⚙️",  label: "Services (Salon, Clinic…)",  color: "#10b981" },
  { id: "digital",      icon: "💻",  label: "Digital / Freelance",        color: "#3b82f6" },
  { id: "fashion",      icon: "👗",  label: "Fashion & Apparel",          color: "#ec4899" },
  { id: "real_estate",  icon: "🏠",  label: "Real Estate",                color: "#8b5cf6" },
  { id: "education",    icon: "📚",  label: "Education & Coaching",       color: "#06b6d4" },
  { id: "health",       icon: "❤️",  label: "Health & Wellness",          color: "#ef4444" },
  { id: "tech",         icon: "🚀",  label: "Tech & SaaS",                color: "#14b8a6" },
  { id: "beauty",       icon: "💄",  label: "Beauty & Cosmetics",         color: "#f472b6" },
  { id: "automotive",   icon: "🚗",  label: "Automotive",                 color: "#64748b" },
  { id: "travel",       icon: "✈️",  label: "Travel & Tourism",           color: "#0ea5e9" },
  { id: "finance",      icon: "💰",  label: "Finance & Consulting",       color: "#84cc16" },
  { id: "media",        icon: "🎬",  label: "Media & Entertainment",      color: "#a855f7" },
  { id: "other",        icon: "🌐",  label: "Other Business",             color: "#94a3b8" },
];

const TEAM_ROLES_UNIVERSAL = {
  owner:   { label: "👑 Owner / CEO",      color: "#f59e0b" },
  manager: { label: "📋 Manager",           color: "#6366f1" },
  sales:   { label: "📈 Sales",             color: "#10b981" },
  support: { label: "💬 Customer Support",  color: "#3b82f6" },
  ops:     { label: "⚙️ Operations",        color: "#8b5cf6" },
  finance: { label: "💰 Finance",           color: "#84cc16" },
  hr:      { label: "👥 HR",                color: "#ec4899" },
  member:  { label: "🙂 Team Member",       color: "#94a3b8" },
  viewer:  { label: "👁 Viewer",            color: "#64748b" },
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
function GlobalStyles({ brand }) {
  const primary = brand?.primaryColor || "#6366f1";
  const bg      = brand?.darkMode !== false ? "#0a0a0f" : "#f8fafc";
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :root {
        --primary: ${primary};
        --bg: ${bg};
        --surface: rgba(255,255,255,0.04);
        --border: rgba(255,255,255,0.08);
        --text: #f1f5f9;
        --muted: rgba(241,245,249,0.5);
        --font-display: 'Syne', sans-serif;
        --font-body: 'DM Sans', sans-serif;
      }
      html, body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
      ::-webkit-scrollbar { width: 4px; height: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 2px; }
      input, textarea, select {
        background: rgba(255,255,255,0.06);
        border: 1px solid var(--border);
        color: var(--text);
        font-family: var(--font-body);
        border-radius: 8px;
        padding: 10px 14px;
        outline: none;
        transition: border 0.2s;
        width: 100%;
      }
      input:focus, textarea:focus, select:focus { border-color: var(--primary); }
      input::placeholder, textarea::placeholder { color: var(--muted); }
      button { cursor: pointer; font-family: var(--font-body); }
      select option { background: #1e1e2e; color: #f1f5f9; }
      @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.5;} }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes shimmer { from{background-position:-200% 0} to{background-position:200% 0} }
      .fade-up { animation: fadeUp 0.4s ease forwards; }
    `}</style>
  );
}

// ─── LOADING SCREEN ───────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, background:"#0a0a0f" }}>
      <div style={{ width:48, height:48, border:"3px solid rgba(99,102,241,0.2)", borderTop:"3px solid #6366f1", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
      <p style={{ color:"rgba(241,245,249,0.5)", fontFamily:"'DM Sans',sans-serif", fontSize:14 }}>Loading your Business OS…</p>
    </div>
  );
}

// ─── ONBOARDING FORM ──────────────────────────────────────────────────────────
function OnboardingForm({ onComplete }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    // Step 1 – Business Identity
    businessName: "", tagline: "", ownerName: "", category: "",
    // Step 2 – Brand Setup
    primaryColor: "#6366f1", logoText: "", whatsapp: "", email: "", website: "",
    // Step 3 – Products/Services (3 initial items)
    items: [
      { name: "", price: "", description: "" },
      { name: "", price: "", description: "" },
      { name: "", price: "", description: "" },
    ],
    // Step 4 – Account
    accountEmail: "", password: "", confirmPassword: "",
    // Firebase config
    firebaseApiKey: "", firebaseAuthDomain: "", firebaseProjectId: "",
    firebaseStorageBucket: "", firebaseMessagingSenderId: "", firebaseAppId: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const catObj = BUSINESS_CATEGORIES.find(c => c.id === form.category);

  const validateStep = () => {
    setError("");
    if (step === 1) {
      if (!form.businessName.trim()) return setError("Business name required"), false;
      if (!form.category) return setError("Please select a category"), false;
      if (!form.ownerName.trim()) return setError("Owner name required"), false;
    }
    if (step === 2) {
      if (!form.accountEmail.trim()) return setError("Email required"), false;
      if (!form.password || form.password.length < 6) return setError("Password min 6 characters"), false;
      if (form.password !== form.confirmPassword) return setError("Passwords do not match"), false;
      if (!form.firebaseProjectId.trim()) return setError("Firebase Project ID required"), false;
      if (!form.firebaseApiKey.trim()) return setError("Firebase API Key required"), false;
    }
    return true;
  };

  const handleNext = () => { if (validateStep()) setStep(s => s + 1); };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    setError("");
    try {
      const config = {
        apiKey:            form.firebaseApiKey,
        authDomain:        form.firebaseAuthDomain || `${form.firebaseProjectId}.firebaseapp.com`,
        projectId:         form.firebaseProjectId,
        storageBucket:     form.firebaseStorageBucket || `${form.firebaseProjectId}.appspot.com`,
        messagingSenderId: form.firebaseMessagingSenderId,
        appId:             form.firebaseAppId,
      };
      await loadFirebase(config);
      const cred = await createUserWithEmail(fb_auth, form.accountEmail, form.password);
      const brandData = {
        businessName: form.businessName,
        tagline:      form.tagline,
        ownerName:    form.ownerName,
        ownerEmail:   form.accountEmail,
        category:     form.category,
        primaryColor: form.primaryColor,
        logoText:     form.logoText || form.businessName.slice(0,2).toUpperCase(),
        whatsapp:     form.whatsapp,
        email:        form.email || form.accountEmail,
        website:      form.website,
        items:        form.items.filter(i => i.name.trim()),
        createdAt:    new Date().toISOString(),
      };
      await fsSet(fsDoc(fb_db, "brand", "config"), brandData);
      await fsSet(fsDoc(fb_db, "users", cred.user.uid), {
        email:     form.accountEmail,
        name:      form.ownerName,
        role:      "owner",
        createdAt: fsServerTime(),
      });
      onComplete({ user: cred.user, brand: brandData, firebaseConfig: config });
    } catch (e) {
      setError(e.message || "Something went wrong");
    }
    setLoading(false);
  };

  const progressW = `${(step / 3) * 100}%`;

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ width:"100%", maxWidth:580 }} className="fade-up">
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🚀</div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, background:"linear-gradient(135deg,#6366f1,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:8 }}>
            Business OS Setup
          </h1>
          <p style={{ color:"rgba(241,245,249,0.5)", fontSize:14 }}>Apna business setup karo — sirf 3 steps mein</p>
        </div>

        {/* Progress */}
        <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:99, height:4, marginBottom:32 }}>
          <div style={{ height:"100%", borderRadius:99, background:"linear-gradient(90deg,#6366f1,#a78bfa)", width:progressW, transition:"width 0.4s ease" }}/>
        </div>

        {/* Card */}
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:32 }}>

          {/* ── STEP 1: Business Identity ── */}
          {step === 1 && (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <SectionTitle icon="🏢" title="Business Identity" subtitle="Apne business ki basic details" />

              <Field label="Business Name *">
                <input placeholder="e.g. AS Khushboo, Zara Boutique…" value={form.businessName} onChange={e=>set("businessName",e.target.value)}/>
              </Field>

              <Field label="Tagline / Slogan">
                <input placeholder="e.g. Quality You Can Trust" value={form.tagline} onChange={e=>set("tagline",e.target.value)}/>
              </Field>

              <Field label="Owner / CEO Name *">
                <input placeholder="Aapka naam" value={form.ownerName} onChange={e=>set("ownerName",e.target.value)}/>
              </Field>

              <Field label="Business Category *">
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                  {BUSINESS_CATEGORIES.map(cat => (
                    <button key={cat.id} onClick={()=>set("category",cat.id)}
                      style={{ padding:"10px 8px", borderRadius:10, border:`1.5px solid ${form.category===cat.id ? cat.color : "rgba(255,255,255,0.08)"}`,
                        background: form.category===cat.id ? `${cat.color}22` : "rgba(255,255,255,0.03)",
                        color: form.category===cat.id ? cat.color : "rgba(241,245,249,0.6)",
                        fontSize:11, textAlign:"center", transition:"all 0.2s", cursor:"pointer" }}>
                      <div style={{ fontSize:18, marginBottom:4 }}>{cat.icon}</div>
                      <div style={{ fontWeight:500, lineHeight:1.2 }}>{cat.label}</div>
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Contact (WhatsApp)">
                <input placeholder="923xxxxxxxxx" value={form.whatsapp} onChange={e=>set("whatsapp",e.target.value)}/>
              </Field>

              <Field label="Website (optional)">
                <input placeholder="https://yourbusiness.com" value={form.website} onChange={e=>set("website",e.target.value)}/>
              </Field>
            </div>
          )}

          {/* ── STEP 2: Account + Firebase ── */}
          {step === 2 && (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <SectionTitle icon="🔐" title="Account Setup" subtitle="Login credentials aur Firebase config" />

              <div style={{ background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.2)", borderRadius:12, padding:14, fontSize:13, color:"rgba(241,245,249,0.7)", lineHeight:1.6 }}>
                💡 <strong style={{color:"#a78bfa"}}>Firebase setup:</strong> console.firebase.google.com → New project → Enable Auth + Firestore → Project Settings → Web App → Copy config
              </div>

              <Field label="Brand Primary Color">
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <input type="color" value={form.primaryColor} onChange={e=>set("primaryColor",e.target.value)} style={{ width:50, height:42, padding:4, cursor:"pointer" }}/>
                  <input value={form.primaryColor} onChange={e=>set("primaryColor",e.target.value)} style={{ flex:1 }}/>
                </div>
              </Field>

              <Field label="Logo Initials (2-3 letters)">
                <input placeholder="e.g. ASK, ZB, MY" maxLength={3} value={form.logoText} onChange={e=>set("logoText",e.target.value.toUpperCase())}/>
              </Field>

              <hr style={{ border:"none", borderTop:"1px solid rgba(255,255,255,0.06)" }}/>

              <Field label="Owner Email *">
                <input type="email" placeholder="owner@yourbusiness.com" value={form.accountEmail} onChange={e=>set("accountEmail",e.target.value)}/>
              </Field>
              <Field label="Password *">
                <input type="password" placeholder="Min 6 characters" value={form.password} onChange={e=>set("password",e.target.value)}/>
              </Field>
              <Field label="Confirm Password *">
                <input type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e=>set("confirmPassword",e.target.value)}/>
              </Field>

              <hr style={{ border:"none", borderTop:"1px solid rgba(255,255,255,0.06)" }}/>

              <Field label="Firebase API Key *">
                <input placeholder="AIzaSy…" value={form.firebaseApiKey} onChange={e=>set("firebaseApiKey",e.target.value)}/>
              </Field>
              <Field label="Firebase Project ID *">
                <input placeholder="my-business-os" value={form.firebaseProjectId} onChange={e=>set("firebaseProjectId",e.target.value)}/>
              </Field>
              <Field label="Firebase App ID">
                <input placeholder="1:xxx:web:xxx" value={form.firebaseAppId} onChange={e=>set("firebaseAppId",e.target.value)}/>
              </Field>
              <Field label="Messaging Sender ID">
                <input placeholder="1048xxxxxx" value={form.firebaseMessagingSenderId} onChange={e=>set("firebaseMessagingSenderId",e.target.value)}/>
              </Field>
            </div>
          )}

          {/* ── STEP 3: Products / Services ── */}
          {step === 3 && (
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <SectionTitle icon={catObj?.icon||"📦"} title={`Your ${catObj?.label||"Items"}`} subtitle="Shuru karne ke liye 3 items add karo (baad mein aur bhi add kar sakte hain)" />

              {form.items.map((item, i) => (
                <div key={i} style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, padding:16, border:"1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize:12, color:form.primaryColor, fontWeight:600, marginBottom:10 }}>ITEM {i+1}</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    <input placeholder="Name / Title" value={item.name} onChange={e=>{ const it=[...form.items]; it[i]={...it[i],name:e.target.value}; set("items",it); }}/>
                    <input placeholder="Price (e.g. 1500, Free, On Request)" value={item.price} onChange={e=>{ const it=[...form.items]; it[i]={...it[i],price:e.target.value}; set("items",it); }}/>
                    <textarea rows={2} placeholder="Short description…" value={item.description} onChange={e=>{ const it=[...form.items]; it[i]={...it[i],description:e.target.value}; set("items",it); }} style={{ resize:"vertical" }}/>
                  </div>
                </div>
              ))}

              <button onClick={()=>set("items",[...form.items,{name:"",price:"",description:""}])}
                style={{ padding:"10px", borderRadius:10, border:"1.5px dashed rgba(255,255,255,0.12)", background:"transparent", color:"rgba(241,245,249,0.5)", fontSize:13, width:"100%" }}>
                + Add Another Item
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ marginTop:16, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:10, padding:"10px 14px", color:"#f87171", fontSize:13 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display:"flex", gap:10, marginTop:24 }}>
            {step > 1 && (
              <button onClick={()=>setStep(s=>s-1)}
                style={{ flex:1, padding:"12px", borderRadius:12, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"rgba(241,245,249,0.7)", fontSize:14 }}>
                ← Back
              </button>
            )}
            {step < 3 ? (
              <button onClick={handleNext}
                style={{ flex:2, padding:"12px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#6366f1,#a78bfa)", color:"#fff", fontSize:15, fontWeight:600 }}>
                Next →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                style={{ flex:2, padding:"12px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#6366f1,#a78bfa)", color:"#fff", fontSize:15, fontWeight:600, opacity:loading?0.7:1 }}>
                {loading ? "Setting up…" : "🚀 Launch My Business OS"}
              </button>
            )}
          </div>
        </div>

        <p style={{ textAlign:"center", marginTop:20, color:"rgba(241,245,249,0.3)", fontSize:12 }}>
          Already setup? <button onClick={()=>onComplete(null)} style={{ background:"none", border:"none", color:"#a78bfa", cursor:"pointer", fontSize:12 }}>Sign In</button>
        </p>
      </div>
    </div>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, firebaseConfig }) {
  const [email, setEmail]   = useState("");
  const [pass,  setPass]    = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [fbConfig, setFbConfig] = useState({ apiKey:"", projectId:"" });
  const [configMode, setConfigMode] = useState(!firebaseConfig);

  const handleLogin = async () => {
    setError(""); setLoading(true);
    try {
      const cfg = firebaseConfig || { apiKey: fbConfig.apiKey, authDomain:`${fbConfig.projectId}.firebaseapp.com`, projectId:fbConfig.projectId };
      await loadFirebase(cfg);
      const cred = await signInWithEmail(fb_auth, email, pass);
      onLogin(cred.user, cfg);
    } catch(e) { setError(e.message||"Login failed"); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0f", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:420 }} className="fade-up">
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>⚡</div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, background:"linear-gradient(135deg,#6366f1,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Business OS</h1>
          <p style={{ color:"rgba(241,245,249,0.4)", fontSize:13, marginTop:4 }}>Sign in to your dashboard</p>
        </div>
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:28, display:"flex", flexDirection:"column", gap:14 }}>
          {configMode && (
            <>
              <Field label="Firebase API Key"><input value={fbConfig.apiKey} onChange={e=>setFbConfig(f=>({...f,apiKey:e.target.value}))} placeholder="AIzaSy…"/></Field>
              <Field label="Firebase Project ID"><input value={fbConfig.projectId} onChange={e=>setFbConfig(f=>({...f,projectId:e.target.value}))} placeholder="my-project-id"/></Field>
              <hr style={{ border:"none", borderTop:"1px solid rgba(255,255,255,0.06)" }}/>
            </>
          )}
          <Field label="Email"><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="owner@business.com"/></Field>
          <Field label="Password"><input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&handleLogin()}/></Field>
          {error && <div style={{ color:"#f87171", fontSize:13, background:"rgba(239,68,68,0.1)", padding:"8px 12px", borderRadius:8 }}>⚠️ {error}</div>}
          <button onClick={handleLogin} disabled={loading}
            style={{ marginTop:4, padding:"13px", borderRadius:12, border:"none", background:"linear-gradient(135deg,#6366f1,#a78bfa)", color:"#fff", fontSize:15, fontWeight:600, opacity:loading?0.7:1 }}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </div>
        <p style={{ textAlign:"center", marginTop:16, color:"rgba(241,245,249,0.3)", fontSize:12 }}>
          New business? <button onClick={()=>onLogin("setup")} style={{ background:"none", border:"none", color:"#a78bfa", cursor:"pointer", fontSize:12 }}>Setup your Business OS</button>
        </p>
      </div>
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header({ brand, user, role, onSignOut }) {
  const col = brand?.primaryColor || "#6366f1";
  return (
    <div style={{ padding:"12px 24px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(10,10,15,0.95)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:100 }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,${col},${col}88)`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:13, color:"#fff" }}>
          {brand?.logoText || "OS"}
        </div>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15 }}>{brand?.businessName || "Business OS"}</div>
          <div style={{ fontSize:10, color:"rgba(241,245,249,0.4)", textTransform:"uppercase", letterSpacing:1 }}>{brand?.tagline || "Management System"}</div>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:12, fontWeight:600, color:col }}>{TEAM_ROLES_UNIVERSAL[role]?.label || role}</div>
          <div style={{ fontSize:11, color:"rgba(241,245,249,0.4)" }}>{user?.email}</div>
        </div>
        <button onClick={onSignOut} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"rgba(241,245,249,0.5)", fontSize:12 }}>Sign Out</button>
      </div>
    </div>
  );
}

// ─── TAB BAR ──────────────────────────────────────────────────────────────────
function TabBar({ tabs, active, onChange, brand }) {
  const col = brand?.primaryColor || "#6366f1";
  return (
    <div style={{ display:"flex", gap:4, padding:"12px 24px", overflowX:"auto", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={()=>onChange(t.id)}
          style={{ padding:"8px 16px", borderRadius:8, border:"none", background: active===t.id ? `${col}22` : "transparent",
            color: active===t.id ? col : "rgba(241,245,249,0.5)", fontSize:13, fontWeight: active===t.id ? 600 : 400,
            whiteSpace:"nowrap", transition:"all 0.2s", borderBottom: active===t.id ? `2px solid ${col}` : "2px solid transparent" }}>
          {t.icon} {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── DASHBOARD TAB ────────────────────────────────────────────────────────────
function DashboardTab({ orders, brand, role, user, tasks, setTasks, db }) {
  const col = brand?.primaryColor || "#6366f1";
  const catObj = BUSINESS_CATEGORIES.find(c => c.id === brand?.category);
  const totalRevenue = orders.reduce((s,o) => s + (parseFloat(o.amount)||0), 0);
  const todayOrders  = orders.filter(o => o.createdAt?.seconds > Date.now()/1000 - 86400).length;

  const stats = [
    { label:"Total Orders",   value:orders.length,      icon:"📋", color:"#6366f1" },
    { label:"Revenue",        value:`Rs ${totalRevenue.toLocaleString()}`, icon:"💰", color:"#10b981" },
    { label:"Today Orders",   value:todayOrders,         icon:"📅", color:"#f59e0b" },
    { label:"Pending",        value:orders.filter(o=>o.status==="pending").length, icon:"⏳", color:"#ef4444" },
  ];

  return (
    <div style={{ padding:"24px", display:"flex", flexDirection:"column", gap:24 }} className="fade-up">
      {/* Welcome */}
      <div style={{ background:`linear-gradient(135deg,${col}22,${col}08)`, border:`1px solid ${col}33`, borderRadius:16, padding:24 }}>
        <div style={{ fontSize:24, marginBottom:4 }}>{catObj?.icon || "🚀"}</div>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700 }}>Welcome back, {brand?.ownerName}!</h2>
        <p style={{ color:"rgba(241,245,249,0.5)", fontSize:14, marginTop:4 }}>{brand?.businessName} · {catObj?.label}</p>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:18 }}>
            <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:22, fontWeight:700, fontFamily:"'Syne',sans-serif", color:s.color }}>{s.value}</div>
            <div style={{ fontSize:12, color:"rgba(241,245,249,0.4)", marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, marginBottom:14 }}>Recent Orders</h3>
        {orders.length === 0 ? (
          <EmptyState icon="📋" text="No orders yet. Add your first order from Admin tab!" />
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {orders.slice(0,5).map((o,i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.03)", borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", border:"1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:14 }}>{o.customerName || "Customer"}</div>
                  <div style={{ fontSize:12, color:"rgba(241,245,249,0.4)" }}>{o.product || "Order"} · {new Date((o.createdAt?.seconds||0)*1000).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontWeight:600, color:col }}>Rs {o.amount || 0}</div>
                  <StatusBadge status={o.status||"pending"} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PRODUCTS / SERVICES TAB ──────────────────────────────────────────────────
function ProductsTab({ products, setProducts, brand, access, db }) {
  const col = brand?.primaryColor || "#6366f1";
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name:"", price:"", description:"", stock:0 });
  const [saving, setSaving] = useState(false);

  const addItem = async () => {
    if (!newItem.name.trim()) return;
    setSaving(true);
    const updated = [...products, { ...newItem, id: Date.now().toString() }];
    setProducts(updated);
    if (db) {
      try { await fsSet(fsDoc(db,"meta","products"),{ list:updated }); } catch{}
    }
    setNewItem({ name:"", price:"", description:"", stock:0 });
    setShowAdd(false);
    setSaving(false);
  };

  const catObj = BUSINESS_CATEGORIES.find(c => c.id === brand?.category);

  return (
    <div style={{ padding:24 }} className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20 }}>{catObj?.icon} {catObj?.label || "Products"}</h2>
        {access?.productsEdit && (
          <button onClick={()=>setShowAdd(!showAdd)}
            style={{ padding:"9px 18px", borderRadius:10, border:"none", background:`linear-gradient(135deg,${col},${col}88)`, color:"#fff", fontSize:13, fontWeight:600 }}>
            + Add Item
          </button>
        )}
      </div>

      {showAdd && (
        <div style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${col}33`, borderRadius:14, padding:20, marginBottom:20, display:"flex", flexDirection:"column", gap:12 }}>
          <h3 style={{ fontSize:14, fontWeight:600, color:col }}>New Item</h3>
          <input placeholder="Name" value={newItem.name} onChange={e=>setNewItem(n=>({...n,name:e.target.value}))}/>
          <input placeholder="Price" value={newItem.price} onChange={e=>setNewItem(n=>({...n,price:e.target.value}))}/>
          <textarea placeholder="Description" rows={2} value={newItem.description} onChange={e=>setNewItem(n=>({...n,description:e.target.value}))} style={{ resize:"vertical" }}/>
          <input type="number" placeholder="Stock (0 = unlimited)" value={newItem.stock} onChange={e=>setNewItem(n=>({...n,stock:e.target.value}))}/>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={addItem} disabled={saving}
              style={{ flex:1, padding:10, borderRadius:8, border:"none", background:col, color:"#fff", fontSize:13, fontWeight:600 }}>
              {saving?"Saving…":"Save Item"}
            </button>
            <button onClick={()=>setShowAdd(false)}
              style={{ padding:10, borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"rgba(241,245,249,0.5)", fontSize:13 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:14 }}>
        {products.map((p,i) => (
          <div key={i} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:20, transition:"border 0.2s" }}>
            <div style={{ width:44, height:44, borderRadius:10, background:`${col}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, marginBottom:14 }}>
              {catObj?.icon || "📦"}
            </div>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, marginBottom:4 }}>{p.name}</h3>
            {p.description && <p style={{ fontSize:12, color:"rgba(241,245,249,0.5)", marginBottom:10, lineHeight:1.5 }}>{p.description}</p>}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 }}>
              <span style={{ color:col, fontWeight:700, fontSize:16 }}>{p.price || "—"}</span>
              {p.stock > 0 && <span style={{ fontSize:11, color:"rgba(241,245,249,0.4)" }}>Stock: {p.stock}</span>}
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && <EmptyState icon={catObj?.icon||"📦"} text="No items yet. Add your first product or service!" />}
    </div>
  );
}

// ─── ORDERS / ADMIN TAB ───────────────────────────────────────────────────────
function AdminTab({ orders, setOrders, products, brand, user, access, db }) {
  const col = brand?.primaryColor || "#6366f1";
  const [form, setForm] = useState({ customerName:"", phone:"", product:"", amount:"", status:"pending", notes:"" });
  const [saving, setSaving] = useState(false);

  const addOrder = async () => {
    if (!form.customerName.trim()) return;
    setSaving(true);
    const order = { ...form, createdAt:{ seconds: Date.now()/1000 }, addedBy: user?.email };
    let updated;
    if (db) {
      try {
        const ref = await fsAdd(fsColl(db,"orders"), { ...order, createdAt:fsServerTime() });
        updated = [{ ...order, firestoreId:ref.id }, ...orders];
      } catch { updated = [order, ...orders]; }
    } else { updated = [order, ...orders]; }
    setOrders(updated);
    setForm({ customerName:"", phone:"", product:"", amount:"", status:"pending", notes:"" });
    setSaving(false);
  };

  const updateStatus = async (i, status) => {
    const updated = [...orders];
    updated[i] = { ...updated[i], status };
    setOrders(updated);
    if (db && updated[i].firestoreId) {
      try { await fsUpdate(fsDoc(db,"orders",updated[i].firestoreId),{status}); } catch{}
    }
  };

  const STATUSES = ["pending","confirmed","processing","dispatched","delivered","cancelled"];

  return (
    <div style={{ padding:24 }} className="fade-up">
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, marginBottom:20 }}>📋 Order Management</h2>

      {/* Add Order Form */}
      <div style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${col}22`, borderRadius:16, padding:20, marginBottom:24 }}>
        <h3 style={{ fontSize:14, fontWeight:600, color:col, marginBottom:14 }}>+ New Order</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <Field label="Customer Name">
            <input placeholder="Customer ka naam" value={form.customerName} onChange={e=>setForm(f=>({...f,customerName:e.target.value}))}/>
          </Field>
          <Field label="Phone">
            <input placeholder="03xx-xxxxxxx" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/>
          </Field>
          <Field label="Product / Service">
            <select value={form.product} onChange={e=>setForm(f=>({...f,product:e.target.value}))}>
              <option value="">Select…</option>
              {products.map(p => <option key={p.id||p.name} value={p.name}>{p.name}</option>)}
              <option value="custom">Custom / Other</option>
            </select>
          </Field>
          <Field label="Amount (Rs)">
            <input type="number" placeholder="0" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
              {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
            </select>
          </Field>
          <Field label="Notes">
            <input placeholder="Optional notes" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/>
          </Field>
        </div>
        <button onClick={addOrder} disabled={saving}
          style={{ marginTop:14, padding:"10px 24px", borderRadius:10, border:"none", background:`linear-gradient(135deg,${col},${col}88)`, color:"#fff", fontSize:13, fontWeight:600 }}>
          {saving?"Saving…":"Add Order"}
        </button>
      </div>

      {/* Orders List */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {orders.map((o,i) => (
          <div key={i} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
              <div>
                <div style={{ fontWeight:600, fontSize:15 }}>{o.customerName}</div>
                <div style={{ fontSize:12, color:"rgba(241,245,249,0.4)" }}>{o.phone} · {o.product}</div>
                {o.notes && <div style={{ fontSize:12, color:"rgba(241,245,249,0.3)", marginTop:2 }}>{o.notes}</div>}
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontWeight:700, color:col, fontSize:16 }}>Rs {o.amount || 0}</div>
                <div style={{ marginTop:6, display:"flex", gap:4, flexWrap:"wrap", justifyContent:"flex-end" }}>
                  {STATUSES.map(s => (
                    <button key={s} onClick={()=>updateStatus(i,s)}
                      style={{ padding:"3px 8px", borderRadius:6, border:`1px solid ${o.status===s?col:"rgba(255,255,255,0.1)"}`,
                        background: o.status===s?`${col}33`:"transparent",
                        color: o.status===s?col:"rgba(241,245,249,0.4)", fontSize:10, cursor:"pointer" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        {orders.length===0 && <EmptyState icon="📋" text="No orders yet. Add your first order above!"/>}
      </div>
    </div>
  );
}

// ─── AI BRAIN TAB ─────────────────────────────────────────────────────────────
function AIBrainTab({ brand, role, products, orders }) {
  const col = brand?.primaryColor || "#6366f1";
  const geminiKey = ""; // user sets this
  const [activeModule, setActiveModule] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const catObj = BUSINESS_CATEGORIES.find(c => c.id === brand?.category);

  const AI_MODULES = [
    { id:"ceo",       icon:"♛", label:"CEO Strategy",    system:`You are CEO Strategy AI for ${brand?.businessName}, a ${catObj?.label} business. Help with strategy, vision, growth planning. Be concise, actionable. Reply in user's language (Urdu/English).` },
    { id:"sales",     icon:"📈", label:"Sales AI",        system:`You are Sales AI for ${brand?.businessName}. Help with pitches, closing deals, follow-ups, pricing strategy. Reply in user's language.` },
    { id:"marketing", icon:"📣", label:"Marketing AI",    system:`You are Marketing AI for ${brand?.businessName}. Help with campaigns, social media, ad copies, brand positioning. Reply in user's language.` },
    { id:"support",   icon:"💬", label:"Customer Support",system:`You are Customer Service AI for ${brand?.businessName}. Help draft professional customer replies, handle complaints, answer FAQs. Reply in user's language.` },
    { id:"content",   icon:"✍️", label:"Content AI",      system:`You are Content AI for ${brand?.businessName}. Help with content calendar, captions, video scripts, blog posts. Reply in user's language.` },
    { id:"ops",       icon:"⚙️", label:"Operations AI",   system:`You are Operations AI for ${brand?.businessName}. Help with workflow, processes, supplier management, efficiency. Reply in user's language.` },
    { id:"finance",   icon:"💰", label:"Finance AI",      system:`You are Finance AI for ${brand?.businessName}. Help with pricing, profit margins, expense tracking, financial planning. Reply in user's language.` },
    { id:"hr",        icon:"👥", label:"Team AI",         system:`You are HR AI for ${brand?.businessName}. Help with team management, hiring, performance, onboarding. Reply in user's language.` },
  ];

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); }, [msgs]);

  const sendMsg = async () => {
    if (!input.trim() || loading) return;
    if (!activeModule) return alert("Pehle koi AI module select karo!");
    const mod = AI_MODULES.find(m=>m.id===activeModule);
    const userMsg = { role:"user", content:input };
    const history = [...msgs, userMsg];
    setMsgs(history); setInput(""); setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system: mod.system + `\n\nBusiness context:\n- Name: ${brand?.businessName}\n- Category: ${catObj?.label}\n- Products/Services: ${products.map(p=>p.name).join(", ")}\n- Total Orders: ${orders.length}`,
          messages: history,
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Error getting response";
      setMsgs([...history, { role:"assistant", content:reply }]);
    } catch(e) {
      setMsgs([...history, { role:"assistant", content:"Error: "+e.message }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding:24 }} className="fade-up">
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, marginBottom:4 }}>🤖 AI Brain</h2>
      <p style={{ color:"rgba(241,245,249,0.4)", fontSize:13, marginBottom:20 }}>Apne business ke liye AI assistants — strategy se sales tak</p>

      {/* Module Selector */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))", gap:8, marginBottom:24 }}>
        {AI_MODULES.map(m => (
          <button key={m.id} onClick={()=>{ setActiveModule(m.id); setMsgs([]); }}
            style={{ padding:"12px 10px", borderRadius:12, border:`1.5px solid ${activeModule===m.id?col:"rgba(255,255,255,0.08)"}`,
              background: activeModule===m.id?`${col}22`:"rgba(255,255,255,0.03)",
              color: activeModule===m.id?col:"rgba(241,245,249,0.6)", textAlign:"center", transition:"all 0.2s" }}>
            <div style={{ fontSize:20, marginBottom:4 }}>{m.icon}</div>
            <div style={{ fontSize:11, fontWeight:600 }}>{m.label}</div>
          </button>
        ))}
      </div>

      {/* Chat Area */}
      {activeModule ? (
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, overflow:"hidden" }}>
          <div style={{ padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)", background:`${col}11`, display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:18 }}>{AI_MODULES.find(m=>m.id===activeModule)?.icon}</span>
            <span style={{ fontWeight:600, color:col, fontSize:14 }}>{AI_MODULES.find(m=>m.id===activeModule)?.label}</span>
            <span style={{ fontSize:11, color:"rgba(241,245,249,0.4)", marginLeft:"auto" }}>Powered by Claude AI</span>
          </div>
          <div style={{ height:320, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:12 }}>
            {msgs.length === 0 && (
              <div style={{ textAlign:"center", color:"rgba(241,245,249,0.3)", fontSize:13, marginTop:40 }}>
                👋 Koi bhi sawaal poochho {brand?.businessName} ke baare mein…
              </div>
            )}
            {msgs.map((m,i) => (
              <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
                <div style={{ maxWidth:"78%", padding:"10px 14px", borderRadius:12,
                  background: m.role==="user" ? `linear-gradient(135deg,${col},${col}88)` : "rgba(255,255,255,0.06)",
                  color: "#fff", fontSize:13, lineHeight:1.6,
                  borderBottomRightRadius: m.role==="user"?2:12,
                  borderBottomLeftRadius:  m.role==="assistant"?2:12 }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display:"flex", gap:4, padding:"10px 14px" }}>
                <div style={{ width:6,height:6,borderRadius:"50%",background:col,animation:"pulse 1s ease infinite",animationDelay:"0ms" }}/>
                <div style={{ width:6,height:6,borderRadius:"50%",background:col,animation:"pulse 1s ease infinite",animationDelay:"200ms" }}/>
                <div style={{ width:6,height:6,borderRadius:"50%",background:col,animation:"pulse 1s ease infinite",animationDelay:"400ms" }}/>
              </div>
            )}
            <div ref={endRef}/>
          </div>
          <div style={{ padding:12, borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", gap:8 }}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()}
              placeholder="Apna sawaal likhein…" style={{ flex:1 }}/>
            <button onClick={sendMsg} disabled={loading}
              style={{ padding:"10px 18px", borderRadius:8, border:"none", background:col, color:"#fff", fontSize:13, fontWeight:600, opacity:loading?0.6:1 }}>
              Send
            </button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign:"center", padding:40, color:"rgba(241,245,249,0.3)", fontSize:14 }}>
          ☝️ Upar se koi AI module select karo
        </div>
      )}
    </div>
  );
}

// ─── ANALYTICS TAB ────────────────────────────────────────────────────────────
function AnalyticsTab({ orders, products, brand }) {
  const col = brand?.primaryColor || "#6366f1";
  const totalRev = orders.reduce((s,o)=>s+(parseFloat(o.amount)||0),0);
  const statusCounts = orders.reduce((acc,o)=>{ acc[o.status||"pending"]=(acc[o.status||"pending"]||0)+1; return acc; },{});
  const productCounts = orders.reduce((acc,o)=>{ if(o.product) acc[o.product]=(acc[o.product]||0)+1; return acc; },{});
  const topProducts = Object.entries(productCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);

  return (
    <div style={{ padding:24 }} className="fade-up">
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, marginBottom:20 }}>📊 Analytics</h2>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14, marginBottom:24 }}>
        <StatCard icon="💰" label="Total Revenue" value={`Rs ${totalRev.toLocaleString()}`} color="#10b981"/>
        <StatCard icon="📋" label="Total Orders"  value={orders.length}   color={col}/>
        <StatCard icon="✅" label="Delivered"     value={statusCounts.delivered||0} color="#10b981"/>
        <StatCard icon="⏳" label="Pending"       value={statusCounts.pending||0}   color="#f59e0b"/>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:20 }}>
          <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>Orders by Status</h3>
          {Object.entries(statusCounts).map(([s,n]) => (
            <div key={s} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:13, color:"rgba(241,245,249,0.6)", textTransform:"capitalize" }}>{s}</span>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ height:6, borderRadius:3, background:`${col}44`, width:80 }}>
                  <div style={{ height:"100%", borderRadius:3, background:col, width:`${(n/orders.length)*100}%` }}/>
                </div>
                <span style={{ fontSize:13, fontWeight:600 }}>{n}</span>
              </div>
            </div>
          ))}
          {Object.keys(statusCounts).length === 0 && <EmptyState icon="📊" text="No data yet"/>}
        </div>

        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:20 }}>
          <h3 style={{ fontSize:14, fontWeight:600, marginBottom:14 }}>Top Items Sold</h3>
          {topProducts.map(([name,count]) => (
            <div key={name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:13, color:"rgba(241,245,249,0.6)" }}>{name}</span>
              <span style={{ fontSize:13, fontWeight:600, color:col }}>{count} orders</span>
            </div>
          ))}
          {topProducts.length === 0 && <EmptyState icon="📦" text="No orders yet"/>}
        </div>
      </div>
    </div>
  );
}

// ─── TEAM TAB ─────────────────────────────────────────────────────────────────
function TeamTab({ members, setMembers, brand, user, access, db }) {
  const col = brand?.primaryColor || "#6366f1";
  const [showAdd, setShowAdd] = useState(false);
  const [newMember, setNewMember] = useState({ email:"", name:"", role:"member" });
  const [saving, setSaving] = useState(false);

  const inviteMember = async () => {
    if (!newMember.email.trim()) return;
    setSaving(true);
    const m = { ...newMember, uid: Date.now().toString(), invitedBy: user?.email, createdAt: new Date().toISOString() };
    const updated = [...members, m];
    setMembers(updated);
    setSaving(false);
    setShowAdd(false);
    setNewMember({ email:"", name:"", role:"member" });
  };

  return (
    <div style={{ padding:24 }} className="fade-up">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20 }}>👥 Team</h2>
        {access?.admin && (
          <button onClick={()=>setShowAdd(!showAdd)}
            style={{ padding:"9px 18px", borderRadius:10, border:"none", background:`linear-gradient(135deg,${col},${col}88)`, color:"#fff", fontSize:13, fontWeight:600 }}>
            + Add Member
          </button>
        )}
      </div>

      {showAdd && (
        <div style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${col}33`, borderRadius:14, padding:20, marginBottom:20, display:"flex", flexDirection:"column", gap:12 }}>
          <Field label="Name"><input value={newMember.name} onChange={e=>setNewMember(m=>({...m,name:e.target.value}))} placeholder="Full name"/></Field>
          <Field label="Email"><input value={newMember.email} onChange={e=>setNewMember(m=>({...m,email:e.target.value}))} placeholder="email@example.com"/></Field>
          <Field label="Role">
            <select value={newMember.role} onChange={e=>setNewMember(m=>({...m,role:e.target.value}))}>
              {Object.entries(TEAM_ROLES_UNIVERSAL).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
          </Field>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={inviteMember} disabled={saving}
              style={{ flex:1, padding:10, borderRadius:8, border:"none", background:col, color:"#fff", fontSize:13, fontWeight:600 }}>
              {saving?"Saving…":"Add Member"}
            </button>
            <button onClick={()=>setShowAdd(false)}
              style={{ padding:10, borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"rgba(241,245,249,0.5)", fontSize:13 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {members.map((m,i) => {
          const roleInfo = TEAM_ROLES_UNIVERSAL[m.role] || TEAM_ROLES_UNIVERSAL.member;
          return (
            <div key={i} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"14px 18px", display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:38, height:38, borderRadius:10, background:`${roleInfo.color}22`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
                {roleInfo.label.split(" ")[0]}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14 }}>{m.name || m.email.split("@")[0]}</div>
                <div style={{ fontSize:12, color:"rgba(241,245,249,0.4)" }}>{m.email}</div>
              </div>
              <div style={{ fontSize:11, fontWeight:600, color:roleInfo.color, background:`${roleInfo.color}22`, padding:"4px 10px", borderRadius:6 }}>
                {roleInfo.label}
              </div>
            </div>
          );
        })}
        {members.length===0 && <EmptyState icon="👥" text="No team members yet"/>}
      </div>
    </div>
  );
}

// ─── SETTINGS TAB ─────────────────────────────────────────────────────────────
function SettingsTab({ brand, setBrand, db }) {
  const col = brand?.primaryColor || "#6366f1";
  const [form, setForm] = useState({ ...brand });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const save = async () => {
    setSaving(true);
    setBrand(form);
    if (db) { try { await fsSet(fsDoc(db,"brand","config"),form); } catch{} }
    setSaving(false); setSaved(true);
    setTimeout(()=>setSaved(false),2000);
  };

  return (
    <div style={{ padding:24, maxWidth:600 }} className="fade-up">
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, marginBottom:20 }}>⚙️ Brand Settings</h2>
      <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:24, display:"flex", flexDirection:"column", gap:16 }}>
        <Field label="Business Name"><input value={form.businessName||""} onChange={e=>setForm(f=>({...f,businessName:e.target.value}))}/></Field>
        <Field label="Tagline"><input value={form.tagline||""} onChange={e=>setForm(f=>({...f,tagline:e.target.value}))}/></Field>
        <Field label="Owner Name"><input value={form.ownerName||""} onChange={e=>setForm(f=>({...f,ownerName:e.target.value}))}/></Field>
        <Field label="WhatsApp"><input value={form.whatsapp||""} onChange={e=>setForm(f=>({...f,whatsapp:e.target.value}))}/></Field>
        <Field label="Website"><input value={form.website||""} onChange={e=>setForm(f=>({...f,website:e.target.value}))}/></Field>
        <Field label="Logo Initials"><input maxLength={3} value={form.logoText||""} onChange={e=>setForm(f=>({...f,logoText:e.target.value.toUpperCase()}))}/></Field>
        <Field label="Primary Color">
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <input type="color" value={form.primaryColor||"#6366f1"} onChange={e=>setForm(f=>({...f,primaryColor:e.target.value}))} style={{ width:50, height:42, padding:4 }}/>
            <input value={form.primaryColor||"#6366f1"} onChange={e=>setForm(f=>({...f,primaryColor:e.target.value}))} style={{ flex:1 }}/>
          </div>
        </Field>
        <button onClick={save} disabled={saving}
          style={{ marginTop:4, padding:"12px", borderRadius:10, border:"none", background:`linear-gradient(135deg,${col},${col}88)`, color:"#fff", fontSize:14, fontWeight:600 }}>
          {saved ? "✅ Saved!" : saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div>
      <label style={{ display:"block", fontSize:12, fontWeight:600, color:"rgba(241,245,249,0.5)", textTransform:"uppercase", letterSpacing:0.8, marginBottom:6 }}>{label}</label>
      {children}
    </div>
  );
}

function SectionTitle({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom:4 }}>
      <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700 }}>{icon} {title}</h2>
      {subtitle && <p style={{ color:"rgba(241,245,249,0.4)", fontSize:13, marginTop:2 }}>{subtitle}</p>}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:18 }}>
      <div style={{ fontSize:24, marginBottom:8 }}>{icon}</div>
      <div style={{ fontSize:22, fontWeight:700, fontFamily:"'Syne',sans-serif", color }}>{value}</div>
      <div style={{ fontSize:12, color:"rgba(241,245,249,0.4)", marginTop:2 }}>{label}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = { pending:"#f59e0b", confirmed:"#6366f1", processing:"#8b5cf6", dispatched:"#3b82f6", delivered:"#10b981", cancelled:"#ef4444" };
  const c = colors[status] || "#94a3b8";
  return <span style={{ fontSize:10, fontWeight:600, color:c, background:`${c}22`, padding:"2px 8px", borderRadius:99, textTransform:"capitalize" }}>{status}</span>;
}

function EmptyState({ icon, text }) {
  return (
    <div style={{ textAlign:"center", padding:"40px 20px", color:"rgba(241,245,249,0.3)" }}>
      <div style={{ fontSize:36, marginBottom:8 }}>{icon}</div>
      <div style={{ fontSize:14 }}>{text}</div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,     setScreen]     = useState("loading"); // loading | setup | login | app
  const [authUser,   setAuthUser]   = useState(null);
  const [brand,      setBrand]      = useState(null);
  const [role,       setRole]       = useState("member");
  const [orders,     setOrders]     = useState([]);
  const [products,   setProducts]   = useState([]);
  const [members,    setMembers]    = useState([]);
  const [tab,        setTab]        = useState("dashboard");
  const [fbConfig,   setFbConfig]   = useState(null);
  const [db,         setDb]         = useState(null);

  // Check localStorage for saved firebase config
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bos_firebase_config");
      if (saved) {
        const cfg = JSON.parse(saved);
        loadFirebase(cfg).then(async () => {
          setFbConfig(cfg);
          setDb(fb_db);
          onAuthStateChange(fb_auth, async (fbUser) => {
            if (fbUser) { await loadUserData(fbUser, cfg); }
            else { setScreen("login"); }
          });
        });
      } else {
        setScreen("setup");
      }
    } catch { setScreen("setup"); }
  }, []);

  const loadUserData = async (fbUser, cfg) => {
    try {
      const brandSnap = await fsGet(fsDoc(fb_db,"brand","config"));
      if (brandSnap.exists()) setBrand(brandSnap.data());

      const uSnap = await fsGet(fsDoc(fb_db,"users",fbUser.uid));
      if (uSnap.exists()) setRole(uSnap.data().role||"member");

      const oSnap = await fsGetDocs(fsQuery(fsColl(fb_db,"orders"),fsOrderBy("createdAt","desc")));
      setOrders(oSnap.docs.map(d=>({...d.data(),firestoreId:d.id})));

      const mSnap = await fsGetDocs(fsColl(fb_db,"users"));
      setMembers(mSnap.docs.map(d=>({...d.data(),uid:d.id})));

      try {
        const pSnap = await fsGet(fsDoc(fb_db,"meta","products"));
        if (pSnap.exists()&&pSnap.data().list) setProducts(pSnap.data().list);
      } catch{}
    } catch(e){ console.error(e); }
    setAuthUser(fbUser);
    setScreen("app");
  };

  const handleOnboardingComplete = async (result) => {
    if (!result) { setScreen("login"); return; }
    const { user, brand: b, firebaseConfig: cfg } = result;
    localStorage.setItem("bos_firebase_config", JSON.stringify(cfg));
    setBrand(b);
    setFbConfig(cfg);
    setDb(fb_db);
    setRole("owner");
    setAuthUser(user);
    setProducts(b.items||[]);
    setScreen("app");
  };

  const handleLogin = async (userOrSetup, cfg) => {
    if (userOrSetup === "setup") { setScreen("setup"); return; }
    if (cfg) localStorage.setItem("bos_firebase_config", JSON.stringify(cfg));
    setDb(fb_db);
    await loadUserData(userOrSetup, cfg||fbConfig);
  };

  const handleSignOut = async () => {
    if (fb_auth) await signOutFn(fb_auth);
    setAuthUser(null); setScreen("login");
  };

  if (screen === "loading") return <><GlobalStyles brand={brand}/><LoadingScreen/></>;
  if (screen === "setup")   return <><GlobalStyles brand={brand}/><OnboardingForm onComplete={handleOnboardingComplete}/></>;
  if (screen === "login")   return <><GlobalStyles brand={brand}/><LoginScreen onLogin={handleLogin} firebaseConfig={fbConfig}/></>;

  const col = brand?.primaryColor || "#6366f1";
  const access = {
    admin:        ["owner","aceo"].includes(role),
    productsEdit: ["owner","aceo","manager"].includes(role),
    team:         ["owner","aceo"].includes(role),
    analytics:    ["owner","aceo","manager","finance"].includes(role),
    settings:     ["owner"].includes(role),
  };

  const tabs = [
    { id:"dashboard", icon:"◈",  label:"Dashboard" },
    { id:"products",  icon:"📦", label:"Products"  },
    { id:"admin",     icon:"📋", label:"Orders"    },
    { id:"ai",        icon:"🤖", label:"AI Brain"  },
    ...(access.analytics ? [{ id:"analytics", icon:"📊", label:"Analytics" }] : []),
    ...(access.team      ? [{ id:"team",       icon:"👥", label:"Team"      }] : []),
    ...(access.settings  ? [{ id:"settings",   icon:"⚙️", label:"Settings"  }] : []),
  ];

  return (
    <>
      <GlobalStyles brand={brand}/>
      <div style={{ minHeight:"100vh", background:"#0a0a0f" }}>
        <Header brand={brand} user={authUser} role={role} onSignOut={handleSignOut}/>
        <TabBar tabs={tabs} active={tab} onChange={setTab} brand={brand}/>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          {tab==="dashboard" && <DashboardTab orders={orders} brand={brand} role={role} user={authUser} tasks={[]} setTasks={()=>{}} db={db}/>}
          {tab==="products"  && <ProductsTab  products={products} setProducts={setProducts} brand={brand} access={access} db={db}/>}
          {tab==="admin"     && <AdminTab     orders={orders} setOrders={setOrders} products={products} brand={brand} user={authUser} access={access} db={db}/>}
          {tab==="ai"        && <AIBrainTab   brand={brand} role={role} products={products} orders={orders}/>}
          {tab==="analytics" && <AnalyticsTab orders={orders} products={products} brand={brand}/>}
          {tab==="team"      && <TeamTab      members={members} setMembers={setMembers} brand={brand} user={authUser} access={access} db={db}/>}
          {tab==="settings"  && <SettingsTab  brand={brand} setBrand={setBrand} db={db}/>}
        </div>
      </div>
    </>
  );
}
