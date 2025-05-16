
import React from "react";
import { NewsCard } from "@/components/news/NewsCard";
import { cn } from "@/lib/utils";

interface NewsGridProps {
  news: Array<{
    title: string;
    description: string;
    pubDate: string;
    link: string;
    guid: string;
    source: string;
    thumbnail?: string;
    categories?: string[];
  }>;
  className?: string;
}

export const NewsGrid: React.FC<NewsGridProps> = ({ news, className }) => {
  if (!news || news.length === 0) {
    return (
      <div className="bg-gray-900 p-8 rounded-lg text-center">
        <p className="text-gray-400">Aucune actualité disponible</p>
      </div>
    );
  }

  return (
    <div className={cn("news-grid", className)}>
      {news.map((item) => (
        <div key={item.guid} className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          {item.thumbnail && (
            <div className="h-40 overflow-hidden">
              <img
                src={item.thumbnail || "https://via.placeholder.com/300x200?text=News"}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-4">
            {item.categories && item.categories[0] && (
              <span className="snrt-category mb-2 inline-block">{item.categories[0]}</span>
            )}
            <h3 className="font-bold text-lg mb-1 line-clamp-2">{item.title}</h3>
            <p className="text-gray-400 text-sm line-clamp-2 mb-3">{item.description}</p>
            <div className="flex justify-between items-center">
              <span className="snrt-timestamp">{new Date(item.pubDate).toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}</span>
              <span className="text-xs text-gray-500">{item.source}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
