
import { useState, useEffect } from "react";
import { Search, AlertCircle, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useLanguage } from "@/context/LanguageContext";
import { FlashNewsItem } from "@/components/news/FlashNews";

export function useIndexStats() {
  const { lang, t, isRTL } = useLanguage();
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [flashNews, setFlashNews] = useState<FlashNewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch analytics data
        const {
          data: analyticsData,
          error: analyticsError
        } = await supabase.from('analytics').select('*').order('date', {
          ascending: true
        });
        if (analyticsError) throw analyticsError;

        // Fetch news articles
        const {
          data: articlesData,
          error: articlesError
        } = await supabase.from('news_articles').select('*').order('publication_date', {
          ascending: false
        }).limit(5);
        if (articlesError) throw articlesError;
        
        setAnalytics(analyticsData || []);
        setNewsArticles(articlesData || []);

        // Create flash news from articles - with validation
        if (articlesData && Array.isArray(articlesData) && articlesData.length > 0) {
          const flashItems: FlashNewsItem[] = articlesData.slice(0, 6).map(article => ({
            id: article?.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
            title: article?.title || t('common', 'noTitle'),
            timestamp: article?.publication_date ? new Date(article.publication_date).toLocaleTimeString(isRTL ? 'ar-MA' : 'fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            }) : '--:--',
            category: article?.category || t('dashboard', 'news')
          }));
          setFlashNews(flashItems);
        } else {
          // Use fallback data if no articles
          setFlashNews([{
            id: 'fallback-1',
            title: t('common', 'noNewsAvailable'),
            timestamp: '--:--',
            category: t('dashboard', 'news')
          }]);
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error?.message || t('common', 'errorLoading'));
        toast.error(isRTL ? "خطأ في تحميل البيانات" : "Erreur lors du chargement des données");

        // Provide fallback data when errors occur
        setAnalytics([]);
        setNewsArticles([]);
        setFlashNews([{
          id: 'error-1',
          title: t('common', 'errorLoadingNews'),
          timestamp: '--:--',
          category: t('dashboard', 'news')
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    // Wrap in try/catch to prevent any uncaught exceptions
    try {
      fetchData();
    } catch (err) {
      console.error('Uncaught error in fetchData:', err);
      setIsLoading(false);
      setError(t('common', 'unexpectedError'));
    }
  }, [lang, isRTL, t]);

  // Calculate stats from the latest analytics entry with validation
  const latestAnalytics = analytics && analytics.length ? analytics[analytics.length - 1] : null;
  const prevAnalytics = analytics && analytics.length > 1 ? analytics[analytics.length - 2] : null;
  
  const calculateTrend = (current: number, previous: number) => {
    if (!previous) return {
      value: 0,
      positive: true
    };
    const diff = current - previous;
    const percentage = Math.round(diff / previous * 100);
    return {
      value: Math.abs(percentage),
      positive: diff >= 0
    };
  };

  // Stats data for StatCard components with safe defaults
  const statsData = latestAnalytics ? [{
    title: t('dashboard', 'news'),
    value: latestAnalytics.page_view_count?.toString() || "0",
    icon: <Search className="h-5 w-5 text-white" />,
    trend: calculateTrend(latestAnalytics.page_view_count || 0, prevAnalytics?.page_view_count || 0)
  }, {
    title: isRTL ? t('dashboard', 'news') : "Articles",
    value: latestAnalytics.article_view_count?.toString() || "0",
    icon: <AlertCircle className="h-5 w-5 text-white" />,
    trend: calculateTrend(latestAnalytics.article_view_count || 0, prevAnalytics?.article_view_count || 0),
    variant: "primary" as const
  }, {
    title: t('dashboard', 'translate'),
    value: latestAnalytics.translation_count?.toString() || "0",
    icon: <Globe className="h-5 w-5 text-white" />,
    trend: calculateTrend(latestAnalytics.translation_count || 0, prevAnalytics?.translation_count || 0),
    variant: "success" as const
  }] : [];

  // Create timeline items from news articles with validation
  const timelineItems = newsArticles && Array.isArray(newsArticles) ? newsArticles.map(article => {
    if (!article) return null;
    return {
      id: article.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
      title: article.title || t('common', 'noTitle'),
      description: article.content ? article.content.substring(0, 100) + (article.content.length > 100 ? '...' : '') : t('common', 'noDescription'),
      time: article.publication_date ? new Date(article.publication_date).toLocaleDateString(isRTL ? 'ar-MA' : 'fr-FR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }) : '--:--',
      icon: <AlertCircle className="h-4 w-4 text-red-600" />,
      type: "default" as "default" | "success" | "warning" | "error"
    };
  }).filter(Boolean) : [];

  return {
    analytics,
    newsArticles,
    isLoading,
    flashNews,
    error,
    statsData,
    timelineItems
  };
}
