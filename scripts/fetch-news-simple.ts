import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { fetchAllCategoriesNews } from '../lib/news/fetcher.js';
import { createArticle, articleExists } from '../lib/db/mock.js';
import slugify from 'slugify';

function generateSlug(title: string): string {
  return slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'`"!:@]/g
  }).substring(0, 80);
}

function categorizeArticle(title: string, description: string): string {
  const text = (title + ' ' + description).toLowerCase();
  
  if (text.includes('tech') || text.includes('ai') || text.includes('software') || text.includes('digital')) return 'tecnologia';
  if (text.includes('artificial intelligence') || text.includes('chatgpt') || text.includes('machine learning')) return 'intelligenza-artificiale';
  if (text.includes('crypto') || text.includes('bitcoin') || text.includes('ethereum') || text.includes('blockchain')) return 'crypto';
  if (text.includes('stock') || text.includes('market') || text.includes('economy') || text.includes('business')) return 'business-finanza';
  if (text.includes('health') || text.includes('medical') || text.includes('medicine')) return 'salute';
  if (text.includes('sport') || text.includes('football') || text.includes('soccer') || text.includes('basketball')) return 'sport';
  
  return 'attualita';
}

async function runSimpleNewsFetch() {
  console.log('=== Simple News Fetch (NO AI) ===\n');
  console.log('⚠️  Nota: Gli articoli vengono salvati così come sono, senza riscrittura AI\n');
  
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

        // Contenuto minimo richiesto
        const content = newsItem.content || newsItem.description || '';
        if (content.length < 50) {
          console.log('  → Skipped (content too short)');
          skipped++;
          continue;
        }

        const category = categorizeArticle(newsItem.title, newsItem.description || '');
        const slug = generateSlug(newsItem.title);
        
        const article = await createArticle({
          title: newsItem.title,
          content: content + '\n\n(Tratto da: ' + newsItem.sourceName + ')',
          excerpt: newsItem.description || content.substring(0, 200) + '...',
          category: category,
          slug: slug,
          published_at: newsItem.publishedAt,
          meta_title: newsItem.title + ' | NewsITA',
          meta_description: (newsItem.description || content).substring(0, 160),
          keywords: [category, newsItem.sourceName.toLowerCase()],
          source_url: newsItem.url,
          source_name: newsItem.sourceName,
          image_url: newsItem.imageUrl,
          featured: false,
        });

        if (article) {
          console.log(`  → Saved with ID: ${article.id}`);
          console.log(`  → Slug: ${article.slug}`);
          console.log(`  → Category: ${category}`);
          saved++;
        } else {
          console.log('  → Error: Failed to save to database');
          errors++;
        }

        // Pausa tra articoli
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('  → Error processing item:', error);
        errors++;
      }
    }

    console.log('\n=== Results ===');
    console.log(`Total processed: ${allNews.length}`);
    console.log(`Saved: ${saved}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Errors: ${errors}`);
    console.log('\n=== Completed ===');

  } catch (error) {
    console.error('Critical error:', error);
    process.exit(1);
  }
}

runSimpleNewsFetch();
