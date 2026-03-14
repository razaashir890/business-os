import { useState, useEffect, useRef } from "react";

// ============================================================
// AR ELECTRONICS — Universal Brand OS
// React + Firebase-ready | 11 Modules | 11 Roles | Gold Theme
// ============================================================

// ── BRAND CONFIG ─────────────────────────────────────────────
const BRAND = {
  name: "AR ELECTRONICS",
  tagline: "Technology. Trust. Tomorrow.",
  category: "Retail / E-commerce",
  color: { primary: "#B47B2B", light: "#D4A044", dark: "#8A5E1E", bg: "#0A0A0A", surface: "#111111", card: "#181818", border: "#2A2A2A" },
  currency: "PKR",
  whatsapp: "+92300000000",
};

const ROLES = ["Owner/ACEO","Store Manager","Sales Lead","Cashier","Inventory","Marketing","Finance","Customer Service","Logistics","Designer","HR"];

const MODULES = ["Dashboard","Orders","Inventory","E-commerce","Dispatch","Loyalty","Analytics","Marketing AI","Sales AI","Strategy AI","Team & HR","WhatsApp"];

const ROLE_PERMISSIONS = {
  "Owner/ACEO": MODULES,
  "Store Manager": ["Dashboard","Orders","Inventory","E-commerce","Dispatch","Loyalty","Analytics","Team & HR"],
  "Sales Lead": ["Dashboard","Orders","E-commerce","Loyalty","Sales AI","WhatsApp"],
  "Cashier": ["Dashboard","Orders","Loyalty"],
  "Inventory": ["Dashboard","Inventory","Orders"],
  "Marketing": ["Dashboard","Marketing AI","E-commerce","WhatsApp","Analytics"],
  "Finance": ["Dashboard","Analytics","Orders"],
  "Customer Service": ["Dashboard","Orders","Loyalty","WhatsApp"],
  "Logistics": ["Dashboard","Dispatch","Orders","Inventory"],
  "Designer": ["Dashboard","E-commerce","Marketing AI"],
  "HR": ["Dashboard","Team & HR","Analytics"],
};

// ── SAMPLE DATA ───────────────────────────────────────────────
const SAMPLE_ORDERS = [
  { id:"ORD-001", customer:"Ahmed Raza", product:"Samsung 65\" QLED TV", qty:1, price:285000, status:"Confirmed", channel:"Walk-in", date:"2026-03-14", phone:"+92311111111" },
  { id:"ORD-002", customer:"Fatima Khan", product:"iPhone 15 Pro Max 256GB", qty:2, price:539000, status:"Picked", channel:"WhatsApp", date:"2026-03-14", phone:"+92322222222" },
  { id:"ORD-003", customer:"Usman Ali", product:"LG Side-by-Side Fridge", qty:1, price:195000, status:"Delivered", channel:"Online", date:"2026-03-13", phone:"+92333333333" },
  { id:"ORD-004", customer:"Sana Malik", product:"Dell XPS 15 Laptop", qty:1, price:425000, status:"Pending", channel:"Instagram", date:"2026-03-13", phone:"+92344444444" },
  { id:"ORD-005", customer:"Bilal Hussain", product:"Sony WH-1000XM5 Headphones", qty:3, price:89700, status:"Dispatched", channel:"Website", date:"2026-03-12", phone:"+92355555555" },
];

const SAMPLE_PRODUCTS = [
  { id:"PRD-001", name:"Samsung 65\" QLED TV", sku:"SAM-TV-65Q", category:"TV & Display", stock:8, minStock:3, price:285000, cost:245000, image:"📺" },
  { id:"PRD-002", name:"iPhone 15 Pro Max 256GB", sku:"APL-IPH-15PM", category:"Smartphones", stock:2, minStock:5, price:269500, cost:240000, image:"📱" },
  { id:"PRD-003", name:"LG Side-by-Side Fridge 700L", sku:"LG-FRG-700", category:"Home Appliances", stock:5, minStock:2, price:195000, cost:168000, image:"🧊" },
  { id:"PRD-004", name:"Dell XPS 15 Laptop i9", sku:"DEL-XPS-15I9", category:"Laptops", stock:4, minStock:3, price:425000, cost:385000, image:"💻" },
  { id:"PRD-005", name:"Sony WH-1000XM5 Headphones", sku:"SNY-WH-XM5", category:"Audio", stock:12, minStock:5, price:29900, cost:24000, image:"🎧" },
  { id:"PRD-006", name:"Canon EOS R50 Camera", sku:"CAN-EOS-R50", category:"Cameras", stock:3, minStock:2, price:185000, cost:162000, image:"📷" },
  { id:"PRD-007", name:"PlayStation 5 Disc Edition", sku:"SNY-PS5-DSC", category:"Gaming", stock:0, minStock:3, price:119000, cost:105000, image:"🎮" },
  { id:"PRD-008", name:"Dyson V15 Vacuum Cleaner", sku:"DYS-V15-DET", category:"Home Appliances", stock:6, minStock:2, price:89000, cost:76000, image:"🌀" },
];

const SAMPLE_TEAM = [
  { id:"T001", name:"Arif Rahman", role:"Owner/ACEO", phone:"+92300000001", email:"arif@arelectronics.pk", salary:0, joinDate:"2020-01-01", status:"Active", points:0 },
  { id:"T002", name:"Kamran Siddiqui", role:"Store Manager", phone:"+92311000002", email:"kamran@arelectronics.pk", salary:85000, joinDate:"2021-03-15", status:"Active", points:420 },
  { id:"T003", name:"Zara Ahmed", role:"Marketing", phone:"+92322000003", email:"zara@arelectronics.pk", salary:65000, joinDate:"2022-06-01", status:"Active", points:310 },
  { id:"T004", name:"Hassan Tariq", role:"Sales Lead", phone:"+92333000004", email:"hassan@arelectronics.pk", salary:70000, joinDate:"2021-09-10", status:"Active", points:580 },
  { id:"T005", name:"Nadia Farooq", role:"Customer Service", phone:"+92344000005", email:"nadia@arelectronics.pk", salary:55000, joinDate:"2023-01-20", status:"Active", points:240 },
  { id:"T006", name:"Omar Sheikh", role:"Logistics", phone:"+92355000006", email:"omar@arelectronics.pk", salary:60000, joinDate:"2022-11-05", status:"Active", points:190 },
];

const LOYALTY_TIERS = [
  { name:"Bronze", min:0, max:499, color:"#CD7F32", perks:"5% discount, priority support" },
  { name:"Silver", min:500, max:1499, color:"#C0C0C0", perks:"8% discount, free delivery, early access" },
  { name:"Gold", min:1500, max:2999, color:"#B47B2B", perks:"12% discount, VIP support, exclusive deals" },
  { name:"Platinum", min:3000, max:99999, color:"#E5E4E2", perks:"15% discount, dedicated manager, gifts" },
];

const CUSTOMERS = [
  { id:"C001", name:"Ahmed Raza", phone:"+92311111111", points:1680, tier:"Gold", totalOrders:12, totalSpent:985000 },
  { id:"C002", name:"Fatima Khan", phone:"+92322222222", points:3200, tier:"Platinum", totalOrders:24, totalSpent:2100000 },
  { id:"C003", name:"Usman Ali", phone:"+92333333333", points:820, tier:"Silver", totalOrders:6, totalSpent:620000 },
  { id:"C004", name:"Sana Malik", phone:"+92344444444", points:280, tier:"Bronze", totalOrders:3, totalSpent:185000 },
];

