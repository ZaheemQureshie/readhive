'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useArticles, Article } from '@/hooks/use-articles';
import { Header } from '@/components/Header';
import { ArrowLeft, ExternalLink, Loader2, BookmarkCheck } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function ReadArticle() {
  const { id } = useParams();
  const router = useRouter();
  const { getArticle, isLoaded } = useArticles();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (isLoaded) {
      const found = getArticle(id as string);
      if (found) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setArticle(found);
      } else {
        router.push('/');
      }
    }
  }, [id, isLoaded, getArticle, router]);

  if (!isLoaded || !article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="w-12 h-12 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#E4E3E0]">
      <Header />
      
      <div className="bg-white border-b-4 border-black sticky top-[68px] z-40 print:hidden">
        <div className="max-w-4xl mx-auto p-4 flex flex-wrap gap-4 justify-between items-center">
          <Link 
            href="/"
            className="flex items-center gap-2 font-bold uppercase hover:bg-[#00FF00] px-4 py-2 border-2 border-transparent hover:border-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to List
          </Link>
          
          <div className="flex gap-4">
            <a 
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-bold uppercase hover:bg-[#00FF00] px-4 py-2 border-2 border-transparent hover:border-black transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              Original
            </a>
            <div className="flex items-center gap-2 font-bold uppercase bg-[#00FF00] px-4 py-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <BookmarkCheck className="w-5 h-5" />
              Saved to Library
            </div>
          </div>
        </div>
      </div>

      <main id="article-container" className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8 md:p-12 bg-white my-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] print:shadow-none print:border-none print:m-0 print:p-0">
        <article className="prose-brutal">
          <header className="mb-12 border-b-4 border-black pb-8">
            <h1 className="text-4xl sm:text-6xl font-display font-black uppercase tracking-tighter leading-none mb-6">
              {article.title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm font-bold uppercase tracking-widest text-[#6b7280]">
              {article.siteName && <span>{article.siteName}</span>}
              <span>Saved on {format(article.dateSaved, 'MMM d, yyyy')}</span>
            </div>
          </header>
          
          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </main>
    </div>
  );
}
