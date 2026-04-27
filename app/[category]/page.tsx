import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticlesByCategory } from '@/lib/db/mock';
import { ArticleCard } from '@/components/home/ArticleCard';
import { CATEGORIES, Category } from '@/types';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

const categoryNames: Record<Category, string> = {
  'tecnologia': 'Tecnologia',
  'intelligenza-artificiale': 'Intelligenza Artificiale',
  'business-finanza': 'Business & Finanza',
  'crypto': 'Crypto',
  'attualita': 'Attualità',
  'salute': 'Salute',
  'sport': 'Sport',
};

const categoryDescriptions: Record<Category, string> = {
  'tecnologia': 'Ultime notizie su tecnologia, innovazione, software e hardware. Scopri le novità dal mondo tech.',
  'intelligenza-artificiale': 'Notizie su AI, machine learning, deep learning e chatbot. Il futuro dell\'intelligenza artificiale.',
  'business-finanza': 'News su economia, mercati finanziari, aziende e imprenditoria. Analisi e trend di business.',
  'crypto': 'Tutto sulle criptovalute, bitcoin, ethereum, blockchain e DeFi. Aggiornamenti dal mondo crypto.',
  'attualita': 'Le notizie più importanti del giorno. Cronaca, politica e eventi dall\'Italia e dal mondo.',
  'salute': 'Notizie su salute, medicina, benessere e lifestyle. Consigli per una vita sana.',
  'sport': 'News sportive, risultati, calciomercato e approfondimenti su tutte le discipline.',
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = params.category as Category;
  
  if (!categoryNames[category]) {
    return {
      title: 'Categoria non trovata',
    };
  }

  const siteUrl = process.env.SITE_URL || 'https://yoursite.com';

  return {
    title: `${categoryNames[category]} - Ultime Notizie`,
    description: categoryDescriptions[category],
    openGraph: {
      title: `${categoryNames[category]} - Ultime Notizie`,
      description: categoryDescriptions[category],
      type: 'website',
      url: `${siteUrl}/${category}`,
    },
    alternates: {
      canonical: `${siteUrl}/${category}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = params.category as Category;

  if (!categoryNames[category]) {
    notFound();
  }

  const categoryData = CATEGORIES.find(c => c.id === category);
  const articles = await getArticlesByCategory(category, 24);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div 
            className="w-4 h-12 rounded"
            style={{ backgroundColor: categoryData?.color || '#3b82f6' }}
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {categoryNames[category]}
            </h1>
            <p className="text-gray-600 mt-2">
              {categoryDescriptions[category]}
            </p>
          </div>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Nessun articolo disponibile
          </h2>
          <p className="text-gray-600">
            Non ci sono ancora articoli in questa categoria. Torna a trovarci presto!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="default" />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 text-sm">
              Visualizzati {articles.length} articoli in {categoryNames[category]}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
