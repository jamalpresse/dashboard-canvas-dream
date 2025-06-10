
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
  content?: string;
}

export const HeroNews: React.FC<HeroNewsProps> = ({
  title,
  imageUrl,
  category,
  timestamp,
  link,
  className,
  content
}) => {
  // Utiliser l'image fournie ou l'image par défaut, sans duplication de logique
  const finalImageUrl = imageUrl && 
                        imageUrl.trim() !== "" && 
                        imageUrl !== "/lovable-uploads/32ff14e9-af71-4640-b4c9-583985037c66.png" 
                        ? imageUrl 
                        : "/lovable-uploads/32ff14e9-af71-4640-b4c9-583985037c66.png";

  console.log("HeroNews - Image reçue:", imageUrl);
  console.log("HeroNews - Image finale utilisée:", finalImageUrl);

  return (
    <div className={cn("snrt-hero relative h-[300px] md:h-[400px] overflow-hidden rounded-md", className)}>
      {/* Background Image avec fallback */}
      <div 
        className="w-full h-full bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `url("${finalImageUrl}")`,
          backgroundColor: '#1a1a1a'
        }}
      >
        {/* Image de test pour détecter les erreurs de chargement */}
        <img 
          src={finalImageUrl}
          alt=""
          className="absolute opacity-0 w-1 h-1"
          onError={(e) => {
            console.log("Erreur de chargement détectée pour:", finalImageUrl);
            const parent = e.currentTarget.parentElement;
            if (parent && !finalImageUrl.includes("32ff14e9-af71-4640-b4c9-583985037c66.png")) {
              console.log("Basculement vers l'image par défaut");
              parent.style.backgroundImage = `url("/lovable-uploads/32ff14e9-af71-4640-b4c9-583985037c66.png")`;
            }
          }}
          onLoad={() => {
            console.log("Image chargée avec succès:", finalImageUrl);
          }}
        />
      </div>
      
      {/* Dark overlay */}
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
            <span>قراءة المقال</span>
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </div>
  );
};