// ── ICONS ─────────────────────────────────────────────────────
const Icon = ({ name, size = 16 }) => {
  const icons = {
    dashboard: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
    orders: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z",
    inventory: "M20 6h-2.18c.07-.44.18-.88.18-1.36C18 2.53 15.47 0 12.27 0c-2.09 0-3.93 1.13-4.93 2.82L6 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z",
    ecommerce: "M7 4V2H5v2H3l-1 9h16l-1-9h-2V2h-2v2H7zm-2 2h10v1H5V6zm-1.24 7H3.98L4.6 9H5v4zm11.48 0H6.76V9h9.48v4zm1.76 0V9h.4l.62 4h-1.02z",
    dispatch: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",
    loyalty: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    analytics: "M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99l1.5 1.5z",
    marketing: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z",
    sales: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",
    team: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    whatsapp: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.122 1.523 5.864L0 24l6.293-1.489A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z",
    strategy: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    menu: "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z",
    close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
    add: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
    edit: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
    trash: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
    search: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
    bell: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z",
    logout: "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
    star: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
    package: "M20.5 3.4L12 1 3.5 3.4v8.1c0 5.2 3.7 10.1 8.5 11.5 4.8-1.4 8.5-6.3 8.5-11.5V3.4z",
    chart: "M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z",
    ai: "M12 2a10 10 0 100 20A10 10 0 0012 2zm0 3a7 7 0 110 14A7 7 0 0112 5zm0 2a5 5 0 100 10A5 5 0 0012 7zm0 2a3 3 0 110 6A3 3 0 0112 9z",
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
    alert: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
    refresh: "M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z",
    send: "M2.01 21L23 12 2.01 3 2 10l15 2-15 2z",
    phone: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
    download: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z",
    filter: "M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z",
  };
  const d = icons[name] || icons.dashboard;
  const isPolyline = name === "strategy";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      {isPolyline
        ? <polyline points="12 2 2 7 12 12 22 7 12 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        : <path d={d} fill="currentColor" />}
    </svg>
  );
};

// ── STYLES ────────────────────────────────────────────────────
const G = BRAND.color;
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --gold: ${G.primary};
    --gold-light: ${G.light};
    --gold-dark: ${G.dark};
    --bg: ${G.bg};
    --surface: ${G.surface};
    --card: ${G.card};
    --border: ${G.border};
    --text: #F0EDE8;
    --text-muted: #888880;
    --text-dim: #555550;
    --danger: #E05252;
    --success: #52C97A;
    --warning: #E0A852;
    --info: #52A8E0;
  }
  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--surface); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--gold-dark); }
