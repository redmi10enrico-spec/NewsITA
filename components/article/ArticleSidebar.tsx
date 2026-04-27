import Link from 'next/link';
import Image from 'next/image';
import { getArticlesByCategory } from '@/lib/db/mock';
import { Category, CATEGORIES } from '@/types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface ArticleSidebarProps {
  category: Category;
  currentArticleId: string;
}

export async function ArticleSidebar({ category, currentArticleId }: ArticleSidebarProps) {
  const relatedArticles = await getArticlesByCategory(category, 5);
  const filteredArticles = relatedArticles.filter(a => a.id !== currentArticleId).slice(0, 4);

  const categoryData = CATEGORIES.find(c => c.id === category);
  const otherCategories = CATEGORIES.filter(c => c.id !== category).slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div 
            className="w-3 h-8 rounded" 
            style={{ backgroundColor: categoryData?.color || '#3b82f6' }}
          />
          <h3 className="text-lg font-bold text-gray-900">
            Articoli Correlati
          </h3>
        </div>
        
        {filteredArticles.length === 0 ? (
          <p className="text-gray-500 text-sm">Nessun articolo correlato disponibile.</p>
        ) : (
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="flex gap-3 group"
              >
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                  {article.image_url ? (
                    <Image
                      src={article.image_url}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <span className="text-gray-600 text-lg font-bold">
                        {article.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-3">
                    {article.title}
                  </h4>
                  <time 
                    dateTime={article.published_at}
                    className="text-xs text-gray-500 mt-1 block"
                  >
                    {format(new Date(article.published_at), 'd MMM yyyy', { locale: it })}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Altre Categorie
        </h3>
        <div className="flex flex-wrap gap-2">
          {otherCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.id}`}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-full transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg shadow-md p-6 text-white">
        <h3 className="text-lg font-bold mb-2">
          Resta Aggiornato
        </h3>
        <p className="text-red-100 text-sm mb-4">
          Torna a trovarci per le ultime notizie su {categoryData?.name}.
        </p>
        <div className="flex items-center text-sm">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Aggiornato ogni 6 ore</span>
        </div>
      </div>
    </div>
  );
}
