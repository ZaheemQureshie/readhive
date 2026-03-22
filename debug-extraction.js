const { Window } = require('happy-dom');
const { Readability } = require('@mozilla/readability');
const fetch = require('node-fetch');

async function testFetchAndParse(url) {
  try {
    console.log('Fetching URL:', url);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
        console.error('Fetch failed:', response.status, response.statusText);
        return;
    }

    let html = await response.text();
    console.log('HTML received, length:', html.length);
    
    // Clean up HTML before passing to happy-dom to reduce noise
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    
    const fs = require('fs');
    fs.writeFileSync('freedium_clean.html', html);

    const window = new Window({ url });
    window.document.write(html);
    
    // Try to find a main container if Readability is likely to fail
    let contentElement = window.document.body;
    const mainSelectors = ['.main-content', 'main', 'article', '#content', '.post-content'];
    for (const selector of mainSelectors) {
        const found = window.document.querySelector(selector);
        if (found) {
            console.log('Found potential main container:', selector);
            // We don't necessarily want to switch yet, but good to know
        }
    }

    const reader = new Readability(window.document);
    const article = reader.parse();

    if (!article) {
      console.error('FAILED: Readability could not parse the article.');
    } else {
      console.log('SUCCESS:');
      console.log('Title:', article.title);
      console.log('Content Length:', article.content ? article.content.length : 0);
    }
  } catch (error) {
    console.error('Error during test:', error);
  }
}

const targetUrl = 'https://freedium-mirror.cfd/https://infosecwriteups.com/my-5-minute-workflow-to-find-bugs-on-any-website-c20075320c96';
testFetchAndParse(targetUrl);
