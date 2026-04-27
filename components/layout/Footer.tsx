import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/types';

export function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'NewsITA';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <Image
                src="/newsITA.jpg"
                alt={siteName}
                width={36}
                height={36}
                className="rounded-lg object-cover"
              />
              <span className="text-xl font-bold">{siteName}</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Le ultime notizie aggiornate in tempo reale. Contenuti unici e originali su tecnologia, business, crypto e molto altro.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Categorie</h3>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/${cat.id}`}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Informazioni</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Chi Siamo
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Termini di Servizio
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Contatti
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Seguici</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 00-2.163-2.723c-.951-.538-2.106-.657-3.093-.341a4.92 4.92 0 00-2.933 2.51c-.213.452-.284.95-.206 1.437a10.006 10.006 0 01-7.277-3.702 4.978 4.978 0 00-.688 2.503c0 1.744.89 3.282 2.239 4.18a4.92 4.92 0 01-2.24-.62v.062a4.968 4.968 0 003.978 4.87 4.925 4.925 0 01-2.24.085 4.935 4.935 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} {siteName}. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
}
