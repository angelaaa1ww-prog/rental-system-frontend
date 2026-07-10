import { useState } from 'react';
import { API, authHeader, safeFetch } from '../api';
import { Field, StatusPill, EmptyState, ConfirmModal, Icon } from '../components/ui';

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
    <div className="page-stack" style={{ animation: 'fadeUp 0.3s ease' }}>
      <ConfirmModal open={!!delConfirm} title="Delete House?" message="This will permanently remove this house. This action cannot be undone." danger onConfirm={() => deleteHouse(delConfirm)} onCancel={() => setDelConfirm(null)} />

      <div className="surface">
        <div className="section-head" style={{ marginBottom: '1.25rem' }}>
          <h2>Add New House</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12 }}>
          <Field label="House Number"><input className="app-input" placeholder="e.g. A101" value={houseNumber} onChange={e => setHouseNumber(e.target.value)} /></Field>
          <Field label="Location"><input className="app-input" placeholder="e.g. Kiambu Rd" value={location} onChange={e => setLocation(e.target.value)} /></Field>
          <Field label="Apartment"><select className="app-select" value={apartment} onChange={e => setApartment(e.target.value)}>{apartments.map(a => <option key={a} value={a}>Apartment {a}</option>)}</select></Field>
          <Field label="Bedrooms"><select className="app-select" value={bedrooms} onChange={e => handleBedrooms(Number(e.target.value))}>{[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Bedroom{n > 1 ? 's' : ''}</option>)}</select></Field>
          <Field label="Rent (KES)"><input className="app-input" value={rent ? `KES ${Number(rent).toLocaleString()}` : ''} readOnly /></Field>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}><button className="btn-primary" onClick={addHouse} style={{ width: '100%', minHeight: '38px' }}><Icon name="plus" size={16} /> Add House</button></div>
        </div>
      </div>

      {apartments.map(ap => {
        const apH = houses.filter(h => h.apartment === ap);
        if (!apH.length) return null;
        return (
          <div key={ap} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: '0.5rem', marginBottom: '0.25rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Apartment {ap}</h3>
              <span className="tag tag-neutral" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>{apH.length} unit{apH.length !== 1 ? 's' : ''}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {apH.map(h => (
                <div className="house-card" key={h._id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ 
                      width: 36, 
                      height: 36, 
                      background: h.status === 'occupied' ? 'var(--danger-soft)' : 'var(--success-soft)', 
                      borderRadius: 'var(--radius)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: h.status === 'occupied' ? 'var(--danger)' : 'var(--success)',
                      border: `1px solid ${h.status === 'occupied' ? 'rgba(220, 38, 38, 0.15)' : 'rgba(22, 163, 74, 0.15)'}`
                    }}>
                      <Icon name={h.status === 'occupied' ? 'lock' : 'key'} size={16} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink)' }}>{h.houseNumber}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 2 }}>
                        {h.location} <span style={{ opacity: 0.5 }}>•</span> {h.bedrooms} Bed{h.bedrooms > 1 ? 's' : ''}
                        {h.tenant ? <span style={{ color: 'var(--blue)' }}> • {h.tenant.name}</span> : ''}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary)' }}>KES {(h.rent || 0).toLocaleString()}/mo</p>
                    <StatusPill status={h.status} />
                    {h.status === 'vacant' && (
                      <button className="btn-outline btn-danger btn-sm" style={{ padding: '0 8px', minHeight: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setDelConfirm(h._id)}>
                        <Icon name="trash" size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {!houses.length && <EmptyState icon="home" title="No houses yet" sub="Add your first house above" />}
    </div>
  );
}
