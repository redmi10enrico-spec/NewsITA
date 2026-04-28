import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { fetchAllCategoriesNews } from '../lib/news/fetcher.js';
import { processArticle } from '../lib/ai/rewriter.js';
import { createArticle, articleExists } from '../lib/db/neon.js';

async function runNewsFetch() {
  console.log('=== Starting Manual News Fetch ===\n');
  
  // Debug: verifica chiavi API
  console.log('API Keys check:');
  console.log('  NEWSAPI_KEY:', process.env.NEWSAPI_KEY ? '***' + process.env.NEWSAPI_KEY.slice(-4) : 'NON CONFIGURATA');
  console.log('  GNEWS_API_KEY:', process.env.GNEWS_API_KEY ? '***' + process.env.GNEWS_API_KEY.slice(-4) : 'NON CONFIGURATA');
  console.log('  OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '***' + process.env.OPENAI_API_KEY.slice(-4) : 'NON CONFIGURATA');
  console.log();
  
  try {
    console.log('Fetching news from all categories...');
    const allNews = await fetchAllCategoriesNews(2);
    
    console.log(`\nFound ${allNews.length} articles to process\n`);
    
    let saved = 0;
    let skipped = 0;
    let errors = 0;

    for (const newsItem of allNews) {
      try {
        console.log(`\n--- Processing: ${newsItem.title.substring(0, 60)}... ---`);
        
        const exists = await articleExists(newsItem.url);
        if (exists) {
          console.log('  → Skipped (duplicate URL)');
          skipped++;
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
          newsItem.category
        );

        if (!processed) {
          console.log('  → Error: Failed to process article');
          errors++;
          continue;
        }

        console.log(`  → Rewritten title: ${processed.rewrittenTitle.substring(0, 60)}...`);

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
          console.log(`  → Saved with ID: ${article.id}`);
          console.log(`  → Slug: ${article.slug}`);
          saved++;
        } else {
          console.log('  → Error: Failed to save to database');
          errors++;
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('  → Error processing item:', error);
        errors++;
      }
    }

    console.log('\n=== Results ===');
    console.log(`Total processed: ${allNews.length}`);
    console.log(`Saved: ${saved}`);
    console.log(`Skipped (duplicates): ${skipped}`);
    console.log(`Errors: ${errors}`);
    console.log('\n=== Completed ===');

  } catch (error) {
    console.error('Critical error:', error);
    process.exit(1);
  }
}

runNewsFetch();
