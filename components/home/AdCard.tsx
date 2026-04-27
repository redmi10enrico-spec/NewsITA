'use client';

import { useEffect, useRef, useState } from 'react';

interface AdCardProps {
  adSlot: string;
}

export function AdCard({ adSlot }: AdCardProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Push the ad to Google AdSense
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        (window as any).adsbygoogle.push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  // Don't render ad during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <article className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-yellow-400 relative">
        <div className="absolute top-2 right-2 z-10">
          <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold uppercase tracking-wider rounded">
            Pubblicità
          </span>
        </div>
        <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-100">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <span className="text-yellow-800 font-medium text-sm">Sponsorizzato</span>
          </div>
        </div>
        <div className="p-4 min-h-[250px] flex items-center justify-center bg-gray-50">
          <span className="text-gray-400 text-sm">Caricamento pubblicità...</span>
        </div>
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Google AdSense</span>
            <span>Promozione</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-yellow-400 relative">
      {/* Badge Pubblicità */}
      <div className="absolute top-2 right-2 z-10">
        <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold uppercase tracking-wider rounded">
          Pubblicità
        </span>
      </div>
      
      {/* Header con icona */}
      <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-100">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <span className="text-yellow-800 font-medium text-sm">Sponsorizzato</span>
        </div>
      </div>
      
      {/* Contenuto dell'annuncio AdSense */}
      <div className="p-4 min-h-[250px] flex items-center justify-center">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '250px' }}
          data-ad-client="ca-pub-1568576206964158"
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
          suppressHydrationWarning
        />
      </div>
      
      {/* Footer stile notizia */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Google AdSense</span>
          <span>Promozione</span>
        </div>
      </div>
    </article>
  );
}