`;

// ── UTILITY COMPONENTS ────────────────────────────────────────
const Badge = ({ children, color = "gold" }) => {
  const colors = { gold: { bg: "#B47B2B22", text: "#D4A044", border: "#B47B2B44" }, green: { bg: "#52C97A22", text: "#52C97A", border: "#52C97A44" }, red: { bg: "#E0525222", text: "#E05252", border: "#E0525244" }, blue: { bg: "#52A8E022", text: "#52A8E0", border: "#52A8E044" }, gray: { bg: "#55555022", text: "#888880", border: "#55555044" }, yellow: { bg: "#E0A85222", text: "#E0A852", border: "#E0A85244" } };
  const c = colors[color] || colors.gray;
  return <span style={{ background: c.bg, color: c.text, border: `0.5px solid ${c.border}`, padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 500, whiteSpace: "nowrap" }}>{children}</span>;
};

const StatusBadge = ({ status }) => {
  const map = { Pending: "yellow", Confirmed: "blue", Picked: "gold", Dispatched: "gold", Delivered: "green", Cancelled: "red" };
  return <Badge color={map[status] || "gray"}>{status}</Badge>;
};

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{ background: G.card, border: `0.5px solid ${G.border}`, borderRadius: 12, padding: "1.25rem", ...style }}>
    {children}
  </div>
);

const MetricCard = ({ label, value, sub, color = G.primary, icon }) => (
  <Card style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <span style={{ fontSize: 12, color: G.border === "#2A2A2A" ? "#888880" : "#888880", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
      {icon && <span style={{ color, opacity: 0.7 }}><Icon name={icon} size={18} /></span>}
    </div>
    <div style={{ fontSize: 26, fontWeight: 600, color, fontFamily: "'Playfair Display', serif" }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: "#888880" }}>{sub}</div>}
  </Card>
);

const Button = ({ children, onClick, variant = "primary", size = "md", disabled = false, style = {} }) => {
  const base = { display: "inline-flex", alignItems: "center", gap: 6, border: "none", borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, transition: "all 0.2s", opacity: disabled ? 0.5 : 1, ...style };
  const variants = {
    primary: { background: G.primary, color: "#fff", padding: size === "sm" ? "6px 14px" : "10px 20px", fontSize: size === "sm" ? 12 : 14 },
    secondary: { background: "transparent", color: G.primary, border: `0.5px solid ${G.primary}`, padding: size === "sm" ? "6px 14px" : "10px 20px", fontSize: size === "sm" ? 12 : 14 },
    ghost: { background: "transparent", color: "#888880", border: `0.5px solid ${G.border}`, padding: size === "sm" ? "6px 14px" : "10px 20px", fontSize: size === "sm" ? 12 : 14 },
    danger: { background: "#E0525222", color: "#E05252", border: "0.5px solid #E0525244", padding: size === "sm" ? "6px 14px" : "10px 20px", fontSize: size === "sm" ? 12 : 14 },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>{children}</button>;
};

const Input = ({ label, value, onChange, placeholder, type = "text", style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
    {label && <label style={{ fontSize: 12, color: "#888880", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>}
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ background: G.surface, border: `0.5px solid ${G.border}`, borderRadius: 8, padding: "10px 14px", color: "#F0EDE8", fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none", width: "100%" }}
      onFocus={e => { e.target.style.borderColor = G.primary; }}
      onBlur={e => { e.target.style.borderColor = G.border; }}
    />
  </div>
);

const Select = ({ label, value, onChange, options, style = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
    {label && <label style={{ fontSize: 12, color: "#888880", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>}
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ background: G.surface, border: `0.5px solid ${G.border}`, borderRadius: 8, padding: "10px 14px", color: "#F0EDE8", fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none", width: "100%" }}
    >
      {options.map(o => <option key={o} value={o} style={{ background: G.card }}>{o}</option>)}
    </select>
  </div>
);

const Modal = ({ open, onClose, title, children, width = 520 }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: G.card, border: `0.5px solid ${G.border}`, borderRadius: 16, width: "100%", maxWidth: width, maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", borderBottom: `0.5px solid ${G.border}` }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600 }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#888880", cursor: "pointer", padding: 4 }}><Icon name="close" size={20} /></button>
        </div>
        <div style={{ padding: "1.5rem" }}>{children}</div>
      </div>
    </div>
  );
};

// ── AI CHAT COMPONENT ─────────────────────────────────────────
const AIChat = ({ module, systemPrompt, placeholder }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "Sorry, koi response nahi mila.";
      setMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: 480 }}>
      <div style={{ flex: 1, overflow: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#888880", marginTop: 80 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>◈</div>
            <div style={{ fontSize: 14 }}>{placeholder}</div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: 12, fontSize: 14, lineHeight: 1.6, background: m.role === "user" ? G.primary : G.surface, color: m.role === "user" ? "#fff" : "#F0EDE8", border: m.role === "assistant" ? `0.5px solid ${G.border}` : "none" }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 4, padding: "10px 14px", width: 64, background: G.surface, borderRadius: 12, border: `0.5px solid ${G.border}` }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: G.primary, animation: `pulse 1.2s ${i * 0.2}s infinite` }} />)}
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div style={{ borderTop: `0.5px solid ${G.border}`, padding: "1rem", display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder={`${module} ke baare mein poochein...`}
          style={{ flex: 1, background: G.surface, border: `0.5px solid ${G.border}`, borderRadius: 8, padding: "10px 14px", color: "#F0EDE8", fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: "none" }}
        />
        <Button onClick={send} disabled={loading}><Icon name="send" size={14} /> Send</Button>
      </div>
    </div>
  );
};

// ── MODULE: DASHBOARD ─────────────────────────────────────────
const Dashboard = ({ role }) => {
  const totalRevenue = SAMPLE_ORDERS.filter(o => o.status === "Delivered").reduce((a, b) => a + b.price, 0);
  const pendingOrders = SAMPLE_ORDERS.filter(o => o.status === "Pending" || o.status === "Confirmed").length;
  const lowStock = SAMPLE_PRODUCTS.filter(p => p.stock <= p.minStock).length;
  const totalProducts = SAMPLE_PRODUCTS.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, marginBottom: 4 }}>
          Welcome back <span style={{ color: G.primary }}>◈</span>
        </h1>
        <p style={{ color: "#888880", fontSize: 14 }}>{BRAND.name} · {role} · {new Date().toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        <MetricCard label="Today's Revenue" value={`₨${(totalRevenue / 1000).toFixed(0)}K`} sub="+12% vs yesterday" color={G.primary} icon="chart" />
        <MetricCard label="Pending Orders" value={pendingOrders} sub="Need attention" color="#E0A852" icon="orders" />
        <MetricCard label="Low Stock Items" value={lowStock} sub="Reorder needed" color="#E05252" icon="alert" />
        <MetricCard label="Total Products" value={totalProducts} sub="Active SKUs" color="#52C97A" icon="package" />
        <MetricCard label="Active Customers" value={CUSTOMERS.length} sub="Loyalty members" color="#52A8E0" icon="team" />
        <MetricCard label="Team Size" value={SAMPLE_TEAM.length} sub="All active" color={G.light} icon="team" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ marginBottom: 16, fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600 }}>Recent Orders</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SAMPLE_ORDERS.slice(0, 4).map(o => (
              <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `0.5px solid ${G.border}` }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{o.customer}</div>
                  <div style={{ fontSize: 11, color: "#888880" }}>{o.product.slice(0, 28)}...</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <StatusBadge status={o.status} />
                  <div style={{ fontSize: 11, color: "#888880", marginTop: 2 }}>₨{o.price.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ marginBottom: 16, fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600 }}>Stock Alerts</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SAMPLE_PRODUCTS.filter(p => p.stock <= p.minStock).map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `0.5px solid ${G.border}` }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 20 }}>{p.image}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name.slice(0, 24)}...</div>
                    <div style={{ fontSize: 11, color: "#888880" }}>{p.category}</div>
                  </div>
                </div>
                <Badge color={p.stock === 0 ? "red" : "yellow"}>{p.stock === 0 ? "Out of Stock" : `${p.stock} left`}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ marginBottom: 12, fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600 }}>Sales Pipeline</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Pending","Confirmed","Picked","Dispatched","Delivered"].map(s => {
            const count = SAMPLE_ORDERS.filter(o => o.status === s).length;
            const colors = { Pending: G.border, Confirmed: "#52A8E0", Picked: "#E0A852", Dispatched: G.primary, Delivered: "#52C97A" };
            return (
              <div key={s} style={{ flex: 1, minWidth: 80, textAlign: "center", padding: "12px 8px", background: G.surface, border: `0.5px solid ${colors[s]}`, borderRadius: 10 }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: colors[s], fontFamily: "'Playfair Display', serif" }}>{count}</div>
                <div style={{ fontSize: 11, color: "#888880", marginTop: 4 }}>{s}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

// ── MODULE: ORDERS ────────────────────────────────────────────
const Orders = () => {
  const [orders, setOrders] = useState(SAMPLE_ORDERS);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [newOrder, setNewOrder] = useState({ customer: "", product: "", qty: 1, price: 0, channel: "Walk-in", phone: "" });

  const statuses = ["All", "Pending", "Confirmed", "Picked", "Dispatched", "Delivered", "Cancelled"];
  const filtered = orders.filter(o => (filter === "All" || o.status === filter) && (o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search)));

  const addOrder = () => {
    const o = { ...newOrder, id: `ORD-${String(orders.length + 1).padStart(3, "0")}`, status: "Pending", date: new Date().toISOString().split("T")[0], price: Number(newOrder.price) };
    setOrders(prev => [o, ...prev]);
    setModal(null);
    setNewOrder({ customer: "", product: "", qty: 1, price: 0, channel: "Walk-in", phone: "" });
  };

  const updateStatus = (id, status) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600 }}>Order Management</h2>
        <Button onClick={() => setModal("add")}><Icon name="add" size={14} /> New Order</Button>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#888880" }}><Icon name="search" size={14} /></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." style={{ width: "100%", background: G.surface, border: `0.5px solid ${G.border}`, borderRadius: 8, padding: "9px 14px 9px 36px", color: "#F0EDE8", fontFamily: "'DM Sans', sans-serif", fontSize: 13, outline: "none" }} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: "6px 12px", borderRadius: 20, border: `0.5px solid ${filter === s ? G.primary : G.border}`, background: filter === s ? `${G.primary}22` : "transparent", color: filter === s ? G.primary : "#888880", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{s}</button>
          ))}
        </div>
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `0.5px solid ${G.border}` }}>
                {["Order ID", "Customer", "Product", "Qty", "Amount", "Channel", "Status", "Date", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: "#888880", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <tr key={o.id} style={{ borderBottom: `0.5px solid ${G.border}`, background: i % 2 === 0 ? "transparent" : `${G.surface}66` }}>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: G.primary, fontWeight: 500 }}>{o.id}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13 }}>{o.customer}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#888880", maxWidth: 160 }}><div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.product}</div></td>
                  <td style={{ padding: "12px 16px", fontSize: 13, textAlign: "center" }}>{o.qty}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: G.light, fontWeight: 500 }}>₨{o.price.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px" }}><Badge color="gray">{o.channel}</Badge></td>
                  <td style={{ padding: "12px 16px" }}><StatusBadge status={o.status} /></td>
                  <td style={{ padding: "12px 16px", fontSize: 11, color: "#888880" }}>{o.date}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} style={{ background: G.surface, border: `0.5px solid ${G.border}`, borderRadius: 6, padding: "4px 8px", color: "#F0EDE8", fontSize: 11, cursor: "pointer" }}>
                      {["Pending","Confirmed","Picked","Dispatched","Delivered","Cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modal === "add"} onClose={() => setModal(null)} title="New Order">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Customer Name" value={newOrder.customer} onChange={v => setNewOrder(p => ({ ...p, customer: v }))} placeholder="Customer ka naam" />
          <Input label="Product" value={newOrder.product} onChange={v => setNewOrder(p => ({ ...p, product: v }))} placeholder="Product naam" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Quantity" value={newOrder.qty} onChange={v => setNewOrder(p => ({ ...p, qty: v }))} type="number" />
            <Input label="Price (PKR)" value={newOrder.price} onChange={v => setNewOrder(p => ({ ...p, price: v }))} type="number" />
          </div>
          <Input label="Phone" value={newOrder.phone} onChange={v => setNewOrder(p => ({ ...p, phone: v }))} placeholder="+923XXXXXXXXX" />
          <Select label="Channel" value={newOrder.channel} onChange={v => setNewOrder(p => ({ ...p, channel: v }))} options={["Walk-in","WhatsApp","Instagram","Facebook","Website","Phone"]} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
            <Button onClick={addOrder}>Add Order</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ── MODULE: INVENTORY ─────────────────────────────────────────
const Inventory = () => {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: "", sku: "", category: "Smartphones", stock: 0, minStock: 3, price: 0, cost: 0, image: "📦" });

  const categories = ["All", ...new Set(products.map(p => p.category))];
  const filtered = products.filter(p => (filter === "All" || p.category === filter) && p.name.toLowerCase().includes(search.toLowerCase()));

  const addProduct = () => {
    setProducts(prev => [...prev, { ...newProduct, id: `PRD-${String(prev.length + 1).padStart(3, "0")}`, price: Number(newProduct.price), cost: Number(newProduct.cost), stock: Number(newProduct.stock) }]);
    setModal(null);
  };

  const totalValue = products.reduce((a, b) => a + b.price * b.stock, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600 }}>Inventory & Stock</h2>
        <Button onClick={() => setModal("add")}><Icon name="add" size={14} /> Add Product</Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <MetricCard label="Total SKUs" value={products.length} color={G.primary} icon="package" />
        <MetricCard label="Stock Value" value={`₨${(totalValue / 1000000).toFixed(1)}M`} color={G.light} icon="chart" />
        <MetricCard label="Low Stock" value={products.filter(p => p.stock <= p.minStock && p.stock > 0).length} color="#E0A852" icon="alert" />
        <MetricCard label="Out of Stock" value={products.filter(p => p.stock === 0).length} color="#E05252" icon="alert" />
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#888880" }}><Icon name="search" size={14} /></span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ width: "100%", background: G.surface, border: `0.5px solid ${G.border}`, borderRadius: 8, padding: "9px 14px 9px 36px", color: "#F0EDE8", fontFamily: "'DM Sans', sans-serif", fontSize: 13, outline: "none" }} />
        </div>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{ padding: "6px 12px", borderRadius: 20, border: `0.5px solid ${filter === c ? G.primary : G.border}`, background: filter === c ? `${G.primary}22` : "transparent", color: filter === c ? G.primary : "#888880", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{c}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {filtered.map(p => {
          const margin = ((p.price - p.cost) / p.price * 100).toFixed(0);
          const stockStatus = p.stock === 0 ? "red" : p.stock <= p.minStock ? "yellow" : "green";
          return (
            <Card key={p.id} style={{ cursor: "pointer" }} onClick={() => { setEditItem(p); setModal("edit"); }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ fontSize: 32 }}>{p.image}</span>
                <Badge color={stockStatus}>{p.stock === 0 ? "Out of Stock" : p.stock <= p.minStock ? "Low Stock" : "In Stock"}</Badge>
              </div>
              <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4, lineHeight: 1.3 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: "#888880", marginBottom: 10 }}>{p.sku} · {p.category}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, borderTop: `0.5px solid ${G.border}`, paddingTop: 10 }}>
                <div>
                  <div style={{ fontSize: 10, color: "#888880" }}>PRICE</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: G.primary }}>₨{(p.price / 1000).toFixed(0)}K</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#888880" }}>STOCK</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: stockStatus === "red" ? "#E05252" : stockStatus === "yellow" ? "#E0A852" : "#52C97A" }}>{p.stock} units</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#888880" }}>MARGIN</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#52C97A" }}>{margin}%</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={modal === "add"} onClose={() => setModal(null)} title="Add New Product">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Product Name" value={newProduct.name} onChange={v => setNewProduct(p => ({ ...p, name: v }))} />
          <Input label="SKU" value={newProduct.sku} onChange={v => setNewProduct(p => ({ ...p, sku: v }))} />
          <Select label="Category" value={newProduct.category} onChange={v => setNewProduct(p => ({ ...p, category: v }))} options={["Smartphones","Laptops","TV & Display","Home Appliances","Audio","Cameras","Gaming","Accessories"]} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Sale Price" value={newProduct.price} onChange={v => setNewProduct(p => ({ ...p, price: v }))} type="number" />
            <Input label="Cost Price" value={newProduct.cost} onChange={v => setNewProduct(p => ({ ...p, cost: v }))} type="number" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Current Stock" value={newProduct.stock} onChange={v => setNewProduct(p => ({ ...p, stock: v }))} type="number" />
            <Input label="Min Stock" value={newProduct.minStock} onChange={v => setNewProduct(p => ({ ...p, minStock: v }))} type="number" />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
            <Button onClick={addProduct}>Add Product</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ── MODULE: E-COMMERCE ────────────────────────────────────────
const Ecommerce = () => {
  const [activeTab, setActiveTab] = useState("storefront");
  const tabs = ["storefront", "listings", "promotions", "seo"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600 }}>E-Commerce Hub</h2>
      <div style={{ display: "flex", gap: 4, borderBottom: `0.5px solid ${G.border}`, paddingBottom: 0 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ padding: "8px 16px", background: "none", border: "none", borderBottom: `2px solid ${activeTab === t ? G.primary : "transparent"}`, color: activeTab === t ? G.primary : "#888880", fontSize: 13, fontWeight: 500, cursor: "pointer", textTransform: "capitalize", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>{t}</button>
        ))}
      </div>

      {activeTab === "storefront" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Card>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Store Performance</div>
            {[{ label: "Today's Visits", value: "847", change: "+12%" }, { label: "Conversion Rate", value: "3.2%", change: "+0.4%" }, { label: "Avg. Order Value", value: "₨185K", change: "+8%" }, { label: "Cart Abandonment", value: "61%", change: "-5%" }].map(s => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `0.5px solid ${G.border}` }}>
                <span style={{ fontSize: 13, color: "#888880" }}>{s.label}</span>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{s.value}</span>
                  <Badge color={s.change.startsWith("+") ? "green" : "red"}>{s.change}</Badge>
                </div>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Sales Channels</div>
            {[{ ch: "Website", orders: 45, pct: 38 }, { ch: "Instagram", orders: 32, pct: 27 }, { ch: "WhatsApp", orders: 28, pct: 23 }, { ch: "Walk-in", orders: 14, pct: 12 }].map(c => (
              <div key={c.ch} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span>{c.ch}</span><span style={{ color: G.primary }}>{c.orders} orders</span>
                </div>
                <div style={{ background: G.surface, borderRadius: 4, height: 6, overflow: "hidden" }}>
                  <div style={{ width: `${c.pct}%`, height: "100%", background: G.primary, borderRadius: 4, transition: "width 1s" }} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {activeTab === "listings" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
          {SAMPLE_PRODUCTS.map(p => (
            <Card key={p.id}>
              <div style={{ fontSize: 40, textAlign: "center", marginBottom: 12 }}>{p.image}</div>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: G.primary, fontWeight: 600, marginBottom: 8 }}>₨{p.price.toLocaleString()}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Badge color={p.stock > 0 ? "green" : "red"}>{p.stock > 0 ? "Listed" : "Unlisted"}</Badge>
                <Button variant="ghost" size="sm"><Icon name="edit" size={12} /> Edit</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "promotions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[{ name: "Eid Special Sale", discount: "15% OFF", products: "All Electronics", status: "Active", ends: "2026-03-20" }, { name: "Bundle Deal – Laptop + Bag", discount: "₨5,000 OFF", products: "Laptops", status: "Scheduled", ends: "2026-03-25" }, { name: "iPhone Cashback Offer", discount: "₨10,000 Cashback", products: "iPhones", status: "Ended", ends: "2026-03-10" }].map(p => (
            <Card key={p.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#888880" }}>{p.products} · Ends {p.ends}</div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: G.primary }}>{p.discount}</span>
                <Badge color={p.status === "Active" ? "green" : p.status === "Scheduled" ? "blue" : "gray"}>{p.status}</Badge>
              </div>
            </Card>
          ))}
          <Button><Icon name="add" size={14} /> Create Promotion</Button>
        </div>
      )}

      {activeTab === "seo" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, marginBottom: 14 }}>SEO Health Score</div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 48, fontWeight: 700, color: G.primary, fontFamily: "'Playfair Display', serif" }}>74</div>
              <div>
                <Badge color="yellow">Needs Improvement</Badge>
                <div style={{ fontSize: 12, color: "#888880", marginTop: 6 }}>Out of 100 — focus on meta descriptions</div>
              </div>
            </div>
            {[{ item: "Meta Titles", score: 90, status: "green" }, { item: "Meta Descriptions", score: 45, status: "red" }, { item: "Image Alt Tags", score: 72, status: "yellow" }, { item: "Page Speed", score: 85, status: "green" }, { item: "Mobile Friendly", score: 95, status: "green" }].map(s => (
              <div key={s.item} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span>{s.item}</span><span style={{ color: s.status === "green" ? "#52C97A" : s.status === "red" ? "#E05252" : "#E0A852" }}>{s.score}%</span>
                </div>
                <div style={{ background: G.surface, borderRadius: 4, height: 6 }}>
                  <div style={{ width: `${s.score}%`, height: "100%", background: s.status === "green" ? "#52C97A" : s.status === "red" ? "#E05252" : "#E0A852", borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
};

// ── MODULE: DISPATCH ──────────────────────────────────────────
const Dispatch = () => {
  const dispatched = SAMPLE_ORDERS.filter(o => o.status === "Dispatched" || o.status === "Confirmed" || o.status === "Picked");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600 }}>Dispatch & Delivery</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <MetricCard label="Ready to Dispatch" value={dispatched.filter(o => o.status === "Confirmed").length} color="#52A8E0" icon="package" />
        <MetricCard label="In Transit" value={dispatched.filter(o => o.status === "Dispatched").length} color="#E0A852" icon="dispatch" />
        <MetricCard label="Delivered Today" value={SAMPLE_ORDERS.filter(o => o.status === "Delivered").length} color="#52C97A" icon="check" />
        <MetricCard label="Avg Delivery Time" value="1.8 days" color={G.primary} icon="refresh" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {SAMPLE_ORDERS.map(o => (
          <Card key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ minWidth: 180 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{o.customer}</div>
              <div style={{ fontSize: 11, color: "#888880" }}>{o.id} · {o.phone}</div>
            </div>
            <div style={{ flex: 1, minWidth: 180, fontSize: 12, color: "#888880" }}>{o.product.slice(0, 40)}</div>
            <StatusBadge status={o.status} />
            <a href={`https://wa.me/${o.phone.replace("+", "")}?text=Assalam o Alaikum! Aapka order ${o.id} (${o.product.slice(0, 30)}) dispatch ho chuka hai. Shukriya AR Electronics se shopping karne ka!`} target="_blank" rel="noreferrer">
              <Button variant="secondary" size="sm"><Icon name="whatsapp" size={12} /> Notify</Button>
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ── MODULE: LOYALTY ───────────────────────────────────────────
const Loyalty = () => {
  const [customers, setCustomers] = useState(CUSTOMERS);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [addPoints, setAddPoints] = useState(0);

  const getTier = pts => LOYALTY_TIERS.find(t => pts >= t.min && pts <= t.max) || LOYALTY_TIERS[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600 }}>Loyalty Program</h2>
        <Button onClick={() => setModal("tiers")} variant="secondary">View Tiers</Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
        {LOYALTY_TIERS.map(t => (
          <Card key={t.name} style={{ textAlign: "center", border: `0.5px solid ${t.color}22` }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: t.color, fontFamily: "'Playfair Display', serif", marginBottom: 4 }}>{t.name}</div>
            <div style={{ fontSize: 11, color: "#888880", marginBottom: 8 }}>{t.min}+ pts</div>
            <div style={{ fontSize: 11, color: "#888880" }}>{t.perks}</div>
            <div style={{ marginTop: 10, fontWeight: 600, color: t.color }}>{customers.filter(c => c.tier === t.name).length} members</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {customers.map(c => {
          const tier = getTier(c.points);
          const nextTier = LOYALTY_TIERS[LOYALTY_TIERS.indexOf(tier) + 1];
          const progress = nextTier ? ((c.points - tier.min) / (nextTier.min - tier.min) * 100) : 100;
          return (
            <Card key={c.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${tier.color}22`, border: `1px solid ${tier.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 600, color: tier.color }}>{c.name.slice(0, 1)}</div>
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: 2 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: "#888880" }}>{c.phone} · {c.totalOrders} orders · ₨{(c.totalSpent / 1000).toFixed(0)}K spent</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 18, fontWeight: 600, color: tier.color, fontFamily: "'Playfair Display', serif" }}>{c.points} pts</div>
                    <Badge color={tier.name === "Platinum" ? "gray" : tier.name === "Gold" ? "gold" : tier.name === "Silver" ? "blue" : "gray"}>{tier.name}</Badge>
                  </div>
                  <Button size="sm" onClick={() => { setSelected(c); setModal("points"); }}><Icon name="add" size={12} /> Points</Button>
                </div>
              </div>
              {nextTier && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888880", marginBottom: 4 }}>
                    <span>Progress to {nextTier.name}</span>
                    <span>{nextTier.min - c.points} pts needed</span>
                  </div>
                  <div style={{ background: G.surface, borderRadius: 4, height: 4 }}>
                    <div style={{ width: `${Math.min(progress, 100)}%`, height: "100%", background: tier.color, borderRadius: 4, transition: "width 0.8s" }} />
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Modal open={modal === "points"} onClose={() => setModal(null)} title={`Add Points — ${selected?.name}`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ padding: "1rem", background: G.surface, borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: G.primary, fontFamily: "'Playfair Display', serif" }}>{selected?.points}</div>
            <div style={{ fontSize: 12, color: "#888880" }}>Current Points</div>
          </div>
          <Input label="Points to Add" value={addPoints} onChange={v => setAddPoints(v)} type="number" placeholder="Enter points" />
          <Button onClick={() => { setCustomers(prev => prev.map(c => c.id === selected?.id ? { ...c, points: c.points + Number(addPoints) } : c)); setModal(null); setAddPoints(0); }}>Add Points</Button>
        </div>
      </Modal>

      <Modal open={modal === "tiers"} onClose={() => setModal(null)} title="Loyalty Tiers">
        {LOYALTY_TIERS.map(t => (
          <div key={t.name} style={{ padding: "1rem 0", borderBottom: `0.5px solid ${G.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontWeight: 600, color: t.color }}>{t.name}</span>
              <span style={{ fontSize: 12, color: "#888880" }}>{t.min} — {t.max === 99999 ? "∞" : t.max} pts</span>
            </div>
            <div style={{ fontSize: 13, color: "#888880" }}>{t.perks}</div>
          </div>
        ))}
      </Modal>
    </div>
  );
};

// ── MODULE: ANALYTICS ─────────────────────────────────────────
const Analytics = () => {
  const totalRev = SAMPLE_ORDERS.reduce((a, b) => a + b.price, 0);
  const totalCost = SAMPLE_PRODUCTS.reduce((a, b) => a + b.cost * (10 - b.stock), 0);
  const grossProfit = totalRev * 0.18;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600 }}>Analytics & Reports</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        <MetricCard label="Total Revenue" value={`₨${(totalRev / 1000).toFixed(0)}K`} sub="All orders" color={G.primary} icon="chart" />
        <MetricCard label="Gross Profit" value={`₨${(grossProfit / 1000).toFixed(0)}K`} sub="~18% margin" color="#52C97A" icon="sales" />
        <MetricCard label="Orders This Month" value={SAMPLE_ORDERS.length} sub="+23% MoM" color="#52A8E0" icon="orders" />
        <MetricCard label="Avg Ticket Size" value={`₨${(totalRev / SAMPLE_ORDERS.length / 1000).toFixed(0)}K`} sub="Per order" color="#E0A852" icon="star" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Revenue by Category</div>
          {[{ cat: "Smartphones", pct: 38, rev: 850000 }, { cat: "Laptops", pct: 28, rev: 625000 }, { cat: "TV & Display", pct: 18, rev: 400000 }, { cat: "Home Appliances", pct: 10, rev: 225000 }, { cat: "Others", pct: 6, rev: 135000 }].map(c => (
            <div key={c.cat} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                <span>{c.cat}</span><span style={{ color: G.primary }}>₨{(c.rev / 1000).toFixed(0)}K</span>
              </div>
              <div style={{ background: G.surface, borderRadius: 4, height: 6 }}>
                <div style={{ width: `${c.pct}%`, height: "100%", background: G.primary, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Monthly Trend</div>
          <div style={{ display: "flex", align: "flex-end", gap: 8, height: 140, alignItems: "flex-end" }}>
            {[{ m: "Oct", v: 65 }, { m: "Nov", v: 78 }, { m: "Dec", v: 95 }, { m: "Jan", v: 72 }, { m: "Feb", v: 88 }, { m: "Mar", v: 100 }].map(d => (
              <div key={d.m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: "100%", background: G.primary, borderRadius: "4px 4px 0 0", height: `${d.v}%`, opacity: d.m === "Mar" ? 1 : 0.5, transition: "height 1s" }} />
                <span style={{ fontSize: 10, color: "#888880" }}>{d.m}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Top Selling Products</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `0.5px solid ${G.border}` }}>
                {["Product", "Units Sold", "Revenue", "Margin", "Performance"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, color: "#888880", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAMPLE_PRODUCTS.slice(0, 5).map((p, i) => {
                const sold = 15 - i * 2;
                const margin = ((p.price - p.cost) / p.price * 100).toFixed(0);
                return (
                  <tr key={p.id} style={{ borderBottom: `0.5px solid ${G.border}` }}>
                    <td style={{ padding: "10px 12px" }}><div style={{ display: "flex", gap: 8, alignItems: "center" }}><span>{p.image}</span><span style={{ fontSize: 13 }}>{p.name.slice(0, 30)}</span></div></td>
                    <td style={{ padding: "10px 12px", fontSize: 13 }}>{sold}</td>
                    <td style={{ padding: "10px 12px", fontSize: 13, color: G.primary }}>₨{(p.price * sold / 1000).toFixed(0)}K</td>
                    <td style={{ padding: "10px 12px" }}><Badge color={Number(margin) > 15 ? "green" : "yellow"}>{margin}%</Badge></td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ background: G.surface, borderRadius: 4, height: 6, width: 80 }}>
                        <div style={{ width: `${(sold / 15) * 100}%`, height: "100%", background: G.primary, borderRadius: 4 }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ── MODULE: TEAM & HR ─────────────────────────────────────────
const TeamHR = () => {
  const [team, setTeam] = useState(SAMPLE_TEAM);
  const [modal, setModal] = useState(null);
  const [newMember, setNewMember] = useState({ name: "", role: "Sales Lead", phone: "", email: "", salary: "" });

  const addMember = () => {
    setTeam(prev => [...prev, { ...newMember, id: `T00${prev.length + 1}`, joinDate: new Date().toISOString().split("T")[0], status: "Active", points: 0, salary: Number(newMember.salary) }]);
    setModal(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600 }}>Team & HR</h2>
        <Button onClick={() => setModal("add")}><Icon name="add" size={14} /> Add Member</Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <MetricCard label="Total Staff" value={team.length} color={G.primary} icon="team" />
        <MetricCard label="Active Today" value={team.filter(t => t.status === "Active").length} color="#52C97A" icon="check" />
        <MetricCard label="Monthly Payroll" value={`₨${(team.reduce((a, b) => a + b.salary, 0) / 1000).toFixed(0)}K`} color="#E0A852" icon="chart" />
        <MetricCard label="Avg Performance" value="87%" color="#52A8E0" icon="star" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {team.map(m => (
          <Card key={m.id}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${G.primary}22`, border: `1px solid ${G.primary}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 600, color: G.primary, flexShrink: 0 }}>{m.name.slice(0, 1)}{m.name.split(" ")[1]?.slice(0, 1) || ""}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, marginBottom: 2 }}>{m.name}</div>
                <Badge color="gold">{m.role}</Badge>
              </div>
              <Badge color={m.status === "Active" ? "green" : "gray"}>{m.status}</Badge>
            </div>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div style={{ fontSize: 12, color: "#888880" }}><Icon name="phone" size={11} /> {m.phone}</div>
              <div style={{ fontSize: 12, color: "#888880" }}>Joined {m.joinDate.slice(0, 7)}</div>
              {m.salary > 0 && <div style={{ fontSize: 12, color: G.primary }}>₨{m.salary.toLocaleString()}/mo</div>}
              <div style={{ fontSize: 12, color: "#E0A852" }}>⭐ {m.points} pts</div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modal === "add"} onClose={() => setModal(null)} title="Add Team Member">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Full Name" value={newMember.name} onChange={v => setNewMember(p => ({ ...p, name: v }))} />
          <Select label="Role" value={newMember.role} onChange={v => setNewMember(p => ({ ...p, role: v }))} options={ROLES} />
          <Input label="Phone" value={newMember.phone} onChange={v => setNewMember(p => ({ ...p, phone: v }))} />
          <Input label="Email" value={newMember.email} onChange={v => setNewMember(p => ({ ...p, email: v }))} />
          <Input label="Monthly Salary (PKR)" value={newMember.salary} onChange={v => setNewMember(p => ({ ...p, salary: v }))} type="number" />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
            <Button onClick={addMember}>Add Member</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// ── MODULE: WHATSAPP ──────────────────────────────────────────
const WhatsApp = () => {
  const templates = [
    { name: "Order Confirmation", msg: `Assalam o Alaikum! 🌟\nAapka order confirm ho gaya hai.\nOrder ID: {ORDER_ID}\nProduct: {PRODUCT}\nAmount: PKR {AMOUNT}\n\nShukriya AR ELECTRONICS se shopping karne ka! 📱` },
    { name: "Dispatch Notification", msg: `📦 Aapka order dispatch ho chuka hai!\nOrder ID: {ORDER_ID}\nETA: 1-2 business days\n\nTracking ke liye humse sampark karein.\nAR ELECTRONICS 🔌` },
    { name: "Low Stock Alert (Customer)", msg: `⚡ Limited Stock Alert!\nJis product mein aap interested hain — {PRODUCT} — sirf {STOCK} units baqi hain.\n\nAbhi order karein! AR ELECTRONICS 📲` },
    { name: "Loyalty Points Update", msg: `🌟 Congratulations!\nAapke loyalty account mein {POINTS} points add ho gaye hain!\nCurrent Tier: {TIER}\n\nAR ELECTRONICS — Rewards ke saath shopping! 💎` },
    { name: "Payment Reminder", msg: `Assalam o Alaikum,\nOrder {ORDER_ID} ki payment baqi hai.\nAmount: PKR {AMOUNT}\n\nKripya jaldi payment complete karein.\nShukriya, AR ELECTRONICS 🙏` },
  ];

  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [customMsg, setCustomMsg] = useState(templates[0].msg);
  const [phone, setPhone] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600 }}>WhatsApp Business</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 12, color: "#888880", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Message Templates</div>
          {templates.map(t => (
            <Card key={t.name} onClick={() => { setSelectedTemplate(t); setCustomMsg(t.msg); }} style={{ cursor: "pointer", border: `0.5px solid ${selectedTemplate.name === t.name ? G.primary : G.border}`, background: selectedTemplate.name === t.name ? `${G.primary}11` : G.card }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: selectedTemplate.name === t.name ? G.primary : "#F0EDE8" }}>{t.name}</div>
            </Card>
          ))}
        </div>

        <Card>
          <div style={{ fontSize: 12, color: "#888880", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Compose Message</div>
          <textarea
            value={customMsg}
            onChange={e => setCustomMsg(e.target.value)}
            style={{ width: "100%", height: 180, background: G.surface, border: `0.5px solid ${G.border}`, borderRadius: 8, padding: 12, color: "#F0EDE8", fontFamily: "'DM Sans', sans-serif", fontSize: 13, resize: "vertical", outline: "none", lineHeight: 1.6 }}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "flex-end" }}>
            <Input label="Phone Number" value={phone} onChange={setPhone} placeholder="+923XXXXXXXXX" style={{ flex: 1 }} />
            <a href={`https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(customMsg)}`} target="_blank" rel="noreferrer">
              <Button><Icon name="whatsapp" size={14} /> Send via WhatsApp</Button>
            </a>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, color: "#888880", marginBottom: 8 }}>Quick Send to Team</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {SAMPLE_TEAM.slice(0, 4).map(m => (
                <a key={m.id} href={`https://wa.me/${m.phone.replace(/\D/g, "")}?text=${encodeURIComponent(customMsg)}`} target="_blank" rel="noreferrer">
                  <Button variant="ghost" size="sm">{m.name.split(" ")[0]}</Button>
                </a>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ── MODULE: AI (Marketing / Sales / Strategy) ─────────────────
const AIModule = ({ type }) => {
  const configs = {
    "Marketing AI": {
      icon: "marketing",
      system: `You are an expert Marketing AI for AR ELECTRONICS, a retail electronics brand in Pakistan. Help with marketing campaigns, social media content, ad copies, promotions, influencer strategies, and brand awareness for electronics products like smartphones, laptops, TVs, and home appliances. Respond in Urdu/English mix as appropriate. Be specific, creative, and actionable.`,
      placeholder: "Marketing strategy, social media content, ad copy likhne ko bolein...",
      suggestions: ["Instagram caption for iPhone 15 Pro Max", "Eid sale marketing plan banao", "YouTube ad script for Samsung TV", "TikTok content ideas for electronics"],
    },
    "Sales AI": {
      icon: "sales",
      system: `You are a Sales AI for AR ELECTRONICS Pakistan. Help with sales scripts, objection handling, customer pitches, upselling strategies, closing techniques, and revenue optimization for electronics retail. Provide practical, actionable sales advice in Urdu/English.`,
      placeholder: "Sales scripts, objection handling, upselling tips poochein...",
      suggestions: ["Customer objection handle karo — 'price bahut zyada hai'", "iPhone se Samsung par upsell kaise karein", "B2B corporate sales pitch banao", "Follow-up message template"],
    },
    "Strategy AI": {
      icon: "strategy",
      system: `You are a CEO-level Business Strategy AI for AR ELECTRONICS, a growing electronics retail brand in Pakistan. Help with business strategy, market analysis, competitor analysis, expansion plans, pricing strategies, and business decisions. Think like a seasoned business consultant with deep knowledge of Pakistan's electronics market.`,
      placeholder: "Business strategy, market analysis, expansion plans poochein...",
      suggestions: ["AR Electronics ki 6-month growth strategy", "Online vs offline expansion kaise karein", "Competitor analysis — Hafeez Center vs online stores", "Pricing strategy for premium segment"],
    },
  };

  const config = configs[type];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${G.primary}22`, border: `0.5px solid ${G.primary}44`, display: "flex", alignItems: "center", justifyContent: "center", color: G.primary }}>
          <Icon name={config.icon} size={18} />
        </div>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600 }}>{type}</h2>
          <p style={{ fontSize: 12, color: "#888880" }}>Powered by Claude AI · AR Electronics specialized</p>
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, color: "#888880", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Quick Prompts</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {config.suggestions.map(s => (
            <button key={s} onClick={() => { }} style={{ padding: "6px 12px", background: `${G.primary}11`, border: `0.5px solid ${G.primary}33`, borderRadius: 20, color: G.light, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>{s}</button>
          ))}
        </div>
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <AIChat module={type} systemPrompt={config.system} placeholder={config.placeholder} />
      </Card>
    </div>
  );
};

// ── LOGIN SCREEN ──────────────────────────────────────────────
const Login = ({ onLogin }) => {
  const [role, setRole] = useState("Owner/ACEO");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (pin.length < 4) { setError("PIN must be at least 4 digits"); return; }
    onLogin(role);
  };

  return (
    <div style={{ minHeight: "100vh", background: G.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <style>{css}</style>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔌</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: G.primary, letterSpacing: "0.02em", marginBottom: 6 }}>{BRAND.name}</h1>
          <p style={{ color: "#888880", fontSize: 14 }}>{BRAND.tagline}</p>
          <p style={{ color: "#555550", fontSize: 12, marginTop: 4 }}>{BRAND.category} · Brand OS</p>
        </div>

        <Card style={{ padding: "2rem" }}>
          <div style={{ marginBottom: 20 }}>
            <Select label="Select Your Role" value={role} onChange={setRole} options={ROLES} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <Input label="PIN / Password" value={pin} onChange={v => { setPin(v); setError(""); }} type="password" placeholder="Enter your PIN" />
            {error && <div style={{ color: "#E05252", fontSize: 12, marginTop: 6 }}>{error}</div>}
          </div>
          <Button onClick={handleLogin} style={{ width: "100%", justifyContent: "center" }}>
            Sign In to Brand OS
          </Button>
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#555550" }}>
            Demo: any role · any PIN (4+ digits)
          </div>
        </Card>

        <div style={{ textAlign: "center", marginTop: 24, color: "#333330", fontSize: 11 }}>
          Universal Brand OS · Powered by React & Firebase
        </div>
      </div>
    </div>
  );
};

// ── MAIN APP ──────────────────────────────────────────────────
export default function App() {
  const [currentRole, setCurrentRole] = useState(null);
  const [activeModule, setActiveModule] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  if (!currentRole) return <Login onLogin={role => { setCurrentRole(role); setActiveModule("Dashboard"); }} />;

  const allowed = ROLE_PERMISSIONS[currentRole] || ["Dashboard"];
  const navItems = [
    { id: "Dashboard", icon: "dashboard" },
    { id: "Orders", icon: "orders" },
    { id: "Inventory", icon: "inventory" },
    { id: "E-commerce", icon: "ecommerce" },
    { id: "Dispatch", icon: "dispatch" },
    { id: "Loyalty", icon: "loyalty" },
    { id: "Analytics", icon: "analytics" },
    { id: "Marketing AI", icon: "marketing" },
    { id: "Sales AI", icon: "sales" },
    { id: "Strategy AI", icon: "strategy" },
    { id: "Team & HR", icon: "team" },
    { id: "WhatsApp", icon: "whatsapp" },
  ].filter(n => allowed.includes(n.id));

  const renderModule = () => {
    switch (activeModule) {
      case "Dashboard": return <Dashboard role={currentRole} />;
      case "Orders": return <Orders />;
      case "Inventory": return <Inventory />;
      case "E-commerce": return <Ecommerce />;
      case "Dispatch": return <Dispatch />;
      case "Loyalty": return <Loyalty />;
      case "Analytics": return <Analytics />;
      case "Marketing AI": return <AIModule type="Marketing AI" />;
      case "Sales AI": return <AIModule type="Sales AI" />;
      case "Strategy AI": return <AIModule type="Strategy AI" />;
      case "Team & HR": return <TeamHR />;
      case "WhatsApp": return <WhatsApp />;
      default: return <Dashboard role={currentRole} />;
    }
  };

  const Sidebar = ({ mobile = false }) => (
    <div style={{ width: mobile ? "100%" : sidebarOpen ? 220 : 64, background: G.surface, borderRight: `0.5px solid ${G.border}`, display: "flex", flexDirection: "column", transition: "width 0.3s", overflow: "hidden", height: "100vh", position: mobile ? "fixed" : "relative", left: 0, top: 0, zIndex: mobile ? 200 : "auto", flexShrink: 0 }}>
      <div style={{ padding: "1.25rem", borderBottom: `0.5px solid ${G.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {(sidebarOpen || mobile) && (
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: G.primary, whiteSpace: "nowrap", overflow: "hidden" }}>{BRAND.name}</div>
            <div style={{ fontSize: 10, color: "#555550", whiteSpace: "nowrap" }}>Brand OS</div>
          </div>
        )}
        <button onClick={() => mobile ? setMobileSidebar(false) : setSidebarOpen(p => !p)} style={{ background: "none", border: "none", color: "#888880", cursor: "pointer", padding: 4, marginLeft: "auto" }}>
          <Icon name={mobile ? "close" : "menu"} size={18} />
        </button>
      </div>

      <div style={{ padding: "0.5rem", flex: 1, overflow: "auto" }}>
        {navItems.map(n => (
          <button key={n.id} onClick={() => { setActiveModule(n.id); if (mobile) setMobileSidebar(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "none", background: activeModule === n.id ? `${G.primary}22` : "transparent", color: activeModule === n.id ? G.primary : "#888880", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: activeModule === n.id ? 500 : 400, transition: "all 0.15s", textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", marginBottom: 2 }}>
            <span style={{ flexShrink: 0, color: activeModule === n.id ? G.primary : "#555550" }}><Icon name={n.icon} size={16} /></span>
            {(sidebarOpen || mobile) && <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{n.id}</span>}
          </button>
        ))}
      </div>

      {(sidebarOpen || mobile) && (
        <div style={{ padding: "1rem", borderTop: `0.5px solid ${G.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${G.primary}22`, border: `1px solid ${G.primary}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: G.primary, flexShrink: 0 }}>{currentRole.slice(0, 1)}</div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentRole}</div>
              <div style={{ fontSize: 10, color: "#555550" }}>{BRAND.name}</div>
            </div>
          </div>
          <button onClick={() => setCurrentRole(null)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "none", border: `0.5px solid ${G.border}`, borderRadius: 8, color: "#888880", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            <Icon name="logout" size={14} /> Sign Out
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: G.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{css + `@keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }`}</style>

      {/* Desktop Sidebar */}
      <div style={{ display: "flex" }} className="desktop-sidebar">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebar && (
        <>
          <div onClick={() => setMobileSidebar(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 199 }} />
          <Sidebar mobile />
        </>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Bar */}
        <div style={{ padding: "12px 20px", borderBottom: `0.5px solid ${G.border}`, background: G.surface, display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 100 }}>
          <button onClick={() => setMobileSidebar(true)} style={{ background: "none", border: "none", color: "#888880", cursor: "pointer", display: "none" }} className="mobile-menu">
            <Icon name="menu" size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 600 }}>{activeModule}</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ fontSize: 12, color: "#888880" }}>{new Date().toLocaleDateString("en-PK")}</div>
            <Badge color="gold">{currentRole}</Badge>
            <button style={{ background: "none", border: "none", color: "#888880", cursor: "pointer", position: "relative" }}>
              <Icon name="bell" size={18} />
              <span style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, background: G.primary, borderRadius: "50%" }} />
            </button>
          </div>
        </div>

        {/* Module Content */}
        <div style={{ flex: 1, padding: "1.5rem", overflow: "auto" }}>
          {renderModule()}
        </div>
      </div>
    </div>
  );
}
