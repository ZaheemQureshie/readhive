import { useState, useEffect } from 'react';

export interface Article {
  id: string;
  url: string;
  title: string;
  excerpt: string;
  siteName: string;
  content: string;
  dateSaved: number;
}

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadArticles = () => {
      const stored = localStorage.getItem('readhive_articles');
      if (stored) {
        try {
          setArticles(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse articles from local storage', e);
        }
      }
    };

    loadArticles();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'readhive_articles') {
        loadArticles();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    setIsLoaded(true);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveArticle = (article: Omit<Article, 'id' | 'dateSaved'>) => {
    const newArticle: Article = {
      ...article,
      id: crypto.randomUUID(),
      dateSaved: Date.now(),
    };
    const updated = [newArticle, ...articles];
    setArticles(updated);
    localStorage.setItem('readhive_articles', JSON.stringify(updated));
    return newArticle;
  };

  const deleteArticle = (id: string) => {
    const updated = articles.filter((a) => a.id !== id);
    setArticles(updated);
    localStorage.setItem('readhive_articles', JSON.stringify(updated));
  };

  const getArticle = (id: string) => {
    return articles.find((a) => a.id === id);
  };

  return {
    articles,
    isLoaded,
    saveArticle,
    deleteArticle,
    getArticle,
  };
}
