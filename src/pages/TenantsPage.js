import React, { useState } from 'react';
import { API, authHeader, safeFetch } from '../api';
import { Avatar, Field, MiniStat, EmptyState, ConfirmModal, Icon } from '../components/ui';

export default function TenantsPage({ tenants, houses, balances, onRefresh, toast }) {
  const [name, setName]       = useState('');
  const [phone, setPhone]     = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [amounts, setAmounts] = useState({});
  const [smsSending, setSmsSending] = useState({});
  const [delConfirm, setDelConfirm] = useState(null);
  const [vacateConfirm, setVacateConfirm] = useState(null);
  const [c2bConfig, setC2bConfig] = useState(null);
  const [c2bLoading, setC2bLoading] = useState(true);

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

  const fetchC2bConfig = async () => {
    setC2bLoading(true);
    try {
      const res = await safeFetch(`${API}/api/c2b/config`);
      if (res && !res.__error) {
        setC2bConfig(res);
      } else {
        setC2bConfig({ payBillNumber: "XXXXXX", accountReferenceFormat: "Tenant ID or House Number" });
      }
    } catch (error) {
      console.error('Failed to fetch C2B config:', error);
      setC2bConfig({ payBillNumber: "XXXXXX", accountReferenceFormat: "Tenant ID or House Number" });
    } finally {
      setC2bLoading(false);
    }
  };

  React.useEffect(() => {
    fetchC2bConfig();
  }, []);

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
    const msg = `Dear ${tenant.name}, your rent balance is KES ${(bal.balance || 0).toLocaleString()}. Please pay promptly. Thank you - Gifted Hands.`;
    setSmsSending(p => ({ ...p, [tenant._id]: true }));
    const res = await safeFetch(`${API}/api/sms/send`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ phone: tenant.phone, message: msg })
    });
    setSmsSending(p => ({ ...p, [tenant._id]: false }));
    if (res && !res.__error) toast(`SMS sent to ${tenant.name}!`, 'success');
    else toast(res?.message || 'SMS failed', 'error');
  };

  return (
    <div className="page-stack" style={{ animation: 'fadeUp 0.3s ease' }}>
      <ConfirmModal open={!!delConfirm} title="Delete Tenant?" message="This will permanently remove this tenant and free their house. This cannot be undone." danger onConfirm={() => deleteTenant(delConfirm)} onCancel={() => setDelConfirm(null)} />
      <ConfirmModal open={!!vacateConfirm} title="Vacate Tenant?" message="This will remove the tenant from their house and mark it as vacant. The tenant will NOT be deleted." onConfirm={() => vacateTenant(vacateConfirm)} onCancel={() => setVacateConfirm(null)} />

      <div className="surface">
        <div className="section-head" style={{ marginBottom: '1.25rem' }}>
          <h2>Add New Tenant</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
          <Field label="Full Name *"><input className="app-input" placeholder="e.g. John Kamau" value={name} onChange={e => setName(e.target.value)} /></Field>
          <Field label="Phone Number *"><input className="app-input" placeholder="e.g. 0712345678" value={phone} onChange={e => setPhone(e.target.value)} /></Field>
          <Field label="ID Number (optional)"><input className="app-input" placeholder="National ID" value={idNumber} onChange={e => setIdNumber(e.target.value)} /></Field>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}><button className="btn-primary" onClick={addTenant} style={{ width: '100%', minHeight: '38px' }}><Icon name="plus" size={16} /> Add Tenant</button></div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {tenants.map(t => {
          const bal = balances[t._id] || { rent: 0, paid: 0, balance: 0 };
          const pct = bal.rent > 0 ? Math.min(100, Math.round((bal.paid / bal.rent) * 100)) : 0;
          const assignedHouse = t.house;
          return (
            <div className="tenant-card" key={t._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar name={t.name} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--ink)' }}>{t.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {t.phone}{t.idNumber ? ` • ID: ${t.idNumber}` : ''}
                      {assignedHouse ? (
                        <span className="tag tag-success" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Icon name="home" size={10} /> {assignedHouse.houseNumber}
                        </span>
                      ) : (
                        <span className="tag tag-neutral">No house</span>
                      )}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {assignedHouse ? (
                    <button className="btn-outline btn-sm" style={{ borderColor: 'var(--amber)', color: 'var(--amber)' }} onClick={() => setVacateConfirm(t._id)}>Vacate</button>
                  ) : (
                    <select className="app-select" style={{ width: 'auto', minWidth: 160, fontSize: '0.8rem', padding: '0.25rem 0.5rem', minHeight: '30px' }} defaultValue="" onChange={e => assignHouse(t._id, e.target.value)}>
                      <option value="">Assign House</option>
                      {houses.filter(h => h.status === 'vacant').map(h => (
                        <option key={h._id} value={h._id}>{h.houseNumber} — KES {(h.rent || 0).toLocaleString()}</option>
                      ))}
                    </select>
                  )}
                  <button className="btn-outline btn-danger btn-sm" style={{ padding: '0 8px', minHeight: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setDelConfirm(t._id)}>
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>

              {assignedHouse && (
                <div style={{ background: 'var(--surface-soft)', borderRadius: 'var(--radius)', padding: '1rem 1.25rem', border: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                    <MiniStat label="Monthly Rent" value={`KES ${(bal.rent || 0).toLocaleString()}`} color="var(--blue)" />
                    <MiniStat label="Paid" value={`KES ${(bal.paid || 0).toLocaleString()}`} color="var(--success)" />
                    <MiniStat label="Balance" value={`KES ${(bal.balance || 0).toLocaleString()}`} color={bal.balance > 0 ? 'var(--danger)' : 'var(--success)'} />
                  </div>
                  <div className="progress" style={{ height: 6 }}>
                    <span style={{ width: `${pct}%`, background: pct === 100 ? 'var(--success)' : pct >= 50 ? 'var(--amber)' : 'var(--danger)' }} />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 6, textAlign: 'right', fontWeight: 500 }}>{pct}% paid</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <input className="app-input" type="number" placeholder="Expected amount (KES)" style={{ flex: '1 1 180px', minHeight: '34px', fontSize: '0.85rem' }}
                  value={amounts[t._id] || ''} onChange={e => setAmounts(p => ({ ...p, [t._id]: e.target.value }))} />
                <button className="btn-outline btn-sm" style={{ minHeight: '34px' }} onClick={() => makePayment(t._id)}>
                  Record Cash Payment
                </button>
                
                <div style={{ background: 'var(--primary-soft)', border: '1px solid rgba(20, 184, 166, 0.15)', borderRadius: 'var(--radius)', padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="creditCard" size={14} className="text-primary" />
                  <div>
                    <span style={{ color: 'var(--muted)', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600 }}>M-Pesa PayBill</span>
                    <span style={{ color: 'var(--ink)', fontWeight: 600 }}>
                      {c2bLoading ? '...' : c2bConfig?.payBillNumber}
                    </span>
                    <span style={{ color: 'var(--muted)', fontSize: '0.7rem', marginLeft: 8 }}>
                      Acc: <strong>{t.house?.houseNumber || t._id}</strong>
                    </span>
                  </div>
                </div>

                <button className="btn-sms btn-sm" style={{ minHeight: '34px', marginLeft: 'auto' }} onClick={() => sendReminder(t)} disabled={smsSending[t._id]}>
                  {smsSending[t._id] ? 'Sending...' : 'Remind'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {!tenants.length && <EmptyState icon="user" title="No tenants yet" sub="Add your first tenant above" />}
    </div>
  );
}
