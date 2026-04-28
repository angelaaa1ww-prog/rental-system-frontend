import { Avatar, EmptyState, cardStyle, cardTitleStyle, tableStyle, thStyle, tdStyle } from '../components/ui';

export default function PaymentsPage({ payments }) {
  const now = new Date();
  const totalIncome = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const thisMonth = payments
    .filter(p => { const d = new Date(p.createdAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })
    .reduce((s, p) => s + (p.amount || 0), 0);

  const stats = [
    { label: 'Total Collected', value: `KES ${totalIncome.toLocaleString()}`, color: 'var(--accent-primary)', bg: 'rgba(16, 185, 129, 0.1)' },
    { label: 'Transactions', value: payments.length, color: 'var(--accent-secondary)', bg: 'rgba(14, 165, 233, 0.1)' },
    { label: 'This Month', value: `KES ${thisMonth.toLocaleString()}`, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  ];

  return (
    <div style={{ animation: 'fadeUp 0.3s ease' }}>
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={cardTitleStyle}>All Payments</h2>
          <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{payments.length} records</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 16, marginBottom: 24 }}>
          {stats.map(c => (
            <div key={c.label} style={{ background: c.bg, borderRadius: 12, padding: '16px', border: `1px solid ${c.color}20` }}>
              <p style={{ fontSize: 12, color: c.color, fontWeight: 600, marginBottom: 6 }}>{c.label}</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: c.color }}>{c.value}</p>
            </div>
          ))}
        </div>

        {payments.length ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>{['#', 'Tenant', 'Phone', 'Amount', 'Method', 'Reference', 'Date'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={p._id} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    <td style={tdStyle}><span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{i + 1}</span></td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar name={p.tenant?.name} size={32} />
                        <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-main)' }}>{p.tenant?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td style={tdStyle}>{p.tenant?.phone || '—'}</td>
                    <td style={tdStyle}><span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>KES {(p.amount || 0).toLocaleString()}</span></td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', padding: '4px 10px', borderRadius: 8, background: p.paymentMethod === 'mpesa' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', color: p.paymentMethod === 'mpesa' ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                        {p.paymentMethod || 'cash'}
                      </span>
                    </td>
                    <td style={tdStyle}><span style={{ fontSize: 13, fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: 6, color: 'var(--text-muted)' }}>{p.reference || '—'}</span></td>
                    <td style={tdStyle}><span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState icon="💳" title="No payments yet" sub="Payments you record will appear here" />}
      </div>
    </div>
  );
}
