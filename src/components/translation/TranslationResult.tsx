
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardCopy, AlertCircle } from "lucide-react";
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

  // Function to check if text contains template variables
  const containsTemplateVariables = (text: string): boolean => {
    return typeof text === 'string' && text.includes('{{') && text.includes('}}');
  };

  // Function to render formatted text with markdown-like syntax
  const renderFormattedText = (text: string) => {
    if (!text) return <span className="text-gray-400">Le résultat apparaîtra ici</span>;
    
    console.log("Rendering text:", text);
    
    // Check if the text is an error message about unresolved variables
    if (text.includes('variables non résolues')) {
      return (
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="font-medium text-yellow-700">Problème de traduction</h3>
          </div>
          <p className="text-yellow-600">
            La traduction n'a pas pu être complétée car le webhook a retourné des variables non résolues.
            Veuillez réessayer ou contacter l'administrateur.
          </p>
        </div>
      );
    }
    
    // Check if the text has unresolved template variables
    if (containsTemplateVariables(text)) {
      console.log("Text contains template variables, displaying modified version");
      return (
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="font-medium text-yellow-700">Variables non résolues</h3>
          </div>
          <p className="text-yellow-600 mb-2">
            La réponse contient des variables qui n'ont pas été résolues par le webhook.
          </p>
          <div className="bg-white p-3 rounded border border-yellow-100">
            <p className="text-sm text-gray-700 font-medium mb-1">Réponse reçue:</p>
            <code className="text-xs bg-gray-50 p-2 block rounded whitespace-pre-wrap overflow-auto max-h-40">
              {text}
            </code>
          </div>
        </div>
      );
    }
    
    // Handle JSON strings
    if (isJsonString(text)) {
      try {
        const parsedJson = JSON.parse(text);
        console.log("JSON parsed:", parsedJson);
        
        // Check for error field
        if (parsedJson.error) {
          return (
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
              <div className="flex items-center mb-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                <h3 className="font-medium text-yellow-700">Erreur de traduction</h3>
              </div>
              <p className="text-yellow-600">{parsedJson.error}</p>
            </div>
          );
        }
        
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
              disabled={!result || result.includes('variables non résolues')}
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
