import Link from 'next/link';
import { Article, CATEGORIES } from '@/types';
import { ArticleCard } from './ArticleCard';

interface CategorySectionProps {
  categoryId: string;
  articles: Article[];
}

export function CategorySection({ categoryId, articles }: CategorySectionProps) {
  const category = CATEGORIES.find(c => c.id === categoryId);
  
  if (!category || articles.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-8 rounded" 
            style={{ backgroundColor: category.color }}
          />
          <h2 className="text-2xl font-bold text-gray-900">
            {category.name}
          </h2>
        </div>
        <Link 
          href={`/${categoryId}`}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center group"
        >
          Vedi tutti
          <svg 
            className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="default" />
        ))}
      </div>
    </section>
  );
}
