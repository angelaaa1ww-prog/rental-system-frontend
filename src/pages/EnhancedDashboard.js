import React, { useState, useEffect } from 'react';
import { modernTheme } from '../theme-modern';
import { API, authHeader, safeFetch } from '../api';
import Dashboard from './Dashboard';
import HousesPage from './HousesPage';
import TenantsPage from './TenantsPage';
import PaymentsPage from './PaymentsPage';
import ReportsPage from './ReportsPage';
import SmsPage from './SmsPage';

const T = modernTheme;

export function EnhancedDashboard({ userData, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
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

  const toast = (msg, type = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

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

  const displayStats = {
    totalProperties: dash?.totalHouses || houses.length || 0,
    occupiedUnits: dash?.occupied || 0,
    pendingPayments: dash?.overdueCount || 0,
    monthlyRevenue: dash?.monthlyIncome || 0,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: T.colors.background.default,
        color: T.colors.text.primary,
        fontFamily: T.typography.fontFamily,
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '1.5rem 2rem',
          borderBottom: `1px solid ${T.colors.dark.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: T.colors.dark.surface,
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>GIFTED HANDS VENTURES</h1>
          <p style={{ fontSize: '0.875rem', color: T.colors.text.secondary, margin: '0.25rem 0 0' }}>
            Welcome back, {userData?.name}
          </p>
        </div>

        <button
          onClick={onLogout}
          style={{
            padding: '0.75rem 1.5rem',
            background: T.colors.error[600],
            color: 'white',
            border: 'none',
            borderRadius: T.borderRadius.lg,
            fontWeight: 600,
            cursor: 'pointer',
            transition: T.transitions.normal,
          }}
          onMouseEnter={(e) => {
            e.target.style.background = T.colors.error[500];
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = T.shadows.lg;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = T.colors.error[600];
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Sign Out
        </button>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem' }}>
        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          {[
            { label: 'Total Properties', value: displayStats.totalProperties, icon: '🏢', color: T.colors.primary[500], tab: 'properties' },
            { label: 'Occupied Units', value: displayStats.occupiedUnits, icon: '👥', color: T.colors.success[500], tab: 'tenants' },
            { label: 'Pending Payments', value: displayStats.pendingPayments, icon: '💰', color: T.colors.warning[500], tab: 'payments' },
            { label: 'Monthly Revenue', value: `KES ${displayStats.monthlyRevenue.toLocaleString()}`, icon: '📊', color: T.colors.secondary[500], tab: 'payments' },
          ].map((stat, idx) => (
            <div
              key={idx}
              onClick={() => stat.tab && setActiveTab(stat.tab)}
              style={{
                background: T.colors.dark.surface,
                border: `1px solid ${T.colors.dark.border}`,
                borderRadius: T.borderRadius.xl,
                padding: '1.5rem',
                transition: T.transitions.normal,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = stat.color;
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 0 30px ${stat.color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = T.colors.dark.border;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Gradient background */}
              <div
                style={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: '150px',
                  height: '150px',
                  background: `radial-gradient(circle, ${stat.color}20, transparent)`,
                  borderRadius: '50%',
                }}
              />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                <p style={{ color: T.colors.text.secondary, fontSize: '0.875rem', margin: 0 }}>
                  {stat.label}
                </p>
                <p style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.5rem 0 0' }}>
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs Section */}
        <div style={{ marginTop: '3rem' }}>
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              borderBottom: `1px solid ${T.colors.dark.border}`,
              marginBottom: '2rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
            }}
          >
            {['overview', 'properties', 'tenants', 'payments', 'reports', 'sms'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: activeTab === tab ? T.colors.primary[400] : T.colors.text.secondary,
                  borderBottom: activeTab === tab ? `2px solid ${T.colors.primary[400]}` : 'none',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab ? 600 : 500,
                  fontSize: '0.95rem',
                  transition: T.transitions.fast,
                  textTransform: 'capitalize',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab === 'sms' ? 'SMS reminders' : tab}
              </button>
            ))}
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: T.colors.text.secondary }}>
              <span style={{ fontSize: '2rem', display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
              <p style={{ marginTop: '1rem' }}>Loading system data...</p>
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: '3rem', color: T.colors.error[500] }}>
              <span style={{ fontSize: '2rem' }}>⚠️</span>
              <p style={{ marginTop: '1rem', fontWeight: 600 }}>{error}</p>
              <button className="btn-primary" onClick={loadAll} style={{ marginTop: '1rem' }}>Retry</button>
            </div>
          )}

          {/* Tab Content */}
          {!loading && !error && (
            <div
              style={{
                background: T.colors.dark.surface,
                border: `1px solid ${T.colors.dark.border}`,
                borderRadius: T.borderRadius.xl,
                padding: '2rem',
                minHeight: '400px',
              }}
            >
              {activeTab === 'overview' && (
                <Dashboard onPageChange={setActiveTab} />
              )}

              {activeTab === 'properties' && (
                <HousesPage
                  houses={houses}
                  apartments={['A', 'B', 'C', 'D']}
                  onRefresh={loadAll}
                  toast={toast}
                />
              )}

              {activeTab === 'tenants' && (
                <TenantsPage
                  tenants={tenants}
                  houses={houses}
                  balances={balances}
                  onRefresh={loadAll}
                  toast={toast}
                />
              )}

              {activeTab === 'payments' && (
                <PaymentsPage payments={payments} />
              )}

              {activeTab === 'reports' && (
                <ReportsPage toast={toast} />
              )}

              {activeTab === 'sms' && (
                <SmsPage
                  tenants={tenants}
                  balances={balances}
                  toast={toast}
                />
              )}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div
          style={{
            marginTop: '3rem',
            padding: '1.5rem',
            background: T.colors.dark.surface,
            border: `1px solid ${T.colors.dark.border}`,
            borderRadius: T.borderRadius.lg,
            fontSize: '0.875rem',
            color: T.colors.text.secondary,
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>Security Info:</strong> Your IP address (
            <code style={{ background: T.colors.dark.bg, padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
              {userData?.ipAddress || 'unknown'}
            </code>
            ) has been logged. Last login: {userData?.loginTimestamp ? new Date(userData.loginTimestamp).toLocaleString() : new Date().toLocaleString()}
          </p>
        </div>
      </main>

      {/* Toast Alert overlay */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            padding: '1rem 1.5rem',
            background: toastType === 'success' ? T.colors.success[600] : toastType === 'error' ? T.colors.error[600] : T.colors.primary[600],
            color: 'white',
            borderRadius: T.borderRadius.lg,
            boxShadow: T.shadows.xl,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 600,
          }}
        >
          <span>{toastType === 'success' ? '✅' : toastType === 'error' ? '❌' : 'ℹ️'}</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
