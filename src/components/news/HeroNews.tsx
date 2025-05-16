
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
        {/* Category Badge */}
        {category && (
          <span className="snrt-category mb-2 self-start">{category}</span>
        )}
        
        {/* Title */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-playfair mb-2 line-clamp-3">
          {title}
        </h2>
        
        {/* Time */}
        {timestamp && (
          <div className="snrt-timestamp mb-3">{timestamp}</div>
        )}
        
        {/* Read More Link */}
        {link && (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 bg-snrt-red hover:bg-red-700 text-white py-2 px-4 rounded-md w-fit text-sm font-medium transition-colors duration-200 mt-2"
          >
            <span>Lire l'article</span>
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </div>
  );
};
