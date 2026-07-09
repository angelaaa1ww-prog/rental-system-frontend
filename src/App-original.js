import { Analytics } from '@vercel/analytics/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { API } from './api';

const ADMIN_NAME = 'Isaac Wekesa';
const ALLOWED_GOOGLE_EMAIL = 'isowekesa@gmail.com';
const POLICY_VERSION = '2026-07-07';
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const APARTMENTS = ['A', 'B', 'C', 'D'];

const ICONS = {
  alertTriangle: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  banknote: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
  barChart: '<path d="M3 3v18h18"/><path d="M7 16V9"/><path d="M12 16V5"/><path d="M17 16v-4"/>',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  building: '<path d="M4 22V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v18"/><path d="M9 22v-6h6v6"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  check: '<path d="m20 6-11 11-5-5"/>',
  checkCircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m22 4-10 10.01-3-3"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  creditCard: '<rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/>',
  dollarSign: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/>',
  fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/>',
  hash: '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
  home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/>',
  idCard: '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M6 15v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1M16 10h2M16 14h2"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m12 11 9-9M17 7l3 3M14 10l2 2"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  logOut: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  megaphone: '<path d="m3 11 18-5v12L3 14v-3Z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  messageSquare: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/>',
  printer: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  refresh: '<path d="M21 2v6h-6"/><path d="M21 12a9 9 0 1 1-2.64-6.36L21 8"/>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 4.3l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.31.21.65.21 1h.39a2 2 0 1 1 0 4h-.39c0 .35-.07.69-.21 1Z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
  sun: '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  xCircle: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>'
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

function fmtMoney(value) {
  return `KES ${Number(value || 0).toLocaleString('en-KE')}`;
}

function cleanToken(value) {
  return value && value !== 'undefined' && value !== 'null' ? value : null;
}

function getStoredToken() {
  return cleanToken(localStorage.getItem('token'));
}

function parseJson(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function decodeGoogleCredential(credential) {
  const part = credential?.split('.')[1];
  if (!part) return null;
  const normalized = part.replace(/-/g, '+').replace(/_/g, '/');
  const decoded = atob(normalized);
  const json = decodeURIComponent(
    decoded
      .split('')
      .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
      .join('')
  );
  return JSON.parse(json);
}

async function readPublicIp() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch('https://api.ipify.org?format=json', {
      cache: 'no-store',
      signal: controller.signal
    });
    const data = await response.json();
    return data?.ip || 'unknown-ip';
  } catch {
    return 'unknown-ip';
  } finally {
    clearTimeout(timer);
  }
}

function policyKey(ip) {
  return `ghv-policy:${POLICY_VERSION}:${ip || 'unknown-ip'}`;
}

function useToast() {
  const [list, setList] = useState([]);
  const show = useCallback((message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    const text = typeof message === 'object' && message !== null ? JSON.stringify(message) : String(message);
    setList((current) => [...current, { id, text, type }]);
    window.setTimeout(() => setList((current) => current.filter((item) => item.id !== id)), 4400);
  }, []);
  return { list, show };
}

