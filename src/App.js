import { useState, useEffect, useRef, useCallback } from 'react';
import { Analytics } from '@vercel/analytics/react';

const API = "https://rental-system-backend-1t05.onrender.com";
const ADMIN_NAME = "Isaac Wekesa";

/* ══════ THEMES ══════ */
const LIGHT = {
  bg:"#F8FAFC", sidebar:"#0F172A", card:"#ffffff", cardBorder:"#E2E8F0",
  topbar:"#ffffff", topbarBorder:"#E2E8F0", text:"#0F172A", subtext:"#64748B",
  input:"#ffffff", inputBorder:"#CBD5E1", rowAlt:"#F1F5F9", statRow:"#F1F5F9",
  accent:"#4F46E5", accentLight:"#EEF2FF", gold:"#F59E0B",
  modalBg:"rgba(15,23,42,0.6)",
};
const DARK = {
  bg:"#020617", sidebar:"#0B1120", card:"#0F172A", cardBorder:"#1E293B",
  topbar:"#0F172A", topbarBorder:"#1E293B", text:"#F1F5F9", subtext:"#64748B",
  input:"#0F172A", inputBorder:"#1E293B", rowAlt:"#0B1120", statRow:"#0B1120",
  accent:"#818CF8", accentLight:"#1E1B4B", gold:"#FBBF24",
  modalBg:"rgba(0,0,0,0.8)",
};

/* ══════ GLOBAL STYLES ══════ */
const buildStyles = (T) => `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html{height:100%;height:-webkit-fill-available;}body{min-height:100%;min-height:-webkit-fill-available;}
  body{font-family:'DM Sans',sans-serif;background:${T.bg};color:${T.text};}

  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
  @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}
  @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
  @keyframes glow{0%,100%{text-shadow:0 0 20px rgba(99,102,241,0.4)}50%{text-shadow:0 0 40px rgba(99,102,241,0.8)}}

  .ghv-title{
    font-family:'Playfair Display',serif;
    background:linear-gradient(135deg,#F59E0B 0%,#D97706 100%);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;
    background-clip:text;animation:glow 3s ease-in-out infinite;
  }
  .inp{
    width:100%;padding:11px 14px;border:1.5px solid ${T.inputBorder};
    border-radius:10px;font-size:14px;font-family:'DM Sans',sans-serif;
    outline:none;background:${T.input};color:${T.text};
    transition:border 0.2s;
  }
  .inp:focus{border-color:${T.accent};}
  .inp[readonly]{opacity:0.6;cursor:default;}
  textarea.inp{resize:vertical;}
  select.inp{cursor:pointer;}

  .btn-green{padding:11px 20px;background:linear-gradient(135deg,#4F46E5,#818CF8);color:white;border:none;border-radius:10px;font-size:14px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;white-space:nowrap;transition:all 0.2s;box-shadow:0 4px 14px rgba(79,70,229,0.3);}
  .btn-green:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(79,70,229,0.4);}
  .btn-green:disabled{opacity:0.5;cursor:not-allowed;transform:none;}

  .btn-blue{padding:10px 16px;background:linear-gradient(135deg,#1459A0,#2D7DD2);color:white;border:none;border-radius:10px;font-size:13px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;white-space:nowrap;transition:all 0.2s;}
  .btn-blue:hover{transform:translateY(-1px);}

  .btn-orange{padding:9px 14px;background:linear-gradient(135deg,#7B3F00,#C47D1A);color:white;border:none;border-radius:9px;font-size:13px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;white-space:nowrap;transition:all 0.2s;}
  .btn-orange:hover:not(:disabled){transform:translateY(-1px);}
  .btn-orange:disabled{opacity:0.5;cursor:not-allowed;}

  .btn-outline{padding:8px 14px;background:transparent;color:${T.accent};border:1.5px solid ${T.cardBorder};border-radius:9px;font-size:13px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.2s;white-space:nowrap;}
  .btn-outline:hover{background:${T.accentLight};border-color:${T.accent};}

  .btn-ghost{padding:8px 12px;background:transparent;color:${T.accent};border:1.5px solid ${T.accent};border-radius:8px;font-size:12px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.2s;white-space:nowrap;}
  .btn-ghost:hover{background:${T.accent};color:white;}

  .btn-red{padding:8px 12px;background:transparent;color:#D63B3B;border:1.5px solid #D63B3B;border-radius:8px;font-size:12px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.2s;white-space:nowrap;}
  .btn-red:hover{background:#D63B3B;color:white;}

  .btn-back{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;background:${T.card};color:${T.accent};border:2px solid ${T.accent};border-radius:10px;font-size:14px;font-weight:700;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.2s;}
  .btn-back:hover{background:${T.accent};color:white;}

  .btn-theme{padding:7px 11px;border-radius:8px;border:1.5px solid ${T.inputBorder};background:${T.input};color:${T.text};font-size:16px;cursor:pointer;transition:all 0.2s;line-height:1;}

  .nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;margin-bottom:3px;font-size:14px;font-weight:500;cursor:pointer;color:#94A3B8;transition:all 0.18s;user-select:none;}
  .nav-item:hover{background:rgba(255,255,255,0.07);color:white;}
  .nav-item.active{background:linear-gradient(135deg,#4F46E5,#818CF8);color:white;}
  .nav-item.logout{color:#E07070;}
  .nav-item.logout:hover{background:rgba(224,112,112,0.12);}

  .tag{display:inline-flex;align-items:center;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;}

  .sk{background:linear-gradient(90deg,${T.cardBorder} 25%,${T.rowAlt} 50%,${T.cardBorder} 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:8px;display:block;}

  .modal-bg{position:fixed;inset:0;background:${T.modalBg};display:flex;align-items:center;justify-content:center;z-index:1000;padding:16px;backdrop-filter:blur(3px);}
  .modal-box{background:${T.card};border-radius:18px;padding:26px;width:100%;max-width:480px;max-height:92vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.35);border:1px solid ${T.cardBorder};backdrop-filter:blur(12px);}

  ::-webkit-scrollbar{width:5px;height:5px;}
  ::-webkit-scrollbar-thumb{background:${T.cardBorder};border-radius:99px;}

  @media print{.no-print{display:none!important;}body{background:white!important;color:black!important;}}

  /* MOBILE SIDEBAR */
  @media(max-width:768px){
    .sidebar{position:fixed!important;top:0;left:0;height:100vh!important;z-index:300;transform:translateX(-100%);transition:transform 0.28s ease!important;}
    .sidebar.open{transform:translateX(0)!important;box-shadow:4px 0 20px rgba(0,0,0,0.4);}
  }
  @media(min-width:769px){
    .sidebar{position:relative!important;transform:none!important;}
  }
`;

