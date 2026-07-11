import { useMemo, useState } from 'react';
import { API, authHeader, safeFetch } from '../api';
import { Avatar, EmptyState, Icon } from '../components/ui';

export default function SmsPage({ tenants, balances, toast }) {
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [smsSending, setSmsSending] = useState({});
  const [query, setQuery] = useState('');

  const sendBroadcast = async () => {
    if (!broadcastMsg.trim()) { toast('Enter a message to broadcast', 'error'); return; }
    setBroadcastSending(true);
    const result = await safeFetch(`${API}/api/sms/broadcast`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify({ message: broadcastMsg }) });
    setBroadcastSending(false);
    if (result?.__error) { toast(result.message, 'error'); return; }
    if (result) { toast(`Broadcast sent to ${result.sent} tenants`, 'success'); setBroadcastMsg(''); }
  };

  const sendReminder = async (tenant) => {
    const balance = balances[tenant._id] || {};
    const message = `Dear ${tenant.name}, your rent balance is KES ${(balance.balance || 0).toLocaleString()}. Please pay promptly. Thank you - Gifted Hands.`;
    setSmsSending((current) => ({ ...current, [tenant._id]: true }));
    const result = await safeFetch(`${API}/api/sms/send`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify({ phone: tenant.phone, message }) });
    setSmsSending((current) => ({ ...current, [tenant._id]: false }));
    toast(result && !result.__error ? `SMS sent to ${tenant.name}` : result?.message || 'SMS failed', result && !result.__error ? 'success' : 'error');
  };

  const visibleTenants = useMemo(() => tenants.filter((tenant) => `${tenant.name || ''} ${tenant.phone || ''} ${tenant.house?.houseNumber || ''}`.toLowerCase().includes(query.trim().toLowerCase())), [tenants, query]);

  return (
    <div className="page-stack animate-fade-up">
      <header className="page-title-bar"><div className="page-title-copy"><p className="eyebrow">Tenant communications</p><h2>SMS reminders</h2><p>Send clear payment updates to your full portfolio or a specific tenant.</p></div><span className="tag tag-neutral">{tenants.length} recipients</span></header>

      <section className="surface broadcast-panel">
        <div className="section-head"><div><p className="eyebrow">Broadcast message</p><h2>Reach every tenant</h2></div><span className="tag tag-blue">Up to 160 characters</span></div>
        <textarea className="app-textarea" rows={5} maxLength={160} placeholder="Write a concise update for all tenants…" value={broadcastMsg} onChange={(event) => setBroadcastMsg(event.target.value)} aria-label="Broadcast message" style={{ resize: 'vertical' }} />
        <div className="toolbar"><span style={{ color: 'var(--muted)', fontSize: '.74rem' }}>{broadcastMsg.length}/160 characters · Sent to all {tenants.length} tenants</span><button className="btn-primary" onClick={sendBroadcast} disabled={broadcastSending || !tenants.length}><Icon name="send" size={15} /> {broadcastSending ? 'Sending message' : `Broadcast to ${tenants.length} tenants`}</button></div>
      </section>

      <section className="surface">
        <div className="section-head"><div><p className="eyebrow">Individual reminder</p><h2>Targeted follow-ups</h2></div></div>
        <div className="toolbar" style={{ marginBottom: 16 }}><div className="search-field"><Icon name="search" size={16} /><input className="app-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tenant, phone, or house" aria-label="Search SMS recipients" /></div><span style={{ color: 'var(--muted)', fontSize: '.75rem' }}>{visibleTenants.length} recipient{visibleTenants.length === 1 ? '' : 's'}</span></div>
        <div className="recipient-list">{visibleTenants.map((tenant) => {
          const balance = balances[tenant._id] || { balance: 0 };
          const hasBalance = balance.balance > 0;
          return <article className="recipient-row" key={tenant._id}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Avatar name={tenant.name} size="md" /><div><strong style={{ display: 'block', fontSize: '.84rem' }}>{tenant.name}</strong><span style={{ color: 'var(--muted)', fontSize: '.74rem' }}>{tenant.phone}{tenant.house?.houseNumber ? ` · ${tenant.house.houseNumber}` : ''}</span></div></div><div className="action-row"><span className={`tag ${hasBalance ? 'tag-danger' : 'tag-success'}`}>Balance {`KES ${(balance.balance || 0).toLocaleString()}`}</span><button className="btn-sms btn-sm" onClick={() => sendReminder(tenant)} disabled={smsSending[tenant._id]}><Icon name="send" size={13} /> {smsSending[tenant._id] ? 'Sending' : 'Send reminder'}</button></div></article>;
        })}</div>
        {!visibleTenants.length && <EmptyState icon={tenants.length ? 'info' : 'user'} title={tenants.length ? 'No matching recipients' : 'No tenants yet'} sub={tenants.length ? 'Try a different search term.' : 'Add tenants before sending a reminder.'} />}
      </section>
    </div>
  );
}