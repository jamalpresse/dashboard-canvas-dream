
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
  className,
}) => {
  return (
    <div className={cn("snrt-hero h-[300px] md:h-[400px]", className)}>
      {/* Background Image */}
      <img
        src={imageUrl || "https://via.placeholder.com/800x400?text=News"}
        alt={title}
        className="w-full h-full object-cover"
      />
      
      {/* Content Overlay */}
      <div className="snrt-hero-content">
        {category && (
          <span className="snrt-category mb-2 inline-block">{category}</span>
        )}
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {title}
        </h2>
        
        <div className="flex justify-between items-center">
          {timestamp && (
            <span className="snrt-timestamp">{timestamp}</span>
          )}
          
          {link && (
            <a 
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-white hover:text-red-400 transition-colors text-xs"
            >
              Lire plus <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
