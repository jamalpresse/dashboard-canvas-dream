
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
      {/* Background Image - Changed object-contain to object-cover and added object-position */}
      <img 
        src={imageUrl || "/lovable-uploads/32ff14e9-af71-4640-b4c9-583985037c66.png"} 
        alt={title} 
        className="w-full h-full object-cover object-top bg-black" 
      />
      
      {/* Dark overlay to hide text - Increased opacity for better coverage */}
      <div className="absolute inset-0 bg-black/70" />
      
      {/* Content Overlay - Placed above the dark overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="z-10">
          <div className="flex flex-col gap-2 mb-2">
            {category && (
              <span className="snrt-category inline-block w-fit">{category}</span>
            )}
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">{title}</h2>
            {timestamp && (
              <span className="snrt-timestamp">{timestamp}</span>
            )}
          </div>
          
          {link && (
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-white/90 text-sm hover:text-white mt-2 underline-offset-2 hover:underline"
            >
              Lire l'article <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
