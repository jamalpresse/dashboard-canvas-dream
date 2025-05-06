
import React from 'react';
import { BookOpen } from "lucide-react";

interface EnhancedContentResultProps {
  content: any;
}

const EnhancedContentResult: React.FC<EnhancedContentResultProps> = ({ content }) => {
  try {
    const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-5 w-5 text-purple-600" />
          <span className="font-medium text-purple-700">Contenu amélioré avec SEO</span>
        </div>
        
        {/* Titre principal */}
        {parsedContent.main_title && (
          <h2 className="text-xl font-bold mb-3 text-purple-800">
            {parsedContent.main_title}
          </h2>
        )}
        
        {/* Corps du texte */}
        {parsedContent.body && (
          <div className="mt-2 mb-4 whitespace-pre-wrap text-gray-700">
            {parsedContent.body}
          </div>
        )}
        
        {/* Titres SEO */}
        {parsedContent.seo_titles && Array.isArray(parsedContent.seo_titles) && parsedContent.seo_titles.length > 0 && (
          <div className="mt-4 p-3 border-t pt-3">
            <h3 className="font-medium mb-2 text-purple-700">Titres SEO:</h3>
            <ul className="list-disc pl-5">
              {parsedContent.seo_titles.map((title: string, i: number) => (
                <li key={i} className="mb-1">{title}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Hashtags */}
        {parsedContent.hashtags && Array.isArray(parsedContent.hashtags) && parsedContent.hashtags.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2 text-purple-700">Hashtags:</h3>
            <div className="flex flex-wrap gap-2">
              {parsedContent.hashtags.map((tag: string, i: number) => (
                <span key={i} className="text-purple-600 bg-purple-50 px-2 py-1 rounded-md text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } catch (e) {
    console.error("Error rendering enhanced content:", e);
    return (
      <div className="text-red-500">
        Erreur lors du rendu du contenu amélioré. Voir la console pour plus de détails.
      </div>
    );
  }
};

export default EnhancedContentResult;
