'use client';

import { useEffect, useRef, useState } from 'react';

interface BottomBannerAdProps {
  adSlot?: string;
}

export function BottomBannerAd({ adSlot = 'bottom-banner' }: BottomBannerAdProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

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

  if (!isVisible) return null;

  if (!mounted) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] z-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex-1 min-h-[90px] flex items-center justify-center">
            <span className="text-gray-300 text-sm">Caricamento pubblicità...</span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Chiudi pubblicità"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] z-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex-1">
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', height: '90px' }}
            data-ad-client="ca-pub-1568576206964158"
            data-ad-slot={adSlot}
            data-ad-format="horizontal"
            data-full-width-responsive="true"
            suppressHydrationWarning
          />
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          aria-label="Chiudi pubblicità"
        >
          <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
