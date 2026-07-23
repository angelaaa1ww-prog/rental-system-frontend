import { useEffect, useMemo, useState } from 'react';
import { API, safeFetch } from '../api';
import { Avatar, EmptyState, Icon } from '../components/ui';

const PAGE_SIZE = 8;
const currency = (value) => `KES ${(Number(value) || 0).toLocaleString()}`;

export default function PaymentsPage({ payments }) {
  const [query, setQuery] = useState('');
  const [method, setMethod] = useState('all');
  const [selected, setSelected] = useState(() => new Set());
  const [page, setPage] = useState(1);
  const [c2bConfig, setC2bConfig] = useState(null);

  // Simulation modal state
  const [showSimModal, setShowSimModal] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simHouse, setSimHouse] = useState('');
  const [simAmount, setSimAmount] = useState('1000');
  const [simResult, setSimResult] = useState(null);

  useEffect(() => {
    safeFetch(`${API}/api/c2b/config`).then((res) => {
      if (res && !res.__error) setC2bConfig(res);
    });
  }, []);

  const handleSimulate = async (e) => {
    e.preventDefault();
    setSimulating(true);
    setSimResult(null);
    try {
      const ref = simHouse.trim() ? `1183070#${simHouse.trim()}` : '';
      const url = `${API}/api/c2b/simulate?amount=${simAmount}&billRefNumber=${encodeURIComponent(ref)}`;
      const res = await safeFetch(url);
      if (res && !res.__error && res.response?.ResponseCode === "0") {
        setSimResult({ type: 'success', msg: `✅ M-Pesa Payment of KES ${Number(simAmount).toLocaleString()} simulated! Check ledger below.` });
      } else {
        setSimResult({ type: 'error', msg: res?.message || res?.error || 'Simulation request completed with notice' });
      }
    } catch (err) {
      setSimResult({ type: 'error', msg: err.message });
    } finally {
      setSimulating(false);
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

  return (
    <div className="page-stack animate-fade-up">
      <header className="page-title-bar">
        <div className="page-title-copy">
          <p className="eyebrow">Transaction ledger</p>
          <h2>Payments</h2>
          <p>Review automated M-Pesa C2B PayBill payments and manual entries with real-time tracking.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn-outline btn-sm" onClick={() => setShowSimModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="play" size={14} /> Simulate M-Pesa Payment
          </button>
          <span className="tag tag-success">{payments.length} records</span>
        </div>
      </header>

      {/* C2B PayBill Status Banner */}
      <section className="surface" style={{ background: 'var(--surface-soft)', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--primary-soft)', color: 'var(--primary)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Icon name="creditCard" size={22} />
            </div>
            <div>
              <strong style={{ fontSize: '.92rem', display: 'block', color: 'var(--ink)' }}>
                M-Pesa C2B PayBill Active · Business No. {c2bConfig?.payBillNumber || '400222'}
              </strong>
              <span style={{ fontSize: '.76rem', color: 'var(--muted)' }}>
                Account Format: <strong>{c2bConfig?.accountReferenceFormat || '1183070#<HouseNumber> (e.g. 1183070#A101)'}</strong> · Hash System Protected
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn-primary btn-sm" onClick={() => setShowSimModal(true)}>
              🧪 Test PayBill Simulation
            </button>
            <span className="tag tag-success"><Icon name="checkCircle" size={12} /> Auto-Reflect Active</span>
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
        <div className="section-head"><div><p className="eyebrow">Payment records</p><h2>All transactions</h2></div>{selected.size > 0 && <span className="tag tag-blue">{selected.size} selected</span>}</div>
        <div className="toolbar" style={{ marginBottom: 16 }}><div className="search-field"><Icon name="search" size={16} /><input className="app-input" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search tenant, phone, or reference" aria-label="Search payments" /></div><div className="toolbar-group"><Icon name="filter" size={16} /><select className="app-select filter-select" value={method} onChange={(event) => { setMethod(event.target.value); setPage(1); }} aria-label="Filter payments by method"><option value="all">All methods</option><option value="mpesa">M-Pesa</option><option value="cash">Cash</option></select></div></div>

        {filteredPayments.length ? <><div className="table-wrap"><table className="data-table"><caption className="sr-only">Payment transaction records</caption><thead><tr><th scope="col"><input type="checkbox" checked={allVisibleSelected} onChange={toggleVisible} aria-label="Select visible payments" /></th>{['Tenant', 'House', 'Phone', 'Amount', 'Method', 'Reference', 'Date'].map((heading) => <th scope="col" key={heading}>{heading}</th>)}</tr></thead><tbody>{visiblePayments.map((payment) => <tr key={payment._id}><td><input type="checkbox" checked={selected.has(payment._id)} onChange={() => togglePayment(payment._id)} aria-label={`Select payment from ${payment.tenant?.name || 'unknown tenant'}`} /></td><td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={payment.tenant?.name} size="sm" /><strong>{payment.tenant?.name || 'Unknown tenant'}</strong></div></td><td><span className="tag tag-blue" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{payment.tenant?.house?.houseNumber ? `House ${payment.tenant.house.houseNumber}` : (payment.billRefNumber ? `Ref: ${payment.billRefNumber}` : '—')}</span></td><td>{payment.tenant?.phone || '—'}</td><td><strong style={{ color: 'var(--success)' }}>{currency(payment.amount)}</strong></td><td><span className={`tag ${(payment.paymentMethod || 'cash').toLowerCase() === 'mpesa' ? 'tag-success' : 'tag-neutral'}`}>{payment.paymentMethod || 'cash'}</span></td><td><code style={{ color: 'var(--muted)', fontSize: '.72rem', fontFamily: 'var(--font-mono)' }}>{payment.reference || '—'}</code></td><td>{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td></tr>)}</tbody></table></div><footer className="toolbar" style={{ marginTop: 14 }}><span style={{ color: 'var(--muted)', fontSize: '.75rem' }}>Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredPayments.length)}–{Math.min(currentPage * PAGE_SIZE, filteredPayments.length)} of {filteredPayments.length}</span><div className="toolbar-group"><button className="btn-outline btn-sm" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button><span style={{ color: 'var(--muted)', fontSize: '.75rem' }}>Page {currentPage} of {pageCount}</span><button className="btn-outline btn-sm" disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>Next</button></div></footer></> : <EmptyState icon="creditCard" title={payments.length ? 'No matching payments' : 'No payments yet'} sub={payments.length ? 'Try another search term or payment method.' : 'Payments you record will appear here.'} />}
      </section>

      {/* Built-in M-Pesa C2B Simulation Modal */}
      {showSimModal && (
        <div className="modal-backdrop" onClick={() => setShowSimModal(false)}>
          <div className="modal-content animate-fade-up" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <header className="modal-header">
              <h3>🧪 Simulate M-Pesa C2B Payment</h3>
              <button className="icon-button" onClick={() => setShowSimModal(false)}><Icon name="x" size={18} /></button>
            </header>
            <form onSubmit={handleSimulate} style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '16px 0' }}>
              <p style={{ fontSize: '.84rem', color: 'var(--muted)', margin: 0 }}>
                Triggers a simulated Safaricom C2B PayBill transaction. The system matches the house number and links the payment automatically.
              </p>
              
              {simResult && (
                <div style={{ padding: '10px 14px', borderRadius: 8, fontSize: '.84rem', background: simResult.type === 'success' ? 'var(--success-soft)' : 'var(--danger-soft)', color: simResult.type === 'success' ? 'var(--success)' : 'var(--danger)' }}>
                  {simResult.msg}
                </div>
              )}

              <div>
                <label style={{ fontSize: '.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>House Number (Optional)</label>
                <input className="app-input" value={simHouse} onChange={(e) => setSimHouse(e.target.value)} placeholder="e.g. A101 (Leave empty for auto-match)" />
              </div>

              <div>
                <label style={{ fontSize: '.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Amount (KES)</label>
                <input className="app-input" type="number" value={simAmount} onChange={(e) => setSimAmount(e.target.value)} required min="1" />
              </div>

              <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" className="btn-outline" onClick={() => setShowSimModal(false)}>Close</button>
                <button type="submit" className="btn-primary" disabled={simulating}>
                  {simulating ? 'Processing...' : '⚡ Send Test Payment'}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}