
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
  // Filtrer les articles qui n'ont pas d'image valide
  const newsWithImages = news?.filter(item => 
    item.thumbnail && 
    item.thumbnail.trim() !== "" && 
    !item.thumbnail.includes("placeholder") &&
    item.thumbnail !== "https://via.placeholder.com/300x200?text=News"
  ) || [];

  if (!newsWithImages || newsWithImages.length === 0) {
    return (
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 p-8 rounded-lg text-center">
        <p className="text-muted-foreground">Aucune actualité avec image disponible</p>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {newsWithImages.map((item) => (
        <article key={item.guid} className="group bg-card/50 backdrop-blur-sm rounded-lg overflow-hidden border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
          <div className="relative h-48 overflow-hidden">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                // Masquer l'article si l'image ne charge pas
                e.currentTarget.closest('article')?.style.setProperty('display', 'none');
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            {item.categories && item.categories[0] && (
              <span className="absolute top-3 left-3 px-2 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full backdrop-blur-sm">
                {item.categories[0]}
              </span>
            )}
          </div>
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
              {item.description}
            </p>
            <div className="flex justify-between items-center pt-2 border-t border-border/50">
              <time className="text-xs text-muted-foreground font-medium">
                {new Date(item.pubDate).toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </time>
              <span className="text-xs text-primary/70 font-medium">{item.source}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
