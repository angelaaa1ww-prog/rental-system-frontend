import { useState } from 'react';
import { API, authHeader, safeFetch } from '../api';
import { Field, StatusPill, EmptyState, ConfirmModal, cardStyle, cardTitleStyle } from '../components/ui';

export default function HousesPage({ houses, apartments, onRefresh, toast }) {
  const [houseNumber, setHouseNumber] = useState('');
  const [location, setLocation]       = useState('');
  const [rent, setRent]               = useState('');
  const [apartment, setApartment]     = useState('A');
  const [bedrooms, setBedrooms]       = useState(1);
  const [delConfirm, setDelConfirm]   = useState(null);

  const rentMap = { 1: 6000, 2: 15000, 3: 20000, 4: 25000 };
  const handleBedrooms = (b) => { setBedrooms(b); setRent(rentMap[b] || ''); };

  const addHouse = async () => {
    if (!houseNumber || !location || !rent) { toast('Fill all house fields', 'error'); return; }
    const res = await safeFetch(`${API}/api/houses`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ houseNumber, location, rent: Number(rent), apartment, bedrooms })
    });
    if (res?.__error) { toast(res.message, 'error'); return; }
    if (res) { toast('House added!', 'success'); setHouseNumber(''); setLocation(''); setBedrooms(1); setApartment('A'); setRent(rentMap[1]); onRefresh(); }
  };

  const deleteHouse = async (id) => {
    const res = await safeFetch(`${API}/api/houses/${id}`, { method: 'DELETE', headers: authHeader() });
    if (res?.__error) { toast(res.message, 'error'); return; }
    if (res) { toast('House deleted!', 'success'); onRefresh(); }
    setDelConfirm(null);
  };

  return (
    <div style={{ animation: 'fadeUp 0.3s ease' }}>
      <ConfirmModal open={!!delConfirm} title="Delete House?" message="This will permanently remove this house. This action cannot be undone." danger onConfirm={() => deleteHouse(delConfirm)} onCancel={() => setDelConfirm(null)} />

      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Add New House</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12 }}>
          <Field label="House Number"><input className="app-input" placeholder="e.g. A101" value={houseNumber} onChange={e => setHouseNumber(e.target.value)} /></Field>
          <Field label="Location"><input className="app-input" placeholder="e.g. Kiambu Rd" value={location} onChange={e => setLocation(e.target.value)} /></Field>
          <Field label="Apartment"><select className="app-select" value={apartment} onChange={e => setApartment(e.target.value)}>{apartments.map(a => <option key={a} value={a}>Apartment {a}</option>)}</select></Field>
          <Field label="Bedrooms"><select className="app-select" value={bedrooms} onChange={e => handleBedrooms(Number(e.target.value))}>{[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Bedroom{n > 1 ? 's' : ''}</option>)}</select></Field>
          <Field label="Rent (KES)"><input className="app-input" value={rent ? `KES ${Number(rent).toLocaleString()}` : ''} readOnly /></Field>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}><button className="btn-primary" onClick={addHouse} style={{ width: '100%', padding: '10px 0' }}>+ Add House</button></div>
        </div>
      </div>

      {apartments.map(ap => {
        const apH = houses.filter(h => h.apartment === ap);
        if (!apH.length) return null;
        return (
          <div key={ap} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, var(--accent-primary) 0%, #059669 100%)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14, boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)' }}>{ap}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', letterSpacing: '0.02em' }}>Apartment {ap}</h3>
              <span style={{ fontSize: 13, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 10px', borderRadius: 999 }}>{apH.length} unit{apH.length !== 1 ? 's' : ''}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {apH.map(h => (
                <div className="house-card" key={h._id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 44, height: 44, background: h.status === 'occupied' ? 'var(--danger-bg)' : 'var(--success-bg)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: `inset 0 0 0 1px ${h.status === 'occupied' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}` }}>
                      {h.status === 'occupied' ? '🔒' : '🔑'}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-main)', letterSpacing: '0.02em' }}>{h.houseNumber}</p>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{h.location} <span style={{ opacity: 0.5 }}>•</span> {h.bedrooms} bed{h.bedrooms > 1 ? 's' : ''}{h.tenant ? <span style={{ color: 'var(--accent-secondary)' }}> • {h.tenant.name}</span> : ''}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--accent-primary)', textShadow: '0 0 10px rgba(16,185,129,0.2)' }}>KES {(h.rent || 0).toLocaleString()}/mo</p>
                    <StatusPill status={h.status} />
                    {h.status === 'vacant' && (
                      <button className="btn-sm" style={{ background: 'var(--danger-bg)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)' }} onClick={() => setDelConfirm(h._id)}>🗑</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {!houses.length && <EmptyState icon="🏠" title="No houses yet" sub="Add your first house above" />}
    </div>
  );
}
