import { useState } from 'react';
import { API, authHeader, safeFetch } from '../api';
import { Avatar, Field, MiniStat, EmptyState, ConfirmModal, cardStyle, cardTitleStyle } from '../components/ui';

export default function TenantsPage({ tenants, houses, balances, onRefresh, toast }) {
  const [name, setName]       = useState('');
  const [phone, setPhone]     = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [amounts, setAmounts] = useState({});
  const [smsSending, setSmsSending] = useState({});
  const [delConfirm, setDelConfirm] = useState(null);
  const [vacateConfirm, setVacateConfirm] = useState(null);
  const [stkSending, setStkSending] = useState({});

  const addTenant = async () => {
    if (!name || !phone) { toast('Name and phone required', 'error'); return; }
    const body = { name, phone };
    if (idNumber.trim()) body.idNumber = idNumber.trim();
    const res = await safeFetch(`${API}/api/tenants`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(body)
    });
    if (res?.__error) { toast(res.message, 'error'); return; }
    if (res) { toast('Tenant added!', 'success'); setName(''); setPhone(''); setIdNumber(''); onRefresh(); }
  };

  const assignHouse = async (tenantId, houseId) => {
    if (!houseId) return;
    const res = await safeFetch(`${API}/api/tenants/${tenantId}/assign`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ houseId })
    });
    if (res?.__error) { toast(res.message, 'error'); return; }
    if (res) { toast('House assigned!', 'success'); onRefresh(); }
  };

  const vacateTenant = async (id) => {
    const res = await safeFetch(`${API}/api/tenants/${id}/vacate`, { method: 'PUT', headers: authHeader() });
    if (res?.__error) { toast(res.message, 'error'); return; }
    if (res) { toast('Tenant vacated!', 'success'); onRefresh(); }
    setVacateConfirm(null);
  };

  const deleteTenant = async (id) => {
    const res = await safeFetch(`${API}/api/tenants/${id}`, { method: 'DELETE', headers: authHeader() });
    if (res?.__error) { toast(res.message, 'error'); return; }
    if (res) { toast('Tenant deleted!', 'success'); onRefresh(); }
    setDelConfirm(null);
  };

  const makePayment = async (tenantId) => {
    const amount = Number(amounts[tenantId]);
    if (!amount || amount <= 0) { toast('Enter a valid amount', 'error'); return; }
    const res = await safeFetch(`${API}/api/payments`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ tenantId, amount, reference: 'CASH-' + Date.now() })
    });
    if (res?.__error) { toast(res.message, 'error'); return; }
    if (res) { toast('Payment recorded!', 'success'); setAmounts(p => ({ ...p, [tenantId]: '' })); onRefresh(); }
  };

  const sendReminder = async (tenant) => {
    const bal = balances[tenant._id] || {};
    const msg = `Dear ${tenant.name}, your rent balance is KES ${(bal.balance || 0).toLocaleString()}. Please pay promptly. Thank you - Rental Manager.`;
    setSmsSending(p => ({ ...p, [tenant._id]: true }));
    const res = await safeFetch(`${API}/api/sms/send`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ phone: tenant.phone, message: msg })
    });
    setSmsSending(p => ({ ...p, [tenant._id]: false }));
    if (res && !res.__error) toast(`SMS sent to ${tenant.name}!`, 'success');
    else toast(res?.message || 'SMS failed', 'error');
  };

  const sendMpesaPrompt = async (tenantId, phone) => {
    const amount = Number(amounts[tenantId]);
    if (!amount || amount <= 0) { toast('Enter a valid amount first', 'error'); return; }
    
    setStkSending(p => ({ ...p, [tenantId]: true }));
    const res = await safeFetch(`${API}/api/mpesa/stkpush`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ phone, amount, tenantId })
    });
    setStkSending(p => ({ ...p, [tenantId]: false }));
    
    if (res?.__error) { toast(res.message, 'error'); return; }
    if (res) { 
      toast('MPESA prompt sent! Waiting for tenant to enter PIN...', 'success'); 
      setAmounts(p => ({ ...p, [tenantId]: '' })); 
    }
  };

  return (
    <div style={{ animation: 'fadeUp 0.3s ease' }}>
      <ConfirmModal open={!!delConfirm} title="Delete Tenant?" message="This will permanently remove this tenant and free their house. This cannot be undone." danger onConfirm={() => deleteTenant(delConfirm)} onCancel={() => setDelConfirm(null)} />
      <ConfirmModal open={!!vacateConfirm} title="Vacate Tenant?" message="This will remove the tenant from their house and mark it as vacant. The tenant will NOT be deleted." onConfirm={() => vacateTenant(vacateConfirm)} onCancel={() => setVacateConfirm(null)} />

      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Add New Tenant</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
          <Field label="Full Name *"><input className="app-input" placeholder="e.g. John Kamau" value={name} onChange={e => setName(e.target.value)} /></Field>
          <Field label="Phone Number *"><input className="app-input" placeholder="e.g. 0712345678" value={phone} onChange={e => setPhone(e.target.value)} /></Field>
          <Field label="ID Number (optional)"><input className="app-input" placeholder="National ID" value={idNumber} onChange={e => setIdNumber(e.target.value)} /></Field>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}><button className="btn-primary" onClick={addTenant} style={{ width: '100%', padding: '10px 0' }}>+ Add Tenant</button></div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {tenants.map(t => {
          const bal = balances[t._id] || { rent: 0, paid: 0, balance: 0 };
          const pct = bal.rent > 0 ? Math.min(100, Math.round((bal.paid / bal.rent) * 100)) : 0;
          const assignedHouse = t.house;
          return (
            <div className="tenant-card" key={t._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <Avatar name={t.name} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-main)', letterSpacing: '0.02em' }}>{t.name}</p>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
                      {t.phone}{t.idNumber ? ` • ID: ${t.idNumber}` : ''}
                      {assignedHouse ? <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}> • 🏠 {assignedHouse.houseNumber}</span> : <span style={{ color: '#64748b' }}> • No house</span>}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {assignedHouse ? (
                    <button className="btn-sm" style={{ background: 'var(--warning-bg)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' }} onClick={() => setVacateConfirm(t._id)}>🚪 Vacate</button>
                  ) : (
                    <select className="app-select" style={{ width: 'auto', minWidth: 160, fontSize: 13, padding: '8px 12px' }} defaultValue="" onChange={e => assignHouse(t._id, e.target.value)}>
                      <option value="">Assign House</option>
                      {houses.filter(h => h.status === 'vacant').map(h => (
                        <option key={h._id} value={h._id}>{h.houseNumber} — KES {(h.rent || 0).toLocaleString()}</option>
                      ))}
                    </select>
                  )}
                  <button className="btn-sm" style={{ background: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)' }} onClick={() => setDelConfirm(t._id)}>🗑</button>
                </div>
              </div>

              {assignedHouse && (
                <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: '16px 20px', marginBottom: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                    <MiniStat label="Monthly Rent" value={`KES ${(bal.rent || 0).toLocaleString()}`} color="var(--accent-secondary)" />
                    <MiniStat label="Paid" value={`KES ${(bal.paid || 0).toLocaleString()}`} color="var(--accent-primary)" />
                    <MiniStat label="Balance" value={`KES ${(bal.balance || 0).toLocaleString()}`} color={bal.balance > 0 ? 'var(--danger)' : 'var(--accent-primary)'} />
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 999, overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? 'var(--accent-primary)' : pct >= 50 ? '#f59e0b' : 'var(--danger)', borderRadius: 999, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: `0 0 10px ${pct === 100 ? 'rgba(16,185,129,0.5)' : pct >= 50 ? 'rgba(245,158,11,0.5)' : 'rgba(239,68,68,0.5)'}` }} />
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, textAlign: 'right', fontWeight: 500 }}>{pct}% paid</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <input className="app-input" type="number" placeholder="Payment amount (KES)" style={{ flex: 1, minWidth: 160 }}
                  value={amounts[t._id] || ''} onChange={e => setAmounts(p => ({ ...p, [t._id]: e.target.value }))} />
                <button className="btn-pay" onClick={() => sendMpesaPrompt(t._id, t.phone)} disabled={stkSending[t._id]} style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
                  {stkSending[t._id] ? 'Sending...' : '📲 STK Push'}
                </button>
                <button className="btn-outline" style={{ borderColor: 'var(--accent-secondary)', color: 'var(--accent-secondary)' }} onClick={() => makePayment(t._id)}>
                  Cash
                </button>
                <button className="btn-sms" onClick={() => sendReminder(t)} disabled={smsSending[t._id]}>
                  {smsSending[t._id] ? 'Sending...' : '📱 Remind'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {!tenants.length && <EmptyState icon="👤" title="No tenants yet" sub="Add your first tenant above" />}
    </div>
  );
}
