export function Avatar({ name, size = 44, color = '#E1F5EE', textColor = '#0F6E56' }) {
  return (
    <div style={{ width: size, height: size, background: 'rgba(16, 185, 129, 0.15)', borderRadius: size * 0.28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: size * 0.38, color: 'var(--accent-primary)', flexShrink: 0, boxShadow: 'inset 0 0 0 1px rgba(16, 185, 129, 0.3)' }}>
      {name?.[0]?.toUpperCase() || '?'}
    </div>
  );
}

export function Field({ label, children }) {
  return <div><label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 8, letterSpacing: '0.02em' }}>{label}</label>{children}</div>;
}

export function MiniStat({ label, value, color }) {
  return <div><p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 500 }}>{label}</p><p style={{ fontSize: 16, fontWeight: 700, color }}>{value}</p></div>;
}

export function StatusPill({ status }) {
  const occ = status === 'occupied';
  return <span style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: occ ? 'var(--danger-bg)' : 'var(--success-bg)', color: occ ? 'var(--danger)' : 'var(--accent-primary)', border: `1px solid ${occ ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}` }}>{occ ? 'Occupied' : 'Vacant'}</span>;
}

export function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
      <p style={{ fontSize: 48, marginBottom: 16, opacity: 0.8, filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))' }}>{icon}</p>
      <p style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: 18 }}>{title}</p>
      <p style={{ fontSize: 14, marginTop: 6, opacity: 0.7 }}>{sub}</p>
    </div>
  );
}

export function ConfirmModal({ open, title, message, onConfirm, onCancel, danger }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, animation: 'fadeUp 0.2s ease' }}>
      <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 20, padding: '32px 28px', width: 400, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 12, color: 'var(--text-main)' }}>{title}</h3>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn-outline" onClick={onCancel}>Cancel</button>
          <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>
            {danger ? 'Delete' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

export const cardStyle = { background: 'var(--bg-card)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: 16, border: '1px solid var(--border-color)', padding: '24px 28px', marginBottom: 24, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
export const cardTitleStyle = { fontSize: 18, fontWeight: 700, color: 'var(--text-main)', marginBottom: 20, letterSpacing: '-0.01em' };
export const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: 14 };
export const thStyle = { textAlign: 'left', padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', whiteSpace: 'nowrap', background: 'rgba(0,0,0,0.2)' };
export const tdStyle = { padding: '14px 16px', verticalAlign: 'middle', borderBottom: '1px solid rgba(255,255,255,0.03)' };
