
import React, { useState, useEffect } from "react";
import { MessageSquare, Users, ArrowUp } from "lucide-react";
import { LanguageSwitcher } from "@/components/dashboard/LanguageSwitcher";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { StatsSection } from "@/components/dashboard/StatsSection";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { RssTicker } from "@/components/dashboard/RssTicker";
import { DashboardStyles } from "@/components/dashboard/DashboardStyles";

const Index = () => {
  const [lang, setLang] = useState("fr");
  const [rssItems, setRssItems] = useState([]);

  const isArabic = lang === "ar";
  const dir = isArabic ? "rtl" : "ltr";

  const labels = {
    ar: {
      title: "لوحة تحكم الصحفيين",
      switchTo: "Français",
      welcome: "مرحباً بك في لوحة تحكم الصحفيين",
      greeting: "أهلاً بك في نظام المعلومات الصحفية",
      stats: "الإحصائيات",
      activity: "النشاطات الأخيرة",
      latestNews: "آخر الأخبار",
    },
    fr: {
      title: "Dashboard Journalistes",
      switchTo: "عربية",
      welcome: "Bienvenue au Dashboard Journalistes",
      greeting: "Bienvenue dans votre système d'information journalistique",
      stats: "Statistiques",
      activity: "Activités récentes",
      latestNews: "Dernières actualités",
    },
  };

  const t = labels[lang];

  useEffect(() => {
    async function fetchRSS() {
      try {
        const res = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://snrtnews.com/rss.xml");
        const data = await res.json();
        if (data.items) setRssItems(data.items.slice(0, 5));
      } catch (err) {
        console.error("Erreur de récupération du flux RSS:", err);
      }
    }
    fetchRSS();
  }, []);

  // Mock data for statistics
  const statsData = [
    { title: isArabic ? "المقالات" : "Articles", value: "125", icon: <MessageSquare className="h-5 w-5 text-white" />, trend: { value: 12, positive: true } },
    { title: isArabic ? "الزيارات" : "Visites", value: "2.5K", icon: <Users className="h-5 w-5 text-white" />, trend: { value: 8, positive: true }, variant: "primary" as const },
    { title: isArabic ? "الترجمات" : "Traductions", value: "84", icon: <ArrowUp className="h-5 w-5 text-white" />, trend: { value: 5, positive: false } },
  ];

  // Mock data for the activity timeline
  const activities = [
    { id: "1", title: "Article publié", description: "Le nouvel article sur le climat a été publié", time: "Il y a 2 heures", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "2", title: "Traduction complétée", description: "L'article a été traduit en arabe", time: "Il y a 3 heures", icon: <ArrowUp className="h-4 w-4" /> },
    { id: "3", title: "Nouveau membre", description: "Karim a rejoint l'équipe de journalistes", time: "Il y a 5 heures", icon: <Users className="h-4 w-4" /> },
  ];

  // Mock data for the chart
  const chartData = [
    { name: "Jan", visits: 1000, articles: 40 },
    { name: "Fev", visits: 1200, articles: 42 },
    { name: "Mar", visits: 1500, articles: 45 },
    { name: "Avr", visits: 1800, articles: 48 },
    { name: "Mai", visits: 2000, articles: 50 },
    { name: "Jui", visits: 2400, articles: 52 },
  ];

  const handleLanguageSwitch = () => setLang(isArabic ? "fr" : "ar");

  return (
    <div className="space-y-6">
      <div dir={dir} className="min-h-[80vh] bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col px-4 relative animate-fade-in">
        {/* Language Switcher */}
        <LanguageSwitcher 
          isArabic={isArabic} 
          switchLabel={t.switchTo} 
          onSwitch={handleLanguageSwitch} 
        />

        {/* Welcome Section */}
        <WelcomeSection 
          welcomeTitle={t.welcome} 
          welcomeMessage={t.greeting} 
        />

        {/* Stats Section */}
        <StatsSection 
          sectionTitle={t.stats} 
          stats={statsData} 
        />

        {/* Chart and Activity Section */}
        <ChartsSection 
          chartData={chartData} 
          activities={activities} 
          chartTitle={isArabic ? "متابعة النشاط" : "Suivi d'activité"}
          visitLabel={isArabic ? "الزيارات" : "Visites"}
          articlesLabel={isArabic ? "المقالات" : "Articles"}
        />

        {/* RSS Ticker */}
        <RssTicker 
          title={isArabic ? 'آخر الأخبار' : 'Dernières actualités'} 
          rssItems={rssItems} 
          isArabic={isArabic}
        />
      </div>

      {/* Global Styles */}
      <DashboardStyles isArabic={isArabic} />
    </div>
  );
};

export default Index;
