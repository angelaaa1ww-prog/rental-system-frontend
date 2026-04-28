import { useState } from 'react';
import { API, authHeader, safeFetch } from '../api';
import { Field, EmptyState, cardStyle, cardTitleStyle } from '../components/ui';

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
    <div style={{ animation: 'fadeUp 0.3s ease' }}>
      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Monthly Report</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 20 }}>
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
          <button className="btn-primary" onClick={fetchReport} disabled={loading} style={{ padding: '10px 20px' }}>
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>

        {report && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 20 }}>
              {[
                { label: 'Total Income',  value: `KES ${(report.totalIncome || 0).toLocaleString()}`,  color: 'var(--accent-primary)', bg: 'rgba(16, 185, 129, 0.1)' },
                { label: 'Transactions',  value: report.transactions || 0,                              color: 'var(--accent-secondary)', bg: 'rgba(14, 165, 233, 0.1)' },
                { label: 'Period',        value: `${MONTHS[report.month - 1]} ${report.year}`,          color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
              ].map(c => (
                <div key={c.label} style={{ background: c.bg, borderRadius: 16, padding: 20, border: `1px solid ${c.color}20` }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: c.color, marginBottom: 8 }}>{c.label}</p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: c.color }}>{c.value}</p>
                </div>
              ))}
            </div>

            {/* Per-tenant breakdown */}
            {report.breakdown?.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12, letterSpacing: '0.02em' }}>Per-Tenant Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {report.breakdown.map((b, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid var(--border-color)' }}>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-main)' }}>{b.name}</span>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 10 }}>{b.phone}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 700, color: 'var(--accent-primary)', fontSize: 15 }}>KES {(b.total || 0).toLocaleString()}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 10 }}>{b.count} payment{b.count !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ background: 'rgba(14, 165, 233, 0.1)', borderRadius: 12, padding: '16px 20px', fontSize: 14, color: 'var(--accent-secondary)', border: '1px solid rgba(14, 165, 233, 0.2)', lineHeight: 1.6 }}>
              📊 In <strong style={{ color: 'var(--text-main)' }}>{MONTHS_FULL[report.month - 1]} {report.year}</strong>, a total of <strong style={{ color: 'var(--text-main)' }}>KES {(report.totalIncome || 0).toLocaleString()}</strong> was collected across <strong style={{ color: 'var(--text-main)' }}>{report.transactions || 0}</strong> transaction{report.transactions !== 1 ? 's' : ''}.
            </div>
          </div>
        )}

        {!report && !loading && <EmptyState icon="📋" title="No report yet" sub="Select a month and year then click Generate Report" />}
      </div>
    </div>
  );
}
