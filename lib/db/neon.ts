import { neon } from '@neondatabase/serverless';
import { Article, Category } from '@/types';

const sql = neon(process.env.DATABASE_URL || '');

if (!process.env.DATABASE_URL) {
  throw new Error('Missing DATABASE_URL environment variable');
}

export async function createArticle(article: Partial<Article>): Promise<Article | null> {
  try {
    const result = await sql`
      INSERT INTO articles (
        title, content, excerpt, category, slug,
        meta_title, meta_description, keywords,
        source_url, source_name, image_url,
        is_featured, views, published_at
      ) VALUES (
        ${article.title},
        ${article.content},
        ${article.excerpt},
        ${article.category},
        ${article.slug},
        ${article.meta_title},
        ${article.meta_description},
        ${JSON.stringify(article.keywords || [])},
        ${article.source_url},
        ${article.source_name},
        ${article.image_url},
        ${article.is_featured || false},
        ${article.views || 0},
        ${article.published_at || new Date().toISOString()}
      )
      RETURNING *
    `;
    
    return result[0] ? formatArticle(result[0]) : null;
  } catch (error) {
    console.error('Error creating article:', error);
    return null;
  }
}

export async function getArticleById(id: number | string): Promise<Article | null> {
  try {
    const result = await sql`SELECT * FROM articles WHERE id = ${id}`;
    return result[0] ? formatArticle(result[0]) : null;
  } catch (error) {
    console.error('Error getting article:', error);
    return null;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const result = await sql`SELECT * FROM articles WHERE slug = ${slug}`;
    return result[0] ? formatArticle(result[0]) : null;
  } catch (error) {
    console.error('Error getting article by slug:', error);
    return null;
  }
}

export async function getLatestArticles(limit = 10): Promise<Article[]> {
  try {
    const result = await sql`
      SELECT * FROM articles 
      ORDER BY published_at DESC 
      LIMIT ${limit}
    `;
    return result.map(formatArticle);
  } catch (error) {
    console.error('Error getting latest articles:', error);
    return [];
  }
}

export async function getFeaturedArticles(limit = 5): Promise<Article[]> {
  try {
    const result = await sql`
      SELECT * FROM articles 
      WHERE is_featured = true 
      ORDER BY published_at DESC 
      LIMIT ${limit}
    `;
    return result.map(formatArticle);
  } catch (error) {
    console.error('Error getting featured articles:', error);
    return [];
  }
}

export async function getArticlesByCategory(category: string, limit = 10): Promise<Article[]> {
  try {
    const result = await sql`
      SELECT * FROM articles 
      WHERE category = ${category} 
      ORDER BY published_at DESC 
      LIMIT ${limit}
    `;
    return result.map(formatArticle);
  } catch (error) {
    console.error('Error getting articles by category:', error);
    return [];
  }
}

export async function incrementViews(id: string): Promise<void> {
  try {
    await sql`UPDATE articles SET views = views + 1 WHERE id = ${id}`;
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
}

export async function articleExists(sourceUrl: string): Promise<boolean> {
  try {
    const result = await sql`SELECT id FROM articles WHERE source_url = ${sourceUrl} LIMIT 1`;
    return result.length > 0;
  } catch (error) {
    console.error('Error checking article existence:', error);
    return false;
  }
}

export async function getAllArticles(): Promise<Article[]> {
  try {
    const result = await sql`SELECT * FROM articles ORDER BY published_at DESC`;
    return result.map(formatArticle);
  } catch (error) {
    console.error('Error getting all articles:', error);
    return [];
  }
}

export async function getArticlesCount(): Promise<number> {
  try {
    const result = await sql`SELECT COUNT(*) as count FROM articles`;
    return result[0]?.count || 0;
  } catch (error) {
    console.error('Error getting articles count:', error);
    return 0;
  }
}

function formatArticle(row: any): Article {
  return {
    id: String(row.id),
    title: row.title,
    content: row.content,
    excerpt: row.excerpt,
    category: row.category as Category,
    slug: row.slug,
    published_at: row.published_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    meta_title: row.meta_title,
    meta_description: row.meta_description,
    keywords: typeof row.keywords === 'string' ? JSON.parse(row.keywords) : row.keywords,
    source_url: row.source_url,
    source_name: row.source_name,
    image_url: row.image_url,
    views: row.views,
    is_featured: row.is_featured,
  };
}
