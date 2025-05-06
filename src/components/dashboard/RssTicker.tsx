
import React from "react";

interface RssItem {
  title: string;
  link: string;
}

interface RssTickerProps {
  title: string;
  rssItems: RssItem[];
  isArabic: boolean;
  loadingText?: string;
}

export function RssTicker({ title, rssItems, isArabic, loadingText = "Chargement des actualités..." }: RssTickerProps) {
  return (
    <div className="w-full bg-white/80 backdrop-blur-sm border-t border-purple-200 rounded-lg shadow-inner mt-8 mx-auto max-w-5xl overflow-hidden">
      <div className="flex items-center space-x-4 rtl:space-x-reverse px-6 py-3">
        <span className="text-purple-700 font-semibold whitespace-nowrap flex-shrink-0">📰 {title} :</span>
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
              <span className="text-gray-500">{loadingText}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
