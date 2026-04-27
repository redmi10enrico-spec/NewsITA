import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticleBySlug, incrementViews } from '@/lib/db/mock';
import { fetchFullArticle } from '@/lib/news/scraper';
import { generateArticleStructuredData, generateBreadcrumbStructuredData } from '@/lib/seo/generator';
import { ArticleContent } from '@/components/article/ArticleContent';
import { ArticleSidebar } from '@/components/article/ArticleSidebar';
import { Category } from '@/types';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    return {
      title: 'Articolo non trovato',
    };
  }

  const siteUrl = process.env.SITE_URL || 'https://yoursite.com';

  return {
    title: article.meta_title,
    description: article.meta_description,
    keywords: article.keywords,
    authors: [{ name: process.env.SITE_NAME || 'NewsITA' }],
    openGraph: {
      title: article.meta_title,
      description: article.meta_description,
      type: 'article',
      publishedTime: article.published_at,
      modifiedTime: article.updated_at,
      section: article.category,
      url: `${siteUrl}/article/${article.slug}`,
      images: article.image_url ? [article.image_url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.meta_title,
      description: article.meta_description,
      images: article.image_url ? [article.image_url] : [],
    },
    alternates: {
      canonical: `${siteUrl}/article/${article.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  // Fetch contenuto completo dall'URL originale
  let fullContent = article.content;
  if (article.source_url) {
    const scrapedContent = await fetchFullArticle(article.source_url);
    if (scrapedContent) {
      fullContent = scrapedContent;
    }
  }

  // Aggiorna articolo con contenuto completo
  const articleWithFullContent = {
    ...article,
    content: fullContent
  };

  // Incrementa views (fire and forget)
  try {
    incrementViews(article.id);
  } catch (e) {
    console.error(e);
  }

  const categoryNames: Record<Category, string> = {
    'tecnologia': 'Tecnologia',
    'intelligenza-artificiale': 'Intelligenza Artificiale',
    'business-finanza': 'Business & Finanza',
    'crypto': 'Crypto',
    'attualita': 'Attualità',
    'salute': 'Salute',
    'sport': 'Sport',
  };

  const siteUrl = process.env.SITE_URL || 'https://yoursite.com';

  const articleJsonLd = generateArticleStructuredData(article);
  const breadcrumbJsonLd = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: categoryNames[article.category], url: `/${article.category}` },
    { name: article.title, url: `/article/${article.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <a href="/" className="hover:text-gray-700">Home</a>
            </li>
            <li>/</li>
            <li>
              <a href={`/${article.category}`} className="hover:text-gray-700 capitalize">
                {categoryNames[article.category]}
              </a>
            </li>
            <li>/</li>
            <li className="text-gray-700 truncate max-w-xs" aria-current="page">
              {article.title}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ArticleContent article={articleWithFullContent} />
          </div>
          <aside className="lg:col-span-1">
            <ArticleSidebar category={article.category} currentArticleId={article.id} />
          </aside>
        </div>
      </article>
    </>
  );
}
