import { useState, useEffect, useRef, useCallback } from 'react';
import MpesaPayButton from './MpesaPayButton';

const API = "https://rental-system-backend-1t05.onrender.com";
const ADMIN_NAME = "Isaac Wekesa";

const LIGHT = {
  bg:"#F0F7F4", sidebar:"#0A2E1C", card:"#ffffff", cardBorder:"#D8EDE3",
  topbar:"#ffffff", topbarBorder:"#D8EDE3", text:"#0A2E1C", subtext:"#6B8F7A",
  input:"#ffffff", inputBorder:"#C5DDD0", rowAlt:"#F7FBF9", statRow:"#F7FBF9",
  accent:"#0A7A4B", accentLight:"#D8EDE3", gold:"#C8960A", goldLight:"#FEF6E0",
  modalBg:"rgba(0,0,0,0.45)",
};
const DARK = {
  bg:"#071510", sidebar:"#040E09", card:"#0E2318", cardBorder:"#1A3828",
  topbar:"#0E2318", topbarBorder:"#1A3828", text:"#D8EDE3", subtext:"#6B8F7A",
  input:"#0E2318", inputBorder:"#1A3828", rowAlt:"#0A1E14", statRow:"#0A1E14",
  accent:"#1DB87A", accentLight:"#0E2318", gold:"#F0C030", goldLight:"#1A1400",
  modalBg:"rgba(0,0,0,0.72)",
};

