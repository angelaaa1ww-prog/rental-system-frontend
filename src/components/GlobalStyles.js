export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
      
      :root {
        --bg-main: #0a0e17;
        --bg-card: rgba(20, 27, 41, 0.7);
        --bg-sidebar: #0f1523;
        --bg-input: #151f32;
        --border-color: rgba(255, 255, 255, 0.08);
        --text-main: #f1f5f9;
        --text-muted: #94a3b8;
        --accent-primary: #10B981;
        --accent-primary-hover: #059669;
        --accent-secondary: #0ea5e9;
        --danger: #ef4444;
        --danger-hover: #dc2626;
        --success-bg: rgba(16, 185, 129, 0.15);
        --danger-bg: rgba(239, 68, 68, 0.15);
        --warning-bg: rgba(245, 158, 11, 0.15);
      }

      *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
      body { 
        font-family:'Outfit', sans-serif; 
        background-color: var(--bg-main); 
        color: var(--text-main); 
        background-image: 
          radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.05) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(14, 165, 233, 0.05) 0px, transparent 50%);
        background-attachment: fixed;
      }
      
      @keyframes slideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
      @keyframes fadeUp  { from{opacity:0;transform:translateY(15px)} to{opacity:1;transform:translateY(0)} }
      @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

      .nav-item { 
        display:flex; align-items:center; gap:12px; padding:12px 16px; 
        border-radius:12px; font-size:15px; font-weight:500; 
        color: var(--text-muted); cursor:pointer; 
        transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
        margin-bottom:8px; 
      }
      .nav-item:hover { 
        background: rgba(255,255,255,0.05); 
        color: var(--text-main); 
        transform: translateX(4px);
      }
      .nav-item.active { 
        background: linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0.05) 100%);
        color: var(--accent-primary); 
        border-left: 3px solid var(--accent-primary);
        font-weight: 600;
      }

      .app-input { 
        padding:12px 16px; border:1px solid var(--border-color); 
        border-radius:12px; font-size:14px; font-family:'Outfit',sans-serif; 
        outline:none; transition:all 0.3s ease; 
        background: var(--bg-input); color: var(--text-main); width:100%; 
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
      }
      .app-input:focus { 
        border-color: var(--accent-primary); 
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15); 
      }
      .app-input::placeholder { color: #64748b; }
      .app-input:read-only { opacity: 0.7; cursor: not-allowed; }
      
      textarea.app-input { padding:14px 16px; line-height: 1.5; }

      .app-select { 
        padding:12px 16px; border:1px solid var(--border-color); 
        border-radius:12px; font-size:14px; font-family:'Outfit',sans-serif; 
        outline:none; background: var(--bg-input); color: var(--text-main); 
        width:100%; cursor:pointer; transition:all 0.3s ease;
      }
      .app-select:focus { border-color: var(--accent-primary); box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15); }
      .app-select option { background: var(--bg-sidebar); color: var(--text-main); }

      .btn-primary { 
        padding:12px 24px; 
        background: linear-gradient(135deg, var(--accent-primary) 0%, #059669 100%);
        color:white; border:none; border-radius:12px; font-size:14px; 
        font-weight:600; font-family:'Outfit',sans-serif; cursor:pointer; 
        transition:all 0.3s ease; 
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }
      .btn-primary:hover { 
        transform: translateY(-2px); 
        box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4); 
      }
      .btn-primary:active { transform: translateY(0); }
      .btn-primary:disabled { background: #334155; box-shadow:none; cursor:not-allowed; color:#94a3b8; }

      .btn-outline { 
        padding:10px 18px; background:transparent; color: var(--text-main); 
        border:1px solid var(--border-color); border-radius:10px; font-size:13px; 
        font-weight:600; font-family:'Outfit',sans-serif; cursor:pointer; 
        transition:all 0.3s ease; 
      }
      .btn-outline:hover { background: rgba(255,255,255,0.05); border-color: #475569; }

      .btn-danger { 
        padding:12px 24px; 
        background: linear-gradient(135deg, var(--danger) 0%, #b91c1c 100%);
        color:white; border:none; border-radius:12px; font-size:14px; 
        font-weight:600; font-family:'Outfit',sans-serif; cursor:pointer; 
        transition:all 0.3s ease;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      }
      .btn-danger:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4); }

      .btn-sm { 
        padding:8px 14px; font-size:12px; border-radius:8px; font-weight:600; 
        font-family:'Outfit',sans-serif; cursor:pointer; border:none; 
        transition:all 0.2s ease; 
      }
      .btn-sm:hover { filter: brightness(1.1); transform: translateY(-1px); }
      .btn-sm:disabled { opacity:0.5; cursor:not-allowed; transform:none; }

      .btn-pay { 
        padding:10px 18px; 
        background: linear-gradient(135deg, var(--accent-secondary) 0%, #0284c7 100%);
        color:white; border:none; border-radius:10px; font-size:13px; 
        font-weight:600; font-family:'Outfit',sans-serif; cursor:pointer; 
        transition:all 0.3s ease; white-space:nowrap; 
        box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
      }
      .btn-pay:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(14, 165, 233, 0.3); }

      .btn-sms { 
        padding:10px 18px; 
        background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
        color:white; border:none; border-radius:10px; font-size:13px; 
        font-weight:600; font-family:'Outfit',sans-serif; cursor:pointer; 
        transition:all 0.3s ease; white-space:nowrap; 
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
      }
      .btn-sms:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(139, 92, 246, 0.3); }
      .btn-sms:disabled { background: #334155; box-shadow:none; cursor:not-allowed; color:#94a3b8; }

      .house-card { 
        background: var(--bg-card); 
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-radius:16px; padding:16px 20px; 
        border:1px solid var(--border-color); display:flex; align-items:center; 
        justify-content:space-between; gap:12px; transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
        flex-wrap:wrap; 
      }
      .house-card:hover { 
        transform: translateY(-3px); 
        box-shadow: 0 10px 25px rgba(0,0,0,0.3); 
        border-color: rgba(255,255,255,0.15);
      }
      
      .tenant-card { 
        background: var(--bg-card); 
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-radius:16px; border:1px solid var(--border-color); 
        padding:22px 24px; animation:fadeUp 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
        transition:all 0.3s ease;
      }
      .tenant-card:hover {
        border-color: rgba(255,255,255,0.15);
        box-shadow: 0 8px 30px rgba(0,0,0,0.2);
      }

      ::-webkit-scrollbar { width:6px; height:6px; }
      ::-webkit-scrollbar-track { background:transparent; }
      ::-webkit-scrollbar-thumb { background:#334155; border-radius:99px; }
      ::-webkit-scrollbar-thumb:hover { background:#475569; }
    `}</style>
  );
}
