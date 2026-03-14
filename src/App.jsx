import { useState, useEffect, useRef, useCallback } from "react";

// ════════════════════════════════════════════════════════════════
//  UNIVERSAL BRAND OS  —  by Omnibrand
//  Works for ANY brand · Dynamic config · AI-powered
//  React + Vite ready · Setup Wizard · 19 modules · 35 roles
// ════════════════════════════════════════════════════════════════

const CATEGORY_PRESETS = {
  fragrance:{ label:"Fragrance / Luxury", icon:"🌸", defaultRoles:["Owner/ACEO","Brand Manager","Sales Lead","Marketing","Inventory","Finance","Designer","Content Creator","Customer Service","Dispatch","HR"], defaultModules:["Dashboard","Orders","Inventory","Loyalty","Analytics","Marketing AI","Sales AI","Strategy AI","Team & HR","WhatsApp","Content Calendar","Influencer"], productLabel:"Perfume", currency:"PKR", currencySymbol:"₨", sampleProducts:[{id:"P001",name:"Oud Royale 50ml",sku:"OUD-50",category:"Oud",price:8500,cost:3200,stock:42,minStock:10,image:"🌸"},{id:"P002",name:"Rose Elixir 30ml",sku:"RSE-30",category:"Floral",price:5500,cost:2100,stock:28,minStock:8,image:"🌹"},{id:"P003",name:"Musk Noir 100ml",sku:"MSK-100",category:"Musk",price:12000,cost:4800,stock:4,minStock:8,image:"🖤"}] },
  fashion:{ label:"Fashion / Apparel", icon:"👗", defaultRoles:["Owner/ACEO","Brand Manager","Sales Lead","Marketing","Inventory","Finance","Designer","Content Creator","Customer Service","Logistics","HR"], defaultModules:["Dashboard","Orders","Inventory","E-commerce","Loyalty","Analytics","Marketing AI","Sales AI","Strategy AI","Team & HR","WhatsApp","Content Calendar"], productLabel:"Product", currency:"PKR", currencySymbol:"₨", sampleProducts:[{id:"P001",name:"Embroidered Kameez",sku:"KMZ-001",category:"Formal",price:4500,cost:1800,stock:35,minStock:10,image:"👗"},{id:"P002",name:"Casual Denim Jacket",sku:"DNM-001",category:"Casual",price:3800,cost:1500,stock:22,minStock:8,image:"🧥"},{id:"P003",name:"Silk Dupatta",sku:"DPT-001",category:"Accessories",price:1800,cost:700,stock:3,minStock:10,image:"🧣"}] },
  food:{ label:"Food & Restaurant", icon:"🍕", defaultRoles:["Owner/ACEO","Manager","Head Chef","Captain/Waiter","Cashier","Kitchen Staff","Delivery","Marketing","Inventory","Finance","HR"], defaultModules:["Dashboard","Orders","Inventory","Analytics","Marketing AI","Sales AI","Strategy AI","Team & HR","WhatsApp","Loyalty","Dispatch","Expense Tracker"], productLabel:"Menu Item", currency:"PKR", currencySymbol:"₨", sampleProducts:[{id:"P001",name:"Beef Burger Platter",sku:"BRG-001",category:"Burgers",price:850,cost:320,stock:999,minStock:1,image:"🍔"},{id:"P002",name:"Chicken Karahi",sku:"KRH-001",category:"Desi",price:1200,cost:480,stock:999,minStock:1,image:"🍛"},{id:"P003",name:"Nutella Waffle",sku:"WFL-001",category:"Desserts",price:450,cost:180,stock:999,minStock:1,image:"🧇"}] },
  beauty:{ label:"Salon / Beauty", icon:"💅", defaultRoles:["Owner/ACEO","Manager","Senior Stylist","Stylist","Receptionist","Marketing","Inventory","Finance","Customer Service","Trainer","HR"], defaultModules:["Dashboard","Appointments","Inventory","Loyalty","Analytics","Marketing AI","Sales AI","Strategy AI","Team & HR","WhatsApp","Content Calendar","Customer Service AI"], productLabel:"Service", currency:"PKR", currencySymbol:"₨", sampleProducts:[{id:"P001",name:"Bridal Makeup",sku:"BRD-001",category:"Makeup",price:25000,cost:8000,stock:999,minStock:1,image:"💄"},{id:"P002",name:"Hair Highlights",sku:"HLT-001",category:"Hair",price:8000,cost:2500,stock:999,minStock:1,image:"✂️"},{id:"P003",name:"Gold Facial",sku:"FCL-001",category:"Skin",price:3500,cost:1200,stock:999,minStock:1,image:"✨"}] },
  retail:{ label:"Retail / E-commerce", icon:"🛍️", defaultRoles:["Owner/ACEO","Store Manager","Sales Lead","Cashier","Inventory","Marketing","Finance","Customer Service","Logistics","Designer","HR"], defaultModules:["Dashboard","Orders","Inventory","E-commerce","Dispatch","Loyalty","Analytics","Marketing AI","Sales AI","Strategy AI","Team & HR","WhatsApp"], productLabel:"Product", currency:"PKR", currencySymbol:"₨", sampleProducts:[{id:"P001",name:"Sample Product A",sku:"PRD-001",category:"General",price:2500,cost:1000,stock:50,minStock:10,image:"📦"},{id:"P002",name:"Sample Product B",sku:"PRD-002",category:"General",price:1800,cost:700,stock:30,minStock:8,image:"🛒"},{id:"P003",name:"Sample Product C",sku:"PRD-003",category:"Premium",price:5500,cost:2200,stock:3,minStock:5,image:"🏷️"}] },
  electronics:{ label:"Electronics", icon:"🔌", defaultRoles:["Owner/ACEO","Store Manager","Sales Lead","Cashier","Inventory","Marketing","Finance","Customer Service","Logistics","Technician","HR"], defaultModules:["Dashboard","Orders","Inventory","E-commerce","Dispatch","Loyalty","Analytics","Marketing AI","Sales AI","Strategy AI","Team & HR","WhatsApp"], productLabel:"Device", currency:"PKR", currencySymbol:"₨", sampleProducts:[{id:"P001",name:"Smartphone Pro X",sku:"PHN-001",category:"Phones",price:85000,cost:72000,stock:12,minStock:5,image:"📱"},{id:"P002",name:"Laptop Ultra 15",sku:"LPT-001",category:"Laptops",price:145000,cost:125000,stock:2,minStock:4,image:"💻"},{id:"P003",name:'Smart TV 55"',sku:"TV-001",category:"TVs",price:95000,cost:82000,stock:0,minStock:3,image:"📺"}] },
  tech:{ label:"Tech / SaaS", icon:"💻", defaultRoles:["CEO/Founder","CTO","Product Manager","Developer","Designer","Marketing","Sales","Customer Success","Finance","DevOps","HR"], defaultModules:["Dashboard","Orders","Analytics","Marketing AI","Sales AI","Strategy AI","Team & HR","WhatsApp","Content Calendar","Customer Service AI","Expense Tracker","Influencer"], productLabel:"Plan", currency:"USD", currencySymbol:"$", sampleProducts:[{id:"P001",name:"Starter Plan",sku:"PLN-S",category:"Plans",price:29,cost:5,stock:999,minStock:1,image:"⚡"},{id:"P002",name:"Growth Plan",sku:"PLN-G",category:"Plans",price:99,cost:15,stock:999,minStock:1,image:"🚀"},{id:"P003",name:"Enterprise Plan",sku:"PLN-E",category:"Plans",price:299,cost:40,stock:999,minStock:1,image:"🏢"}] },
  health:{ label:"Healthcare", icon:"🏥", defaultRoles:["Owner/Doctor","Manager","Doctor","Nurse","Receptionist","Pharmacist","Marketing","Finance","Lab Tech","Customer Service","HR"], defaultModules:["Dashboard","Appointments","Inventory","Loyalty","Analytics","Marketing AI","Strategy AI","Team & HR","WhatsApp","Customer Service AI","Expense Tracker","Content Calendar"], productLabel:"Service", currency:"PKR", currencySymbol:"₨", sampleProducts:[{id:"P001",name:"General Consultation",sku:"CON-001",category:"Consultation",price:1500,cost:200,stock:999,minStock:1,image:"🩺"},{id:"P002",name:"Blood Test Panel",sku:"LAB-001",category:"Lab",price:2500,cost:800,stock:999,minStock:1,image:"🧪"},{id:"P003",name:"Dental Checkup",sku:"DNT-001",category:"Dental",price:2000,cost:500,stock:999,minStock:1,image:"🦷"}] },
  custom:{ label:"Custom Business", icon:"✦", defaultRoles:["Owner/ACEO","Manager","Sales Lead","Marketing","Operations","Finance","Customer Service","Logistics","Designer","HR","Staff"], defaultModules:["Dashboard","Orders","Inventory","Loyalty","Analytics","Marketing AI","Sales AI","Strategy AI","Team & HR","WhatsApp","Content Calendar","Expense Tracker"], productLabel:"Product/Service", currency:"PKR", currencySymbol:"₨", sampleProducts:[] },
};

const COLOR_THEMES = [
  {name:"Gold",    primary:"#B47B2B",light:"#D4A044",dark:"#8A5E1E",bg:"#080807",surface:"#0E0D0B",card:"#141310",border:"#2A2820"},
  {name:"Silver",  primary:"#8A9BA8",light:"#B0C4D0",dark:"#607080",bg:"#080A0B",surface:"#0D1012",card:"#131618",border:"#252A2E"},
  {name:"Crimson", primary:"#C0392B",light:"#E74C3C",dark:"#922B21",bg:"#090707",surface:"#100C0C",card:"#160F0F",border:"#2A1A1A"},
  {name:"Emerald", primary:"#1E8449",light:"#27AE60",dark:"#145A32",bg:"#070909",surface:"#0B0F0C",card:"#101510",border:"#1A2A1A"},
  {name:"Sapphire",primary:"#1A5276",light:"#2980B9",dark:"#0E3A54",bg:"#070809",surface:"#0B0D10",card:"#101318",border:"#1A2030"},
  {name:"Violet",  primary:"#6C3483",light:"#8E44AD",dark:"#4A235A",bg:"#080709",surface:"#0D0B10",card:"#120F15",border:"#251A2A"},
  {name:"Rose",    primary:"#B03A7A",light:"#D4569A",dark:"#8A2A5A",bg:"#09070A",surface:"#100C0F",card:"#160F14",border:"#2A1A24"},
  {name:"Copper",  primary:"#A04000",light:"#CA6F1E",dark:"#7E5109",bg:"#090807",surface:"#100E0B",card:"#161210",border:"#2A2018"},
];

const ALL_MODULES=["Dashboard","Orders","Inventory","E-commerce","Dispatch","Appointments","Loyalty","Analytics","Marketing AI","Sales AI","Strategy AI","Customer Service AI","Team & HR","WhatsApp","Content Calendar","Influencer","Expense Tracker","Leave & Attendance","Stock Alerts"];
const ALL_ROLES_POOL=["Owner/ACEO","CEO/Founder","Brand Manager","Store Manager","Manager","Sales Lead","Marketing","Finance","Inventory","Designer","Content Creator","Customer Service","Logistics","Dispatch","HR","Technician","Developer","CTO","Product Manager","Head Chef","Captain/Waiter","Kitchen Staff","Delivery","Receptionist","Senior Stylist","Stylist","Trainer","Doctor","Nurse","Pharmacist","Lab Tech","Customer Success","DevOps","Staff"];

const MICONS={
  "Dashboard":"M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
  "Orders":"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z",
  "Inventory":"M20.5 3.4L12 1 3.5 3.4v8.1c0 5.2 3.7 10.1 8.5 11.5 4.8-1.4 8.5-6.3 8.5-11.5V3.4z",
  "E-commerce":"M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45A2 2 0 009 17h12v-2H9.42l.9-1.75H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0023.45 5H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
  "Dispatch":"M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z",
  "Appointments":"M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-2 .89-2 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z",
  "Loyalty":"M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  "Analytics":"M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99l1.5 1.5z",
  "Marketing AI":"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z",
  "Sales AI":"M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",
  "Strategy AI":"M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  "Customer Service AI":"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z",
  "Team & HR":"M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
  "WhatsApp":"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51H8c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z",
  "Content Calendar":"M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-2 .89-2 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z",
  "Influencer":"M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z",
  "Expense Tracker":"M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",
  "Leave & Attendance":"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  "Stock Alerts":"M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
};

