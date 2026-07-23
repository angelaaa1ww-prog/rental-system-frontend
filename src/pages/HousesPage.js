import { useMemo, useState } from 'react';
import { API, authHeader, safeFetch } from '../api';
import { Field, StatusPill, EmptyState, ConfirmModal, Icon } from '../components/ui';

// ─── Inline Edit Modal ───────────────────────────────────────────────────────
function EditHouseModal({ house, onClose, onSaved, toast }) {
  const [houseNumber, setHouseNumber] = useState(house.houseNumber || '');
  const [location, setLocation] = useState(house.location || '');
  const [rent, setRent] = useState(String(house.rent || ''));
  const [bedrooms, setBedrooms] = useState(house.bedrooms || 1);
  const [apartment, setApartment] = useState(house.apartment || 'A');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!houseNumber || !location || !rent) {
      toast('Fill all required fields', 'error');
      return;
    }
    const rentNum = Number(rent);
    if (isNaN(rentNum) || rentNum <= 0) {
      toast('Enter a valid rent amount', 'error');
      return;
    }
    setSaving(true);
    const result = await safeFetch(`${API}/api/houses/${house._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ houseNumber, location, rent: rentNum, bedrooms, apartment })
    });
    setSaving(false);
    if (result?.__error) { toast(result.message, 'error'); return; }
    if (result) { toast('House updated successfully', 'success'); onSaved(); onClose(); }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(4px)', padding: '1rem'
    }}>
      <div style={{
        background: 'var(--surface)', borderRadius: 'var(--radius)',
        border: '1px solid var(--line)', padding: '1.75rem',
        maxWidth: 480, width: '100%', boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <p style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)', marginBottom: 2 }}>Edit property</p>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>House {house.houseNumber}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4 }}>
            <Icon name="x" size={20} />
          </button>
        </div>
        <form className="form-grid" onSubmit={handleSave}>
          <Field label="House number" required>
            <input className="app-input" value={houseNumber} onChange={e => setHouseNumber(e.target.value)} placeholder="e.g. A101" />
          </Field>
          <Field label="Location" required>
            <input className="app-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Kiambu Road" />
          </Field>
          <Field label="Apartment">
            <select className="app-select" value={apartment} onChange={e => setApartment(e.target.value)}>
              {['A', 'B', 'C', 'D', 'E'].map(a => <option key={a} value={a}>Apartment {a}</option>)}
            </select>
          </Field>
          <Field label="Bedrooms">
            <select className="app-select" value={bedrooms} onChange={e => setBedrooms(Number(e.target.value))}>
              {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} bedroom{n > 1 ? 's' : ''}</option>)}
            </select>
          </Field>
          <Field label="Monthly rent (KES)" hint="Enter any amount" required>
            <input
              className="app-input"
              type="number"
              min="1"
              value={rent}
              onChange={e => setRent(e.target.value)}
              placeholder="e.g. 12000"
            />
          </Field>
          <div className="form-action" style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-outline btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : <><Icon name="check" size={15} /> Save changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main HousesPage ─────────────────────────────────────────────────────────
export default function HousesPage({ houses, apartments, onRefresh, toast }) {
  const [houseNumber, setHouseNumber] = useState('');
  const [location, setLocation] = useState('');
  const [rent, setRent] = useState('');
  const [apartment, setApartment] = useState('A');
  const [bedrooms, setBedrooms] = useState(1);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [delConfirm, setDelConfirm] = useState(null);
  const [editHouse, setEditHouse] = useState(null);

  const rentMap = { 1: 6000, 2: 15000, 3: 20000, 4: 25000 };

  const handleBedrooms = (value) => {
    setBedrooms(value);
    // Only auto-fill rent if the user hasn't typed a custom value
    if (!rent || Object.values(rentMap).includes(Number(rent))) {
      setRent(rentMap[value] || '');
    }
  };

  const addHouse = async () => {
    if (!houseNumber || !location || !rent) { toast('Fill all property fields', 'error'); return; }
    const rentNum = Number(rent);
    if (isNaN(rentNum) || rentNum <= 0) { toast('Enter a valid rent amount', 'error'); return; }
    const result = await safeFetch(`${API}/api/houses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ houseNumber, location, rent: rentNum, apartment, bedrooms })
    });
    if (result?.__error) { toast(result.message, 'error'); return; }
    if (result) {
      toast('House added successfully', 'success');
      setHouseNumber('');
      setLocation('');
      setBedrooms(1);
      setApartment('A');
      setRent(rentMap[1]);
      onRefresh();
    }
  };

  const deleteHouse = async (id) => {
    const result = await safeFetch(`${API}/api/houses/${id}`, { method: 'DELETE', headers: authHeader() });
    if (result?.__error) toast(result.message, 'error');
    else if (result) { toast('House deleted successfully', 'success'); onRefresh(); }
    setDelConfirm(null);
  };

  const filteredHouses = useMemo(() => houses.filter((house) => {
    const searchable = `${house.houseNumber || ''} ${house.location || ''} ${house.apartment || ''} ${house.tenant?.name || ''}`.toLowerCase();
    return searchable.includes(query.trim().toLowerCase()) && (statusFilter === 'all' || house.status === statusFilter);
  }), [houses, query, statusFilter]);

  const occupiedCount = houses.filter((house) => house.status === 'occupied').length;
  const confirmingHouse = delConfirm ? houses.find(h => h._id === delConfirm) : null;

  return (
    <div className="page-stack animate-fade-up">
      <ConfirmModal
        open={!!delConfirm}
        title="Delete house?"
        message={
          confirmingHouse?.status === 'occupied'
            ? `House ${confirmingHouse?.houseNumber} is currently occupied. Vacate the tenant first before deleting.`
            : "This permanently removes this house. This action cannot be undone."
        }
        danger
        onConfirm={() => deleteHouse(delConfirm)}
        onCancel={() => setDelConfirm(null)}
      />

      {editHouse && (
        <EditHouseModal
          house={editHouse}
          onClose={() => setEditHouse(null)}
          onSaved={onRefresh}
          toast={toast}
        />
      )}

      <header className="page-title-bar">
        <div className="page-title-copy"><p className="eyebrow">Portfolio directory</p><h2>Properties</h2><p>Keep every unit, rental rate, and availability status organised in one place.</p></div>
        <span className="tag tag-neutral">{houses.length} total units</span>
      </header>

      <section className="surface">
        <div className="section-head"><div><p className="eyebrow">New property</p><h2>Add a house</h2></div><span className="tag tag-success">{occupiedCount} occupied</span></div>
        <form className="form-grid" onSubmit={(event) => { event.preventDefault(); addHouse(); }}>
          <Field label="House number" required><input className="app-input" placeholder="e.g. A101" value={houseNumber} onChange={(event) => setHouseNumber(event.target.value)} /></Field>
          <Field label="Location" required><input className="app-input" placeholder="e.g. Kiambu Road" value={location} onChange={(event) => setLocation(event.target.value)} /></Field>
          <Field label="Apartment"><select className="app-select" value={apartment} onChange={(event) => setApartment(event.target.value)}>{apartments.map((item) => <option key={item} value={item}>Apartment {item}</option>)}</select></Field>
          <Field label="Bedrooms"><select className="app-select" value={bedrooms} onChange={(event) => handleBedrooms(Number(event.target.value))}>{[1, 2, 3, 4].map((count) => <option key={count} value={count}>{count} bedroom{count > 1 ? 's' : ''}</option>)}</select></Field>
          <Field label="Monthly rent (KES)" hint="Auto-filled · edit freely">
            <input
              className="app-input"
              type="number"
              min="1"
              placeholder="Enter rent amount"
              value={rent}
              onChange={(event) => setRent(event.target.value)}
            />
          </Field>
          <div className="form-action"><button type="submit" className="btn-primary"><Icon name="plus" size={16} /> Add house</button></div>
        </form>
      </section>

      <section className="toolbar" aria-label="Property filters">
        <div className="search-field"><Icon name="search" size={16} /><input className="app-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search house, location, or tenant" aria-label="Search properties" /></div>
        <div className="toolbar-group"><Icon name="filter" size={16} /><select className="app-select filter-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter properties by availability"><option value="all">All availability</option><option value="occupied">Occupied</option><option value="vacant">Vacant</option></select></div>
      </section>

      {apartments.map((apartmentName) => {
        const group = filteredHouses.filter((house) => house.apartment === apartmentName);
        if (!group.length) return null;
        return <section className="property-group" key={apartmentName}>
          <div className="property-group-title"><h3>Apartment {apartmentName}</h3><span className="tag tag-neutral">{group.length} unit{group.length === 1 ? '' : 's'}</span></div>
          <div className="property-grid">{group.map((house) => <article className="house-card" key={house._id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, display: 'grid', placeItems: 'center', borderRadius: 9, color: house.status === 'occupied' ? 'var(--amber)' : 'var(--success)', background: house.status === 'occupied' ? 'var(--amber-soft)' : 'var(--success-soft)' }}><Icon name={house.status === 'occupied' ? 'lock' : 'key'} size={17} /></div>
              <div><strong style={{ display: 'block', fontSize: '.9rem' }}>{house.houseNumber}</strong><span style={{ color: 'var(--muted)', fontSize: '.75rem' }}>{house.location} · {house.bedrooms} bed{house.bedrooms > 1 ? 's' : ''}</span>{house.tenant && <span style={{ display: 'block', color: 'var(--primary)', fontSize: '.72rem', marginTop: 2 }}>{house.tenant.name}</span>}</div>
            </div>
            <div className="action-row">
              <strong style={{ color: 'var(--ink)', fontSize: '.82rem' }}>KES {(house.rent || 0).toLocaleString()}<span style={{ color: 'var(--muted)', fontWeight: 500 }}>/mo</span></strong>
              <StatusPill status={house.status} />
              {/* Edit button — always visible */}
              <button
                className="btn-outline btn-sm"
                type="button"
                aria-label={`Edit house ${house.houseNumber}`}
                onClick={() => setEditHouse(house)}
                title="Edit house details"
              >
                <Icon name="edit" size={14} />
              </button>
              {/* Delete button — always visible, with warning for occupied */}
              <button
                className="btn-outline btn-danger btn-sm"
                type="button"
                aria-label={`Delete house ${house.houseNumber}`}
                onClick={() => setDelConfirm(house._id)}
                title={house.status === 'occupied' ? 'Vacate tenant first to delete' : 'Delete house'}
              >
                <Icon name="trash" size={14} />
              </button>
            </div>
          </article>)}</div>
        </section>;
      })}

      {!filteredHouses.length && <EmptyState icon={houses.length ? 'info' : 'home'} title={houses.length ? 'No matching properties' : 'No houses yet'} sub={houses.length ? 'Try another search or availability filter.' : 'Add your first house using the form above.'} />}
    </div>
  );
}