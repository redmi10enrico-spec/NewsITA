import { NextResponse } from 'next/server';
import { fetchAllCategoriesNews } from '@/lib/news/fetcher';
import { getLatestArticles, getAllArticles, getArticlesCount } from '@/lib/db/mock';

export const dynamic = 'force-dynamic';

// Track last fetch time to avoid API rate limits
let lastFetchTime = 0;
const MIN_FETCH_INTERVAL = 30 * 1000; // 30 seconds between API calls

async function ensureEnoughArticles(minCount: number) {
  const currentCount = getArticlesCount();
  
  if (currentCount < minCount) {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTime;
    
    if (timeSinceLastFetch >= MIN_FETCH_INTERVAL) {
      console.log(`Database has ${currentCount} articles, fetching more...`);
      lastFetchTime = now;
      // Fetch more articles per category to fill up the database
      await fetchAllCategoriesNews(10, true); // 10 per category = ~70 articles
    }
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const refresh = searchParams.get('refresh') === 'true';
    
    // If refresh requested, fetch new articles first
    if (refresh) {
      const now = Date.now();
      if (now - lastFetchTime >= MIN_FETCH_INTERVAL) {
        console.log('Refresh requested, fetching new articles...');
        lastFetchTime = now;
        await fetchAllCategoriesNews(10, true);
      }
    }
    
    // Ensure we have enough articles for the requested page
    const minArticlesNeeded = page * limit + 10;
    await ensureEnoughArticles(minArticlesNeeded);
    
    // Get all articles from database sorted by date
    const allArticles = getAllArticles().sort((a, b) => 
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );
    
    const offset = (page - 1) * limit;
    const articles = allArticles.slice(offset, offset + limit);
    
    // Map to the format expected by NewsList
    const mappedArticles = articles.map(article => ({
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

    const hasMore = (offset + limit) < allArticles.length;

    return NextResponse.json({
      success: true,
      articles: mappedArticles,
      page,
      limit,
      hasMore,
      total: allArticles.length
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
