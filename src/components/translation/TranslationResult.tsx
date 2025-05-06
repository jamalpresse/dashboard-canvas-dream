
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
    if (!str) return false;
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
    
    console.log("Rendering text:", text);
    
    // Check if the text has unresolved template variables
    if (text.includes('{{') && text.includes('}}')) {
      console.log("Text contains template variables, displaying raw");
      return <div className="bg-yellow-50 p-3 border border-yellow-200 rounded">
        <p className="text-yellow-700 mb-2 font-semibold">Réponse brute du webhook (contient des variables non résolues):</p>
        <code className="whitespace-pre-wrap block text-sm">{text}</code>
      </div>;
    }
    
    // Handle JSON strings
    if (isJsonString(text)) {
      try {
        const parsedJson = JSON.parse(text);
        console.log("JSON parsed:", parsedJson);
        
        // Check for Traduction field first (response wrapper)
        const contentToRender = parsedJson.Traduction ? 
          (typeof parsedJson.Traduction === 'string' && isJsonString(parsedJson.Traduction) ? 
            JSON.parse(parsedJson.Traduction) : parsedJson.Traduction) : 
          parsedJson;
        
        console.log("Content to render:", contentToRender);
        
        // Si c'est une chaîne simple, l'afficher directement
        if (typeof contentToRender === 'string') {
          return <div className="whitespace-pre-wrap">{contentToRender}</div>;
        }
        
        // Si contentToRender est null ou undefined
        if (contentToRender == null) {
          return <div className="text-gray-500">Aucun contenu disponible</div>;
        }
        
        return (
          <div>
            {/* Titre principal ou équivalent */}
            {(contentToRender.main_title || contentToRender.titre || contentToRender.title) && (
              <h2 className="text-xl font-bold mb-3 text-purple-800">
                {contentToRender.main_title || contentToRender.titre || contentToRender.title}
              </h2>
            )}
            
            {/* Corps du texte ou équivalent */}
            {(contentToRender.body || contentToRender.texte || contentToRender.content || 
              contentToRender.translation || contentToRender.text || contentToRender.output) && (
              <div className="mt-2 mb-4 whitespace-pre-wrap">
                {contentToRender.body || contentToRender.texte || contentToRender.content || 
                 contentToRender.translation || contentToRender.text || contentToRender.output}
              </div>
            )}
            
            {/* Titres SEO ou équivalent */}
            {contentToRender.seo_titles && Array.isArray(contentToRender.seo_titles) && contentToRender.seo_titles.length > 0 && (
              <div className="mt-4 p-3 border-t pt-3">
                <h3 className="font-medium mb-2 text-purple-700">Titres SEO:</h3>
                <ul className="list-disc pl-5">
                  {contentToRender.seo_titles.map((title: string, i: number) => (
                    <li key={i} className="mb-1">{title}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Hashtags ou équivalent */}
            {contentToRender.hashtags && Array.isArray(contentToRender.hashtags) && contentToRender.hashtags.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2 text-purple-700">Hashtags:</h3>
                <div className="flex flex-wrap gap-2">
                  {contentToRender.hashtags.map((tag: string, i: number) => (
                    <span key={i} className="text-purple-600 bg-purple-50 px-2 py-1 rounded-md text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Si aucun des champs reconnus n'est présent ou si c'est un objet simple, afficher proprement */}
            {!contentToRender.main_title && !contentToRender.titre && !contentToRender.title && 
             !contentToRender.body && !contentToRender.texte && !contentToRender.content && 
             !contentToRender.translation && !contentToRender.text && !contentToRender.output &&
             (!contentToRender.seo_titles || !Array.isArray(contentToRender.seo_titles)) &&
             (!contentToRender.hashtags || !Array.isArray(contentToRender.hashtags)) && (
              <pre className="whitespace-pre-wrap break-words bg-gray-50 p-4 rounded-md text-sm overflow-auto">
                {JSON.stringify(contentToRender, null, 2)}
              </pre>
            )}
          </div>
        );
      } catch (e) {
        console.error("Error processing JSON:", e);
        // En cas d'erreur, afficher le texte brut
        return <div className="whitespace-pre-wrap">{text}</div>;
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
