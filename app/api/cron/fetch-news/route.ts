import { NextRequest, NextResponse } from 'next/server';
import { fetchAllCategoriesNews } from '@/lib/news/fetcher';
import { processArticle } from '@/lib/ai/rewriter';
import { createArticle, articleExists } from '@/lib/db/neon';
import { Category } from '@/types';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Allow access if no CRON_SECRET is configured (local development)
  if (!cronSecret && !authHeader?.includes('Bearer')) {
    console.log('No CRON_SECRET configured, allowing request without auth');
  }

  try {
    console.log('Starting automated news fetch...');
    
    const allNews = await fetchAllCategoriesNews(3);
    console.log(`Fetched ${allNews.length} articles from news sources`);
    
    const results = {
      fetched: allNews.length,
      processed: 0,
      saved: 0,
      skipped: 0,
      errors: 0,
    };

    for (const newsItem of allNews) {
      try {
        const exists = await articleExists(newsItem.url);
        if (exists) {
          console.log(`Skipping duplicate: ${newsItem.title}`);
          results.skipped++;
          continue;
        }

        results.processed++;

        const processed = await processArticle(
          newsItem.title,
          newsItem.content,
          newsItem.description,
          newsItem.url,
          newsItem.sourceName,
          newsItem.imageUrl,
          newsItem.publishedAt,
          newsItem.category
        );

        if (!processed) {
          console.error(`Failed to process article: ${newsItem.title}`);
          results.errors++;
          continue;
        }

        const article = await createArticle({
          title: processed.rewrittenTitle,
          content: processed.content,
          excerpt: processed.excerpt,
          category: processed.category,
          slug: processed.slug,
          published_at: processed.publishedAt,
          meta_title: processed.metaTitle,
          meta_description: processed.metaDescription,
          keywords: processed.keywords,
          source_url: processed.sourceUrl,
          source_name: processed.sourceName,
          image_url: processed.imageUrl,
          is_featured: false,
        });

        if (article) {
          console.log(`Saved article: ${article.title}`);
          results.saved++;
        } else {
          console.error(`Failed to save article: ${processed.rewrittenTitle}`);
          results.errors++;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error processing news item:', error);
        results.errors++;
      }
    }

    console.log('News fetch completed:', results);

    return NextResponse.json({
      success: true,
      message: 'News fetch completed',
      data: results,
    });
  } catch (error) {
    console.error('Critical error in fetch-news:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const maxDuration = 300;
