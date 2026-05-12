import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getArticlesCount, getAllArticles } from '../lib/db/neon';

async function checkProductionDatabase() {
  console.log('🔍 Checking production database...\n');

  try {
    // Test database connection
    const count = await getArticlesCount();
    console.log(`📊 Articles in database: ${count}`);

    if (count === 0) {
      console.log('❌ Database is empty!');
      console.log('\n🔧 To fix this issue:');
      console.log('1. Check DATABASE_URL in Vercel environment variables');
      console.log('2. Run setup script: npm run setup-neon');
      console.log('3. Or trigger manual fetch: curl /api/news?refresh=true');
      return;
    }

    // Get sample articles
    const articles = await getAllArticles();
    console.log(`\n📝 Sample articles (${Math.min(3, articles.length)}):`);
    
    articles.slice(0, 3).forEach((article, index) => {
      console.log(`${index + 1}. ${article.title} (${article.category})`);
      console.log(`   Published: ${new Date(article.published_at).toLocaleDateString()}`);
      console.log(`   Slug: ${article.slug}`);
      console.log('');
    });

    console.log('✅ Database check completed successfully!');

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('DATABASE_URL')) {
        console.log('\n🔧 Fix: Set DATABASE_URL in Vercel environment variables');
      } else if (error.message.includes('connection')) {
        console.log('\n🔧 Fix: Check Neon database status and connection string');
      }
    }
  }
}

checkProductionDatabase();
