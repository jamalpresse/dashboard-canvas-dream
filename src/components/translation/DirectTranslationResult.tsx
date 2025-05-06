
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
    
    // Si c'est une chaîne JSON valide, essayer de l'analyser
    if (typeof content === 'string' && (content.trim().startsWith('{') || content.trim().startsWith('['))) {
      try {
        const jsonContent = JSON.parse(content);
        
        // Extraction de texte à partir d'un objet JSON
        if (typeof jsonContent === 'object' && !Array.isArray(jsonContent)) {
          // Priorité d'extraction du texte (du plus spécifique au plus générique)
          const textProperties = [
            'Traduction', 'translation', 'translated_text', 'text', 
            'content', 'body', 'main_content', 'output'
          ];
          
          for (const prop of textProperties) {
            if (jsonContent[prop] && typeof jsonContent[prop] === 'string') {
              displayContent = jsonContent[prop];
              console.log(`Extracted text from JSON property '${prop}':`, displayContent);
              break;
            }
          }
          
          // Si on n'a pas trouvé de propriété texte, on utilise le JSON formaté
          if (displayContent === content) {
            displayContent = JSON.stringify(jsonContent, null, 2);
          }
        } else {
          // Pour les tableaux ou autres structures JSON, on garde le format JSON
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
