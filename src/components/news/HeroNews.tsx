
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
  // Fonction pour extraire une image du contenu HTML ou du texte
  const extractImageFromContent = (htmlContent: string): string | null => {
    if (!htmlContent) return null;
    
    // Chercher des URLs d'images dans le contenu
    const imageRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg))/gi;
    const match = htmlContent.match(imageRegex);
    
    if (match && match[0]) {
      console.log("Image extraite du contenu:", match[0]);
      return match[0];
    }
    
    // Chercher des balises img dans le HTML
    const imgTagRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    const imgMatch = imgTagRegex.exec(htmlContent);
    
    if (imgMatch && imgMatch[1]) {
      console.log("Image extraite de la balise img:", imgMatch[1]);
      return imgMatch[1];
    }
    
    return null;
  };

  // Déterminer l'image à utiliser avec une logique améliorée
  const getImageUrl = (): string => {
    // 1. Utiliser l'imageUrl fourni s'il existe et n'est pas vide
    if (imageUrl && imageUrl.trim() !== "" && imageUrl !== "/lovable-uploads/32ff14e9-af71-4640-b4c9-583985037c66.png") {
      console.log("Utilisation de l'imageUrl fourni:", imageUrl);
      return imageUrl;
    }
    
    // 2. Essayer d'extraire une image du contenu
    if (content) {
      const extractedImage = extractImageFromContent(content);
      if (extractedImage) {
        return extractedImage;
      }
    }
    
    // 3. Utiliser l'image par défaut SNRT
    console.log("Utilisation de l'image par défaut SNRT");
    return "/lovable-uploads/32ff14e9-af71-4640-b4c9-583985037c66.png";
  };

  const finalImageUrl = getImageUrl();
  console.log("HeroNews - Image finale utilisée:", finalImageUrl);
  console.log("HeroNews - Props reçues:", { title, imageUrl, content: content?.substring(0, 100) });

  return (
    <div className={cn("snrt-hero relative h-[300px] md:h-[400px] overflow-hidden rounded-md", className)}>
      {/* Background Image - Forcer l'affichage de l'image par défaut si aucune image valide */}
      <div 
        className="w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${finalImageUrl}")`,
          backgroundColor: '#000'
        }}
        onError={(e) => {
          console.log("Erreur de chargement de l'image de fond:", finalImageUrl);
          // Fallback vers l'image par défaut
          e.currentTarget.style.backgroundImage = `url("/lovable-uploads/32ff14e9-af71-4640-b4c9-583985037c66.png")`;
        }}
      >
        {/* Image de secours cachée pour détecter les erreurs de chargement */}
        <img 
          src={finalImageUrl}
          alt=""
          className="hidden"
          onError={(e) => {
            console.log("Image de secours - erreur détectée pour:", finalImageUrl);
            // Changer l'image de fond du parent
            const parent = e.currentTarget.parentElement;
            if (parent && !finalImageUrl.includes("32ff14e9-af71-4640-b4c9-583985037c66.png")) {
              parent.style.backgroundImage = `url("/lovable-uploads/32ff14e9-af71-4640-b4c9-583985037c66.png")`;
            }
          }}
          onLoad={() => {
            console.log("Image chargée avec succès:", finalImageUrl);
          }}
        />
      </div>
      
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
