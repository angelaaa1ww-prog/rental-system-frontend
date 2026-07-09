import React, { useState, useEffect } from 'react';
import { modernTheme } from '../theme-modern';

const T = modernTheme;

export function EnhancedDashboard({ userData, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalProperties: 12,
    occupiedUnits: 8,
    pendingPayments: 3,
    monthlyRevenue: 450000,
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: T.colors.background.default,
        color: T.colors.text.primary,
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
            { label: 'Total Properties', value: stats.totalProperties, icon: '🏢', color: T.colors.primary[500] },
            { label: 'Occupied Units', value: stats.occupiedUnits, icon: '👥', color: T.colors.success[500] },
            { label: 'Pending Payments', value: stats.pendingPayments, icon: '💰', color: T.colors.warning[500] },
            { label: 'Monthly Revenue', value: `KES ${stats.monthlyRevenue.toLocaleString()}`, icon: '📊', color: T.colors.secondary[500] },
          ].map((stat, idx) => (
            <div
              key={idx}
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
            }}
          >
            {['overview', 'properties', 'tenants', 'payments'].map((tab) => (
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
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
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
              <div>
                <h2 style={{ marginBottom: '1rem' }}>Dashboard Overview</h2>
                <p style={{ color: T.colors.text.secondary }}>
                  All dashboard features are being redesigned with the new theme. Charts and detailed analytics will be available in the next update.
                </p>
              </div>
            )}

            {activeTab === 'properties' && (
              <div>
                <h2 style={{ marginBottom: '1rem' }}>Properties Management</h2>
                <p style={{ color: T.colors.text.secondary }}>
                  Manage all your rental properties, units, and facilities here.
                </p>
              </div>
            )}

            {activeTab === 'tenants' && (
              <div>
                <h2 style={{ marginBottom: '1rem' }}>Tenant Management</h2>
                <p style={{ color: T.colors.text.secondary }}>
                  View and manage all tenant information and contracts.
                </p>
              </div>
            )}

            {activeTab === 'payments' && (
              <div>
                <h2 style={{ marginBottom: '1rem' }}>Payment Tracking</h2>
                <p style={{ color: T.colors.text.secondary }}>
                  Monitor payments, invoices, and financial reports.
                </p>
              </div>
            )}
          </div>
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
              {userData?.ipAddress}
            </code>
            ) has been logged. Last login: {new Date(userData?.loginTimestamp).toLocaleString()}
          </p>
        </div>
      </main>
    </div>
  );
}
