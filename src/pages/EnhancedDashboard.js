import React, { useCallback, useEffect, useRef, useState } from 'react';
import { API, authHeader, safeFetch } from '../api';
import Dashboard from './Dashboard';
import HousesPage from './HousesPage';
import TenantsPage from './TenantsPage';
import PaymentsPage from './PaymentsPage';
import ReportsPage from './ReportsPage';
import SmsPage from './SmsPage';
import { Icon as AppIcon } from '../components/ui';


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
  const getCompact = () => typeof window !== 'undefined' && window.innerWidth < 980;
  const [compact, setCompact] = useState(getCompact);

  useEffect(() => {
    const onResize = () => setCompact(getCompact());
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

  const [houses, setHouses] = useState(() => {
    try {
      const cached = sessionStorage.getItem('ghv_houses');
      return cached ? JSON.parse(cached) : [];
    } catch (_) { return []; }
  });
  const [tenants, setTenants] = useState(() => {
    try {
      const cached = sessionStorage.getItem('ghv_tenants');
      return cached ? JSON.parse(cached) : [];
    } catch (_) { return []; }
  });
  const [balances, setBalances] = useState({});
  const [payments, setPayments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [dashboardData, setDashboardData] = useState(() => {
    try {
      const cached = sessionStorage.getItem('ghv_dashboard');
      return cached ? JSON.parse(cached) : null;
    } catch (_) { return null; }
  });
  const [dashboardLoading, setDashboardLoading] = useState(!dashboardData);
  const [dashboardError, setDashboardError] = useState(null);
  const [portfolioLoading, setPortfolioLoading] = useState(!houses.length && !tenants.length);
  const [portfolioError, setPortfolioError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('info');
  const toastTimer = useRef(null);

  const toast = useCallback((message, type = 'info') => {
    window.clearTimeout(toastTimer.current);
    setToastMessage(message);
    setToastType(type);
    toastTimer.current = window.setTimeout(() => setToastMessage(null), 4000);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const loadDashboard = useCallback(async () => {
    if (!dashboardData) setDashboardLoading(true);

    try {
      const headers = authHeader();
      const [dashboardResponse, paymentResponse, reminderResponse] = await Promise.all([
        safeFetch(`${API}/api/dashboard`, { headers }),
        safeFetch(`${API}/api/payments`, { headers }),
        safeFetch(`${API}/api/sms/reminders`, { headers })
      ]);

      if (!dashboardResponse?.__error && dashboardResponse && typeof dashboardResponse === 'object') {
        setDashboardData(dashboardResponse);
        setDashboardError(null);
        try { sessionStorage.setItem('ghv_dashboard', JSON.stringify(dashboardResponse)); } catch (_) {}
      } else if (!dashboardData) {
        setDashboardError(dashboardResponse?.message || 'Connecting to backend server...');
      }


      if (!paymentResponse?.__error && Array.isArray(paymentResponse)) {
        setPayments(paymentResponse);
      }
      if (!reminderResponse?.__error && Array.isArray(reminderResponse)) {
        setReminders(reminderResponse);
      }
    } catch (error) {
      console.error('Dashboard load failed:', error);
      setDashboardError('Dashboard data could not be synced.');
    } finally {
      setDashboardLoading(false);
    }
  }, []);

  const loadPortfolio = useCallback(async () => {
    if (!houses.length && !tenants.length) setPortfolioLoading(true);

    try {
      const headers = authHeader();
      const [houseResponse, tenantResponse, balanceResponse] = await Promise.all([
        safeFetch(`${API}/api/houses`, { headers }),
        safeFetch(`${API}/api/tenants`, { headers }),
        safeFetch(`${API}/api/payments/balances`, { headers })
      ]);

      if (!houseResponse?.__error && Array.isArray(houseResponse)) {
        setHouses(houseResponse);
        try { sessionStorage.setItem('ghv_houses', JSON.stringify(houseResponse)); } catch (_) {}
      }

      if (!tenantResponse?.__error && Array.isArray(tenantResponse)) {
        setTenants(tenantResponse);
        try { sessionStorage.setItem('ghv_tenants', JSON.stringify(tenantResponse)); } catch (_) {}
      }

      if (!balanceResponse?.__error && balanceResponse && typeof balanceResponse === 'object') {
        setBalances(balanceResponse);
      }

      const hasPropertyError = houseResponse?.__error || tenantResponse?.__error;
      if (!hasPropertyError) {
        setPortfolioError(null);
      } else if (!houses.length && !tenants.length) {
        setPortfolioError('Property records are syncing from server. Please wait...');
      }
    } catch (error) {
      console.error('Portfolio load failed:', error);
      if (!houses.length && !tenants.length) {
        setPortfolioError('Property records could not be synced.');
      }
    } finally {
      setPortfolioLoading(false);
    }
  }, [houses.length, tenants.length]);

  const refreshWorkspace = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadDashboard(), loadPortfolio()]);
    setRefreshing(false);
  }, [loadDashboard, loadPortfolio]);

  const lastPaymentCountRef = useRef(0);

  useEffect(() => {
    loadDashboard();
    loadPortfolio();

    // Real-time background check for incoming C2B M-Pesa payments
    const interval = setInterval(async () => {
      try {
        const headers = authHeader();
        const newPayments = await safeFetch(`${API}/api/payments`, { headers });
        if (Array.isArray(newPayments) && !newPayments.__error) {
          setPayments(newPayments);
          if (lastPaymentCountRef.current > 0 && newPayments.length > lastPaymentCountRef.current) {
            toast('💰 New M-Pesa C2B payment received & processed!', 'success');
            loadDashboard();
            loadPortfolio();
          }
          lastPaymentCountRef.current = newPayments.length;
        }
      } catch (_) {}
    }, 12000);

    return () => clearInterval(interval);
  }, [loadDashboard, loadPortfolio, toast]);

  const toggleTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    if (newDark) document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
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
    if (activeTab === 'overview') {
      return <Dashboard onPageChange={handleNav} reminders={reminders} payments={payments} data={dashboardData} loading={dashboardLoading} error={dashboardError} onRefresh={loadDashboard} refreshing={dashboardLoading} />;
    }
    if (activeTab === 'properties') return <HousesPage houses={houses} apartments={['A', 'B', 'C', 'D', 'E']} loading={portfolioLoading} error={portfolioError} onRefresh={loadPortfolio} toast={toast} />;
    if (activeTab === 'tenants') return <TenantsPage tenants={tenants} houses={houses} balances={balances} loading={portfolioLoading} error={portfolioError} onRefresh={loadPortfolio} toast={toast} />;
    if (activeTab === 'payments') return <PaymentsPage payments={payments} onRefresh={refreshWorkspace} toast={toast} />;
    if (activeTab === 'reports') return <ReportsPage toast={toast} />;
    if (activeTab === 'sms') return <SmsPage tenants={tenants} balances={balances} toast={toast} />;
    return <Dashboard onPageChange={handleNav} reminders={reminders} payments={payments} data={dashboardData} loading={dashboardLoading} error={dashboardError} onRefresh={loadDashboard} refreshing={dashboardLoading} />;
  };

  return (
    <>
      <div className="app-shell">
        {compact && sidebar && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setSidebar(false)} />}

        <aside className={`sidebar ${sidebar ? 'open' : ''}`}>
          <div className="sidebar-brand">
            <span className="brand-mark" style={{ fontSize: '1rem', fontWeight: 900, background: 'var(--primary)', color: '#fff', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: '-0.5px', flexShrink: 0 }}>GH</span>
            <div>
              <strong>Gifted Hands</strong>
              <small>Owner workspace</small>
            </div>
          </div>

          <div className="owner-chip">
            <Avatar name={userData?.name || 'Owner'} size="sm" />
            <div>
              <span>{userData?.name || 'Owner'}</span>
              <small>{userData?.email || 'Private owner access'}</small>
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

        <main className="main-area">
          <header className="topbar">
            <div className="topbar-left">
              {compact && <IconButton icon="menu" label="Toggle navigation" onClick={() => setSidebar((open) => !open)} />}
              <div>
                <h1><AppIcon name={current.icon} size={20} /> {current.label}</h1>
                <p>{new Date().toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>

            <div className="topbar-actions">
              {reminders.length > 0 && <span className="tag tag-warning"><AppIcon name="alertTriangle" size={13} /> {reminders.length}</span>}
              <IconButton icon="refresh" label={refreshing ? 'Refreshing workspace' : 'Refresh workspace'} onClick={refreshWorkspace} disabled={refreshing} />
              <IconButton icon={dark ? 'sun' : 'moon'} label="Toggle theme" onClick={toggleTheme} />
              <Avatar name={userData?.name || 'Owner'} size="sm" />
            </div>
          </header>

          <section className="page-content">
            {renderPage()}
          </section>

          <footer className="app-footer">
            <p>Gifted Hands Ventures · Rental OS</p>
            <p>Private owner workspace</p>
          </footer>
        </main>
      </div>

      {toastMessage && (
        <div className="toast-stack" role="status" aria-live="polite">
          <div className={`toast toast-${toastType}`}>
            <AppIcon name={toastType === 'success' ? 'checkCircle' : toastType === 'error' ? 'xCircle' : 'info'} size={18} />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}