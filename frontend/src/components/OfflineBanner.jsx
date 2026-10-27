import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-amber-600 text-white px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-2 shadow-sm sticky top-0 z-50">
      <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
      <span>
        आप अभी ऑफ़लाइन हैं (Offline Mode Active) — अभ्यास और मुख्य सामग्री सुरक्षित रूप से उपलब्ध है।
      </span>
    </div>
  );
};
