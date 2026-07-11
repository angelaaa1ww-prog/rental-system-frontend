import { useState } from 'react';
import { API, authHeader, safeFetch } from '../api';
import { Field, EmptyState, Icon } from '../components/ui';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function ReportsPage({ toast }) {
  const now = new Date();
  const [reportMonth, setReportMonth] = useState(now.getMonth() + 1);
  const [reportYear, setReportYear] = useState(now.getFullYear());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    const result = await safeFetch(`${API}/api/reports/monthly?month=${reportMonth}&year=${reportYear}`, { headers: authHeader() });
    setLoading(false);
    if (result?.__error) { toast(result.message, 'error'); return; }
    if (result) setReport(result);
  };

  return (
    <div className="page-stack animate-fade-up">
      <header className="page-title-bar"><div className="page-title-copy"><p className="eyebrow">Financial insight</p><h2>Reports</h2><p>Generate a concise monthly picture of rental collections and tenant payment activity.</p></div></header>

      <section className="surface">
        <div className="section-head"><div><p className="eyebrow">Report builder</p><h2>Monthly income report</h2></div></div>
        <div className="report-controls"><Field label="Month"><select className="app-select" value={reportMonth} onChange={(event) => setReportMonth(Number(event.target.value))}>{MONTHS.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}</select></Field><Field label="Year"><select className="app-select" value={reportYear} onChange={(event) => setReportYear(Number(event.target.value))}>{[2023, 2024, 2025, 2026, 2027].map((year) => <option key={year} value={year}>{year}</option>)}</select></Field><button className="btn-primary" onClick={fetchReport} disabled={loading}><Icon name="fileText" size={16} /> {loading ? 'Generating report' : 'Generate report'}</button></div>
      </section>

      {report && <section className="surface">
        <div className="section-head"><div><p className="eyebrow">{MONTHS_FULL[report.month - 1]} {report.year}</p><h2>Income summary</h2></div><span className="tag tag-success">Generated</span></div>
        <div className="payment-summary-grid" style={{ marginBottom: 22 }}><article className="summary-stat"><p>Total income</p><strong style={{ color: 'var(--primary)' }}>KES {(report.totalIncome || 0).toLocaleString()}</strong></article><article className="summary-stat"><p>Transactions</p><strong>{report.transactions || 0}</strong></article><article className="summary-stat"><p>Average payment</p><strong style={{ color: 'var(--success)' }}>KES {report.transactions ? Math.round((report.totalIncome || 0) / report.transactions).toLocaleString() : '0'}</strong></article></div>
        {report.breakdown?.length ? <div className="table-wrap"><table className="data-table"><caption className="sr-only">Per-tenant monthly payment breakdown</caption><thead><tr>{['Tenant', 'Phone', 'Payments', 'Collected'].map((heading) => <th scope="col" key={heading}>{heading}</th>)}</tr></thead><tbody>{report.breakdown.map((entry, index) => <tr key={`${entry.name}-${index}`}><td><strong>{entry.name}</strong></td><td>{entry.phone || '—'}</td><td><span className="tag tag-neutral">{entry.count} payment{entry.count === 1 ? '' : 's'}</span></td><td><strong style={{ color: 'var(--success)' }}>KES {(entry.total || 0).toLocaleString()}</strong></td></tr>)}</tbody></table></div> : <EmptyState icon="fileText" title="No payments in this period" sub="There are no payment records to include for the selected month." />}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 18, padding: 14, borderRadius: 9, background: 'var(--blue-soft)', color: 'var(--blue)', fontSize: '.8rem', lineHeight: 1.5 }}><Icon name="info" size={16} /><span>In <strong>{MONTHS_FULL[report.month - 1]} {report.year}</strong>, the portfolio collected <strong>KES {(report.totalIncome || 0).toLocaleString()}</strong> through <strong>{report.transactions || 0}</strong> transaction{report.transactions === 1 ? '' : 's'}.</span></div>
      </section>}

      {!report && !loading && <EmptyState icon="fileText" title="Your report will appear here" sub="Choose a month and year, then generate a report to review income by tenant." />}
    </div>
  );
}