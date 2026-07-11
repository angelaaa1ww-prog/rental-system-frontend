import React, { useEffect, useState } from 'react';
import { API, authHeader } from '../api';
import { Icon as AppIcon } from '../components/ui';

function Avatar({ name, size = 'sm' }) {
  const initials = String(name || '?').split(' ').map((part) => part[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  return <span className={`avatar avatar-${size}`}>{initials || '?'}</span>;
}

const currency = (value) => `KES ${(Number(value) || 0).toLocaleString()}`;

function getRevenueSeries(payments) {
  const now = new Date();
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const amount = payments
      .filter((payment) => {
        const created = new Date(payment.createdAt);
        return created.getMonth() === date.getMonth() && created.getFullYear() === date.getFullYear();
      })
      .reduce((total, payment) => total + (Number(payment.amount) || 0), 0);
    return { label: date.toLocaleDateString('en-KE', { month: 'short' }), amount };
  });
}

export default function Dashboard({ onPageChange, reminders = [], payments = [] }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const response = await fetch(`${API}/api/dashboard`, { headers: authHeader() });
      if (!response.ok) throw new Error('Failed to load dashboard summary');
      setData(await response.json());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return <div className="page-stack"><div className="metric-grid">{[...Array(6)].map((_, index) => <span className="skeleton-tile" key={index} style={{ height: 132 }} />)}</div><div className="surface"><div className="skeleton-tile" style={{ height: 260, width: '100%' }} /></div></div>;
  }

  if (error) {
    return <div className="empty-state"><span className="empty-icon"><AppIcon name="alertTriangle" size={24} /></span><strong>Dashboard data could not be synced</strong><p>{error}</p><button className="btn-primary" onClick={() => load()}>Try again</button></div>;
  }

  if (!data) return null;

  const totalHouses = data.totalHouses || 0;
  const occupied = data.occupied || 0;
  const available = data.available || 0;
  const totalIncome = data.totalIncome || 0;
  const overdueCount = data.overdueCount || 0;
  const occupancy = data.occupancyRate || 0;
  const revenueSeries = getRevenueSeries(payments);
  const largestRevenue = Math.max(...revenueSeries.map((entry) => entry.amount), 1);
  const recentPayments = [...payments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);

  return (
    <div className="page-stack animate-fade-up">
      <section className="dashboard-intro">
        <div>
          <p className="eyebrow">Portfolio overview</p>
          <h2>Make the next rent cycle predictable.</h2>
          <p>Monitor occupancy, revenue, and tenant follow-ups from one focused workspace.</p>
        </div>
        <div className="dashboard-actions" aria-label="Quick actions">
          <button className="btn-outline" onClick={() => onPageChange('reports')}><AppIcon name="receipt" size={15} /> View reports</button>
          <button className="btn-primary" onClick={() => onPageChange('properties')}><AppIcon name="plus" size={16} /> Add house</button>
        </div>
      </section>

      <section className="metric-grid" aria-label="Portfolio metrics">
        <article className="metric-tile metric-primary"><span><AppIcon name="home" size={21} /></span><div><strong>{totalHouses}</strong><p>Total houses</p></div></article>
        <article className="metric-tile metric-success"><span><AppIcon name="checkCircle" size={21} /></span><div><strong>{occupied}</strong><p>Occupied units</p><small className="metric-change">{occupancy}% of portfolio</small></div></article>
        <article className="metric-tile metric-warning"><span><AppIcon name="key" size={21} /></span><div><strong>{available}</strong><p>Vacant units</p></div></article>
        <article className="metric-tile metric-blue"><span><AppIcon name="dollarSign" size={21} /></span><div><strong>{currency(totalIncome)}</strong><p>Collected income</p></div></article>
        <article className={`metric-tile ${overdueCount > 0 ? 'metric-danger' : 'metric-success'}`}><span><AppIcon name={overdueCount > 0 ? 'alertTriangle' : 'check'} size={21} /></span><div><strong>{overdueCount}</strong><p>Overdue accounts</p></div></article>
        <article className="metric-tile metric-violet"><span><AppIcon name="users" size={21} /></span><div><strong>{data.totalTenants || 0}</strong><p>Active tenants</p></div></article>
      </section>

      <section className="quick-actions" aria-label="Common tasks">
        <button className="quick-action" onClick={() => onPageChange('properties')}><span><AppIcon name="home" size={16} /></span><strong>Manage houses</strong></button>
        <button className="quick-action" onClick={() => onPageChange('tenants')}><span><AppIcon name="users" size={16} /></span><strong>Add or assign tenant</strong></button>
        <button className="quick-action" onClick={() => onPageChange('payments')}><span><AppIcon name="dollarSign" size={16} /></span><strong>Review payments</strong></button>
        <button className="quick-action" onClick={() => onPageChange('sms')}><span><AppIcon name="messageSquare" size={16} /></span><strong>Send reminder</strong></button>
      </section>

      <section className="dashboard-analytics">
        <article className="surface revenue-chart">
          <div className="chart-header">
            <div><p className="eyebrow">Revenue trend</p><h2>Monthly collections</h2><p className="chart-subtitle">Confirmed payment activity over the last six months.</p></div>
            <div style={{ textAlign: 'right' }}><span className="chart-total">{currency(revenueSeries[revenueSeries.length - 1]?.amount)}</span><p className="chart-subtitle">Current month</p></div>
          </div>
          <div className="bar-chart" role="img" aria-label="Monthly payment collection bar chart">
            {revenueSeries.map((entry) => <div className="chart-bar-wrap" key={entry.label} title={`${entry.label}: ${currency(entry.amount)}`}><div className="chart-bar-track"><span className="chart-bar" style={{ height: `${Math.max(4, Math.round((entry.amount / largestRevenue) * 100))}%` }} /></div><span className="chart-label">{entry.label}</span></div>)}
          </div>
        </article>

        <article className="surface portfolio-panel">
          <div><p className="eyebrow">Portfolio health</p><h2>Occupancy status</h2></div>
          <div className="occupancy-figure"><strong>{occupancy}%</strong><span>units currently occupied</span></div>
          <div className="portfolio-stats"><div className="portfolio-stat"><strong>{occupied}</strong><span>Occupied</span></div><div className="portfolio-stat"><strong>{available}</strong><span>Vacant</span></div><div className="portfolio-stat"><strong>{totalHouses}</strong><span>Total</span></div></div>
          <div className="progress"><span style={{ width: `${Math.min(100, occupancy)}%`, background: 'var(--primary)' }} /></div>
        </article>
      </section>

      <section className="split-grid">
        <article className="surface span-7">
          <div className="section-head"><div><p className="eyebrow">Recent activity</p><h2>Latest payments</h2></div><button className="btn-ghost btn-sm" onClick={() => onPageChange('payments')}>All payments <AppIcon name="arrowUpRight" size={14} /></button></div>
          {recentPayments.length ? recentPayments.map((payment) => <div className="recent-payment" key={payment._id}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={payment.tenant?.name} size="sm" /><div><strong style={{ display: 'block', fontSize: '.82rem' }}>{payment.tenant?.name || 'Unknown tenant'}</strong><span style={{ color: 'var(--muted)', fontSize: '.72rem' }}>{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date unavailable'}</span></div></div><strong style={{ color: 'var(--success)', fontSize: '.82rem' }}>{currency(payment.amount)}</strong></div>) : <div className="empty-state"><strong>No payment activity yet</strong><p>Recorded payments will appear here automatically.</p></div>}
        </article>

        <article className="surface span-5">
          <div className="section-head"><div><p className="eyebrow">Follow-up queue</p><h2>Rent reminders</h2></div><button className="btn-ghost btn-sm" onClick={() => onPageChange('sms')}>Open SMS</button></div>
          {!reminders.length ? <div className="empty-state"><span className="empty-icon"><AppIcon name="checkCircle" size={22} /></span><strong>No reminders pending</strong><p>All tenant balances are currently handled.</p></div> : <div style={{ display: 'grid', gap: 8 }}>{reminders.slice(0, 4).map((reminder, index) => <div className="compact-row" key={`${reminder.name}-${index}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10 }}><Avatar name={reminder.name} size="sm" /><div style={{ minWidth: 0, flex: 1 }}><strong style={{ display: 'block', fontSize: '.8rem' }}>{reminder.name}</strong><span style={{ display: 'block', color: 'var(--muted)', fontSize: '.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{reminder.message}</span></div></div>)}</div>}
        </article>
      </section>

      <section className="surface">
        <div className="section-head"><div><p className="eyebrow">Risk queue</p><h2>Overdue rent balances</h2></div><div className="action-row">{overdueCount > 0 && <span className="tag tag-danger">{overdueCount} pending</span>}<button onClick={() => load(true)} disabled={refreshing} className="btn-outline btn-sm"><AppIcon name="refresh" size={14} /> {refreshing ? 'Refreshing' : 'Refresh'}</button></div></div>
        {!data.overdueTenants?.length ? <div className="empty-state"><span className="empty-icon"><AppIcon name="checkCircle" size={22} /></span><strong>All accounts are current</strong><p>No overdue tenant payments are flagged right now.</p></div> : <div className="table-wrap"><table className="data-table"><caption className="sr-only">Overdue tenant rent balances</caption><thead><tr>{['Tenant', 'Phone', 'House', 'Rent', 'Paid', 'Balance'].map((header) => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{data.overdueTenants.map((tenant, index) => <tr key={`${tenant.name}-${index}`}><td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={tenant.name} size="sm" /><strong>{tenant.name}</strong></div></td><td>{tenant.phone || '—'}</td><td><span className="tag tag-neutral">{tenant.house || '—'}</span></td><td>{currency(tenant.rent)}</td><td>{currency(tenant.paid)}</td><td><span className="tag tag-danger">{currency(tenant.balance)}</span></td></tr>)}</tbody></table></div>}
      </section>
    </div>
  );
}