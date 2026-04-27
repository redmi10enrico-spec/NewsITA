import { NewsApiArticle, GNewsArticle, Category } from '@/types';
import { createArticle, articleExists } from '@/lib/db';

const getNewsApiKey = () => process.env.NEWSAPI_KEY || '';
const getGNewsApiKey = () => process.env.GNEWS_API_KEY || '';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 80);
}

interface CategoryQuery {
  category: Category;
  keywords: string[];
}

const CATEGORY_QUERIES: CategoryQuery[] = [
  {
    category: 'tecnologia',
    keywords: ['tecnologia', 'tech', 'smartphone', 'computer', 'internet', 'digitale', 'innovazione']
  },
  {
    category: 'intelligenza-artificiale',
    keywords: ['intelligenza artificiale', 'IA', 'AI', 'chatbot', 'machine learning', 'algoritmo']
  },
  {
    category: 'business-finanza',
    keywords: ['economia', 'finanza', 'borsa', 'mercati', 'azioni', 'aziende italiane', 'pil']
  },
  {
    category: 'crypto',
    keywords: ['bitcoin', 'criptovalute', 'ethereum', 'blockchain', 'crypto italia', 'digital assets']
  },
  {
    category: 'attualita',
    keywords: ['attualità', 'notizie', 'politica italiana', 'cronaca', 'ultime notizie']
  },
  {
    category: 'salute',
    keywords: ['salute', 'medicina', 'sanità', 'benessere', 'ospedali', 'ministero salute']
  },
  {
    category: 'sport',
    keywords: ['calcio', 'serie a', 'sport italiano', 'olimpiadi', 'mondiali', 'atleti italiani']
  }
];

