import { load } from 'cheerio';

export async function fetchFullArticle(url: string): Promise<string | null> {
  try {
    console.log(`Scraping full article from: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch: ${response.status}`);
      return null;
    }

    const html = await response.text();
    const $ = load(html);

    // Rimuovi elementi non necessari
    $('script, style, nav, header, footer, aside, .advertisement, .ads, .social-share, .comments').remove();

    // Cerca contenuto articolo con selettori comuni
    const contentSelectors = [
      'article',
      '[role="main"]',
      '.article-content',
      '.article-body',
      '.story-content',
      '.post-content',
      '.entry-content',
      '.content-body',
      '.article__body',
      '.c-article__content',
      '.article-body-content',
      'main article',
      '.news-article-content',
      '.article-text',
      '.story-body',
      '.body-copy'
    ];

    let content = '';

    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0 && element.text().trim().length > 500) {
        content = element.html() || '';
        break;
      }
    }

    // Se non trovato con selettori, prendi i paragrafi principali
    if (!content || content.length < 500) {
      const paragraphs: string[] = [];
      $('p').each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 50) {
          paragraphs.push(`<p>${text}</p>`);
        }
      });
      
      if (paragraphs.length > 0) {
        content = paragraphs.slice(0, 20).join('\n');
      }
    }

    // Pulizia del contenuto
    content = content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/class="[^"]*"/g, '')
      .replace(/style="[^"]*"/g, '')
      .replace(/data-[a-z-]+="[^"]*"/g, '');

    const textContent = content.replace(/<[^>]*>/g, ' ').trim();
    
    if (textContent.length < 200) {
      console.log('Content too short after scraping');
      return null;
    }

    console.log(`Scraped ${textContent.length} characters`);
    return content;

  } catch (error) {
    console.error('Error scraping article:', error);
    return null;
  }
}