const makeStyles=(t)=>`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=DM+Sans:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --p:${t.primary};--pl:${t.light};--pd:${t.dark};
    --pa:${t.primary}18;--pa2:${t.primary}30;
    --bg:${t.bg};--s1:${t.surface};--s2:${t.card};
    --b:${t.border};--bl:${t.border}CC;
    --txt:#EDE9E0;--txt2:#888878;--txt3:#4A4840;
    --ok:#1E8449;--ok2:#1E844918;
    --err:#C0392B;--err2:#C0392B18;
    --warn:#B7770D;--warn2:#B7770D18;
    --inf:#1A5276;--inf2:#1A527618;
  }
  body{background:var(--bg);color:var(--txt);font-family:'DM Sans',sans-serif;font-weight:300}
  ::-webkit-scrollbar{width:3px;height:3px}
  ::-webkit-scrollbar-track{background:var(--s1)}
  ::-webkit-scrollbar-thumb{background:var(--pd);border-radius:2px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}
  .fade-in{animation:fadeUp .45s ease forwards}
`;

const Icon=({d,size=16,style={}})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0,...style}}><path d={d}/></svg>);
const MI=({mod,size=15})=><Icon d={MICONS[mod]||MICONS["Dashboard"]} size={size}/>;

const Card=({children,style={},onClick,accent})=>{
  const[h,setH]=useState(false);
  return(<div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{background:h&&onClick?"var(--pa)":"var(--s2)",border:`0.5px solid ${h&&onClick?"var(--p)":accent?"var(--p)":"var(--b)"}`,borderRadius:12,padding:"1.25rem",cursor:onClick?"pointer":"default",transition:"all .2s",...style}}>{children}</div>);
};

const Badge=({children,t="gold"})=>{
  const m={gold:{bg:"var(--pa)",c:"var(--p)",b:"var(--pa2)"},green:{bg:"var(--ok2)",c:"var(--ok)",b:"#1E844930"},red:{bg:"var(--err2)",c:"var(--err)",b:"#C0392B30"},blue:{bg:"var(--inf2)",c:"#2980B9",b:"#1A527630"},yellow:{bg:"var(--warn2)",c:"#F0A500",b:"#B7770D30"},gray:{bg:"#4A484018",c:"var(--txt2)",b:"#4A484030"},purple:{bg:"#6C348318",c:"#8E44AD",b:"#6C348330"}};
  const s=m[t]||m.gray;
  return(<span style={{background:s.bg,color:s.c,border:`0.5px solid ${s.b}`,padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:500,whiteSpace:"nowrap"}}>{children}</span>);
};

const StatusBadge=({status})=>{
  const m={Pending:"yellow",Confirmed:"blue",Picked:"gold",Dispatched:"gold",Delivered:"green",Completed:"green",Cancelled:"red",Scheduled:"blue",Draft:"gray",Published:"green",Approved:"green",Rejected:"red",Active:"green",Inactive:"gray","No-Show":"red"};
  return <Badge t={m[status]||"gray"}>{status}</Badge>;
};

const KPI=({label,value,sub,color,icon})=>(
  <Card>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
      <span style={{fontSize:11,color:"var(--txt2)",textTransform:"uppercase",letterSpacing:".1em"}}>{label}</span>
      {icon&&<Icon d={icon} size={16} style={{color:color||"var(--p)",opacity:.7}}/>}
    </div>
    <div style={{fontSize:28,fontWeight:600,color:color||"var(--p)",fontFamily:"'Cormorant Garamond',serif",letterSpacing:".02em"}}>{value}</div>
    {sub&&<div style={{fontSize:12,color:"var(--txt3)",marginTop:6}}>{sub}</div>}
  </Card>
);

const Btn=({children,onClick,v="primary",sz="md",disabled,fw,style={}})=>{
  const[h,setH]=useState(false);
  const sizes={sm:{padding:"5px 11px",fontSize:11},md:{padding:"9px 16px",fontSize:13},lg:{padding:"12px 26px",fontSize:14}};
  const vars={primary:{background:h?"var(--pl)":"var(--p)",color:"#fff",border:"none"},secondary:{background:"transparent",color:"var(--p)",border:"0.5px solid var(--p)"},ghost:{background:h?"var(--pa)":"transparent",color:"var(--txt2)",border:"0.5px solid var(--b)"},danger:{background:h?"#C0392B30":"var(--err2)",color:"var(--err)",border:"0.5px solid #C0392B30"}};
  return(<button onClick={onClick} disabled={disabled} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{display:"inline-flex",alignItems:"center",gap:6,borderRadius:8,cursor:disabled?"not-allowed":"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500,transition:"all .18s",opacity:disabled?.5:1,width:fw?"100%":"auto",justifyContent:fw?"center":"flex-start",...sizes[sz],...vars[v],...style}}>{children}</button>);
};

const Inp=({label,value,onChange,placeholder,type="text",style={}})=>(
  <div style={{display:"flex",flexDirection:"column",gap:6,...style}}>
    {label&&<label style={{fontSize:11,color:"var(--txt2)",textTransform:"uppercase",letterSpacing:".1em"}}>{label}</label>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{background:"var(--s1)",border:"0.5px solid var(--b)",borderRadius:8,padding:"9px 13px",color:"var(--txt)",fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:"none",width:"100%"}}
      onFocus={e=>e.target.style.borderColor="var(--p)"} onBlur={e=>e.target.style.borderColor="var(--b)"}/>
  </div>
);

const Sel=({label,value,onChange,options})=>(
  <div style={{display:"flex",flexDirection:"column",gap:6}}>
    {label&&<label style={{fontSize:11,color:"var(--txt2)",textTransform:"uppercase",letterSpacing:".1em"}}>{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)} style={{background:"var(--s1)",border:"0.5px solid var(--b)",borderRadius:8,padding:"9px 13px",color:"var(--txt)",fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:"none",width:"100%"}}>
      {options.map(o=><option key={o.value||o} value={o.value||o} style={{background:"var(--s2)"}}>{o.label||o}</option>)}
    </select>
  </div>
);

const Modal=({open,onClose,title,children,width=540})=>{
  if(!open)return null;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.82)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:"var(--s2)",border:"0.5px solid var(--bl)",borderRadius:16,width:"100%",maxWidth:width,maxHeight:"90vh",overflow:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1.1rem 1.4rem",borderBottom:"0.5px solid var(--b)"}}>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:"var(--txt2)",cursor:"pointer"}}><Icon d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" size={20}/></button>
        </div>
        <div style={{padding:"1.4rem"}}>{children}</div>
      </div>
    </div>
  );
};

const AIChat=({systemPrompt,placeholder,quickPrompts=[]})=>{
  const[msgs,setMsgs]=useState([]);
  const[input,setInput]=useState("");
  const[loading,setLoading]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const send=async(text)=>{
    const m=text||input;
    if(!m.trim()||loading)return;
    const um={role:"user",content:m};
    setMsgs(p=>[...p,um]);setInput("");setLoading(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:systemPrompt,messages:[...msgs,um]})});
      const data=await res.json();
      setMsgs(p=>[...p,{role:"assistant",content:data.content?.[0]?.text||"No response."}]);
    }catch{setMsgs(p=>[...p,{role:"assistant",content:"Connection error. Please try again."}]);}
    setLoading(false);
  };
  return(
    <div style={{display:"flex",flexDirection:"column",height:480}}>
      {quickPrompts.length>0&&msgs.length===0&&(
        <div style={{padding:".75rem 1rem",borderBottom:"0.5px solid var(--b)",display:"flex",gap:8,flexWrap:"wrap"}}>
          {quickPrompts.map(q=>(<button key={q} onClick={()=>send(q)} style={{padding:"4px 12px",background:"var(--pa)",border:"0.5px solid var(--pa2)",borderRadius:20,color:"var(--p)",fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{q}</button>))}
        </div>
      )}
      <div style={{flex:1,overflow:"auto",padding:"1rem",display:"flex",flexDirection:"column",gap:10}}>
        {msgs.length===0&&<div style={{textAlign:"center",color:"var(--txt2)",marginTop:80}}><div style={{fontSize:34,marginBottom:12,color:"var(--p)",opacity:.3}}>◈</div><div style={{fontSize:13}}>{placeholder}</div></div>}
        {msgs.map((m,i)=>(<div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}><div style={{maxWidth:"82%",padding:"9px 13px",borderRadius:12,fontSize:13,lineHeight:1.7,background:m.role==="user"?"var(--p)":"var(--s1)",color:m.role==="user"?"#fff":"var(--txt)",border:m.role==="assistant"?"0.5px solid var(--b)":"none",whiteSpace:"pre-wrap"}}>{m.content}</div></div>))}
        {loading&&<div style={{display:"flex",gap:4,padding:"9px 13px",width:58,background:"var(--s1)",borderRadius:12,border:"0.5px solid var(--b)"}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"var(--p)",animation:`pulse 1.2s ${i*.2}s infinite`}}/>)}</div>}
        <div ref={endRef}/>
      </div>
      <div style={{borderTop:"0.5px solid var(--b)",padding:".75rem 1rem",display:"flex",gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Type your message..." style={{flex:1,background:"var(--s1)",border:"0.5px solid var(--b)",borderRadius:8,padding:"9px 13px",color:"var(--txt)",fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:"none"}}/>
        <Btn onClick={()=>send()} disabled={loading}><Icon d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" size={14}/> Send</Btn>
      </div>
    </div>
  );
};

