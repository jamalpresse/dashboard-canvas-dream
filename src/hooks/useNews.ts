import { useState, useEffect } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';
import { NewsItem, fetchNewsByCountry, fetchNewsFromSource, searchNews, filterNewsBySourceId } from '@/services/newsService';
import { toast } from "@/components/ui/sonner";

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
        
        // Clean HTML tags from descriptions and content
        newsData = newsData.map(item => ({
          ...item,
          description: item.description ? sanitizeHtml(item.description) : 'Pas de description disponible',
          content: item.content ? sanitizeHtml(item.content) : ''
        }));
        
        setNews(newsData);
        applyFilters(newsData, searchQuery, activeSource);
      } catch (err) {
        console.error('Error loading news:', err);
        setError('Une erreur est survenue lors du chargement des actualités');
        toast.error('Erreur de chargement des actualités');
      } finally {
        setLoading(false);
      }
    };
    
    loadNews();
  }, [activeTab, activeSource, trackEvent]);

  // Load featured SNRT article
  useEffect(() => {
    const loadFeaturedArticle = async () => {
      setLoading(true);
      try {
        console.log("Fetching SNRT featured article...");
        const snrtNews = await fetchNewsFromSource('snrt');
        console.log("SNRT News fetched:", snrtNews);
        
        if (snrtNews && snrtNews.length > 0) {
          // Get the first article as the featured one
          const featured = snrtNews[0];
          
          // Debug the article structure
          console.log("Featured Article Full Structure:", JSON.stringify(featured, null, 2));
          console.log("Featured Article Image Sources:", {
            thumbnail: featured.thumbnail,
            enclosure: featured.enclosure,
          });
          
          // Clean HTML from content
          const cleanedFeatured = {
            ...featured,
            description: featured.description ? sanitizeHtml(featured.description) : 'Pas de description disponible',
            content: featured.content ? sanitizeHtml(featured.content) : ''
          };
          
          setFeaturedArticle(cleanedFeatured);
        } else {
          console.log("No SNRT articles found");
        }
      } catch (err) {
        console.error('Error loading featured article:', err);
        // We don't show an error toast here to avoid double error messages
      } finally {
        setLoading(false);
      }
    };
    
    loadFeaturedArticle();
  }, []);

  // Sanitize HTML content
  const sanitizeHtml = (html: string): string => {
    // Basic HTML tag removal
    return html.replace(/<\/?[^>]+(>|$)/g, "")
      // Replace HTML entities
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .trim();
  };

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
