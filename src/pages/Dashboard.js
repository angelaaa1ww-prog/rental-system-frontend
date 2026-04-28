import { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const authHeader = () => {
  const t = localStorage.getItem('token');
  return t ? { Authorization: `Bearer ${t}` } : {};
};

export default function Dashboard({ onPageChange }) {
  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res  = await fetch(`${API}/api/dashboard`, { headers: authHeader() });
      if (!res.ok) throw new Error('Failed to load dashboard');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState />;
  if (error)   return <ErrorState message={error} onRetry={() => load()} />;
  if (!data)   return null;

  const occ = data.occupancyRate || 0;

  return (
    <div style={s.page}>

      {/* STAT CARDS */}
      <div style={s.grid}>
        <StatCard label="Total Houses"    value={data.totalHouses}                                           icon="🏠" color="var(--text-main)" bg="rgba(16, 185, 129, 0.1)" />
        <StatCard label="Occupied"        value={data.occupied}                                              icon="✅" color="var(--accent-secondary)" bg="rgba(14, 165, 233, 0.1)" />
        <StatCard label="Vacant"          value={data.available}                                             icon="🔑" color="#f59e0b" bg="rgba(245, 158, 11, 0.1)" />
        <StatCard label="Total Tenants"   value={data.totalTenants || 0}                                     icon="👤" color="#8b5cf6" bg="rgba(139, 92, 246, 0.1)" />
        <StatCard label="Total Income"    value={`KES ${(data.totalIncome || 0).toLocaleString()}`}          icon="💰" color="var(--accent-primary)" bg="rgba(16, 185, 129, 0.15)" small />
        <StatCard label="This Month"      value={`KES ${(data.monthlyIncome || 0).toLocaleString()}`}        icon="📅" color="var(--accent-secondary)" bg="rgba(14, 165, 233, 0.15)" small />
        <StatCard
          label="Overdue"
          value={data.overdueCount}
          icon={data.overdueCount > 0 ? '⚠️' : '✔️'}
          color={data.overdueCount > 0 ? 'var(--danger)' : 'var(--accent-primary)'}
          bg={data.overdueCount > 0 ? 'var(--danger-bg)' : 'var(--success-bg)'}
          onClick={() => onPageChange && onPageChange('overdue')}
          clickable
        />
      </div>

      {/* OCCUPANCY BAR */}
      <div style={s.card}>
        <div style={s.cardRow}>
          <span style={s.cardLabel}>Occupancy Rate</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: occ >= 80 ? 'var(--accent-primary)' : occ >= 50 ? '#f59e0b' : 'var(--danger)' }}>
            {occ}%
          </span>
        </div>
        <div style={s.barTrack}>
          <div style={{ ...s.barFill, width: `${occ}%`, background: occ >= 80 ? 'var(--accent-primary)' : occ >= 50 ? '#f59e0b' : 'var(--danger)', boxShadow: `0 0 10px ${occ >= 80 ? 'rgba(16,185,129,0.5)' : occ >= 50 ? 'rgba(245,158,11,0.5)' : 'rgba(239,68,68,0.5)'}` }} />
        </div>
        <div style={s.barLabels}>
          <span>{data.occupied} occupied</span>
          <span>{data.available} vacant</span>
        </div>
      </div>

      {/* OVERDUE TABLE */}
      <div style={s.card}>
        <div style={s.cardRow}>
          <h2 style={s.sectionTitle}>
            Overdue Tenants
            {data.overdueCount > 0 && <span style={s.badge}>{data.overdueCount}</span>}
          </h2>
          <button onClick={() => load(true)} disabled={refreshing} style={s.refreshBtn}>
            {refreshing ? 'Refreshing…' : '↻ Refresh'}
          </button>
        </div>

        {!data.overdueTenants?.length ? (
          <div style={s.emptyState}>
            <span style={{ fontSize: 40, filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.2))' }}>🎉</span>
            <p style={{ margin: '12px 0 0', color: 'var(--accent-primary)', fontWeight: 600, fontSize: 18 }}>All tenants are up to date!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>{['Tenant','Phone','House','Rent (KES)','Paid (KES)','Balance (KES)'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {data.overdueTenants.map((t, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    <td style={s.td}>
                      <div style={s.avatar}>{t.name?.[0]?.toUpperCase() || '?'}</div>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{t.name}</span>
                    </td>
                    <td style={s.td}>{t.phone}</td>
                    <td style={s.td}><span style={s.housePill}>{t.house}</span></td>
                    <td style={s.td}>{(t.rent    || 0).toLocaleString()}</td>
                    <td style={s.td}>{(t.paid    || 0).toLocaleString()}</td>
                    <td style={s.td}><span style={s.balancePill}>{(t.balance || 0).toLocaleString()}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, bg, small, onClick, clickable }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...s.statCard, background: bg,
        cursor: clickable ? 'pointer' : 'default',
        transition: 'transform 0.15s, box-shadow 0.15s'
      }}
      onMouseEnter={e => { if (clickable) { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.1)'; }}}
      onMouseLeave={e => { if (clickable) { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      <p style={{ margin:'6px 0 0', fontWeight:700, fontSize: small ? 16 : 24, color, lineHeight:1.2 }}>{value}</p>
      <p style={{ margin:0, fontSize:12, fontWeight:600, color, opacity:0.8 }}>{label}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div style={s.page}>
      <div style={s.grid}>
        {[...Array(7)].map((_, i) => (
          <div key={i} style={{ ...s.statCard, background:'var(--bg-input)' }}>
            <div style={s.skel} />
            <div style={{ ...s.skel, width:60, height:24, margin:'10px 0 6px' }} />
            <div style={{ ...s.skel, width:80, height:14 }} />
          </div>
        ))}
      </div>
      <div style={{ ...s.card, height:80 }}><div style={s.skel} /></div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div style={{ ...s.page, textAlign:'center', paddingTop:60 }}>
      <span style={{ fontSize:48, filter:'drop-shadow(0 0 20px rgba(239,68,68,0.2))' }}>⚠️</span>
      <p style={{ color:'var(--danger)', fontWeight:600, margin:'16px 0 8px', fontSize: 18 }}>Failed to load dashboard</p>
      <p style={{ color:'var(--text-muted)', fontSize:14, marginBottom:24 }}>{message}</p>
      <button onClick={onRetry} className="btn-outline">Try Again</button>
    </div>
  );
}

const s = {
  page:        { fontFamily:"'Outfit',sans-serif", color:'var(--text-main)' },
  grid:        { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:16, marginBottom:24 },
  statCard:    { borderRadius:16, padding:'20px', display:'flex', flexDirection:'column', gap:4, border:'1px solid var(--border-color)', backdropFilter:'blur(12px)' },
  card:        { background:'var(--bg-card)', borderRadius:16, border:'1px solid var(--border-color)', padding:'24px 28px', marginBottom:20, backdropFilter:'blur(12px)' },
  cardRow:     { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 },
  cardLabel:   { fontSize:15, fontWeight:600, color:'var(--text-muted)' },
  barTrack:    { background:'rgba(255,255,255,0.05)', borderRadius:999, height:12, overflow:'hidden', boxShadow:'inset 0 2px 4px rgba(0,0,0,0.2)' },
  barFill:     { height:'100%', borderRadius:999, transition:'width 1s cubic-bezier(0.4, 0, 0.2, 1)' },
  barLabels:   { display:'flex', justifyContent:'space-between', marginTop:8, fontSize:13, color:'var(--text-muted)', fontWeight:500 },
  sectionTitle:{ margin:0, fontSize:18, fontWeight:700, color:'var(--text-main)', display:'flex', alignItems:'center', gap:10 },
  badge:       { background:'var(--danger-bg)', color:'var(--danger)', fontSize:12, fontWeight:700, padding:'3px 10px', borderRadius:999, border:'1px solid rgba(239,68,68,0.2)' },
  emptyState:  { textAlign:'center', padding:'32px 0 16px' },
  table:       { width:'100%', borderCollapse:'collapse', fontSize:14, marginTop:12 },
  th:          { textAlign:'left', padding:'12px 16px', fontSize:13, fontWeight:600, color:'var(--text-muted)', borderBottom:'1px solid var(--border-color)', whiteSpace:'nowrap', background:'rgba(0,0,0,0.2)' },
  td:          { padding:'14px 16px', verticalAlign:'middle', borderBottom:'1px solid rgba(255,255,255,0.03)', color:'var(--text-muted)' },
  avatar:      { display:'inline-flex', alignItems:'center', justifyContent:'center', width:32, height:32, borderRadius:'50%', background:'rgba(16,185,129,0.15)', color:'var(--accent-primary)', fontWeight:700, fontSize:14, marginRight:12, boxShadow:'inset 0 0 0 1px rgba(16,185,129,0.3)' },
  housePill:   { background:'rgba(14,165,233,0.15)', color:'var(--accent-secondary)', padding:'4px 12px', borderRadius:999, fontSize:12, fontWeight:600, border:'1px solid rgba(14,165,233,0.3)' },
  balancePill: { background:'var(--danger-bg)', color:'var(--danger)', padding:'4px 12px', borderRadius:999, fontSize:13, fontWeight:700, border:'1px solid rgba(239,68,68,0.3)' },
  refreshBtn:  { padding:'8px 16px', borderRadius:8, border:'1px solid var(--border-color)', background:'rgba(255,255,255,0.05)', color:'var(--text-main)', fontWeight:600, fontSize:13, cursor:'pointer', transition:'all 0.2s ease' },
  skel:        { background:'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)', backgroundSize:'200% 100%', animation:'shimmer 2s infinite', borderRadius:8, display:'block', width:'100%', height:36 },
};