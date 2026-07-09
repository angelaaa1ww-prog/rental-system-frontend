import React, { useState } from 'react';
import { modernTheme } from '../theme-modern';

const T = modernTheme;

export function TermsAndPrivacyModal({ onAccept, isOpen }) {
  const [activeTab, setActiveTab] = useState('terms');
  const [accepted, setAccepted] = useState(false);

  if (!isOpen) return null;

  const TermsContent = () => (
    <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: T.colors.text.primary }}>
        Terms of Use
      </h2>
      <div style={{ color: T.colors.text.secondary, lineHeight: '1.8' }}>
        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>1. Agreement to Terms</h3>
        <p>
          By accessing and using this Rental Management System, you accept and agree to be bound
          by the terms and provision of this agreement.
        </p>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. Use License</h3>
        <p>
          Permission is granted to temporarily download one copy of the materials (information or
          software) on the Rental Management System for personal, non-commercial transitory viewing
          only. This is the grant of a license, not a transfer of title.
        </p>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. Disclaimer</h3>
        <p>
          The materials on the Rental Management System are provided on an 'as is' basis. We make
          no warranties, expressed or implied, and hereby disclaim and negate all other warranties
          including, without limitation, implied warranties or conditions of merchantability,
          fitness for a particular purpose, or non-infringement of intellectual property or other
          violation of rights.
        </p>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>4. Limitations</h3>
        <p>
          In no event shall the Rental Management System or its suppliers be liable for any damages
          (including, without limitation, damages for loss of data or profit, or due to business
          interruption) arising out of the use or inability to use the materials on the Rental
          Management System.
        </p>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>5. Modifications</h3>
        <p>
          We may revise these terms of use for the Rental Management System at any time without
          notice. By using this system, you are agreeing to be bound by the then current version of
          these terms of use.
        </p>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>6. Governing Law</h3>
        <p>
          These terms and conditions are governed by and construed in accordance with the laws of
          Kenya, and you irrevocably submit to the exclusive jurisdiction of the courts located in
          Nairobi, Kenya.
        </p>
      </div>
    </div>
  );

  const PrivacyContent = () => (
    <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: T.colors.text.primary }}>
        Privacy Policy
      </h2>
      <div style={{ color: T.colors.text.secondary, lineHeight: '1.8' }}>
        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>1. Data Collection</h3>
        <p>
          We collect information you provide directly to us, such as when you create an account,
          including name, email address, phone number, and payment information.
        </p>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>2. Use of Information</h3>
        <p>
          We use the information we collect to provide, maintain, and improve our rental management
          services, process transactions, and send you technical notices and support messages.
        </p>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>3. IP Address Tracking</h3>
        <p>
          For security purposes, we track IP addresses on first login. This helps us identify
          unauthorized access attempts and protect your account. Your IP information is encrypted
          and securely stored.
        </p>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>4. Data Security</h3>
        <p>
          We implement appropriate technical and organizational measures to protect your personal
          data against unauthorized access, alteration, disclosure, or destruction.
        </p>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>5. Third-Party Sharing</h3>
        <p>
          We do not share your personal data with third parties without your explicit consent,
          except as required by law or to provide services you request.
        </p>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>6. Your Rights</h3>
        <p>
          You have the right to access, correct, update, or request deletion of your personal data
          at any time by contacting our support team.
        </p>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>7. Changes to Privacy Policy</h3>
        <p>
          We may update this privacy policy from time to time. We will notify you of any changes by
          posting the new privacy policy on this page and updating the "Last Updated" date.
        </p>

        <p style={{ marginTop: '2rem', fontStyle: 'italic' }}>
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
        background: T.colors.dark.overlay,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          background: T.colors.dark.surface,
          borderRadius: T.borderRadius['2xl'],
          border: `1px solid ${T.colors.dark.border}`,
          width: '90%',
          maxWidth: '600px',
          boxShadow: T.shadows.xl,
          padding: '2rem',
        }}
      >
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: `1px solid ${T.colors.dark.border}` }}>
          <button
            onClick={() => setActiveTab('terms')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: 'none',
              color: activeTab === 'terms' ? T.colors.primary[400] : T.colors.text.secondary,
              borderBottom: activeTab === 'terms' ? `2px solid ${T.colors.primary[400]}` : 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem',
              transition: `all ${T.transitions.fast}`,
            }}
          >
            Terms of Use
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: 'none',
              color: activeTab === 'privacy' ? T.colors.primary[400] : T.colors.text.secondary,
              borderBottom: activeTab === 'privacy' ? `2px solid ${T.colors.primary[400]}` : 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem',
              transition: `all ${T.transitions.fast}`,
            }}
          >
            Privacy Policy
          </button>
        </div>

        {/* Content */}
        <div style={{ marginBottom: '2rem' }}>
          {activeTab === 'terms' ? <TermsContent /> : <PrivacyContent />}
        </div>

        {/* Checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <input
            type="checkbox"
            id="accept-terms"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            style={{
              width: '1.25rem',
              height: '1.25rem',
              cursor: 'pointer',
              accentColor: T.colors.primary[500],
            }}
          />
          <label htmlFor="accept-terms" style={{ cursor: 'pointer', color: T.colors.text.secondary }}>
            I agree to the Terms of Use and Privacy Policy
          </label>
        </div>

        {/* Button */}
        <button
          onClick={() => accepted && onAccept()}
          disabled={!accepted}
          style={{
            width: '100%',
            padding: '1rem',
            background: accepted ? T.colors.gradients.primaryGradient : T.colors.dark.border,
            color: 'white',
            border: 'none',
            borderRadius: T.borderRadius.lg,
            fontWeight: 600,
            fontSize: '1rem',
            cursor: accepted ? 'pointer' : 'not-allowed',
            opacity: accepted ? 1 : 0.5,
            transition: `all ${T.transitions.fast}`,
            boxShadow: accepted ? T.shadows.lg : 'none',
          }}
          onMouseEnter={(e) => {
            if (accepted) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = T.shadows.xl;
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = T.shadows.lg;
          }}
        >
          Accept & Continue
        </button>
      </div>
    </div>
  );
}
