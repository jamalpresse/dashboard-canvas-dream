
import { useEffect, useState } from "react";

interface RssItem {
  title: string;
  link: string;
}

interface RssTickerFloatProps {
  lang?: string;
}

export function RssTickerFloat({ lang = "fr" }: RssTickerFloatProps) {
  const [rssItems, setRssItems] = useState<RssItem[]>([]);
  const isArabic = lang === "ar";
  const dir = isArabic ? "rtl" : "ltr";

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
    <div dir={dir} className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-purple-200 shadow-md overflow-hidden py-2">
      <div className="flex items-center space-x-4 rtl:space-x-reverse px-6">
        <span className="text-purple-700 font-semibold whitespace-nowrap flex-shrink-0">
          📰 {isArabic ? 'آخر الأخبار' : 'Dernières actualités'} :
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="marquee whitespace-nowrap">
            {rssItems.length > 0 ? (
              rssItems.map((item, index) => (
                <a 
                  key={index} 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block mr-12 rtl:ml-12 rtl:mr-0 text-purple-700 hover:underline hover:text-purple-900"
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
  );
}
