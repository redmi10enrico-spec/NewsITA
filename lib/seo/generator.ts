import { Article } from '@/types';

export function generateArticleStructuredData(article: Article): Record<string, unknown> {
  const siteUrl = process.env.SITE_URL || 'https://yoursite.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.image_url || `${siteUrl}/default-og-image.jpg`,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: {
      '@type': 'Organization',
      name: process.env.SITE_NAME || 'NewsITA',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: process.env.SITE_NAME || 'NewsITA',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/article/${article.slug}`,
    },
    articleSection: article.category,
    keywords: article.keywords.join(', '),
  };
}

export function generateBreadcrumbStructuredData(
  items: { name: string; url: string }[]
): Record<string, unknown> {
  const siteUrl = process.env.SITE_URL || 'https://yoursite.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

export function generateOrganizationStructuredData(): Record<string, unknown> {
  const siteUrl = process.env.SITE_URL || 'https://yoursite.com';
  const siteName = process.env.SITE_NAME || 'NewsITA';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      `${siteUrl}/about`,
    ],
  };
}

export function generateWebsiteStructuredData(): Record<string, unknown> {
  const siteUrl = process.env.SITE_URL || 'https://yoursite.com';
  const siteName = process.env.SITE_NAME || 'NewsITA';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateRobotsMeta(
  index: boolean = true,
  follow: boolean = true
): string {
  const directives: string[] = [];
  
  if (index) {
    directives.push('index');
  } else {
    directives.push('noindex');
  }
  
  if (follow) {
    directives.push('follow');
  } else {
    directives.push('nofollow');
  }
  
  directives.push('max-image-preview:large');
  directives.push('max-snippet:-1');
  directives.push('max-video-preview:-1');
  
  return directives.join(', ');
}

export function sanitizeMetaDescription(description: string): string {
  return description
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 160);
}

export function sanitizeMetaTitle(title: string): string {
  return title
    .replace(/<[^>]*>/g, '')
    .trim()
    .substring(0, 60);
}

export function generateCanonicalUrl(path: string): string {
  const siteUrl = process.env.SITE_URL || 'https://yoursite.com';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${cleanPath}`;
}

export function generateOpenGraphTags(
  title: string,
  description: string,
  image: string | null,
  type: string = 'website',
  path: string = ''
): Record<string, string> {
  const siteUrl = process.env.SITE_URL || 'https://yoursite.com';
  const siteName = process.env.SITE_NAME || 'NewsITA';
  
  return {
    'og:title': title,
    'og:description': description,
    'og:image': image || `${siteUrl}/default-og-image.jpg`,
    'og:url': `${siteUrl}${path}`,
    'og:type': type,
    'og:site_name': siteName,
    'og:locale': 'it_IT',
  };
}

export function generateTwitterCardTags(
  title: string,
  description: string,
  image: string | null
): Record<string, string> {
  const siteUrl = process.env.SITE_URL || 'https://yoursite.com';
  
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image || `${siteUrl}/default-og-image.jpg`,
  };
}

export function formatDateForSEO(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString();
}

export function generateSitemapEntry(
  url: string,
  lastmod: string,
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'daily',
  priority: number = 0.5
): string {
  return `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
}
