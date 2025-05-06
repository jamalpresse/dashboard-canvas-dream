
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ClipboardCopy, Languages } from "lucide-react";
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
    
    // Handle JSON strings that might be returned
    if (text.trim().startsWith('{') && text.trim().endsWith('}') && isJsonString(text)) {
      try {
        const parsedJson = JSON.parse(text);
        return (
          <div>
            <pre className="whitespace-pre-wrap break-words bg-gray-50 p-4 rounded-md text-sm overflow-auto">
              {JSON.stringify(parsedJson, null, 2)}
            </pre>
            {parsedJson.translation || parsedJson.texte || parsedJson.text ? (
              <div className="mt-4 p-4 border rounded-md bg-white">
                <h3 className="font-medium mb-2 text-purple-700">Texte traduit:</h3>
                <p className="text-gray-800">{parsedJson.translation || parsedJson.texte || parsedJson.text}</p>
              </div>
            ) : null}
          </div>
        );
      } catch (e) {
        // If it's not valid JSON, continue with normal rendering
        console.log("Format JSON détecté mais non valide, traitement comme texte");
      }
    }
    
    // Split by lines to process headers and lists
    return text.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        return <h2 key={index} className="text-xl font-bold mb-3 text-purple-800">{line.substring(2)}</h2>;
      } else if (line.startsWith('## ')) {
        return <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-purple-700">{line.substring(3)}</h3>;
      } else if (line.startsWith('### ')) {
        return <h4 key={index} className="text-md font-medium mt-3 mb-2 text-purple-600">{line.substring(4)}</h4>;
      } 
      // List items
      else if (line.startsWith('• ')) {
        return <li key={index} className="ml-4 my-1">{line.substring(2)}</li>;
      } 
      // Hashtags
      else if (line.includes('#')) {
        const hashtagRegex = /#[\w\u0600-\u06FF]+/g;
        const parts = line.split(hashtagRegex);
        const hashtags = line.match(hashtagRegex) || [];
        
        return (
          <p key={index} className="my-1">
            {parts.map((part, i) => (
              <React.Fragment key={`part-${i}`}>
                {part}
                {hashtags[i] && <span className="text-purple-600 font-medium">{hashtags[i]}</span>}
              </React.Fragment>
            ))}
          </p>
        );
      }
      // Normal paragraph with line breaks
      else if (line.trim()) {
        return <p key={index} className="my-2">{line}</p>;
      }
      // Empty lines become breaks
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
