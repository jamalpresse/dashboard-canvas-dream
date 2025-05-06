
import React from 'react';
import { FileText } from "lucide-react";
import { createTextResponseElements } from "./utils/resultUtils";

interface DirectTranslationResultProps {
  content: any;
}

const DirectTranslationResult: React.FC<DirectTranslationResultProps> = ({ content }) => {
  try {
    // Handle JSON content
    if (typeof content === 'string' && content.startsWith('{')) {
      try {
        const jsonContent = JSON.parse(content);
        return (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-700">Traduction</span>
            </div>
            <div className="whitespace-pre-wrap">
              {typeof jsonContent === 'string' ? 
                createTextResponseElements(jsonContent) : 
                JSON.stringify(jsonContent, null, 2)}
            </div>
          </div>
        );
      } catch (e) {
        // If JSON parsing fails, render as text
        return (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-700">Traduction</span>
            </div>
            <div className="whitespace-pre-wrap">
              {createTextResponseElements(content)}
            </div>
          </div>
        );
      }
    }
    
    // For plain text
    return (
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-700">Traduction</span>
        </div>
        <div className="whitespace-pre-wrap">
          {createTextResponseElements(content)}
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
