import { Category, ProcessedArticle, SeoData } from '@/types';

// Leggi la chiave al momento dell'uso, non all'import
const getOpenAIKey = () => process.env.OPENAI_API_KEY || '';

interface OpenAIResponse {
  id: string;
  choices: {
    message: {
      content: string;
    };
  }[];
  error?: {
    message: string;
  };
}

function cleanAIResponse(content: string): string {
  return content
    .replace(/^```json\s*/i, '')
    .replace(/```\s*$/i, '')
    .replace(/^```\s*/i, '')
    .trim();
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 80);
}

async function callOpenAI(prompt: string, maxTokens: number = 2000): Promise<string | null> {
  const OPENAI_API_KEY = getOpenAIKey();
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key not configured');
    return null;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getOpenAIKey()}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Sei un giornalista professionista italiano esperto. Rispondi SOLO con il contenuto richiesto, senza preamboli o spiegazioni.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', response.status, errorData);
      return null;
    }

    const data: OpenAIResponse = await response.json();
    
    if (data.error) {
      console.error('OpenAI returned error:', data.error.message);
      return null;
    }

    return data.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return null;
  }
}

export async function rewriteArticle(
  originalTitle: string,
  originalContent: string,
  category: Category,
  sourceName: string
): Promise<{ title: string; content: string; excerpt: string } | null> {
  const prompt = `
Riscrivi completamente questa notizia in italiano, rendendola UNICA e ORIGINALE.

TITOLO ORIGINALE: ${originalTitle}
CONTENUTO ORIGINALE: ${originalContent}
CATEGORIA: ${category}
FONTE: ${sourceName}

ISTRUZIONI STRICT:
1. NON copiare mai frasi dall'originale
2. Scrivi un titolo NUOVO, accattivante e SEO-friendly (minimo 8 parole, massimo 15)
3. Inizia con un hook forte che catturi l'attenzione
4. Riscrivi il contenuto cambiando completamente struttura e parole
5. Aggiungi dettagli, contesto e spiegazioni extra
6. Usa un tono giornalistico professionale
7. MINIMO 400 parole nel contenuto
8. Organizza in paragrafi chiari con sottotitoli
9. Concludi con una riflessione o implicazioni future

Formato richiesto:
TITOLO: [titolo riscritto]
CONTENUTO: [contenuto completo in italiano]
ESTRATTO: [riassunto di 2-3 frasi max 200 caratteri]
`;

  const result = await callOpenAI(prompt, 2500);
  
  if (!result) {
    return null;
  }

  const titleMatch = result.match(/TITOLO:\s*(.+?)(?=\n|$)/i);
  const contentMatch = result.match(/CONTENUTO:\s*([\s\S]+?)(?=ESTRATTO:|$)/i);
  const excerptMatch = result.match(/ESTRATTO:\s*(.+?)(?=\n|$)/i);

  const title = titleMatch?.[1]?.trim() || originalTitle;
  const content = contentMatch?.[1]?.trim() || result;
  const excerpt = excerptMatch?.[1]?.trim() || content.substring(0, 200) + '...';

  if (content.length < 400) {
    console.warn('Generated content is too short, attempting to expand...');
    const expandedContent = await expandContent(content, title);
    if (expandedContent) {
      return { title, content: expandedContent, excerpt };
    }
  }

  return { title, content, excerpt };
}

async function expandContent(content: string, title: string): Promise<string | null> {
  const prompt = `
Espandi questo articolo giornalistico per raggiungere almeno 400 parole.

TITOLO: ${title}
CONTENUTO ATTUALE: ${content}

Aggiungi:
1. Più dettagli sul contesto
2. Analisi delle implicazioni
3. Prospettive future
4. Citazioni o dati (ipotetici ma realistici)

Mantieni il tono giornalistico professionale.
`;

  const result = await callOpenAI(prompt, 1500);
  return result || null;
}

export async function generateSEOData(title: string, content: string, category: Category): Promise<SeoData> {
  const prompt = `
Genera dati SEO ottimizzati per questo articolo in italiano.

TITOLO: ${title}
CONTENUTO (primi 500 caratteri): ${content.substring(0, 500)}
CATEGORIA: ${category}

Genera in formato JSON esatto:
{
  "metaTitle": "titolo per meta tag (max 60 char)",
  "metaDescription": "descrizione SEO (max 160 char, invogliante)",
  "keywords": ["parola-chiave-1", "parola-chiave-2", "parola-chiave-3", "parola-chiave-4", "parola-chiave-5"],
  "slug": "url-slug-ottimizzato"
}

Regole:
- metaTitle: includi parole chiave principali, max 60 caratteri
- metaDescription: compelling, con call-to-action implicita, max 160 caratteri
- keywords: esattamente 5 parole chiave rilevanti
- slug: in italiano, parole separate da trattini, max 80 caratteri
`;

  const result = await callOpenAI(prompt, 800);
  
  if (!result) {
    const fallbackSlug = generateSlug(title);
    return {
      title: title.substring(0, 60),
      description: content.substring(0, 157) + '...',
      keywords: [category, 'notizie', 'ultime news', 'informazione', 'attualità'],
      slug: fallbackSlug,
    };
  }

  try {
    const cleaned = cleanAIResponse(result);
    const parsed = JSON.parse(cleaned);
    
    return {
      title: parsed.metaTitle || title.substring(0, 60),
      description: parsed.metaDescription || content.substring(0, 157) + '...',
      keywords: parsed.keywords || [category, 'notizie', 'ultime news'],
      slug: parsed.slug || generateSlug(title),
    };
  } catch (error) {
    console.error('Error parsing SEO data:', error);
    return {
      title: title.substring(0, 60),
      description: content.substring(0, 157) + '...',
      keywords: [category, 'notizie', 'ultime news', 'informazione'],
      slug: generateSlug(title),
    };
  }
}

export async function determineCategory(
  title: string,
  content: string,
  defaultCategory: Category
): Promise<Category> {
  const prompt = `
Determina la categoria più appropriata per questa notizia in italiano.

TITOLO: ${title}
CONTENUTO: ${content.substring(0, 300)}

Categorie disponibili:
- tecnologia
- intelligenza-artificiale
- business-finanza
- crypto
- attualita
- salute
- sport

Rispondi SOLO con il nome della categoria esatta.
`;

  const result = await callOpenAI(prompt, 50);
  
  if (!result) {
    return defaultCategory;
  }

  const validCategories: Category[] = [
    'tecnologia',
    'intelligenza-artificiale',
    'business-finanza',
    'crypto',
    'attualita',
    'salute',
    'sport'
  ];

  const cleaned = result.toLowerCase().trim().replace(/\s+/g, '-');
  
  if (validCategories.includes(cleaned as Category)) {
    return cleaned as Category;
  }

  return defaultCategory;
}

export async function processArticle(
  originalTitle: string,
  originalContent: string,
  originalDescription: string,
  sourceUrl: string,
  sourceName: string,
  imageUrl: string | null,
  publishedAt: string,
  suggestedCategory: Category
): Promise<ProcessedArticle | null> {
  const fullContent = originalContent || originalDescription || '';
  
  if (!validateContentForRewrite(fullContent)) {
    console.error('Content too short or invalid for rewriting');
    return null;
  }

  const rewritten = await rewriteArticle(originalTitle, fullContent, suggestedCategory, sourceName);
  
  if (!rewritten) {
    console.error('Failed to rewrite article');
    return null;
  }

  const [finalCategory, seoData] = await Promise.all([
    determineCategory(rewritten.title, rewritten.content, suggestedCategory),
    generateSEOData(rewritten.title, rewritten.content, suggestedCategory)
  ]);

  return {
    originalTitle,
    rewrittenTitle: rewritten.title,
    content: rewritten.content,
    excerpt: rewritten.excerpt,
    category: finalCategory,
    slug: seoData.slug,
    metaTitle: seoData.title,
    metaDescription: seoData.description,
    keywords: seoData.keywords,
    sourceUrl,
    sourceName,
    imageUrl,
    publishedAt
  };
}

function validateContentForRewrite(content: string): boolean {
  if (!content || content.length < 50) return false; // Abbassato da 100 a 50
  if (content.includes('[Removed]')) return false;
  return true;
}

export { generateSlug };
