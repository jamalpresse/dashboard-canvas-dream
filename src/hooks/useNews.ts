
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

  // Charger les actualités selon l'onglet actif
  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Chargement des actualités pour ${activeTab}${activeSource ? ` depuis ${activeSource}` : ''}`);
        
        let newsData: NewsItem[];
        
        if (activeSource) {
          newsData = await fetchNewsFromSource(activeSource);
          trackEvent('article_view', { source: activeSource });
        } else {
          newsData = await fetchNewsByCountry(activeTab === 'maroc' ? 'ma' : 'global');
          trackEvent('article_view', { category: activeTab });
        }
        
        // Nettoyer le contenu HTML
        newsData = newsData.map(item => ({
          ...item,
          description: item.description ? sanitizeHtml(item.description) : 'Pas de description disponible',
          content: item.content ? sanitizeHtml(item.content) : ''
        }));
        
        console.log(`Chargé ${newsData.length} actualités`);
        setNews(newsData);
        applyFilters(newsData, searchQuery, activeSource);
        
        // Seulement afficher une erreur si vraiment aucune actualité
        if (newsData.length === 0) {
          setError('Aucune actualité disponible. Réessayez dans quelques minutes.');
        }
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError('Problème de connexion. Vérifiez votre internet.');
        setNews([]);
        setFilteredNews([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadNews();
  }, [activeTab, activeSource, trackEvent]);

  // Charger l'article vedette (utilise Le Monde par défaut)
  useEffect(() => {
    const loadFeaturedArticle = async () => {
      try {
        console.log("Récupération de l'article vedette...");
        const featuredNews = await fetchNewsFromSource('lemonde');
        
        if (featuredNews && featuredNews.length > 0) {
          const featured = featuredNews[0];
          console.log("Article vedette chargé:", featured.title);
          
          const cleanedFeatured = {
            ...featured,
            description: featured.description ? sanitizeHtml(featured.description) : 'Pas de description disponible',
            content: featured.content ? sanitizeHtml(featured.content) : ''
          };
          
          setFeaturedArticle(cleanedFeatured);
        } else {
          console.log("Aucun article vedette trouvé");
        }
      } catch (err) {
        console.warn('Erreur lors du chargement de l\'article vedette:', err);
        // Pas d'affichage d'erreur pour l'article vedette
      }
    };
    
    loadFeaturedArticle();
  }, []);

  // Nettoyer le HTML
  const sanitizeHtml = (html: string): string => {
    return html.replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .trim();
  };

  // Appliquer les filtres
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

  // Gérer la recherche
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
