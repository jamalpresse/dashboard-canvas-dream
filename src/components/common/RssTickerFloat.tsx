
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

type RssItem = {
  title: string;
  link: string;
};

export function RssTickerFloat() {
  const [rssItems, setRssItems] = useState<RssItem[]>([]);
  const { lang, isRTL } = useLanguage();
  
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

  const labels = {
    fr: "Dernières actualités",
    ar: "آخر الأخبار"
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-purple-200 shadow-lg">
      <div className="container mx-auto overflow-hidden">
        <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''} px-6 py-3`}>
          <span className="text-snrt-red font-semibold whitespace-nowrap flex-shrink-0">
            📰 {isRTL ? labels.ar : labels.fr} :
          </span>
          <div className="flex-1 overflow-hidden">
            <div className={cn("marquee whitespace-nowrap", isRTL ? "marquee-rtl" : "marquee-ltr")}>
              {rssItems.length > 0 ? (
                rssItems.map((item, index) => (
                  <a 
                    key={index} 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`inline-block ${isRTL ? 'ml-12 mr-0' : 'mr-12'} text-snrt-red hover:underline hover:text-red-700`}
                  >
                    {item.title}
                  </a>
                ))
              ) : (
                <span className="text-gray-500">
                  {isRTL ? "جاري تحميل الأخبار..." : "Chargement des actualités..."}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
