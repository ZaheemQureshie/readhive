'use client';

import { useState } from 'react';
import { useArticles } from '@/hooks/use-articles';
import { Header } from '@/components/Header';
import Link from 'next/link';
import { Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Home() {
  const { articles, isLoaded, saveArticle, deleteArticle } = useArticles();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to extract article');
      }

      saveArticle({
        url: data.url,
        title: data.title || 'Untitled Article',
        excerpt: data.excerpt || '',
        siteName: data.siteName || new URL(data.url).hostname,
        content: data.content || '',
      });

      setUrl('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8">
        <section className="mb-12">
          <h1 className="text-5xl sm:text-7xl font-display font-black uppercase tracking-tighter mb-4 leading-none">
            Readhive
          </h1>
          <p className="text-xl sm:text-2xl font-bold mb-8 uppercase max-w-2xl">
            Collect articles. Read freely. Save them to your local library for ad-free offline-ready reading.
          </p>
          
          <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-4">
            <input
              type="url"
              placeholder="PASTE URL HERE..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="flex-1 border-4 border-black bg-white p-4 text-xl font-bold placeholder:text-[#9ca3af] focus:outline-none focus:ring-4 focus:ring-[#00FF00] focus:border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="border-4 border-black bg-[#00FF00] text-black px-8 py-4 text-xl font-black uppercase hover:bg-black hover:text-[#00FF00] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Save'}
            </button>
          </form>
          {error && (
            <div className="mt-4 p-4 border-4 border-black bg-[#ef4444] text-white font-bold uppercase">
              Error: {error}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-3xl font-display font-black uppercase border-b-4 border-black pb-2 mb-6">
            Saved Articles
          </h2>
          
          {!isLoaded ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-12 h-12 animate-spin" />
            </div>
          ) : articles.length === 0 ? (
            <div className="border-4 border-black border-dashed p-12 text-center text-xl font-bold text-[#6b7280] uppercase">
              No articles saved yet.
            </div>
          ) : (
            <div className="grid gap-6">
              {articles.map((article) => (
                <article key={article.id} className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all group flex flex-col sm:flex-row gap-6 relative">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 text-sm font-bold uppercase tracking-widest text-[#6b7280]">
                      <span>{article.siteName}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(article.dateSaved, { addSuffix: true })}</span>
                    </div>
                    <h3 className="text-2xl font-display font-black leading-tight mb-3 group-hover:underline decoration-4 underline-offset-4 decoration-[#00FF00]">
                      <Link href={`/read/${article.id}`} className="before:absolute before:inset-0">
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-[#374151] line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="flex sm:flex-col justify-between items-end sm:items-center gap-4 relative z-10">
                    <Link 
                      href={`/read/${article.id}`}
                      className="w-12 h-12 flex items-center justify-center border-4 border-black bg-[#00FF00] hover:bg-black hover:text-[#00FF00] transition-colors rounded-full"
                    >
                      <ArrowRight className="w-6 h-6" />
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deleteArticle(article.id);
                      }}
                      className="w-12 h-12 flex items-center justify-center border-4 border-black bg-[#ef4444] text-white hover:bg-black transition-colors"
                      title="Delete Article"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
