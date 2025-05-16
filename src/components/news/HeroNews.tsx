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
      <img src={imageUrl || "/lovable-uploads/c5a1c67b-0dda-4c2f-91cd-643f3280a38a.png"} alt={title} className="w-full h-full object-contain bg-black" />
      
      {/* Content Overlay - Dark gradient */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
        
      </div>
    </div>;
};