
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardCopy, AlertCircle, FileText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TranslationResultProps {
  result: string;
  isRTL: boolean;
  onCopy: () => void;
  responseType: 'direct-translation' | 'enhanced-content' | 'error' | 'unknown';
}

const TranslationResult: React.FC<TranslationResultProps> = ({ 
  result, 
  isRTL, 
  onCopy,
  responseType 
}) => {
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

  // Function to render a non-JSON text response
  const renderTextResponse = (text: string) => {
    if (!text) return <span className="text-gray-400">Le résultat apparaîtra ici</span>;
    
    return text.split('\n').map((line, index) => {
      if (line.trim()) {
        return <p key={index} className="my-2">{line}</p>;
      }
      return <br key={index} />;
    });
  };

  // Function to render an error message
  const renderErrorMessage = (message: string) => {
    return (
      <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
        <div className="flex items-center mb-2">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
          <h3 className="font-medium text-yellow-700">Problème de traduction</h3>
        </div>
        <p className="text-yellow-600">
          {message || "La traduction n'a pas pu être complétée. Veuillez réessayer ou contacter l'administrateur."}
        </p>
      </div>
    );
  };

  // Function to render enhanced content (SEO, hashtags, etc.)
  const renderEnhancedContent = (jsonContent: any) => {
    try {
      const content = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;
      
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-purple-700">Contenu amélioré avec SEO</span>
          </div>
          
          {/* Titre principal */}
          {content.main_title && (
            <h2 className="text-xl font-bold mb-3 text-purple-800">
              {content.main_title}
            </h2>
          )}
          
          {/* Corps du texte */}
          {content.body && (
            <div className="mt-2 mb-4 whitespace-pre-wrap text-gray-700">
              {content.body}
            </div>
          )}
          
          {/* Titres SEO */}
          {content.seo_titles && Array.isArray(content.seo_titles) && content.seo_titles.length > 0 && (
            <div className="mt-4 p-3 border-t pt-3">
              <h3 className="font-medium mb-2 text-purple-700">Titres SEO:</h3>
              <ul className="list-disc pl-5">
                {content.seo_titles.map((title: string, i: number) => (
                  <li key={i} className="mb-1">{title}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Hashtags */}
          {content.hashtags && Array.isArray(content.hashtags) && content.hashtags.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2 text-purple-700">Hashtags:</h3>
              <div className="flex flex-wrap gap-2">
                {content.hashtags.map((tag: string, i: number) => (
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
      return renderTextResponse(jsonContent);
    }
  };

  // Function to render formatted text based on response type
  const renderFormattedResult = () => {
    if (!result) {
      return <span className="text-gray-400">Le résultat apparaîtra ici</span>;
    }
    
    console.log("Rendering result with type:", responseType);
    
    // If there's an explicit error message
    if (result.includes('Aucune traduction disponible') || responseType === 'error') {
      return renderErrorMessage(result);
    }
    
    // If it's a JSON string
    if (isJsonString(result)) {
      try {
        const jsonContent = JSON.parse(result);
        
        // Render based on response type
        if (responseType === 'enhanced-content') {
          return renderEnhancedContent(jsonContent);
        } else if (responseType === 'direct-translation') {
          // If it's a direct translation but in JSON format
          return (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-700">Traduction</span>
              </div>
              <div className="whitespace-pre-wrap">
                {typeof jsonContent === 'string' ? jsonContent : JSON.stringify(jsonContent, null, 2)}
              </div>
            </div>
          );
        } else {
          // For unknown or unspecified response types, render full JSON
          return (
            <pre className="whitespace-pre-wrap break-words bg-gray-50 p-4 rounded-md text-sm overflow-auto">
              {result}
            </pre>
          );
        }
      } catch (e) {
        // If JSON parsing fails, render as text
        return renderTextResponse(result);
      }
    }
    
    // For plain text responses
    return renderTextResponse(result);
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
              disabled={!result || result.includes('Aucune traduction disponible')}
            >
              <ClipboardCopy className="h-4 w-4 mr-1" /> 
              Copier
            </Button>
          </div>
          <div className="translation-content">
            {renderFormattedResult()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationResult;
