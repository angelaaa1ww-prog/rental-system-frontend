import React, { useState, useEffect } from 'react';
import { ParticleBackground } from '../components/ParticleEffects';
import { GoogleAuthComponent, IPVerificationModal } from '../components/GoogleAuth';
import { TermsAndPrivacyModal } from '../components/TermsModal';
import { modernTheme } from '../theme-modern';

const T = modernTheme;

export function LoginPage({ onLoginSuccess }) {
  const [showTerms, setShowTerms] = useState(true);
  const [showIPVerification, setShowIPVerification] = useState(false);
  const [currentIP, setCurrentIP] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const termsVersion = localStorage.getItem('termsAcceptedVersion');
    if (termsVersion === '2026-07-07') {
      setTermsAccepted(true);
      setShowTerms(false);
    }
  }, []);

  const handleTermsAccept = () => {
    localStorage.setItem('termsAcceptedVersion', '2026-07-07');
    setTermsAccepted(true);
    setShowTerms(false);
  };

  const handleGoogleSuccess = (authData) => {
    if (authData.isNewIP) {
      setCurrentIP(authData.ipAddress);
      setShowIPVerification(true);
    } else {
      onLoginSuccess(authData);
    }
  };

  const handleIPVerify = (code) => {
    setShowIPVerification(false);
    const userData = JSON.parse(localStorage.getItem('userData'));
    onLoginSuccess(userData);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: T.colors.background.default,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <ParticleBackground />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '520px', padding: '2rem' }}>
        {/* HEADER - Logo and Branding */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          {/* Animated Logo Box */}
          <div
            style={{
              width: '90px',
              height: '90px',
              margin: '0 auto 1.75rem',
              background: T.colors.gradients.primaryGradient,
              borderRadius: T.borderRadius['3xl'],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: T.shadows.neon,
              animation: 'float-logo 3s ease-in-out infinite',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Inner glow */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: T.borderRadius['3xl'],
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            <span style={{ fontSize: '3rem', position: 'relative', zIndex: 2 }}>🏢</span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: T.typography.fontSize['4xl'],
              fontWeight: T.typography.fontWeight.extrabold,
              background: T.colors.gradients.primaryGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.75rem',
              fontFamily: T.typography.fontFamilySecondary,
              letterSpacing: '-0.5px',
            }}
          >
            GIFTED HANDS
          </h1>

          {/* Subtitle */}
          <p
            style={{
              color: T.colors.text.secondary,
              fontSize: '1.05rem',
              fontWeight: 500,
              letterSpacing: '0.3px',
            }}
          >
            VENTURES
          </p>
        </div>

        {/* MAIN CARD */}
        <div
          style={{
            background: T.colors.dark.surface,
            border: `1px solid ${T.colors.dark.border}`,
            borderRadius: T.borderRadius['2xl'],
            padding: '3rem 2.5rem',
            boxShadow: T.shadows.xl,
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Animated background glow - Top Right */}
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '400px',
              height: '400px',
              background: T.colors.gradients.primaryGradient,
              borderRadius: '50%',
              opacity: 0.08,
              filter: 'blur(80px)',
              pointerEvents: 'none',
              animation: 'float-glow 6s ease-in-out infinite',
            }}
          />

          {/* Animated background glow - Bottom Left */}
          <div
            style={{
              position: 'absolute',
              bottom: '-150px',
              left: '-150px',
              width: '350px',
              height: '350px',
              background: 'rgba(88, 129, 255, 0.1)',
              borderRadius: '50%',
              opacity: 0.05,
              filter: 'blur(80px)',
              pointerEvents: 'none',
              animation: 'float-glow-reverse 8s ease-in-out infinite',
            }}
          />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            {termsAccepted ? (
              <>
                {/* Welcome Text */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <h2
                    style={{
                      fontSize: T.typography.fontSize['2xl'],
                      fontWeight: T.typography.fontWeight.bold,
                      marginBottom: '0.75rem',
                      color: T.colors.text.primary,
                      letterSpacing: '-0.3px',
                    }}
                  >
                    Welcome Back
                  </h2>

                  <p
                    style={{
                      color: T.colors.text.secondary,
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      margin: 0,
                    }}
                  >
                    Sign in with your Google account to access your rental management dashboard.
                  </p>
                </div>

                {/* Google Auth Button */}
                <div style={{ marginBottom: '2rem' }}>
                  <GoogleAuthComponent onSuccess={handleGoogleSuccess} />
                </div>

                {/* Divider */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '2rem',
                    opacity: 0.5,
                  }}
                >
                  <div style={{ flex: 1, height: '1px', background: T.colors.dark.border }} />
                  <span style={{ color: T.colors.text.disabled, fontSize: '0.85rem' }}>or</span>
                  <div style={{ flex: 1, height: '1px', background: T.colors.dark.border }} />
                </div>

                {/* Security Info Box */}
                <div
                  style={{
                    padding: '1.25rem',
                    background: `linear-gradient(135deg, ${T.colors.dark.bg} 0%, rgba(88, 129, 255, 0.05) 100%)`,
                    border: `1px solid ${T.colors.dark.border}`,
                    borderRadius: T.borderRadius.lg,
                    display: 'flex',
                    gap: '1rem',
                  }}
                >
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>🔐</span>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: '0.9rem',
                        color: T.colors.text.secondary,
                        margin: '0 0 0.25rem 0',
                        fontWeight: 600,
                      }}
                    >
                      Secure & Private
                    </p>
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: T.colors.text.hint,
                        margin: 0,
                        lineHeight: '1.5',
                      }}
                    >
                      Your data is encrypted. We verify new login locations for your protection.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Terms Not Accepted */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚖️</div>
                  <h3
                    style={{
                      color: T.colors.text.primary,
                      fontSize: T.typography.fontSize.lg,
                      marginBottom: '1rem',
                      fontWeight: 700,
                    }}
                  >
                    Terms & Privacy
                  </h3>
                  <p
                    style={{
                      color: T.colors.text.secondary,
                      marginBottom: '2rem',
                      lineHeight: '1.6',
                    }}
                  >
                    Please read and accept our Terms of Use and Privacy Policy to continue.
                  </p>
                  <button
                    onClick={() => setShowTerms(true)}
                    style={{
                      padding: '0.875rem 2rem',
                      background: T.colors.gradients.primaryGradient,
                      color: 'white',
                      border: 'none',
                      borderRadius: T.borderRadius.lg,
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: T.shadows.lg,
                      width: '100%',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = T.shadows.xl;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = T.shadows.lg;
                    }}
                  >
                    View Terms & Privacy
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '2.5rem',
            padding: '1.5rem',
            backgroundColor: 'rgba(88, 129, 255, 0.05)',
            borderRadius: T.borderRadius.lg,
            border: `1px solid ${T.colors.dark.border}`,
          }}
        >
          <p style={{ color: T.colors.text.hint, fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>
            By signing in, you agree to our{' '}
            <button
              onClick={() => setShowTerms(true)}
              style={{
                background: 'none',
                border: 'none',
                color: T.colors.primary[400],
                cursor: 'pointer',
                textDecoration: 'underline',
                fontWeight: 600,
                fontSize: 'inherit',
              }}
            >
              Terms & Privacy Policy
            </button>
          </p>
          <p
            style={{
              textAlign: 'center',
              marginTop: '2.5rem',
              color: T.colors.text.hint,
              fontSize: '0.8rem',
              margin: '0 0 0.5rem 0',
            }}
          >
            © 2026 GIFTED HANDS VENTURES. All rights reserved.
          </p>
        </div>
      </div>

      {/* Modals */}
      <TermsAndPrivacyModal isOpen={showTerms} onAccept={handleTermsAccept} />
      <IPVerificationModal
        isOpen={showIPVerification}
        currentIP={currentIP}
        onVerify={handleIPVerify}
        onSkip={() => setShowIPVerification(false)}
      />

      {/* Animations */}
      <style>{`
        @keyframes float-logo {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }

        @keyframes float-glow {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(20px, -20px); }
          50% { transform: translate(0, 30px); }
          75% { transform: translate(-20px, -10px); }
        }

        @keyframes float-glow-reverse {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-15px, 20px); }
          50% { transform: translate(15px, -20px); }
          75% { transform: translate(10px, 15px); }
        }
      `}</style>
    </div>
  );
}
