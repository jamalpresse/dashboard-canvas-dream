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
      <img src={imageUrl || "https://via.placeholder.com/800x400?text=News"} alt={title} className="w-full h-full object-cover" />
      
      {/* Content Overlay - Dark gradient */}
      
    </div>;
};