// ── SETUP WIZARD ──────────────────────────────────────────────
const SetupWizard=({onComplete})=>{
  const[step,setStep]=useState(1);
  const[cfg,setCfg]=useState({category:"",brandName:"",tagline:"",city:"",whatsapp:"",theme:COLOR_THEMES[0],modules:[],roles:[],currency:"PKR",currencySymbol:"₨"});
  const upd=(k,v)=>setCfg(p=>({...p,[k]:v}));
  const toggle=(arr,item)=>arr.includes(item)?arr.filter(x=>x!==item):[...arr,item];
  const selectCat=(key)=>{const pr=CATEGORY_PRESETS[key];setCfg(p=>({...p,category:key,modules:[...pr.defaultModules],roles:[...pr.defaultRoles],currency:pr.currency,currencySymbol:pr.currencySymbol}));};
  const T=cfg.theme;
  return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"'DM Sans',sans-serif"}}>
      <style>{makeStyles(T)}</style>
      <div style={{width:"100%",maxWidth:640}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:12,letterSpacing:".4em",color:T.primary,marginBottom:6}}>OMNIBRAND</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:300,color:"#EDE9E0",marginBottom:4}}>Universal Brand OS</div>
          <div style={{fontSize:12,color:"#888878"}}>Setup your brand in 6 steps</div>
        </div>
        <div style={{display:"flex",gap:4,marginBottom:24,justifyContent:"center"}}>
          {Array.from({length:6},(_,i)=>(<div key={i} style={{height:3,flex:1,maxWidth:60,borderRadius:2,background:i+1<=step?T.primary:T.border,transition:"background .3s"}}/>))}
        </div>
        <div style={{background:T.card,border:`0.5px solid ${T.border}`,borderRadius:16,padding:"1.75rem"}}>
          {step===1&&(
            <div className="fade-in">
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,marginBottom:4}}>What type of business?</div>
              <div style={{fontSize:13,color:"#888878",marginBottom:18}}>We auto-configure everything for your category</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(138px,1fr))",gap:10}}>
                {Object.entries(CATEGORY_PRESETS).map(([key,pr])=>(<div key={key} onClick={()=>selectCat(key)} style={{padding:"1rem",border:`0.5px solid ${cfg.category===key?T.primary:T.border}`,borderRadius:10,cursor:"pointer",textAlign:"center",background:cfg.category===key?`${T.primary}18`:T.surface,transition:"all .2s"}}><div style={{fontSize:28,marginBottom:8}}>{pr.icon}</div><div style={{fontSize:12,fontWeight:500,color:cfg.category===key?T.primary:"#EDE9E0"}}>{pr.label}</div></div>))}
              </div>
              <div style={{marginTop:20,display:"flex",justifyContent:"flex-end"}}><Btn onClick={()=>cfg.category&&setStep(2)} disabled={!cfg.category}>Next →</Btn></div>
            </div>
          )}
          {step===2&&(
            <div className="fade-in">
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,marginBottom:4}}>Brand identity</div>
              <div style={{fontSize:13,color:"#888878",marginBottom:18}}>Tell us about your brand</div>
              <div style={{display:"flex",flexDirection:"column",gap:13}}>
                <Inp label="Brand Name *" value={cfg.brandName} onChange={v=>upd("brandName",v)} placeholder="e.g. Nova Fragrance, AR Electronics"/>
                <Inp label="Tagline" value={cfg.tagline} onChange={v=>upd("tagline",v)} placeholder="e.g. Quality you can trust"/>
                <Inp label="City / Location" value={cfg.city} onChange={v=>upd("city",v)} placeholder="e.g. Karachi, Lahore, Dubai"/>
                <Inp label="WhatsApp Number" value={cfg.whatsapp} onChange={v=>upd("whatsapp",v)} placeholder="+923XXXXXXXXX"/>
                <Sel label="Currency" value={cfg.currency} onChange={v=>{upd("currency",v);upd("currencySymbol",v==="PKR"?"₨":v==="USD"?"$":v==="AED"?"د.إ":"£");}} options={["PKR","USD","AED","GBP"]}/>
              </div>
              <div style={{marginTop:20,display:"flex",gap:10,justifyContent:"flex-end"}}><Btn v="ghost" onClick={()=>setStep(1)}>← Back</Btn><Btn onClick={()=>cfg.brandName&&setStep(3)} disabled={!cfg.brandName}>Next →</Btn></div>
            </div>
          )}
          {step===3&&(
            <div className="fade-in">
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,marginBottom:4}}>Color theme</div>
              <div style={{fontSize:13,color:"#888878",marginBottom:18}}>Choose your brand's visual identity</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
                {COLOR_THEMES.map(t=>(<div key={t.name} onClick={()=>upd("theme",t)} style={{padding:"1rem",border:`0.5px solid ${cfg.theme.name===t.name?t.primary:T.border}`,borderRadius:10,cursor:"pointer",textAlign:"center",background:cfg.theme.name===t.name?`${t.primary}18`:T.surface,transition:"all .2s"}}><div style={{width:32,height:32,borderRadius:"50%",background:t.primary,margin:"0 auto 8px"}}/><div style={{fontSize:12,color:cfg.theme.name===t.name?t.primary:"#888878",fontWeight:500}}>{t.name}</div></div>))}
              </div>
              <div style={{marginTop:20,display:"flex",gap:10,justifyContent:"flex-end"}}><Btn v="ghost" onClick={()=>setStep(2)}>← Back</Btn><Btn onClick={()=>setStep(4)}>Next →</Btn></div>
            </div>
          )}
          {step===4&&(
            <div className="fade-in">
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,marginBottom:4}}>Select modules</div>
              <div style={{fontSize:13,color:"#888878",marginBottom:18}}>Pre-selected for your category. Customize freely.</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,maxHeight:300,overflow:"auto"}}>
                {ALL_MODULES.map(m=>{const on=cfg.modules.includes(m);return(<div key={m} onClick={()=>upd("modules",toggle(cfg.modules,m))} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 11px",border:`0.5px solid ${on?"var(--p)":T.border}`,borderRadius:8,cursor:"pointer",background:on?`${T.primary}14`:"transparent",transition:"all .2s"}}><div style={{width:16,height:16,borderRadius:4,border:`0.5px solid ${on?"var(--p)":T.border}`,background:on?"var(--p)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}>{on&&<Icon d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" size={10} style={{color:"#fff"}}/>}</div><span style={{fontSize:12,color:on?"var(--p)":"#888878",fontWeight:on?500:400}}>{m}</span></div>);})}
              </div>
              <div style={{marginTop:12,fontSize:12,color:"var(--txt3)"}}>{cfg.modules.length} modules selected</div>
              <div style={{marginTop:16,display:"flex",gap:10,justifyContent:"flex-end"}}><Btn v="ghost" onClick={()=>setStep(3)}>← Back</Btn><Btn onClick={()=>setStep(5)}>Next →</Btn></div>
            </div>
          )}
          {step===5&&(
            <div className="fade-in">
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,marginBottom:4}}>Team roles</div>
              <div style={{fontSize:13,color:"#888878",marginBottom:18}}>Select roles in your team</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,maxHeight:280,overflow:"auto"}}>
                {ALL_ROLES_POOL.map(r=>{const on=cfg.roles.includes(r);return(<div key={r} onClick={()=>upd("roles",toggle(cfg.roles,r))} style={{padding:"5px 13px",borderRadius:20,border:`0.5px solid ${on?"var(--p)":T.border}`,cursor:"pointer",background:on?"var(--p)":"transparent",color:on?"#fff":"#888878",fontSize:12,fontWeight:500,transition:"all .2s"}}>{r}</div>);})}
              </div>
              <div style={{marginTop:12,fontSize:12,color:"var(--txt3)"}}>{cfg.roles.length} roles selected</div>
              <div style={{marginTop:16,display:"flex",gap:10,justifyContent:"flex-end"}}><Btn v="ghost" onClick={()=>setStep(4)}>← Back</Btn><Btn onClick={()=>setStep(6)}>Next →</Btn></div>
            </div>
          )}
          {step===6&&(
            <div className="fade-in">
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,marginBottom:4}}>Review & Launch</div>
              <div style={{fontSize:13,color:"#888878",marginBottom:18}}>Your Brand OS is configured and ready!</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[["Brand Name",cfg.brandName],["Category",CATEGORY_PRESETS[cfg.category]?.label],["Tagline",cfg.tagline||"—"],["Location",cfg.city||"—"],["Theme",cfg.theme.name],["Modules",`${cfg.modules.length} selected`],["Team Roles",`${cfg.roles.length} roles`],["Currency",cfg.currency]].map(([k,v])=>(<div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`0.5px solid ${T.border}`,fontSize:13}}><span style={{color:"#888878"}}>{k}</span><span style={{fontWeight:500,color:"#EDE9E0"}}>{v}</span></div>))}
              </div>
              <div style={{marginTop:20,display:"flex",gap:10,justifyContent:"flex-end"}}><Btn v="ghost" onClick={()=>setStep(5)}>← Back</Btn><Btn onClick={()=>onComplete(cfg)} sz="lg">🚀 Launch Brand OS</Btn></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



// ── DASHBOARD ─────────────────────────────────────────────────
const Dashboard=({brand,orders,products,team})=>{
  const cs=brand.currencySymbol;
  const revenue=orders.filter(o=>o.status==="Delivered"||o.status==="Completed").reduce((a,b)=>a+Number(b.price||0),0);
  const pending=orders.filter(o=>o.status==="Pending"||o.status==="Confirmed").length;
  const lowStock=products.filter(p=>p.stock<=p.minStock&&p.stock!==999).length;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}} className="fade-in">
      <div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:400,marginBottom:4}}>{brand.brandName} <span style={{color:"var(--p)"}}>◈</span></h1>
        <p style={{color:"var(--txt2)",fontSize:13}}>{brand.tagline||CATEGORY_PRESETS[brand.category]?.label} · {new Date().toLocaleDateString("en-GB",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
        <KPI label="Revenue" value={`${cs}${(revenue/1000).toFixed(1)}K`} sub="Delivered orders" color="var(--p)" icon={MICONS["Analytics"]}/>
        <KPI label="Pending" value={pending} sub="Need action" color="var(--warn)" icon={MICONS["Stock Alerts"]}/>
        <KPI label="Low Stock" value={lowStock} sub="Reorder needed" color="var(--err)" icon={MICONS["Inventory"]}/>
        <KPI label="Products" value={products.length} sub="Active SKUs" color="var(--ok)" icon={MICONS["Inventory"]}/>
        <KPI label="Team" value={team.length} sub="Members" color="var(--inf)" icon={MICONS["Team & HR"]}/>
        <KPI label="Total Orders" value={orders.length} sub="All time" color="var(--pl)" icon={MICONS["Orders"]}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,marginBottom:14}}>Recent Orders</div>
          {orders.slice(0,5).map(o=>(<div key={o.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"0.5px solid var(--b)"}}><div><div style={{fontSize:13,fontWeight:500}}>{o.customer}</div><div style={{fontSize:11,color:"var(--txt2)"}}>{(o.product||"").slice(0,26)}{(o.product||"").length>26?"…":""}</div></div><div style={{textAlign:"right"}}><StatusBadge status={o.status}/><div style={{fontSize:11,color:"var(--txt2)",marginTop:2}}>{cs}{Number(o.price||0).toLocaleString()}</div></div></div>))}
          {orders.length===0&&<div style={{color:"var(--txt2)",fontSize:13,textAlign:"center",paddingTop:20}}>No orders yet</div>}
        </Card>
        <Card>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,marginBottom:14}}>Stock Watch</div>
          {products.filter(p=>p.stock<=p.minStock&&p.stock!==999).slice(0,5).map(p=>(<div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"0.5px solid var(--b)"}}><div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:22}}>{p.image}</span><div><div style={{fontSize:12,fontWeight:500}}>{(p.name||"").slice(0,22)}{(p.name||"").length>22?"…":""}</div><div style={{fontSize:11,color:"var(--txt2)"}}>{p.category}</div></div></div><Badge t={p.stock===0?"red":"yellow"}>{p.stock===0?"Out of Stock":`${p.stock} left`}</Badge></div>))}
          {products.filter(p=>p.stock<=p.minStock&&p.stock!==999).length===0&&<div style={{color:"var(--txt2)",fontSize:13,textAlign:"center",paddingTop:20}}>All stocks healthy ✓</div>}
        </Card>
      </div>
      <Card>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,marginBottom:14}}>Order Pipeline</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["Pending","Confirmed","Picked","Dispatched","Delivered"].map(s=>{
            const cnt=orders.filter(o=>o.status===s).length;
            const cols={Pending:"var(--b)",Confirmed:"var(--inf)",Picked:"var(--warn)",Dispatched:"var(--p)",Delivered:"var(--ok)"};
            return(<div key={s} style={{flex:1,minWidth:70,textAlign:"center",padding:"11px 6px",background:"var(--s1)",border:`0.5px solid ${cols[s]}`,borderRadius:10}}><div style={{fontSize:22,fontWeight:600,color:cols[s],fontFamily:"'Cormorant Garamond',serif"}}>{cnt}</div><div style={{fontSize:11,color:"var(--txt2)",marginTop:3}}>{s}</div></div>);
          })}
        </div>
      </Card>
    </div>
  );
};

