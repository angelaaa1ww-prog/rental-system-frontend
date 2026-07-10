import React, { useEffect, useState } from 'react';
import { API, authHeader } from '../api';

const ICONS = {
  alertTriangle: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  check: '<path d="m20 6-11 11-5-5"/>',
  checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m22 4-10 10.01-3-3"/>',
  dollarSign: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m12 11 9-9M17 7l3 3M14 10l2 2"/>',
  messageSquare: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  xCircle: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>'
};

function Icon({ name, size = 18, label, className = '' }) {
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

function Avatar({ name, size = 'sm' }) {
  const initials = String(name || '?')
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return <span className={`avatar avatar-${size}`}>{initials || '?'}</span>;
}

export default function Dashboard({ onPageChange, reminders = [] }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch(`${API}/api/dashboard`, { headers: authHeader() });
      if (!res.ok) throw new Error('Failed to load dashboard summary');
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

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="page-stack">
        <div className="metric-grid">
          {[...Array(6)].map((_, i) => (
            <span className="skeleton-tile" key={i} style={{ height: '128px' }} />
          ))}
        </div>
        <div className="surface" style={{ height: '180px', borderRadius: '12px' }}>
          <div className="skeleton-tile" style={{ height: '100%', width: '100%', borderRadius: '12px' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--danger)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <Icon name="alertTriangle" size={48} className="text-danger" />
        </div>
        <p style={{ fontWeight: 600, margin: '1rem 0', fontSize: '18px' }}>Failed to sync liveboard</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '1.5rem' }}>{error}</p>
        <button className="btn-primary" onClick={() => load()}>Try Again</button>
      </div>
    );
  }

  if (!data) return null;

  const totalHouses = data.totalHouses || 0;
  const occupied = data.occupied || 0;
  const available = data.available || 0;
  const totalIncome = data.totalIncome || 0;
  const overdueCount = data.overdueCount || 0;
  const occupancy = data.occupancyRate || 0;

  return (
    <div className="page-stack" style={{ animation: 'fadeUp 0.3s ease' }}>
      
      {/* Liveboard Metrics */}
      <div className="metric-grid">
        <article className="metric-tile metric-primary">
          <span><Icon name="home" size={22} /></span>
          <div>
            <strong>{totalHouses}</strong>
            <p>Total Houses</p>
          </div>
        </article>

        <article className="metric-tile metric-success">
          <span><Icon name="checkCircle" size={22} /></span>
          <div>
            <strong>{occupied}</strong>
            <p>Occupied</p>
          </div>
        </article>

        <article className="metric-tile metric-warning">
          <span><Icon name="key" size={22} /></span>
          <div>
            <strong>{available}</strong>
            <p>Vacant</p>
          </div>
        </article>

        <article className="metric-tile metric-blue">
          <span><Icon name="dollarSign" size={22} /></span>
          <div>
            <strong>KES {totalIncome.toLocaleString()}</strong>
            <p>Total Income</p>
          </div>
        </article>

        <article className={`metric-tile ${overdueCount > 0 ? 'metric-danger' : 'metric-success'}`}>
          <span><Icon name={overdueCount > 0 ? 'alertTriangle' : 'check'} size={22} /></span>
          <div>
            <strong>{overdueCount}</strong>
            <p>Overdue</p>
          </div>
        </article>

        <article className="metric-tile metric-violet">
          <span><Icon name="users" size={22} /></span>
          <div>
            <strong>{data.totalTenants || 0}</strong>
            <p>Total Tenants</p>
          </div>
        </article>
      </div>

      {/* Split section - Occupancy and Reminders */}
      <div className="split-grid">
        
        {/* Occupancy card */}
        <section className="surface span-7">
          <div className="section-head">
            <div>
              <p className="eyebrow">Occupancy</p>
              <h2>Portfolio Health</h2>
            </div>
            <span className={`tag ${occupancy >= 85 ? 'tag-success' : occupancy >= 50 ? 'tag-warning' : 'tag-danger'}`}>
              {occupancy}% Filled
            </span>
          </div>
          <div className="progress big" style={{ margin: '1.5rem 0' }}>
            <span style={{ width: `${occupancy}%`, background: 'var(--primary)' }} />
          </div>
          <div className="mini-grid" style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <span><strong>{occupied}</strong> occupied</span>
            <span><strong>{available}</strong> vacant</span>
            <span><strong>{totalHouses}</strong> total</span>
          </div>
        </section>

        {/* Due Reminders card */}
        <section className="surface span-5">
          <div className="section-head">
            <div>
              <p className="eyebrow">Attention</p>
              <h2>Due Reminders</h2>
            </div>
            <button className="button button-ghost" onClick={() => onPageChange('sms')} style={{ padding: '4px 10px', minHeight: '32px' }}>
              Open SMS
            </button>
          </div>
          
          {!reminders.length ? (
            <div className="empty-state" style={{ padding: '1.5rem 0' }}>
              <span className="empty-icon"><Icon name="checkCircle" size={24} /></span>
              <strong>No reminders queueing</strong>
              <p>All tenant balances are handled.</p>
            </div>
          ) : (
            <div className="compact-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              {reminders.slice(0, 3).map((rem, idx) => (
                <div className="compact-row" key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                  <Avatar name={rem.name} size="sm" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-main)' }}>{rem.name}</strong>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {rem.message}
                    </span>
                  </div>
                </div>
              ))}
              {reminders.length > 3 && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', margin: '0.25rem 0 0' }}>
                  + {reminders.length - 3} more reminders queueing
                </p>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Overdue Table */}
      <section className="surface">
        <div className="section-head" style={{ marginBottom: '1.5rem' }}>
          <div>
            <p className="eyebrow">Risk Queue</p>
            <h2>Overdue Rent Balances</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {overdueCount > 0 && <span className="tag tag-danger">{overdueCount} pending</span>}
            <button onClick={() => load(true)} disabled={refreshing} className="btn-outline btn-sm" style={{ minHeight: '34px', padding: '0 12px' }}>
              {refreshing ? 'Syncing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {!data.overdueTenants?.length ? (
          <div className="empty-state" style={{ padding: '3rem 0' }}>
            <span className="empty-icon"><Icon name="checkCircle" size={28} /></span>
            <strong style={{ display: 'block', fontSize: '18px', color: 'var(--primary)', marginTop: '0.5rem' }}>
              All accounts are clean
            </strong>
            <p>No overdue tenant payments currently flagged.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.1)' }}>
                  {['Tenant', 'Phone', 'House', 'Rent', 'Paid', 'Balance'].map((header) => (
                    <th key={header} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.overdueTenants.map((t, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                    <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Avatar name={t.name} size="sm" />
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{t.name}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{t.phone}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="tag tag-neutral" style={{ background: 'var(--blue-soft)', color: 'var(--blue)' }}>{t.house}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>KES {t.rent.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>KES {t.paid.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="tag tag-danger" style={{ fontWeight: 700 }}>
                        KES {t.balance.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}