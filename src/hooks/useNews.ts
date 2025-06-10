
import { useState, useEffect } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';
import { useLanguage } from '@/context/LanguageContext';
import { 
  NewsItem, 
  fetchNewsByLanguageAndCountry, 
  fetchNewsFromSource, 
  searchNews, 
  filterNewsBySourceId,
  getSourcesByLanguageAndCountry 
} from '@/services/newsService';

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
  const { lang } = useLanguage();

  // Fonction pour extraire l'image AVANT le nettoyage HTML
  const extractImageBeforeClean = (item: NewsItem): string | null => {
    // Priorité : thumbnail existant
    if (item.thumbnail) {
      return item.thumbnail;
    }
    
    // Sinon, l'extraction a déjà été faite dans newsService.ts
    return null;
  };

  // Nettoyer le HTML de manière sélective (préserver les infos d'image)
  const sanitizeHtmlPreservingImages = (html: string): string => {
    if (!html) return '';
    
    // D'abord extraire les URLs d'images avant de nettoyer
    const imgUrls: string[] = [];
    const imgMatches = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi);
    if (imgMatches) {
      imgMatches.forEach(match => {
        const srcMatch = match.match(/src=["']([^"']+)["']/);
        if (srcMatch) {
          imgUrls.push(srcMatch[1]);
        }
      });
    }
    
    // Nettoyer le HTML
    const cleaned = html.replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .trim();
    
    // Ajouter les URLs d'images en commentaire pour référence future si nécessaire
    if (imgUrls.length > 0) {
      console.log('Images extraites avant nettoyage:', imgUrls);
    }
    
    return cleaned;
  };

  // Charger les actualités selon l'onglet actif et la langue
  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Chargement des actualités pour ${activeTab} en ${lang}${activeSource ? ` depuis ${activeSource}` : ''}`);
        
        let newsData: NewsItem[];
        
        if (activeSource) {
          newsData = await fetchNewsFromSource(activeSource);
          trackEvent('article_view', { source: activeSource, language: lang });
        } else {
          newsData = await fetchNewsByLanguageAndCountry(
            lang, 
            activeTab === 'maroc' ? 'ma' : 'global'
          );
          trackEvent('article_view', { category: activeTab, language: lang });
        }
        
        // Nettoyer le contenu HTML APRÈS extraction d'image
        newsData = newsData.map(item => {
          const extractedImage = extractImageBeforeClean(item);
          
          return {
            ...item,
            // Utiliser l'image extraite ou celle déjà présente
            thumbnail: extractedImage || item.thumbnail,
            description: item.description ? sanitizeHtmlPreservingImages(item.description) : 'Pas de description disponible',
            content: item.content ? sanitizeHtmlPreservingImages(item.content) : ''
          };
        });
        
        console.log(`Chargé ${newsData.length} actualités en ${lang}`);
        console.log('Premiers articles avec images:', newsData.slice(0, 3).map(item => ({
          title: item.title.substring(0, 50),
          thumbnail: item.thumbnail
        })));
        
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
  }, [activeTab, activeSource, lang, trackEvent]);

  // Charger l'article vedette depuis SNRT News selon la langue
  useEffect(() => {
    const loadFeaturedArticle = async () => {
      try {
        console.log(`Récupération de l'article vedette SNRT en ${lang}...`);
        
        // Utiliser la source SNRT appropriée selon la langue
        const featuredSourceId = lang === 'ar' ? 'snrtnews-ar' : 'snrtnews-fr';
        const featuredNews = await fetchNewsFromSource(featuredSourceId);
        
        if (featuredNews && featuredNews.length > 0) {
          const featured = featuredNews[0];
          console.log("Article vedette SNRT chargé:", featured.title);
          console.log("Image de l'article vedette:", featured.thumbnail);
          
          const cleanedFeatured = {
            ...featured,
            description: featured.description ? sanitizeHtmlPreservingImages(featured.description) : 'Pas de description disponible',
            content: featured.content ? sanitizeHtmlPreservingImages(featured.content) : ''
          };
          
          setFeaturedArticle(cleanedFeatured);
        } else {
          console.log("Aucun article vedette trouvé depuis SNRT News");
        }
      } catch (err) {
        console.warn('Erreur lors du chargement de l\'article vedette SNRT:', err);
        // Pas d'affichage d'erreur pour l'article vedette
      }
    };
    
    loadFeaturedArticle();
  }, [lang]); // Dépendance sur lang pour changer de source selon la langue

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
      trackEvent('search', { query, language: lang });
    }
  };

  // Obtenir les sources disponibles pour la langue et l'onglet actuels
  const getAvailableSources = () => {
    return getSourcesByLanguageAndCountry(lang, activeTab === 'maroc' ? 'ma' : 'global');
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
    featuredLoading: loading && !featuredArticle,
    availableSources: getAvailableSources()
  };
}
