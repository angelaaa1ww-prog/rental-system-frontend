import React from 'react';

const ICONS = {
  alertTriangle: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m22 4-10 10.01-3-3"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m12 11 9-9M17 7l3 3M14 10l2 2"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/>',
  creditCard: '<rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/>',
  fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  logOut: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
};

export function Icon({ name, size = 18, label, className = '' }) {
  const body = ICONS[name];
  if (!body) return null;
  return (
    <svg
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}

export function Avatar({ name, size = 'md' }) {
  const initials = String(name || '?')
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return <span className={`avatar avatar-${size}`}>{initials || '?'}</span>;
}

export function Field({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

export function MiniStat({ label, value, color }) {
  return (
    <div>
      <p className="eyebrow" style={{ color: 'var(--muted)' }}>{label}</p>
      <p style={{ fontSize: '1rem', fontWeight: 700, color: color || 'var(--ink)' }}>{value}</p>
    </div>
  );
}

export function StatusPill({ status }) {
  const isOccupied = status === 'occupied';
  return (
    <span className={`tag ${isOccupied ? 'tag-danger' : 'tag-success'}`}>
      <Icon name={isOccupied ? 'lock' : 'key'} size={12} />
      {isOccupied ? 'Occupied' : 'Vacant'}
    </span>
  );
}

export function EmptyState({ icon, title, sub }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        {icon && typeof icon === 'string' && icon.length <= 4 ? (
          <span>{icon}</span>
        ) : icon && typeof icon === 'string' && ICONS[icon] ? (
          <Icon name={icon} size={24} />
        ) : (
          <Icon name="info" size={24} />
        )}
      </div>
      <strong>{title}</strong>
      <p>{sub}</p>
    </div>
  );
}

export function ConfirmModal({ open, title, message, onConfirm, onCancel, danger }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="icon-button" aria-label="Close dialog" onClick={onCancel}>
            <Icon name="x" size={16} />
          </button>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>{message}</p>
        <div className="button-row">
          <button className="btn-outline" onClick={onCancel}>Cancel</button>
          <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm}>
            {danger ? 'Delete' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

export const cardStyle = {}; // handled by .surface class
export const cardTitleStyle = {}; // handled by .section-head h2 / .surface h2
export const tableStyle = {}; // handled by .data-table class
export const thStyle = {}; // handled by .data-table th
export const tdStyle = {}; // handled by .data-table td
