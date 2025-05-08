
import { useState, useEffect } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';
import { NewsItem, fetchNewsByCountry, fetchNewsFromSource, searchNews, filterNewsBySourceId } from '@/services/newsService';

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'maroc' | 'monde'>('maroc');
  const [activeSource, setActiveSource] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { trackEvent } = useAnalytics();

  // Charger les actualités en fonction de l'onglet actif
  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let newsData: NewsItem[];
        
        if (activeSource) {
          newsData = await fetchNewsFromSource(activeSource);
          trackEvent('article_view', { source: activeSource });
        } else {
          newsData = await fetchNewsByCountry(activeTab === 'maroc' ? 'ma' : 'global');
          trackEvent('article_view', { category: activeTab });
        }
        
        setNews(newsData);
        applyFilters(newsData, searchQuery, activeSource);
      } catch (err) {
        console.error('Error loading news:', err);
        setError('Une erreur est survenue lors du chargement des actualités');
      } finally {
        setLoading(false);
      }
    };
    
    loadNews();
  }, [activeTab, activeSource, trackEvent]);

  // Appliquer les filtres (recherche et source)
  const applyFilters = (newsItems: NewsItem[], query: string, source: string | null) => {
    let filtered = newsItems;
    
    if (query) {
      filtered = searchNews(filtered, query);
    }
    
    if (source) {
      filtered = filterNewsBySourceId(filtered, source);
    }
    
    setFilteredNews(filtered);
  };

  // Mettre à jour la recherche
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(news, query, activeSource);
    
    if (query) {
      trackEvent('search', { query });
    }
  };

  return {
    news: filteredNews,
    loading,
    error,
    activeTab,
    setActiveTab,
    activeSource,
    setActiveSource,
    searchQuery,
    handleSearch
  };
}
