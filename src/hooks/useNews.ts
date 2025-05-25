
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
  const [featuredArticle, setFeaturedArticle] = useState<NewsItem | null>(null);
  const { trackEvent } = useAnalytics();

  // Load news based on active tab with improved error handling
  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Loading news for ${activeTab}${activeSource ? ` from ${activeSource}` : ''}`);
        
        let newsData: NewsItem[];
        
        if (activeSource) {
          newsData = await fetchNewsFromSource(activeSource);
          trackEvent('article_view', { source: activeSource });
        } else {
          newsData = await fetchNewsByCountry(activeTab === 'maroc' ? 'ma' : 'global');
          trackEvent('article_view', { category: activeTab });
        }
        
        // Clean HTML tags from descriptions and content
        newsData = newsData.map(item => ({
          ...item,
          description: item.description ? sanitizeHtml(item.description) : 'Pas de description disponible',
          content: item.content ? sanitizeHtml(item.content) : ''
        }));
        
        console.log(`Loaded ${newsData.length} news items`);
        setNews(newsData);
        applyFilters(newsData, searchQuery, activeSource);
        
        // Only set error if we have no news at all
        if (newsData.length === 0) {
          setError('Aucune actualité disponible pour le moment');
        }
      } catch (err) {
        console.error('Error loading news:', err);
        setError('Erreur lors du chargement des actualités');
        setNews([]);
        setFilteredNews([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadNews();
  }, [activeTab, activeSource, trackEvent]);

  // Load featured SNRT article with improved error handling
  useEffect(() => {
    const loadFeaturedArticle = async () => {
      try {
        console.log("Fetching SNRT featured article...");
        const snrtNews = await fetchNewsFromSource('snrt');
        
        if (snrtNews && snrtNews.length > 0) {
          const featured = snrtNews[0];
          console.log("Featured article loaded:", featured.title);
          
          // Clean HTML from content
          const cleanedFeatured = {
            ...featured,
            description: featured.description ? sanitizeHtml(featured.description) : 'Pas de description disponible',
            content: featured.content ? sanitizeHtml(featured.content) : ''
          };
          
          setFeaturedArticle(cleanedFeatured);
        } else {
          console.log("No SNRT articles found for featured article");
          // Don't set error here, just use fallback in UI
        }
      } catch (err) {
        console.warn('Error loading featured article:', err);
        // Don't show error toast here, let the UI handle fallback
      }
    };
    
    loadFeaturedArticle();
  }, []);

  // Sanitize HTML content
  const sanitizeHtml = (html: string): string => {
    return html.replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .trim();
  };

  // Apply filters
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

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(news, query, activeSource);
    
    if (query) {
      trackEvent('search', { query });
    }
  };

  return {
    news: filteredNews.length > 0 ? filteredNews : news,
    loading,
    error,
    activeTab,
    setActiveTab,
    activeSource,
    setActiveSource,
    searchQuery,
    handleSearch,
    featuredArticle,
    featuredLoading: loading && !featuredArticle
  };
}
