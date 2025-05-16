import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowUp, MessageSquare, Users, Newspaper, BarChart, ArrowRight, Globe, AlertCircle, ImageIcon } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { LineChart } from "@/components/dashboard/LineChart";
import { NewsCard } from "@/components/news/NewsCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useNews } from "@/hooks/useNews";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatNewsDate } from "@/services/newsService";
import { N8nImageGeneration } from "@/components/image-generation/N8nImageGeneration";
import { GoogleFreePix } from "@/components/image-generation/GoogleFreePix";

const Index = () => {
  const [lang, setLang] = useState("fr");
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      news: "الأخبار"
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
      latestNews: "Dernières actualités",
      news: "Actualités"
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
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Format analytics data for charts
  const analyticsChartData = analytics.map(item => ({
    name: new Date(item.date).toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR', {
      day: '2-digit',
      month: 'short'
    }),
    pageViews: item.page_view_count,
    articles: item.article_view_count,
    searches: item.search_count,
    translations: item.translation_count,
    improvements: item.improve_count
  }));

  // Create activities from news articles
  const activities = newsArticles.map(article => ({
    id: article.id,
    title: article.title,
    description: article.content.substring(0, 100) + (article.content.length > 100 ? '...' : ''),
    time: new Date(article.publication_date).toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }),
    icon: <Newspaper className="h-4 w-4" />,
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
    icon: <Users className="h-5 w-5 text-white" />,
    trend: calculateTrend(latestAnalytics.page_view_count, prevAnalytics?.page_view_count || 0)
  }, {
    title: isArabic ? "المقالات" : "Articles",
    value: latestAnalytics.article_view_count.toString(),
    icon: <Newspaper className="h-5 w-5 text-white" />,
    trend: calculateTrend(latestAnalytics.article_view_count, prevAnalytics?.article_view_count || 0),
    variant: "primary" as const
  }, {
    title: isArabic ? "الترجمات" : "Traductions",
    value: latestAnalytics.translation_count.toString(),
    icon: <ArrowUp className="h-5 w-5 text-white" />,
    trend: calculateTrend(latestAnalytics.translation_count, prevAnalytics?.translation_count || 0),
    variant: "success" as const
  }] : [];

  // Get a limited number of news items for the homepage
  const displayNews = news.slice(0, 6);
  return <div className="space-y-6">
      <div dir={dir} className="flex flex-col px-4 relative animate-fade-in">
        {/* Language Switcher */}
        <div className="w-full max-w-5xl mx-auto flex justify-end pt-4">
          <button onClick={() => setLang(isArabic ? "fr" : "ar")} className="text-sm bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full shadow-sm hover:bg-white transition-all duration-300 text-purple-700">
            {t.switchTo}
          </button>
        </div>

        {/* Welcome Section */}
        <div className="w-full max-w-5xl mx-auto mt-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-8 shadow-lg text-white mb-8">
            <h1 className="text-3xl font-bold">{t.welcome}</h1>
          </div>
        </div>

        {/* Features Buttons */}
        <div className="w-full max-w-5xl mx-auto mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">{t.subtitle}</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <Link to="/search" className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold text-lg py-6 px-4 rounded-xl shadow-lg text-center transition duration-300 flex items-center justify-center gap-3">
              <Search className="h-5 w-5" />
              <span>{t.search}</span>
            </Link>

            <Link to="/improve" className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold text-lg py-6 px-4 rounded-xl shadow-lg text-center transition duration-300 flex items-center justify-center gap-3">
              {t.improve}
            </Link>

            <Link to="/translation" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold text-lg py-6 px-4 rounded-xl shadow-lg text-center transition duration-300 flex items-center justify-center gap-3">
              {t.translate}
            </Link>
          </div>
        </div>

        {/* Image Generation Button */}
        <div className="w-full max-w-5xl mx-auto mb-8">
          <Link to="/simple-image-generation" className="block bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold text-xl py-4 px-6 rounded-xl shadow-lg text-center transition duration-300">
            <div className="flex items-center justify-center gap-3">
              <ImageIcon className="h-6 w-6" />
              <span>{isArabic ? "توليد الصور البسيطة" : "Génération d'image"}</span>
            </div>
          </Link>
        </div>

        {/* Google Free Pix Section */}
        <div className="w-full max-w-5xl mx-auto mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {isArabic ? "Google Free Pix" : "Google Free Pix"}
          </h2>
          <GoogleFreePix />
        </div>

        {/* New N8n Image Generation Section */}
        <div className="w-full max-w-5xl mx-auto mb-8">
          <N8nImageGeneration />
        </div>

        {/* Stats Cards */}
        {!isLoading && statsData.length > 0 && <div className="w-full max-w-5xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {statsData.map((stat, index) => <StatCard key={index} title={stat.title} value={stat.value} icon={stat.icon} trend={stat.trend} variant={stat.variant} />)}
            </div>
          </div>}
        
        {/* News Section */}
        <div className="w-full max-w-5xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              {t.latestNews}
            </h2>
            <Link to="/news" className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full flex items-center gap-1 text-sm font-medium hover:shadow-md transition-all duration-300 hover:scale-105">
              {isArabic ? "عرض المزيد" : "Voir plus"} <ArrowRight className="h-4 w-4 animate-pulse" />
            </Link>
          </div>
          
          {/* News Tabs */}
          <Tabs value={activeTab} onValueChange={value => setActiveTab(value as 'maroc' | 'monde')} className="mb-4">
            <TabsList className="w-fit bg-white shadow-sm border border-purple-100 p-1 rounded-full">
              <TabsTrigger value="maroc" className="text-base rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500 data-[state=active]:text-white px-4 py-1.5">
                <span className="mr-1 text-lg">🇲🇦</span> Maroc
              </TabsTrigger>
              <TabsTrigger value="monde" className="text-base rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500 data-[state=active]:text-white px-4 py-1.5">
                <Globe className="h-4 w-4 mr-2" /> Monde
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* News Display */}
          {newsLoading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-white rounded-lg shadow-sm p-4 h-[180px] animate-pulse">
                  <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>)}
            </div> : newsError ? <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="flex justify-center items-center mb-2">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700 font-medium">Erreur de chargement</p>
              </div>
              <p className="text-red-600">{newsError}</p>
            </div> : displayNews.length === 0 ? <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <Newspaper className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Aucune actualité disponible pour le moment</p>
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayNews.map(item => <NewsCard key={item.guid} title={item.title || "Titre non disponible"} description={item.description || "Description non disponible"} source={item.source} date={formatNewsDate(item.pubDate)} link={item.link} compact={true} error={item.title?.includes("Impossible de charger") ? "Impossible de charger les actualités de cette source" : undefined} />)}
            </div>}
        </div>

        {/* Now we remove the Analytics Chart section and keep the Latest News section */}
        {!isLoading && activities.length > 0 && <ActivityTimeline title={t.activity} items={activities} />}
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
    </div>;
};
export default Index;
