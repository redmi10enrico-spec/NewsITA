import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Informativa sulla privacy di NewsITA. Scopri come proteggiamo i tuoi dati personali.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
        Privacy Policy
      </h1>

      <div className="prose prose-lg max-w-none text-gray-700">
        <p className="mb-6">
          La presente Privacy Policy descrive come raccogliamo, utilizziamo e proteggiamo 
          le informazioni personali degli utenti del nostro sito web.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Raccolta delle Informazioni
        </h2>
        <p className="mb-4">
          Raccogliamo informazioni quando visiti il nostro sito, ti iscrivi alla nostra 
          newsletter o interagisci con i nostri contenuti. Le informazioni raccolte possono includere:
        </p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>Nome e indirizzo email (solo per iscrizione newsletter)</li>
          <li>Indirizzo IP e informazioni sul browser</li>
          <li>Pagine visitate e tempo di permanenza</li>
          <li>Preferenze di navigazione</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Utilizzo delle Informazioni
        </h2>
        <p className="mb-4">
          Le informazioni raccolte vengono utilizzate per:
        </p>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>Personalizzare l&apos;esperienza dell&apos;utente</li>
          <li>Migliorare il nostro sito web</li>
          <li>Inviare newsletter periodiche (solo con consenso)</li>
          <li>Analizzare il traffico e l&apos;utilizzo del sito</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Protezione dei Dati
        </h2>
        <p className="mb-6">
          Adottiamo misure di sicurezza appropriate per proteggere le informazioni personali 
          degli utenti. Utilizziamo connessioni crittografate (SSL) e i dati sono archiviati 
          su server sicuri.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Cookie
        </h2>
        <p className="mb-6">
          Il nostro sito utilizza cookie per migliorare l&apos;esperienza di navigazione. 
          I cookie sono piccoli file di testo memorizzati sul tuo dispositivo. 
          Puoi disabilitare i cookie dalle impostazioni del tuo browser.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Terze Parti
        </h2>
        <p className="mb-6">
          Non vendiamo, scambiamo o trasferiamo a terze parti le informazioni personali 
          degli utenti. Ciò non include partner di hosting del sito web e altre parti 
          che assistono nell&apos;operazione del sito, nella conduzione della nostra attività 
          o nel servizio ai nostri utenti.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Consenso
        </h2>
        <p className="mb-6">
          Utilizzando il nostro sito, acconsenti alla nostra Privacy Policy.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Modifiche alla Privacy Policy
        </h2>
        <p className="mb-6">
          Ci riserviamo il diritto di aggiornare questa Privacy Policy in qualsiasi momento. 
          Ti invitiamo a consultare periodicamente questa pagina per eventuali modifiche.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Contatti
        </h2>
        <p className="mb-6">
          Per domande o dubbi sulla nostra Privacy Policy, contattaci all&apos;indirizzo:{' '}
          <a href="mailto:privacy@newsita.com" className="text-blue-600 hover:text-blue-800">
            privacy@newsita.com
          </a>
        </p>

        <p className="text-sm text-gray-500 mt-8">
          Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
        </p>
      </div>
    </div>
  );
}
