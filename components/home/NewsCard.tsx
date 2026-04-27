'use client';

import Image from 'next/image';
import type { Category } from '@/types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

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

interface NewsCardProps {
  article: NewsItem;
}

export function NewsCard({ article }: NewsCardProps) {
  const categoryColors: Record<string, string> = {
    'tecnologia': 'bg-blue-600',
    'intelligenza-artificiale': 'bg-purple-600',
    'business-finanza': 'bg-green-600',
    'crypto': 'bg-yellow-600',
    'attualita': 'bg-red-600',
    'salute': 'bg-pink-600',
    'sport': 'bg-cyan-600',
  };

  const categoryNames: Record<string, string> = {
    'tecnologia': 'Tecnologia',
    'intelligenza-artificiale': 'IA',
    'business-finanza': 'Business',
    'crypto': 'Crypto',
    'attualita': 'Attualità',
    'salute': 'Salute',
    'sport': 'Sport',
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
      <a 
        href={`/article/${article.slug}`}
        className="block"
      >
        <div className="relative h-48 md:h-56">
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
              <span className="text-white text-3xl font-bold">{article.title.charAt(0)}</span>
            </div>
          )}
        </div>
        <div className="p-4 md:p-5">
          <span className={`inline-block px-2 py-1 ${categoryColors[article.category] || 'bg-gray-600'} text-white text-xs font-semibold uppercase tracking-wider rounded mb-3`}>
            {categoryNames[article.category] || article.category}
          </span>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {article.description}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <time dateTime={article.publishedAt}>
              {format(new Date(article.publishedAt), 'd MMMM yyyy', { locale: it })}
            </time>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {article.sourceName}
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}
