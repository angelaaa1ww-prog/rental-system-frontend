import React, { useState, useEffect, useRef } from 'react';
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

export function LoginPage({ onLoginSuccess }) {
  const [showTerms, setShowTerms] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [dark, setDark] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputsRef = useRef([]);

  useEffect(() => {
    const termsVersion = localStorage.getItem('termsAcceptedVersion');
    if (termsVersion === '2026-07-07') {
      setTermsAccepted(true);
      setShowTerms(false);
    }

    // Stagger input animation
    inputsRef.current.forEach((input, index) => {
      if (input) {
        input.style.opacity = '0';
        input.style.transform = 'translateY(10px)';
        setTimeout(() => {
          input.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
          input.style.opacity = '1';
          input.style.transform = 'translateY(0)';
        }, 200 + index * 150);
      }
    });
  }, []);

  const handleTermsAccept = () => {
    localStorage.setItem('termsAcceptedVersion', '2026-07-07');
    setTermsAccepted(true);
    setShowTerms(false);
  };

  const handleGoogleSuccess = (authData) => {
    setIsSuccess(true);
    setTimeout(() => {
      onLoginSuccess(authData);
    }, 1200);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    let valid = true;
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email address');
      valid = false;
    }

    if (!password || password.length < 4) {
      setPasswordError('Password must be at least 4 characters');
      valid = false;
    }

    if (!termsAccepted) {
      setShowTerms(true);
      return;
    }

    if (!valid) return;

    setIsLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://rental-system-backend-1t05.onrender.com';
      const base = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;
      const res = await fetch(`${base}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.token) {
        setPasswordError(data.message || 'Invalid email or password. Please try again.');
        setIsLoading(false);
        return;
      }

      // Store token consistently
      localStorage.setItem('token', data.token);
      localStorage.setItem('authToken', data.token);
      const authData = { email, name: data.user?.name || 'Owner', token: data.token, ...data.user };
      localStorage.setItem('userData', JSON.stringify(authData));

      setIsSuccess(true);
      setTimeout(() => onLoginSuccess(authData), 900);
    } catch (err) {
      setPasswordError('Unable to reach the server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-screen glass-theme">
      {/* Background ambient glowing glass orbs */}
      <div className="glass-orb glass-orb-primary" />
      <div className="glass-orb glass-orb-accent" />
      <div className="glass-orb glass-orb-secondary" />

      <IconButton 
        icon={dark ? 'sun' : 'moon'} 
        label="Toggle theme" 
        className="floating-theme glass-button" 
        onClick={onTheme} 
      />

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="brand-header-center">
              <span className="brand-mark-glass">GH</span>
              <span className="glass-pill-eyebrow">Gifted Hands Ventures</span>
            </div>
            <h2>Welcome Back</h2>
            <p>Sign in to your owner workspace</p>
          </div>

          {!isSuccess ? (
            <>
              <form className="login-form" id="loginForm" onSubmit={handleSubmit} noValidate>
                <div className={`form-group ${emailError ? 'error' : ''}`}>
                  <div className="input-wrapper">
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      autoComplete="email"
                      ref={(el) => (inputsRef.current[0] = el)}
                    />
                    <label htmlFor="email">Email Address</label>
                    <span className="focus-border"></span>
                  </div>
                  {emailError && <span className="error-message show">{emailError}</span>}
                </div>

                <div className={`form-group ${passwordError ? 'error' : ''}`}>
                  <div className="input-wrapper password-wrapper">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      id="password" 
                      name="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                      autoComplete="current-password"
                      ref={(el) => (inputsRef.current[1] = el)}
                    />
                    <label htmlFor="password">Password</label>
                    <button 
                      type="button" 
                      className="password-toggle" 
                      onClick={() => setShowPassword(!showPassword)} 
                      aria-label="Toggle password visibility"
                    >
                      <span className={`eye-icon ${showPassword ? 'show-password' : ''}`}></span>
                    </button>
                    <span className="focus-border"></span>
                  </div>
                  {passwordError && <span className="error-message show">{passwordError}</span>}
                </div>

                <div className="form-options">
                  <label className="remember-wrapper">
                    <input 
                      type="checkbox" 
                      id="remember" 
                      name="remember" 
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    <span className="checkbox-label">
                      <span className="checkmark"></span>
                      Remember me
                    </span>
                  </label>
                  <a href="#forgot" className="forgot-password" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to registered owner email.'); }}>
                    Forgot password?
                  </a>
                </div>

                <button type="submit" className={`login-btn btn ${isLoading ? 'loading' : ''}`}>
                  <span className="btn-text">Sign In</span>
                  <span className="btn-loader"></span>
                </button>
              </form>

              <div className="divider">
                <span>or continue with</span>
              </div>

              <div className="social-login">
                {termsAccepted ? (
                  <div className="google-auth-container">
                    <GoogleAuthComponent onSuccess={handleGoogleSuccess} />
                  </div>
                ) : (
                  <button type="button" className="social-btn google-btn full-width-btn" onClick={() => setShowTerms(true)}>
                    <span className="social-icon google-icon"></span>
                    Accept Terms to Enable Google Sign-In
                  </button>
                )}
              </div>

              <div className="signup-link">
                <p>
                  Terms &amp; Privacy Agreement:{' '}
                  <button type="button" className="terms-link-btn" onClick={() => setShowTerms(true)}>
                    View Compliance
                  </button>
                </p>
              </div>
            </>
          ) : (
            <div className="success-message show">
              <div className="success-icon">✓</div>
              <h3>Login Successful!</h3>
              <p>Welcome to Gifted Hands Ventures Dashboard...</p>
            </div>
          )}
        </div>
      </div>

      <TermsAndPrivacyModal isOpen={showTerms} onAccept={handleTermsAccept} />
    </main>
  );
}
