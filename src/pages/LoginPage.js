import React, { useState, useEffect } from 'react';
import { GoogleAuthComponent, IPVerificationModal } from '../components/GoogleAuth';
import { TermsAndPrivacyModal } from '../components/TermsModal';

const ICONS = {
  building: '<path d="M4 22V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v18"/><path d="M9 22v-6h6v6"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m12 11 9-9M17 7l3 3M14 10l2 2"/>',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  sun: '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>'
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

function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

function IconButton({ icon, label, className = '', ...props }) {
  return (
    <button className={cx('icon-button', className)} aria-label={label} title={label} {...props}>
      <Icon name={icon} size={18} />
    </button>
  );
}

function Button({ children, icon, tone = 'primary', className = '', ...props }) {
  return (
    <button className={cx('button', `button-${tone}`, className)} {...props}>
      {icon && <Icon name={icon} size={17} />}
      <span>{children}</span>
    </button>
  );
}


export function LoginPage({ onLoginSuccess }) {
  const [showTerms, setShowTerms] = useState(true);
  const [showIPVerification, setShowIPVerification] = useState(false);
  const [currentIP, setCurrentIP] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [dark, setDark] = useState(false);

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

  const onTheme = () => {
    const newDark = !dark;
    setDark(newDark);
    if (newDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  return (
    <main className="auth-screen">
      <IconButton icon={dark ? 'sun' : 'moon'} label="Toggle theme" className="floating-theme" onClick={onTheme} />
      <section className="auth-layout">
        <div className="auth-story">
          <span className="brand-mark large">
            <Icon name="building" size={32} />
          </span>
          <p className="eyebrow">Gifted Hands Ventures</p>
          <h1>Rental operations, rebuilt with a sharper pulse.</h1>
          <p>
            Clean records, live rent visibility, protected access, and a calmer command center for every house and tenant.
          </p>
          <div className="auth-stats" aria-label="Security highlights">
            <span><Icon name="shield" size={16} /> Google restricted</span>
            <span><Icon name="key" size={16} /> IP policy gate</span>
            <span><Icon name="bell" size={16} /> Login alerts ready</span>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-form">
            <span className="mini-mark">
              <Icon name="key" size={22} />
            </span>
            <h2>Owner sign-in</h2>
            <p>Access is limited to authorized users.</p>
            
            {termsAccepted ? (
              <div style={{ marginTop: '0.5rem' }}>
                <GoogleAuthComponent onSuccess={handleGoogleSuccess} />
              </div>
            ) : (
              <Button type="button" className="full-width" onClick={() => setShowTerms(true)}>
                View Terms & Privacy
              </Button>
            )}

            <div className="legal-links" style={{ marginTop: '1rem' }}>
              <button type="button" onClick={() => setShowTerms(true)}>Terms</button>
              <button type="button" onClick={() => setShowTerms(true)}>Privacy</button>
            </div>
          </div>
        </div>
      </section>

      <TermsAndPrivacyModal isOpen={showTerms} onAccept={handleTermsAccept} />
      <IPVerificationModal
        isOpen={showIPVerification}
        currentIP={currentIP}
        onVerify={handleIPVerify}
        onSkip={() => setShowIPVerification(false)}
      />
    </main>
  );
}