function injectStyles(T) {
  let el = document.getElementById("ghv-styles");
  if (!el) { el = document.createElement("style"); el.id = "ghv-styles"; document.head.appendChild(el); }
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    html,body{height:100%;overflow:hidden;}
    body{font-family:'DM Sans',sans-serif;background:${T.bg};color:${T.text};transition:background 0.3s,color 0.3s;}
    @keyframes fadeUp  {from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
    @keyframes slideIn {from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:none}}
    @keyframes shimmer {0%{background-position:200% 0}100%{background-position:-200% 0}}
    @keyframes modalIn {from{opacity:0;transform:scale(0.93)}to{opacity:1;transform:scale(1)}}
    @keyframes glow    {0%,100%{text-shadow:0 0 20px rgba(212,160,23,0.4)}50%{text-shadow:0 0 50px rgba(212,160,23,0.9)}}

    .ghv-title{
      font-family:'Playfair Display',serif;
      background:linear-gradient(135deg,${T.gold} 0%,#F7D76B 50%,${T.gold} 100%);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;
      background-clip:text;animation:glow 3s ease-in-out infinite;
    }

    .inp{
      width:100%;padding:11px 14px;border:1.5px solid ${T.inputBorder};border-radius:10px;
      font-size:14px;font-family:'DM Sans',sans-serif;outline:none;
      background:${T.input};color:${T.text};transition:border 0.2s,box-shadow 0.2s;
    }
    .inp:focus{border-color:${T.accent};box-shadow:0 0 0 3px ${T.accentLight}40;}
    .inp[readonly]{opacity:0.6;cursor:default;}
    textarea.inp{resize:vertical;}

    .btn-primary{
      padding:11px 22px;background:linear-gradient(135deg,#0A7A4B,#1DB87A);color:white;
      border:none;border-radius:10px;font-size:14px;font-weight:700;
      font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.2s;
      box-shadow:0 4px 15px rgba(10,122,75,0.3);white-space:nowrap;
    }
    .btn-primary:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 24px rgba(10,122,75,0.4);}
    .btn-primary:active{transform:translateY(0);}
    .btn-primary:disabled{opacity:0.5;cursor:not-allowed;transform:none;}

    .btn-blue{
      padding:10px 18px;background:linear-gradient(135deg,#1459A0,#2D7DD2);color:white;
      border:none;border-radius:10px;font-size:13px;font-weight:700;
      font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.2s;white-space:nowrap;
    }
    .btn-blue:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(20,89,160,0.4);}

    .btn-gold{
      padding:10px 18px;background:linear-gradient(135deg,#8B5E00,${T.gold});color:white;
      border:none;border-radius:10px;font-size:13px;font-weight:700;
      font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.2s;white-space:nowrap;
    }
    .btn-gold:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(200,150,10,0.4);}

    .btn-danger{
      padding:8px 14px;background:transparent;color:#D63B3B;
      border:1.5px solid #D63B3B;border-radius:9px;font-size:12px;font-weight:700;
      font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.2s;white-space:nowrap;
    }
    .btn-danger:hover{background:#D63B3B;color:white;}

    .btn-edit{
      padding:8px 14px;background:transparent;color:${T.accent};
      border:1.5px solid ${T.accent};border-radius:9px;font-size:12px;font-weight:700;
      font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.2s;white-space:nowrap;
    }
    .btn-edit:hover{background:${T.accent};color:white;}

    .btn-outline{
      padding:8px 16px;background:transparent;color:${T.accent};
      border:1.5px solid ${T.cardBorder};border-radius:9px;font-size:13px;font-weight:600;
      font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.2s;
    }
    .btn-outline:hover{background:${T.accentLight};border-color:${T.accent};}

    .btn-back{
      display:inline-flex;align-items:center;gap:8px;
      padding:10px 20px;background:${T.card};color:${T.accent};
      border:2px solid ${T.accent};border-radius:10px;font-size:14px;font-weight:700;
      font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.2s;
    }
    .btn-back:hover{background:${T.accent};color:white;transform:translateX(-3px);}

    .btn-sms{
      padding:9px 14px;background:linear-gradient(135deg,#7B3F00,#C47D1A);color:white;
      border:none;border-radius:9px;font-size:13px;font-weight:700;
      font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.2s;white-space:nowrap;
    }
    .btn-sms:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 14px rgba(196,125,26,0.4);}
    .btn-sms:disabled{opacity:0.5;cursor:not-allowed;}

    .btn-theme{
      padding:8px 12px;border-radius:9px;border:1.5px solid ${T.inputBorder};
      background:${T.input};color:${T.text};font-size:17px;cursor:pointer;
      transition:all 0.2s;line-height:1;
    }
    .btn-theme:hover{border-color:${T.accent};transform:rotate(15deg);}

    .nav-item{
      display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;
      margin-bottom:3px;font-size:14px;font-weight:500;cursor:pointer;
      color:#7AAF8A;transition:all 0.18s;user-select:none;
    }
    .nav-item:hover{background:rgba(255,255,255,0.07);color:white;}
    .nav-item.active{background:linear-gradient(135deg,#0A7A4B,#1DB87A);color:white;box-shadow:0 4px 14px rgba(10,122,75,0.4);}
    .nav-item.danger{color:#E07070;}
    .nav-item.danger:hover{background:rgba(224,112,112,0.1);}

    .card-h{transition:box-shadow 0.2s,transform 0.2s;}
    .card-h:hover{box-shadow:0 8px 32px rgba(0,0,0,0.12);transform:translateY(-2px);}

    .sinp{
      padding:10px 14px 10px 40px;border:1.5px solid ${T.inputBorder};border-radius:10px;
      font-size:14px;font-family:'DM Sans',sans-serif;outline:none;
      background:${T.input};color:${T.text};width:100%;transition:border 0.2s;
    }
    .sinp:focus{border-color:${T.accent};}

    .sk{
      background:linear-gradient(90deg,${T.cardBorder} 25%,${T.rowAlt} 50%,${T.cardBorder} 75%);
      background-size:200% 100%;animation:shimmer 1.5s infinite;
      border-radius:8px;display:block;
    }

    .modal-ov{
      position:fixed;inset:0;background:${T.modalBg};
      display:flex;align-items:center;justify-content:center;
      z-index:1000;padding:20px;backdrop-filter:blur(4px);
    }
    .modal-bx{
      background:${T.card};border-radius:20px;padding:30px;
      width:100%;max-width:500px;animation:modalIn 0.25s ease;
      box-shadow:0 24px 64px rgba(0,0,0,0.35);max-height:92vh;overflow-y:auto;
      border:1px solid ${T.cardBorder};
    }

    .tag{display:inline-flex;align-items:center;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:700;}

    ::-webkit-scrollbar{width:6px;height:6px;}
    ::-webkit-scrollbar-track{background:transparent;}
    ::-webkit-scrollbar-thumb{background:${T.cardBorder};border-radius:99px;}
    ::-webkit-scrollbar-thumb:hover{background:${T.accent};}

    @media print{
      .no-print{display:none!important;}
      body{background:white!important;color:black!important;overflow:auto!important;}
    }

    /* ── MOBILE FIX ── */
    .sidebar-wrap{
      width:250px;
      background:${T.sidebar};
      display:flex;
      flex-direction:column;
      flex-shrink:0;
      overflow-y:auto;
      overflow-x:hidden;
      transition:transform 0.3s ease;
    }

    @media(max-width:768px){
      .sidebar-wrap{
        position:fixed;
        top:0;left:0;
        height:100vh;
        z-index:300;
        transform:translateX(-100%);
      }
      .sidebar-wrap.open{
        transform:translateX(0);
        box-shadow:4px 0 24px rgba(0,0,0,0.4);
      }
      .mobile-pad{padding:16px 14px!important;}
      .mobile-grid1{grid-template-columns:1fr!important;}
      .mobile-hide{display:none!important;}
    }

    @media(min-width:769px){
      .sidebar-wrap{
        position:relative;
        transform:none!important;
      }
      .sidebar-wrap.closed{
        width:0;
        overflow:hidden;
        padding:0;
      }
    }
  `;
}

let _tid = 0;
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type="info") => {
    const id = ++_tid;
    setToasts(p => [...p, {id,msg,type}]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  return {toasts, show};
}

function Toasts({toasts}) {
  return (
    <div style={{position:"fixed",top:20,right:20,zIndex:9999,display:"flex",flexDirection:"column",gap:8}}>
      {toasts.map(t => (
        <div key={t.id} style={{
          padding:"13px 20px",borderRadius:12,fontSize:14,fontWeight:600,
          background:t.type==="success"?"linear-gradient(135deg,#0A7A4B,#1DB87A)":t.type==="error"?"linear-gradient(135deg,#A32D2D,#E24B4A)":"linear-gradient(135deg,#1459A0,#2D7DD2)",
          color:"white",boxShadow:"0 8px 28px rgba(0,0,0,0.3)",minWidth:240,
          animation:"slideIn 0.3s ease",display:"flex",alignItems:"center",gap:10,
        }}>
          <span style={{fontSize:18}}>{t.type==="success"?"✓":t.type==="error"?"✕":"ℹ"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

function Modal({title, onClose, children, T}) {
  return (
    <div className="modal-ov" onClick={e => e.target===e.currentTarget&&onClose()}>
      <div className="modal-bx">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
          <h2 style={{fontSize:18,fontWeight:700,color:T.text}}>{title}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:24,cursor:"pointer",color:T.subtext,lineHeight:1,padding:"0 4px"}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{padding:"20px",borderRadius:16,border:"1px solid #d8ede3",background:"white",marginBottom:12}}>
      <div style={{display:"flex",gap:12,marginBottom:14}}>
        <span className="sk" style={{width:48,height:48,borderRadius:14,flexShrink:0}}/>
        <div style={{flex:1}}>
          <span className="sk" style={{width:"60%",height:16,marginBottom:8}}/>
          <span className="sk" style={{width:"40%",height:13}}/>
        </div>
      </div>
      <span className="sk" style={{width:"100%",height:8,marginBottom:8}}/>
      <span className="sk" style={{width:"75%",height:8}}/>
    </div>
  );
}

function Av({name, size=30}) {
  return (
    <div style={{width:size,height:size,minWidth:size,background:"linear-gradient(135deg,#0A7A4B,#1DB87A)",borderRadius:"50%",display:"inline-flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:size*0.42,color:"white",marginRight:8,boxShadow:"0 2px 8px rgba(10,122,75,0.3)"}}>
      {name?.[0]?.toUpperCase()||"?"}
    </div>
  );
}
function Tag({bg, color, children}) {
  return <span className="tag" style={{background:bg,color}}>{children}</span>;
}
function Empty({T, icon, text, sub}) {
  return (
    <div style={{textAlign:"center",padding:"52px 0"}}>
      <p style={{fontSize:42,marginBottom:12}}>{icon}</p>
      <p style={{fontWeight:700,color:T?.subtext||"#aaa",fontSize:16}}>{text}</p>
      {sub&&<p style={{fontSize:13,marginTop:6,color:T?.subtext||"#bbb"}}>{sub}</p>}
    </div>
  );
}
function Field({label:lbl, children, labelStyle}) {
  return (
    <div>
      <label style={{fontSize:12,fontWeight:600,color:"#6B8F7A",display:"block",marginBottom:6,...labelStyle}}>{lbl}</label>
      {children}
    </div>
  );
}

export default function App() {
  const {toasts, show} = useToast();
  const [dark, setDark] = useState(() => localStorage.getItem("ghv-theme")==="dark");
  const T = dark ? DARK : LIGHT;

  useEffect(() => {
    injectStyles(T);
    localStorage.setItem("ghv-theme", dark?"dark":"light");
  }, [dark, T]);

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [loggedIn, setLoggedIn]         = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const [houses, setHouses]           = useState([]);
  const [tenants, setTenants]         = useState([]);
  const [balances, setBalances]       = useState({});
  const [amounts, setAmounts]         = useState({});
  const [dashData, setDashData]       = useState(null);
  const [allPayments, setAllPayments] = useState([]);
  const [reminders, setReminders]     = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  const [houseNumber, setHouseNumber] = useState('');
  const [location, setLocation]       = useState('');
  const [rent, setRent]               = useState('');
  const [apartment, setApartment]     = useState('A');
  const [bedrooms, setBedrooms]       = useState(1);

  const [tName, setTName]   = useState('');
  const [tPhone, setTPhone] = useState('');
  const [tId, setTId]       = useState('');

  const [tenantSearch, setTenantSearch] = useState('');
  const [houseSearch, setHouseSearch]   = useState('');
  const [houseFilter, setHouseFilter]   = useState('all');

  const [editTenant, setEditTenant]       = useState(null);
  const [editHouse, setEditHouse]         = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [profileTenant, setProfileTenant]     = useState(null);
  const [profilePayments, setProfilePayments] = useState([]);
  const [prevPage, setPrevPage]               = useState('tenants');

  const [broadcastMsg, setBroadcastMsg]         = useState('');
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [smsSending, setSmsSending]             = useState({});
  const [customMsg, setCustomMsg]               = useState({});

  const now = new Date();
  const [repMonth, setRepMonth]     = useState(now.getMonth()+1);
  const [repYear, setRepYear]       = useState(now.getFullYear());
  const [report, setReport]         = useState(null);
  const [repLoading, setRepLoading] = useState(false);

  const [page, setPage]               = useState('dashboard');
  // ✅ FIX 1: Start closed on mobile, open on desktop
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const isMobile = () => window.innerWidth <= 768;

  const isFetching = useRef(false);
  const apartments = ["A","B","C","D","E"];
  const MONTHS     = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const getToken = () => { const t=localStorage.getItem('token'); return(!t||t==="undefined"||t==="null")?null:t; };
  const authH    = () => { const t=getToken(); return t?{Authorization:`Bearer ${t}`}:{}; };

  useEffect(() => { if(getToken()) setLoggedIn(true); }, []);
  useEffect(() => { const m={1:6000,2:15000,3:20000,4:25000}; setRent(m[bedrooms]||''); }, [bedrooms]);

  // ✅ FIX 2: Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const safeFetch = async (url, opts={}) => {
    try {
      const res=await fetch(url,opts);
      const data=await res.json().catch(()=>null);
      if(res.status===401){localStorage.clear();setLoggedIn(false);show("Session expired","error");return null;}
      if(!res.ok){show(data?.message||"Something went wrong","error");return null;}
      return data;
    } catch { show("Cannot reach server. Is backend running?","error"); return null; }
  };

  const loadBalances = async (list) => {
    const out={};
    await Promise.all(list.map(async t => {
      const r=await safeFetch(`${API}/api/payments/balance/${t._id}`,{headers:authH()});
      out[t._id]=r||{rent:0,paid:0,balance:0};
    }));
    setBalances(out);
  };

  const loadAll = async () => {
    if(isFetching.current) return;
    isFetching.current=true; setDataLoading(true);
    const [h,t,dash,pays,rems]=await Promise.all([
      safeFetch(`${API}/api/houses`,    {headers:authH()}),
      safeFetch(`${API}/api/tenants`,   {headers:authH()}),
      safeFetch(`${API}/api/dashboard`, {headers:authH()}),
      safeFetch(`${API}/api/payments`,  {headers:authH()}),
      safeFetch(`${API}/api/reminders`, {headers:authH()}),
    ]);
    const tList=Array.isArray(t)?t:[];
    setHouses(Array.isArray(h)?h:[]);
    setTenants(tList);
    setDashData(dash||null);
    setAllPayments(Array.isArray(pays)?pays:[]);
    setReminders(Array.isArray(rems)?rems:[]);
    await loadBalances(tList);
    setDataLoading(false); isFetching.current=false;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(()=>{ if(loggedIn) loadAll(); },[loggedIn]);

  // ✅ FIX 3: Navigate and close sidebar on mobile
  const navigate = (id) => {
    setPage(id);
    if(isMobile()) setSidebarOpen(false);
  };

  const handleLogin = async () => {
    if(!email||!password){show("Enter email and password","error");return;}
    setLoginLoading(true);
    const res=await safeFetch(`${API}/api/auth/login`,{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({email,password})
    });
    setLoginLoading(false);
    if(res?.token){
      localStorage.setItem("token",res.token);
      setLoginSuccess(true);
      setTimeout(()=>{setLoggedIn(true);setLoginSuccess(false);},1800);
    } else show("Invalid email or password","error");
  };

  const handleLogout = () => {
    localStorage.clear();setLoggedIn(false);
    setHouses([]);setTenants([]);setBalances({});setDashData(null);setAllPayments([]);
  };

  const addHouse = async () => {
    if(!houseNumber||!location||!rent){show("Fill all house fields","error");return;}
    const res=await safeFetch(`${API}/api/houses`,{
      method:"POST",headers:{"Content-Type":"application/json",...authH()},
      body:JSON.stringify({houseNumber,location,rent:Number(rent),apartment,bedrooms})
    });
    if(res){show("House added!","success");setHouseNumber('');setLocation('');setBedrooms(1);setApartment('A');loadAll();}
  };

  const saveEditHouse = async () => {
    const res=await safeFetch(`${API}/api/houses/${editHouse._id}`,{
      method:"PUT",headers:{"Content-Type":"application/json",...authH()},
      body:JSON.stringify({houseNumber:editHouse.houseNumber,location:editHouse.location,rent:Number(editHouse.rent),bedrooms:Number(editHouse.bedrooms)})
    });
    if(res){show("House updated!","success");setEditHouse(null);loadAll();}
  };

  const addTenant = async () => {
    if(!tName||!tPhone){show("Name and phone required","error");return;}
    const res=await safeFetch(`${API}/api/tenants`,{
      method:"POST",headers:{"Content-Type":"application/json",...authH()},
      body:JSON.stringify({name:tName,phone:tPhone,idNumber:tId})
    });
    if(res){show("Tenant added!","success");setTName('');setTPhone('');setTId('');loadAll();}
  };

  const saveEditTenant = async () => {
    const res=await safeFetch(`${API}/api/tenants/${editTenant._id}`,{
      method:"PUT",headers:{"Content-Type":"application/json",...authH()},
      body:JSON.stringify({name:editTenant.name,phone:editTenant.phone,idNumber:editTenant.idNumber})
    });
    if(res){show("Tenant updated!","success");setEditTenant(null);loadAll();}
  };

  const handleDelete = async () => {
    if(!confirmDelete) return;
    const {type,id} = confirmDelete;
    if(type==="tenant")  setTenants(p=>p.filter(x=>x._id!==id));
    if(type==="house")   setHouses(p=>p.filter(x=>x._id!==id));
    if(type==="payment") setAllPayments(p=>p.filter(x=>x._id!==id));
    setConfirmDelete(null);
    show("Deleted successfully","success");
    const urlMap={
      tenant:`${API}/api/tenants/${id}`,
      house:`${API}/api/houses/${id}`,
      payment:`${API}/api/payments/${id}`,
    };
    await safeFetch(urlMap[type],{method:"DELETE",headers:authH()});
    loadAll();
  };

  const assignHouse = async (tenantId,houseId) => {
    if(!houseId) return;
    const house=houses.find(h=>h._id===houseId);
    if(house?.status==="occupied"){show("That house is already occupied","error");return;}
    const res=await safeFetch(`${API}/api/tenants/${tenantId}/assign`,{
      method:"PUT",headers:{"Content-Type":"application/json",...authH()},
      body:JSON.stringify({houseId})
    });
    if(res){show("House assigned!","success");loadAll();}
  };

  const makePayment = async (tenantId) => {
    const amount=Number(amounts[tenantId]);
    if(!amount||amount<=0){show("Enter a valid amount","error");return;}
    const res=await safeFetch(`${API}/api/payments`,{
      method:"POST",headers:{"Content-Type":"application/json",...authH()},
      body:JSON.stringify({tenantId,amount,reference:"CASH-"+Date.now()})
    });
    if(res){show("Payment recorded!","success");setAmounts(p=>({...p,[tenantId]:''}));loadAll();}
  };

  const openProfile = async (tenant) => {
    setPrevPage(page);
    setProfileTenant(tenant);
    const pays=await safeFetch(`${API}/api/payments`,{headers:authH()});
    const filtered=(pays||[]).filter(p=>String(p.tenant?._id||p.tenant)===String(tenant._id));
    setProfilePayments(filtered);
    setPage('profile');
    if(isMobile()) setSidebarOpen(false);
  };

  const goBack = () => setPage(prevPage);

  const sendSMS = async (tenantId,ph) => {
    const msg=customMsg[tenantId]||`Dear tenant, your rent is due. Please pay promptly to avoid penalties. Thank you. - Gifted Hands Ventures`;
    setSmsSending(p=>({...p,[tenantId]:true}));
    const res=await safeFetch(`${API}/api/sms/send`,{
      method:"POST",headers:{"Content-Type":"application/json",...authH()},
      body:JSON.stringify({phone:ph,message:msg})
    });
    setSmsSending(p=>({...p,[tenantId]:false}));
    if(res) show("SMS sent!","success");
  };

  const sendBroadcast = async () => {
    if(!broadcastMsg.trim()){show("Type a message first","error");return;}
    setBroadcastSending(true);
    const res=await safeFetch(`${API}/api/sms/broadcast`,{
      method:"POST",headers:{"Content-Type":"application/json",...authH()},
      body:JSON.stringify({message:broadcastMsg})
    });
    setBroadcastSending(false);
    if(res){show(`Sent to ${res.sent} tenants!`,"success");setBroadcastMsg('');}
  };

  const loadReport = async () => {
    setRepLoading(true);
    const res=await safeFetch(`${API}/api/reports/monthly?month=${repMonth}&year=${repYear}`,{headers:authH()});
    setRepLoading(false);
    if(res) setReport(res);
  };

  const filteredTenants = tenants.filter(t =>
    t.name?.toLowerCase().includes(tenantSearch.toLowerCase())||
    t.phone?.includes(tenantSearch)||
    t.idNumber?.includes(tenantSearch)
  );
  const filteredHouses = houses.filter(h => {
    const ms=h.houseNumber?.toLowerCase().includes(houseSearch.toLowerCase())||h.location?.toLowerCase().includes(houseSearch.toLowerCase());
    const mf=houseFilter==="all"||h.status===houseFilter;
    return ms&&mf;
  });

  const C  = (extra={}) => ({background:T.card,borderRadius:16,border:`1px solid ${T.cardBorder}`,padding:"22px 24px",marginBottom:18,...extra});
  const CT = {fontSize:16,fontWeight:700,color:T.text,margin:"0 0 18px"};
  const TH = {textAlign:"left",padding:"10px 14px",fontSize:11,fontWeight:700,color:T.subtext,borderBottom:`2px solid ${T.cardBorder}`,whiteSpace:"nowrap",textTransform:"uppercase",letterSpacing:"0.7px"};
  const TD = {padding:"12px 14px",verticalAlign:"middle",color:T.text};

  if(!loggedIn) return (
    <>
      <Toasts toasts={toasts}/>
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:dark?"linear-gradient(135deg,#040E09,#071510)":"linear-gradient(135deg,#0A2E1C,#1A5C38)",position:"relative",overflow:"hidden"}}>
        {[...Array(5)].map((_,i)=>(
          <div key={i} style={{position:"absolute",borderRadius:"50%",border:"1px solid rgba(212,160,23,0.15)",width:180+i*120,height:180+i*120,top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}/>
        ))}
        <button className="btn-theme" onClick={()=>setDark(d=>!d)} style={{position:"fixed",top:20,right:20,zIndex:10}}>{dark?"☀️":"🌙"}</button>
        <div style={{background:dark?"rgba(14,35,24,0.97)":"rgba(255,255,255,0.97)",borderRadius:24,padding:"40px 32px",width:"min(420px, 92vw)",boxShadow:"0 24px 64px rgba(0,0,0,0.45)",position:"relative",zIndex:1,border:`1px solid ${T.cardBorder}`}}>
          <div style={{textAlign:"center",marginBottom:32}}>
            <div style={{width:72,height:72,background:"linear-gradient(135deg,#0A7A4B,#1DB87A)",borderRadius:20,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:34,boxShadow:"0 8px 28px rgba(10,122,75,0.45)"}}>🏢</div>
            <h1 className="ghv-title" style={{fontSize:26,letterSpacing:"1px",lineHeight:1.2}}>GIFTED HANDS</h1>
            <h1 className="ghv-title" style={{fontSize:26,letterSpacing:"1px"}}>VENTURES</h1>
            <div style={{width:60,height:3,background:`linear-gradient(90deg,${T.gold},transparent)`,margin:"12px auto 8px"}}/>
            <p style={{fontSize:13,color:T.subtext}}>Property Management System</p>
          </div>
          {loginSuccess ? (
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:50,marginBottom:12}}>🎉</div>
              <h2 style={{color:"#1DB87A",fontSize:18,fontWeight:600,marginBottom:4}}>Welcome back,</h2>
              <h2 style={{color:T.gold,fontSize:22,fontWeight:800,fontFamily:"'Playfair Display',serif"}}>{ADMIN_NAME}!</h2>
              <p style={{color:T.subtext,fontSize:13,marginTop:8}}>Loading your dashboard...</p>
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <Field lbl="Email Address" labelStyle={{color:dark?"#7AAF8A":"#4A6A5A"}}>
                <input className="inp" type="email" placeholder="admin@rentals.co.ke"
                  value={email} onChange={e=>setEmail(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
              </Field>
              <Field lbl="Password" labelStyle={{color:dark?"#7AAF8A":"#4A6A5A"}}>
                <input className="inp" type="password" placeholder="••••••••"
                  value={password} onChange={e=>setPassword(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
              </Field>
              <button className="btn-primary" onClick={handleLogin} disabled={loginLoading}
                style={{marginTop:6,width:"100%",padding:"13px 0",fontSize:15}}>
                {loginLoading?"Signing in...":"Sign In →"}
              </button>
            </div>
          )}
          <p style={{textAlign:"center",fontSize:11,color:T.subtext,marginTop:24}}>
            Gifted Hands Ventures © {new Date().getFullYear()} · All Rights Reserved
          </p>
        </div>
      </div>
    </>
  );

  const navItems = [
    {id:"dashboard",label:"Dashboard",   icon:"📊"},
    {id:"houses",   label:"Houses",      icon:"🏠"},
    {id:"tenants",  label:"Tenants",     icon:"👤"},
    {id:"payments", label:"Payments",    icon:"💳"},
    {id:"reports",  label:"Reports",     icon:"📋"},
    {id:"sms",      label:"SMS & Alerts",icon:"📱"},
  ];
  const occupiedCount = houses.filter(h=>h.status==="occupied").length;
  const vacantCount   = houses.filter(h=>h.status==="vacant").length;
  const currentNav    = navItems.find(n=>n.id===page);

  return (
    <>
      <Toasts toasts={toasts}/>

      {editTenant&&(
        <Modal title="✏️ Edit Tenant" onClose={()=>setEditTenant(null)} T={T}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Field lbl="Full Name"><input className="inp" value={editTenant.name} onChange={e=>setEditTenant(p=>({...p,name:e.target.value}))}/></Field>
            <Field lbl="Phone"><input className="inp" value={editTenant.phone} onChange={e=>setEditTenant(p=>({...p,phone:e.target.value}))}/></Field>
            <Field lbl="ID Number"><input className="inp" value={editTenant.idNumber||''} onChange={e=>setEditTenant(p=>({...p,idNumber:e.target.value}))}/></Field>
            <div style={{display:"flex",gap:10,marginTop:8}}>
              <button className="btn-primary" onClick={saveEditTenant} style={{flex:1}}>💾 Save Changes</button>
              <button className="btn-outline" onClick={()=>setEditTenant(null)} style={{flex:1}}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {editHouse&&(
        <Modal title="✏️ Edit House" onClose={()=>setEditHouse(null)} T={T}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Field lbl="House Number"><input className="inp" value={editHouse.houseNumber} onChange={e=>setEditHouse(p=>({...p,houseNumber:e.target.value}))}/></Field>
            <Field lbl="Location"><input className="inp" value={editHouse.location} onChange={e=>setEditHouse(p=>({...p,location:e.target.value}))}/></Field>
            <Field lbl="Rent (KES)"><input className="inp" type="number" value={editHouse.rent} onChange={e=>setEditHouse(p=>({...p,rent:e.target.value}))}/></Field>
            <Field lbl="Bedrooms">
              <select className="inp" value={editHouse.bedrooms} onChange={e=>setEditHouse(p=>({...p,bedrooms:e.target.value}))}>
                {[1,2,3,4].map(n=><option key={n} value={n}>{n} Bedroom{n>1?"s":""}</option>)}
              </select>
            </Field>
            <div style={{display:"flex",gap:10,marginTop:8}}>
              <button className="btn-primary" onClick={saveEditHouse} style={{flex:1}}>💾 Save Changes</button>
              <button className="btn-outline" onClick={()=>setEditHouse(null)} style={{flex:1}}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}

      {confirmDelete&&(
        <Modal title="⚠️ Confirm Delete" onClose={()=>setConfirmDelete(null)} T={T}>
          <p style={{color:T.subtext,fontSize:14,marginBottom:22,lineHeight:1.7}}>
            Are you sure you want to delete <strong style={{color:T.text}}>{confirmDelete.name}</strong>? This cannot be undone.
          </p>
          <div style={{display:"flex",gap:10}}>
            <button className="btn-danger" onClick={handleDelete} style={{flex:1,padding:"12px 0",fontSize:14}}>🗑️ Yes, Delete</button>
            <button className="btn-outline" onClick={()=>setConfirmDelete(null)} style={{flex:1,padding:"12px 0"}}>Cancel</button>
          </div>
        </Modal>
      )}

      <div style={{display:"flex",height:"100vh",overflow:"hidden",position:"relative"}}>

        {/* ✅ FIX 4: Mobile overlay — tap outside to close sidebar */}
        {sidebarOpen && isMobile() && (
          <div onClick={()=>setSidebarOpen(false)}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:299}}/>
        )}

        {/* SIDEBAR */}
        <div className={`sidebar-wrap${sidebarOpen?" open":""}`}>
          <div style={{padding:"22px 18px 14px",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:44,height:44,background:"linear-gradient(135deg,#0A7A4B,#1DB87A)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:"0 4px 16px rgba(10,122,75,0.4)",flexShrink:0}}>🏢</div>
              <div>
                <p className="ghv-title" style={{fontSize:10,letterSpacing:"1.5px",lineHeight:1.4}}>GIFTED HANDS</p>
                <p className="ghv-title" style={{fontSize:10,letterSpacing:"1.5px"}}>VENTURES</p>
              </div>
            </div>
          </div>

          <div style={{padding:"12px 18px",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:36,height:36,background:`linear-gradient(135deg,#8B5E00,${T.gold})`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:"#0A2E1C",flexShrink:0}}>
                {ADMIN_NAME.split(' ').map(n=>n[0]).join('')}
              </div>
              <div>
                <p style={{color:"rgba(255,255,255,0.6)",fontSize:11}}>Welcome back,</p>
                <p style={{color:T.gold,fontSize:12,fontWeight:700}}>{ADMIN_NAME}</p>
              </div>
            </div>
          </div>

          <div style={{margin:"12px 10px",background:"rgba(29,184,122,0.08)",borderRadius:10,padding:"10px 12px",flexShrink:0}}>
            {[
              {l:"Occupied",val:occupiedCount,  c:"#1DB87A"},
              {l:"Vacant",  val:vacantCount,    c:T.gold},
              {l:"Tenants", val:tenants.length, c:"#5B8DEF"},
              {l:"Overdue", val:dashData?.overdueCount??"—",c:"#E07070"},
            ].map(s=>(
              <div key={s.l} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                <span style={{color:"#6B9F7A"}}>{s.l}</span>
                <span style={{color:s.c,fontWeight:700}}>{s.val}</span>
              </div>
            ))}
          </div>

          <nav style={{padding:"0 8px",flex:1}}>
            <p style={{fontSize:10,fontWeight:700,color:"#2A5A3A",textTransform:"uppercase",letterSpacing:1.5,padding:"0 6px 8px"}}>Navigation</p>
            {navItems.map(item=>(
              <div key={item.id} className={`nav-item${page===item.id?" active":""}`}
                onClick={()=>navigate(item.id)}>
                <span style={{fontSize:17}}>{item.icon}</span>
                {item.label}
                {item.id==="sms"&&reminders.length>0&&(
                  <span style={{marginLeft:"auto",background:"#E07070",color:"white",fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:999}}>{reminders.length}</span>
                )}
              </div>
            ))}
          </nav>

          <div style={{padding:"10px 8px 20px",flexShrink:0}}>
            <div className="nav-item danger" onClick={handleLogout}>
              <span style={{fontSize:17}}>🚪</span> Logout
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:T.bg,minWidth:0}}>

          {/* Topbar */}
          <div className="no-print" style={{background:T.topbar,borderBottom:`1px solid ${T.topbarBorder}`,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,zIndex:50}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button onClick={()=>setSidebarOpen(o=>!o)}
                style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:T.subtext,lineHeight:1,padding:"4px",borderRadius:8}}>☰</button>
              <div>
                <h1 style={{fontSize:16,fontWeight:700,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"40vw"}}>
                  {page==="profile"&&profileTenant?`👤 ${profileTenant.name}`:currentNav?`${currentNav.icon} ${currentNav.label}`:""}
                </h1>
                <p style={{fontSize:10,color:T.subtext,marginTop:1}}>
                  {new Date().toLocaleDateString("en-KE",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}
                </p>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              {reminders.length>0&&(
                <div style={{background:"#FCEBEB",color:"#A32D2D",fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:999}}>⚠️ {reminders.length}</div>
              )}
              <button className="btn-outline" onClick={loadAll} style={{padding:"6px 12px",fontSize:12}}>↻</button>
              <button className="btn-theme" onClick={()=>setDark(d=>!d)}>{dark?"☀️":"🌙"}</button>
              <div style={{width:32,height:32,background:`linear-gradient(135deg,#8B5E00,${T.gold})`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#0A2E1C",fontSize:12}}>
                {ADMIN_NAME.split(' ').map(n=>n[0]).join('')}
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div style={{flex:1,overflowY:"auto",overflowX:"hidden"}}>
            <div style={{padding:"16px",maxWidth:1100,margin:"0 auto"}}>

              {/* DASHBOARD */}
              {page==="dashboard"&&(
                <div style={{animation:"fadeUp 0.35s ease"}}>
                  {dataLoading?(
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:18}}>
                      {[...Array(6)].map((_,i)=><span key={i} className="sk" style={{height:100,borderRadius:14}}/>)}
                    </div>
                  ):!dashData?<p style={{color:T.subtext}}>Loading dashboard...</p>:(
                    <>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:18}}>
                        {[
                          {l:"Total Houses", v:dashData.totalHouses,  bg:"linear-gradient(135deg,#0A3D2B,#0A7A4B)",icon:"🏠"},
                          {l:"Occupied",     v:dashData.occupied,     bg:"linear-gradient(135deg,#1459A0,#2D7DD2)",icon:"✅"},
                          {l:"Vacant",       v:dashData.available,    bg:"linear-gradient(135deg,#7B4F00,#C8960A)",icon:"🔑"},
                          {l:"Total Income", v:`KES ${(dashData.totalIncome||0).toLocaleString()}`,bg:"linear-gradient(135deg,#1A4A1A,#2E8B2E)",icon:"💰",sm:true},
                          {l:"Overdue",      v:dashData.overdueCount, bg:dashData.overdueCount>0?"linear-gradient(135deg,#6B1A1A,#D63B3B)":"linear-gradient(135deg,#0A3D2B,#0A7A4B)",icon:dashData.overdueCount>0?"⚠️":"✔️"},
                          {l:"Tenants",      v:tenants.length,        bg:"linear-gradient(135deg,#1A1A6B,#534AB7)",icon:"👤"},
                        ].map(c=>(
                          <div key={c.l} className="card-h" style={{background:c.bg,borderRadius:14,padding:"16px 14px",boxShadow:"0 4px 20px rgba(0,0,0,0.18)"}}>
                            <span style={{fontSize:22}}>{c.icon}</span>
                            <p style={{fontSize:c.sm?15:24,fontWeight:800,color:"white",margin:"6px 0 3px"}}>{c.v}</p>
                            <p style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.7)"}}>{c.l}</p>
                          </div>
                        ))}
                      </div>

                      <div style={C()}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                          <span style={{fontSize:14,fontWeight:700,color:T.text}}>Occupancy Rate</span>
                          <span style={{fontSize:18,fontWeight:800,color:T.accent}}>{dashData.occupancyRate}%</span>
                        </div>
                        <div style={{background:T.cardBorder,borderRadius:999,height:12,overflow:"hidden"}}>
                          <div style={{width:`${dashData.occupancyRate}%`,height:"100%",borderRadius:999,transition:"width 1s ease",background:dashData.occupancyRate>=80?"linear-gradient(90deg,#0A7A4B,#1DB87A)":dashData.occupancyRate>=50?"linear-gradient(90deg,#B8800A,#F0C030)":"linear-gradient(90deg,#8B1A1A,#E24B4A)"}}/>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:12,color:T.subtext}}>
                          <span>🟢 {dashData.occupied} occupied</span>
                          <span>🔑 {dashData.available} vacant</span>
                        </div>
                      </div>

                      <div style={C()}>
                        <h2 style={{...CT,display:"flex",alignItems:"center",gap:10}}>
                          Overdue Tenants
                          {dashData.overdueCount>0&&<Tag bg="#FCEBEB" color="#A32D2D">{dashData.overdueCount}</Tag>}
                        </h2>
                        {!dashData.overdueTenants?.length
                          ?<Empty T={T} icon="🎉" text="All tenants are up to date!"/>
                          :<div style={{overflowX:"auto"}}>
                            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                              <thead><tr>{["Tenant","Phone","House","Rent","Paid","Balance"].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                              <tbody>
                                {dashData.overdueTenants.map((t,i)=>(
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
                        }
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* HOUSES */}
              {page==="houses"&&(
                <div style={{animation:"fadeUp 0.35s ease"}}>
                  <div style={C()}>
                    <h2 style={CT}>🏠 Add New House</h2>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
                      <Field lbl="House Number"><input className="inp" placeholder="e.g. A101" value={houseNumber} onChange={e=>setHouseNumber(e.target.value)}/></Field>
                      <Field lbl="Location"><input className="inp" placeholder="e.g. Kiambu Road" value={location} onChange={e=>setLocation(e.target.value)}/></Field>
                      <Field lbl="Apartment">
                        <select className="inp" value={apartment} onChange={e=>setApartment(e.target.value)}>
                          {apartments.map(a=><option key={a} value={a}>Apartment {a}</option>)}
                        </select>
                      </Field>
                      <Field lbl="Bedrooms">
                        <select className="inp" value={bedrooms} onChange={e=>setBedrooms(Number(e.target.value))}>
                          {[1,2,3,4].map(n=><option key={n} value={n}>{n} Bedroom{n>1?"s":""}</option>)}
                        </select>
                      </Field>
                      <Field lbl="Rent (auto)"><input className="inp" value={rent?`KES ${Number(rent).toLocaleString()}`:''} readOnly/></Field>
                      <div style={{display:"flex",alignItems:"flex-end"}}>
                        <button className="btn-primary" onClick={addHouse} style={{width:"100%"}}>+ Add House</button>
                      </div>
                    </div>
                  </div>

                  <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
                    <div style={{flex:1,minWidth:180,position:"relative"}}>
                      <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:T.subtext}}>🔍</span>
                      <input className="sinp" placeholder="Search houses..." value={houseSearch} onChange={e=>setHouseSearch(e.target.value)}/>
                    </div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {["all","occupied","vacant"].map(f=>(
                        <button key={f} onClick={()=>setHouseFilter(f)} style={{padding:"9px 14px",borderRadius:9,border:`1.5px solid ${houseFilter===f?T.accent:T.cardBorder}`,background:houseFilter===f?T.accent:"transparent",color:houseFilter===f?"white":T.subtext,fontWeight:600,fontSize:12,cursor:"pointer",transition:"all 0.2s"}}>
                          {f==="all"?"All":f==="occupied"?"🔒 Occupied":"🔑 Vacant"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {apartments.map(ap=>{
                    const apH=filteredHouses.filter(h=>h.apartment===ap);
                    if(!apH.length) return null;
                    return (
                      <div key={ap} style={{marginBottom:20}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                          <div style={{width:28,height:28,background:"linear-gradient(135deg,#0A7A4B,#1DB87A)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:800,fontSize:13}}>{ap}</div>
                          <h3 style={{fontSize:14,fontWeight:700,color:T.text}}>Apartment {ap}</h3>
                          <span style={{fontSize:12,color:T.subtext}}>{apH.length} unit{apH.length!==1?"s":""}</span>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:8}}>
                          {apH.map(h=>(
                            <div key={h._id} style={{background:T.card,borderRadius:12,border:`1px solid ${T.cardBorder}`,padding:"12px 14px"}}>
                              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                                <div style={{display:"flex",alignItems:"center",gap:10}}>
                                  <div style={{width:40,height:40,background:h.status==="occupied"?"linear-gradient(135deg,#6B1A1A,#D63B3B)":"linear-gradient(135deg,#0A3D2B,#0A7A4B)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>
                                    {h.status==="occupied"?"🔒":"🔑"}
                                  </div>
                                  <div>
                                    <p style={{fontWeight:700,fontSize:14,color:T.text}}>{h.houseNumber}</p>
                                    <p style={{fontSize:11,color:T.subtext,marginTop:1}}>{h.location} · {h.bedrooms} bed{h.bedrooms>1?"s":""}</p>
                                  </div>
                                </div>
                                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                                  <p style={{fontWeight:800,fontSize:14,color:T.accent}}>KES {(h.rent||0).toLocaleString()}/mo</p>
                                  <Tag bg={h.status==="occupied"?"#FCEBEB":"#E1F5EE"} color={h.status==="occupied"?"#A32D2D":"#0F6E56"}>
                                    {h.status==="occupied"?"Occupied":"Vacant"}
                                  </Tag>
                                  <button className="btn-edit" onClick={()=>setEditHouse({...h})}>✏️</button>
                                  <button className="btn-danger" onClick={()=>setConfirmDelete({type:"house",id:h._id,name:h.houseNumber})}>🗑️</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {!filteredHouses.length&&<Empty T={T} icon="🏠" text="No houses found" sub="Try a different search or add a new house"/>}
                </div>
              )}

              {/* TENANTS */}
              {page==="tenants"&&(
                <div style={{animation:"fadeUp 0.35s ease"}}>
                  <div style={C()}>
                    <h2 style={CT}>👤 Add New Tenant</h2>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
                      <Field lbl="Full Name"><input className="inp" placeholder="e.g. John Kamau" value={tName} onChange={e=>setTName(e.target.value)}/></Field>
                      <Field lbl="Phone Number"><input className="inp" placeholder="e.g. 0712345678" value={tPhone} onChange={e=>setTPhone(e.target.value)}/></Field>
                      <Field lbl="ID Number"><input className="inp" placeholder="National ID" value={tId} onChange={e=>setTId(e.target.value)}/></Field>
                      <div style={{display:"flex",alignItems:"flex-end"}}>
                        <button className="btn-primary" onClick={addTenant} style={{width:"100%"}}>+ Add Tenant</button>
                      </div>
                    </div>
                  </div>

                  <div style={{position:"relative",marginBottom:14}}>
                    <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:T.subtext}}>🔍</span>
                    <input className="sinp" placeholder="Search by name, phone or ID..." value={tenantSearch} onChange={e=>setTenantSearch(e.target.value)}/>
                  </div>

                  <p style={{fontSize:12,color:T.subtext,fontWeight:600,marginBottom:12}}>{filteredTenants.length} tenant{filteredTenants.length!==1?"s":""} found</p>

                  {dataLoading?[...Array(3)].map((_,i)=><SkeletonCard key={i}/>):(
                    <div style={{display:"flex",flexDirection:"column",gap:14}}>
                      {filteredTenants.map(t=>{
                        const bal=balances[t._id]||{rent:0,paid:0,balance:0};
                        const pct=bal.rent>0?Math.min(100,Math.round((bal.paid/bal.rent)*100)):0;
                        return (
                          <div key={t._id} style={{background:T.card,borderRadius:14,border:`1px solid ${T.cardBorder}`,padding:"16px"}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:14}}>
                              <div style={{display:"flex",alignItems:"center",gap:10}}>
                                <div style={{width:46,height:46,background:"linear-gradient(135deg,#0A7A4B,#1DB87A)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:20,color:"white"}}>
                                  {t.name?.[0]?.toUpperCase()||"?"}
                                </div>
                                <div>
                                  <p style={{fontWeight:700,fontSize:15,color:T.text}}>{t.name}</p>
                                  <p style={{fontSize:12,color:T.subtext,marginTop:2}}>{t.phone}{t.idNumber?` · ID: ${t.idNumber}`:""}</p>
                                </div>
                              </div>
                              <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                                <button className="btn-outline" style={{padding:"7px 12px",fontSize:12}} onClick={()=>openProfile(t)}>👁️ Profile</button>
                                <button className="btn-edit" onClick={()=>setEditTenant({...t})}>✏️</button>
                                <button className="btn-danger" onClick={()=>setConfirmDelete({type:"tenant",id:t._id,name:t.name})}>🗑️</button>
                              </div>
                            </div>

                            <select className="inp" style={{marginBottom:12}} defaultValue="" onChange={e=>assignHouse(t._id,e.target.value)}>
                              <option value="">Assign House</option>
                              {houses.filter(h=>h.status==="vacant").map(h=>(
                                <option key={h._id} value={h._id}>{h.houseNumber} — KES {(h.rent||0).toLocaleString()}</option>
                              ))}
                            </select>

                            <div style={{background:T.statRow,borderRadius:10,padding:"12px 14px",marginBottom:12}}>
                              <div style={{display:"flex",gap:20,flexWrap:"wrap",marginBottom:8}}>
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
                                <div style={{height:"100%",width:`${pct}%`,borderRadius:999,transition:"width 1s ease",background:pct===100?"linear-gradient(90deg,#0A7A4B,#1DB87A)":pct>=50?"linear-gradient(90deg,#B8800A,#F0C030)":"linear-gradient(90deg,#8B1A1A,#E24B4A)"}}/>
                              </div>
                              <p style={{fontSize:10,color:T.subtext,marginTop:4,textAlign:"right"}}>{pct}% paid</p>
                            </div>

                            <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                              <input className="inp" type="number" placeholder="Cash payment (KES)" style={{flex:1,minWidth:140}}
                                value={amounts[t._id]||''} onChange={e=>setAmounts(p=>({...p,[t._id]:e.target.value}))}/>
                              <button className="btn-blue" onClick={()=>makePayment(t._id)}>💵 Cash</button>
                            </div>

                            <MpesaPayButton tenantId={t._id} token={getToken()} rentAmount={bal.rent}/>

                            <div style={{display:"flex",gap:8,marginTop:8,flexWrap:"wrap"}}>
                              <input className="inp" placeholder="Custom SMS (optional)" style={{flex:1,minWidth:140}}
                                value={customMsg[t._id]||''} onChange={e=>setCustomMsg(p=>({...p,[t._id]:e.target.value}))}/>
                              <button className="btn-sms" onClick={()=>sendSMS(t._id,t.phone)} disabled={smsSending[t._id]}>
                                {smsSending[t._id]?"...":"📱"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {!dataLoading&&!filteredTenants.length&&<Empty T={T} icon="👤" text="No tenants found" sub="Try a different search or add a new tenant"/>}
                </div>
              )}

              {/* TENANT PROFILE */}
              {page==="profile"&&profileTenant&&(
                <div style={{animation:"fadeUp 0.35s ease"}}>
                  <button className="btn-back" onClick={goBack} style={{marginBottom:18}}>
                    ← Back to {prevPage.charAt(0).toUpperCase()+prevPage.slice(1)}
                  </button>

                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16}}>
                    <div style={C({textAlign:"center"})}>
                      <div style={{width:80,height:80,background:"linear-gradient(135deg,#0A7A4B,#1DB87A)",borderRadius:22,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:32,color:"white",margin:"0 auto 14px",boxShadow:"0 8px 28px rgba(10,122,75,0.38)"}}>
                        {profileTenant.name?.[0]?.toUpperCase()}
                      </div>
                      <h2 style={{fontSize:20,fontWeight:800,color:T.text,marginBottom:6}}>{profileTenant.name}</h2>
                      <p style={{fontSize:13,color:T.subtext,marginBottom:4}}>📞 {profileTenant.phone}</p>
                      {profileTenant.idNumber&&<p style={{fontSize:13,color:T.subtext,marginBottom:14}}>🪪 ID: {profileTenant.idNumber}</p>}
                      <div style={{marginBottom:16}}>
                        <Tag bg={T.accentLight} color={T.accent}>
                          {houses.find(h=>String(h._id)===String(profileTenant.house))?`🏠 House ${houses.find(h=>String(h._id)===String(profileTenant.house))?.houseNumber}`:"No House Assigned"}
                        </Tag>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:8}}>
                        <button className="btn-edit" onClick={()=>setEditTenant({...profileTenant})}>✏️ Edit Details</button>
                        <button className="btn-sms" onClick={()=>sendSMS(profileTenant._id,profileTenant.phone)}>📱 Send SMS</button>
                        <button className="btn-danger" onClick={()=>setConfirmDelete({type:"tenant",id:profileTenant._id,name:profileTenant.name})}>🗑️ Delete</button>
                      </div>
                    </div>

                    <div style={C()}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
                        <h2 style={{...CT,margin:0}}>Payment History</h2>
                        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                          <Tag bg={T.accentLight} color={T.accent}>{profilePayments.length} records</Tag>
                          <Tag bg="#E1F5EE" color="#0F6E56">KES {profilePayments.filter(p=>p.status==="confirmed").reduce((s,p)=>s+(p.amount||0),0).toLocaleString()}</Tag>
                        </div>
                      </div>
                      {!profilePayments.length
                        ?<Empty T={T} icon="💳" text="No payments recorded yet"/>
                        :<div style={{overflowX:"auto"}}>
                          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                            <thead><tr>{["Amount","Reference","Status","Date"].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                            <tbody>
                              {profilePayments.map((p,i)=>(
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
                      }
                      <div style={{marginTop:14,padding:"12px 16px",background:T.statRow,borderRadius:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:13,color:T.subtext,fontWeight:600}}>Total Confirmed</span>
                        <span style={{fontSize:18,fontWeight:800,color:"#0A7A4B"}}>
                          KES {profilePayments.filter(p=>p.status==="confirmed").reduce((s,p)=>s+(p.amount||0),0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PAYMENTS */}
              {page==="payments"&&(
                <div style={{animation:"fadeUp 0.35s ease"}}>
                  <div style={C()}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
                      <h2 style={{...CT,margin:0}}>💳 Payment History</h2>
                      <div style={{background:"linear-gradient(135deg,#0A3D2B,#0A7A4B)",color:"white",padding:"6px 14px",borderRadius:999,fontSize:12,fontWeight:700}}>
                        {allPayments.length} records · KES {allPayments.filter(p=>p.status==="confirmed").reduce((s,p)=>s+(p.amount||0),0).toLocaleString()}
                      </div>
                    </div>
                    {!allPayments.length
                      ?<Empty T={T} icon="💳" text="No payments yet"/>
                      :<div style={{overflowX:"auto"}}>
                        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                          <thead><tr>{["#","Tenant","Amount","Reference","Status","Date",""].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                          <tbody>
                            {allPayments.map((p,i)=>(
                              <tr key={p._id} style={{background:i%2===0?T.rowAlt:T.card}}>
                                <td style={TD}><span style={{color:T.subtext,fontSize:11}}>{i+1}</span></td>
                                <td style={TD}><Av name={p.tenant?.name||"?"}/><span style={{fontWeight:600,color:T.text}}>{p.tenant?.name||"Unknown"}</span></td>
                                <td style={TD}><span style={{color:"#0A7A4B",fontWeight:800}}>KES {(p.amount||0).toLocaleString()}</span></td>
                                <td style={TD}><code style={{fontSize:10,background:T.statRow,padding:"2px 7px",borderRadius:5,color:T.text}}>{p.reference||"—"}</code></td>
                                <td style={TD}><Tag bg={p.status==="confirmed"?"#E1F5EE":p.status==="pending"?"#FAEEDA":"#FCEBEB"} color={p.status==="confirmed"?"#0F6E56":p.status==="pending"?"#854F0B":"#A32D2D"}>{p.status||"confirmed"}</Tag></td>
                                <td style={TD}><span style={{fontSize:11,color:T.subtext}}>{p.createdAt?new Date(p.createdAt).toLocaleDateString("en-KE",{day:"numeric",month:"short",year:"numeric"}):"—"}</span></td>
                                <td style={TD}><button className="btn-danger" style={{padding:"4px 8px",fontSize:10}} onClick={()=>setConfirmDelete({type:"payment",id:p._id,name:`KES ${p.amount} payment`})}>🗑️</button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    }
                  </div>
                </div>
              )}

              {/* REPORTS */}
              {page==="reports"&&(
                <div style={{animation:"fadeUp 0.35s ease"}}>
                  <div style={C()}>
                    <h2 style={CT}>📋 Monthly Rent Report</h2>
                    <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
                      <Field lbl="Month">
                        <select className="inp" style={{width:"auto"}} value={repMonth} onChange={e=>setRepMonth(Number(e.target.value))}>
                          {MONTHS.map((m,i)=><option key={m} value={i+1}>{m}</option>)}
                        </select>
                      </Field>
                      <Field lbl="Year">
                        <select className="inp" style={{width:"auto"}} value={repYear} onChange={e=>setRepYear(Number(e.target.value))}>
                          {[2023,2024,2025,2026].map(y=><option key={y}>{y}</option>)}
                        </select>
                      </Field>
                      <button className="btn-primary" onClick={loadReport} disabled={repLoading}>{repLoading?"Loading...":"Generate Report"}</button>
                      {report&&<button className="btn-gold" onClick={()=>window.print()}>🖨️ Print</button>}
                    </div>
                  </div>
                  {report?(
                    <>
                      <div style={{textAlign:"center",marginBottom:16,padding:"20px",background:`linear-gradient(135deg,${T.sidebar},#0A3D2B)`,borderRadius:14,color:"white"}}>
                        <h2 className="ghv-title" style={{fontSize:20,marginBottom:4}}>GIFTED HANDS VENTURES</h2>
                        <p style={{color:"rgba(255,255,255,0.65)",fontSize:12}}>Rent Report — {MONTHS[report.month-1]} {report.year}</p>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}>
                        {[
                          {l:"Period",      v:`${MONTHS[report.month-1]} ${report.year}`, bg:"linear-gradient(135deg,#1459A0,#2D7DD2)",icon:"📅"},
                          {l:"Total Income",v:`KES ${(report.totalIncome||0).toLocaleString()}`, bg:"linear-gradient(135deg,#1A4A1A,#2E8B2E)",icon:"💰"},
                          {l:"Transactions",v:report.transactions, bg:"linear-gradient(135deg,#1A1A6B,#534AB7)",icon:"🔢"},
                          {l:"Avg Payment", v:report.transactions>0?`KES ${Math.round((report.totalIncome||0)/report.transactions).toLocaleString()}`:"KES 0", bg:"linear-gradient(135deg,#0A3D2B,#0A7A4B)",icon:"📊"},
                        ].map(c=>(
                          <div key={c.l} style={{background:c.bg,borderRadius:14,padding:"18px 16px",boxShadow:"0 4px 20px rgba(0,0,0,0.18)"}}>
                            <span style={{fontSize:24}}>{c.icon}</span>
                            <p style={{fontSize:20,fontWeight:800,color:"white",margin:"6px 0 3px"}}>{c.v}</p>
                            <p style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.7)"}}>{c.l}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  ):!repLoading&&(
                    <div style={{textAlign:"center",padding:"48px 0",color:T.subtext}}>
                      <p style={{fontSize:38,marginBottom:10}}>📋</p>
                      <p style={{fontWeight:600}}>Select a month and year, then click Generate Report</p>
                    </div>
                  )}
                </div>
              )}

              {/* SMS */}
              {page==="sms"&&(
                <div style={{animation:"fadeUp 0.35s ease"}}>
                  <div style={C()}>
                    <h2 style={CT}>📢 Broadcast to All Tenants</h2>
                    <p style={{fontSize:13,color:T.subtext,marginBottom:12}}>Send one SMS to all {tenants.length} tenants at once</p>
                    <textarea className="inp" rows={4} placeholder="Dear tenant, your rent is due. Please pay promptly. Thank you. — Gifted Hands Ventures"
                      value={broadcastMsg} onChange={e=>setBroadcastMsg(e.target.value)}/>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10,flexWrap:"wrap",gap:8}}>
                      <span style={{fontSize:11,color:T.subtext}}>{broadcastMsg.length} chars · {tenants.length} recipients</span>
                      <button className="btn-primary" onClick={sendBroadcast} disabled={broadcastSending}>
                        {broadcastSending?"Sending...":"📱 Send to All"}
                      </button>
                    </div>
                  </div>

                  {reminders.length>0&&(
                    <div style={C()}>
                      <h2 style={{...CT,display:"flex",alignItems:"center",gap:8}}>
                        ⚠️ Due Soon <Tag bg="#FAEEDA" color="#854F0B">{reminders.length}</Tag>
                      </h2>
                      {reminders.map((r,i)=>(
                        <div key={i} style={{background:"#FAEEDA",borderRadius:10,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,marginBottom:8}}>
                          <div>
                            <p style={{fontWeight:700,color:"#854F0B",fontSize:13}}>{r.name}</p>
                            <p style={{fontSize:11,color:"#a06020",marginTop:2}}>{r.message}</p>
                          </div>
                          <button className="btn-sms" onClick={()=>{const t=tenants.find(t=>t.name===r.name);if(t)sendSMS(t._id,t.phone);}}>📱 Send</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={C()}>
                    <h2 style={{...CT,marginBottom:12}}>📨 Individual SMS</h2>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {tenants.map(t=>(
                        <div key={t._id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:T.statRow,borderRadius:10,flexWrap:"wrap"}}>
                          <Av name={t.name}/>
                          <div style={{flex:1,minWidth:80}}>
                            <p style={{fontWeight:700,fontSize:13,color:T.text}}>{t.name}</p>
                            <p style={{fontSize:11,color:T.subtext}}>{t.phone}</p>
                          </div>
                          <input className="inp" placeholder="Custom message (optional)" style={{flex:2,minWidth:150}}
                            value={customMsg[t._id]||''} onChange={e=>setCustomMsg(p=>({...p,[t._id]:e.target.value}))}/>
                          <button className="btn-sms" onClick={()=>sendSMS(t._id,t.phone)} disabled={smsSending[t._id]}>
                            {smsSending[t._id]?"...":"📱"}
                          </button>
                        </div>
                      ))}
                      {!tenants.length&&<Empty T={T} icon="👤" text="No tenants yet"/>}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}