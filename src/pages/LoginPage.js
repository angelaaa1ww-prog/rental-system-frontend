import React, { useState, useEffect } from 'react';
import { GoogleAuthComponent } from '../components/GoogleAuth';
import { TermsAndPrivacyModal } from '../components/TermsModal';
import { Icon as AppIcon } from '../components/ui';

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

  // Go directly to dashboard — IP verification removed
  const handleGoogleSuccess = (authData) => {
    onLoginSuccess(authData);
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
    <main className="auth-screen glass-theme">
      {/* Ambient background glass orbs */}
      <div className="glass-orb glass-orb-primary" />
      <div className="glass-orb glass-orb-accent" />
      <div className="glass-orb glass-orb-secondary" />

      <IconButton icon={dark ? 'sun' : 'moon'} label="Toggle theme" className="floating-theme glass-button" onClick={onTheme} />
      
      <section className="auth-layout">
        <div className="auth-story">
          <div className="brand-header">
            <span className="brand-mark-glass">GH</span>
            <span className="glass-pill-eyebrow">Gifted Hands Ventures</span>
          </div>
          <h1>A clearer way to run your rental portfolio.</h1>
          <p>
            Manage properties, tenant records, rent collection, and communication from a secure, focused workspace.
          </p>
          <div className="auth-stats" aria-label="Security highlights">
            <span className="glass-badge"><AppIcon name="shield" size={16} /> Restricted access</span>
            <span className="glass-badge"><AppIcon name="key" size={16} /> Secure sign-in</span>
            <span className="glass-badge"><AppIcon name="bell" size={16} /> Login security</span>
          </div>
        </div>

        <div className="auth-card glass-card">
          <div className="auth-form">
            <span className="mini-mark-glass">GH</span>
            <h2>Owner sign-in</h2>
            <p>Access is limited to authorized users.</p>
            
            {termsAccepted ? (
              <div className="auth-google-wrapper">
                <GoogleAuthComponent onSuccess={handleGoogleSuccess} />
              </div>
            ) : (
              <Button type="button" className="full-width glass-cta" onClick={() => setShowTerms(true)}>
                View Terms &amp; Privacy to continue
              </Button>
            )}

            <div className="legal-links">
              <button type="button" onClick={() => setShowTerms(true)}>Terms</button>
              <span className="dot-divider">•</span>
              <button type="button" onClick={() => setShowTerms(true)}>Privacy</button>
            </div>
          </div>
        </div>
      </section>

      <TermsAndPrivacyModal isOpen={showTerms} onAccept={handleTermsAccept} />
    </main>
  );
}