function usePolicyGate() {
  const [ready, setReady] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [ip, setIp] = useState('');

  useEffect(() => {
    let alive = true;
    readPublicIp().then((foundIp) => {
      if (!alive) return;
      setIp(foundIp);
      setAccepted(Boolean(localStorage.getItem(policyKey(foundIp))));
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const accept = useCallback(() => {
    const foundIp = ip || 'unknown-ip';
    localStorage.setItem(
      policyKey(foundIp),
      JSON.stringify({
        acceptedAt: new Date().toISOString(),
        ip: foundIp,
        policyVersion: POLICY_VERSION
      })
    );
    setAccepted(true);
  }, [ip]);

  return { ready, accepted, ip: ip || 'unknown-ip', accept };
}

function useViewport() {
  const [compact, setCompact] = useState(() => window.innerWidth < 980);
  useEffect(() => {
    const onResize = () => setCompact(window.innerWidth < 980);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return compact;
}

function ParticleField() {
  const particles = useMemo(
    () =>
      Array.from({ length: 54 }, (_, index) => ({
        id: index,
        left: `${(index * 37) % 101}%`,
        top: `${(index * 61) % 101}%`,
        size: `${2 + (index % 5)}px`,
        delay: `${(index % 11) * -0.7}s`,
        duration: `${12 + (index % 7)}s`,
        dx: `${((index % 9) - 4) * 10}px`,
        dy: `${((index % 7) - 3) * 12}px`
      })),
    []
  );

  return (
    <div className="particle-field" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          style={{
            '--x': particle.left,
            '--y': particle.top,
            '--s': particle.size,
            '--delay': particle.delay,
            '--duration': particle.duration,
            '--dx': particle.dx,
            '--dy': particle.dy
          }}
        />
      ))}
    </div>
  );
}

function Toasts({ list }) {
  if (!list.length) return null;
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {list.map((item) => (
        <div className={cx('toast', `toast-${item.type}`)} key={item.id}>
          <Icon name={item.type === 'success' ? 'checkCircle' : item.type === 'error' ? 'xCircle' : 'info'} size={18} />
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
}

function Field({ label, children, helper }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {helper && <small>{helper}</small>}
    </label>
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

function IconButton({ icon, label, className = '', ...props }) {
  return (
    <button className={cx('icon-button', className)} aria-label={label} title={label} {...props}>
      <Icon name={icon} size={18} />
    </button>
  );
}

function Tag({ children, tone = 'neutral', icon }) {
  return (
    <span className={cx('tag', `tag-${tone}`)}>
      {icon && <Icon name={icon} size={13} />}
      <span>{children}</span>
    </span>
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
  return <span className={cx('avatar', `avatar-${size}`)}>{initials || '?'}</span>;
}

function EmptyState({ icon = 'info', title, text }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name={icon} size={28} />
      </span>
      <strong>{title}</strong>
      {text && <p>{text}</p>}
    </div>
  );
}

function Modal({ title, onClose, children, size = 'md' }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={cx('modal', `modal-${size}`)} role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : 'Dialog'}>
        <header className="modal-header">
          <h2>{title}</h2>
          <IconButton icon="x" label="Close dialog" onClick={onClose} />
        </header>
        {children}
      </section>
    </div>
  );
}

function LegalCopy({ type }) {
  const terms = [
    ['Authorized use', 'This system is for Gifted Hands Ventures rental operations and may only be used by the approved owner account and people explicitly permitted by the owner.'],
    ['Accurate records', 'House, tenant, rent, payment, report, and SMS records should be entered truthfully and reviewed before messages or reports are sent.'],
    ['Account responsibility', 'You are responsible for protecting Google access, device security, and any two-factor authentication codes used with this system.'],
    ['Operational availability', 'The application depends on hosted services, Google authentication, network access, and the connected backend API. Temporary downtime can occur.'],
    ['Changes', 'These terms may be updated as the rental system changes. Continued use after a new policy prompt means you accept the current version.']
  ];
  const privacy = [
    ['Data handled', 'The system can store tenant names, phone numbers, national ID values, house assignments, rent amounts, payment records, messages, account email, and login security events.'],
    ['How data is used', 'Data is used to manage houses, track rent balances, record payments, generate reports, send tenant SMS messages, and protect the owner account.'],
    ['Google sign-in', `Google sign-in is limited in this frontend to ${ALLOWED_GOOGLE_EMAIL}. The Google credential is checked before it is sent to the backend authentication endpoint.`],
    ['IP policy prompt', 'A public IP lookup is used to decide whether this browser should see the terms and privacy prompt again for a new network address. If lookup fails, an unknown-IP consent key is used.'],
    ['Retention and care', 'Only keep data that is needed for operations. Review tenant data regularly and remove records that should no longer be retained.']
  ];

  const rows = type === 'privacy' ? privacy : terms;
  return (
    <div className="legal-copy">
      <p className="legal-date">Effective {POLICY_VERSION}</p>
      {rows.map(([heading, body]) => (
        <section key={heading}>
          <h3>{heading}</h3>
          <p>{body}</p>
        </section>
      ))}
    </div>
  );
}

function PolicyGate({ ready, ip, onAccept }) {
  const [tab, setTab] = useState('terms');
  const [checked, setChecked] = useState(false);

  return (
    <main className="auth-screen">
      <ParticleField />
      <section className="policy-panel" aria-busy={!ready}>
        {!ready ? (
          <div className="policy-loading">
            <span className="loader" />
            <h1>Checking access origin</h1>
            <p>Preparing the policy prompt before the rental system loads.</p>
          </div>
        ) : (
          <>
            <div className="policy-brand">
              <span className="brand-mark">
                <Icon name="shield" size={26} />
              </span>
              <div>
                <p>Gifted Hands Ventures</p>
                <h1>Review before access</h1>
              </div>
            </div>
            <p className="policy-intro">
              A new network address needs approval before the system, login, or dashboard is displayed.
            </p>
            <div className="ip-strip">
              <Icon name="info" size={16} />
              <span>Detected IP: {ip}</span>
            </div>
            <div className="segmented" role="tablist" aria-label="Legal documents">
              <button className={tab === 'terms' ? 'active' : ''} onClick={() => setTab('terms')} type="button">
                Terms of Use
              </button>
              <button className={tab === 'privacy' ? 'active' : ''} onClick={() => setTab('privacy')} type="button">
                Privacy Policy
              </button>
            </div>
            <LegalCopy type={tab} />
            <label className="check-row">
              <input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} />
              <span>I have read and accept the Terms of Use and Privacy Policy for this IP address.</span>
            </label>
            <Button icon="check" disabled={!checked} onClick={onAccept} className="full-width">
              Accept and continue
            </Button>
          </>
        )}
      </section>
    </main>
  );
}

function LoginScreen({
  dark,
  onTheme,
  welcome,
  requires2FA,
  totpCode,
  setTotpCode,
  verify2FA,
  verifying2FA,
  cancel2FA,
  googleButtonRef,
  googleBusy,
  googleReady,
  setLegalModal
}) {
  return (
    <main className="auth-screen">
      <ParticleField />
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
          {welcome ? (
            <div className="welcome-card">
              <span className="pulse-ring">
                <Icon name="checkCircle" size={34} />
              </span>
              <h2>Welcome back, {ADMIN_NAME}</h2>
              <p>Preparing the rental command center.</p>
            </div>
          ) : requires2FA ? (
            <div className="auth-form">
              <span className="mini-mark">
                <Icon name="shield" size={22} />
              </span>
              <h2>Two-factor check</h2>
              <p>Enter the 6-digit code from your authenticator app.</p>
              <Field label="Authentication code">
                <input
                  className="input code-input"
                  inputMode="numeric"
                  maxLength={6}
                  value={totpCode}
                  onChange={(event) => setTotpCode(event.target.value.replace(/\D/g, ''))}
                  onKeyDown={(event) => event.key === 'Enter' && verify2FA()}
                  placeholder="000000"
                />
              </Field>
              <Button icon="check" onClick={verify2FA} disabled={verifying2FA}>
                {verifying2FA ? 'Verifying' : 'Verify code'}
              </Button>
              <Button icon="chevronLeft" tone="ghost" onClick={cancel2FA}>
                Back to Google sign-in
              </Button>
            </div>
          ) : (
            <div className="auth-form">
              <span className="mini-mark">
                <Icon name="key" size={22} />
              </span>
              <h2>Owner sign-in</h2>
              <p>Access is limited to {ALLOWED_GOOGLE_EMAIL}.</p>
              {GOOGLE_CLIENT_ID ? (
                <>
                  <div className={cx('google-host', googleBusy && 'is-busy')} ref={googleButtonRef} />
                  {!googleReady && <p className="microcopy">Loading Google sign-in...</p>}
                </>
              ) : (
                <div className="config-alert">
                  <Icon name="alertTriangle" size={18} />
                  <span>Set REACT_APP_GOOGLE_CLIENT_ID to enable Google sign-in.</span>
                </div>
              )}
              {googleBusy && (
                <div className="inline-loading">
                  <span className="loader small" />
                  <span>Checking Google account</span>
                </div>
              )}
              <div className="legal-links">
                <button type="button" onClick={() => setLegalModal('terms')}>Terms</button>
                <button type="button" onClick={() => setLegalModal('privacy')}>Privacy</button>
              </div>
            </div>
          )}
        </div>
      </section>
      <Analytics />
    </main>
  );
}

function MetricTile({ icon, label, value, tone = 'primary', detail }) {
  return (
    <article className={cx('metric-tile', `metric-${tone}`)}>
      <span>
        <Icon name={icon} size={22} />
      </span>
      <div>
        <strong>{value}</strong>
        <p>{label}</p>
        {detail && <small>{detail}</small>}
      </div>
    </article>
  );
}

function SkeletonGrid({ count = 6 }) {
  return (
    <div className="metric-grid">
      {Array.from({ length: count }, (_, index) => (
        <span className="skeleton-tile" key={index} />
      ))}
    </div>
  );
}

function DashboardPage({ loading, dash, houses, tenants, payments, reminders, onNavigate }) {
  const totalHouses = dash?.totalHouses ?? houses.length;
  const occupied = dash?.occupied ?? houses.filter((house) => house.status === 'occupied').length;
  const available = dash?.available ?? houses.filter((house) => house.status !== 'occupied').length;
  const totalIncome = dash?.totalIncome ?? payments.filter((payment) => payment.status !== 'failed').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const occupancy = totalHouses > 0 ? Math.round((occupied / totalHouses) * 100) : 0;
  const overdue = dash?.overdueTenants || [];

  return (
    <div className="page-stack">
      <section className="hero-band">
        <div>
          <p className="eyebrow">Operations liveboard</p>
          <h1>Rental command center</h1>
          <p>Track occupancy, balances, tenant movement, payments, and reminders from one focused workspace.</p>
        </div>
        <div className="hero-ledger">
          <span>Portfolio health</span>
          <strong>{occupancy}%</strong>
          <div className="progress">
            <span style={{ width: `${occupancy}%` }} />
          </div>
          <small>{occupied} occupied units, {available} ready units</small>
        </div>
      </section>

      {loading && !dash ? (
        <SkeletonGrid />
      ) : (
        <div className="metric-grid">
          <MetricTile icon="home" label="Total houses" value={totalHouses} tone="primary" />
          <MetricTile icon="checkCircle" label="Occupied" value={occupied} tone="success" />
          <MetricTile icon="key" label="Vacant" value={available} tone="warning" />
          <MetricTile icon="dollarSign" label="Income" value={fmtMoney(totalIncome)} tone="blue" />
          <MetricTile icon={overdue.length ? 'alertTriangle' : 'check'} label="Overdue" value={dash?.overdueCount ?? overdue.length} tone={overdue.length ? 'danger' : 'success'} />
          <MetricTile icon="users" label="Tenants" value={tenants.length} tone="violet" />
        </div>
      )}

      <div className="split-grid">
        <section className="surface span-7">
          <div className="section-head">
            <div>
              <p className="eyebrow">Occupancy</p>
              <h2>Unit movement</h2>
            </div>
            <Tag tone={occupancy >= 80 ? 'success' : occupancy >= 50 ? 'warning' : 'danger'}>{occupancy}% filled</Tag>
          </div>
          <div className="progress big">
            <span style={{ width: `${occupancy}%` }} />
          </div>
          <div className="mini-grid">
            <span><strong>{occupied}</strong> occupied</span>
            <span><strong>{available}</strong> vacant</span>
            <span><strong>{totalHouses}</strong> total</span>
          </div>
        </section>
        <section className="surface span-5">
          <div className="section-head">
            <div>
              <p className="eyebrow">Attention</p>
              <h2>Due reminders</h2>
            </div>
            <Button tone="ghost" icon="messageSquare" onClick={() => onNavigate('sms')}>Open SMS</Button>
          </div>
          {!reminders.length ? (
            <EmptyState icon="checkCircle" title="No reminders waiting" text="Tenant reminder queue is clear." />
          ) : (
            <div className="compact-list">
              {reminders.slice(0, 4).map((reminder, index) => (
                <div className="compact-row" key={`${reminder.name}-${index}`}>
                  <Avatar name={reminder.name} size="sm" />
                  <div>
                    <strong>{reminder.name}</strong>
                    <p>{reminder.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="surface">
        <div className="section-head">
          <div>
            <p className="eyebrow">Risk queue</p>
            <h2>Overdue tenants</h2>
          </div>
          {overdue.length > 0 && <Tag tone="danger">{overdue.length} pending</Tag>}
        </div>
        {!overdue.length ? (
          <EmptyState icon="checkCircle" title="All tenants are up to date" text="No rent balances are currently flagged as overdue." />
        ) : (
          <DataTable
            columns={['Tenant', 'Phone', 'House', 'Rent', 'Paid', 'Balance']}
            rows={overdue.map((tenant) => [
              tenant.name,
              tenant.phone,
              <Tag tone="blue" key="house">{tenant.house}</Tag>,
              fmtMoney(tenant.rent),
              fmtMoney(tenant.paid),
              <Tag tone="danger" key="balance">{fmtMoney(tenant.balance)}</Tag>
            ])}
          />
        )}
      </section>
    </div>
  );
}

function HousesPage({
  houses,
  hNum,
  setHNum,
  hLoc,
  setHLoc,
  hRent,
  setHRent,
  hApt,
  setHApt,
  hBed,
  setHBed,
  hType,
  setHType,
  hNightly,
  setHNightly,
  hSearch,
  setHSearch,
  hFilter,
  setHFilter,
  addHouse,
  setEditH,
  setDelConf
}) {
  const filtered = houses.filter((house) => {
    const query = hSearch.trim().toLowerCase();
    const matchesText = !query || house.houseNumber?.toLowerCase().includes(query) || house.location?.toLowerCase().includes(query);
    const matchesFilter = hFilter === 'all' || house.status === hFilter;
    return matchesText && matchesFilter;
  });
  const apartmentNames = Array.from(new Set([...APARTMENTS, ...houses.map((house) => house.apartment).filter(Boolean)]));

  return (
    <div className="page-stack">
      <section className="surface">
        <div className="section-head">
          <div>
            <p className="eyebrow">Inventory</p>
            <h2>Register a unit</h2>
          </div>
        </div>
        <form className="form-grid" onSubmit={(event) => { event.preventDefault(); addHouse(); }}>
          <Field label="House number">
            <input className="input" value={hNum} onChange={(event) => setHNum(event.target.value)} placeholder="A101" />
          </Field>
          <Field label="Location">
            <input className="input" value={hLoc} onChange={(event) => setHLoc(event.target.value)} placeholder="Kiambu Road" />
          </Field>
          <Field label="Apartment">
            <select className="input" value={hApt} onChange={(event) => setHApt(event.target.value)}>
              {APARTMENTS.map((apartment) => <option value={apartment} key={apartment}>Apartment {apartment}</option>)}
            </select>
          </Field>
          <Field label="Bedrooms">
            <select className="input" value={hBed} onChange={(event) => setHBed(Number(event.target.value))}>
              {[1, 2, 3, 4].map((count) => <option value={count} key={count}>{count} bedroom{count > 1 ? 's' : ''}</option>)}
            </select>
          </Field>
          <Field label="Monthly rent">
            <input className="input" type="number" value={hRent} onChange={(event) => setHRent(event.target.value)} placeholder="8500" />
          </Field>
          <Field label="Rental type">
            <select className="input" value={hType} onChange={(event) => setHType(event.target.value)}>
              <option value="monthly">Monthly rental</option>
              <option value="airbnb">Airbnb nightly</option>
            </select>
          </Field>
          {hType === 'airbnb' && (
            <Field label="Nightly rate">
              <input className="input" type="number" value={hNightly} onChange={(event) => setHNightly(event.target.value)} placeholder="2500" />
            </Field>
          )}
          <Button icon="home" className="align-end" type="submit">Add house</Button>
        </form>
      </section>

      <div className="toolbar">
        <div className="search-box">
          <Icon name="search" size={17} />
          <input value={hSearch} onChange={(event) => setHSearch(event.target.value)} placeholder="Search houses" />
        </div>
        <div className="segmented compact" aria-label="House filter">
          {[
            ['all', 'All'],
            ['occupied', 'Occupied'],
            ['vacant', 'Vacant']
          ].map(([key, label]) => (
            <button key={key} className={hFilter === key ? 'active' : ''} onClick={() => setHFilter(key)} type="button">{label}</button>
          ))}
        </div>
      </div>

      {apartmentNames.map((apartment) => {
        const group = filtered.filter((house) => (house.apartment || 'A') === apartment);
        if (!group.length) return null;
        return (
          <section className="unit-group" key={apartment}>
            <div className="group-title">
              <span>{apartment}</span>
              <h3>Apartment {apartment}</h3>
              <small>{group.length} unit{group.length === 1 ? '' : 's'}</small>
            </div>
            <div className="unit-list">
              {group.map((house) => (
                <article className="unit-card" key={house._id}>
                  <span className={cx('unit-icon', house.status === 'occupied' ? 'danger' : 'success')}>
                    <Icon name={house.status === 'occupied' ? 'lock' : 'key'} size={20} />
                  </span>
                  <div className="unit-main">
                    <strong>{house.houseNumber}</strong>
                    <p>{house.location || 'No location'} - {house.bedrooms || 1} bed{Number(house.bedrooms || 1) > 1 ? 's' : ''}</p>
                  </div>
                  <div className="unit-meta">
                    <strong>{fmtMoney(house.rent)}/mo</strong>
                    <Tag tone={house.status === 'occupied' ? 'danger' : 'success'}>{house.status === 'occupied' ? 'Occupied' : 'Vacant'}</Tag>
                    <IconButton icon="edit" label={`Edit ${house.houseNumber}`} onClick={() => setEditH({ ...house })} />
                    <IconButton icon="trash" label={`Delete ${house.houseNumber}`} onClick={() => setDelConf({ type: 'house', id: house._id, name: house.houseNumber })} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
      {!filtered.length && <EmptyState icon="home" title="No houses found" text="Add a house or change the current filter." />}
    </div>
  );
}

function resolveTenantHouse(tenant, houses) {
  const id = tenant.house?._id || tenant.house;
  return houses.find((house) => String(house._id) === String(id)) || (tenant.house && typeof tenant.house === 'object' ? tenant.house : null);
}

function TenantsPage({
  tenants,
  houses,
  balances,
  cashAmounts,
  setCashAmounts,
  smsMsg,
  setSmsMsg,
  smsBusy,
  tName,
  setTName,
  tPhone,
  setTPhone,
  tIdNumber,
  setTIdNumber,
  tSearch,
  setTSearch,
  addTenant,
  assign,
  cashPay,
  sendSMS,
  openProfile,
  setEditT,
  setDelConf,
  loading
}) {
  const filtered = tenants.filter((tenant) => {
    const query = tSearch.trim().toLowerCase();
    return !query || tenant.name?.toLowerCase().includes(query) || tenant.phone?.includes(query);
  });
  const vacantHouses = houses.filter((house) => house.status === 'vacant');

  return (
    <div className="page-stack">
      <section className="surface">
        <div className="section-head">
          <div>
            <p className="eyebrow">People</p>
            <h2>Add a tenant</h2>
          </div>
        </div>
        <form className="form-grid" onSubmit={(event) => { event.preventDefault(); addTenant(); }}>
          <Field label="Full name">
            <input className="input" value={tName} onChange={(event) => setTName(event.target.value)} placeholder="John Kamau" />
          </Field>
          <Field label="Phone number">
            <input className="input" value={tPhone} onChange={(event) => setTPhone(event.target.value)} placeholder="0712345678" />
          </Field>
          <Field label="National ID">
            <input className="input" value={tIdNumber} onChange={(event) => setTIdNumber(event.target.value)} placeholder="Optional" />
          </Field>
          <Button icon="user" className="align-end" type="submit">Add tenant</Button>
        </form>
      </section>

      <div className="toolbar">
        <div className="search-box">
          <Icon name="search" size={17} />
          <input value={tSearch} onChange={(event) => setTSearch(event.target.value)} placeholder="Search tenants by name or phone" />
        </div>
        <Tag tone="neutral">{filtered.length} tenant{filtered.length === 1 ? '' : 's'}</Tag>
      </div>

      {loading && !filtered.length ? (
        <SkeletonGrid count={3} />
      ) : (
        <div className="tenant-list">
          {filtered.map((tenant) => {
            const balance = balances[tenant._id] || { rent: 0, paid: 0, balance: 0 };
            const percent = balance.rent > 0 ? Math.min(100, Math.round((Number(balance.paid || 0) / Number(balance.rent || 1)) * 100)) : 0;
            const house = resolveTenantHouse(tenant, houses);
            return (
              <article className="tenant-card" key={tenant._id}>
                <div className="tenant-head">
                  <Avatar name={tenant.name} />
                  <div>
                    <strong>{tenant.name}</strong>
                    <p><Icon name="phone" size={13} /> {tenant.phone}</p>
                    {tenant.idNumber && <p><Icon name="idCard" size={13} /> ID {tenant.idNumber}</p>}
                  </div>
                  <div className="tenant-actions">
                    <Button tone="ghost" icon="eye" onClick={() => openProfile(tenant)}>Profile</Button>
                    <IconButton icon="edit" label={`Edit ${tenant.name}`} onClick={() => setEditT({ ...tenant })} />
                    <IconButton icon="trash" label={`Delete ${tenant.name}`} onClick={() => setDelConf({ type: 'tenant', id: tenant._id, name: tenant.name })} />
                  </div>
                </div>

                <div className="tenant-house-line">
                  <Tag tone={house ? 'blue' : 'warning'} icon={house ? 'home' : 'key'}>
                    {house ? `House ${house.houseNumber}` : 'No house assigned'}
                  </Tag>
                  <select className="input" defaultValue="" onChange={(event) => assign(tenant._id, event.target.value)} disabled={!vacantHouses.length}>
                    <option value="">{vacantHouses.length ? 'Assign or reassign house' : 'No vacant houses'}</option>
                    {vacantHouses.map((houseOption) => (
                      <option value={houseOption._id} key={houseOption._id}>
                        {houseOption.houseNumber} - {fmtMoney(houseOption.rent)}/mo
                      </option>
                    ))}
                  </select>
                </div>

                <div className="balance-panel">
                  <div>
                    <span>Monthly rent</span>
                    <strong>{fmtMoney(balance.rent)}</strong>
                  </div>
                  <div>
                    <span>Paid</span>
                    <strong className="good">{fmtMoney(balance.paid)}</strong>
                  </div>
                  <div>
                    <span>Balance</span>
                    <strong className={Number(balance.balance || 0) > 0 ? 'bad' : 'good'}>{fmtMoney(balance.balance)}</strong>
                  </div>
                  <div className="progress">
                    <span style={{ width: `${percent}%` }} />
                  </div>
                </div>

                <div className="tenant-tools">
                  <input
                    className="input"
                    type="number"
                    placeholder="Record cash payment"
                    value={cashAmounts[tenant._id] || ''}
                    onChange={(event) => setCashAmounts((current) => ({ ...current, [tenant._id]: event.target.value }))}
                  />
                  <Button tone="blue" icon="banknote" onClick={() => cashPay(tenant._id)}>Record</Button>
                  <input
                    className="input"
                    placeholder="Custom SMS message"
                    value={smsMsg[tenant._id] || ''}
                    onChange={(event) => setSmsMsg((current) => ({ ...current, [tenant._id]: event.target.value }))}
                  />
                  <Button tone="warning" icon="messageSquare" onClick={() => sendSMS(tenant._id, tenant.phone)} disabled={smsBusy[tenant._id]}>
                    {smsBusy[tenant._id] ? 'Sending' : 'SMS'}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {!loading && !filtered.length && <EmptyState icon="user" title="No tenants found" text="Add a tenant or change the search." />}
    </div>
  );
}

function ProfilePage({ tenant, houses, payments, fromPage, nav, setEditT, setDelConf, sendSMS }) {
  const house = resolveTenantHouse(tenant, houses);
  const confirmed = payments.filter((payment) => payment.status !== 'failed').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  return (
    <div className="page-stack">
      <Button tone="ghost" icon="chevronLeft" onClick={() => nav(fromPage)}>Back to {fromPage}</Button>
      <div className="profile-grid">
        <section className="surface profile-panel">
          <Avatar name={tenant.name} size="lg" />
          <h2>{tenant.name}</h2>
          <p><Icon name="phone" size={15} /> {tenant.phone}</p>
          {tenant.idNumber && <p><Icon name="idCard" size={15} /> ID {tenant.idNumber}</p>}
          <Tag tone={house ? 'blue' : 'warning'} icon={house ? 'home' : 'key'}>{house ? `House ${house.houseNumber}` : 'No house assigned'}</Tag>
          <div className="stacked-actions">
            <Button tone="ghost" icon="edit" onClick={() => setEditT({ ...tenant })}>Edit details</Button>
            <Button tone="warning" icon="messageSquare" onClick={() => sendSMS(tenant._id, tenant.phone)}>Send SMS</Button>
            <Button tone="danger" icon="trash" onClick={() => setDelConf({ type: 'tenant', id: tenant._id, name: tenant.name })}>Delete tenant</Button>
          </div>
        </section>
        <section className="surface">
          <div className="section-head">
            <div>
              <p className="eyebrow">Ledger</p>
              <h2>Payment history</h2>
            </div>
            <Tag tone="success">{fmtMoney(confirmed)}</Tag>
          </div>
          {!payments.length ? (
            <EmptyState icon="creditCard" title="No payments yet" />
          ) : (
            <DataTable
              columns={['Amount', 'Reference', 'Status', 'Date']}
              rows={payments.map((payment) => [
                fmtMoney(payment.amount),
                <code key="ref">{payment.reference || '-'}</code>,
                <Tag tone={payment.status === 'pending' ? 'warning' : payment.status === 'failed' ? 'danger' : 'success'} key="status">{payment.status || 'confirmed'}</Tag>,
                payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'
              ])}
            />
          )}
        </section>
      </div>
    </div>
  );
}

function PaymentsPage({ payments, setDelConf }) {
  const confirmed = payments.filter((payment) => payment.status !== 'failed').reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  return (
    <div className="page-stack">
      <section className="surface">
        <div className="section-head">
          <div>
            <p className="eyebrow">Money movement</p>
            <h2>Payment history</h2>
          </div>
          <Tag tone="success">{payments.length} records - {fmtMoney(confirmed)}</Tag>
        </div>
        {!payments.length ? (
          <EmptyState icon="creditCard" title="No payments yet" text="Recorded cash and mobile payments will appear here." />
        ) : (
          <DataTable
            columns={['#', 'Tenant', 'Amount', 'Reference', 'Status', 'Date', '']}
            rows={payments.map((payment, index) => [
              index + 1,
              <span className="person-cell" key="tenant"><Avatar name={payment.tenant?.name || '?'} size="sm" /> {payment.tenant?.name || 'Unknown'}</span>,
              fmtMoney(payment.amount),
              <code key="ref">{payment.reference || '-'}</code>,
              <Tag tone={payment.status === 'pending' ? 'warning' : payment.status === 'failed' ? 'danger' : 'success'} key="status">{payment.status || 'confirmed'}</Tag>,
              payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
              <IconButton icon="trash" label={`Delete payment ${payment.reference || index + 1}`} key="delete" onClick={() => setDelConf({ type: 'payment', id: payment._id, name: `${fmtMoney(payment.amount)} payment` })} />
            ])}
          />
        )}
      </section>
    </div>
  );
}

function ReportsPage({ rMonth, setRMonth, rYear, setRYear, report, rLoading, genReport }) {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

  return (
    <div className="page-stack">
      <section className="surface">
        <div className="section-head">
          <div>
            <p className="eyebrow">Reporting</p>
            <h2>Monthly rent report</h2>
          </div>
          {report && <Button tone="ghost" icon="printer" onClick={() => window.print()}>Print</Button>}
        </div>
        <div className="form-row">
          <Field label="Month">
            <select className="input" value={rMonth} onChange={(event) => setRMonth(Number(event.target.value))}>
              {MONTHS.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}
            </select>
          </Field>
          <Field label="Year">
            <select className="input" value={rYear} onChange={(event) => setRYear(Number(event.target.value))}>
              {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </Field>
          <Button icon="fileText" onClick={genReport} disabled={rLoading}>{rLoading ? 'Generating' : 'Generate'}</Button>
        </div>
      </section>
      {report ? (
        <section className="report-sheet">
          <div className="report-head">
            <span className="brand-mark"><Icon name="building" size={24} /></span>
            <div>
              <h2>Gifted Hands Ventures</h2>
              <p>Rent report - {MONTHS[report.month - 1]} {report.year}</p>
            </div>
          </div>
          <div className="metric-grid">
            <MetricTile icon="calendar" label="Period" value={`${MONTHS[report.month - 1]} ${report.year}`} tone="blue" />
            <MetricTile icon="dollarSign" label="Total income" value={fmtMoney(report.totalIncome)} tone="success" />
            <MetricTile icon="hash" label="Transactions" value={report.transactions || 0} tone="violet" />
            <MetricTile icon="barChart" label="Average" value={report.transactions > 0 ? fmtMoney(Math.round(Number(report.totalIncome || 0) / report.transactions)) : fmtMoney(0)} tone="primary" />
          </div>
        </section>
      ) : (
        <EmptyState icon="fileText" title="No report generated" text="Choose a month and year, then generate the report." />
      )}
    </div>
  );
}

function SmsPage({ tenants, reminders, broadcast, setBroadcast, broadcasting, sendBroadcast, smsMsg, setSmsMsg, smsBusy, sendSMS }) {
  return (
    <div className="page-stack">
      <section className="surface">
        <div className="section-head">
          <div>
            <p className="eyebrow">Messaging</p>
            <h2>Broadcast to all tenants</h2>
          </div>
          <Tag tone="blue">{tenants.length} recipients</Tag>
        </div>
        <textarea
          className="input"
          rows={4}
          value={broadcast}
          onChange={(event) => setBroadcast(event.target.value)}
          placeholder="Dear tenant, your rent is due. Please pay promptly. Thank you. - Gifted Hands Ventures"
        />
        <div className="send-row">
          <span>{broadcast.length} characters</span>
          <Button icon="messageSquare" onClick={sendBroadcast} disabled={broadcasting}>{broadcasting ? 'Sending' : 'Send to all'}</Button>
        </div>
      </section>

      {reminders.length > 0 && (
        <section className="surface">
          <div className="section-head">
            <div>
              <p className="eyebrow">Due soon</p>
              <h2>Reminder queue</h2>
            </div>
            <Tag tone="warning">{reminders.length} alerts</Tag>
          </div>
          <div className="compact-list">
            {reminders.map((reminder, index) => {
              const tenant = tenants.find((item) => item.name === reminder.name);
              return (
                <div className="compact-row action" key={`${reminder.name}-${index}`}>
                  <Avatar name={reminder.name} size="sm" />
                  <div>
                    <strong>{reminder.name}</strong>
                    <p>{reminder.message}</p>
                  </div>
                  {tenant && <Button tone="warning" icon="messageSquare" onClick={() => sendSMS(tenant._id, tenant.phone)}>Send</Button>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="surface">
        <div className="section-head">
          <div>
            <p className="eyebrow">Individual</p>
            <h2>Tenant messages</h2>
          </div>
        </div>
        {!tenants.length ? (
          <EmptyState icon="user" title="No tenants yet" />
        ) : (
          <div className="message-list">
            {tenants.map((tenant) => (
              <div className="message-row" key={tenant._id}>
                <Avatar name={tenant.name} size="sm" />
                <div>
                  <strong>{tenant.name}</strong>
                  <p>{tenant.phone}</p>
                </div>
                <input
                  className="input"
                  value={smsMsg[tenant._id] || ''}
                  onChange={(event) => setSmsMsg((current) => ({ ...current, [tenant._id]: event.target.value }))}
                  placeholder="Custom message"
                />
                <Button tone="warning" icon="messageSquare" onClick={() => sendSMS(tenant._id, tenant.phone)} disabled={smsBusy[tenant._id]}>
                  {smsBusy[tenant._id] ? 'Sending' : 'Send'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function TwoFactorSettings({ request, authHeaders, show }) {
  const [enabled, setEnabled] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [disableToken, setDisableToken] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    request('/api/2fa/status', { headers: authHeaders() }, true).then((data) => {
      if (alive) setEnabled(Boolean(data?.enabled));
    });
    return () => {
      alive = false;
    };
  }, [request, authHeaders]);

  const setup = async () => {
    setLoading(true);
    const data = await request('/api/2fa/setup', { method: 'POST', headers: authHeaders() });
    setLoading(false);
    if (data?.qrCode) {
      setQrCode(data.qrCode);
      setSecret(data.secret || '');
    }
  };

  const enable = async () => {
    if (!verifyToken) {
      show('Enter the 6-digit code', 'error');
      return;
    }
    setLoading(true);
    const data = await request('/api/2fa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ token: verifyToken })
    });
    setLoading(false);
    if (data) {
      setEnabled(true);
      setQrCode('');
      setSecret('');
      setVerifyToken('');
      show('Two-factor authentication enabled', 'success');
    }
  };

  const disable = async () => {
    if (!disableToken) {
      show('Enter your current 2FA code', 'error');
      return;
    }
    setLoading(true);
    const data = await request('/api/2fa/disable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ token: disableToken })
    });
    setLoading(false);
    if (data) {
      setEnabled(false);
      setDisableToken('');
      show('Two-factor authentication disabled', 'success');
    }
  };

  return (
    <section className="surface">
      <div className="section-head">
        <div>
          <p className="eyebrow">Security</p>
          <h2>Two-factor authentication</h2>
        </div>
        <Tag tone={enabled ? 'success' : 'warning'}>{enabled === null ? 'Checking' : enabled ? 'Enabled' : 'Off'}</Tag>
      </div>
      {enabled ? (
        <div className="form-row">
          <Field label="Authenticator code">
            <input className="input" value={disableToken} onChange={(event) => setDisableToken(event.target.value.replace(/\D/g, ''))} maxLength={6} placeholder="000000" />
          </Field>
          <Button tone="danger" icon="lock" disabled={loading} onClick={disable}>Disable 2FA</Button>
        </div>
      ) : (
        <>
          {!qrCode ? (
            <Button icon="shield" disabled={loading} onClick={setup}>{loading ? 'Preparing' : 'Set up 2FA'}</Button>
          ) : (
            <div className="two-factor-setup">
              <img src={qrCode} alt="Authenticator QR code" />
              {secret && <code>{secret}</code>}
              <div className="form-row">
                <Field label="Verification code">
                  <input className="input" value={verifyToken} onChange={(event) => setVerifyToken(event.target.value.replace(/\D/g, ''))} maxLength={6} placeholder="000000" />
                </Field>
                <Button icon="check" disabled={loading} onClick={enable}>Enable 2FA</Button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function SettingsPage({ request, authHeaders, show, ip, setLegalModal }) {
  return (
    <div className="page-stack">
      <div className="settings-grid">
        <section className="surface">
          <div className="section-head">
            <div>
              <p className="eyebrow">Access</p>
              <h2>Google account lock</h2>
            </div>
            <Tag tone="success" icon="shield">Restricted</Tag>
          </div>
          <p className="body-copy">Only {ALLOWED_GOOGLE_EMAIL} is accepted by the Google credential check before backend sign-in.</p>
        </section>
        <section className="surface">
          <div className="section-head">
            <div>
              <p className="eyebrow">Policy gate</p>
              <h2>Current network</h2>
            </div>
            <Tag tone="blue">{ip}</Tag>
          </div>
          <p className="body-copy">New public IP addresses must accept the current terms and privacy policy before the app is shown.</p>
        </section>
      </div>
      <TwoFactorSettings request={request} authHeaders={authHeaders} show={show} />
      <section className="surface">
        <div className="section-head">
          <div>
            <p className="eyebrow">Legal</p>
            <h2>Terms and privacy</h2>
          </div>
        </div>
        <div className="button-row">
          <Button tone="ghost" icon="fileText" onClick={() => setLegalModal('terms')}>Terms of Use</Button>
          <Button tone="ghost" icon="shield" onClick={() => setLegalModal('privacy')}>Privacy Policy</Button>
        </div>
      </section>
    </div>
  );
}

function DataTable({ columns, rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EditTenantModal({ tenant, setTenant, onSave, onClose }) {
  return (
    <Modal title="Edit tenant" onClose={onClose}>
      <div className="modal-form">
        <Field label="Full name">
          <input className="input" value={tenant.name || ''} onChange={(event) => setTenant((current) => ({ ...current, name: event.target.value }))} />
        </Field>
        <Field label="Phone">
          <input className="input" value={tenant.phone || ''} onChange={(event) => setTenant((current) => ({ ...current, phone: event.target.value }))} />
        </Field>
        <Field label="National ID">
          <input className="input" value={tenant.idNumber || ''} onChange={(event) => setTenant((current) => ({ ...current, idNumber: event.target.value }))} />
        </Field>
        <div className="button-row end">
          <Button tone="ghost" onClick={onClose}>Cancel</Button>
          <Button icon="save" onClick={onSave}>Save tenant</Button>
        </div>
      </div>
    </Modal>
  );
}

function EditHouseModal({ house, setHouse, onSave, onClose }) {
  return (
    <Modal title="Edit house" onClose={onClose}>
      <div className="modal-form">
        <Field label="House number">
          <input className="input" value={house.houseNumber || ''} onChange={(event) => setHouse((current) => ({ ...current, houseNumber: event.target.value }))} />
        </Field>
        <Field label="Location">
          <input className="input" value={house.location || ''} onChange={(event) => setHouse((current) => ({ ...current, location: event.target.value }))} />
        </Field>
        <Field label="Rent">
          <input className="input" type="number" value={house.rent || ''} onChange={(event) => setHouse((current) => ({ ...current, rent: event.target.value }))} />
        </Field>
        <Field label="Bedrooms">
          <select className="input" value={house.bedrooms || 1} onChange={(event) => setHouse((current) => ({ ...current, bedrooms: Number(event.target.value) }))}>
            {[1, 2, 3, 4].map((count) => <option value={count} key={count}>{count} bedroom{count > 1 ? 's' : ''}</option>)}
          </select>
        </Field>
        <div className="button-row end">
          <Button tone="ghost" onClick={onClose}>Cancel</Button>
          <Button icon="save" onClick={onSave}>Save house</Button>
        </div>
      </div>
    </Modal>
  );
}

function DeleteModal({ item, onDelete, onClose }) {
  return (
    <Modal title="Confirm delete" onClose={onClose}>
      <div className="delete-copy">
        <Icon name="alertTriangle" size={28} />
        <p>Delete <strong>{item.name}</strong>? This cannot be undone.</p>
      </div>
      <div className="button-row end">
        <Button tone="ghost" onClick={onClose}>Cancel</Button>
        <Button tone="danger" icon="trash" onClick={onDelete}>Delete</Button>
      </div>
    </Modal>
  );
}

export default function App() {
  const policy = usePolicyGate();
  const { list: toasts, show } = useToast();
  const compact = useViewport();
  const googleButtonRef = useRef(null);

  const [dark, setDark] = useState(() => localStorage.getItem('ghv-theme') === 'dark' || window.matchMedia?.('(prefers-color-scheme: dark)').matches);
  const [loggedIn, setLoggedIn] = useState(() => Boolean(getStoredToken()));
  const [welcome, setWelcome] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [verifying2FA, setVerifying2FA] = useState(false);
  const [authEmail, setAuthEmail] = useState(() => localStorage.getItem('ghv-auth-email') || ALLOWED_GOOGLE_EMAIL);

  const [houses, setHouses] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [balances, setBalances] = useState({});
  const [cashAmounts, setCashAmounts] = useState({});
  const [dash, setDash] = useState(null);
  const [payments, setPayments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [hNum, setHNum] = useState('');
  const [hLoc, setHLoc] = useState('');
  const [hRent, setHRent] = useState('');
  const [hApt, setHApt] = useState('A');
  const [hBed, setHBed] = useState(1);
  const [hType, setHType] = useState('monthly');
  const [hNightly, setHNightly] = useState('2500');
  const [tName, setTName] = useState('');
  const [tPhone, setTPhone] = useState('');
  const [tIdNumber, setTIdNumber] = useState('');
  const [tSearch, setTSearch] = useState('');
  const [hSearch, setHSearch] = useState('');
  const [hFilter, setHFilter] = useState('all');
  const [editT, setEditT] = useState(null);
  const [editH, setEditH] = useState(null);
  const [delConf, setDelConf] = useState(null);
  const [profTenant, setProfTenant] = useState(null);
  const [profPays, setProfPays] = useState([]);
  const [fromPage, setFromPage] = useState('tenants');
  const [broadcast, setBroadcast] = useState('');
  const [broadcasting, setBroadcasting] = useState(false);
  const [smsBusy, setSmsBusy] = useState({});
  const [smsMsg, setSmsMsg] = useState({});
  const now = new Date();
  const [rMonth, setRMonth] = useState(now.getMonth() + 1);
  const [rYear, setRYear] = useState(now.getFullYear());
  const [report, setReport] = useState(null);
  const [rLoading, setRLoading] = useState(false);
  const [page, setPage] = useState('dashboard');
  const [sidebar, setSidebar] = useState(() => window.innerWidth >= 980);
  const [legalModal, setLegalModal] = useState(null);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('ghv-theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    setSidebar(!compact);
  }, [compact]);

  const authHeaders = useCallback(() => {
    const token = getStoredToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const logout = useCallback((message) => {
    localStorage.removeItem('token');
    localStorage.removeItem('ghv-auth-email');
    setLoggedIn(false);
    setHouses([]);
    setTenants([]);
    setBalances({});
    setPayments([]);
    setDash(null);
    setReminders([]);
    setProfTenant(null);
    setPage('dashboard');
    if (message) show(message, 'error');
  }, [show]);

  const request = useCallback(async (path, options = {}, quiet = false) => {
    const url = path.startsWith('http') ? path : `${API}${path}`;
    try {
      const response = await fetch(url, options);
      const data = parseJson(await response.text());
      if (response.status === 401) {
        logout('Session expired. Please sign in again.');
        return null;
      }
      if (!response.ok) {
        if (!quiet) show(data?.message || 'Request failed. Please try again.', 'error');
        return null;
      }
      return data || true;
    } catch {
      if (!quiet) show('Cannot reach the server. It may still be starting.', 'error');
      return null;
    }
  }, [logout, show]);

  const loadAll = useCallback(async () => {
    if (!getStoredToken()) return;
    setLoading(true);
    const headers = authHeaders();
    const [houseData, tenantData, dashData, paymentData, reminderData] = await Promise.all([
      request('/api/houses', { headers }, true),
      request('/api/tenants', { headers }, true),
      request('/api/dashboard', { headers }, true),
      request('/api/payments', { headers }, true),
      request('/api/sms/reminders', { headers }, true)
    ]);
    const safeHouses = Array.isArray(houseData) ? houseData : [];
    const safeTenants = Array.isArray(tenantData) ? tenantData : [];
    setHouses(safeHouses);
    setTenants(safeTenants);
    setDash(dashData && typeof dashData === 'object' ? dashData : null);
    setPayments(Array.isArray(paymentData) ? paymentData : []);
    setReminders(Array.isArray(reminderData) ? reminderData : []);

    const balancePairs = await Promise.all(
      safeTenants.map(async (tenant) => {
        const balance = await request(`/api/tenants/${tenant._id}/balance`, { headers }, true);
        return [tenant._id, balance || { rent: 0, paid: 0, balance: 0 }];
      })
    );
    setBalances(Object.fromEntries(balancePairs));
    setLoading(false);
  }, [authHeaders, request]);

  useEffect(() => {
    if (loggedIn && policy.accepted) loadAll();
  }, [loggedIn, policy.accepted, loadAll]);

  const completeLogin = useCallback((data, email) => {
    if (data?.requires2FA) {
      setRequires2FA(true);
      setTempToken(data.tempToken || '');
      show('Enter your two-factor authentication code.', 'info');
      return;
    }
    if (!data?.token) {
      show('Google sign-in did not return a session token.', 'error');
      return;
    }
    localStorage.setItem('token', data.token);
    localStorage.setItem('ghv-auth-email', email);
    setAuthEmail(email);
    setWelcome(true);
    window.setTimeout(() => {
      setLoggedIn(true);
      setWelcome(false);
    }, 850);
  }, [show]);

  const handleGoogleLogin = useCallback(async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      show('Google did not return a credential.', 'error');
      return;
    }
    setGoogleBusy(true);
    try {
      const profile = decodeGoogleCredential(credentialResponse.credential);
      const email = String(profile?.email || '').toLowerCase();
      if (email !== ALLOWED_GOOGLE_EMAIL || profile?.email_verified === false) {
        show(`Only ${ALLOWED_GOOGLE_EMAIL} can sign in.`, 'error');
        setGoogleBusy(false);
        return;
      }
      const data = await request('/api/google-auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });
      if (data) completeLogin(data, email);
    } catch {
      show('Could not verify the Google credential.', 'error');
    } finally {
      setGoogleBusy(false);
    }
  }, [completeLogin, request, show]);

  useEffect(() => {
    if (!policy.accepted || loggedIn || requires2FA || !GOOGLE_CLIENT_ID) return;
    let cancelled = false;
    const renderButton = () => {
      if (cancelled || !window.google || !googleButtonRef.current) return;
      googleButtonRef.current.innerHTML = '';
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
        auto_select: false,
        cancel_on_tap_outside: true
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: dark ? 'filled_black' : 'outline',
        size: 'large',
        shape: 'rectangular',
        text: 'signin_with',
        width: Math.min(360, googleButtonRef.current.offsetWidth || 360)
      });
      setGoogleReady(true);
    };

    if (window.google?.accounts?.id) {
      renderButton();
      return () => {
        cancelled = true;
      };
    }

    const existing = document.getElementById('google-identity-services');
    if (existing) {
      existing.addEventListener('load', renderButton, { once: true });
      return () => {
        cancelled = true;
        existing.removeEventListener('load', renderButton);
      };
    }

    const script = document.createElement('script');
    script.id = 'google-identity-services';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.addEventListener('load', renderButton, { once: true });
    document.head.appendChild(script);
    return () => {
      cancelled = true;
      script.removeEventListener('load', renderButton);
    };
  }, [dark, handleGoogleLogin, loggedIn, policy.accepted, requires2FA]);

  const verify2FA = async () => {
    if (!totpCode) {
      show('Enter your 2FA code.', 'error');
      return;
    }
    setVerifying2FA(true);
    const data = await request('/api/auth/verify-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tempToken, totpCode })
    });
    setVerifying2FA(false);
    if (data?.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('ghv-auth-email', ALLOWED_GOOGLE_EMAIL);
      setRequires2FA(false);
      setTotpCode('');
      setWelcome(true);
      window.setTimeout(() => {
        setLoggedIn(true);
        setWelcome(false);
      }, 850);
    }
  };

  const nav = (target) => {
    setPage(target);
    if (compact) setSidebar(false);
  };

  const addHouse = async () => {
    if (!hNum || !hLoc || !hRent) {
      show('House number, location, and rent are required.', 'error');
      return;
    }
    const rent = Number(hRent);
    if (!rent || rent <= 0) {
      show('Enter a valid rent amount.', 'error');
      return;
    }
    const data = await request('/api/houses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({
        houseNumber: hNum,
        location: hLoc,
        rent,
        apartment: hApt,
        bedrooms: hBed,
        rentalType: hType,
        nightlyRate: hType === 'airbnb' ? Number(hNightly) : null
      })
    });
    if (data) {
      show('House added.', 'success');
      setHNum('');
      setHLoc('');
      setHRent('');
      setHBed(1);
      setHApt('A');
      setHType('monthly');
      setHNightly('2500');
      loadAll();
    }
  };

  const saveHouse = async () => {
    if (!editH) return;
    const data = await request(`/api/houses/${editH._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({
        houseNumber: editH.houseNumber,
        location: editH.location,
        rent: Number(editH.rent),
        bedrooms: Number(editH.bedrooms)
      })
    });
    if (data) {
      setEditH(null);
      show('House updated.', 'success');
      loadAll();
    }
  };

  const addTenant = async () => {
    if (!tName || !tPhone) {
      show('Tenant name and phone are required.', 'error');
      return;
    }
    const data = await request('/api/tenants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ name: tName, phone: tPhone, idNumber: tIdNumber || null })
    });
    if (data) {
      show('Tenant added.', 'success');
      setTName('');
      setTPhone('');
      setTIdNumber('');
      loadAll();
    }
  };

  const saveTenant = async () => {
    if (!editT) return;
    const data = await request(`/api/tenants/${editT._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ name: editT.name, phone: editT.phone, idNumber: editT.idNumber || null })
    });
    if (data) {
      setEditT(null);
      show('Tenant updated.', 'success');
      loadAll();
    }
  };

  const assign = async (tenantId, houseId) => {
    if (!houseId) return;
    if (houses.find((house) => String(house._id) === String(houseId))?.status === 'occupied') {
      show('That house is already occupied.', 'error');
      return;
    }
    const data = await request(`/api/tenants/${tenantId}/assign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ houseId })
    });
    if (data) {
      show('House assigned.', 'success');
      loadAll();
    }
  };

  const doDelete = async () => {
    if (!delConf) return;
    const paths = {
      tenant: `/api/tenants/${delConf.id}`,
      house: `/api/houses/${delConf.id}`,
      payment: `/api/payments/${delConf.id}`
    };
    const data = await request(paths[delConf.type], { method: 'DELETE', headers: authHeaders() });
    if (data) {
      show('Deleted.', 'success');
      setDelConf(null);
      loadAll();
    }
  };

  const cashPay = async (tenantId) => {
    const amount = Number(cashAmounts[tenantId]);
    if (!amount || amount <= 0) {
      show('Enter a valid cash amount.', 'error');
      return;
    }
    const data = await request('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ tenantId, amount, reference: `CASH-${Date.now()}` })
    });
    if (data) {
      setCashAmounts((current) => ({ ...current, [tenantId]: '' }));
      show('Cash payment recorded.', 'success');
      loadAll();
    }
  };

  const openProfile = async (tenant) => {
    setFromPage(page);
    setProfTenant(tenant);
    const allPayments = await request('/api/payments', { headers: authHeaders() }, true);
    setProfPays((Array.isArray(allPayments) ? allPayments : []).filter((payment) => String(payment.tenant?._id || payment.tenant) === String(tenant._id)));
    nav('profile');
  };

  const sendSMS = async (tenantId, phone) => {
    const message = smsMsg[tenantId] || 'Dear tenant, your rent is due. Please pay promptly. Thank you. - Gifted Hands Ventures';
    setSmsBusy((current) => ({ ...current, [tenantId]: true }));
    const data = await request('/api/sms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ phone, message })
    });
    setSmsBusy((current) => ({ ...current, [tenantId]: false }));
    if (data) show('SMS sent.', 'success');
  };

  const sendBroadcast = async () => {
    if (!broadcast.trim()) {
      show('Type a broadcast message first.', 'error');
      return;
    }
    setBroadcasting(true);
    const data = await request('/api/sms/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ message: broadcast })
    });
    setBroadcasting(false);
    if (data) {
      show(`Broadcast sent to ${data.sent || tenants.length} tenant${(data.sent || tenants.length) === 1 ? '' : 's'}.`, 'success');
      setBroadcast('');
    }
  };

  const genReport = async () => {
    setRLoading(true);
    const data = await request(`/api/reports/monthly?month=${rMonth}&year=${rYear}`, { headers: authHeaders() });
    setRLoading(false);
    if (data) setReport(data);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'barChart' },
    { id: 'houses', label: 'Houses', icon: 'home' },
    { id: 'tenants', label: 'Tenants', icon: 'users' },
    { id: 'payments', label: 'Payments', icon: 'creditCard' },
    { id: 'reports', label: 'Reports', icon: 'fileText' },
    { id: 'sms', label: 'SMS', icon: 'messageSquare' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];
  const current = navItems.find((item) => item.id === page) || navItems[0];

  const renderPage = () => {
    if (page === 'dashboard') return <DashboardPage loading={loading} dash={dash} houses={houses} tenants={tenants} payments={payments} reminders={reminders} onNavigate={nav} />;
    if (page === 'houses') return (
      <HousesPage
        houses={houses}
        hNum={hNum}
        setHNum={setHNum}
        hLoc={hLoc}
        setHLoc={setHLoc}
        hRent={hRent}
        setHRent={setHRent}
        hApt={hApt}
        setHApt={setHApt}
        hBed={hBed}
        setHBed={setHBed}
        hType={hType}
        setHType={setHType}
        hNightly={hNightly}
        setHNightly={setHNightly}
        hSearch={hSearch}
        setHSearch={setHSearch}
        hFilter={hFilter}
        setHFilter={setHFilter}
        addHouse={addHouse}
        setEditH={setEditH}
        setDelConf={setDelConf}
      />
    );
    if (page === 'tenants') return (
      <TenantsPage
        tenants={tenants}
        houses={houses}
        balances={balances}
        cashAmounts={cashAmounts}
        setCashAmounts={setCashAmounts}
        smsMsg={smsMsg}
        setSmsMsg={setSmsMsg}
        smsBusy={smsBusy}
        tName={tName}
        setTName={setTName}
        tPhone={tPhone}
        setTPhone={setTPhone}
        tIdNumber={tIdNumber}
        setTIdNumber={setTIdNumber}
        tSearch={tSearch}
        setTSearch={setTSearch}
        addTenant={addTenant}
        assign={assign}
        cashPay={cashPay}
        sendSMS={sendSMS}
        openProfile={openProfile}
        setEditT={setEditT}
        setDelConf={setDelConf}
        loading={loading}
      />
    );
    if (page === 'profile' && profTenant) return <ProfilePage tenant={profTenant} houses={houses} payments={profPays} fromPage={fromPage} nav={nav} setEditT={setEditT} setDelConf={setDelConf} sendSMS={sendSMS} />;
    if (page === 'payments') return <PaymentsPage payments={payments} setDelConf={setDelConf} />;
    if (page === 'reports') return <ReportsPage rMonth={rMonth} setRMonth={setRMonth} rYear={rYear} setRYear={setRYear} report={report} rLoading={rLoading} genReport={genReport} />;
    if (page === 'sms') return <SmsPage tenants={tenants} reminders={reminders} broadcast={broadcast} setBroadcast={setBroadcast} broadcasting={broadcasting} sendBroadcast={sendBroadcast} smsMsg={smsMsg} setSmsMsg={setSmsMsg} smsBusy={smsBusy} sendSMS={sendSMS} />;
    if (page === 'settings') return <SettingsPage request={request} authHeaders={authHeaders} show={show} ip={policy.ip} setLegalModal={setLegalModal} />;
    return <DashboardPage loading={loading} dash={dash} houses={houses} tenants={tenants} payments={payments} reminders={reminders} onNavigate={nav} />;
  };

  if (!policy.ready || !policy.accepted) {
    return <PolicyGate ready={policy.ready} ip={policy.ip} onAccept={policy.accept} />;
  }

  if (!loggedIn) {
    return (
      <>
        <Toasts list={toasts} />
        <LoginScreen
          dark={dark}
          onTheme={() => setDark((value) => !value)}
          welcome={welcome}
          requires2FA={requires2FA}
          totpCode={totpCode}
          setTotpCode={setTotpCode}
          verify2FA={verify2FA}
          verifying2FA={verifying2FA}
          cancel2FA={() => { setRequires2FA(false); setTotpCode(''); }}
          googleButtonRef={googleButtonRef}
          googleBusy={googleBusy}
          googleReady={googleReady}
          setLegalModal={setLegalModal}
        />
        {legalModal && (
          <Modal title={legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Use'} onClose={() => setLegalModal(null)} size="lg">
            <LegalCopy type={legalModal} />
          </Modal>
        )}
      </>
    );
  }

  return (
    <>
      <ParticleField />
      <Toasts list={toasts} />
      {editT && <EditTenantModal tenant={editT} setTenant={setEditT} onSave={saveTenant} onClose={() => setEditT(null)} />}
      {editH && <EditHouseModal house={editH} setHouse={setEditH} onSave={saveHouse} onClose={() => setEditH(null)} />}
      {delConf && <DeleteModal item={delConf} onDelete={doDelete} onClose={() => setDelConf(null)} />}
      {legalModal && (
        <Modal title={legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Use'} onClose={() => setLegalModal(null)} size="lg">
          <LegalCopy type={legalModal} />
        </Modal>
      )}
      <div className="app-shell">
        {compact && sidebar && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setSidebar(false)} />}
        <aside className={cx('sidebar', sidebar && 'open')}>
          <div className="sidebar-brand">
            <span className="brand-mark"><Icon name="building" size={23} /></span>
            <div>
              <strong>Gifted Hands</strong>
              <small>Rental OS</small>
            </div>
          </div>
          <div className="owner-chip">
            <Avatar name={ADMIN_NAME} size="sm" />
            <div>
              <span>{ADMIN_NAME}</span>
              <small>{authEmail}</small>
            </div>
          </div>
          <nav className="nav-list" aria-label="Main navigation">
            {navItems.map((item) => (
              <button key={item.id} className={page === item.id ? 'active' : ''} onClick={() => nav(item.id)}>
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
                {item.id === 'sms' && reminders.length > 0 && <em>{reminders.length}</em>}
              </button>
            ))}
          </nav>
          <button className="logout-button" onClick={() => logout()}>
            <Icon name="logOut" size={18} />
            <span>Sign out</span>
          </button>
        </aside>

        <main className="main-area">
          <header className="topbar">
            <div className="topbar-left">
              <IconButton icon="menu" label="Toggle navigation" onClick={() => setSidebar((value) => !value)} />
              <div>
                <h1><Icon name={current.icon} size={20} /> {page === 'profile' && profTenant ? profTenant.name : current.label}</h1>
                <p>{new Date().toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="topbar-actions">
              {reminders.length > 0 && <Tag tone="warning" icon="alertTriangle">{reminders.length}</Tag>}
              <IconButton icon="refresh" label="Refresh data" onClick={loadAll} />
              <IconButton icon={dark ? 'sun' : 'moon'} label="Toggle theme" onClick={() => setDark((value) => !value)} />
              <Avatar name={ADMIN_NAME} size="sm" />
            </div>
          </header>
          <section className="page-content">{renderPage()}</section>
        </main>
      </div>
      <Analytics />
    </>
  );
}
