
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardCopy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TranslationResultProps {
  result: string;
  isRTL: boolean;
  onCopy: () => void;
}

const TranslationResult: React.FC<TranslationResultProps> = ({ result, isRTL, onCopy }) => {
  // Function to check if string is JSON
  const isJsonString = (str: string): boolean => {
    try {
      const json = JSON.parse(str);
      return typeof json === 'object' && json !== null;
    } catch (e) {
      return false;
    }
  };

  // Function to render formatted text with markdown-like syntax
  const renderFormattedText = (text: string) => {
    if (!text) return <span className="text-gray-400">Le résultat apparaîtra ici</span>;
    
    // Handle JSON strings
    if (isJsonString(text)) {
      try {
        const parsedJson = JSON.parse(text);
        console.log("JSON parsé dans le composant:", parsedJson);
        
        return (
          <div>
            {/* Titre principal ou équivalent */}
            {(parsedJson.main_title || parsedJson.titre || parsedJson.title) && (
              <h2 className="text-xl font-bold mb-3 text-purple-800">
                {parsedJson.main_title || parsedJson.titre || parsedJson.title}
              </h2>
            )}
            
            {/* Corps du texte ou équivalent */}
            {(parsedJson.body || parsedJson.texte || parsedJson.content || parsedJson.translation || parsedJson.text) && (
              <div className="mt-2 mb-4 whitespace-pre-wrap">
                {parsedJson.body || parsedJson.texte || parsedJson.content || parsedJson.translation || parsedJson.text}
              </div>
            )}
            
            {/* Titres SEO ou équivalent */}
            {parsedJson.seo_titles && Array.isArray(parsedJson.seo_titles) && parsedJson.seo_titles.length > 0 && (
              <div className="mt-4 p-3 border-t pt-3">
                <h3 className="font-medium mb-2 text-purple-700">Titres SEO:</h3>
                <ul className="list-disc pl-5">
                  {parsedJson.seo_titles.map((title: string, i: number) => (
                    <li key={i} className="mb-1">{title}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Hashtags ou équivalent */}
            {parsedJson.hashtags && Array.isArray(parsedJson.hashtags) && parsedJson.hashtags.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2 text-purple-700">Hashtags:</h3>
                <div className="flex flex-wrap gap-2">
                  {parsedJson.hashtags.map((tag: string, i: number) => (
                    <span key={i} className="text-purple-600 bg-purple-50 px-2 py-1 rounded-md text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Si aucun des champs reconnus n'est présent, afficher la réponse brute */}
            {!parsedJson.main_title && !parsedJson.titre && !parsedJson.title && 
             !parsedJson.body && !parsedJson.texte && !parsedJson.content && !parsedJson.translation && !parsedJson.text &&
             (!parsedJson.seo_titles || !Array.isArray(parsedJson.seo_titles)) &&
             (!parsedJson.hashtags || !Array.isArray(parsedJson.hashtags)) && (
              <pre className="whitespace-pre-wrap break-words bg-gray-50 p-4 rounded-md text-sm overflow-auto">
                {JSON.stringify(parsedJson, null, 2)}
              </pre>
            )}
          </div>
        );
      } catch (e) {
        console.error("Erreur lors du traitement JSON:", e);
        // En cas d'erreur, afficher le texte brut
      }
    }
    
    // Texte brut pour les réponses non-JSON
    return text.split('\n').map((line, index) => {
      if (line.trim()) {
        return <p key={index} className="my-2">{line}</p>;
      }
      return <br key={index} />;
    });
  };

  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div 
          dir={isRTL ? 'rtl' : 'ltr'}
          className="prose max-w-none relative"
        >
          <div className="mb-2 text-sm text-gray-500 flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-purple-600 hover:text-purple-800 hover:bg-purple-50"
              onClick={onCopy}
            >
              <ClipboardCopy className="h-4 w-4 mr-1" /> 
              Copier
            </Button>
          </div>
          <div className="translation-content">
            {renderFormattedText(result)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationResult;
