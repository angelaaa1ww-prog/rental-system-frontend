import React, { useState, useEffect } from 'react';
import { Icon as AppIcon } from './ui';

export function OfflineBanner({ onReconnect }) {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [wasOffline, setWasOffline] = useState(false);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowRestored(true);
        if (onReconnect) onReconnect();
        setTimeout(() => setShowRestored(false), 4000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setShowRestored(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline, onReconnect]);

  if (isOnline && !showRestored) {
    return null;
  }

  return (
    <div className={`network-banner ${!isOnline ? 'offline' : 'restored'}`} role="status">
      <div className="network-banner-content">
        <AppIcon name={!isOnline ? 'alertTriangle' : 'checkCircle'} size={18} />
        <span>
          {!isOnline
            ? 'No internet connection — Working offline. Data will sync when reconnected.'
            : 'Connection restored — Re-syncing your workspace...'}
        </span>
        {!isOnline && onReconnect && (
          <button type="button" className="network-retry-btn" onClick={onReconnect}>
            Retry Sync
          </button>
        )}
      </div>
    </div>
  );
}
