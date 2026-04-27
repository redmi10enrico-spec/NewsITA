import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

const siteName = process.env.SITE_NAME || 'NewsITA';
const siteUrl = process.env.SITE_URL || 'https://yoursite.com';

export const metadata: Metadata = {
  title: {
    default: `${siteName} - Ultime Notizie in Tempo Reale`,
    template: `%s | ${siteName}`,
  },
  description: 'Notizie aggiornate ogni giorno. Tecnologia, Intelligenza Artificiale, Business, Crypto, Attualità, Salute e Sport. Contenuti unici e originali.',
  keywords: ['notizie', 'news', 'ultime notizie', 'tecnologia', 'intelligenza artificiale', 'business', 'crypto', 'attualità', 'salute', 'sport'],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} - Ultime Notizie in Tempo Reale`,
    description: 'Notizie aggiornate ogni giorno. Tecnologia, Intelligenza Artificiale, Business, Crypto, Attualità, Salute e Sport.',
    images: [
      {
        url: `${siteUrl}/newsITA.jpg`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - Ultime Notizie`,
    description: 'Notizie aggiornate ogni giorno. Contenuti unici e originali.',
    images: [`${siteUrl}/newsITA.jpg`],
  },
  icons: {
    icon: [
      { url: '/newsITA.jpg', sizes: '32x32', type: 'image/jpeg' },
      { url: '/newsITA.jpg', sizes: '16x16', type: 'image/jpeg' },
    ],
    apple: [
      { url: '/newsITA.jpg', sizes: '180x180', type: 'image/jpeg' },
    ],
    shortcut: '/newsITA.jpg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1568576206964158"
          crossOrigin="anonymous"></script>
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
