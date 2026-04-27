import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'featured';
}

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
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

  if (variant === 'compact') {
    return (
      <article className="flex gap-4 group">
        <Link href={`/article/${article.slug}`} className="block flex-shrink-0">
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-gray-200">
            {article.image_url ? (
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <span className="text-gray-600 text-2xl font-bold">{article.title.charAt(0)}</span>
              </div>
            )}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/${article.category}`}>
            <span className={`inline-block px-2 py-0.5 ${categoryColors[article.category] || 'bg-gray-600'} text-white text-xs font-medium rounded mb-2`}>
              {categoryNames[article.category] || article.category}
            </span>
          </Link>
          <Link href={`/article/${article.slug}`} className="block">
            <h3 className="text-base font-semibold text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-gray-500 text-xs line-clamp-2 mb-2">
              {article.excerpt}
            </p>
            <time dateTime={article.published_at} className="text-gray-400 text-xs">
              {format(new Date(article.published_at), 'd MMM', { locale: it })}
            </time>
          </Link>
        </div>
      </article>
    );
  }

  if (variant === 'featured') {
    return (
      <article className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
        <Link href={`/article/${article.slug}`} className="block">
          <div className="relative h-48">
            {article.image_url ? (
              <Image
                src={article.image_url}
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
          <div className="p-4">
            <span className={`inline-block px-2 py-1 ${categoryColors[article.category] || 'bg-gray-600'} text-white text-xs font-semibold uppercase tracking-wider rounded mb-2`}>
              {categoryNames[article.category] || article.category}
            </span>
            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <time dateTime={article.published_at}>
                {format(new Date(article.published_at), 'd MMMM yyyy', { locale: it })}
              </time>
              <span>{article.views} letture</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
      <Link href={`/article/${article.slug}`} className="block">
        <div className="relative h-48 md:h-56">
          {article.image_url ? (
            <Image
              src={article.image_url}
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
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <time dateTime={article.published_at}>
              {format(new Date(article.published_at), 'd MMMM yyyy', { locale: it })}
            </time>
            <span>{article.views} letture</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
