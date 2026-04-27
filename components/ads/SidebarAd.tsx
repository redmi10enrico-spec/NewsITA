'use client';

import { useEffect, useRef, useState } from 'react';

interface SidebarAdProps {
  adSlot?: string;
}

export function SidebarAd({ adSlot = 'sidebar-ad' }: SidebarAdProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        (window as any).adsbygoogle.push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 sticky top-24">
        <div className="p-3 bg-gray-50 border-b border-gray-100">
          <span className="text-xs text-gray-400 font-medium">Pubblicità</span>
        </div>
        <div className="p-4 min-h-[250px] flex items-center justify-center">
          <span className="text-gray-300 text-sm">Caricamento...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 sticky top-24">
      <div className="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-400 font-medium">Pubblicità</span>
        <span className="text-[10px] text-gray-300">Ad</span>
      </div>
      <div className="p-4">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '250px' }}
          data-ad-client="ca-pub-1568576206964158"
          data-ad-slot={adSlot}
          data-ad-format="rectangle"
          data-full-width-responsive="false"
          suppressHydrationWarning
        />
      </div>
    </div>
  );
}