// ── ORDERS ────────────────────────────────────────────────────
const OrdersModule=({brand,orders,setOrders})=>{
  const[filter,setFilter]=useState("All");
  const[search,setSearch]=useState("");
  const[modal,setModal]=useState(false);
  const[form,setForm]=useState({customer:"",product:"",qty:1,price:"",channel:"Walk-in",phone:"",status:"Pending"});
  const cs=brand.currencySymbol;
  const statuses=["All","Pending","Confirmed","Picked","Dispatched","Delivered","Cancelled"];
  const filtered=orders.filter(o=>(filter==="All"||o.status===filter)&&(o.customer?.toLowerCase().includes(search.toLowerCase())||o.id?.includes(search)));
  const add=()=>{setOrders(p=>[{...form,id:`ORD-${String(p.length+1).padStart(3,"0")}`,price:Number(form.price),qty:Number(form.qty),date:new Date().toISOString().split("T")[0]},...p]);setModal(false);setForm({customer:"",product:"",qty:1,price:"",channel:"Walk-in",phone:"",status:"Pending"});};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}} className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24}}>Order Management</h2>
        <Btn onClick={()=>setModal(true)}><Icon d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14}/> New Order</Btn>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10}}>
        {["Pending","Confirmed","Dispatched","Delivered"].map(s=>(<KPI key={s} label={s} value={orders.filter(o=>o.status===s).length} color={s==="Delivered"?"var(--ok)":s==="Pending"?"var(--warn)":"var(--p)"}/>))}
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search orders..." style={{flex:1,minWidth:200,background:"var(--s1)",border:"0.5px solid var(--b)",borderRadius:8,padding:"8px 13px",color:"var(--txt)",fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:"none"}}/>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {statuses.map(s=>(<button key={s} onClick={()=>setFilter(s)} style={{padding:"6px 11px",borderRadius:20,border:`0.5px solid ${filter===s?"var(--p)":"var(--b)"}`,background:filter===s?"var(--pa)":"transparent",color:filter===s?"var(--p)":"var(--txt2)",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{s}</button>))}
        </div>
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:"0.5px solid var(--b)"}}>
              {["ID","Customer","Product","Qty","Amount","Channel","Status","Date","Action"].map(h=>(<th key={h} style={{padding:"11px 13px",textAlign:"left",fontSize:10,color:"var(--txt2)",textTransform:"uppercase",letterSpacing:".1em",fontWeight:500,whiteSpace:"nowrap"}}>{h}</th>))}
            </tr></thead>
            <tbody>
              {filtered.map((o,i)=>(<tr key={o.id} style={{borderBottom:"0.5px solid var(--b)",background:i%2===0?"transparent":"#ffffff05"}}>
                <td style={{padding:"10px 13px",fontSize:12,color:"var(--p)",fontWeight:500}}>{o.id}</td>
                <td style={{padding:"10px 13px",fontSize:13}}>{o.customer}</td>
                <td style={{padding:"10px 13px",fontSize:12,color:"var(--txt2)",maxWidth:140}}><div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.product}</div></td>
                <td style={{padding:"10px 13px",fontSize:13,textAlign:"center"}}>{o.qty}</td>
                <td style={{padding:"10px 13px",fontSize:13,color:"var(--pl)",fontWeight:500}}>{cs}{Number(o.price||0).toLocaleString()}</td>
                <td style={{padding:"10px 13px"}}><Badge t="gray">{o.channel}</Badge></td>
                <td style={{padding:"10px 13px"}}><StatusBadge status={o.status}/></td>
                <td style={{padding:"10px 13px",fontSize:11,color:"var(--txt2)"}}>{o.date}</td>
                <td style={{padding:"10px 13px"}}><select value={o.status} onChange={e=>setOrders(p=>p.map(x=>x.id===o.id?{...x,status:e.target.value}:x))} style={{background:"var(--s1)",border:"0.5px solid var(--b)",borderRadius:6,padding:"3px 7px",color:"var(--txt)",fontSize:11,cursor:"pointer"}}>{["Pending","Confirmed","Picked","Dispatched","Delivered","Cancelled"].map(s=><option key={s} value={s}>{s}</option>)}</select></td>
              </tr>))}
              {filtered.length===0&&<tr><td colSpan={9} style={{padding:"2rem",textAlign:"center",color:"var(--txt2)",fontSize:13}}>No orders found</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
      <Modal open={modal} onClose={()=>setModal(false)} title="New Order">
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          <Inp label="Customer Name" value={form.customer} onChange={v=>setForm(p=>({...p,customer:v}))} placeholder="Customer ka naam"/>
          <Inp label="Product / Service" value={form.product} onChange={v=>setForm(p=>({...p,product:v}))} placeholder="Product naam"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Inp label="Quantity" value={form.qty} onChange={v=>setForm(p=>({...p,qty:v}))} type="number"/><Inp label={`Price (${brand.currency})`} value={form.price} onChange={v=>setForm(p=>({...p,price:v}))} type="number"/></div>
          <Inp label="Phone" value={form.phone} onChange={v=>setForm(p=>({...p,phone:v}))} placeholder="+923XXXXXXXXX"/>
          <Sel label="Channel" value={form.channel} onChange={v=>setForm(p=>({...p,channel:v}))} options={["Walk-in","WhatsApp","Instagram","Facebook","Website","Phone","Online"]}/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:6}}><Btn v="ghost" onClick={()=>setModal(false)}>Cancel</Btn><Btn onClick={add} disabled={!form.customer||!form.product}>Add Order</Btn></div>
        </div>
      </Modal>
    </div>
  );
};

// ── INVENTORY ─────────────────────────────────────────────────
const InventoryModule=({brand,products,setProducts})=>{
  const[search,setSearch]=useState("");
  const[cf,setCf]=useState("All");
  const[modal,setModal]=useState(false);
  const[edit,setEdit]=useState(null);
  const[form,setForm]=useState({name:"",sku:"",category:"",price:"",cost:"",stock:"",minStock:"3",image:"📦"});
  const cs=brand.currencySymbol;
  const preset=CATEGORY_PRESETS[brand.category];
  const cats=["All",...new Set(products.map(p=>p.category))];
  const filtered=products.filter(p=>(cf==="All"||p.category===cf)&&(p.name||"").toLowerCase().includes(search.toLowerCase()));
  const save=()=>{
    const p={...form,price:Number(form.price),cost:Number(form.cost),stock:Number(form.stock),minStock:Number(form.minStock)};
    if(edit)setProducts(prev=>prev.map(x=>x.id===edit.id?{...x,...p}:x));
    else setProducts(prev=>[...prev,{...p,id:`PRD-${String(prev.length+1).padStart(3,"0")}`}]);
    setModal(false);setEdit(null);setForm({name:"",sku:"",category:"",price:"",cost:"",stock:"",minStock:"3",image:"📦"});
  };
  const openEdit=p=>{setEdit(p);setForm({name:p.name,sku:p.sku,category:p.category,price:String(p.price),cost:String(p.cost),stock:String(p.stock),minStock:String(p.minStock),image:p.image});setModal(true);};
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}} className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24}}>Inventory & Stock</h2>
        <Btn onClick={()=>{setEdit(null);setForm({name:"",sku:"",category:"",price:"",cost:"",stock:"",minStock:"3",image:"📦"});setModal(true);}}><Icon d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14}/> Add {preset?.productLabel||"Product"}</Btn>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
        <KPI label="Total SKUs" value={products.length} color="var(--p)"/>
        <KPI label="Stock Value" value={`${cs}${(products.reduce((a,b)=>a+b.price*(b.stock===999?10:b.stock),0)/1000).toFixed(0)}K`} color="var(--pl)"/>
        <KPI label="Low Stock" value={products.filter(p=>p.stock<=p.minStock&&p.stock!==999&&p.stock>0).length} color="var(--warn)"/>
        <KPI label="Out of Stock" value={products.filter(p=>p.stock===0).length} color="var(--err)"/>
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{flex:1,minWidth:200,background:"var(--s1)",border:"0.5px solid var(--b)",borderRadius:8,padding:"8px 13px",color:"var(--txt)",fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:"none"}}/>
        {cats.map(c=>(<button key={c} onClick={()=>setCf(c)} style={{padding:"6px 11px",borderRadius:20,border:`0.5px solid ${cf===c?"var(--p)":"var(--b)"}`,background:cf===c?"var(--pa)":"transparent",color:cf===c?"var(--p)":"var(--txt2)",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{c}</button>))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(225px,1fr))",gap:12}}>
        {filtered.map(p=>{
          const mg=p.cost>0?((p.price-p.cost)/p.price*100).toFixed(0):"—";
          const st=p.stock===999?"green":p.stock===0?"red":p.stock<=p.minStock?"yellow":"green";
          return(<Card key={p.id} hover onClick={()=>openEdit(p)}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:30}}>{p.image}</span><Badge t={st}>{p.stock===999?"Unlimited":p.stock===0?"Out of Stock":p.stock<=p.minStock?"Low Stock":"In Stock"}</Badge></div>
            <div style={{fontWeight:500,fontSize:13,marginBottom:3,lineHeight:1.3}}>{p.name}</div>
            <div style={{fontSize:11,color:"var(--txt2)",marginBottom:10}}>{p.sku} · {p.category}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,borderTop:"0.5px solid var(--b)",paddingTop:10}}>
              <div><div style={{fontSize:10,color:"var(--txt2)"}}>PRICE</div><div style={{fontSize:12,fontWeight:500,color:"var(--p)"}}>{cs}{(p.price/1000).toFixed(1)}K</div></div>
              <div><div style={{fontSize:10,color:"var(--txt2)"}}>STOCK</div><div style={{fontSize:12,fontWeight:500,color:`var(--${st==="green"?"ok":st==="red"?"err":"warn"})`}}>{p.stock===999?"∞":p.stock}</div></div>
              <div><div style={{fontSize:10,color:"var(--txt2)"}}>MARGIN</div><div style={{fontSize:12,fontWeight:500,color:"var(--ok)"}}>{mg}%</div></div>
            </div>
          </Card>);
        })}
      </div>
      <Modal open={modal} onClose={()=>setModal(false)} title={edit?`Edit ${preset?.productLabel}`:`Add ${preset?.productLabel}`}>
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          <Inp label="Name" value={form.name} onChange={v=>setForm(p=>({...p,name:v}))}/>
          <Inp label="SKU" value={form.sku} onChange={v=>setForm(p=>({...p,sku:v}))}/>
          <Inp label="Category" value={form.category} onChange={v=>setForm(p=>({...p,category:v}))}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Inp label={`Sale Price (${brand.currency})`} value={form.price} onChange={v=>setForm(p=>({...p,price:v}))} type="number"/><Inp label={`Cost Price (${brand.currency})`} value={form.cost} onChange={v=>setForm(p=>({...p,cost:v}))} type="number"/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}><Inp label="Stock" value={form.stock} onChange={v=>setForm(p=>({...p,stock:v}))} type="number"/><Inp label="Min Stock" value={form.minStock} onChange={v=>setForm(p=>({...p,minStock:v}))} type="number"/><Inp label="Emoji Icon" value={form.image} onChange={v=>setForm(p=>({...p,image:v}))} placeholder="📦"/></div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><Btn v="ghost" onClick={()=>setModal(false)}>Cancel</Btn><Btn onClick={save} disabled={!form.name}>{edit?"Save Changes":"Add Product"}</Btn></div>
        </div>
      </Modal>
    </div>
  );
};

