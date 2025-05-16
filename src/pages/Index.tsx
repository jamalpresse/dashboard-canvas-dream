
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, Globe, AlertCircle } from "lucide-react";
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

const Index = () => {
  const [lang, setLang] = useState("fr");
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [flashNews, setFlashNews] = useState<FlashNewsItem[]>([]);
  const isArabic = lang === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  // Use the useNews hook to fetch news data
  const {
    news,
    loading: newsLoading,
    error: newsError,
    activeTab,
    setActiveTab
  } = useNews();
  
  const labels = {
    ar: {
      title: "لوحة تحكم الصحفيين",
      subtitle: "اختر إحدى الوظائف التالية:",
      search: "🔍 البحث (بالعربية / الفرنسية)",
      improve: "🛠️ تحسين النص وتهيئة محركات البحث",
      translate: "🌍 الترجمة التلقائية",
      switchTo: "Français",
      welcome: "مرحباً بك في لوحة تحكم الصحفيين",
      greeting: "أهلاً بك في نظام المعلومات الصحفية",
      stats: "الإحصائيات",
      activity: "النشاطات الأخيرة",
      weather: "الطقس",
      analyticsTitle: "تحليلات المستخدم",
      latestNews: "آخر الأخبار",
      news: "الأخبار",
      flashNews: "أخبار عاجلة"
    },
    fr: {
      title: "Dashboard Journalistes",
      subtitle: "Choisissez une fonctionnalité ci-dessous :",
      search: "🔍 Recherche (AR / FR)",
      improve: "🛠️ Améliorer texte & SEO",
      translate: "🌍 Traduction multilingue",
      switchTo: "عربية",
      welcome: "Bienvenue au Dashboard Journalistes",
      greeting: "Bienvenue dans votre système d'information journalistique",
      stats: "Statistiques",
      activity: "Activités récentes",
      weather: "Météo",
      analyticsTitle: "Analyse de l'engagement",
      latestNews: "À LA UNE",
      news: "Actualités",
      flashNews: "Flash Info"
    }
  };
  
  const t = labels[lang];

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

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
        
        // Create flash news from articles
        if (articlesData) {
          const flashItems: FlashNewsItem[] = articlesData.slice(0, 6).map(article => ({
            id: article.id,
            title: article.title,
            timestamp: new Date(article.publication_date).toLocaleTimeString(lang === 'ar' ? 'ar-MA' : 'fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            category: article.category || 'ACTUALITÉ'
          }));
          setFlashNews(flashItems);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [lang]);

  // Create activities from news articles
  const activities = newsArticles.map(article => ({
    id: article.id,
    title: article.title,
    description: article.content?.substring(0, 100) + (article.content?.length > 100 ? '...' : ''),
    time: new Date(article.publication_date).toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }),
    icon: <AlertCircle className="h-4 w-4 text-red-600" />,
    type: "default" as "default" | "success" | "warning" | "error"
  }));

  // Calculate stats from the latest analytics entry
  const latestAnalytics = analytics.length ? analytics[analytics.length - 1] : null;
  const prevAnalytics = analytics.length > 1 ? analytics[analytics.length - 2] : null;
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

  // Stats data for StatCard components
  const statsData = latestAnalytics ? [{
    title: isArabic ? "الزيارات" : "Visites",
    value: latestAnalytics.page_view_count.toString(),
    icon: <Search className="h-5 w-5 text-white" />,
    trend: calculateTrend(latestAnalytics.page_view_count, prevAnalytics?.page_view_count || 0)
  }, {
    title: isArabic ? "المقالات" : "Articles",
    value: latestAnalytics.article_view_count.toString(),
    icon: <AlertCircle className="h-5 w-5 text-white" />,
    trend: calculateTrend(latestAnalytics.article_view_count, prevAnalytics?.article_view_count || 0),
    variant: "primary" as const
  }, {
    title: isArabic ? "الترجمات" : "Traductions",
    value: latestAnalytics.translation_count.toString(),
    icon: <Globe className="h-5 w-5 text-white" />,
    trend: calculateTrend(latestAnalytics.translation_count, prevAnalytics?.translation_count || 0),
    variant: "success" as const
  }] : [];

  // Get news items for feature, hero and grid
  const featuredNews = news.length > 0 ? news[0] : null;
  const gridNews = news.slice(1, 7);

  return (
    <div dir={dir} className="space-y-6">
      <div className="animate-fade-in">
        {/* Language Switcher */}
        <div className="w-full flex justify-end pt-4">
          <button 
            onClick={() => setLang(isArabic ? "fr" : "ar")} 
            className="text-sm bg-card px-4 py-1 rounded-full shadow-sm hover:bg-gray-900 transition-all duration-300 text-white"
          >
            {t.switchTo}
          </button>
        </div>

        {/* Main Content Layout with 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">
          {/* Main content area - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Hero Section */}
            {featuredNews && (
              <HeroNews 
                title={featuredNews.title || "Actualité principale"}
                imageUrl={featuredNews.thumbnail || "https://via.placeholder.com/800x400?text=News"}
                category={featuredNews.source}
                timestamp={formatNewsDate(featuredNews.pubDate)}
                link={featuredNews.link}
              />
            )}

            {/* Features Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/search" className="bg-red-600 hover:bg-red-700 text-white font-semibold text-lg py-4 px-4 rounded-lg shadow-lg text-center transition duration-300 flex items-center justify-center gap-3">
                <Search className="h-5 w-5" />
                <span>{t.search}</span>
              </Link>

              <Link to="/improve" className="bg-card hover:bg-gray-800 border border-red-600/30 text-white font-semibold text-lg py-4 px-4 rounded-lg shadow-lg text-center transition duration-300 flex items-center justify-center gap-3">
                {t.improve}
              </Link>

              <Link to="/translation" className="bg-card hover:bg-gray-800 border border-red-600/30 text-white font-semibold text-lg py-4 px-4 rounded-lg shadow-lg text-center transition duration-300 flex items-center justify-center gap-3">
                {t.translate}
              </Link>
            </div>
            
            {/* Image Generation Button */}
            <Link to="/image-generation" className="flex bg-red-600 hover:bg-red-700 text-white font-semibold text-xl py-4 px-6 rounded-lg shadow-lg text-center transition duration-300 justify-center items-center gap-2">
              <span>{isArabic ? "توليد الصور" : "Génération d'image"}</span>
            </Link>

            {/* News Section with Tabs */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">
                  {t.latestNews}
                </h2>
                <Link to="/news" className="px-4 py-1.5 bg-red-600 text-white rounded-full flex items-center gap-1 text-sm font-medium hover:bg-red-700 transition-all duration-300">
                  {isArabic ? "عرض المزيد" : "Voir plus"} <ArrowRight className="h-4 w-4 animate-pulse" />
                </Link>
              </div>
              
              {/* News Tabs */}
              <Tabs value={activeTab} onValueChange={value => setActiveTab(value as 'maroc' | 'monde')} className="mb-4">
                <TabsList className="w-fit bg-card shadow-sm border border-gray-800 p-1 rounded-full">
                  <TabsTrigger value="maroc" className="text-base rounded-full data-[state=active]:bg-red-600 data-[state=active]:text-white px-4 py-1.5">
                    <span className="mr-1 text-lg">🇲🇦</span> Maroc
                  </TabsTrigger>
                  <TabsTrigger value="monde" className="text-base rounded-full data-[state=active]:bg-red-600 data-[state=active]:text-white px-4 py-1.5">
                    <Globe className="h-4 w-4 mr-2" /> Monde
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              {/* News Grid */}
              {newsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-red-400 font-medium">Erreur de chargement</p>
                  </div>
                  <p className="text-red-300">{newsError}</p>
                </div>
              ) : gridNews.length === 0 ? (
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
                  <p className="text-gray-400">Aucune actualité disponible pour le moment</p>
                </div>
              ) : (
                <NewsGrid news={gridNews} />
              )}
            </div>
          </div>
          
          {/* Sidebar/Flash News - 1 column */}
          <div className="space-y-6">
            <FlashNews items={flashNews} />
            
            {/* Stats Cards */}
            {!isLoading && statsData.length > 0 && (
              <div className="space-y-4">
                {statsData.map((stat, index) => (
                  <StatCard 
                    key={index} 
                    title={stat.title} 
                    value={stat.value} 
                    icon={stat.icon} 
                    trend={stat.trend} 
                    variant={stat.variant} 
                  />
                ))}
              </div>
            )}
            
            {/* N8n Widget */}
            <div className="bg-card rounded-lg overflow-hidden border border-gray-800">
              <div className="bg-red-600 py-2 px-4">
                <h3 className="font-bold text-white">Image AI</h3>
              </div>
              <div className="p-4">
                <N8nImageGeneration />
              </div>
            </div>
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

export default Index;
