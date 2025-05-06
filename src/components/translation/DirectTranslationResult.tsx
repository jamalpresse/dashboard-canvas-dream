
import React from 'react';
import { FileText } from "lucide-react";
import { createTextResponseElements } from "./utils/resultUtils";

interface DirectTranslationResultProps {
  content: any;
}

const DirectTranslationResult: React.FC<DirectTranslationResultProps> = ({ content }) => {
  try {
    // Traitement simplifié du contenu
    let displayContent = content;
    
    console.log("DirectTranslationResult reçoit le contenu de type:", typeof content);
    
    // Si c'est une chaîne JSON, essayer de la parser
    if (typeof content === 'string' && (content.trim().startsWith('{') || content.trim().startsWith('['))) {
      try {
        const jsonContent = JSON.parse(content);
        console.log("Contenu JSON parsé:", jsonContent);
        
        // Si c'est un objet simple avec une propriété texte, l'extraire
        if (typeof jsonContent === 'object' && !Array.isArray(jsonContent)) {
          // Propriétés de texte courantes à rechercher
          const textProps = ['translated_text', 'translation', 'text', 'content', 'message', 'output'];
          
          for (const prop of textProps) {
            if (jsonContent[prop] && typeof jsonContent[prop] === 'string') {
              displayContent = jsonContent[prop];
              console.log(`Texte extrait de la propriété '${prop}':`, displayContent);
              break;
            }
          }
          
          // Si on n'a pas trouvé de texte et qu'il n'y a qu'une seule propriété
          if (displayContent === content) {
            const keys = Object.keys(jsonContent);
            if (keys.length === 1 && typeof jsonContent[keys[0]] === 'string') {
              displayContent = jsonContent[keys[0]];
            }
          }
        } else if (Array.isArray(jsonContent) && jsonContent.length === 1 && typeof jsonContent[0] === 'string') {
          // Si c'est un tableau avec une seule entrée texte
          displayContent = jsonContent[0];
        }
      } catch (e) {
        console.log("Erreur de parsing JSON, utilisation du contenu brut:", e);
        // On garde le contenu original
      }
    }
    
    console.log("Contenu final à afficher:", displayContent);
    
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
    console.error("Erreur lors du rendu de la traduction directe:", e);
    return (
      <div className="text-red-500">
        Erreur lors du rendu de la traduction. Voir la console pour plus de détails.
      </div>
    );
  }
};

export default DirectTranslationResult;
