export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: Category;
  slug: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  meta_title: string;
  meta_description: string;
  keywords: string[];
  source_url: string | null;
  source_name: string | null;
  image_url: string | null;
  views: number;
  is_featured: boolean;
}

export type Category = 
  | 'tecnologia'
  | 'intelligenza-artificiale'
  | 'business-finanza'
  | 'crypto'
  | 'attualita'
  | 'salute'
  | 'sport';

export const CATEGORIES: { id: Category; name: string; color: string }[] = [
  { id: 'tecnologia', name: 'Tecnologia', color: '#3b82f6' },
  { id: 'intelligenza-artificiale', name: 'Intelligenza Artificiale', color: '#8b5cf6' },
  { id: 'business-finanza', name: 'Business & Finanza', color: '#10b981' },
  { id: 'crypto', name: 'Crypto', color: '#f59e0b' },
  { id: 'attualita', name: 'Attualità', color: '#ef4444' },
  { id: 'salute', name: 'Salute', color: '#ec4899' },
  { id: 'sport', name: 'Sport', color: '#06b6d4' },
];

export interface NewsApiArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    name: string;
    id: string | null;
  };
}

export interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export interface ProcessedArticle {
  originalTitle: string;
  rewrittenTitle: string;
  content: string;
  excerpt: string;
  category: Category;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  sourceUrl: string;
  sourceName: string;
  imageUrl: string | null;
  publishedAt: string;
}

export interface SeoData {
  title: string;
  description: string;
  keywords: string[];
  slug: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: Article | Article[];
  error?: string;
}

export interface CategoryPageProps {
  params: {
    category: Category;
  };
}

export interface ArticlePageProps {
  params: {
    slug: string;
  };
}
