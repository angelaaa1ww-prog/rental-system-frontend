import React from 'react';

const BRAND_PATH = '/brand';

export function BrandLogo({ tone = 'light', className = '', compact = false, alt = 'RentalFlow Pro' }) {
  const asset = compact
    ? `${BRAND_PATH}/rentalflow-mark.svg`
    : `${BRAND_PATH}/rentalflow-logo${tone === 'dark' ? '-dark' : ''}.svg`;

  return <img className={`brand-logo ${compact ? 'brand-logo--mark' : 'brand-logo--full'} ${className}`.trim()} src={asset} alt={alt} />;
}

export function BrandMark({ className = '', alt = 'RentalFlow Pro' }) {
  return <BrandLogo compact className={className} alt={alt} />;
}

export function LoadingScreen() {
  return (
    <main className="app-loading" aria-live="polite" aria-label="Loading RentalFlow Pro">
      <BrandLogo className="app-loading-logo" />
      <span className="app-loading-indicator" aria-hidden="true" />
      <p>Preparing your workspace</p>
    </main>
  );
}