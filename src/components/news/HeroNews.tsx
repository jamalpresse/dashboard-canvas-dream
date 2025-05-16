
import React from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroNewsProps {
  title: string;
  imageUrl: string;
  category?: string;
  timestamp?: string;
  link?: string;
  className?: string;
}

export const HeroNews: React.FC<HeroNewsProps> = ({
  title,
  imageUrl,
  category,
  timestamp,
  link,
  className
}) => {
  return (
    <div className={cn("snrt-hero relative h-[300px] md:h-[400px] overflow-hidden rounded-md", className)}>
      {/* Background Image */}
      <img 
        src={imageUrl || "https://via.placeholder.com/800x400?text=News"} 
        alt={title} 
        className="w-full h-full object-cover" 
      />
      
      {/* Content Overlay - Dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent">
        <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
          {category && (
            <div className="bg-red-600 text-white inline-block px-3 py-1 text-sm font-semibold mb-2 rounded-sm">
              {category}
            </div>
          )}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h2>
          <div className="flex items-center justify-between">
            {timestamp && <span className="text-gray-300 text-sm">{timestamp}</span>}
            {link && (
              <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-red-400 flex items-center gap-1 text-sm"
              >
                Lire plus <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
