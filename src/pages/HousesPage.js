import { useMemo, useState } from 'react';
import { API, authHeader, safeFetch } from '../api';
import { Field, StatusPill, EmptyState, ConfirmModal, Icon } from '../components/ui';

export default function HousesPage({ houses, apartments, onRefresh, toast }) {
  const [houseNumber, setHouseNumber] = useState('');
  const [location, setLocation] = useState('');
  const [rent, setRent] = useState('');
  const [apartment, setApartment] = useState('A');
  const [bedrooms, setBedrooms] = useState(1);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [delConfirm, setDelConfirm] = useState(null);

  const rentMap = { 1: 6000, 2: 15000, 3: 20000, 4: 25000 };
  const handleBedrooms = (value) => { setBedrooms(value); setRent(rentMap[value] || ''); };

  const addHouse = async () => {
    if (!houseNumber || !location || !rent) { toast('Fill all property fields', 'error'); return; }
    const result = await safeFetch(`${API}/api/houses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ houseNumber, location, rent: Number(rent), apartment, bedrooms })
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

  return (
    <div className="page-stack animate-fade-up">
      <ConfirmModal open={!!delConfirm} title="Delete house?" message="This permanently removes this vacant house. This action cannot be undone." danger onConfirm={() => deleteHouse(delConfirm)} onCancel={() => setDelConfirm(null)} />

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
          <Field label="Monthly rent" hint="Set from bedroom pricing"><input className="app-input" value={rent ? `KES ${Number(rent).toLocaleString()}` : ''} readOnly /></Field>
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
            <div className="action-row"><strong style={{ color: 'var(--ink)', fontSize: '.82rem' }}>KES {(house.rent || 0).toLocaleString()}<span style={{ color: 'var(--muted)', fontWeight: 500 }}>/mo</span></strong><StatusPill status={house.status} />{house.status === 'vacant' && <button className="btn-outline btn-danger btn-sm" type="button" aria-label={`Delete house ${house.houseNumber}`} onClick={() => setDelConfirm(house._id)}><Icon name="trash" size={14} /></button>}</div>
          </article>)}</div>
        </section>;
      })}

      {!filteredHouses.length && <EmptyState icon={houses.length ? 'info' : 'home'} title={houses.length ? 'No matching properties' : 'No houses yet'} sub={houses.length ? 'Try another search or availability filter.' : 'Add your first house using the form above.'} />}
    </div>
  );
}