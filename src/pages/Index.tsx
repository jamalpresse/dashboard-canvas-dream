import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowUp, MessageSquare, Users, Newspaper, BarChart, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { LineChart } from "@/components/dashboard/LineChart";
import { NewsCard } from "@/components/news/NewsCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useNews } from "@/hooks/useNews";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNewsDate } from "@/services/newsService";
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
            <p className="mt-2 opacity-90">{t.greeting}</p>
          </div>
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
            <h2 className="text-xl font-semibold text-gray-800">{t.latestNews}</h2>
            <Link to="/news" className="text-purple-700 hover:text-purple-900 font-medium flex items-center gap-1">
              Voir plus <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          {/* News Tabs */}
          <Tabs value={activeTab} onValueChange={value => setActiveTab(value as 'maroc' | 'monde')} className="mb-4">
            <TabsList className="w-fit">
              <TabsTrigger value="maroc">
                <span className="mr-1">🇲🇦</span> Maroc
              </TabsTrigger>
              <TabsTrigger value="monde">Monde</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {newsLoading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-white rounded-lg shadow-md p-4 h-[200px] animate-pulse">
                  <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>)}
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayNews.map(item => <NewsCard key={item.guid} title={item.title} description={item.description} source={item.source} date={formatNewsDate(item.pubDate)} link={item.link} compact={true} />)}
            </div>}
        </div>
        
        {/* Analytics Chart */}
        {!isLoading && analyticsChartData.length > 0 && <div className="w-full max-w-5xl mx-auto mb-8">
            <LineChart title={t.analyticsTitle} data={analyticsChartData} lines={[{
          dataKey: "pageViews",
          stroke: "#8884d8",
          name: isArabic ? "الزيارات" : "Visites"
        }, {
          dataKey: "articles",
          stroke: "#82ca9d",
          name: isArabic ? "المقالات" : "Articles"
        }, {
          dataKey: "translations",
          stroke: "#ffc658",
          name: isArabic ? "الترجمات" : "Traductions"
        }]} className="shadow-md hover:shadow-lg transition-shadow duration-300" />
          </div>}

        {/* Latest News */}
        {!isLoading && activities.length > 0 && <div className="w-full max-w-5xl mx-auto mb-8">
            <ActivityTimeline items={activities} title={t.latestNews} className="shadow-md hover:shadow-lg transition-shadow duration-300" />
          </div>}

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
            
            <Link to="/news" className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold text-lg py-6 px-4 rounded-xl shadow-lg text-center transition duration-300 flex items-center justify-center gap-3">
              <Newspaper className="h-5 w-5" />
              <span>{t.news}</span>
            </Link>
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
        `}
      </style>
    </div>;
};
export default Index;