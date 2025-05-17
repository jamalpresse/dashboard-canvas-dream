
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
        // Use language-specific RSS URL
        const rssUrl = lang === "fr" 
          ? "https://snrtnews.com/fr/rss_fr.xml"
          : "https://snrtnews.com/rss.xml";
        
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        const data = await res.json();
        if (data.items) setRssItems(data.items.slice(0, 5));
      } catch (err) {
        console.error("Erreur de récupération du flux RSS:", err);
      }
    }
    fetchRSS();
  }, [lang]); // Add lang as dependency to refetch when language changes

  const labels = {
    fr: "Dernières actualités",
    ar: "آخر الأخبار"
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-purple-200 shadow-lg">
      <div className="container mx-auto overflow-hidden">
        {/* Use flex-row-reverse for Arabic (RTL) and normal flex for French (LTR) */}
        <div className={`flex items-center ${isRTL ? 'flex-row-reverse px-6' : 'flex-row px-6'} py-3`}>
          {/* Remove space-x classes and manage spacing with specific margin classes */}
          <span className={`text-snrt-red font-semibold whitespace-nowrap flex-shrink-0 ${isRTL ? 'mr-0 ml-4' : 'ml-0 mr-4'}`}>
            📰 {isRTL ? labels.ar : labels.fr} :
          </span>
          <div className="flex-1 overflow-hidden">
            <div className={cn(
              "marquee whitespace-nowrap", 
              // Use RTL animation for French and LTR for Arabic
              lang === "fr" ? "marquee-rtl" : "marquee-ltr"
            )}>
              {rssItems.length > 0 ? (
                rssItems.map((item, index) => (
                  <a 
                    key={index} 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`inline-block ${isRTL ? 'ml-12' : 'mr-12'} text-snrt-red hover:underline hover:text-red-700`}
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
