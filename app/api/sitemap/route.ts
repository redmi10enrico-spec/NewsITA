import { NextResponse } from 'next/server';
import { getLatestArticles, getAllArticles } from '@/lib/db/neon';
import { CATEGORIES } from '@/types';

export async function GET() {
  const siteUrl = process.env.SITE_URL || 'https://yoursite.com';
  
  try {
    const articles = await getLatestArticles(1000);

    const staticUrls = [
      { loc: siteUrl, priority: 1.0, changefreq: 'daily' as const },
      { loc: `${siteUrl}/about`, priority: 0.5, changefreq: 'monthly' as const },
      { loc: `${siteUrl}/privacy`, priority: 0.3, changefreq: 'yearly' as const },
    ];

    CATEGORIES.forEach(cat => {
      staticUrls.push({
        loc: `${siteUrl}/${cat.id}`,
        priority: 0.8,
        changefreq: 'daily' as const,
      });
    });

    const articleUrls = articles.map(article => ({
      loc: `${siteUrl}/article/${article.slug}`,
      lastmod: new Date(article.updated_at).toISOString().split('T')[0],
      priority: 0.6,
      changefreq: 'weekly' as const,
    }));

    const today = new Date().toISOString().split('T')[0];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
${articleUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
