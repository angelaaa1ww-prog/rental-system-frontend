import React, { useState, useEffect, useCallback } from 'react';
import { API, authHeader, safeFetch } from '../api';
import Dashboard from './Dashboard';
import HousesPage from './HousesPage';
import TenantsPage from './TenantsPage';
import PaymentsPage from './PaymentsPage';
import ReportsPage from './ReportsPage';
import SmsPage from './SmsPage';
import { Icon as AppIcon } from '../components/ui';
import { BrandLogo, BrandMark } from '../components/BrandLogo';

function IconButton({ icon, label, className = '', onClick, ...props }) {
  return (
    <button className={`icon-button ${className}`} aria-label={label} title={label} onClick={onClick} {...props}>
      <AppIcon name={icon} size={18} />
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
    { id: 'properties', label: 'Properties', icon: 'home' },
    { id: 'tenants', label: 'Tenants', icon: 'users' },
    { id: 'payments', label: 'Payments', icon: 'creditCard' },
    { id: 'reports', label: 'Reports', icon: 'fileText' },
    { id: 'sms', label: 'SMS Reminders', icon: 'messageSquare' }
  ];

  const current = navItems.find((item) => item.id === activeTab) || navItems[0];

  const renderPage = () => {
    if (activeTab === 'overview') return <Dashboard onPageChange={handleNav} reminders={reminders} payments={payments} />;
    if (activeTab === 'properties') return <HousesPage houses={houses} apartments={['A', 'B', 'C', 'D']} onRefresh={loadAll} toast={toast} />;
    if (activeTab === 'tenants') return <TenantsPage tenants={tenants} houses={houses} balances={balances} onRefresh={loadAll} toast={toast} />;
    if (activeTab === 'payments') return <PaymentsPage payments={payments} />;
    if (activeTab === 'reports') return <ReportsPage toast={toast} />;
    if (activeTab === 'sms') return <SmsPage tenants={tenants} balances={balances} toast={toast} />;
    return <Dashboard onPageChange={handleNav} reminders={reminders} payments={payments} />;
  };

  return (
    <>
      <div className="app-shell">
        {compact && sidebar && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setSidebar(false)} />}
        
        {/* Sidebar */}
        <aside className={`sidebar ${sidebar ? 'open' : ''}`}>
          <div className="sidebar-brand">
            <span className="brand-mark"><AppIcon name="building" size={23} /></span>
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
                <AppIcon name={item.icon} size={18} />
                <span>{item.label}</span>
                {item.id === 'sms' && reminders.length > 0 && <em>{reminders.length}</em>}
              </button>
            ))}
          </nav>
          
          <button className="logout-button" onClick={onLogout}>
            <AppIcon name="logOut" size={18} />
            <span>Sign out</span>
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="main-area">
          <header className="topbar">
            <div className="topbar-left">
              <IconButton icon="menu" label="Toggle navigation" onClick={() => setSidebar(!sidebar)} />
              <div>
                <h1><AppIcon name={current.icon} size={20} /> {current.label}</h1>
                <p>{new Date().toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>
            
            <div className="topbar-actions">
              {reminders.length > 0 && <span className="tag tag-warning"><AppIcon name="alertTriangle" size={13} /> {reminders.length}</span>}
              <IconButton icon="refresh" label="Refresh data" onClick={loadAll} />
              <IconButton icon={dark ? 'sun' : 'moon'} label="Toggle theme" onClick={toggleTheme} />
              <Avatar name={userData?.name || 'Admin'} size="sm" />
            </div>
          </header>

          <section className="page-content">
            {loading && !dash && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <span className="loader small" style={{ display: 'inline-block', marginBottom: '1rem' }} />
                <p>Syncing your workspace...</p>
              </div>
            )}

            {error && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--danger)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <AppIcon name="alertTriangle" size={40} className="text-danger" />
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
            <AppIcon name={toastType === 'success' ? 'checkCircle' : toastType === 'error' ? 'xCircle' : 'info'} size={18} />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}
