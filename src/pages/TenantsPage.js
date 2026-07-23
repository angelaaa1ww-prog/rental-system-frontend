import React, { useMemo, useState } from 'react';
import { API, authHeader, safeFetch } from '../api';
import { Avatar, Field, MiniStat, EmptyState, ConfirmModal, Icon } from '../components/ui';

// ─── Inline Edit Tenant Modal ───────────────────────────────────────────────
function EditTenantModal({ tenant, onClose, onSaved, toast }) {
  const [name, setName] = useState(tenant.name || '');
  const [phone, setPhone] = useState(tenant.phone || '');
  const [idNumber, setIdNumber] = useState(tenant.idNumber || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      toast('Name and phone number are required', 'error');
      return;
    }
    setSaving(true);
    const result = await safeFetch(`${API}/api/tenants/${tenant._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ name: name.trim(), phone: phone.trim(), idNumber: idNumber.trim() })
    });
    setSaving(false);
    if (result?.__error) {
      toast(result.message, 'error');
      return;
    }
    if (result) {
      toast('Tenant updated successfully', 'success');
      onSaved();
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(4px)', padding: '1rem'
    }}>
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius)',
        border: '1px solid var(--line)', padding: '1.75rem',
        maxWidth: 480, width: '100%', boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <p style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)', marginBottom: 2 }}>Edit resident</p>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Tenant: {tenant.name}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4 }}>
            <Icon name="x" size={20} />
          </button>
        </div>
        <form className="form-grid form-grid-modal" onSubmit={handleSave}>
          <Field label="Full name" required>
            <input className="app-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. John Kamau" />
          </Field>
          <Field label="Phone number" required>
            <input className="app-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 0712 345 678" />
          </Field>
          <Field label="National ID" hint="Optional">
            <input className="app-input" value={idNumber} onChange={e => setIdNumber(e.target.value)} placeholder="ID number" />
          </Field>
          <div className="form-action" style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn-outline btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : <><Icon name="check" size={15} /> Save changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main TenantsPage ────────────────────────────────────────────────────────
export default function TenantsPage({ tenants, houses, balances, onRefresh, toast }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [amounts, setAmounts] = useState({});
  const [smsSending, setSmsSending] = useState({});
  const [query, setQuery] = useState('');
  const [assignmentFilter, setAssignmentFilter] = useState('all');
  const [delConfirm, setDelConfirm] = useState(null);
  const [vacateConfirm, setVacateConfirm] = useState(null);
  const [c2bConfig, setC2bConfig] = useState(null);
  const [c2bLoading, setC2bLoading] = useState(true);
  const [editTenant, setEditTenant] = useState(null);

  const addTenant = async () => {
    if (!name || !phone) { toast('Name and phone number are required', 'error'); return; }
    const body = { name, phone };
    if (idNumber.trim()) body.idNumber = idNumber.trim();
    const result = await safeFetch(`${API}/api/tenants`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(body) });
    if (result?.__error) { toast(result.message, 'error'); return; }
    if (result) { toast('Tenant added successfully', 'success'); setName(''); setPhone(''); setIdNumber(''); onRefresh(); }
  };

  const assignHouse = async (tenantId, houseId) => {
    if (!houseId) return;
    const result = await safeFetch(`${API}/api/tenants/${tenantId}/assign`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify({ houseId }) });
    if (result?.__error) toast(result.message, 'error');
    else if (result) { toast('House assigned successfully', 'success'); onRefresh(); }
  };

  const vacateTenant = async (id) => {
    const result = await safeFetch(`${API}/api/tenants/${id}/vacate`, { method: 'PUT', headers: authHeader() });
    if (result?.__error) toast(result.message, 'error');
    else if (result) { toast('Tenant has been marked as vacated', 'success'); onRefresh(); }
    setVacateConfirm(null);
  };

  const deleteTenant = async (id) => {
    const result = await safeFetch(`${API}/api/tenants/${id}`, { method: 'DELETE', headers: authHeader() });
    if (result?.__error) toast(result.message, 'error');
    else if (result) { toast('Tenant deleted successfully', 'success'); onRefresh(); }
    setDelConfirm(null);
  };

  React.useEffect(() => {
    const fetchC2bConfig = async () => {
      setC2bLoading(true);
      const result = await safeFetch(`${API}/api/c2b/config`);
      setC2bConfig(result && !result.__error ? result : { payBillNumber: 'XXXXXX', accountReferenceFormat: 'Tenant ID or House Number' });
      setC2bLoading(false);
    };
    fetchC2bConfig();
  }, []);

  const makePayment = async (tenantId) => {
    const amount = Number(amounts[tenantId]);
    if (!amount || amount <= 0) { toast('Enter a valid payment amount', 'error'); return; }
    const result = await safeFetch(`${API}/api/payments`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify({ tenantId, amount, reference: `CASH-${Date.now()}` }) });
    if (result?.__error) { toast(result.message, 'error'); return; }
    if (result) { toast('Payment recorded successfully', 'success'); setAmounts((current) => ({ ...current, [tenantId]: '' })); onRefresh(); }
  };

  const sendReminder = async (tenant) => {
    const balance = balances[tenant._id] || {};
    const message = `Dear ${tenant.name}, your rent balance is KES ${(balance.balance || 0).toLocaleString()}. Please pay promptly. Thank you - Gifted Hands.`;
    setSmsSending((current) => ({ ...current, [tenant._id]: true }));
    const result = await safeFetch(`${API}/api/sms/send`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify({ phone: tenant.phone, message }) });
    setSmsSending((current) => ({ ...current, [tenant._id]: false }));
    toast(result && !result.__error ? `SMS sent to ${tenant.name}` : result?.message || 'SMS failed', result && !result.__error ? 'success' : 'error');
  };

  const visibleTenants = useMemo(() => tenants.filter((tenant) => {
    const hasHouse = Boolean(tenant.house);
    const text = `${tenant.name || ''} ${tenant.phone || ''} ${tenant.idNumber || ''} ${tenant.house?.houseNumber || ''}`.toLowerCase();
    return text.includes(query.trim().toLowerCase()) && (assignmentFilter === 'all' || (assignmentFilter === 'assigned' && hasHouse) || (assignmentFilter === 'unassigned' && !hasHouse));
  }), [tenants, query, assignmentFilter]);

  const assignedCount = tenants.filter((tenant) => tenant.house).length;

  return (
    <div className="page-stack animate-fade-up">
      <ConfirmModal open={!!delConfirm} title="Delete tenant?" message="This permanently removes the tenant and frees their house. This action cannot be undone." danger onConfirm={() => deleteTenant(delConfirm)} onCancel={() => setDelConfirm(null)} />
      <ConfirmModal open={!!vacateConfirm} title="Vacate tenant?" message="This removes the tenant from their house and marks the unit as vacant. The tenant record is kept." onConfirm={() => vacateTenant(vacateConfirm)} onCancel={() => setVacateConfirm(null)} />

      {editTenant && (
        <EditTenantModal
          tenant={editTenant}
          onClose={() => setEditTenant(null)}
          onSaved={onRefresh}
          toast={toast}
        />
      )}

      <header className="page-title-bar"><div className="page-title-copy"><p className="eyebrow">Resident directory</p><h2>Tenants</h2><p>Manage occupancy, rent balances, and tenant communication from one record.</p></div><span className="tag tag-neutral">{assignedCount} currently housed</span></header>

      <section className="surface">
        <div className="section-head"><div><p className="eyebrow">New resident</p><h2>Add a tenant</h2></div></div>
        <form className="form-grid form-grid-tenants" onSubmit={(event) => { event.preventDefault(); addTenant(); }}>
          <Field label="Full name" required><input className="app-input" placeholder="e.g. John Kamau" value={name} onChange={(event) => setName(event.target.value)} /></Field>
          <Field label="Phone number" required><input className="app-input" inputMode="tel" placeholder="e.g. 0712 345 678" value={phone} onChange={(event) => setPhone(event.target.value)} /></Field>
          <Field label="National ID" hint="Optional"><input className="app-input" placeholder="ID number" value={idNumber} onChange={(event) => setIdNumber(event.target.value)} /></Field>
          <div className="form-action"><button type="submit" className="btn-primary"><Icon name="plus" size={16} /> Add tenant</button></div>
        </form>
      </section>

      <section className="toolbar" aria-label="Tenant filters"><div className="search-field"><Icon name="search" size={16} /><input className="app-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, phone, ID, or house" aria-label="Search tenants" /></div><div className="toolbar-group"><Icon name="filter" size={16} /><select className="app-select filter-select" value={assignmentFilter} onChange={(event) => setAssignmentFilter(event.target.value)} aria-label="Filter tenants by house assignment"><option value="all">All tenants</option><option value="assigned">Assigned a house</option><option value="unassigned">Unassigned</option></select></div></section>

      <section className="tenant-list" aria-label="Tenant records">
        {visibleTenants.map((tenant) => {
          const balance = balances[tenant._id] || { rent: 0, paid: 0, balance: 0 };
          const percentage = balance.rent > 0 ? Math.min(100, Math.round((balance.paid / balance.rent) * 100)) : 0;
          const assignedHouse = tenant.house;
          return <article className="tenant-card" key={tenant._id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Avatar name={tenant.name} /><div><strong style={{ display: 'block', fontSize: '.94rem' }}>{tenant.name}</strong><span style={{ display: 'block', marginTop: 2, color: 'var(--muted)', fontSize: '.76rem' }}>{tenant.phone}{tenant.idNumber ? ` · ID ${tenant.idNumber}` : ''}</span></div></div>
              <div className="action-row">
                {assignedHouse ? <><span className="tag tag-success"><Icon name="home" size={12} /> {assignedHouse.houseNumber}</span><button className="btn-outline btn-sm" style={{ color: 'var(--amber)', borderColor: 'var(--amber)' }} onClick={() => setVacateConfirm(tenant._id)}>Vacate</button></> : <select className="app-select" style={{ minHeight: 32, minWidth: 180, fontSize: '.76rem' }} defaultValue="" onChange={(event) => assignHouse(tenant._id, event.target.value)} aria-label={`Assign a house to ${tenant.name}`}><option value="">Assign house</option>{houses.filter((house) => house.status === 'vacant').map((house) => <option key={house._id} value={house._id}>{house.houseNumber} — KES {(house.rent || 0).toLocaleString()}</option>)}</select>}
                {/* Edit Tenant Button */}
                <button
                  className="btn-outline btn-sm"
                  aria-label={`Edit tenant ${tenant.name}`}
                  onClick={() => setEditTenant(tenant)}
                  title="Edit tenant details"
                >
                  <Icon name="edit" size={14} />
                </button>
                {/* Delete Tenant Button */}
                <button
                  className="btn-outline btn-danger btn-sm"
                  aria-label={`Delete tenant ${tenant.name}`}
                  onClick={() => setDelConfirm(tenant._id)}
                  title="Delete tenant"
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </div>

            {assignedHouse && <div className="tenant-summary"><MiniStat label="Monthly rent" value={`KES ${(balance.rent || 0).toLocaleString()}`} color="var(--ink)" /><MiniStat label="Paid this month" value={`KES ${(balance.paid || 0).toLocaleString()}`} color="var(--success)" /><MiniStat label="Balance due" value={`KES ${(balance.balance || 0).toLocaleString()}`} color={balance.balance > 0 ? 'var(--danger)' : 'var(--success)'} /><div style={{ gridColumn: '1 / -1' }}><div className="progress"><span style={{ width: `${percentage}%`, background: percentage === 100 ? 'var(--success)' : percentage >= 50 ? 'var(--amber)' : 'var(--danger)' }} /></div><p style={{ marginTop: 6, color: 'var(--muted)', fontSize: '.7rem', textAlign: 'right' }}>{percentage}% of rent received</p></div></div>}

            <div className="action-row"><input className="app-input" type="number" min="1" placeholder="Cash payment amount (KES)" style={{ width: 210, minHeight: 34 }} value={amounts[tenant._id] || ''} onChange={(event) => setAmounts((current) => ({ ...current, [tenant._id]: event.target.value }))} aria-label={`Cash payment amount for ${tenant.name}`} /><button className="btn-outline btn-sm" onClick={() => makePayment(tenant._id)}><Icon name="creditCard" size={14} /> Record cash payment</button><span className="tag tag-neutral" style={{ padding: '6px 9px' }}><Icon name="creditCard" size={13} /> PayBill {c2bLoading ? 'loading' : c2bConfig?.payBillNumber} · Acc {tenant.house?.houseNumber || tenant._id}</span><button className="btn-sms btn-sm" style={{ marginLeft: 'auto' }} onClick={() => sendReminder(tenant)} disabled={smsSending[tenant._id]}><Icon name="send" size={13} /> {smsSending[tenant._id] ? 'Sending' : 'Send reminder'}</button></div>
          </article>;
        })}
      </section>

      {!visibleTenants.length && <EmptyState icon={tenants.length ? 'info' : 'user'} title={tenants.length ? 'No matching tenants' : 'No tenants yet'} sub={tenants.length ? 'Try a different search or assignment filter.' : 'Add your first tenant using the form above.'} />}
    </div>
  );
}