import React, { useState, useEffect, useCallback } from 'react';
import { API, authHeader, safeFetch } from '../api';
import Dashboard from './Dashboard';
import HousesPage from './HousesPage';
import TenantsPage from './TenantsPage';
import PaymentsPage from './PaymentsPage';
import ReportsPage from './ReportsPage';
import SmsPage from './SmsPage';

const ICONS = {
  alertTriangle: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  barChart: '<path d="M3 3v18h18"/><path d="M7 16V9"/><path d="M12 16V5"/><path d="M17 16v-4"/>',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  building: '<path d="M4 22V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v18"/><path d="M9 22v-6h6v6"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01"/>',
  checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m22 4-10 10.01-3-3"/>',
  creditCard: '<rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/>',
  fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/>',
  home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  logOut: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  messageSquare: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>',
  refresh: '<path d="M21 2v6h-6"/><path d="M21 12a9 9 0 1 1-2.64-6.36L21 8"/>',
  sun: '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  xCircle: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>'
};

function Icon({ name, size = 18, label, className = '' }) {
  const body = ICONS[name];
  if (!body) return null;
  return (
    <svg
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}

function IconButton({ icon, label, className = '', onClick, ...props }) {
  return (
    <button className={`icon-button ${className}`} aria-label={label} title={label} onClick={onClick} {...props}>
      <Icon name={icon} size={18} />
    </button>
  );
}

function Avatar({ name, size = 'md' }) {
  const initials = String(name || '?')
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return <span className={`avatar avatar-${size}`}>{initials || '?'}</span>;
}

function useViewport() {
  const [compact, setCompact] = useState(() => window.innerWidth < 980);
  useEffect(() => {
    const onResize = () => setCompact(window.innerWidth < 980);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return compact;
}

export function EnhancedDashboard({ userData, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebar, setSidebar] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark');
  const compact = useViewport();

  const [houses, setHouses] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [balances, setBalances] = useState({});
  const [payments, setPayments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [dash, setDash] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('info'); // 'info', 'success', 'error'

  const toast = useCallback((msg, type = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  }, []);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = authHeader();
      const [houseData, tenantData, dashData, paymentData, reminderData] = await Promise.all([
        safeFetch(`${API}/api/houses`, { headers }),
        safeFetch(`${API}/api/tenants`, { headers }),
        safeFetch(`${API}/api/dashboard`, { headers }),
        safeFetch(`${API}/api/payments`, { headers }),
        safeFetch(`${API}/api/sms/reminders`, { headers })
      ]);

      if (houseData?.__error || tenantData?.__error || dashData?.__error) {
        setError('Error loading data from server.');
        setLoading(false);
        return;
      }

      const safeHouses = Array.isArray(houseData) ? houseData : [];
      const safeTenants = Array.isArray(tenantData) ? tenantData : [];
      setHouses(safeHouses);
      setTenants(safeTenants);
      setDash(dashData && typeof dashData === 'object' ? dashData : null);
      setPayments(Array.isArray(paymentData) ? paymentData : []);
      setReminders(Array.isArray(reminderData) ? reminderData : []);

      // Fetch balances for each tenant
      const balancePairs = await Promise.all(
        safeTenants.map(async (tenant) => {
          const balance = await safeFetch(`${API}/api/tenants/${tenant._id}/balance`, { headers });
          return [tenant._id, balance || { rent: 0, paid: 0, balance: 0 }];
        })
      );
      setBalances(Object.fromEntries(balancePairs));
    } catch (err) {
      console.error(err);
      setError('Cannot connect to server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const toggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    if (newDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const handleNav = (tabId) => {
    setActiveTab(tabId);
    if (compact) setSidebar(false);
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: 'barChart' },
    { id: 'properties', label: 'Houses', icon: 'home' },
    { id: 'tenants', label: 'Tenants', icon: 'users' },
    { id: 'payments', label: 'Payments', icon: 'creditCard' },
    { id: 'reports', label: 'Reports', icon: 'fileText' },
    { id: 'sms', label: 'SMS Reminders', icon: 'messageSquare' }
  ];

  const current = navItems.find((item) => item.id === activeTab) || navItems[0];

  const renderPage = () => {
    if (activeTab === 'overview') return <Dashboard onPageChange={handleNav} reminders={reminders} />;
    if (activeTab === 'properties') return <HousesPage houses={houses} apartments={['A', 'B', 'C', 'D']} onRefresh={loadAll} toast={toast} />;
    if (activeTab === 'tenants') return <TenantsPage tenants={tenants} houses={houses} balances={balances} onRefresh={loadAll} toast={toast} />;
    if (activeTab === 'payments') return <PaymentsPage payments={payments} />;
    if (activeTab === 'reports') return <ReportsPage toast={toast} />;
    if (activeTab === 'sms') return <SmsPage tenants={tenants} balances={balances} toast={toast} />;
    return <Dashboard onPageChange={handleNav} />;
  };

  return (
    <>
      <div className="app-shell">
        {compact && sidebar && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setSidebar(false)} />}
        
        {/* Sidebar */}
        <aside className={`sidebar ${sidebar ? 'open' : ''}`}>
          <div className="sidebar-brand">
            <span className="brand-mark"><Icon name="building" size={23} /></span>
            <div>
              <strong>Gifted Hands</strong>
              <small>Rental OS</small>
            </div>
          </div>
          
          <div className="owner-chip">
            <Avatar name={userData?.name || 'Admin'} size="sm" />
            <div>
              <span>{userData?.name || 'Owner'}</span>
              <small>{userData?.email || 'admin@rentals.co.ke'}</small>
            </div>
          </div>
          
          <nav className="nav-list" aria-label="Main navigation">
            {navItems.map((item) => (
              <button key={item.id} className={activeTab === item.id ? 'active' : ''} onClick={() => handleNav(item.id)}>
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
                {item.id === 'sms' && reminders.length > 0 && <em>{reminders.length}</em>}
              </button>
            ))}
          </nav>
          
          <button className="logout-button" onClick={onLogout}>
            <Icon name="logOut" size={18} />
            <span>Sign out</span>
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="main-area">
          <header className="topbar">
            <div className="topbar-left">
              <IconButton icon="menu" label="Toggle navigation" onClick={() => setSidebar(!sidebar)} />
              <div>
                <h1><Icon name={current.icon} size={20} /> {current.label}</h1>
                <p>{new Date().toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>
            
            <div className="topbar-actions">
              {reminders.length > 0 && <span className="tag tag-warning"><Icon name="alertTriangle" size={13} /> {reminders.length}</span>}
              <IconButton icon="refresh" label="Refresh data" onClick={loadAll} />
              <IconButton icon={dark ? 'sun' : 'moon'} label="Toggle theme" onClick={toggleTheme} />
              <Avatar name={userData?.name || 'Admin'} size="sm" />
            </div>
          </header>

          <section className="page-content">
            {loading && !dash && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <span className="loader small" style={{ display: 'inline-block', marginBottom: '1rem' }} />
                <p>Syncing Command Center...</p>
              </div>
            )}

            {error && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--danger)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Icon name="alertTriangle" size={40} className="text-danger" />
                </div>
                <p style={{ fontWeight: 600 }}>{error}</p>
                <button className="btn-primary" onClick={loadAll} style={{ marginTop: '1rem' }}>Retry Sync</button>
              </div>
            )}

            {!loading && !error && renderPage()}
          </section>

          {/* Footer Info */}
          <footer
            style={{
              padding: '1.5rem 2rem',
              borderTop: '1px solid var(--border-color)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <p style={{ margin: 0 }}>
              GHV OS v3.1 • Session IP: <code>{userData?.ipAddress || 'unknown'}</code>
            </p>
            <p style={{ margin: 0 }}>
              Last login: {userData?.loginTimestamp ? new Date(userData.loginTimestamp).toLocaleString('en-KE') : new Date().toLocaleString('en-KE')}
            </p>
          </footer>
        </main>
      </div>

      {/* Toast Alert overlay */}
      {toastMessage && (
        <div className="toast-stack" role="status" aria-live="polite" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
          <div className={`toast toast-${toastType}`}>
            <Icon name={toastType === 'success' ? 'checkCircle' : toastType === 'error' ? 'xCircle' : 'info'} size={18} />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}
