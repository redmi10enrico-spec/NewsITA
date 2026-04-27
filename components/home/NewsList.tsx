'use client';

import { useState, useCallback } from 'react';
import { NewsCard } from './NewsCard';
import { AdCard } from './AdCard';
import type { Category } from '@/types';

interface NewsItem {
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  sourceName: string;
  category: Category;
  slug: string;
}

interface NewsListProps {
  initialArticles: NewsItem[];
}

// Cache in-memory for fetched articles across pages
const newsCache: NewsItem[] = [];

export function NewsList({ initialArticles }: NewsListProps) {
  // Initialize cache with initial articles if empty
  if (newsCache.length === 0 && initialArticles.length > 0) {
    newsCache.push(...initialArticles);
  }

  const [articles, setArticles] = useState<NewsItem[]>(initialArticles);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialArticles.length === 10);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/news?page=${page}&limit=10`);
      const data = await response.json();

      if (data.success) {
        // Filter out duplicates based on URL
        const existingUrls = new Set(articles.map(a => a.url));
        const newArticles = data.articles.filter((a: NewsItem) => !existingUrls.has(a.url));
        
        if (newArticles.length > 0) {
          setArticles(prev => [...prev, ...newArticles]);
          newsCache.push(...newArticles);
        }
        
        setPage(prev => prev + 1);
        setHasMore(data.hasMore && newArticles.length > 0);
      } else {
        setError('Errore nel caricamento delle notizie');
      }
    } catch (err) {
      setError('Errore di connessione. Riprova.');
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, articles]);

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nessuna notizia disponibile al momento.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <>
            <NewsCard key={`${article.url}-${index}`} article={article} />
            {/* Inserisci pubblicità ogni 6 notizie */}
            {(index + 1) % 6 === 0 && (
              <AdCard key={`ad-${index}`} adSlot="1234567890" />
            )}
          </>
        ))}
      </div>

      {error && (
        <div className="text-center py-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
          >
            {loading ? 'Caricamento...' : 'Mostra altre notizie'}
          </button>
        </div>
      )}
    </div>
  );
}
