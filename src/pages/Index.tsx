import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Index = () => {
  const [lang, setLang] = useState("ar"); // 'ar' ou 'fr'
  const [rssItems, setRssItems] = useState([]);

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
    },
    fr: {
      title: "Dashboard Journalistes",
      subtitle: "Choisissez une fonctionnalité ci-dessous :",
      search: "🔍 Recherche (AR / FR)",
      improve: "🛠️ Améliorer texte & SEO",
      translate: "🌍 Traduction multilingue",
      switchTo: "عربية",
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

  return (
    <div className="space-y-6">
      <div dir={dir} className="min-h-[80vh] bg-white flex flex-col items-center justify-center px-4 relative">
        {/* Language Switcher */}
        <div className="w-full max-w-5xl flex justify-end pt-2">
          <button
            onClick={() => setLang(isArabic ? "fr" : "ar")}
            className="text-sm text-gray-700 hover:underline"
          >
            {t.switchTo}
          </button>
        </div>

        {/* Logo */}
        <img 
          src="/placeholder.svg" 
          alt="SNRTnews" 
          className="w-40 mb-8 mt-4" 
        />

        {/* Titre et sous-titre */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <p className="text-muted-foreground mt-2">{t.subtitle}</p>
        </div>

        {/* Boutons */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
          <Link
            to="/search"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg py-6 rounded-2xl shadow-lg text-center transition duration-300"
          >
            {t.search}
          </Link>

          <Link
            to="/improve"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg py-6 rounded-2xl shadow-lg text-center transition duration-300"
          >
            {t.improve}
          </Link>

          <a
            href="https://chatgpt.com/canvas/shared/6818c0edd7e481919a1164e5a76036e5"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg py-6 rounded-2xl shadow-lg text-center transition duration-300"
          >
            {t.translate}
          </a>
        </div>

        {/* RSS Ticker - Fixed to the bottom of content area, not page */}
        <div className="w-full bg-red-50 border-t border-red-300 text-base overflow-hidden shadow-inner mt-8">
          <div className="flex items-center space-x-4 rtl:space-x-reverse px-6 py-3">
            <span className="text-red-700 font-semibold whitespace-nowrap">📰 {isArabic ? 'آخر الأخبار' : 'Dernières actualités'} :</span>
            <div className="flex-1 overflow-hidden">
              <div className="marquee whitespace-nowrap">
                {rssItems.length > 0 ? (
                  rssItems.map((item, index) => (
                    <a 
                      key={index} 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-block mr-12 rtl:ml-12 rtl:mr-0 text-blue-700 hover:underline"
                    >
                      {item.title}
                    </a>
                  ))
                ) : (
                  <span className="text-gray-500">Chargement des actualités...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corrected: Removed the 'jsx: true' prop from the style tag */}
      <style>
        {`
          .marquee {
            display: inline-block;
            animation: marquee 30s linear infinite;
          }
          @keyframes marquee {
            0% { transform: translateX(${isArabic ? '-100%' : '100%'}); }
            100% { transform: translateX(${isArabic ? '100%' : '-100%'}); }
          }
        `}
      </style>
    </div>
  );
};

export default Index;
