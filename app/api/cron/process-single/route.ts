import { NextRequest, NextResponse } from 'next/server';
import { fetchNewsForCategory } from '@/lib/news/fetcher';
import { processArticle } from '@/lib/ai/rewriter';
import { createArticle, articleExists } from '@/lib/db/mysql';
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

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as Category | null;

  if (!category) {
    return NextResponse.json(
      { success: false, error: 'Category parameter required' },
      { status: 400 }
    );
  }

  const validCategories: Category[] = [
    'tecnologia', 'intelligenza-artificiale', 'business-finanza', 
    'crypto', 'attualita', 'salute', 'sport'
  ];

  if (!validCategories.includes(category)) {
    return NextResponse.json(
      { success: false, error: 'Invalid category' },
      { status: 400 }
    );
  }

  try {
    console.log(`Fetching single news for category: ${category}`);
    
    const news = await fetchNewsForCategory(category, 5);
    
    for (const newsItem of news) {
      const exists = await articleExists(newsItem.url);
      if (exists) {
        console.log(`Skipping duplicate: ${newsItem.title}`);
        continue;
      }

      const processed = await processArticle(
        newsItem.title,
        newsItem.content,
        newsItem.description,
        newsItem.url,
        newsItem.sourceName,
        newsItem.imageUrl,
        newsItem.publishedAt,
        category
      );

      if (processed) {
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
          featured: false,
        });

        if (article) {
          return NextResponse.json({
            success: true,
            message: 'Article created successfully',
            data: {
              id: article.id,
              title: article.title,
              slug: article.slug,
              category: article.category,
            },
          });
        }
      }
    }

    return NextResponse.json(
      { success: false, error: 'No new articles found or processed' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error in process-single:', error);
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
