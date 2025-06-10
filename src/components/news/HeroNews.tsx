
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
    
    // 1. Chercher des balises img dans le HTML
    const imgTagRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let match;
    while ((match = imgTagRegex.exec(htmlContent)) !== null) {
      const imgSrc = match[1];
      // Vérifier que l'image a une extension valide et n'est pas un pixel de tracking
      if (imgSrc && 
          /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(imgSrc) && 
          !imgSrc.includes('1x1') && 
          !imgSrc.includes('pixel') &&
          imgSrc.length > 20) {
        console.log("Image extraite de la balise img:", imgSrc);
        // S'assurer que l'URL est complète
        return imgSrc.startsWith('http') ? imgSrc : `https://snrtnews.com${imgSrc}`;
      }
    }
    
    // 2. Chercher des URLs d'images directes dans le texte
    const imageUrlRegex = /(https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|gif|webp|svg))(?:\?[^\s"'<>]*)?/gi;
    match = htmlContent.match(imageUrlRegex);
    
    if (match && match[0]) {
      const imgUrl = match[0];
      if (!imgUrl.includes('1x1') && !imgUrl.includes('pixel') && imgUrl.length > 20) {
        console.log("Image extraite de l'URL:", imgUrl);
        return imgUrl;
      }
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
        console.log("Image extraite du contenu:", extractedImage);
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
      {/* Background Image avec fallback amélioré */}
      <div 
        className="w-full h-full bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `url("${finalImageUrl}")`,
          backgroundColor: '#1a1a1a'
        }}
      >
        {/* Image de test cachée pour détecter les erreurs */}
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
            <span>قراءة المقال</span>
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </div>
  );
};