// ── LOYALTY ───────────────────────────────────────────────────
const LoyaltyModule=({brand,customers,setCustomers})=>{
  const TIERS=[{name:"Bronze",min:0,max:499,color:"#CD7F32",perks:"5% discount · Priority support"},{name:"Silver",min:500,max:1499,color:"#C0C0C0",perks:"8% discount · Free delivery · Early access"},{name:"Gold",min:1500,max:2999,color:"var(--p)",perks:"12% discount · VIP support · Exclusive deals"},{name:"Platinum",min:3000,max:999999,color:"#E8E8E8",perks:"15% discount · Dedicated manager · Gifts"}];
  const getTier=pts=>TIERS.find(t=>pts>=t.min&&pts<=t.max)||TIERS[0];
  const[modal,setModal]=useState(false);
  const[sel,setSel]=useState(null);
  const[pts,setPts]=useState("");
  const[addForm,setAddForm]=useState({name:"",phone:""});
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}} className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24}}>Loyalty Program</h2>
        <Btn v="secondary" onClick={()=>{setSel(null);setModal("add");}}><Icon d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14}/> Add Customer</Btn>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        {TIERS.map(t=>(<Card key={t.name} style={{textAlign:"center",border:`0.5px solid ${t.color}33`}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,color:t.color,marginBottom:4}}>{t.name}</div><div style={{fontSize:11,color:"var(--txt2)",marginBottom:6}}>{t.min}+ pts</div><div style={{fontSize:18,fontWeight:600,color:t.color}}>{customers.filter(c=>getTier(c.points).name===t.name).length}</div><div style={{fontSize:10,color:"var(--txt2)",marginTop:2}}>members</div></Card>))}
      </div>
      {customers.map(c=>{
        const tier=getTier(c.points);
        const next=TIERS[TIERS.indexOf(tier)+1];
        const prog=next?Math.min((c.points-tier.min)/(next.min-tier.min)*100,100):100;
        return(<Card key={c.id}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:12,alignItems:"center"}}><div style={{width:44,height:44,borderRadius:"50%",background:`${tier.color}22`,border:`1px solid ${tier.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:600,color:tier.color}}>{c.name?.[0]}</div><div><div style={{fontWeight:500,marginBottom:2}}>{c.name}</div><div style={{fontSize:12,color:"var(--txt2)"}}>{c.phone} · {c.totalOrders||0} orders</div></div></div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}><div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:600,color:tier.color,fontFamily:"'Cormorant Garamond',serif"}}>{c.points} pts</div><span style={{fontSize:10,color:tier.color,border:`0.5px solid ${tier.color}44`,padding:"1px 8px",borderRadius:10}}>{tier.name}</span></div><Btn sz="sm" onClick={()=>{setSel(c);setPts("");setModal("points");}}><Icon d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={12}/> Points</Btn></div>
          </div>
          {next&&(<div style={{marginTop:12}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--txt2)",marginBottom:4}}><span>Progress to {next.name}</span><span>{next.min-c.points} pts needed</span></div><div style={{background:"var(--s1)",borderRadius:4,height:4}}><div style={{width:`${prog}%`,height:"100%",background:tier.color,borderRadius:4,transition:"width .8s"}}/></div></div>)}
        </Card>);
      })}
      <Modal open={modal==="points"} onClose={()=>setModal(false)} title={`Add Points — ${sel?.name}`}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{textAlign:"center",padding:"1rem",background:"var(--s1)",borderRadius:10}}><div style={{fontSize:36,fontWeight:600,color:"var(--p)",fontFamily:"'Cormorant Garamond',serif"}}>{sel?.points}</div><div style={{fontSize:12,color:"var(--txt2)"}}>Current Points · {getTier(sel?.points||0).name}</div></div>
          <Inp label="Points to Add" value={pts} onChange={setPts} type="number" placeholder="Enter points amount"/>
          <Btn fw onClick={()=>{setCustomers(p=>p.map(c=>c.id===sel?.id?{...c,points:c.points+Number(pts)}:c));setModal(false);}}>Add Points</Btn>
        </div>
      </Modal>
      <Modal open={modal==="add"} onClose={()=>setModal(false)} title="Add Customer">
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Inp label="Customer Name" value={addForm.name} onChange={v=>setAddForm(p=>({...p,name:v}))}/>
          <Inp label="Phone" value={addForm.phone} onChange={v=>setAddForm(p=>({...p,phone:v}))} placeholder="+923XXXXXXXXX"/>
          <Btn fw onClick={()=>{setCustomers(p=>[...p,{id:`C${String(p.length+1).padStart(3,"0")}`,...addForm,points:0,totalOrders:0,tier:"Bronze"}]);setModal(false);setAddForm({name:"",phone:""});}}>Add Customer</Btn>
        </div>
      </Modal>
    </div>
  );
};

// ── TEAM & HR ─────────────────────────────────────────────────
const TeamHRModule=({brand,team,setTeam})=>{
  const[modal,setModal]=useState(false);
  const[form,setForm]=useState({name:"",role:brand.roles?.[0]||"Staff",phone:"",email:"",salary:"",joinDate:new Date().toISOString().split("T")[0],status:"Active"});
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}} className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24}}>Team & HR</h2>
        <Btn onClick={()=>setModal(true)}><Icon d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14}/> Add Member</Btn>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10}}>
        <KPI label="Total Staff" value={team.length} color="var(--p)" icon={MICONS["Team & HR"]}/>
        <KPI label="Active" value={team.filter(t=>t.status==="Active").length} color="var(--ok)"/>
        <KPI label="Monthly Payroll" value={`${brand.currencySymbol}${(team.reduce((a,b)=>a+Number(b.salary||0),0)/1000).toFixed(0)}K`} color="var(--warn)"/>
        <KPI label="Roles" value={[...new Set(team.map(t=>t.role))].length} color="var(--inf)"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(275px,1fr))",gap:12}}>
        {team.map(m=>(<Card key={m.id}>
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:44,height:44,borderRadius:"50%",background:"var(--pa)",border:"1px solid var(--pa2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:600,color:"var(--p)",flexShrink:0}}>{(m.name||"").split(" ").map(w=>w[0]).slice(0,2).join("")}</div>
            <div style={{flex:1}}><div style={{fontWeight:500,marginBottom:4}}>{m.name}</div><Badge t="gold">{m.role}</Badge></div>
            <StatusBadge status={m.status}/>
          </div>
          <div style={{marginTop:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            {m.phone&&<div style={{fontSize:12,color:"var(--txt2)"}}>📞 {m.phone}</div>}
            <div style={{fontSize:12,color:"var(--txt2)"}}>🗓 {m.joinDate}</div>
            {Number(m.salary)>0&&<div style={{fontSize:12,color:"var(--p)"}}>{brand.currencySymbol}{Number(m.salary).toLocaleString()}/mo</div>}
            {m.email&&<div style={{fontSize:12,color:"var(--txt2)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.email}</div>}
          </div>
        </Card>))}
      </div>
      <Modal open={modal} onClose={()=>setModal(false)} title="Add Team Member">
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          <Inp label="Full Name" value={form.name} onChange={v=>setForm(p=>({...p,name:v}))}/>
          <Sel label="Role" value={form.role} onChange={v=>setForm(p=>({...p,role:v}))} options={brand.roles||ALL_ROLES_POOL}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Inp label="Phone" value={form.phone} onChange={v=>setForm(p=>({...p,phone:v}))}/><Inp label={`Salary (${brand.currency})`} value={form.salary} onChange={v=>setForm(p=>({...p,salary:v}))} type="number"/></div>
          <Inp label="Email" value={form.email} onChange={v=>setForm(p=>({...p,email:v}))}/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><Btn v="ghost" onClick={()=>setModal(false)}>Cancel</Btn><Btn onClick={()=>{setTeam(p=>[...p,{...form,id:`T${String(p.length+1).padStart(3,"0")}`,salary:Number(form.salary)}]);setModal(false);setForm({name:"",role:brand.roles?.[0]||"Staff",phone:"",email:"",salary:"",joinDate:new Date().toISOString().split("T")[0],status:"Active"});}} disabled={!form.name}>Add Member</Btn></div>
        </div>
      </Modal>
    </div>
  );
};

// ── ANALYTICS ─────────────────────────────────────────────────
const AnalyticsModule=({brand,orders,products})=>{
  const cs=brand.currencySymbol;
  const totalRev=orders.reduce((a,b)=>a+Number(b.price||0),0);
  const delivRev=orders.filter(o=>o.status==="Delivered"||o.status==="Completed").reduce((a,b)=>a+Number(b.price||0),0);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}} className="fade-in">
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24}}>Analytics & Reports</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
        <KPI label="Total Revenue" value={`${cs}${(totalRev/1000).toFixed(1)}K`} sub="All orders" color="var(--p)"/>
        <KPI label="Delivered Rev" value={`${cs}${(delivRev/1000).toFixed(1)}K`} sub="Completed" color="var(--ok)"/>
        <KPI label="Total Orders" value={orders.length} sub="All time" color="var(--inf)"/>
        <KPI label="Avg Order" value={`${cs}${orders.length?(totalRev/orders.length/1000).toFixed(1):0}K`} sub="Per order" color="var(--warn)"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,marginBottom:14}}>Orders by Status</div>
          {["Pending","Confirmed","Dispatched","Delivered","Cancelled"].map(s=>{
            const cnt=orders.filter(o=>o.status===s).length;
            const pct=orders.length?(cnt/orders.length*100):0;
            const col={Pending:"var(--warn)",Confirmed:"var(--inf)",Dispatched:"var(--p)",Delivered:"var(--ok)",Cancelled:"var(--err)"}[s];
            return(<div key={s} style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span>{s}</span><span style={{color:col}}>{cnt}</span></div><div style={{background:"var(--s1)",borderRadius:4,height:6}}><div style={{width:`${pct}%`,height:"100%",background:col,borderRadius:4,transition:"width 1s"}}/></div></div>);
          })}
        </Card>
        <Card>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,marginBottom:14}}>Revenue by Channel</div>
          {["Walk-in","WhatsApp","Instagram","Website","Online","Phone"].map(ch=>{
            const rev=orders.filter(o=>o.channel===ch).reduce((a,b)=>a+Number(b.price||0),0);
            const pct=totalRev?(rev/totalRev*100):0;
            return rev>0?(<div key={ch} style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}><span>{ch}</span><span style={{color:"var(--p)"}}>{cs}{(rev/1000).toFixed(1)}K</span></div><div style={{background:"var(--s1)",borderRadius:4,height:6}}><div style={{width:`${pct}%`,height:"100%",background:"var(--p)",borderRadius:4}}/></div></div>):null;
          })}
        </Card>
      </div>
      <Card>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,marginBottom:14}}>Product Margin Analysis</div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{borderBottom:"0.5px solid var(--b)"}}>{["Product","Category","Price","Cost","Margin","Stock"].map(h=>(<th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:10,color:"var(--txt2)",textTransform:"uppercase",letterSpacing:".08em",fontWeight:500}}>{h}</th>))}</tr></thead>
            <tbody>
              {[...products].sort((a,b)=>((b.price-b.cost)/b.price)-((a.price-a.cost)/a.price)).slice(0,8).map(p=>{
                const mg=p.cost>0?((p.price-p.cost)/p.price*100).toFixed(0):"—";
                return(<tr key={p.id} style={{borderBottom:"0.5px solid var(--b)"}}><td style={{padding:"9px 12px"}}><div style={{display:"flex",gap:8,alignItems:"center"}}><span>{p.image}</span><span style={{fontSize:13}}>{(p.name||"").slice(0,22)}</span></div></td><td style={{padding:"9px 12px",fontSize:12,color:"var(--txt2)"}}>{p.category}</td><td style={{padding:"9px 12px",fontSize:13,color:"var(--p)"}}>{cs}{Number(p.price).toLocaleString()}</td><td style={{padding:"9px 12px",fontSize:13,color:"var(--txt2)"}}>{cs}{Number(p.cost).toLocaleString()}</td><td style={{padding:"9px 12px"}}><Badge t={Number(mg)>20?"green":Number(mg)>10?"yellow":"gray"}>{mg}%</Badge></td><td style={{padding:"9px 12px"}}><Badge t={p.stock===0?"red":p.stock<=p.minStock?"yellow":"green"}>{p.stock===999?"∞":p.stock}</Badge></td></tr>);
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ── AI MODULE ─────────────────────────────────────────────────
const AIModule=({brand,type})=>{
  const preset=CATEGORY_PRESETS[brand.category];
  const configs={
    "Marketing AI":{icon:MICONS["Marketing AI"],system:`You are an expert Marketing AI for ${brand.brandName}, a ${preset?.label||"business"} brand${brand.city?` in ${brand.city}`:""}. ${brand.tagline?`Tagline: "${brand.tagline}".`:""} Help with marketing campaigns, social media content, ad copies, promotions, influencer strategies. Currency: ${brand.currency}. Be creative and actionable. Mix Urdu/English naturally.`,placeholder:"Marketing strategies, content ideas, ad copies poochein...",quickPrompts:[`${brand.brandName} ka Instagram caption`,`Eid sale plan banao`,`${preset?.productLabel||"Product"} ke liye ad copy`,"Social media content calendar"]},
    "Sales AI":{icon:MICONS["Sales AI"],system:`You are a Sales AI for ${brand.brandName}, a ${preset?.label||"business"}${brand.city?` in ${brand.city}`:""}. Help with sales scripts, objection handling, upselling, closing techniques. Currency: ${brand.currency}. Be practical and actionable.`,placeholder:"Sales scripts, objection handling, upselling tips...",quickPrompts:["Price objection handle karo",`${preset?.productLabel||"product"} upsell kaise karein`,"Follow-up message template","B2B pitch script"]},
    "Strategy AI":{icon:MICONS["Strategy AI"],system:`You are a CEO-level Strategy AI for ${brand.brandName}, a ${preset?.label||"business"}${brand.city?` in ${brand.city}`:""}. Help with business strategy, market analysis, expansion, pricing, competitor analysis. Currency: ${brand.currency}. Think like a senior business consultant.`,placeholder:"Business strategy, market analysis, expansion plans...",quickPrompts:[`${brand.brandName} ki 6-month growth plan`,"Market expansion strategy","Pricing strategy optimize karo","Competitor analysis framework"]},
    "Customer Service AI":{icon:MICONS["Customer Service AI"],system:`You are a Customer Service AI for ${brand.brandName}. Help draft professional customer responses, handle complaints, write follow-up messages. Be empathetic and solution-focused. Mix Urdu/English naturally.`,placeholder:"Customer responses, complaint handling, service scripts...",quickPrompts:["Complaint response likh do","Refund request handle karo","Follow-up message banao","5-star review request"]},
  };
  const conf=configs[type];
  if(!conf)return null;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}} className="fade-in">
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:44,height:44,borderRadius:10,background:"var(--pa)",border:"0.5px solid var(--pa2)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--p)"}}><Icon d={conf.icon} size={20}/></div>
        <div><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:400}}>{type}</h2><p style={{fontSize:12,color:"var(--txt2)"}}>Powered by Claude AI · {brand.brandName} specialized</p></div>
      </div>
      <Card style={{padding:0,overflow:"hidden"}}><AIChat systemPrompt={conf.system} placeholder={conf.placeholder} quickPrompts={conf.quickPrompts}/></Card>
    </div>
  );
};

// ── WHATSAPP ──────────────────────────────────────────────────
const WhatsAppModule=({brand,team,orders})=>{
  const bn=brand.brandName;
  const templates=[
    {name:"Order Confirmation",msg:`Assalam o Alaikum! 🌟\nAapka order confirm ho gaya hai.\nOrder ID: {ORDER_ID}\nProduct: {PRODUCT}\nAmount: ${brand.currencySymbol}{AMOUNT}\n\nShukriya ${bn} se khareedaree karne ka! ✨`},
    {name:"Dispatch Alert",msg:`📦 Aapka order dispatch ho chuka hai!\nOrder ID: {ORDER_ID}\nDelivery: 1-2 business days\n\n${bn} — Aapki service mein hamesha haazir 🚀`},
    {name:"Loyalty Update",msg:`🌟 Congratulations!\nAapke account mein {POINTS} points add ho gaye!\nCurrent Status: {TIER}\n\n${bn} Rewards Program 💎`},
    {name:"Payment Reminder",msg:`Assalam o Alaikum,\nOrder {ORDER_ID} ki payment baqi hai.\nAmount: ${brand.currencySymbol}{AMOUNT}\n\nKripya jaldi complete karein.\nShukriya, ${bn} 🙏`},
    {name:"Welcome",msg:`Assalam o Alaikum aur ${bn} mein khushamdeed! 🎉\n\nHum aapki khadmat ke liye hamesha tayyar hain.\n\n${brand.tagline||"Aapki satisfaction hamaari zimmedari"} ✨`},
    {name:"Low Stock Alert",msg:`⚡ Limited Stock!\n{PRODUCT} sirf {STOCK} pieces baqi hai!\n\nAbhi order karein.\n${bn} 📲`},
  ];
  const[sel,setSel]=useState(templates[0]);
  const[msg,setMsg]=useState(templates[0].msg);
  const[phone,setPhone]=useState(brand.whatsapp||"");
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}} className="fade-in">
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24}}>WhatsApp Business</h2>
      <div style={{display:"grid",gridTemplateColumns:"200px 1fr",gap:16}}>
        <div>
          <div style={{fontSize:11,color:"var(--txt2)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>Templates</div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {templates.map(t=>(<Card key={t.name} onClick={()=>{setSel(t);setMsg(t.msg);}} hover style={{cursor:"pointer",border:`0.5px solid ${sel.name===t.name?"var(--p)":"var(--b)"}`,background:sel.name===t.name?"var(--pa)":"var(--s2)",padding:".875rem"}}><div style={{fontSize:12,fontWeight:500,color:sel.name===t.name?"var(--p)":"var(--txt)"}}>{t.name}</div></Card>))}
          </div>
        </div>
        <Card>
          <div style={{fontSize:11,color:"var(--txt2)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:12}}>Compose</div>
          <textarea value={msg} onChange={e=>setMsg(e.target.value)} style={{width:"100%",height:170,background:"var(--s1)",border:"0.5px solid var(--b)",borderRadius:8,padding:12,color:"var(--txt)",fontFamily:"'DM Sans',sans-serif",fontSize:13,resize:"vertical",outline:"none",lineHeight:1.6}}/>
          <div style={{display:"flex",gap:10,marginTop:12,alignItems:"flex-end"}}>
            <Inp label="Phone Number" value={phone} onChange={setPhone} placeholder="+923XXXXXXXXX" style={{flex:1}}/>
            <a href={`https://wa.me/${phone.replace(/\D/g,"")}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noreferrer"><Btn><Icon d={MICONS["WhatsApp"]} size={14}/> Send</Btn></a>
          </div>
          {team.length>0&&(<div style={{marginTop:14}}><div style={{fontSize:11,color:"var(--txt2)",marginBottom:8,textTransform:"uppercase",letterSpacing:".08em"}}>Quick Send</div><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{team.slice(0,5).map(m=>(<a key={m.id} href={`https://wa.me/${(m.phone||"").replace(/\D/g,"")}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noreferrer"><Btn v="ghost" sz="sm">{(m.name||"").split(" ")[0]}</Btn></a>))}</div></div>)}
        </Card>
      </div>
    </div>
  );
};

// ── CONTENT CALENDAR ──────────────────────────────────────────
const ContentCalendar=({brand})=>{
  const[posts,setPosts]=useState([{id:1,platform:"Instagram",type:"Product Post",date:"2026-03-15",status:"Scheduled"},{id:2,platform:"TikTok",type:"Reel",date:"2026-03-17",status:"Draft"},{id:3,platform:"Facebook",type:"Promotion",date:"2026-03-20",status:"Scheduled"},{id:4,platform:"WhatsApp",type:"Broadcast",date:"2026-03-22",status:"Draft"}]);
  const[modal,setModal]=useState(false);
  const[form,setForm]=useState({platform:"Instagram",type:"Product Post",date:"",status:"Draft"});
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}} className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24}}>Content Calendar</h2><Btn onClick={()=>setModal(true)}><Icon d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14}/> Add Post</Btn></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10}}>
        {["Instagram","TikTok","Facebook","WhatsApp"].map(p=>(<KPI key={p} label={p} value={posts.filter(x=>x.platform===p).length} color="var(--p)"/>))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {posts.map(p=>(<Card key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}><div style={{display:"flex",gap:12,alignItems:"center"}}><div style={{width:40,height:40,borderRadius:8,background:"var(--pa)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{{Instagram:"📸",TikTok:"🎵",Facebook:"📘",WhatsApp:"💬"}[p.platform]||"📱"}</div><div><div style={{fontWeight:500,fontSize:13}}>{p.type} · {p.platform}</div><div style={{fontSize:12,color:"var(--txt2)"}}>📅 {p.date}</div></div></div><StatusBadge status={p.status}/></Card>))}
      </div>
      <Modal open={modal} onClose={()=>setModal(false)} title="Add Content Post">
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          <Sel label="Platform" value={form.platform} onChange={v=>setForm(p=>({...p,platform:v}))} options={["Instagram","TikTok","YouTube","Facebook","WhatsApp","Twitter"]}/>
          <Sel label="Post Type" value={form.type} onChange={v=>setForm(p=>({...p,type:v}))} options={["Product Post","Reel","Story","Promotion","Behind the Scenes","Broadcast","Blog"]}/>
          <Inp label="Scheduled Date" value={form.date} onChange={v=>setForm(p=>({...p,date:v}))} type="date"/>
          <Sel label="Status" value={form.status} onChange={v=>setForm(p=>({...p,status:v}))} options={["Draft","Scheduled","Published"]}/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><Btn v="ghost" onClick={()=>setModal(false)}>Cancel</Btn><Btn onClick={()=>{setPosts(p=>[...p,{...form,id:p.length+1}]);setModal(false);}}>Add Post</Btn></div>
        </div>
      </Modal>
    </div>
  );
};

// ── EXPENSE TRACKER ───────────────────────────────────────────
const ExpenseTracker=({brand})=>{
  const cs=brand.currencySymbol;
  const[expenses,setExpenses]=useState([{id:1,category:"Rent",amount:80000,date:"2026-03-01",note:"Monthly rent"},{id:2,category:"Salary",amount:350000,date:"2026-03-01",note:"Team salaries"},{id:3,category:"Marketing",amount:25000,date:"2026-03-05",note:"Social media ads"},{id:4,category:"Utilities",amount:12000,date:"2026-03-08",note:"Electricity & internet"},{id:5,category:"Packaging",amount:18000,date:"2026-03-10",note:"Boxes and bags"}]);
  const[modal,setModal]=useState(false);
  const[form,setForm]=useState({category:"",amount:"",date:"",note:""});
  const total=expenses.reduce((a,b)=>a+Number(b.amount),0);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}} className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24}}>Expense Tracker</h2><Btn onClick={()=>setModal(true)}><Icon d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14}/> Add Expense</Btn></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:10}}>
        <KPI label="Total Expenses" value={`${cs}${(total/1000).toFixed(0)}K`} sub="This month" color="var(--err)"/>
        <KPI label="Categories" value={[...new Set(expenses.map(e=>e.category))].length} color="var(--p)"/>
        <KPI label="Transactions" value={expenses.length} color="var(--inf)"/>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {expenses.map(e=>(<Card key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}><div><div style={{fontWeight:500,fontSize:14}}>{e.category}</div><div style={{fontSize:12,color:"var(--txt2)"}}>{e.note} · {e.date}</div></div><div style={{fontSize:18,fontWeight:600,color:"var(--err)",fontFamily:"'Cormorant Garamond',serif"}}>{cs}{Number(e.amount).toLocaleString()}</div></Card>))}
      </div>
      <Modal open={modal} onClose={()=>setModal(false)} title="Add Expense">
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          <Inp label="Category" value={form.category} onChange={v=>setForm(p=>({...p,category:v}))} placeholder="Rent, Salary, Marketing..."/>
          <Inp label={`Amount (${brand.currency})`} value={form.amount} onChange={v=>setForm(p=>({...p,amount:v}))} type="number"/>
          <Inp label="Date" value={form.date} onChange={v=>setForm(p=>({...p,date:v}))} type="date"/>
          <Inp label="Note" value={form.note} onChange={v=>setForm(p=>({...p,note:v}))} placeholder="Brief description"/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><Btn v="ghost" onClick={()=>setModal(false)}>Cancel</Btn><Btn onClick={()=>{setExpenses(p=>[...p,{...form,id:p.length+1,amount:Number(form.amount)}]);setModal(false);setForm({category:"",amount:"",date:"",note:""});}}>Add Expense</Btn></div>
        </div>
      </Modal>
    </div>
  );
};

// ── DISPATCH ──────────────────────────────────────────────────
const DispatchModule=({brand,orders,setOrders})=>{
  const cs=brand.currencySymbol;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}} className="fade-in">
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24}}>Dispatch & Delivery</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:10}}>
        <KPI label="Ready to Ship" value={orders.filter(o=>o.status==="Confirmed").length} color="var(--inf)"/>
        <KPI label="In Transit" value={orders.filter(o=>o.status==="Dispatched").length} color="var(--p)"/>
        <KPI label="Delivered" value={orders.filter(o=>o.status==="Delivered").length} color="var(--ok)"/>
        <KPI label="Cancelled" value={orders.filter(o=>o.status==="Cancelled").length} color="var(--err)"/>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {orders.map(o=>(<Card key={o.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <div style={{minWidth:150}}><div style={{fontSize:13,fontWeight:500}}>{o.customer}</div><div style={{fontSize:11,color:"var(--txt2)"}}>{o.id} · {o.phone||"No phone"}</div></div>
          <div style={{flex:1,minWidth:150,fontSize:12,color:"var(--txt2)"}}>{(o.product||"").slice(0,40)}</div>
          <div style={{fontSize:13,color:"var(--p)",fontWeight:500}}>{cs}{Number(o.price||0).toLocaleString()}</div>
          <StatusBadge status={o.status}/>
          <div style={{display:"flex",gap:8}}>
            {o.status==="Confirmed"&&<Btn sz="sm" onClick={()=>setOrders(p=>p.map(x=>x.id===o.id?{...x,status:"Dispatched"}:x))}>Mark Dispatched</Btn>}
            {o.status==="Dispatched"&&<Btn sz="sm" v="secondary" onClick={()=>setOrders(p=>p.map(x=>x.id===o.id?{...x,status:"Delivered"}:x))}>Mark Delivered</Btn>}
            {o.phone&&(<a href={`https://wa.me/${o.phone.replace(/\D/g,"")}?text=Assalam o Alaikum! Aapka order ${o.id} dispatch ho chuka hai. Shukriya ${brand.brandName} se!`} target="_blank" rel="noreferrer"><Btn sz="sm" v="ghost"><Icon d={MICONS["WhatsApp"]} size={12}/> Notify</Btn></a>)}
          </div>
        </Card>))}
      </div>
    </div>
  );
};

// ── STOCK ALERTS ──────────────────────────────────────────────
const StockAlerts=({brand,products,setProducts})=>{
  const lowStock=products.filter(p=>p.stock<=p.minStock&&p.stock!==999);
  const outOfStock=products.filter(p=>p.stock===0);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}} className="fade-in">
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24}}>Stock Alerts</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10}}>
        <KPI label="Out of Stock" value={outOfStock.length} color="var(--err)"/>
        <KPI label="Low Stock" value={lowStock.filter(p=>p.stock>0).length} color="var(--warn)"/>
        <KPI label="Healthy" value={products.filter(p=>p.stock>p.minStock||p.stock===999).length} color="var(--ok)"/>
        <KPI label="Total SKUs" value={products.length} color="var(--p)"/>
      </div>
      {outOfStock.length>0&&(<div><div style={{fontSize:11,color:"var(--err)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>⚠ Out of Stock</div><div style={{display:"flex",flexDirection:"column",gap:8}}>{outOfStock.map(p=>(<Card key={p.id} style={{border:"0.5px solid #C0392B33",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}><div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:28}}>{p.image}</span><div><div style={{fontWeight:500}}>{p.name}</div><div style={{fontSize:11,color:"var(--txt2)"}}>{p.sku} · {p.category}</div></div></div><div style={{display:"flex",gap:10,alignItems:"center"}}><Badge t="red">Out of Stock</Badge><Btn sz="sm" onClick={()=>{const q=prompt("Restock quantity:");if(q)setProducts(prev=>prev.map(x=>x.id===p.id?{...x,stock:Number(q)}:x));}}>Restock</Btn></div></Card>))}</div></div>)}
      {lowStock.filter(p=>p.stock>0).length>0&&(<div><div style={{fontSize:11,color:"var(--warn)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:10}}>Low Stock Warning</div><div style={{display:"flex",flexDirection:"column",gap:8}}>{lowStock.filter(p=>p.stock>0).map(p=>(<Card key={p.id} style={{border:"0.5px solid #B7770D33",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}><div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:28}}>{p.image}</span><div><div style={{fontWeight:500}}>{p.name}</div><div style={{fontSize:11,color:"var(--txt2)"}}>{p.sku} · Min: {p.minStock}</div></div></div><div style={{display:"flex",gap:10,alignItems:"center"}}><Badge t="yellow">{p.stock} left</Badge><Btn sz="sm" onClick={()=>{const q=prompt("Add stock quantity:");if(q)setProducts(prev=>prev.map(x=>x.id===p.id?{...x,stock:x.stock+Number(q)}:x));}}>Add Stock</Btn></div></Card>))}</div></div>)}
      {lowStock.length===0&&<div style={{textAlign:"center",padding:"3rem",color:"var(--txt2)",fontSize:14}}>✓ All stocks are healthy</div>}
    </div>
  );
};

// ── LEAVE & ATTENDANCE ────────────────────────────────────────
const LeaveAttendance=({brand,team})=>{
  const[leaves,setLeaves]=useState([{id:1,member:"Team Member",type:"Sick Leave",from:"2026-03-12",to:"2026-03-13",status:"Approved"},{id:2,member:"Staff Member",type:"Annual Leave",from:"2026-03-18",to:"2026-03-22",status:"Pending"}]);
  const[modal,setModal]=useState(false);
  const[form,setForm]=useState({member:team[0]?.name||"",type:"Annual Leave",from:"",to:"",reason:""});
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}} className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24}}>Leave & Attendance</h2><Btn onClick={()=>setModal(true)}><Icon d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14}/> Request Leave</Btn></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:10}}>
        <KPI label="Total Staff" value={team.length} color="var(--p)"/>
        <KPI label="On Leave" value={leaves.filter(l=>l.status==="Approved").length} color="var(--warn)"/>
        <KPI label="Pending" value={leaves.filter(l=>l.status==="Pending").length} color="var(--inf)"/>
        <KPI label="Present" value={team.length-leaves.filter(l=>l.status==="Approved").length} color="var(--ok)"/>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {leaves.map(l=>(<Card key={l.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}><div><div style={{fontWeight:500,fontSize:14}}>{l.member}</div><div style={{fontSize:12,color:"var(--txt2)"}}>{l.type} · {l.from} → {l.to}</div></div><div style={{display:"flex",gap:10,alignItems:"center"}}><StatusBadge status={l.status}/>{l.status==="Pending"&&(<><Btn sz="sm" onClick={()=>setLeaves(p=>p.map(x=>x.id===l.id?{...x,status:"Approved"}:x))}><Icon d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" size={12}/> Approve</Btn><Btn sz="sm" v="danger" onClick={()=>setLeaves(p=>p.map(x=>x.id===l.id?{...x,status:"Rejected"}:x))}>Reject</Btn></>)}</div></Card>))}
      </div>
      <Modal open={modal} onClose={()=>setModal(false)} title="Leave Request">
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          <Sel label="Team Member" value={form.member} onChange={v=>setForm(p=>({...p,member:v}))} options={team.length?team.map(t=>t.name):["Staff Member"]}/>
          <Sel label="Leave Type" value={form.type} onChange={v=>setForm(p=>({...p,type:v}))} options={["Annual Leave","Sick Leave","Emergency Leave","Half Day","Work From Home"]}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Inp label="From Date" value={form.from} onChange={v=>setForm(p=>({...p,from:v}))} type="date"/><Inp label="To Date" value={form.to} onChange={v=>setForm(p=>({...p,to:v}))} type="date"/></div>
          <Inp label="Reason" value={form.reason} onChange={v=>setForm(p=>({...p,reason:v}))} placeholder="Brief reason"/>
          <Btn fw onClick={()=>{setLeaves(p=>[...p,{...form,id:p.length+1,status:"Pending"}]);setModal(false);}}>Submit Request</Btn>
        </div>
      </Modal>
    </div>
  );
};

// ── INFLUENCER ────────────────────────────────────────────────
const InfluencerModule=({brand})=>{
  const cs=brand.currencySymbol;
  const[influencers,setInfluencers]=useState([{id:1,name:"Sarah Khan",platform:"Instagram",followers:"245K",niche:"Lifestyle",status:"Active",collab:"Product Review",rate:"15000"},{id:2,name:"TikTok Ahmad",platform:"TikTok",followers:"1.2M",niche:"Comedy",status:"Pending",collab:"Brand Mention",rate:"25000"},{id:3,name:"Beauty by Sana",platform:"YouTube",followers:"89K",niche:"Beauty",status:"Active",collab:"Tutorial",rate:"20000"}]);
  const[modal,setModal]=useState(false);
  const[form,setForm]=useState({name:"",platform:"Instagram",followers:"",niche:"",status:"Pending",collab:"",rate:""});
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}} className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24}}>Influencer Tracker</h2><Btn onClick={()=>setModal(true)}><Icon d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" size={14}/> Add Influencer</Btn></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:10}}>
        <KPI label="Total" value={influencers.length} color="var(--p)"/>
        <KPI label="Active" value={influencers.filter(i=>i.status==="Active").length} color="var(--ok)"/>
        <KPI label="Investment" value={`${cs}${influencers.reduce((a,b)=>a+Number(b.rate||0),0).toLocaleString()}`} color="var(--warn)"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:12}}>
        {influencers.map(inf=>(<Card key={inf.id}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><div><div style={{fontWeight:500,fontSize:14}}>{inf.name}</div><div style={{fontSize:12,color:"var(--txt2)"}}>{inf.platform} · {inf.followers} followers</div></div><StatusBadge status={inf.status}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><div><div style={{fontSize:10,color:"var(--txt2)"}}>NICHE</div><div style={{fontSize:12}}>{inf.niche}</div></div><div><div style={{fontSize:10,color:"var(--txt2)"}}>COLLAB</div><div style={{fontSize:12}}>{inf.collab}</div></div><div><div style={{fontSize:10,color:"var(--txt2)"}}>RATE</div><div style={{fontSize:12,color:"var(--p)"}}>{cs}{Number(inf.rate).toLocaleString()}</div></div></div></Card>))}
      </div>
      <Modal open={modal} onClose={()=>setModal(false)} title="Add Influencer">
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          <Inp label="Name / Handle" value={form.name} onChange={v=>setForm(p=>({...p,name:v}))}/>
          <Sel label="Platform" value={form.platform} onChange={v=>setForm(p=>({...p,platform:v}))} options={["Instagram","TikTok","YouTube","Facebook","Twitter","Snapchat"]}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><Inp label="Followers" value={form.followers} onChange={v=>setForm(p=>({...p,followers:v}))} placeholder="e.g. 50K"/><Inp label="Niche" value={form.niche} onChange={v=>setForm(p=>({...p,niche:v}))} placeholder="Lifestyle, Beauty..."/></div>
          <Inp label="Collaboration Type" value={form.collab} onChange={v=>setForm(p=>({...p,collab:v}))} placeholder="Product Review, Brand Mention..."/>
          <Inp label={`Rate (${brand.currency})`} value={form.rate} onChange={v=>setForm(p=>({...p,rate:v}))} type="number"/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><Btn v="ghost" onClick={()=>setModal(false)}>Cancel</Btn><Btn onClick={()=>{setInfluencers(p=>[...p,{...form,id:p.length+1}]);setModal(false);}}>Add</Btn></div>
        </div>
      </Modal>
    </div>
  );
};

