
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
    
    console.log("DirectTranslationResult received content type:", typeof content);
    
    // Si c'est une chaîne JSON valide, essayer de l'analyser
    if (typeof content === 'string' && (content.trim().startsWith('{') || content.trim().startsWith('['))) {
      try {
        const jsonContent = JSON.parse(content);
        console.log("JSON content parsed:", jsonContent);
        
        // Extraction de texte à partir d'un objet JSON
        if (typeof jsonContent === 'object' && !Array.isArray(jsonContent)) {
          // Priorité d'extraction du texte (du plus spécifique au plus générique)
          const textProperties = [
            'translated_text', 'translation', 'text', 'content', 
            'body', 'message', 'output', 'result', 'value'
          ];
          
          for (const prop of textProperties) {
            if (jsonContent[prop] && typeof jsonContent[prop] === 'string') {
              displayContent = jsonContent[prop];
              console.log(`Extracted text from JSON property '${prop}':`, displayContent);
              break;
            }
          }
          
          // Si on n'a pas trouvé de propriété texte, mais que l'objet a une seule propriété qui est une chaîne
          if (displayContent === content) {
            const objectKeys = Object.keys(jsonContent);
            if (objectKeys.length === 1 && typeof jsonContent[objectKeys[0]] === 'string') {
              displayContent = jsonContent[objectKeys[0]];
              console.log(`Extracted text from single object property '${objectKeys[0]}':`, displayContent);
            } else {
              // Sinon on utilise le JSON formaté
              displayContent = JSON.stringify(jsonContent, null, 2);
            }
          }
        } else if (Array.isArray(jsonContent) && jsonContent.length === 1 && typeof jsonContent[0] === 'string') {
          // Si c'est un tableau avec une seule entrée qui est une chaîne
          displayContent = jsonContent[0];
          console.log("Extracted text from single array item:", displayContent);
        } else {
          // Pour les tableaux ou autres structures JSON, on garde le format JSON
          displayContent = JSON.stringify(jsonContent, null, 2);
        }
      } catch (e) {
        // Si le parsing JSON échoue, on garde le contenu tel quel
        console.log("Erreur de parsing JSON, utilisation du contenu brut:", e);
      }
    }
    
    console.log("Final display content:", displayContent);
    
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
