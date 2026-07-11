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
  const [userIP, setUserIP] = useState(null);
  const [googleFailed, setGoogleFailed] = useState(false);
  const googleButtonRef = useRef(null);

  useEffect(() => {
    // Fetch user IP address
    fetch('https://api.ipify.org?format=json')
      .then((res) => res.json())
      .then((data) => setUserIP(data.ip))
      .catch(() => setUserIP('unknown'));

    if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
      // Provide a clearer, actionable message when client ID isn't provided at build time.
      const msg = 'Google Sign-In is not configured. Set REACT_APP_GOOGLE_CLIENT_ID in your environment and rebuild the frontend.';
      console.error('REACT_APP_GOOGLE_CLIENT_ID is missing — check .env / Vercel env vars.');
      setError(msg);
      setGoogleFailed(true);
      return;
    }

    let cancelled = false;
    let elapsed = 0;

    const tryInitGoogle = () => {
      if (cancelled) return;

      if (window.google && window.google.accounts && window.google.accounts.id) {
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

      // Store auth data
      const authData = {
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        token: res.token,
        ipAddress: userIP,
        firstLoginIP: userIP,
        loginTimestamp: new Date().toISOString(),
        isNewIP: true,
      };

      // Check if IP is new
      const previousLogins = JSON.parse(localStorage.getItem('loginHistory') || '[]');
      const isNewIP = !previousLogins.some((login) => login.ipAddress === userIP);

      authData.isNewIP = isNewIP;

      // Store securely
      localStorage.setItem('token', res.token);
      localStorage.setItem('authToken', res.token);
      localStorage.setItem('userData', JSON.stringify(authData));
      localStorage.setItem('lastIP', userIP);
      previousLogins.push({
        timestamp: authData.loginTimestamp,
        ipAddress: userIP,
      });
      localStorage.setItem('loginHistory', JSON.stringify(previousLogins.slice(-10)));

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

      {userIP && (
        <p style={{ fontSize: '0.75rem', color: 'var(--subtle)', marginTop: '0.5rem', margin: 0 }}>
          Your IP: {userIP}
        </p>
      )}
    </div>
  );
}

export function IPVerificationModal({ isOpen, currentIP, onVerify, onSkip }) {
  // In development, auto-skip IP verification after 1.5 seconds
  useEffect(() => {
    if (isOpen && process.env.REACT_APP_ENV === 'development') {
      const timer = setTimeout(() => {
        onSkip();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onSkip]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--line)',
          padding: '2rem',
          maxWidth: '460px',
          width: '90%',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        <div style={{ color: 'var(--success)' }}>
          <Icon name="checkCircle" size={48} />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
          Verifying Your Login
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>
          New location detected: <strong>{currentIP}</strong>
        </p>
        <p style={{ color: 'var(--subtle)', fontSize: '0.8rem', margin: 0 }}>
          Auto-verifying in development mode...
        </p>

        <div style={{ display: 'flex', width: '100%', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button
            className="btn-primary"
            onClick={() => onSkip()}
            style={{ flex: 1, padding: '0.6rem' }}
          >
            Continue Now
          </button>
        </div>

        <p style={{ color: 'var(--subtle)', fontSize: '0.7rem', margin: 0, marginTop: '0.5rem' }}>
          In production, verification codes will be sent to your email.
        </p>
      </div>
    </div>
  );
}