/* ══════ TOAST ══════ */
let _tid = 0;
function useToast() {
  const [list, setList] = useState([]);
  const show = useCallback((msg, type = "info") => {
    const id = ++_tid;
    setList(p => [...p, {id, msg, type}]);
    setTimeout(() => setList(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  return {list, show};
}
function Toasts({list}) {
  if (!list.length) return null;
  return (
    <div style={{position:"fixed",top:16,right:16,zIndex:9999,display:"flex",flexDirection:"column",gap:8,maxWidth:300}}>
      {list.map(t => (
        <div key={t.id} style={{
          padding:"12px 16px",borderRadius:10,fontSize:13,fontWeight:600,
          background:t.type==="success"?"linear-gradient(135deg,#0A7A4B,#1DB87A)":t.type==="error"?"linear-gradient(135deg,#9B1C1C,#E24B4A)":"linear-gradient(135deg,#1459A0,#2D7DD2)",
          color:"white",display:"flex",alignItems:"center",gap:8,
          animation:"slideIn 0.25s ease",boxShadow:"0 4px 16px rgba(0,0,0,0.25)"
        }}>
          <span>{t.type==="success"?"✓":t.type==="error"?"✕":"ℹ"}</span>{t.msg}
        </div>
      ))}
    </div>
  );
}

/* ══════ MODAL ══════ */
function Modal({title, onClose, T, children}) {
  return (
    <div className="modal-bg" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal-box">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h2 style={{fontSize:17,fontWeight:700,color:T.text}}>{title}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:T.subtext,lineHeight:1}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ══════ HELPERS ══════ */
function Av({name, size=30}) {
  return (
    <div style={{width:size,height:size,minWidth:size,background:"linear-gradient(135deg,#4F46E5,#818CF8)",borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:size*0.4,color:"white",marginRight:8,flexShrink:0}}>
      {name?.[0]?.toUpperCase()||"?"}
    </div>
  );
}
function Tag({bg, color, children}) {
  return <span className="tag" style={{background:bg,color}}>{children}</span>;
}
function Empty({T, icon, text, sub}) {
  return (
    <div style={{textAlign:"center",padding:"44px 16px"}}>
      <div style={{fontSize:40,marginBottom:10}}>{icon}</div>
      <p style={{fontWeight:700,color:T.subtext,fontSize:15}}>{text}</p>
      {sub && <p style={{fontSize:13,color:T.subtext,marginTop:6,opacity:0.8}}>{sub}</p>}
    </div>
  );
}
function Lbl({children, T}) {
  return <label style={{fontSize:12,fontWeight:600,color:T.subtext,display:"block",marginBottom:6}}>{children}</label>;
}
function SkCard() {
  return (
    <div style={{background:"white",borderRadius:14,padding:18,marginBottom:12,border:"1px solid #D8EDE3"}}>
      <div style={{display:"flex",gap:12,marginBottom:12}}>
        <span className="sk" style={{width:44,height:44,borderRadius:12,flexShrink:0}}/>
        <div style={{flex:1}}>
          <span className="sk" style={{width:"55%",height:14,marginBottom:8}}/>
          <span className="sk" style={{width:"38%",height:12}}/>
        </div>
      </div>
      <span className="sk" style={{width:"100%",height:8,marginBottom:6}}/>
      <span className="sk" style={{width:"70%",height:8}}/>
    </div>
  );
}

function TwoFactorSettings({API, auth, T, show, Lbl}) {
  const [status, setStatus] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [disableToken, setDisableToken] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/2fa/status`, {headers: auth()})
      .then(r => r.json()).then(d => setStatus(d.enabled)).catch(() => {});
  }, []); // eslint-disable-line

  const setup2FA = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/2fa/setup`, {method:"POST", headers: auth()});
      const d = await r.json();
      if (r.ok) { setQrCode(d.qrCode); setSecret(d.secret); }
      else show(d.message || 'Setup failed', 'error');
    } catch { show('Setup failed', 'error'); }
    setLoading(false);
  };

  const enable2FA = async () => {
    if (!verifyToken) { show('Enter the 6-digit code', 'error'); return; }
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/2fa/verify`, {method:"POST", headers:{"Content-Type":"application/json",...auth()}, body: JSON.stringify({token: verifyToken})});
      const d = await r.json();
      if (r.ok) { setStatus(true); setQrCode(''); setSecret(''); setVerifyToken(''); show('2FA enabled!', 'success'); }
      else show(d.message || 'Verification failed', 'error');
    } catch { show('Verification failed', 'error'); }
    setLoading(false);
  };

  const disable2FA = async () => {
    if (!disableToken) { show('Enter your current 2FA code', 'error'); return; }
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/2fa/disable`, {method:"POST", headers:{"Content-Type":"application/json",...auth()}, body: JSON.stringify({token: disableToken})});
      const d = await r.json();
      if (r.ok) { setStatus(false); setDisableToken(''); show('2FA disabled', 'success'); }
      else show(d.message || 'Failed', 'error');
    } catch { show('Failed', 'error'); }
    setLoading(false);
  };

  if (status === null) return <p style={{color:T.subtext,fontSize:13}}>Loading...</p>;

  if (status) {
    return (
      <div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{width:40,height:40,background:"linear-gradient(135deg,#059669,#10B981)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>✅</div>
          <div>
            <p style={{fontWeight:700,color:T.text,fontSize:14}}>2FA is Enabled</p>
            <p style={{fontSize:12,color:T.subtext}}>Your account is protected with two-factor authentication</p>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"flex-end",flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:140}}>
            <Lbl T={T}>Current 2FA Code (to disable)</Lbl>
            <input className="inp" type="text" maxLength={6} placeholder="000000" value={disableToken} onChange={e=>setDisableToken(e.target.value.replace(/\D/g,''))}/>
          </div>
          <button className="btn-red" onClick={disable2FA} disabled={loading} style={{padding:"11px 16px"}}>🔓 Disable 2FA</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!qrCode ? (
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div style={{width:40,height:40,background:"linear-gradient(135deg,#DC2626,#EF4444)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🔓</div>
            <div>
              <p style={{fontWeight:700,color:T.text,fontSize:14}}>2FA is Disabled</p>
              <p style={{fontSize:12,color:T.subtext}}>Add an extra layer of security to your account</p>
            </div>
          </div>
          <button className="btn-green" onClick={setup2FA} disabled={loading}>{loading?"Setting up...":"🔐 Setup 2FA"}</button>
        </div>
      ) : (
        <div>
          <p style={{fontSize:13,color:T.text,fontWeight:600,marginBottom:12}}>Scan this QR code with Google Authenticator:</p>
          <div style={{textAlign:"center",marginBottom:16}}>
            <img src={qrCode} alt="2FA QR Code" style={{borderRadius:12,border:`2px solid ${T.cardBorder}`,maxWidth:200}}/>
          </div>
          <p style={{fontSize:11,color:T.subtext,marginBottom:12}}>Or enter this code manually: <code style={{background:T.statRow,padding:"3px 8px",borderRadius:6,fontSize:11,fontWeight:700,color:T.text}}>{secret}</code></p>
          <div style={{display:"flex",gap:8,alignItems:"flex-end",flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:140}}>
              <Lbl T={T}>Enter 6-digit code to verify</Lbl>
              <input className="inp" type="text" maxLength={6} placeholder="000000" value={verifyToken}
                onChange={e=>setVerifyToken(e.target.value.replace(/\D/g,''))}
                style={{textAlign:"center",fontSize:20,letterSpacing:"6px",fontWeight:700}}/>
            </div>
            <button className="btn-green" onClick={enable2FA} disabled={loading} style={{padding:"11px 16px"}}>{loading?"Verifying...":"✅ Enable 2FA"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════ */
export default function App() {
  const {list: toasts, show} = useToast();
  const [dark, setDark] = useState(() => localStorage.getItem("ghv-dark") === "1");
  const T = dark ? DARK : LIGHT;

  // inject styles once per theme change
  useEffect(() => {
    let el = document.getElementById("ghv-css");
    if (!el) { el = document.createElement("style"); el.id = "ghv-css"; document.head.appendChild(el); }
    el.textContent = buildStyles(T);
    localStorage.setItem("ghv-dark", dark ? "1" : "0");
  }, [dark]); // eslint-disable-line

  /* ── auth ── */
  const [email, setEmail]         = useState('');
  const [pass, setPass]           = useState('');
  const [loggedIn, setLoggedIn]   = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [welcome, setWelcome]     = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [verifying2FA, setVerifying2FA] = useState(false);

  /* ── data ── */
  const [houses, setHouses]           = useState([]);
  const [tenants, setTenants]         = useState([]);
  const [balances, setBalances]       = useState({});
  const [cashAmounts, setCashAmounts] = useState({});
  const [dash, setDash]               = useState(null);
  const [payments, setPayments]       = useState([]);
  const [reminders, setReminders]     = useState([]);
  const [loading, setLoading]         = useState(false);

  /* ── house form ── */
  const [hNum, setHNum]   = useState('');
  const [hLoc, setHLoc]   = useState('');
  const [hRent, setHRent] = useState('');
  const [hApt, setHApt]   = useState('A');
  const [hBed, setHBed]   = useState(1);
  const [hType, setHType] = useState('monthly');
  const [hNightly, setHNightly] = useState('2500');

  /* ── tenant form (name + phone only) ── */
  const [tName, setTName] = useState('');
  const [tPhone, setTPhone] = useState('');
  const [tIdNumber, setTIdNumber] = useState('');

  /* ── search ── */
  const [tSearch, setTSearch]   = useState('');
  const [hSearch, setHSearch]   = useState('');
  const [hFilter, setHFilter]   = useState('all');

  /* ── modals ── */
  const [editT, setEditT]   = useState(null);
  const [editH, setEditH]   = useState(null);
  const [delConf, setDelConf] = useState(null);

  /* ── profile ── */
  const [profTenant, setProfTenant]   = useState(null);
  const [profPays, setProfPays]       = useState([]);
  const [fromPage, setFromPage]       = useState('tenants');

  /* ── sms ── */
  const [broadcast, setBroadcast]         = useState('');
  const [broadcasting, setBroadcasting]   = useState(false);
  const [smsBusy, setSmsBusy]             = useState({});
  const [smsMsg, setSmsMsg]               = useState({});

  /* ── reports ── */
  const now = new Date();
  const [rMonth, setRMonth] = useState(now.getMonth()+1);
  const [rYear, setRYear]   = useState(now.getFullYear());
  const [report, setReport] = useState(null);
  const [rLoading, setRLoading] = useState(false);

  /* ── nav ── */
  const [page, setPage]         = useState('dashboard');
  const [sidebar, setSidebar]   = useState(window.innerWidth > 768);

  const fetching  = useRef(false);
  const apts      = ["A","B","C","D","E"];
  const MONTHS    = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const tok  = () => { const t=localStorage.getItem('token'); return(!t||t==="undefined"||t==="null")?null:t; };
  const auth = () => { const t=tok(); return t?{Authorization:`Bearer ${t}`}:{}; };

  useEffect(() => { if(tok()) setLoggedIn(true); }, []);

  useEffect(() => {
    const fn = () => { if(window.innerWidth > 768) setSidebar(true); else setSidebar(false); };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  /* ── fetch ── */
  const go = async (url, opts={}) => {
    try {
      const r = await fetch(url, opts);
      const d = await r.json().catch(()=>null);
      if(r.status===401){ localStorage.clear(); setLoggedIn(false); show("Session expired — please login","error"); return null; }
      if(!r.ok){ show(d?.message||"Something went wrong","error"); return null; }
      return d;
    } catch {
      show("Server starting up... wait 30s and retry","error");
      return null;
    }
  };

  const loadBal = async (list) => {
    const out={};
    await Promise.all(list.map(async t=>{
      const r=await go(`${API}/api/payments/balance/${t._id}`,{headers:auth()});
      out[t._id]=r||{rent:0,paid:0,balance:0};
    }));
    setBalances(out);
  };

  const loadAll = async () => {
    if(fetching.current) return;
    fetching.current=true; setLoading(true);
    const [h,t,dsh,p,rem]=await Promise.all([
      go(`${API}/api/houses`,    {headers:auth()}),
      go(`${API}/api/tenants`,   {headers:auth()}),
      go(`${API}/api/dashboard`, {headers:auth()}),
      go(`${API}/api/payments`,  {headers:auth()}),
      go(`${API}/api/reminders`, {headers:auth()}),
    ]);
    const tl=Array.isArray(t)?t:[];
    setHouses(Array.isArray(h)?h:[]);
    setTenants(tl);
    setDash(dsh||null);
    setPayments(Array.isArray(p)?p:[]);
    setReminders(Array.isArray(rem)?rem:[]);
    await loadBal(tl);
    setLoading(false); fetching.current=false;
  };

  useEffect(()=>{ if(loggedIn) loadAll(); },[loggedIn]); // eslint-disable-line

  const nav = (id) => { setPage(id); if(window.innerWidth<=768) setSidebar(false); };

  /* ── login ── */
  const login = async () => {
    if(!email||!pass){ show("Enter email and password","error"); return; }
    setLoggingIn(true);
    try {
      const r = await fetch(`${API}/api/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password:pass})});
      const d = await r.json().catch(()=>null);
      setLoggingIn(false);
      if(r.ok && d?.requires2FA){ setRequires2FA(true); setTempToken(d.tempToken); show("Enter your 2FA code","info"); }
      else if(r.ok && d?.token){ localStorage.setItem("token",d.token); setWelcome(true); setTimeout(()=>{setLoggedIn(true);setWelcome(false);},1800); }
      else show(d?.message||"Invalid email or password","error");
    } catch { setLoggingIn(false); show("Server starting up... wait 30s and try again","error"); }
  };

  const verify2FA = async () => {
    if(!totpCode){ show("Enter your 2FA code","error"); return; }
    setVerifying2FA(true);
    try {
      const r = await fetch(`${API}/api/auth/verify-2fa`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tempToken,totpCode})});
      const d = await r.json().catch(()=>null);
      setVerifying2FA(false);
      if(r.ok && d?.token){ localStorage.setItem("token",d.token); setWelcome(true); setRequires2FA(false); setTotpCode(''); setTimeout(()=>{setLoggedIn(true);setWelcome(false);},1800); }
      else show(d?.message||"Invalid 2FA code","error");
    } catch { setVerifying2FA(false); show("Verification failed","error"); }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const r = await fetch(`${API}/api/google-auth/google`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({credential:credentialResponse.credential})});
      const d = await r.json().catch(()=>null);
      if(r.ok && d?.requires2FA){ setRequires2FA(true); setTempToken(d.tempToken); show("Enter your 2FA code","info"); }
      else if(r.ok && d?.token){ localStorage.setItem("token",d.token); setWelcome(true); setTimeout(()=>{setLoggedIn(true);setWelcome(false);},1800); }
      else show(d?.message||"Google login failed","error");
    } catch { show("Google login failed","error"); }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: 'your_google_client_id_here',
          callback: handleGoogleLogin,
        });
      }
    };
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, []); // eslint-disable-line

  const logout = () => { localStorage.clear(); setLoggedIn(false); setHouses([]); setTenants([]); setDash(null); setPayments([]); };

  /* ── house actions ── */
  const addHouse = async () => {
    if(!hNum||!hLoc||!hRent){ show("Fill all house fields including rent","error"); return; }
    if(isNaN(Number(hRent))||Number(hRent)<=0){ show("Enter a valid rent amount","error"); return; }
    const r=await go(`${API}/api/houses`,{method:"POST",headers:{"Content-Type":"application/json",...auth()},body:JSON.stringify({houseNumber:hNum,location:hLoc,rent:Number(hRent),apartment:hApt,bedrooms:hBed,rentalType:hType,nightlyRate:hType==='airbnb'?Number(hNightly):null})});
    if(r){ show("House added!","success"); setHNum(''); setHLoc(''); setHRent(''); setHBed(1); setHApt('A'); setHType('monthly'); setHNightly('2500'); loadAll(); }
  };
  const saveHouse = async () => {
    const r=await go(`${API}/api/houses/${editH._id}`,{method:"PUT",headers:{"Content-Type":"application/json",...auth()},body:JSON.stringify({houseNumber:editH.houseNumber,location:editH.location,rent:Number(editH.rent),bedrooms:Number(editH.bedrooms)})});
    if(r){ show("House updated!","success"); setEditH(null); loadAll(); }
  };

  /* ── tenant actions ── */
  const addTenant = async () => {
    if(!tName||!tPhone){ show("Name and phone required","error"); return; }
    const r=await go(`${API}/api/tenants`,{method:"POST",headers:{"Content-Type":"application/json",...auth()},body:JSON.stringify({name:tName,phone:tPhone,idNumber:tIdNumber||null})});
    if(r){ show("Tenant added!","success"); setTName(''); setTPhone(''); setTIdNumber(''); loadAll(); }
  };
  const saveTenant = async () => {
    const r=await go(`${API}/api/tenants/${editT._id}`,{method:"PUT",headers:{"Content-Type":"application/json",...auth()},body:JSON.stringify({name:editT.name,phone:editT.phone,idNumber:editT.idNumber||null})});
    if(r){ show("Tenant updated!","success"); setEditT(null); loadAll(); }
  };

  /* ── assign ── */
  const assign = async (tid,hid) => {
    if(!hid) return;
    if(houses.find(h=>h._id===hid)?.status==="occupied"){ show("House already occupied","error"); return; }
    const r=await go(`${API}/api/tenants/${tid}/assign`,{method:"PUT",headers:{"Content-Type":"application/json",...auth()},body:JSON.stringify({houseId:hid})});
    if(r){ show("House assigned!","success"); loadAll(); }
  };

  /* ── delete ── */
  const doDelete = async () => {
    if(!delConf) return;
    const {type,id}=delConf;
    if(type==="tenant")  setTenants(p=>p.filter(x=>x._id!==id));
    if(type==="house")   setHouses(p=>p.filter(x=>x._id!==id));
    if(type==="payment") setPayments(p=>p.filter(x=>x._id!==id));
    setDelConf(null);
    show("Deleted","success");
    const urls={tenant:`${API}/api/tenants/${id}`,house:`${API}/api/houses/${id}`,payment:`${API}/api/payments/${id}`};
    await go(urls[type],{method:"DELETE",headers:auth()});
    loadAll();
  };

  /* ── cash payment ── */
  const cashPay = async (tid) => {
    const amt=Number(cashAmounts[tid]);
    if(!amt||amt<=0){ show("Enter valid amount","error"); return; }
    const r=await go(`${API}/api/payments`,{method:"POST",headers:{"Content-Type":"application/json",...auth()},body:JSON.stringify({tenantId:tid,amount:amt,reference:"CASH-"+Date.now()})});
    if(r){ show("Cash payment recorded!","success"); setCashAmounts(p=>({...p,[tid]:''})); loadAll(); }
  };

  /* ── profile ── */
  const openProfile = async (t) => {
    setFromPage(page); setProfTenant(t);
    const p=await go(`${API}/api/payments`,{headers:auth()});
    setProfPays((p||[]).filter(x=>String(x.tenant?._id||x.tenant)===String(t._id)));
    nav('profile');
  };

  /* ── sms ── */
  const sendSMS = async (tid,ph) => {
    const msg=smsMsg[tid]||`Dear tenant, your rent is due. Please pay promptly. Thank you. - Gifted Hands Ventures`;
    setSmsBusy(p=>({...p,[tid]:true}));
    const r=await go(`${API}/api/sms/send`,{method:"POST",headers:{"Content-Type":"application/json",...auth()},body:JSON.stringify({phone:ph,message:msg})});
    setSmsBusy(p=>({...p,[tid]:false}));
    if(r) show("SMS sent!","success");
  };
  const sendBroadcast = async () => {
    if(!broadcast.trim()){ show("Type a message first","error"); return; }
    setBroadcasting(true);
    const r=await go(`${API}/api/sms/broadcast`,{method:"POST",headers:{"Content-Type":"application/json",...auth()},body:JSON.stringify({message:broadcast})});
    setBroadcasting(false);
    if(r){ show(`Sent to ${r.sent} tenants!`,"success"); setBroadcast(''); }
  };

  /* ── report ── */
  const genReport = async () => {
    setRLoading(true);
    const r=await go(`${API}/api/reports/monthly?month=${rMonth}&year=${rYear}`,{headers:auth()});
    setRLoading(false);
    if(r) setReport(r);
  };

  /* ── filters ── */
  const fTenants = tenants.filter(t=>t.name?.toLowerCase().includes(tSearch.toLowerCase())||t.phone?.includes(tSearch));
  const fHouses  = houses.filter(h=>{
    const ms=h.houseNumber?.toLowerCase().includes(hSearch.toLowerCase())||h.location?.toLowerCase().includes(hSearch.toLowerCase());
    const mf=hFilter==="all"||h.status===hFilter;
    return ms&&mf;
  });

  /* ── style shortcuts ── */
  const card  = (x={}) => ({background:T.card,borderRadius:16,border:`1px solid ${T.cardBorder}`,padding:"20px 22px",marginBottom:16,...x});
  const cTit  = {fontSize:15,fontWeight:700,color:T.text,margin:"0 0 16px"};
  const TH    = {textAlign:"left",padding:"9px 12px",fontSize:11,fontWeight:700,color:T.subtext,borderBottom:`2px solid ${T.cardBorder}`,whiteSpace:"nowrap",textTransform:"uppercase",letterSpacing:"0.6px"};
  const TD    = {padding:"11px 12px",verticalAlign:"middle",color:T.text};

  const occ = houses.filter(h=>h.status==="occupied").length;
  const vac = houses.filter(h=>h.status==="vacant").length;

  /* ════════════════════════════════════
     LOGIN
  ════════════════════════════════════ */
  if(!loggedIn) return (
    <>
      <Toasts list={toasts}/>
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:dark?"linear-gradient(135deg,#020617,#0B1120)":"linear-gradient(135deg,#1E1B4B,#312E81)",position:"relative",overflow:"hidden",padding:16}}>
        {[...Array(4)].map((_,i)=>(
          <div key={i} style={{position:"absolute",borderRadius:"50%",border:"1px solid rgba(255,255,255,0.05)",width:160+i*130,height:160+i*130,top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none"}}/>
        ))}
        <button className="btn-theme" onClick={()=>setDark(d=>!d)} style={{position:"fixed",top:16,right:16,zIndex:10}}>{dark?"☀️":"🌙"}</button>

        <div style={{background:dark?"rgba(15,23,42,0.95)":"rgba(255,255,255,0.95)",borderRadius:22,padding:"36px 28px",width:"min(400px,100%)",boxShadow:"0 20px 60px rgba(0,0,0,0.4)",position:"relative",zIndex:1,border:`1px solid ${T.cardBorder}`}}>
          <div style={{textAlign:"center",marginBottom:28}}>
            <div style={{width:64,height:64,background:"linear-gradient(135deg,#4F46E5,#818CF8)",borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:30}}>🏢</div>
            <h1 className="ghv-title" style={{fontSize:24,letterSpacing:"0.5px",lineHeight:1.3}}>GIFTED HANDS</h1>
            <h1 className="ghv-title" style={{fontSize:24,letterSpacing:"0.5px"}}>VENTURES</h1>
            <div style={{width:50,height:3,background:`linear-gradient(90deg,${T.gold},transparent)`,margin:"10px auto 8px"}}/>
            <p style={{fontSize:12,color:T.subtext}}>Property Management System</p>
          </div>

          {welcome ? (
            <div style={{textAlign:"center",padding:"16px 0"}}>
              <div style={{fontSize:46,marginBottom:10}}>🎉</div>
              <p style={{color:"#1DB87A",fontWeight:600,fontSize:16}}>Welcome back,</p>
              <p style={{color:T.gold,fontWeight:800,fontSize:20,fontFamily:"'Playfair Display',serif"}}>{ADMIN_NAME}!</p>
              <p style={{color:T.subtext,fontSize:12,marginTop:8}}>Loading your dashboard...</p>
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {requires2FA ? (
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div style={{textAlign:"center",marginBottom:6}}>
                    <div style={{fontSize:40,marginBottom:8}}>🔐</div>
                    <p style={{fontWeight:700,color:T.text,fontSize:15}}>Two-Factor Authentication</p>
                    <p style={{fontSize:12,color:T.subtext,marginTop:4}}>Enter the 6-digit code from your authenticator app</p>
                  </div>
                  <div>
                    <Lbl T={T}>2FA Code</Lbl>
                    <input className="inp" type="text" placeholder="000000" maxLength={6}
                      value={totpCode} onChange={e=>setTotpCode(e.target.value.replace(/\D/g,''))}
                      onKeyDown={e=>e.key==="Enter"&&verify2FA()}
                      style={{textAlign:"center",fontSize:24,letterSpacing:"8px",fontWeight:800}}/>
                  </div>
                  <button className="btn-green" onClick={verify2FA} disabled={verifying2FA}
                    style={{marginTop:6,width:"100%",padding:"13px 0",fontSize:15}}>
                    {verifying2FA?"Verifying...":"Verify →"}
                  </button>
                  <button className="btn-theme" onClick={()=>{setRequires2FA(false);setTotpCode('');}} style={{width:"100%"}}>
                    ← Back to Login
                  </button>
                </div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div>
                    <Lbl T={T}>Email Address</Lbl>
                    <input className="inp" type="email" placeholder="admin@rentals.co.ke"
                      value={email} onChange={e=>setEmail(e.target.value)}
                      onKeyDown={e=>e.key==="Enter"&&login()}/>
                  </div>
                  <div>
                    <Lbl T={T}>Password</Lbl>
                    <input className="inp" type="password" placeholder="••••••••"
                      value={pass} onChange={e=>setPass(e.target.value)}
                      onKeyDown={e=>e.key==="Enter"&&login()}/>
                  </div>
                  <button className="btn-green" onClick={login} disabled={loggingIn}
                    style={{marginTop:6,width:"100%",padding:"13px 0",fontSize:15}}>
                    {loggingIn?"Signing in...":"Sign In →"}
                  </button>
                  <div style={{display:"flex",alignItems:"center",gap:12,margin:"4px 0"}}>
                    <div style={{flex:1,height:1,background:T.inputBorder}}/>
                    <span style={{fontSize:11,color:T.subtext,fontWeight:600}}>or</span>
                    <div style={{flex:1,height:1,background:T.inputBorder}}/>
                  </div>
                  <button onClick={()=>{if(window.google)window.google.accounts.id.prompt();}} 
                    style={{width:"100%",padding:"12px 0",background:T.input,border:`1.5px solid ${T.inputBorder}`,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,fontSize:14,fontWeight:600,color:T.text,fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}>
                    <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Sign in with Google
                  </button>
                </div>
              )}
            </div>
          )}
          <p style={{textAlign:"center",fontSize:11,color:T.subtext,marginTop:22}}>
            Gifted Hands Ventures © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </>
  );

  /* ════════════════════════════════════
     MAIN APP
  ════════════════════════════════════ */
  const navItems = [
    {id:"dashboard",label:"Dashboard",  icon:"📊"},
    {id:"houses",   label:"Houses",     icon:"🏠"},
    {id:"tenants",  label:"Tenants",    icon:"👤"},
    {id:"payments", label:"Payments",   icon:"💳"},
    {id:"reports",  label:"Reports",    icon:"📋"},
    {id:"sms",      label:"SMS Alerts", icon:"📱"},
    {id:"settings", label:"Settings",   icon:"⚙️"},
  ];
  const cur = navItems.find(n=>n.id===page);

  return (
    <>
      <Toasts list={toasts}/>

      {/* EDIT TENANT MODAL */}
      {editT && (
        <Modal title="✏️ Edit Tenant" onClose={()=>setEditT(null)} T={T}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div><Lbl T={T}>Full Name</Lbl><input className="inp" value={editT.name} onChange={e=>setEditT(p=>({...p,name:e.target.value}))}/></div>
            <div><Lbl T={T}>Phone</Lbl><input className="inp" value={editT.phone} onChange={e=>setEditT(p=>({...p,phone:e.target.value}))}/></div>
            <div style={{display:"flex",gap:10,marginTop:6}}>
              <button className="btn-green" onClick={saveTenant} style={{flex:1}}>💾 Save</button>
              <button className="btn-outline" onClick={()=>setEditT(null)} style={{flex:1}}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {/* EDIT HOUSE MODAL */}
      {editH && (
        <Modal title="✏️ Edit House" onClose={()=>setEditH(null)} T={T}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div><Lbl T={T}>House Number</Lbl><input className="inp" value={editH.houseNumber} onChange={e=>setEditH(p=>({...p,houseNumber:e.target.value}))}/></div>
            <div><Lbl T={T}>Location</Lbl><input className="inp" value={editH.location} onChange={e=>setEditH(p=>({...p,location:e.target.value}))}/></div>
            <div><Lbl T={T}>Rent (KES)</Lbl><input className="inp" type="number" value={editH.rent} onChange={e=>setEditH(p=>({...p,rent:e.target.value}))}/></div>
            <div>
              <Lbl T={T}>Bedrooms</Lbl>
              <select className="inp" value={editH.bedrooms} onChange={e=>setEditH(p=>({...p,bedrooms:e.target.value}))}>
                {[1,2,3,4].map(n=><option key={n} value={n}>{n} Bedroom{n>1?"s":""}</option>)}
              </select>
            </div>
            <div style={{display:"flex",gap:10,marginTop:6}}>
              <button className="btn-green" onClick={saveHouse} style={{flex:1}}>💾 Save</button>
              <button className="btn-outline" onClick={()=>setEditH(null)} style={{flex:1}}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {/* DELETE MODAL */}
      {delConf && (
        <Modal title="⚠️ Confirm Delete" onClose={()=>setDelConf(null)} T={T}>
          <p style={{color:T.subtext,fontSize:14,marginBottom:20,lineHeight:1.6}}>
            Delete <strong style={{color:T.text}}>{delConf.name}</strong>? This cannot be undone.
          </p>
          <div style={{display:"flex",gap:10}}>
            <button className="btn-red" onClick={doDelete} style={{flex:1,padding:"11px 0",fontSize:14}}>🗑️ Delete</button>
            <button className="btn-outline" onClick={()=>setDelConf(null)} style={{flex:1,padding:"11px 0"}}>Cancel</button>
          </div>
        </Modal>
      )}

      <div style={{display:"flex",height:"100dvh",minHeight:"-webkit-fill-available",overflow:"hidden",position:"relative"}}>

        {/* Mobile overlay */}
        {sidebar && window.innerWidth<=768 && (
          <div onClick={()=>setSidebar(false)}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:299}}/>
        )}

        {/* ═══ SIDEBAR ═══ */}
        <div className={`sidebar${sidebar?" open":""}`}
          style={{width:240,background:T.sidebar,display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto",overflowX:"hidden"}}>

          {/* Brand */}
          <div style={{padding:"20px 16px 14px",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:42,height:42,background:"linear-gradient(135deg,#0A7A4B,#1DB87A)",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🏢</div>
              <div>
                <p className="ghv-title" style={{fontSize:10,letterSpacing:"1.5px",lineHeight:1.4}}>GIFTED HANDS</p>
                <p className="ghv-title" style={{fontSize:10,letterSpacing:"1.5px"}}>VENTURES</p>
              </div>
            </div>
          </div>

          {/* Admin */}
          <div style={{padding:"12px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,background:`linear-gradient(135deg,#7B4F00,${T.gold})`,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,color:"#0A2E1C",flexShrink:0}}>IW</div>
              <div>
                <p style={{color:"rgba(255,255,255,0.55)",fontSize:10}}>Welcome back,</p>
                <p style={{color:T.gold,fontSize:12,fontWeight:700}}>{ADMIN_NAME}</p>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div style={{margin:"12px 10px",background:"rgba(255,255,255,0.05)",borderRadius:10,padding:"10px 12px",flexShrink:0}}>
            {[
              {l:"Occupied", v:occ,             c:"#1DB87A"},
              {l:"Vacant",   v:vac,             c:T.gold},
              {l:"Tenants",  v:tenants.length,  c:"#5B8DEF"},
              {l:"Overdue",  v:dash?.overdueCount??"—", c:"#E07070"},
            ].map(s=>(
              <div key={s.l} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                <span style={{color:"#94A3B8"}}>{s.l}</span>
                <span style={{color:s.c,fontWeight:700}}>{s.v}</span>
              </div>
            ))}
          </div>

          {/* Nav */}
          <nav style={{padding:"0 8px",flex:1}}>
            <p style={{fontSize:11,fontWeight:700,color:'#334155',margin:'0 0 10px 10px',letterSpacing:'0.8px'}}>MENU</p>
            {navItems.map(n=>(
              <div key={n.id} className={`nav-item${page===n.id?" active":""}`} onClick={()=>nav(n.id)}>
                <span style={{fontSize:16}}>{n.icon}</span>
                {n.label}
                {n.id==="sms"&&reminders.length>0&&(
                  <span style={{marginLeft:"auto",background:"#E07070",color:"white",fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:999}}>{reminders.length}</span>
                )}
              </div>
            ))}
          </nav>

          {/* Logout */}
          <div style={{padding:"10px 8px 18px",flexShrink:0}}>
            <div className="nav-item logout" onClick={logout}>
              <span style={{fontSize:16}}>🚪</span> Logout
            </div>
          </div>
        </div>

        {/* ═══ MAIN ═══ */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:T.bg,minWidth:0}}>

          {/* Topbar */}
          <div className="no-print" style={{background:T.topbar,borderBottom:`1px solid ${T.topbarBorder}`,padding:"11px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,zIndex:50}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button onClick={()=>setSidebar(o=>!o)} style={{background:"none",border:"none",fontSize:21,cursor:"pointer",color:T.subtext,lineHeight:1}}>☰</button>
              <div>
                <h1 style={{fontSize:15,fontWeight:700,color:T.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"42vw"}}>
                  {page==="profile"&&profTenant?`👤 ${profTenant.name}`:cur?`${cur.icon} ${cur.label}`:""}
                </h1>
                <p style={{fontSize:10,color:T.subtext}}>
                  {new Date().toLocaleDateString("en-KE",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}
                </p>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              {reminders.length>0&&<div style={{background:"#FCEBEB",color:"#A32D2D",fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:999}}>⚠️{reminders.length}</div>}
              <button className="btn-outline" onClick={loadAll} style={{padding:"6px 10px",fontSize:12}}>↻</button>
              <button className="btn-theme" onClick={()=>setDark(d=>!d)}>{dark?"☀️":"🌙"}</button>
              <div style={{width:30,height:30,background:`linear-gradient(135deg,#7B4F00,${T.gold})`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#0A2E1C",fontSize:11}}>IW</div>
            </div>
          </div>

          {/* Page content */}
          <div style={{flex:1,overflowY:"auto",overflowX:"hidden"}}>
            <div style={{padding:"14px",maxWidth:1080,margin:"0 auto"}}>

              {/* ═══ DASHBOARD ═══ */}
              {page==="dashboard"&&(
                <div style={{animation:"fadeUp 0.3s ease"}}>
                  {loading?(
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:16}}>
                      {[...Array(6)].map((_,i)=><span key={i} className="sk" style={{height:90,borderRadius:14}}/>)}
                    </div>
                  ):!dash?<p style={{color:T.subtext,padding:20}}>Loading...</p>:(
                    <>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:16}}>
                        {[
                          {l:"Total Houses", v:dash.totalHouses, bg:"linear-gradient(135deg,#0A3D2B,#0A7A4B)", icon:"🏠"},
                          {l:"Occupied",     v:dash.occupied,    bg:"linear-gradient(135deg,#1459A0,#2D7DD2)", icon:"✅"},
                          {l:"Vacant",       v:dash.available,   bg:"linear-gradient(135deg,#7B4F00,#C8960A)", icon:"🔑"},
                          {l:"Income",       v:`KES ${(dash.totalIncome||0).toLocaleString()}`, bg:"linear-gradient(135deg,#1A4A1A,#2E8B2E)", icon:"💰", sm:true},
                          {l:"Overdue",      v:dash.overdueCount,bg:dash.overdueCount>0?"linear-gradient(135deg,#6B1A1A,#D63B3B)":"linear-gradient(135deg,#0A3D2B,#0A7A4B)", icon:dash.overdueCount>0?"⚠️":"✔️"},
                          {l:"Tenants",      v:tenants.length,   bg:"linear-gradient(135deg,#1A1A6B,#534AB7)", icon:"👤"},
                        ].map(c=>(
                          <div key={c.l} style={{background:c.bg,borderRadius:13,padding:"14px 12px",boxShadow:"0 4px 16px rgba(0,0,0,0.18)"}}>
                            <span style={{fontSize:20}}>{c.icon}</span>
                            <p style={{fontSize:c.sm?14:22,fontWeight:800,color:"white",margin:"5px 0 3px"}}>{c.v}</p>
                            <p style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.7)"}}>{c.l}</p>
                          </div>
                        ))}
                      </div>

                      {/* Occupancy bar */}
                      <div style={card()}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                          <span style={{fontSize:14,fontWeight:700,color:T.text}}>Occupancy Rate</span>
                          <span style={{fontSize:17,fontWeight:800,color:T.accent}}>{dash.occupancyRate}%</span>
                        </div>
                        <div style={{background:T.cardBorder,borderRadius:999,height:11,overflow:"hidden"}}>
                          <div style={{width:`${dash.occupancyRate}%`,height:"100%",borderRadius:999,transition:"width 1s",
                            background:dash.occupancyRate>=80?"linear-gradient(90deg,#0A7A4B,#1DB87A)":dash.occupancyRate>=50?"linear-gradient(90deg,#B8800A,#F0C030)":"linear-gradient(90deg,#8B1A1A,#E24B4A)"}}/>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:12,color:T.subtext}}>
                          <span>🟢 {dash.occupied} occupied</span><span>🔑 {dash.available} vacant</span>
                        </div>
                      </div>

                      {/* Overdue */}
                      <div style={card()}>
                        <h2 style={{...cTit,display:"flex",alignItems:"center",gap:8}}>
                          Overdue Tenants
                          {dash.overdueCount>0&&<Tag bg="#FCEBEB" color="#A32D2D">{dash.overdueCount}</Tag>}
                        </h2>
                        {!dash.overdueTenants?.length?<Empty T={T} icon="🎉" text="All tenants are up to date!"/>:(
                          <div style={{overflowX:"auto"}}>
                            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                              <thead><tr>{["Tenant","Phone","House","Rent","Paid","Balance"].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                              <tbody>
                                {dash.overdueTenants.map((t,i)=>(
                                  <tr key={i} style={{background:i%2===0?T.rowAlt:T.card}}>
                                    <td style={TD}><Av name={t.name}/>{t.name}</td>
                                    <td style={TD}>{t.phone}</td>
                                    <td style={TD}><Tag bg="#E6F1FB" color="#185FA5">{t.house}</Tag></td>
                                    <td style={TD}>KES {(t.rent||0).toLocaleString()}</td>
                                    <td style={TD}>KES {(t.paid||0).toLocaleString()}</td>
                                    <td style={TD}><Tag bg="#FCEBEB" color="#A32D2D">KES {(t.balance||0).toLocaleString()}</Tag></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ═══ HOUSES ═══ */}
              {page==="houses"&&(
                <div style={{animation:"fadeUp 0.3s ease"}}>
                  <div style={card()}>
                    <h2 style={cTit}>🏠 Add New House</h2>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:12}}>
                      <div><Lbl T={T}>House Number</Lbl><input className="inp" placeholder="e.g. A101" value={hNum} onChange={e=>setHNum(e.target.value)}/></div>
                      <div><Lbl T={T}>Location</Lbl><input className="inp" placeholder="e.g. Kiambu Rd" value={hLoc} onChange={e=>setHLoc(e.target.value)}/></div>
                      <div>
                        <Lbl T={T}>Apartment</Lbl>
                        <select className="inp" value={hApt} onChange={e=>setHApt(e.target.value)}>
                          {apts.map(a=><option key={a} value={a}>Apartment {a}</option>)}
                        </select>
                      </div>
                      <div>
                        <Lbl T={T}>Bedrooms</Lbl>
                        <select className="inp" value={hBed} onChange={e=>setHBed(Number(e.target.value))}>
                          {[1,2,3,4].map(n=><option key={n} value={n}>{n} Bedroom{n>1?"s":""}</option>)}
                        </select>
                      </div>
                      {/* ✅ Manual rent input */}
                      <div><Lbl T={T}>Rent (KES)</Lbl><input className="inp" type="number" placeholder="Enter rent e.g. 8500" value={hRent} onChange={e=>setHRent(e.target.value)}/></div>
                      <div>
                        <Lbl T={T}>Rental Type</Lbl>
                        <select className="inp" value={hType} onChange={e=>setHType(e.target.value)}>
                          <option value="monthly">Monthly Rental</option>
                          <option value="airbnb">Airbnb (Nightly)</option>
                        </select>
                      </div>
                      {hType==='airbnb'&&<div><Lbl T={T}>Nightly Rate (KES)</Lbl><input className="inp" type="number" placeholder="2500" value={hNightly} onChange={e=>setHNightly(e.target.value)}/></div>}
                      <div style={{display:"flex",alignItems:"flex-end"}}>
                        <button className="btn-green" onClick={addHouse} style={{width:"100%"}}>+ Add House</button>
                      </div>
                    </div>
                  </div>

                  {/* Search + filter */}
                  <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
                    <div style={{flex:1,minWidth:160,position:"relative"}}>
                      <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:T.subtext,pointerEvents:"none"}}>🔍</span>
                      <input className="inp" style={{paddingLeft:36}} placeholder="Search houses..." value={hSearch} onChange={e=>setHSearch(e.target.value)}/>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      {["all","occupied","vacant"].map(f=>(
                        <button key={f} onClick={()=>setHFilter(f)} style={{padding:"9px 12px",borderRadius:9,border:`1.5px solid ${hFilter===f?T.accent:T.cardBorder}`,background:hFilter===f?T.accent:"transparent",color:hFilter===f?"white":T.subtext,fontWeight:600,fontSize:12,cursor:"pointer",transition:"all 0.2s"}}>
                          {f==="all"?"All":f==="occupied"?"🔒 Occ":"🔑 Vac"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {apts.map(ap=>{
                    const apH=fHouses.filter(h=>h.apartment===ap);
                    if(!apH.length) return null;
                    return (
                      <div key={ap} style={{marginBottom:18}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                          <div style={{width:26,height:26,background:"linear-gradient(135deg,#0A7A4B,#1DB87A)",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:800,fontSize:12}}>{ap}</div>
                          <h3 style={{fontSize:14,fontWeight:700,color:T.text}}>Apartment {ap}</h3>
                          <span style={{fontSize:11,color:T.subtext}}>{apH.length} unit{apH.length!==1?"s":""}</span>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:8}}>
                          {apH.map(h=>(
                            <div key={h._id} style={{background:T.card,borderRadius:12,border:`1px solid ${T.cardBorder}`,padding:"12px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                              <div style={{display:"flex",alignItems:"center",gap:10}}>
                                <div style={{width:38,height:38,background:h.status==="occupied"?"linear-gradient(135deg,#6B1A1A,#D63B3B)":"linear-gradient(135deg,#0A3D2B,#0A7A4B)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>{h.status==="occupied"?"🔒":"🔑"}</div>
                                <div>
                                  <p style={{fontWeight:700,fontSize:14,color:T.text}}>{h.houseNumber}</p>
                                  <p style={{fontSize:11,color:T.subtext}}>{h.location} · {h.bedrooms} bed{h.bedrooms>1?"s":""}</p>
                                </div>
                              </div>
                              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                                <p style={{fontWeight:800,fontSize:14,color:T.accent}}>KES {(h.rent||0).toLocaleString()}/mo</p>
                                <Tag bg={h.status==="occupied"?"#FCEBEB":"#E1F5EE"} color={h.status==="occupied"?"#A32D2D":"#0F6E56"}>{h.status==="occupied"?"Occupied":"Vacant"}</Tag>
                                <button className="btn-ghost" onClick={()=>setEditH({...h})}>✏️</button>
                                <button className="btn-red" onClick={()=>setDelConf({type:"house",id:h._id,name:h.houseNumber})}>🗑️</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {!fHouses.length&&<Empty T={T} icon="🏠" text="No houses found" sub="Add a house above"/>}
                </div>
              )}

              {/* ═══ TENANTS ═══ */}
              {page==="tenants"&&(
                <div style={{animation:"fadeUp 0.3s ease"}}>
                  <div style={card()}>
                    {/* ✅ Simple form: name + phone only */}
                    <h2 style={cTit}>👤 Add New Tenant</h2>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
                      <div><Lbl T={T}>Full Name</Lbl><input className="inp" placeholder="e.g. John Kamau" value={tName} onChange={e=>setTName(e.target.value)}/></div>
                      <div><Lbl T={T}>Phone Number</Lbl><input className="inp" placeholder="e.g. 0712345678" value={tPhone} onChange={e=>setTPhone(e.target.value)}/></div>
                      <div><Lbl T={T}>National ID</Lbl><input className="inp" placeholder="e.g. 12345678" value={tIdNumber} onChange={e=>setTIdNumber(e.target.value)}/></div>
                      <div style={{display:"flex",alignItems:"flex-end"}}>
                        <button className="btn-green" onClick={addTenant} style={{width:"100%"}}>+ Add Tenant</button>
                      </div>
                    </div>
                  </div>

                  {/* Search */}
                  <div style={{position:"relative",marginBottom:12}}>
                    <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:T.subtext,pointerEvents:"none"}}>🔍</span>
                    <input className="inp" style={{paddingLeft:36}} placeholder="Search by name or phone..." value={tSearch} onChange={e=>setTSearch(e.target.value)}/>
                  </div>
                  <p style={{fontSize:12,color:T.subtext,fontWeight:600,marginBottom:12}}>{fTenants.length} tenant{fTenants.length!==1?"s":""}</p>

                  {loading?[...Array(3)].map((_,i)=><SkCard key={i}/>):(
                    <div style={{display:"flex",flexDirection:"column",gap:14}}>
                      {fTenants.map(t=>{
                        const bal=balances[t._id]||{rent:0,paid:0,balance:0};
                        const pct=bal.rent>0?Math.min(100,Math.round((bal.paid/bal.rent)*100)):0;
                        return (
                          <div key={t._id} style={{background:T.card,borderRadius:14,border:`1px solid ${T.cardBorder}`,padding:"16px"}}>
                            {/* Header */}
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:12}}>
                              <div style={{display:"flex",alignItems:"center",gap:10}}>
                                <div style={{width:44,height:44,background:"linear-gradient(135deg,#0A7A4B,#1DB87A)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:20,color:"white"}}>{t.name?.[0]?.toUpperCase()||"?"}</div>
                                <div>
                                  <p style={{fontWeight:700,fontSize:15,color:T.text}}>{t.name}</p>
                                  <p style={{fontSize:12,color:T.subtext}}>{t.phone}</p>
                                  {t.idNumber&&<p style={{fontSize:11,color:T.subtext}}>🪪 ID: {t.idNumber}</p>}
                                </div>
                              </div>
                              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                                <button className="btn-outline" style={{padding:"6px 10px",fontSize:11}} onClick={()=>openProfile(t)}>👁️ Profile</button>
                                <button className="btn-ghost" onClick={()=>setEditT({...t})}>✏️</button>
                                <button className="btn-red" onClick={()=>setDelConf({type:"tenant",id:t._id,name:t.name})}>🗑️</button>
                              </div>
                            </div>

                            {/* Assign */}
                            <select className="inp" style={{marginBottom:12}} defaultValue="" onChange={e=>assign(t._id,e.target.value)}>
                              <option value="">Assign / Reassign House</option>
                              {houses.filter(h=>h.status==="vacant").map(h=>(
                                <option key={h._id} value={h._id}>{h.houseNumber} — KES {(h.rent||0).toLocaleString()}/mo</option>
                              ))}
                            </select>

                            {/* Balance */}
                            <div style={{background:T.statRow,borderRadius:10,padding:"12px 14px",marginBottom:12}}>
                              <div style={{display:"flex",gap:18,flexWrap:"wrap",marginBottom:8}}>
                                {[
                                  {l:"Monthly Rent",v:`KES ${(bal.rent||0).toLocaleString()}`,c:"#2D7DD2"},
                                  {l:"Paid",        v:`KES ${(bal.paid||0).toLocaleString()}`,c:"#0A7A4B"},
                                  {l:"Balance",     v:`KES ${(bal.balance||0).toLocaleString()}`,c:bal.balance>0?"#D63B3B":"#0A7A4B"},
                                ].map(s=>(
                                  <div key={s.l}>
                                    <p style={{fontSize:10,color:T.subtext,marginBottom:2}}>{s.l}</p>
                                    <p style={{fontSize:15,fontWeight:800,color:s.c}}>{s.v}</p>
                                  </div>
                                ))}
                              </div>
                              <div style={{height:7,background:T.cardBorder,borderRadius:999,overflow:"hidden"}}>
                                <div style={{height:"100%",width:`${pct}%`,borderRadius:999,transition:"width 1s",
                                  background:pct===100?"linear-gradient(90deg,#0A7A4B,#1DB87A)":pct>=50?"linear-gradient(90deg,#B8800A,#F0C030)":"linear-gradient(90deg,#8B1A1A,#E24B4A)"}}/>
                              </div>
                              <p style={{fontSize:10,color:T.subtext,marginTop:4,textAlign:"right"}}>{pct}% paid</p>
                            </div>

                            {/* Cash payment */}
                            <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                              <input className="inp" type="number" placeholder="Record cash payment (KES)" style={{flex:1,minWidth:130}}
                                value={cashAmounts[t._id]||''} onChange={e=>setCashAmounts(p=>({...p,[t._id]:e.target.value}))}/>
                              <button className="btn-blue" onClick={()=>cashPay(t._id)}>💵 Record</button>
                            </div>

                            {/* SMS */}
                            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                              <input className="inp" placeholder="Custom SMS (optional)" style={{flex:1,minWidth:130}}
                                value={smsMsg[t._id]||''} onChange={e=>setSmsMsg(p=>({...p,[t._id]:e.target.value}))}/>
                              <button className="btn-orange" onClick={()=>sendSMS(t._id,t.phone)} disabled={smsBusy[t._id]}>
                                {smsBusy[t._id]?"...":"📱 SMS"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {!loading&&!fTenants.length&&<Empty T={T} icon="👤" text="No tenants found" sub="Add a tenant above"/>}
                </div>
              )}

              {/* ═══ PROFILE ═══ */}
              {page==="profile"&&profTenant&&(
                <div style={{animation:"fadeUp 0.3s ease"}}>
                  <button className="btn-back" onClick={()=>nav(fromPage)} style={{marginBottom:16}}>
                    ← Back to {fromPage.charAt(0).toUpperCase()+fromPage.slice(1)}
                  </button>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:14}}>

                    {/* Profile card */}
                    <div style={card({textAlign:"center"})}>
                      <div style={{width:76,height:76,background:"linear-gradient(135deg,#0A7A4B,#1DB87A)",borderRadius:20,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:30,color:"white",margin:"0 auto 14px"}}>
                        {profTenant.name?.[0]?.toUpperCase()}
                      </div>
                      <h2 style={{fontSize:19,fontWeight:800,color:T.text,marginBottom:6}}>{profTenant.name}</h2>
                      <p style={{fontSize:13,color:T.subtext,marginBottom:14}}>📞 {profTenant.phone}</p>
                      <div style={{marginBottom:14}}>
                        <Tag bg={T.accentLight} color={T.accent}>
                          {houses.find(h=>String(h._id)===String(profTenant.house))
                            ?`🏠 House ${houses.find(h=>String(h._id)===String(profTenant.house))?.houseNumber}`
                            :"No House Assigned"}
                        </Tag>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        <button className="btn-ghost" onClick={()=>setEditT({...profTenant})}>✏️ Edit Details</button>
                        <button className="btn-orange" onClick={()=>sendSMS(profTenant._id,profTenant.phone)}>📱 Send SMS</button>
                        <button className="btn-red" onClick={()=>setDelConf({type:"tenant",id:profTenant._id,name:profTenant.name})}>🗑️ Delete</button>
                      </div>
                    </div>

                    {/* Payment history */}
                    <div style={card()}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
                        <h2 style={{...cTit,margin:0}}>Payment History</h2>
                        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                          <Tag bg={T.accentLight} color={T.accent}>{profPays.length} records</Tag>
                          <Tag bg="#E1F5EE" color="#0F6E56">KES {profPays.filter(p=>p.status==="confirmed").reduce((s,p)=>s+(p.amount||0),0).toLocaleString()}</Tag>
                        </div>
                      </div>
                      {!profPays.length?<Empty T={T} icon="💳" text="No payments yet"/>:(
                        <div style={{overflowX:"auto"}}>
                          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                            <thead><tr>{["Amount","Reference","Status","Date"].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                            <tbody>
                              {profPays.map((p,i)=>(
                                <tr key={p._id} style={{background:i%2===0?T.rowAlt:T.card}}>
                                  <td style={TD}><span style={{color:"#0A7A4B",fontWeight:800}}>KES {(p.amount||0).toLocaleString()}</span></td>
                                  <td style={TD}><code style={{fontSize:10,background:T.statRow,padding:"2px 7px",borderRadius:5,color:T.text}}>{p.reference||"—"}</code></td>
                                  <td style={TD}><Tag bg={p.status==="confirmed"?"#E1F5EE":p.status==="pending"?"#FAEEDA":"#FCEBEB"} color={p.status==="confirmed"?"#0F6E56":p.status==="pending"?"#854F0B":"#A32D2D"}>{p.status||"confirmed"}</Tag></td>
                                  <td style={TD}><span style={{fontSize:11,color:T.subtext}}>{p.createdAt?new Date(p.createdAt).toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"}):"—"}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      <div style={{marginTop:12,padding:"11px 14px",background:T.statRow,borderRadius:10,display:"flex",justifyContent:"space-between"}}>
                        <span style={{fontSize:13,color:T.subtext,fontWeight:600}}>Total Confirmed</span>
                        <span style={{fontSize:17,fontWeight:800,color:"#0A7A4B"}}>KES {profPays.filter(p=>p.status==="confirmed").reduce((s,p)=>s+(p.amount||0),0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ PAYMENTS ═══ */}
              {page==="payments"&&(
                <div style={{animation:"fadeUp 0.3s ease"}}>
                  <div style={card()}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
                      <h2 style={{...cTit,margin:0}}>💳 Payment History</h2>
                      <div style={{background:'linear-gradient(135deg, #1E1B4B, #4F46E5)',color:'white',padding:"5px 12px",borderRadius:999,fontSize:12,fontWeight:700}}>
                        {payments.length} records · KES {payments.filter(p=>p.status==="confirmed").reduce((s,p)=>s+(p.amount||0),0).toLocaleString()}
                      </div>
                    </div>
                    {!payments.length?<Empty T={T} icon="💳" text="No payments yet"/>:(
                      <div style={{overflowX:"auto"}}>
                        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                          <thead><tr>{["#","Tenant","Amount","Reference","Status","Date",""].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                          <tbody>
                            {payments.map((p,i)=>(
                              <tr key={p._id} style={{background:i%2===0?T.rowAlt:T.card}}>
                                <td style={TD}><span style={{color:T.subtext,fontSize:11}}>{i+1}</span></td>
                                <td style={TD}><Av name={p.tenant?.name||"?"}/><span style={{fontWeight:600,color:T.text}}>{p.tenant?.name||"Unknown"}</span></td>
                                <td style={TD}><span style={{color:"#0A7A4B",fontWeight:800}}>KES {(p.amount||0).toLocaleString()}</span></td>
                                <td style={TD}><code style={{fontSize:10,background:T.statRow,padding:"2px 7px",borderRadius:5,color:T.text}}>{p.reference||"—"}</code></td>
                                <td style={TD}><Tag bg={p.status==="confirmed"?"#E1F5EE":p.status==="pending"?"#FAEEDA":"#FCEBEB"} color={p.status==="confirmed"?"#0F6E56":p.status==="pending"?"#854F0B":"#A32D2D"}>{p.status||"confirmed"}</Tag></td>
                                <td style={TD}><span style={{fontSize:11,color:T.subtext}}>{p.createdAt?new Date(p.createdAt).toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"}):"—"}</span></td>
                                <td style={TD}><button className="btn-red" style={{padding:"3px 8px",fontSize:10}} onClick={()=>setDelConf({type:"payment",id:p._id,name:`KES ${p.amount} payment`})}>🗑️</button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ═══ REPORTS ═══ */}
              {page==="reports"&&(
                <div style={{animation:"fadeUp 0.3s ease"}}>
                  <div style={card()}>
                    <h2 style={cTit}>📋 Monthly Report</h2>
                    <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
                      <div>
                        <Lbl T={T}>Month</Lbl>
                        <select className="inp" style={{width:"auto"}} value={rMonth} onChange={e=>setRMonth(Number(e.target.value))}>
                          {MONTHS.map((m,i)=><option key={m} value={i+1}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <Lbl T={T}>Year</Lbl>
                        <select className="inp" style={{width:"auto"}} value={rYear} onChange={e=>setRYear(Number(e.target.value))}>
                          {[2024,2025,2026].map(y=><option key={y}>{y}</option>)}
                        </select>
                      </div>
                      <button className="btn-green" onClick={genReport} disabled={rLoading}>{rLoading?"Loading...":"Generate"}</button>
                      {report&&<button className="btn-outline" onClick={()=>window.print()}>🖨️ Print</button>}
                    </div>
                  </div>
                  {report?(
                    <>
                      <div style={{textAlign:"center",marginBottom:14,padding:"18px",background:`linear-gradient(135deg,${T.sidebar},#0A3D2B)`,borderRadius:14,color:"white"}}>
                        <h2 className="ghv-title" style={{fontSize:18,marginBottom:4}}>GIFTED HANDS VENTURES</h2>
                        <p style={{color:"rgba(255,255,255,0.65)",fontSize:12}}>Rent Report — {MONTHS[report.month-1]} {report.year}</p>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:12}}>
                        {[
                          {l:"Period",      v:`${MONTHS[report.month-1]} ${report.year}`,bg:"linear-gradient(135deg,#1459A0,#2D7DD2)",icon:"📅"},
                          {l:"Total Income",v:`KES ${(report.totalIncome||0).toLocaleString()}`,bg:"linear-gradient(135deg,#1A4A1A,#2E8B2E)",icon:"💰"},
                          {l:"Transactions",v:report.transactions,bg:"linear-gradient(135deg,#1A1A6B,#534AB7)",icon:"🔢"},
                          {l:"Average",     v:report.transactions>0?`KES ${Math.round((report.totalIncome||0)/report.transactions).toLocaleString()}`:"KES 0",bg:"linear-gradient(135deg,#0A3D2B,#0A7A4B)",icon:"📊"},
                        ].map(c=>(
                          <div key={c.l} style={{background:c.bg,borderRadius:13,padding:"16px 14px",boxShadow:"0 4px 16px rgba(0,0,0,0.18)"}}>
                            <span style={{fontSize:22}}>{c.icon}</span>
                            <p style={{fontSize:18,fontWeight:800,color:"white",margin:"6px 0 3px"}}>{c.v}</p>
                            <p style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.7)"}}>{c.l}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  ):!rLoading&&(
                    <div style={{textAlign:"center",padding:"44px 0",color:T.subtext}}>
                      <p style={{fontSize:36,marginBottom:10}}>📋</p>
                      <p style={{fontWeight:600}}>Select month and year, then click Generate</p>
                    </div>
                  )}
                </div>
              )}

              {/* ═══ SMS ═══ */}
              {page==="sms"&&(
                <div style={{animation:"fadeUp 0.3s ease"}}>
                  <div style={card()}>
                    <h2 style={cTit}>📢 Broadcast to All Tenants</h2>
                    <p style={{fontSize:13,color:T.subtext,marginBottom:12}}>Send one message to all {tenants.length} tenants</p>
                    <textarea className="inp" rows={4} placeholder="Dear tenant, your rent is due. Please pay promptly. Thank you. — Gifted Hands Ventures"
                      value={broadcast} onChange={e=>setBroadcast(e.target.value)}/>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10,flexWrap:"wrap",gap:8}}>
                      <span style={{fontSize:11,color:T.subtext}}>{broadcast.length} chars · {tenants.length} recipients</span>
                      <button className="btn-green" onClick={sendBroadcast} disabled={broadcasting}>
                        {broadcasting?"Sending...":"📱 Send to All"}
                      </button>
                    </div>
                  </div>

                  {reminders.length>0&&(
                    <div style={card()}>
                      <h2 style={{...cTit,display:"flex",alignItems:"center",gap:8}}>⚠️ Due Soon <Tag bg="#FAEEDA" color="#854F0B">{reminders.length}</Tag></h2>
                      {reminders.map((r,i)=>(
                        <div key={i} style={{background:"#FAEEDA",borderRadius:10,padding:"11px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,marginBottom:8}}>
                          <div>
                            <p style={{fontWeight:700,color:"#854F0B",fontSize:13}}>{r.name}</p>
                            <p style={{fontSize:11,color:"#a06020",marginTop:1}}>{r.message}</p>
                          </div>
                          <button className="btn-orange" onClick={()=>{const t=tenants.find(x=>x.name===r.name);if(t)sendSMS(t._id,t.phone);}}>📱 Send</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={card()}>
                    <h2 style={{...cTit,marginBottom:12}}>📨 Individual SMS</h2>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {tenants.map(t=>(
                        <div key={t._id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:T.statRow,borderRadius:10,flexWrap:"wrap"}}>
                          <Av name={t.name}/>
                          <div style={{flex:1,minWidth:80}}>
                            <p style={{fontWeight:700,fontSize:13,color:T.text}}>{t.name}</p>
                            <p style={{fontSize:11,color:T.subtext}}>{t.phone}</p>
                          </div>
                          <input className="inp" placeholder="Custom message (optional)" style={{flex:2,minWidth:140}}
                            value={smsMsg[t._id]||''} onChange={e=>setSmsMsg(p=>({...p,[t._id]:e.target.value}))}/>
                          <button className="btn-orange" onClick={()=>sendSMS(t._id,t.phone)} disabled={smsBusy[t._id]}>
                            {smsBusy[t._id]?"...":"📱"}
                          </button>
                        </div>
                      ))}
                      {!tenants.length&&<Empty T={T} icon="👤" text="No tenants yet"/>}
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ SETTINGS ═══ */}
              {page==="settings"&&(
                <div style={{animation:"fadeUp 0.3s ease"}}>
                  <div style={card()}>
                    <h2 style={cTit}>🔐 Two-Factor Authentication</h2>
                    <TwoFactorSettings API={API} auth={auth} T={T} show={show} Lbl={Lbl}/>
                  </div>
                  <div style={card()}>
                    <h2 style={cTit}>🔔 Login Alert Settings</h2>
                    <p style={{fontSize:13,color:T.subtext,marginBottom:12}}>Email alerts are sent automatically when a new device logs into your account.</p>
                    <p style={{fontSize:12,color:T.subtext}}>SMS alerts are sent to the owner's phone on every login.</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      <Analytics />
    </>
  );
}