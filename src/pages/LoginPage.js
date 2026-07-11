import React, { useState, useEffect } from 'react';
import { GoogleAuthComponent, IPVerificationModal } from '../components/GoogleAuth';
import { TermsAndPrivacyModal } from '../components/TermsModal';
import { Icon as AppIcon } from '../components/ui';
import { BrandLogo, BrandMark } from '../components/BrandLogo';

function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

function IconButton({ icon, label, className = '', ...props }) {
  return (
    <button className={cx('icon-button', className)} aria-label={label} title={label} {...props}>
      <AppIcon name={icon} size={18} />
    </button>
  );
}

function Button({ children, icon, tone = 'primary', className = '', ...props }) {
  return (
    <button className={cx('button', `button-${tone}`, className)} {...props}>
      {icon && <AppIcon name={icon} size={17} />}
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
            <AppIcon name="building" size={32} />
          </span>
          <p className="eyebrow">Gifted Hands Ventures</p>
          <h1>A clearer way to run your rental portfolio.</h1>
          <p>
            Manage properties, tenant records, rent collection, and communication from a secure, focused workspace.
          </p>
          <div className="auth-stats" aria-label="Security highlights">
            <span><AppIcon name="shield" size={16} /> Restricted access</span>
            <span><AppIcon name="key" size={16} /> Location checks</span>
            <span><AppIcon name="bell" size={16} /> Login security</span>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-form">
            <span className="mini-mark">
              <AppIcon name="key" size={22} />
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
