import React, { useState } from 'react';

export function TermsAndPrivacyModal({ onAccept, isOpen }) {
  const [activeTab, setActiveTab] = useState('terms');
  const [accepted, setAccepted] = useState(false);

  if (!isOpen) return null;

  const TermsContent = () => (
    <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '0.75rem', fontSize: '0.9rem' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--ink)' }}>
        Terms of Use
      </h2>
      <div style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
        <h3 style={{ fontSize: '1rem', marginTop: '1.25rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>1. Agreement to Terms</h3>
        <p>
          By accessing and using this Rental Management System, you accept and agree to be bound
          by the terms and provision of this agreement.
        </p>

        <h3 style={{ fontSize: '1rem', marginTop: '1.25rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>2. Use License</h3>
        <p>
          Permission is granted to temporarily download one copy of the materials (information or
          software) on the Rental Management System for personal, non-commercial transitory viewing
          only. This is the grant of a license, not a transfer of title.
        </p>

        <h3 style={{ fontSize: '1rem', marginTop: '1.25rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>3. Disclaimer</h3>
        <p>
          The materials on the Rental Management System are provided on an 'as is' basis. We make
          no warranties, expressed or implied, and hereby disclaim and negate all other warranties
          including, without limitation, implied warranties or conditions of merchantability,
          fitness for a particular purpose, or non-infringement of intellectual property or other
          violation of rights.
        </p>

        <h3 style={{ fontSize: '1rem', marginTop: '1.25rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>4. Limitations</h3>
        <p>
          In no event shall the Rental Management System or its suppliers be liable for any damages
          (including, without limitation, damages for loss of data or profit, or due to business
          interruption) arising out of the use or inability to use the materials on the Rental
          Management System.
        </p>

        <h3 style={{ fontSize: '1rem', marginTop: '1.25rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>5. Modifications</h3>
        <p>
          We may revise these terms of use for the Rental Management System at any time without
          notice. By using this system, you are agreeing to be bound by the then current version of
          these terms of use.
        </p>

        <h3 style={{ fontSize: '1rem', marginTop: '1.25rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>6. Governing Law</h3>
        <p>
          These terms and conditions are governed by and construed in accordance with the laws of
          Kenya, and you irrevocably submit to the exclusive jurisdiction of the courts located in
          Nairobi, Kenya.
        </p>
      </div>
    </div>
  );

  const PrivacyContent = () => (
    <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '0.75rem', fontSize: '0.9rem' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--ink)' }}>
        Privacy Policy
      </h2>
      <div style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
        <h3 style={{ fontSize: '1rem', marginTop: '1.25rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>1. Data Collection</h3>
        <p>
          We collect information you provide directly to us, such as when you create an account,
          including name, email address, phone number, and payment information.
        </p>

        <h3 style={{ fontSize: '1rem', marginTop: '1.25rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>2. Use of Information</h3>
        <p>
          We use the information we collect to provide, maintain, and improve our rental management
          services, process transactions, and send you technical notices and support messages.
        </p>

        <h3 style={{ fontSize: '1rem', marginTop: '1.25rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>3. IP Address Tracking</h3>
        <p>
          For security purposes, we track IP addresses on first login. This helps us identify
          unauthorized access attempts and protect your account. Your IP information is encrypted
          and securely stored.
        </p>

        <h3 style={{ fontSize: '1rem', marginTop: '1.25rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>4. Data Security</h3>
        <p>
          We implement appropriate technical and organizational measures to protect your personal
          data against unauthorized access, alteration, disclosure, or destruction.
        </p>

        <h3 style={{ fontSize: '1rem', marginTop: '1.25rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>5. Third-Party Sharing</h3>
        <p>
          We do not share your personal data with third parties without your explicit consent,
          except as required by law or to provide services you request.
        </p>

        <h3 style={{ fontSize: '1rem', marginTop: '1.25rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>6. Your Rights</h3>
        <p>
          You have the right to access, correct, update, or request deletion of your personal data
          at any time by contacting our support team.
        </p>

        <h3 style={{ fontSize: '1rem', marginTop: '1.25rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>7. Changes to Privacy Policy</h3>
        <p>
          We may update this privacy policy from time to time. We will notify you of any changes by
          posting the new privacy policy on this page and updating the "Last Updated" date.
        </p>

        <p style={{ marginTop: '1.5rem', fontStyle: 'italic', fontSize: '0.8rem' }}>
          Last Updated: July 7, 2026
        </p>
      </div>
    </div>
  );

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
          width: '90%',
          maxWidth: '560px',
          boxShadow: 'var(--shadow-lg)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}
      >
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--line)' }}>
          <button
            onClick={() => setActiveTab('terms')}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: 'none',
              borderRadius: 0,
              color: activeTab === 'terms' ? 'var(--primary)' : 'var(--muted)',
              borderBottom: activeTab === 'terms' ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.95rem',
              transition: 'color 0.15s ease',
              minHeight: 'auto'
            }}
          >
            Terms of Use
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: 'none',
              borderRadius: 0,
              color: activeTab === 'privacy' ? 'var(--primary)' : 'var(--muted)',
              borderBottom: activeTab === 'privacy' ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.95rem',
              transition: 'color 0.15s ease',
              minHeight: 'auto'
            }}
          >
            Privacy Policy
          </button>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'terms' ? <TermsContent /> : <PrivacyContent />}
        </div>

        {/* Checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input
            type="checkbox"
            id="accept-terms"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            style={{
              width: '1.1rem',
              height: '1.1rem',
              cursor: 'pointer',
              accentColor: 'var(--primary)',
            }}
          />
          <label htmlFor="accept-terms" style={{ cursor: 'pointer', color: 'var(--muted)', fontSize: '0.9rem', userSelect: 'none' }}>
            I agree to the Terms of Use and Privacy Policy
          </label>
        </div>

        {/* Button */}
        <button
          onClick={() => accepted && onAccept()}
          disabled={!accepted}
          className={accepted ? "btn-primary" : "btn-outline"}
          style={{
            width: '100%',
            padding: '0.75rem',
            minHeight: '40px',
            fontSize: '0.95rem',
            opacity: accepted ? 1 : 0.5
          }}
        >
          Accept & Continue
        </button>
      </div>
    </div>
  );
}
