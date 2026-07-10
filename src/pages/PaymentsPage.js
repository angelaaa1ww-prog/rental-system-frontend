import { Avatar, EmptyState } from '../components/ui';

export default function PaymentsPage({ payments }) {
  const now = new Date();
  const totalIncome = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const thisMonth = payments
    .filter(p => { const d = new Date(p.createdAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })
    .reduce((s, p) => s + (p.amount || 0), 0);

  const stats = [
    { label: 'Total Collected', value: `KES ${totalIncome.toLocaleString()}`, color: 'var(--primary)', bg: 'var(--primary-soft)' },
    { label: 'Transactions', value: payments.length, color: 'var(--blue)', bg: 'var(--blue-soft)' },
    { label: 'This Month', value: `KES ${thisMonth.toLocaleString()}`, color: 'var(--amber)', bg: 'var(--amber-soft)' },
  ];

  return (
    <div className="page-stack" style={{ animation: 'fadeUp 0.3s ease' }}>
      <div className="surface">
        <div className="section-head" style={{ marginBottom: '1.25rem' }}>
          <h2>All Payments</h2>
          <span className="tag tag-neutral">{payments.length} records</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 16, marginBottom: 24 }}>
          {stats.map(c => (
            <div key={c.label} style={{ background: c.bg, borderRadius: 'var(--radius)', padding: '1.25rem', border: `1px solid ${c.color}20` }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{c.label}</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: c.color, margin: 0 }}>{c.value}</p>
            </div>
          ))}
        </div>

        {payments.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>{['#', 'Tenant', 'Phone', 'Amount', 'Method', 'Reference', 'Date'].map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={p._id}>
                    <td><span style={{ color: 'var(--muted)', fontSize: 13 }}>{i + 1}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={p.tenant?.name} size="sm" />
                        <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{p.tenant?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--muted)' }}>{p.tenant?.phone || '—'}</td>
                    <td><span style={{ fontWeight: 600, color: 'var(--primary)' }}>KES {(p.amount || 0).toLocaleString()}</span></td>
                    <td>
                      <span className={`tag ${p.paymentMethod === 'mpesa' ? 'tag-success' : 'tag-neutral'}`} style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                        {p.paymentMethod || 'cash'}
                      </span>
                    </td>
                    <td><span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', background: 'var(--bg-strong)', padding: '2px 6px', borderRadius: 4, color: 'var(--muted)' }}>{p.reference || '—'}</span></td>
                    <td style={{ color: 'var(--muted)' }}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState icon="creditCard" title="No payments yet" sub="Payments you record will appear here" />}
      </div>
    </div>
  );
}
