
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowUp, MessageSquare, Users } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { LineChart } from "@/components/dashboard/LineChart";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";

const Index = () => {
  const [lang, setLang] = useState("fr");
  const isArabic = lang === "ar";
  const dir = isArabic ? "rtl" : "ltr";
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
    }
  };
  const t = labels[lang];

  // Mock data for statistics
  const statsData = [{
    title: isArabic ? "المقالات" : "Articles",
    value: "125",
    icon: <MessageSquare className="h-5 w-5 text-white" />,
    trend: {
      value: 12,
      positive: true
    }
  }, {
    title: isArabic ? "الزيارات" : "Visites",
    value: "2.5K",
    icon: <Users className="h-5 w-5 text-white" />,
    trend: {
      value: 8,
      positive: true
    },
    variant: "primary" as const
  }, {
    title: isArabic ? "الترجمات" : "Traductions",
    value: "84",
    icon: <ArrowUp className="h-5 w-5 text-white" />,
    trend: {
      value: 5,
      positive: false
    }
  }];

  // Mock data for the activity timeline
  const activities = [{
    id: "1",
    title: "Article publié",
    description: "Le nouvel article sur le climat a été publié",
    time: "Il y a 2 heures",
    icon: <MessageSquare className="h-4 w-4" />
  }, {
    id: "2",
    title: "Traduction complétée",
    description: "L'article a été traduit en arabe",
    time: "Il y a 3 heures",
    icon: <ArrowUp className="h-4 w-4" />
  }, {
    id: "3",
    title: "Nouveau membre",
    description: "Karim a rejoint l'équipe de journalistes",
    time: "Il y a 5 heures",
    icon: <Users className="h-4 w-4" />
  }];

  // Mock data for the chart
  const chartData = [{
    name: "Jan",
    visits: 1000,
    articles: 40
  }, {
    name: "Fev",
    visits: 1200,
    articles: 42
  }, {
    name: "Mar",
    visits: 1500,
    articles: 45
  }, {
    name: "Avr",
    visits: 1800,
    articles: 48
  }, {
    name: "Mai",
    visits: 2000,
    articles: 50
  }, {
    name: "Jui",
    visits: 2400,
    articles: 52
  }];
  return <div className="space-y-6">
      <div dir={dir} className="min-h-[80vh] bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col px-4 relative animate-fade-in">
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

        {/* Chart and Activity Section */}
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <LineChart className="col-span-1 lg:col-span-2 shadow-md hover:shadow-lg transition-shadow duration-300" data={chartData} title={isArabic ? "متابعة النشاط" : "Suivi d'activité"} lines={[{
          dataKey: "visits",
          stroke: "#9b87f5",
          name: isArabic ? "الزيارات" : "Visites"
        }, {
          dataKey: "articles",
          stroke: "#D946EF",
          name: isArabic ? "المقالات" : "Articles"
        }]} />
          
          <ActivityTimeline items={activities} className="col-span-1 shadow-md hover:shadow-lg transition-shadow duration-300" />
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
