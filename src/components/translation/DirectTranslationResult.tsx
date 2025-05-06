
import React from 'react';
import { FileText } from "lucide-react";
import { createTextResponseElements } from "./utils/resultUtils";

interface DirectTranslationResultProps {
  content: any;
}

const DirectTranslationResult: React.FC<DirectTranslationResultProps> = ({ content }) => {
  try {
    // Traitement différent selon le type de contenu
    let displayContent = content;
    
    // Si c'est un objet JSON ou une chaîne JSON
    if (typeof content === 'string' && (content.startsWith('{') || content.startsWith('['))) {
      try {
        const jsonContent = JSON.parse(content);
        
        // Si c'est un objet simple avec une propriété texte, on l'extrait
        if (typeof jsonContent === 'object' && !Array.isArray(jsonContent)) {
          const textProperties = ['text', 'translation', 'content', 'body', 'Traduction'];
          for (const prop of textProperties) {
            if (jsonContent[prop] && typeof jsonContent[prop] === 'string') {
              displayContent = jsonContent[prop];
              break;
            }
          }
          
          // Si on n'a pas trouvé de propriété texte, on utilise le JSON formaté
          if (displayContent === content) {
            displayContent = JSON.stringify(jsonContent, null, 2);
          }
        } else {
          displayContent = JSON.stringify(jsonContent, null, 2);
        }
      } catch (e) {
        // Si le parsing JSON échoue, on garde le contenu tel quel
        console.log("Erreur de parsing JSON:", e);
      }
    }
    
    return (
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-700">Traduction</span>
        </div>
        <div className="whitespace-pre-wrap">
          {createTextResponseElements(displayContent)}
        </div>
      </div>
    );
  } catch (e) {
    console.error("Error rendering direct translation:", e);
    return (
      <div className="text-red-500">
        Erreur lors du rendu de la traduction. Voir la console pour plus de détails.
      </div>
    );
  }
};

export default DirectTranslationResult;
