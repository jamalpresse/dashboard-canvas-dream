import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, AlertCircle, Search } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { NewsCard } from "@/components/news/NewsCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useNews } from "@/hooks/useNews";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatNewsDate } from "@/services/newsService";
import { N8nImageGeneration } from "@/components/image-generation/N8nImageGeneration";
import { HeroNews } from "@/components/news/HeroNews";
import { NewsGrid } from "@/components/news/NewsGrid";
import { FlashNews, FlashNewsItem } from "@/components/news/FlashNews";
import { LanguageSelector } from "@/components/common/LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const {
    lang,
    t,
    isRTL,
    dir
  } = useLanguage();
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [flashNews, setFlashNews] = useState<FlashNewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Use the useNews hook to fetch news data
  const {
    news,
    loading: newsLoading,
    error: newsError,
    activeTab,
    setActiveTab,
    featuredArticle,
    featuredLoading
  } = useNews();

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

  // Get news items for grid only with validation
  const gridNews = news && Array.isArray(news) ? news.slice(0, 6) : [];

  // Render loading skeletons while data is fetching
  if (isLoading) {
    return <LoadingState />;
  }

  // Render error state if there's an error
  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="space-y-4 w-full">
      <div className="animate-fade-in">
        {/* Header with language selector */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold font-playfair text-white">{t('dashboard', 'welcome')}</h1>
          <LanguageSelector />
        </div>
        
        {/* Main Content Layout - Removed grid gap and adjusted spacing */}
        <div className="w-full mt-3">
          {/* Features Buttons - Enlarged and full width */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <Link to="/search" className="bg-snrt-red hover:bg-red-700 text-white font-semibold text-xl py-8 px-4 rounded-lg shadow-lg text-center transition duration-300 flex items-center justify-center">
              <span>{t('dashboard', 'search')}</span>
            </Link>

            <Link to="/improve" className="bg-snrt-red hover:bg-red-700 text-white font-semibold text-xl py-8 px-4 rounded-lg shadow-lg text-center transition duration-300 flex items-center justify-center">
              {t('dashboard', 'improve')}
            </Link>

            <Link to="/translation" className="bg-snrt-red hover:bg-red-700 text-white font-semibold text-xl py-8 px-4 rounded-lg shadow-lg text-center transition duration-300 flex items-center justify-center">
              {t('dashboard', 'translate')}
            </Link>
          </div>
          
          {/* Image Generation Button - Enlarged */}
          <Link to="/image-generation" className="flex w-full bg-snrt-red hover:bg-red-700 text-white font-semibold text-xl py-8 px-4 rounded-lg shadow-lg text-center transition duration-300 justify-center items-center mb-3">
            <span>{t('dashboard', 'imageGeneration')}</span>
          </Link>

          {/* Hero Section */}
          {featuredLoading ? (
            <div className="bg-card rounded-lg shadow-sm h-[300px] md:h-[400px] animate-pulse flex items-center justify-center mb-3">
              <p className="text-gray-400">{t('common', 'loading')}</p>
            </div>
          ) : featuredArticle ? (
            <HeroNews 
              title={featuredArticle.title || "Actualité SNRT"} 
              imageUrl={featuredArticle.enclosure?.link || featuredArticle.thumbnail || ""} 
              content={featuredArticle.content || featuredArticle.description || ""}
              category="SNRT News" 
              timestamp={formatNewsDate(featuredArticle.pubDate)} 
              link={featuredArticle.link} 
            />
          ) : (
            <HeroNews 
              title="Actualité SNRT" 
              imageUrl="/lovable-uploads/32ff14e9-af71-4640-b4c9-583985037c66.png" 
              category="SNRT News" 
            />
          )}

          {/* News Section with Tabs */}
          <div className="mt-3">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold font-playfair text-white">
                {t('dashboard', 'latestNews')}
              </h2>
              <Link to="/news" className={`px-6 py-2 bg-snrt-red text-white rounded-full flex items-center gap-1 text-sm font-medium hover:bg-red-700 transition-all duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {t('categories', 'viewMore')} 
                <ArrowRight className={`h-4 w-4 animate-pulse ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
            </div>
            
            {/* News Tabs - Enlarged */}
            <Tabs value={activeTab} onValueChange={value => setActiveTab(value as 'maroc' | 'monde')} className="mb-3">
              <TabsList className="w-fit bg-card shadow-sm border border-gray-800 p-2 rounded-full">
                <TabsTrigger value="maroc" className="text-base rounded-full data-[state=active]:bg-snrt-red data-[state=active]:text-white px-6 py-2">
                  <span className="mr-1 text-lg">🇲🇦</span> {t('categories', 'maroc')}
                </TabsTrigger>
                <TabsTrigger value="monde" className="text-base rounded-full data-[state=active]:bg-snrt-red data-[state=active]:text-white px-6 py-2">
                  <Globe className="h-4 w-4 mr-2" /> {t('categories', 'monde')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* News Grid */}
            {newsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-card rounded-lg shadow-sm p-4 h-[180px] animate-pulse">
                    <div className="h-5 bg-gray-700 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded mb-4 w-1/2"></div>
                    <div className="h-16 bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            ) : newsError ? (
              <div className="bg-red-900/30 border border-red-900 rounded-lg p-4 text-center">
                <div className="flex justify-center items-center mb-2">
                  <AlertCircle className="h-5 w-5 text-snrt-red mr-2" />
                  <p className="text-red-400 font-medium">{t('common', 'loadingError')}</p>
                </div>
                <p className="text-red-300">{newsError}</p>
              </div>
            ) : !gridNews || gridNews.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400">{t('common', 'noResults')}</p>
              </div>
            ) : (
              <NewsGrid news={gridNews} />
            )}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }

          @keyframes pulse {
            0%, 100% { transform: translateX(0px); }
            50% { transform: translateX(3px); }
          }
          
          .animate-pulse {
            animation: pulse 1.5s infinite;
          }
        `}
      </style>
    </div>
  );
};

// Loading state component
const LoadingState = () => {
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20" />)}
          </div>
          <Skeleton className="h-20" />
          <Skeleton className="h-[300px]" />
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-[180px]" />)}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-[400px]" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20" />)}
          </div>
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    </div>;
};

// Error state component
const ErrorState = ({
  message
}: {
  message: string;
}) => {
  return <div className="flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-md bg-card p-6 rounded-lg border border-red-800 shadow-lg text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Erreur de chargement</h2>
        <p className="text-gray-300 mb-4">{message}</p>
        <Button variant="destructive" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    </div>;
};

export default Index;

}
