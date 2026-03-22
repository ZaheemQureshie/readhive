import { NextResponse } from 'next/server';
import { Readability } from '@mozilla/readability';
import { Window } from 'happy-dom';
import createDOMPurify from 'dompurify';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    console.log('Fetching URL:', url);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      next: { revalidate: 3600 } // Add some caching for production
    });

    if (!response.ok) {
      console.error('Fetch failed with status:', response.status);
      return NextResponse.json({ error: `Failed to fetch the URL: ${response.statusText}` }, { status: response.status });
    }

    let html = await response.text();
    console.log('HTML received, length:', html.length);
    
    // Clean up HTML before passing to happy-dom to reduce noise and help Readability
    // This is especially helpful for proxy sites like Freedium
    const cleanHtmlForParsing = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    // Use happy-dom instead of jsdom
    const window = new Window({ url });
    window.document.write(cleanHtmlForParsing);
    
    // Initialize DOMPurify with happy-dom
    // @ts-ignore
    const DOMPurify = createDOMPurify(window as any);
    
    // Try to parse the document
    // @ts-ignore
    let reader = new Readability(window.document as any);
    let article = reader.parse();

    // Fallback: If Readability fails, try to find a main container and parse its contents
    if (!article) {
      console.log('Readability failed on full document, trying common containers...');
      const commonContainers = ['main', 'article', '.main-content', '#content', '.post-content', '.article-content'];
      for (const selector of commonContainers) {
        const container = window.document.querySelector(selector);
        // Only try if the container has a significant amount of content
        if (container && container.innerHTML.length > 200) {
          console.log(`Trying extraction from container: ${selector}`);
          const fallbackWindow = new Window({ url });
          fallbackWindow.document.write(`<html><body>${container.innerHTML}</body></html>`);
          
          // @ts-ignore
          const subReader = new Readability(fallbackWindow.document as any);
          article = subReader.parse();
          if (article) {
            console.log(`Successfully extracted using fallback container: ${selector}`);
            break;
          }
        }
      }
    }

    if (!article) {
      console.error('Readability failed to parse article');
      return NextResponse.json({ error: 'Could not parse the article content' }, { status: 500 });
    }

    console.log('Article parsed successfully:', article.title);

    // Sanitize the HTML content
    const cleanHtml = DOMPurify.sanitize(article.content || '', {
      ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'ul', 'ol', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div', 'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img', 'figure', 'figcaption', 'blockquote', 'video', 'source', 'iframe'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel', 'width', 'height', 'controls', 'allowfullscreen', 'frameborder'],
    });

    return NextResponse.json({
      title: article.title,
      byline: article.byline,
      dir: article.dir,
      content: cleanHtml,
      textContent: article.textContent,
      length: article.length,
      excerpt: article.excerpt,
      siteName: article.siteName,
      url: url,
    });
  } catch (error: any) {
    console.error('Extraction error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
