import { useState } from 'react';
import { API, authHeader, safeFetch } from '../api';
import { Field, EmptyState, Icon } from '../components/ui';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function ReportsPage({ toast }) {
  const now = new Date();
  const [reportMonth, setReportMonth] = useState(now.getMonth() + 1);
  const [reportYear, setReportYear]   = useState(now.getFullYear());
  const [report, setReport]           = useState(null);
  const [loading, setLoading]         = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    const res = await safeFetch(`${API}/api/reports/monthly?month=${reportMonth}&year=${reportYear}`, { headers: authHeader() });
    setLoading(false);
    if (res?.__error) { toast(res.message, 'error'); return; }
    if (res) setReport(res);
  };

  return (
    <div className="page-stack" style={{ animation: 'fadeUp 0.3s ease' }}>
      <div className="surface">
        <div className="section-head" style={{ marginBottom: '1.25rem' }}>
          <h2>Monthly Report</h2>
        </div>
        
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 24 }}>
          <Field label="Month">
            <select className="app-select" style={{ width: 140 }} value={reportMonth} onChange={e => setReportMonth(Number(e.target.value))}>
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
          </Field>
          <Field label="Year">
            <select className="app-select" style={{ width: 110 }} value={reportYear} onChange={e => setReportYear(Number(e.target.value))}>
              {[2023, 2024, 2025, 2026, 2027].map(y => <option key={y}>{y}</option>)}
            </select>
          </Field>
          <button className="btn-primary" onClick={fetchReport} disabled={loading} style={{ minHeight: '38px', padding: '0 20px' }}>
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>

        {report && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16 }}>
              {[
                { label: 'Total Income',  value: `KES ${(report.totalIncome || 0).toLocaleString()}`,  color: 'var(--primary)', bg: 'var(--primary-soft)' },
                { label: 'Transactions',  value: report.transactions || 0,                              color: 'var(--blue)', bg: 'var(--blue-soft)' },
                { label: 'Period',        value: `${MONTHS[report.month - 1]} ${report.year}`,          color: 'var(--amber)', bg: 'var(--amber-soft)' },
              ].map(c => (
                <div key={c.label} style={{ background: c.bg, borderRadius: 'var(--radius)', padding: '1.25rem', border: `1px solid ${c.color}20` }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{c.label}</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 700, color: c.color, margin: 0 }}>{c.value}</p>
                </div>
              ))}
            </div>

            {report.breakdown?.length > 0 && (
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Per-Tenant Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {report.breakdown.map((b, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--surface-soft)', borderRadius: 'var(--radius)', border: '1px solid var(--line)' }}>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--ink)' }}>{b.name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--muted)', marginLeft: 10 }}>{b.phone}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.9rem' }}>KES {(b.total || 0).toLocaleString()}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginLeft: 10 }}>{b.count} payment{b.count !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ background: 'var(--blue-soft)', borderRadius: 'var(--radius)', padding: '1rem 1.25rem', fontSize: '0.875rem', color: 'var(--blue)', border: '1px solid rgba(59, 130, 246, 0.15)', lineHeight: 1.6, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="info" size={16} />
              <span>
                In <strong>{MONTHS_FULL[report.month - 1]} {report.year}</strong>, a total of <strong>KES {(report.totalIncome || 0).toLocaleString()}</strong> was collected across <strong>{report.transactions || 0}</strong> transaction{report.transactions !== 1 ? 's' : ''}.
              </span>
            </div>
          </div>
        )}

        {!report && !loading && <EmptyState icon="fileText" title="No report yet" sub="Select a month and year then click Generate Report" />}
      </div>
    </div>
  );
}
