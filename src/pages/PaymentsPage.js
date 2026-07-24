import { useEffect, useMemo, useState } from 'react';
import { API, authHeader, safeFetch } from '../api';
import { Avatar, EmptyState, Icon, ConfirmModal } from '../components/ui';

const PAGE_SIZE = 8;
const currency = (value) => `KES ${(Number(value) || 0).toLocaleString()}`;

export default function PaymentsPage({ payments, onRefresh, toast }) {
  const [query, setQuery] = useState('');
  const [method, setMethod] = useState('all');
  const [selected, setSelected] = useState(() => new Set());
  const [page, setPage] = useState(1);
  const [c2bConfig, setC2bConfig] = useState(null);

  // Delete modal state
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { mode: 'single' | 'selected' | 'all', id?: string }
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    safeFetch(`${API}/api/c2b/config`).then((res) => {
      if (res && !res.__error) setC2bConfig(res);
    });
  }, []);

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);

    try {
      const headers = { 'Content-Type': 'application/json', ...authHeader() };

      if (deleteConfirm.mode === 'single' && deleteConfirm.id) {
        const res = await safeFetch(`${API}/api/payments/${deleteConfirm.id}`, { method: 'DELETE', headers: authHeader() });
        if (res?.__error) {
          if (toast) toast(res.message || 'Failed to delete payment', 'error');
        } else {
          if (toast) toast('Payment record deleted successfully', 'success');
          setSelected((prev) => { const next = new Set(prev); next.delete(deleteConfirm.id); return next; });
          if (onRefresh) onRefresh();
        }
      } else if (deleteConfirm.mode === 'selected') {
        const ids = Array.from(selected);
        const res = await safeFetch(`${API}/api/payments/bulk-delete`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ ids })
        });
        if (res?.__error) {
          if (toast) toast(res.message || 'Failed to delete selected payments', 'error');
        } else {
          if (toast) toast(`Successfully deleted ${ids.length} payment records`, 'success');
          setSelected(new Set());
          if (onRefresh) onRefresh();
        }
      } else if (deleteConfirm.mode === 'all') {
        const res = await safeFetch(`${API}/api/payments/clear/all`, { method: 'DELETE', headers: authHeader() });
        if (res?.__error) {
          if (toast) toast(res.message || 'Failed to clear payment records', 'error');
        } else {
          if (toast) toast('All payment history cleared successfully', 'success');
          setSelected(new Set());
          if (onRefresh) onRefresh();
        }
      }
    } catch (err) {
      if (toast) toast('Failed to delete payment records', 'error');
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const now = new Date();
  const totalIncome = payments.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);
  const thisMonth = payments.filter((payment) => {
    const date = new Date(payment.createdAt);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);

  const filteredPayments = useMemo(() => payments.filter((payment) => {
    const text = `${payment.tenant?.name || ''} ${payment.tenant?.phone || ''} ${payment.reference || ''}`.toLowerCase();
    return text.includes(query.trim().toLowerCase()) && (method === 'all' || (payment.paymentMethod || 'cash').toLowerCase() === method);
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [payments, query, method]);

  const pageCount = Math.max(1, Math.ceil(filteredPayments.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visiblePayments = filteredPayments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const allVisibleSelected = visiblePayments.length > 0 && visiblePayments.every((payment) => selected.has(payment._id));
  const togglePayment = (id) => setSelected((current) => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const toggleVisible = () => setSelected((current) => { const next = new Set(current); if (allVisibleSelected) visiblePayments.forEach((payment) => next.delete(payment._id)); else visiblePayments.forEach((payment) => next.add(payment._id)); return next; });

  const getConfirmTitle = () => {
    if (deleteConfirm?.mode === 'single') return 'Delete payment record?';
    if (deleteConfirm?.mode === 'selected') return `Delete ${selected.size} selected payment records?`;
    if (deleteConfirm?.mode === 'all') return 'Clear all payment history?';
    return 'Confirm Deletion';
  };

  const getConfirmMessage = () => {
    if (deleteConfirm?.mode === 'single') return 'This will permanently delete this payment transaction from the ledger. This action cannot be undone.';
    if (deleteConfirm?.mode === 'selected') return `This will permanently delete ${selected.size} selected payment transactions from the ledger. This action cannot be undone.`;
    if (deleteConfirm?.mode === 'all') return 'This will permanently clear ALL payment history records from the system. This action cannot be undone.';
    return '';
  };

  return (
    <div className="page-stack animate-fade-up">
      <ConfirmModal
        open={!!deleteConfirm}
        title={getConfirmTitle()}
        message={getConfirmMessage()}
        danger
        onConfirm={executeDelete}
        onCancel={() => setDeleteConfirm(null)}
      />

      <header className="page-title-bar">
        <div className="page-title-copy">
          <p className="eyebrow">Transaction ledger</p>
          <h2>Payments</h2>
          <p>Live automated M-Pesa C2B PayBill payments and manual cash entries with instant ledger updates.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {payments.length > 0 && (
            <button 
              className="btn-outline btn-danger btn-sm" 
              onClick={() => setDeleteConfirm({ mode: 'all' })} 
              title="Clear all payment records"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Icon name="trash" size={14} /> Clear All History
            </button>
          )}
          <span className="tag tag-success">{payments.length} records</span>
        </div>
      </header>

      {/* C2B Live Production PayBill Banner */}
      <section className="surface" style={{ background: 'var(--surface-soft)', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--primary-soft)', color: 'var(--primary)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Icon name="creditCard" size={22} />
            </div>
            <div>
              <strong style={{ fontSize: '.92rem', display: 'block', color: 'var(--ink)' }}>
                Live M-Pesa C2B PayBill Active · Business No. {c2bConfig?.payBillNumber || '400222'}
              </strong>
              <span style={{ fontSize: '.76rem', color: 'var(--muted)' }}>
                Account Format: <strong>{c2bConfig?.accountReferenceFormat || '1183070#<HouseNumber> (e.g. 1183070#A101)'}</strong> · Production Webhooks Configured
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="tag tag-success"><Icon name="checkCircle" size={12} /> Live Production</span>
            <span className="tag tag-success"><Icon name="refresh" size={12} /> Auto-Reflect Active</span>
            <span className="tag tag-neutral"><Icon name="shield" size={12} /> Hash Token Secured</span>
          </div>
        </div>
      </section>

      <section className="payment-summary-grid" aria-label="Payment summary">
        <article className="summary-stat"><p>Total collected</p><strong style={{ color: 'var(--primary)' }}>{currency(totalIncome)}</strong></article>
        <article className="summary-stat"><p>Transactions</p><strong>{payments.length}</strong></article>
        <article className="summary-stat"><p>Collected this month</p><strong style={{ color: 'var(--success)' }}>{currency(thisMonth)}</strong></article>
      </section>

      <section className="surface">
        <div className="section-head">
          <div><p className="eyebrow">Payment records</p><h2>All transactions</h2></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {selected.size > 0 && (
              <>
                <span className="tag tag-blue">{selected.size} selected</span>
                <button 
                  className="btn-outline btn-danger btn-sm" 
                  onClick={() => setDeleteConfirm({ mode: 'selected' })}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Icon name="trash" size={14} /> Delete Selected ({selected.size})
                </button>
              </>
            )}
          </div>
        </div>

        <div className="toolbar" style={{ marginBottom: 16 }}>
          <div className="search-field">
            <Icon name="search" size={16} />
            <input className="app-input" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search tenant, phone, or reference" aria-label="Search payments" />
          </div>
          <div className="toolbar-group">
            <Icon name="filter" size={16} />
            <select className="app-select filter-select" value={method} onChange={(event) => { setMethod(event.target.value); setPage(1); }} aria-label="Filter payments by method">
              <option value="all">All methods</option>
              <option value="mpesa">M-Pesa</option>
              <option value="cash">Cash</option>
            </select>
          </div>
        </div>

        {filteredPayments.length ? (
          <>
            <div className="table-wrap">
              <table className="data-table">
                <caption className="sr-only">Payment transaction records</caption>
                <thead>
                  <tr>
                    <th scope="col"><input type="checkbox" checked={allVisibleSelected} onChange={toggleVisible} aria-label="Select visible payments" /></th>
                    {['Tenant', 'House', 'Phone', 'Amount', 'Method', 'Reference', 'Date', 'Action'].map((heading) => (
                      <th scope="col" key={heading}>{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visiblePayments.map((payment) => (
                    <tr key={payment._id}>
                      <td>
                        <input type="checkbox" checked={selected.has(payment._id)} onChange={() => togglePayment(payment._id)} aria-label={`Select payment from ${payment.tenant?.name || 'unknown tenant'}`} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar name={payment.tenant?.name} size="sm" />
                          <strong>{payment.tenant?.name || 'Unknown tenant'}</strong>
                        </div>
                      </td>
                      <td>
                        <span className="tag tag-blue" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          {payment.tenant?.house?.houseNumber ? `House ${payment.tenant.house.houseNumber}` : (payment.billRefNumber ? `Ref: ${payment.billRefNumber}` : '—')}
                        </span>
                      </td>
                      <td>{payment.tenant?.phone || '—'}</td>
                      <td><strong style={{ color: 'var(--success)' }}>{currency(payment.amount)}</strong></td>
                      <td>
                        <span className={`tag ${(payment.paymentMethod || 'cash').toLowerCase() === 'mpesa' ? 'tag-success' : 'tag-neutral'}`}>
                          {payment.paymentMethod || 'cash'}
                        </span>
                      </td>
                      <td><code style={{ color: 'var(--muted)', fontSize: '.72rem', fontFamily: 'var(--font-mono)' }}>{payment.reference || '—'}</code></td>
                      <td>{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                      <td>
                        <button
                          className="btn-outline btn-danger btn-sm"
                          type="button"
                          aria-label={`Delete payment record ${payment.reference}`}
                          onClick={() => setDeleteConfirm({ mode: 'single', id: payment._id })}
                          title="Delete payment record"
                        >
                          <Icon name="trash" size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <footer className="toolbar" style={{ marginTop: 14 }}>
              <span style={{ color: 'var(--muted)', fontSize: '.75rem' }}>
                Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredPayments.length)}–{Math.min(currentPage * PAGE_SIZE, filteredPayments.length)} of {filteredPayments.length}
              </span>
              <div className="toolbar-group">
                <button className="btn-outline btn-sm" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
                <span style={{ color: 'var(--muted)', fontSize: '.75rem' }}>Page {currentPage} of {pageCount}</span>
                <button className="btn-outline btn-sm" disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>Next</button>
              </div>
            </footer>
          </>
        ) : (
          <EmptyState 
            icon="creditCard" 
            title={payments.length ? 'No matching payments' : 'No payments yet'} 
            sub={payments.length ? 'Try another search term or payment method.' : 'Live M-Pesa C2B PayBill payments from tenants will automatically appear here.'} 
          />
        )}
      </section>
    </div>
  );
}