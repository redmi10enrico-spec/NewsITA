import { Metadata } from 'next';
import { fetchAllCategoriesNews } from '@/lib/news/fetcher';
import { getLatestArticles, getArticlesCount } from '@/lib/db';
import { NewsList } from '@/components/home/NewsList';
import { SidebarAd } from '@/components/ads/SidebarAd';
import { BottomBannerAd } from '@/components/ads/BottomBannerAd';
import { CATEGORIES } from '@/types';

export const metadata: Metadata = {
  title: 'Ultime Notizie in Tempo Reale',
  description: 'Notizie italiane aggiornate in tempo reale. Tecnologia, Intelligenza Artificiale, Business, Crypto, Attualità, Salute e Sport.',
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const articleCount = await getArticlesCount();
  
  if (articleCount < 30) {
    console.log(`Database has ${articleCount} articles, fetching more...`);
    await fetchAllCategoriesNews(10, true);
  }
  
  const dbArticles = await getLatestArticles(10);
  
  const firstPageArticles = dbArticles.map(article => ({
    title: article.title,
    description: article.excerpt,
    content: article.content,
    url: article.source_url || '',
    imageUrl: article.image_url,
    publishedAt: article.published_at,
    sourceName: article.source_name || 'Fonte esterna',
    category: article.category,
    slug: article.slug,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-l-4 border-red-600 pl-4">
                Ultime Notizie Italiane
              </h2>
              <NewsList initialArticles={firstPageArticles} />
            </div>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Categorie</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <a
                  key={cat.id}
                  href={`/${cat.id}`}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-full transition-colors"
                >
                  {cat.name}
                </a>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-md p-6 text-white">
            <h3 className="text-lg font-bold mb-2">Newsletter</h3>
            <p className="text-blue-100 text-sm mb-4">
              Ricevi le notizie più importanti direttamente nella tua email.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="La tua email"
                className="flex-1 px-3 py-2 rounded text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white text-blue-600 font-medium text-sm rounded hover:bg-blue-50 transition-colors"
              >
                Iscriviti
              </button>
            </form>
          </div>

          <div className="mt-6">
            <SidebarAd adSlot="sidebar-ad" />
          </div>
        </aside>
      </div>

      <BottomBannerAd adSlot="bottom-banner" />
    </div>
  );
}