// ── ROLE PERMISSIONS ──────────────────────────────────────────
const getRolePerms=(role,modules)=>{
  const ownerR=["Owner/ACEO","CEO/Founder","Owner/Doctor"];
  const managerR=["Brand Manager","Store Manager","Manager"];
  if(ownerR.includes(role))return modules;
  if(managerR.includes(role))return modules.filter(m=>m!=="Strategy AI");
  if(role==="Finance")return["Dashboard","Analytics","Orders","Expense Tracker"].filter(m=>modules.includes(m));
  if(role==="HR")return["Dashboard","Team & HR","Leave & Attendance","Analytics"].filter(m=>modules.includes(m));
  if(role==="Marketing")return["Dashboard","Marketing AI","Content Calendar","Influencer","Analytics","WhatsApp"].filter(m=>modules.includes(m));
  if(role==="Inventory")return["Dashboard","Inventory","Stock Alerts","Orders"].filter(m=>modules.includes(m));
  if(["Logistics","Dispatch","Delivery"].includes(role))return["Dashboard","Dispatch","Orders","Inventory"].filter(m=>modules.includes(m));
  if(role==="Designer")return["Dashboard","Content Calendar","Marketing AI"].filter(m=>modules.includes(m));
  if(["Customer Service","Receptionist","Customer Success"].includes(role))return["Dashboard","Orders","Loyalty","WhatsApp","Customer Service AI","Appointments"].filter(m=>modules.includes(m));
  if(["Sales Lead","Captain/Waiter","Sales"].includes(role))return["Dashboard","Orders","Loyalty","Sales AI","WhatsApp","Analytics"].filter(m=>modules.includes(m));
  if(role==="Cashier")return["Dashboard","Orders","Loyalty"].filter(m=>modules.includes(m));
  return["Dashboard","Orders","Loyalty","WhatsApp"].filter(m=>modules.includes(m));
};

