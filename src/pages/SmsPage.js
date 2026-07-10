import { useState } from 'react';
import { API, authHeader, safeFetch } from '../api';
import { Avatar, EmptyState, Icon } from '../components/ui';

export default function SmsPage({ tenants, balances, toast }) {
  const [broadcastMsg, setBroadcastMsg]         = useState('');
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [smsSending, setSmsSending]             = useState({});

  const sendBroadcast = async () => {
    if (!broadcastMsg.trim()) { toast('Enter a message to broadcast', 'error'); return; }
    setBroadcastSending(true);
    const res = await safeFetch(`${API}/api/sms/broadcast`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ message: broadcastMsg })
    });
    setBroadcastSending(false);
    if (res?.__error) { toast(res.message, 'error'); return; }
    if (res) { toast(`Broadcast sent to ${res.sent} tenants!`, 'success'); setBroadcastMsg(''); }
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
      <div className="surface">
        <div className="section-head" style={{ marginBottom: '0.5rem' }}>
          <h2>Broadcast to All Tenants</h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 16 }}>Send one message to all {tenants.length} tenants at once.</p>
        <textarea className="app-textarea" rows={4} placeholder="e.g. Rent is due on the 1st of every month. Please pay on time to avoid penalties."
          value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)} style={{ resize: 'vertical' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{broadcastMsg.length}/160 characters</span>
          <button className="btn-primary" onClick={sendBroadcast} disabled={broadcastSending} style={{ minHeight: '38px' }}>
            <Icon name="send" size={14} />
            {broadcastSending ? 'Sending...' : `Broadcast to ${tenants.length} Tenants`}
          </button>
        </div>
      </div>

      <div className="surface">
        <div className="section-head" style={{ marginBottom: '0.5rem' }}>
          <h2>Send to Individual Tenant</h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 16 }}>Send a personalised rent reminder to a specific tenant.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tenants.map(t => {
            const bal = balances[t._id] || { balance: 0 };
            return (
              <div key={t._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--surface-soft)', borderRadius: 'var(--radius)', flexWrap: 'wrap', gap: 12, border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar name={t.name} size="md" />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)' }}>{t.name}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2 }}>
                      {t.phone} • Balance: <span style={{ color: bal.balance > 0 ? 'var(--danger)' : 'var(--primary)', fontWeight: 600 }}>KES {(bal.balance || 0).toLocaleString()}</span>
                    </p>
                  </div>
                </div>
                <button className="btn-sms btn-sm" style={{ minHeight: '32px' }} onClick={() => sendReminder(t)} disabled={smsSending[t._id]}>
                  <Icon name="send" size={12} />
                  {smsSending[t._id] ? 'Sending...' : 'Send Reminder'}
                </button>
              </div>
            );
          })}
          {!tenants.length && <EmptyState icon="user" title="No tenants yet" sub="Add tenants first" />}
        </div>
      </div>
    </div>
  );
}
