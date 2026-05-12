import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(request: Request) {
  try {
    console.log('🔍 Debug database connection...');
    
    // Test database connection
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return NextResponse.json({ error: 'DATABASE_URL missing' }, { status: 500 });
    }
    
    const sql = neon(dbUrl);
    
    // Test basic query
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Database connection test:', result);
    
    // Check if articles table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'articles'
      ) as exists
    `;
    console.log('📋 Articles table exists:', tableCheck[0]?.exists);
    
    // Get article count
    const countResult = await sql`SELECT COUNT(*) as count FROM articles`;
    const count = countResult[0]?.count || 0;
    console.log('📊 Article count:', count);
    
    // Get sample articles if any
    let articles = [];
    if (count > 0) {
      articles = await sql`SELECT id, title, category, slug, created_at FROM articles LIMIT 5`;
      console.log('📝 Sample articles:', articles);
    }
    
    // Test insert if empty
    if (count === 0) {
      console.log('🔧 Inserting test article...');
      await sql`
        INSERT INTO articles (title, content, excerpt, category, slug, meta_title, meta_description, keywords, source_name, views, is_featured) 
        VALUES (
          'Test Article - DEBUG', 
          'This is a test article created via debug API', 
          'Test article for debugging database connection', 
          'tecnologia', 
          'test-article-debug-' + Date.now(), 
          'Test Article | NewsITA', 
          'Test article for debugging', 
          '["test", "debug"]', 
          'DebugAPI', 
          100, 
          true
        )
      `;
      
      // Verify insert
      const newCount = await sql`SELECT COUNT(*) as count FROM articles`;
      console.log('📊 New article count:', newCount[0]?.count);
    }
    
    return NextResponse.json({
      success: true,
      database: {
        connected: true,
        tableExists: tableCheck[0]?.exists || false,
        articleCount: count,
        sampleArticles: articles
      }
    });
    
  } catch (error) {
    console.error('❌ Database debug failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: {
        databaseUrl: process.env.DATABASE_URL ? 'SET' : 'MISSING',
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
