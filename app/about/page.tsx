import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chi Siamo',
  description: 'Scopri NewsITA: il portale di notizie completamente automatico con contenuti unici ottimizzati SEO.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
        Chi Siamo
      </h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-700 mb-6">
          Benvenuto su NewsITA, il portale di notizie completamente automatico che ti offre 
          contenuti unici e originali, aggiornati ogni giorno. Il nostro sistema avanzato 
          recupera le ultime notizie da fonti affidabili e le riscrive in modo completamente 
          originale, garantendo contenuti SEO-ottimizzati e pronti per essere indicizzati 
          sui motori di ricerca.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Come Funziona
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">1. Raccolta</h3>
            <p className="text-gray-600 text-sm">
              Il nostro sistema monitora continuamente le principali fonti di notizie 
              in tempo reale.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">2. Riscrittura</h3>
            <p className="text-gray-600 text-sm">
              Ogni articolo viene riscritto completamente utilizzando intelligenza 
              artificiale avanzata.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">3. Pubblicazione</h3>
            <p className="text-gray-600 text-sm">
              Gli articoli ottimizzati SEO vengono pubblicati automaticamente 
              sul nostro portale.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Le Nostre Categorie
        </h2>
        
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            { name: 'Tecnologia', desc: 'Innovazioni tech, software e hardware' },
            { name: 'Intelligenza Artificiale', desc: 'AI, machine learning e chatbot' },
            { name: 'Business & Finanza', desc: 'Economia, mercati e aziende' },
            { name: 'Crypto', desc: 'Bitcoin, Ethereum e blockchain' },
            { name: 'Attualità', desc: 'Notizie di cronaca e politica' },
            { name: 'Salute', desc: 'Medicina, benessere e lifestyle' },
            { name: 'Sport', desc: 'Calcio, basket e tutti gli sport' },
          ].map((cat) => (
            <li key={cat.name} className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <span className="font-semibold text-gray-900">{cat.name}</span>
                <p className="text-gray-600 text-sm">{cat.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Perché Scegliere NewsITA
        </h2>
        
        <ul className="space-y-3 mb-8">
          <li className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-700"><strong>Contenuti 100% Unici:</strong> Ogni articolo è riscritto completamente, non copiato.</span>
          </li>
          <li className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-700"><strong>Aggiornamento Automatico:</strong> Nuove notizie ogni 6 ore, 24/7.</span>
          </li>
          <li className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-700"><strong>Ottimizzato SEO:</strong> Meta tag, slug e struttura ottimizzati per Google.</span>
          </li>
          <li className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-700"><strong>Gratuito:</strong> Accesso completo a tutti i contenuti senza registrazione.</span>
          </li>
        </ul>

        <div className="bg-gray-100 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Contatti
          </h2>
          <p className="text-gray-700 mb-4">
            Per informazioni, collaborazioni o segnalazioni, contattaci all&apos;indirizzo email:
          </p>
          <a 
            href="mailto:info@newsita.com" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            info@newsita.com
          </a>
        </div>
      </div>
    </div>
  );
}
