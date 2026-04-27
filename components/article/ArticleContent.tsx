import Image from 'next/image';
import { Article, Category } from '@/types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface ArticleContentProps {
  article: Article;
}

// Strip HTML tags and clean content
function stripHtml(html: string): string {
  if (!html) return '';
  // Remove script and style tags with their content
  let cleaned = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  // Replace common block elements with newlines
  cleaned = cleaned.replace(/<\/p>/gi, '\n\n');
  cleaned = cleaned.replace(/<br\s*\/?>/gi, '\n');
  cleaned = cleaned.replace(/<\/div>/gi, '\n');
  cleaned = cleaned.replace(/<\/h[1-6]>/gi, '\n\n');
  // Remove all remaining HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, '');
  // Decode common HTML entities
  cleaned = cleaned.replace(/&nbsp;/g, ' ');
  cleaned = cleaned.replace(/&amp;/g, '&');
  cleaned = cleaned.replace(/&lt;/g, '<');
  cleaned = cleaned.replace(/&gt;/g, '>');
  cleaned = cleaned.replace(/&quot;/g, '"');
  cleaned = cleaned.replace(/&#39;/g, "'");
  // Clean up whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.trim();
  return cleaned;
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

const categoryColors: Record<Category, string> = {
  'tecnologia': 'bg-blue-600',
  'intelligenza-artificiale': 'bg-purple-600',
  'business-finanza': 'bg-green-600',
  'crypto': 'bg-yellow-600',
  'attualita': 'bg-red-600',
  'salute': 'bg-pink-600',
  'sport': 'bg-cyan-600',
};

export function ArticleContent({ article }: ArticleContentProps) {
  // Clean HTML content and split into paragraphs
  const cleanContent = stripHtml(article.content);
  const paragraphs = cleanContent.split('\n\n').filter(p => p.trim().length > 0);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {article.image_url && (
        <div className="relative h-64 md:h-96 w-full">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
      
      <div className="p-6 md:p-8">
        <div className="flex items-center space-x-3 mb-4">
          <a
            href={`/${article.category}`}
            className={`inline-block px-3 py-1 ${categoryColors[article.category]} text-white text-xs font-semibold uppercase tracking-wider rounded`}
          >
            {categoryNames[article.category]}
          </a>
          <span className="text-gray-500 text-sm">
            {format(new Date(article.published_at), 'd MMMM yyyy', { locale: it })}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-6">
          {article.title}
        </h1>

        <div className="flex items-center justify-between py-4 border-y border-gray-200 mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Da:</span>
            <span className="font-medium">{article.source_name || 'Fonte esterna'}</span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{article.views} letture</span>
            </span>
          </div>
        </div>

        <div className="prose prose-lg max-w-none article-content">
          {paragraphs.map((paragraph, index) => {
            if (paragraph.startsWith('# ')) {
              return <h1 key={index} className="text-2xl font-bold mt-8 mb-4">{paragraph.replace('# ', '')}</h1>;
            }
            if (paragraph.startsWith('## ')) {
              return <h2 key={index} className="text-xl font-semibold mt-6 mb-3">{paragraph.replace('## ', '')}</h2>;
            }
            if (paragraph.startsWith('### ')) {
              return <h3 key={index} className="text-lg font-semibold mt-4 mb-2">{paragraph.replace('### ', '')}</h3>;
            }
            return <p key={index} className="mb-4 leading-relaxed text-gray-700">{paragraph}</p>;
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {article.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4">
            <span className="text-gray-600 font-medium">Condividi:</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://yoursite.com/article/${article.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              aria-label="Condividi su Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://yoursite.com/article/${article.slug}`)}&text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
              aria-label="Condividi su Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 00-2.163-2.723c-.951-.538-2.106-.657-3.093-.341a4.92 4.92 0 00-2.933 2.51c-.213.452-.284.95-.206 1.437a10.006 10.006 0 01-7.277-3.702 4.978 4.978 0 00-.688 2.503c0 1.744.89 3.282 2.239 4.18a4.92 4.92 0 01-2.24-.62v.062a4.968 4.968 0 003.978 4.87 4.925 4.925 0 01-2.24.085 4.935 4.935 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${article.title} https://yoursite.com/article/${article.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              aria-label="Condividi su WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
