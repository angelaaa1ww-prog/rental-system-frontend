import React, { useEffect, useState, useRef } from 'react';
import { API, safeFetch } from '../api';
import { Icon } from './ui';

const DEFAULT_ALLOWED_EMAIL = 'isowekesa@gmail.com';
const ALLOWED_EMAILS = (process.env.REACT_APP_AUTHORIZED_EMAILS || DEFAULT_ALLOWED_EMAIL)
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);
const GOOGLE_LOAD_TIMEOUT_MS = 10000;
const GOOGLE_POLL_INTERVAL_MS = 200;

export function GoogleAuthComponent({ onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [googleFailed, setGoogleFailed] = useState(false);
  const googleButtonRef = useRef(null);
  // Guard flag: ensures Google is only initialized once per mount
  const initialized = useRef(false);

  useEffect(() => {
    if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
      const msg = 'Google Sign-In is not configured. Set REACT_APP_GOOGLE_CLIENT_ID in your environment and rebuild the frontend.';
      console.error('REACT_APP_GOOGLE_CLIENT_ID is missing — check .env / Vercel env vars.');
      setError(msg);
      setGoogleFailed(true);
      return;
    }

    // Prevent double initialization (important even without StrictMode)
    if (initialized.current) return;

    let cancelled = false;
    let elapsed = 0;

    const tryInitGoogle = () => {
      if (cancelled) return;

      if (window.google && window.google.accounts && window.google.accounts.id) {
        if (initialized.current) return; // double-check guard
        initialized.current = true;

        try {
          window.google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: handleGoogleAuth,
          });

          if (googleButtonRef.current) {
            window.google.accounts.id.renderButton(googleButtonRef.current, {
              theme: 'outline',
              size: 'large',
              width: '100%',
              text: 'signin_with',
            });
          }
        } catch (err) {
          console.error('Google initialization error:', err);
          setError('Failed to load Google Sign-In. Please refresh.');
          setGoogleFailed(true);
        }
        return;
      }

      elapsed += GOOGLE_POLL_INTERVAL_MS;
      if (elapsed >= GOOGLE_LOAD_TIMEOUT_MS) {
        console.error('Google Identity Services script never became available.');
        setGoogleFailed(true);
        return;
      }
      setTimeout(tryInitGoogle, GOOGLE_POLL_INTERVAL_MS);
    };

    tryInitGoogle();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoogleAuth = async (response) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!response.credential) {
        setError('Google authentication failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // Decode JWT token
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const userData = JSON.parse(jsonPayload);

      // Verify email against the allowed list
      if (!ALLOWED_EMAILS.includes((userData.email || '').toLowerCase())) {
        setError('Access denied. This Google account is not authorized.');
        setIsLoading(false);
        return;
      }

      // Authenticate with the backend
      const res = await safeFetch(`${API}/api/google-auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      });

      if (res?.__error || !res || !res.token) {
        setError(res?.message || 'Access denied by backend server.');
        setIsLoading(false);
        return;
      }

      // Build auth data (IP info kept internally but not displayed)
      const loginTimestamp = new Date().toISOString();
      const authData = {
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        token: res.token,
        loginTimestamp,
      };

      // Store auth data securely
      localStorage.setItem('token', res.token);
      localStorage.setItem('authToken', res.token);
      localStorage.setItem('userData', JSON.stringify(authData));

      // Maintain login history (internal only, not displayed)
      const previousLogins = JSON.parse(localStorage.getItem('loginHistory') || '[]');
      previousLogins.push({ timestamp: loginTimestamp });
      localStorage.setItem('loginHistory', JSON.stringify(previousLogins.slice(-10)));

      // Go directly to dashboard — no IP modal
      onSuccess(authData);
    } catch (err) {
      setError('Authentication failed. Please try again.');
      console.error('Auth error:', err);
    }

    setIsLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%' }}>
      {/* Official Google Sign-In Button */}
      <div
        ref={googleButtonRef}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      />

      {/* Custom Fallback Button (shown only once Google is confirmed unavailable) */}
      {googleFailed && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            className="btn-primary"
            onClick={() => window.open('https://accounts.google.com/', '_blank', 'noopener')}
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              fontSize: '0.95rem',
              minHeight: '42px'
            }}
          >
            <Icon name="key" size={16} />
            Sign In with Google (open in new tab)
          </button>
          <button
            className="btn-ghost"
            onClick={() => window.alert('To enable Google Sign-In: set REACT_APP_GOOGLE_CLIENT_ID in your build environment (e.g. Vercel env vars or .env) and rebuild the frontend. If you need help, check the README.')}
            style={{ width: '100%', padding: '0.5rem', fontSize: '0.85rem' }}
          >
            Troubleshoot / How to configure
          </button>
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '0.75rem 1rem',
            background: 'var(--danger-soft)',
            border: '1px solid var(--danger)',
            borderRadius: 'var(--radius)',
            color: 'var(--danger)',
            fontSize: '0.85rem',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            fontWeight: 500
          }}
        >
          {error}
        </div>
      )}

      {isLoading && (
        <div
          style={{
            color: 'var(--muted)',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span className="loader small" style={{ display: 'inline-block' }} />
          Verifying your credentials...
        </div>
      )}
    </div>
  );
}

// IPVerificationModal kept for API compatibility but auto-skips immediately
export function IPVerificationModal({ isOpen, onSkip }) {
  useEffect(() => {
    if (isOpen) {
      // Auto-skip immediately — no IP verification required
      onSkip();
    }
  }, [isOpen, onSkip]);

  return null;
}