// ── LOGIN SCREEN ──────────────────────────────────────────────
const LoginScreen=({brand,onLogin})=>{
  const[role,setRole]=useState(brand.roles?.[0]||"Owner/ACEO");
  const[pin,setPin]=useState("");
  const[err,setErr]=useState("");
  const T=brand.theme;
  return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"'DM Sans',sans-serif"}}>
      <style>{makeStyles(T)}</style>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontSize:52,marginBottom:12}}>{CATEGORY_PRESETS[brand.category]?.icon||"◈"}</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:300,color:T.primary,letterSpacing:".04em",marginBottom:6}}>{brand.brandName}</h1>
          {brand.tagline&&<p style={{color:"#888878",fontSize:13}}>{brand.tagline}</p>}
          <p style={{color:"#4A4840",fontSize:10,marginTop:4,letterSpacing:".15em"}}>BRAND OS · {(CATEGORY_PRESETS[brand.category]?.label||"").toUpperCase()}</p>
        </div>
        <div style={{background:T.card,border:`0.5px solid ${T.border}`,borderRadius:16,padding:"2rem"}}>
          <div style={{marginBottom:16}}><Sel label="Your Role" value={role} onChange={setRole} options={brand.roles||ALL_ROLES_POOL}/></div>
          <div style={{marginBottom:16}}><Inp label="PIN / Password" value={pin} onChange={v=>{setPin(v);setErr("");}} type="password" placeholder="Enter PIN (min 4 digits)"/>{err&&<div style={{color:"#E74C3C",fontSize:12,marginTop:6}}>{err}</div>}</div>
          <Btn fw onClick={()=>{if(pin.length<4){setErr("PIN must be 4+ digits");return;}onLogin(role);}} sz="lg">Sign In</Btn>
          <div style={{textAlign:"center",marginTop:12,fontSize:11,color:"#4A4840"}}>Demo: any role · any PIN (4+ digits)</div>
        </div>
        <div style={{textAlign:"center",marginTop:20,fontSize:10,color:"#2A2820",letterSpacing:".15em"}}>POWERED BY OMNIBRAND · UNIVERSAL BRAND OS</div>
      </div>
    </div>
  );
};

