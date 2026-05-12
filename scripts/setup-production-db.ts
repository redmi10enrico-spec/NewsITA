import { neon } from '@neondatabase/serverless';

// This script is designed to run in Vercel environment
const sql = neon(process.env.DATABASE_URL || '');

async function setupProductionDatabase() {
  console.log('🚀 Setting up Production Database...\n');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    console.log('🔧 Please set DATABASE_URL in Vercel dashboard');
    process.exit(1);
  }

  try {
    console.log('Step 1: Creating articles table...');
    
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        published_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        meta_title TEXT NOT NULL,
        meta_description TEXT NOT NULL,
        keywords JSONB DEFAULT '[]'::jsonb,
        source_url TEXT,
        source_name VARCHAR(255),
        image_url TEXT,
        views INTEGER NOT NULL DEFAULT 0,
        is_featured BOOLEAN NOT NULL DEFAULT FALSE
      )
    `;
    
    console.log('✓ Articles table created/verified\n');

    console.log('Step 2: Creating indexes...');
    
    await sql`CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(is_featured)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_articles_source_url ON articles(source_url)`;
    
    console.log('✓ Indexes created\n');

    // Check existing articles
    const countResult = await sql`SELECT COUNT(*) as count FROM articles`;
    const count = countResult[0]?.count || 0;
    console.log(`📊 Current articles in database: ${count}\n`);

    if (count === 0) {
      console.log('Step 3: Adding sample articles for production...');
      
      await sql`
        INSERT INTO articles (title, content, excerpt, category, slug, meta_title, meta_description, keywords, source_name, views, is_featured) 
        VALUES (
          'Apple lancia nuovi MacBook Pro con chip M4',
          'Apple ha presentato oggi la nuova generazione di MacBook Pro equipaggiati con il rivoluzionario chip M4. Questa nuova architettura promette prestazioni superiori del 50% rispetto alla generazione precedente, con un consumo energetico ridotto del 30%.

Il nuovo chip M4 integra 16 core CPU e 40 core GPU, offrendo performance eccezionali per editing video, rendering 3D e sviluppo software. La batteria garantisce ora fino a 22 ore di autonomia, un record per la categoria.',
          'Apple presenta i nuovi MacBook Pro con chip M4, promettendo prestazioni superiori del 50% e 22 ore di batteria.',
          'tecnologia',
          'apple-macbook-pro-chip-m4',
          'Apple MacBook Pro M4: Prestazioni Rivoluzionarie | NewsITA',
          'Scopri i nuovi MacBook Pro con chip M4: 50% più veloci, 22 ore di batteria. Prezzi e disponibilità.',
          '["apple", "macbook pro", "chip m4", "tecnologia"]',
          'TechNews',
          1250,
          true
        )
      `;
      
      await sql`
        INSERT INTO articles (title, content, excerpt, category, slug, meta_title, meta_description, keywords, source_name, views, is_featured) 
        VALUES (
          'ChatGPT-5: OpenAI annuncia il nuovo modello',
          'OpenAI ha annunciato oggi lo sviluppo di ChatGPT-5, il nuovo modello di intelligenza artificiale che promette di rivoluzionare ulteriormente il settore.

Il CEO Sam Altman ha dichiarato che GPT-5 sarà in grado di comprendere contesti complessi con una precisione mai vista prima.',
          'OpenAI svela ChatGPT-5: nuovo modello AI multimodale con meno allucinazioni.',
          'intelligenza-artificiale',
          'chatgpt-5-openai-nuovo-modello',
          'ChatGPT-5: La Nuova IA Rivoluzionaria di OpenAI | NewsITA',
          'OpenAI annuncia GPT-5: meno allucinazioni, comprensione multimodale.',
          '["chatgpt", "openai", "intelligenza artificiale", "gpt-5"]',
          'AINews',
          890,
          true
        )
      `;
      
      await sql`
        INSERT INTO articles (title, content, excerpt, category, slug, meta_title, meta_description, keywords, source_name, views, is_featured) 
        VALUES (
          'Bitcoin raggiunge nuovo massimo storico',
          'Il Bitcoin ha superato oggi la soglia degli 85.000 dollari, stabilendo un nuovo massimo storico. L impennata è stata guidata dall approvazione degli ETF spot e dall interesse istituzionale crescente.',
          'Bitcoin supera gli 85.000$ con nuovo record storico, guidato da ETF e interesse istituzionale.',
          'crypto',
          'bitcoin-nuovo-massimo-storico-85000',
          'Bitcoin Record: Superati gli 85.000$ | NewsITA',
          'Bitcoin raggiunge nuovo ATH a 85.000$. ETF approvati, analisti prevedono 100K.',
          '["bitcoin", "crypto", "criptovalute", "btc"]',
          'CryptoDaily',
          2100,
          false
        )
      `;
      
      console.log('✓ Sample articles inserted (3 articles)\n');
    } else {
      console.log('✓ Database already populated, skipping sample data\n');
    }

    console.log('✅ Production database setup completed!');
    console.log('\nNext steps:');
    console.log('1. Trigger news fetch: curl /api/news?refresh=true');
    console.log('2. Or wait for automatic cron job');

  } catch (error) {
    console.error('\n❌ Error during production setup:');
    console.error(error);
    process.exit(1);
  }
}

// Export for use in API route
export { setupProductionDatabase };

// Run if called directly
if (require.main === module) {
  setupProductionDatabase();
}
