
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
  return <div className={cn("snrt-hero relative h-[300px] md:h-[400px] overflow-hidden rounded-md", className)}>
      {/* Background Image */}
      <img 
        src={imageUrl || "/lovable-uploads/c5a1c67b-0dda-4c2f-91cd-643f3280a38a.png"} 
        alt={title} 
        className="w-full h-full object-contain bg-black" 
      />
      
      {/* Content Overlay - Dark gradient */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {category && <span className="snrt-category">{category}</span>}
            {timestamp && <span className="snrt-timestamp">{timestamp}</span>}
          </div>
          <h2 className="text-white text-2xl md:text-3xl font-bold">{title}</h2>
          {link && (
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1 text-red-500 hover:text-red-400 text-sm font-medium mt-2"
            >
              Lire l'article <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>;
};