// ── MAIN BRAND OS APP ─────────────────────────────────────────
const BrandOSApp=({brand,currentRole,onLogout,onReconfigure})=>{
  const T=brand.theme;
  const preset=CATEGORY_PRESETS[brand.category];
  const allowedMods=getRolePerms(currentRole,brand.modules);
  const[active,setActive]=useState(allowedMods[0]||"Dashboard");
  const[sideOpen,setSideOpen]=useState(true);
  const[mobSide,setMobSide]=useState(false);
  const[orders,setOrders]=useState(preset?.sampleProducts.length>0?[
    {id:"ORD-001",customer:"Sample Customer 1",product:preset?.sampleProducts[0]?.name||"Product",qty:1,price:preset?.sampleProducts[0]?.price||0,status:"Confirmed",channel:"WhatsApp",date:"2026-03-14",phone:"+923110000001"},
    {id:"ORD-002",customer:"Sample Customer 2",product:preset?.sampleProducts[1]?.name||"Product",qty:2,price:(preset?.sampleProducts[1]?.price||0)*2,status:"Delivered",channel:"Walk-in",date:"2026-03-13",phone:"+923110000002"},
    {id:"ORD-003",customer:"Sample Customer 3",product:preset?.sampleProducts[2]?.name||"Product",qty:1,price:preset?.sampleProducts[2]?.price||0,status:"Pending",channel:"Instagram",date:"2026-03-13",phone:"+923110000003"},
  ]:[]);
  const[products,setProducts]=useState(preset?.sampleProducts||[]);
  const[team,setTeam]=useState([{id:"T001",name:(brand.brandName||"").split(" ")[0]+" Owner",role:brand.roles?.[0]||"Owner/ACEO",phone:brand.whatsapp||"",email:"owner@brand.com",salary:0,joinDate:"2024-01-01",status:"Active"}]);
  const[customers,setCustomers]=useState([{id:"C001",name:"Ahmed Raza",phone:"+923111111111",points:1800,totalOrders:8,tier:"Gold"},{id:"C002",name:"Fatima Khan",phone:"+923122222222",points:3500,totalOrders:15,tier:"Platinum"},{id:"C003",name:"Usman Ali",phone:"+923133333333",points:350,totalOrders:3,tier:"Bronze"}]);

  const renderModule=()=>{
    const p={brand,orders,setOrders,products,setProducts,team,setTeam,customers,setCustomers};
    switch(active){
      case"Dashboard":return<Dashboard{...p}/>;
      case"Orders":return<OrdersModule{...p}/>;
      case"Inventory":return<InventoryModule{...p}/>;
      case"Dispatch":return<DispatchModule{...p}/>;
      case"Loyalty":return<LoyaltyModule{...p}/>;
      case"Analytics":return<AnalyticsModule{...p}/>;
      case"Team & HR":return<TeamHRModule{...p}/>;
      case"WhatsApp":return<WhatsAppModule{...p}/>;
      case"Content Calendar":return<ContentCalendar{...p}/>;
      case"Expense Tracker":return<ExpenseTracker{...p}/>;
      case"Leave & Attendance":return<LeaveAttendance{...p}/>;
      case"Stock Alerts":return<StockAlerts{...p}/>;
      case"Influencer":return<InfluencerModule{...p}/>;
      case"Marketing AI":return<AIModule brand={brand} type="Marketing AI"/>;
      case"Sales AI":return<AIModule brand={brand} type="Sales AI"/>;
      case"Strategy AI":return<AIModule brand={brand} type="Strategy AI"/>;
      case"Customer Service AI":return<AIModule brand={brand} type="Customer Service AI"/>;
      case"Appointments":return<OrdersModule{...p}/>;
      case"E-commerce":return<InventoryModule{...p}/>;
      default:return<Dashboard{...p}/>;
    }
  };

  const SideBar=({mob=false})=>(
    <div style={{width:mob?260:sideOpen?220:60,background:T.surface,borderRight:`0.5px solid ${T.border}`,display:"flex",flexDirection:"column",transition:mob?"none":"width .3s",height:"100vh",position:mob?"fixed":"sticky",top:0,left:0,zIndex:mob?200:10,flexShrink:0,overflow:"hidden"}}>
      <div style={{padding:"1rem",borderBottom:`0.5px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",minHeight:60}}>
        {(sideOpen||mob)&&<div style={{overflow:"hidden"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontWeight:600,color:T.primary,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{brand.brandName}</div><div style={{fontSize:10,color:"#4A4840",whiteSpace:"nowrap",letterSpacing:".08em"}}>{preset?.label}</div></div>}
        <button onClick={()=>mob?setMobSide(false):setSideOpen(p=>!p)} style={{background:"none",border:"none",color:"#888878",cursor:"pointer",padding:4,flexShrink:0,marginLeft:"auto"}}><Icon d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" size={18}/></button>
      </div>
      <div style={{flex:1,overflow:"auto",padding:"0.5rem"}}>
        {allowedMods.map(m=>(<button key={m} onClick={()=>{setActive(m);if(mob)setMobSide(false);}} style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"8px 10px",borderRadius:8,border:"none",background:active===m?`${T.primary}22`:"transparent",color:active===m?T.primary:"#888878",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:active===m?500:400,transition:"all .15s",textAlign:"left",whiteSpace:"nowrap",overflow:"hidden",marginBottom:1}}><span style={{flexShrink:0,color:active===m?T.primary:"#555550"}}><Icon d={MICONS[m]||MICONS["Dashboard"]} size={14}/></span>{(sideOpen||mob)&&<span style={{overflow:"hidden",textOverflow:"ellipsis"}}>{m}</span>}</button>))}
      </div>
      {(sideOpen||mob)&&(
        <div style={{padding:"0.75rem",borderTop:`0.5px solid ${T.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,padding:"6px 8px"}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:`${T.primary}22`,border:`1px solid ${T.primary}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,color:T.primary,flexShrink:0}}>{currentRole?.[0]}</div>
            <div style={{overflow:"hidden"}}><div style={{fontSize:11,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",color:"#EDE9E0"}}>{currentRole}</div><div style={{fontSize:10,color:"#4A4840"}}>{allowedMods.length} modules</div></div>
          </div>
          <button onClick={onReconfigure} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"7px 8px",background:"none",border:`0.5px solid ${T.border}`,borderRadius:7,color:"#888878",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:6}}><Icon d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" size={13}/> Reconfigure</button>
          <button onClick={onLogout} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:"7px 8px",background:"none",border:`0.5px solid ${T.border}`,borderRadius:7,color:"#888878",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}><Icon d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" size={13}/> Sign Out</button>
        </div>
      )}
    </div>
  );

  return(
    <div style={{display:"flex",minHeight:"100vh",background:T.bg}}>
      <style>{makeStyles(T)}</style>
      <SideBar/>
      {mobSide&&(<><div onClick={()=>setMobSide(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:199}}/><SideBar mob/></>)}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,overflow:"hidden"}}>
        <div style={{padding:"10px 18px",borderBottom:`0.5px solid ${T.border}`,background:T.surface,display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:100}}>
          <button onClick={()=>setMobSide(true)} style={{background:"none",border:"none",color:"#888878",cursor:"pointer"}}><Icon d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" size={18}/></button>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:400,flex:1}}>{active}</span>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:11,color:"#4A4840"}}>{new Date().toLocaleDateString("en-GB")}</span>
            <span style={{fontSize:11,padding:"3px 10px",borderRadius:12,background:`${T.primary}22`,color:T.primary,border:`0.5px solid ${T.primary}44`}}>{currentRole}</span>
            <button style={{background:"none",border:"none",color:"#888878",cursor:"pointer",position:"relative"}}><Icon d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" size={16}/><span style={{position:"absolute",top:-1,right:-1,width:6,height:6,background:T.primary,borderRadius:"50%"}}/></button>
          </div>
        </div>
        <div style={{flex:1,padding:"1.5rem",overflow:"auto"}}>{renderModule()}</div>
      </div>
    </div>
  );
};

// ── ROOT APP ──────────────────────────────────────────────────
export default function App(){
  const[phase,setPhase]=useState("wizard");
  const[brand,setBrand]=useState(null);
  const[currentRole,setCurrentRole]=useState(null);

  useEffect(()=>{
    try{const s=localStorage.getItem("omnibrand_cfg");if(s){setBrand(JSON.parse(s));setPhase("login");}}catch(e){}
  },[]);

  const handleComplete=useCallback((cfg)=>{
    setBrand(cfg);
    try{localStorage.setItem("omnibrand_cfg",JSON.stringify(cfg));}catch(e){}
    setPhase("login");
  },[]);

  if(phase==="wizard")return<SetupWizard onComplete={handleComplete}/>;
  if(phase==="login")return<LoginScreen brand={brand} onLogin={role=>{setCurrentRole(role);setPhase("os");}}/>;
  if(phase==="os")return<BrandOSApp brand={brand} currentRole={currentRole} onLogout={()=>setPhase("login")} onReconfigure={()=>{try{localStorage.removeItem("omnibrand_cfg");}catch(e){}setPhase("wizard");setBrand(null);setCurrentRole(null);}}/>;
  return null;
}