async function fetchFromNewsAPI(query: string, pageSize: number = 10): Promise<NewsApiArticle[]> {
  const NEWSAPI_KEY = getNewsApiKey();
  if (!NEWSAPI_KEY) {
    console.warn('NewsAPI key not configured');
    return [];
  }

  try {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 1);
    
    const url = `https://newsapi.org/v2/everything?` +
      `q=${encodeURIComponent(query)}&` +
      `from=${fromDate.toISOString().split('T')[0]}&` +
      `sortBy=publishedAt&` +
      `language=it&` +
      `pageSize=${pageSize}&` +
      `apiKey=${NEWSAPI_KEY}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AutoNewsSEO/1.0'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('NewsAPI error:', response.status, errorData);
      return [];
    }

    const data = await response.json();
    
    if (data.status !== 'ok') {
      console.error('NewsAPI returned error:', data.message);
      return [];
    }

    return data.articles || [];
  } catch (error) {
    console.error('Error fetching from NewsAPI:', error);
    return [];
  }
}

async function fetchFromGNews(query: string, max: number = 10): Promise<GNewsArticle[]> {
  const GNEWS_API_KEY = getGNewsApiKey();
  if (!GNEWS_API_KEY) {
    console.warn('GNews API key not configured');
    return [];
  }

  try {
    const url = `https://gnews.io/api/v4/search?` +
      `q=${encodeURIComponent(query)}&` +
      `lang=it&` +
      `max=${max}&` +
      `sortby=publishedAt&` +
      `apikey=${GNEWS_API_KEY}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AutoNewsSEO/1.0'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('GNews API error:', response.status, errorData);
      return [];
    }

    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching from GNews:', error);
    return [];
  }
}

function normalizeNewsApiArticle(article: NewsApiArticle, category: Category): {
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  sourceName: string;
  category: Category;
} {
  let cleanContent = article.content || '';
  cleanContent = cleanContent.replace(/\s*\[\+\d+\s*chars\]\s*$/, '');
  
  const fullContent = article.description 
    ? `${article.description}\n\n${cleanContent}`
    : cleanContent;
  
  return {
    title: article.title || '',
    description: article.description || '',
    content: fullContent || article.description || '',
    url: article.url || '',
    imageUrl: article.urlToImage,
    publishedAt: article.publishedAt,
    sourceName: article.source?.name || 'Unknown',
    category
  };
}

function normalizeGNewsArticle(article: GNewsArticle, category: Category): {
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  sourceName: string;
  category: Category;
} {
  return {
    title: article.title || '',
    description: article.description || '',
    content: article.content || article.description || '',
    url: article.url || '',
    imageUrl: article.image,
    publishedAt: article.publishedAt,
    sourceName: article.source?.name || 'Unknown',
    category
  };
}

export async function fetchNewsForCategory(category: Category, limit: number = 5): Promise<{
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  sourceName: string;
  category: Category;
}[]> {
  const categoryQuery = CATEGORY_QUERIES.find(q => q.category === category);
  
  if (!categoryQuery) {
    console.error(`No query configured for category: ${category}`);
    return [];
  }

  const searchQuery = categoryQuery.keywords.join(' OR ');
  const [newsApiResults, gNewsResults] = await Promise.all([
    fetchFromNewsAPI(searchQuery, Math.ceil(limit / 2)),
    fetchFromGNews(searchQuery, Math.ceil(limit / 2))
  ]);

  const normalizedResults = [
    ...newsApiResults.map(a => normalizeNewsApiArticle(a, category)),
    ...gNewsResults.map(a => normalizeGNewsArticle(a, category))
  ];

  const uniqueResults = removeDuplicates(normalizedResults);
  
  return uniqueResults.slice(0, limit);
}

export async function fetchAllCategoriesNews(limitPerCategory: number = 5, saveToDb: boolean = true): Promise<{
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  sourceName: string;
  category: Category;
  slug: string;
}[]> {
  const allNews: {
    title: string;
    description: string;
    content: string;
    url: string;
    imageUrl: string | null;
    publishedAt: string;
    sourceName: string;
    category: Category;
    slug: string;
  }[] = [];

  const categories: Category[] = ['tecnologia', 'intelligenza-artificiale', 'business-finanza', 'crypto', 'attualita', 'salute', 'sport'];

  for (const category of categories) {
    try {
      const news = await fetchNewsForCategory(category, limitPerCategory);
      
      for (const article of news) {
        let slug = '';
        
        if (saveToDb) {
          const saved = await saveNewsToDatabase(article);
          if (saved) {
            slug = saved.slug;
          } else {
            continue;
          }
        }
        
        allNews.push({
          ...article,
          slug
        });
      }
    } catch (error) {
      console.error(`Error fetching news for ${category}:`, error);
    }
  }

  return allNews.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

function removeDuplicates(articles: {
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  sourceName: string;
  category: Category;
}[]): {
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  sourceName: string;
  category: Category;
}[] {
  const seen = new Set<string>();
  
  return articles.filter(article => {
    const normalizedTitle = article.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 50);
    const key = `${normalizedTitle}-${article.category}`;
    
    if (seen.has(key)) {
      return false;
    }
    
    seen.add(key);
    return true;
  });
}

export async function saveNewsToDatabase(article: {
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  sourceName: string;
  category: Category;
}): Promise<{ slug: string; id: string } | null> {
  try {
    const exists = await articleExists(article.url);
    if (exists) {
      console.log(`Article already exists: ${article.title}`);
      return null;
    }

    const slug = generateSlug(article.title);
    const uniqueSlug = `${slug}-${Date.now().toString(36).substr(-4)}`;

    const newArticle = await createArticle({
      title: article.title,
      content: article.content,
      excerpt: article.description,
      category: article.category,
      slug: uniqueSlug,
      published_at: article.publishedAt,
      meta_title: article.title,
      meta_description: article.description,
      keywords: article.category.split('-'),
      source_url: article.url,
      source_name: article.sourceName,
      image_url: article.imageUrl,
      views: 0,
      is_featured: false,
    });

    if (newArticle) {
      console.log(`Saved article: ${article.title} with slug: ${uniqueSlug}`);
      return { slug: uniqueSlug, id: newArticle.id };
    }
    
    return null;
  } catch (error) {
    console.error('Error saving article to database:', error);
    return null;
  }
}

export function validateArticleContent(title: string, content: string): boolean {
  if (!title || title.length < 10) return false;
  if (!content || content.length < 50) return false;
  return true;
}

export { CATEGORY_QUERIES };
export type { CategoryQuery };
