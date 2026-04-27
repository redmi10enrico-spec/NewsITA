import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface HeroArticleProps {
  article: Article;
}

export function HeroArticle({ article }: HeroArticleProps) {
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
    'intelligenza-artificiale': 'Intelligenza Artificiale',
    'business-finanza': 'Business & Finanza',
    'crypto': 'Crypto',
    'attualita': 'Attualità',
    'salute': 'Salute',
    'sport': 'Sport',
  };

  return (
    <article className="relative bg-white rounded-lg shadow-lg overflow-hidden group">
      <Link href={`/article/${article.slug}`} className="block">
        <div className="relative h-64 md:h-96">
          {article.image_url ? (
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{article.title.charAt(0)}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <span className={`inline-block px-3 py-1 ${categoryColors[article.category] || 'bg-gray-600'} text-white text-xs font-semibold uppercase tracking-wider rounded mb-3`}>
              {categoryNames[article.category] || article.category}
            </span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3 group-hover:text-gray-200 transition-colors">
              {article.title}
            </h1>
            <p className="text-gray-300 text-sm md:text-base mb-3 line-clamp-2">
              {article.excerpt}
            </p>
            <div className="flex items-center text-gray-400 text-xs md:text-sm">
              <time dateTime={article.published_at}>
                {format(new Date(article.published_at), 'd MMMM yyyy', { locale: it })}
              </time>
              <span className="mx-2">•</span>
              <span>{article.views} letture</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
