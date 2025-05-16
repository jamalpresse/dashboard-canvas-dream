
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
  // Add console log to debug the image URL
  console.log("HeroNews - Image URL:", imageUrl);
  
  return (
    <div className={cn("snrt-hero relative h-[300px] md:h-[400px] overflow-hidden rounded-md", className)}>
      {/* Background Image - Using object-cover and improved fallback handling */}
      <img 
        src={imageUrl || "/lovable-uploads/32ff14e9-af71-4640-b4c9-583985037c66.png"} 
        alt={title}
        className="w-full h-full object-cover object-center bg-black" 
        onError={(e) => {
          console.log("Image failed to load:", imageUrl);
          e.currentTarget.src = "/lovable-uploads/32ff14e9-af71-4640-b4c9-583985037c66.png";
        }}
      />
      
      {/* Dark overlay - Reduced opacity for better image visibility */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="z-10">
          <div className="flex flex-col gap-2 mb-2">
            {category && (
              <span className="snrt-category bg-red-600 text-white px-2 py-0.5 rounded text-xs uppercase font-bold inline-block w-fit">{category}</span>
            )}
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">{title}</h2>
            {timestamp && (
              <span className="snrt-timestamp text-gray-300 text-sm">{timestamp}</span>
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
