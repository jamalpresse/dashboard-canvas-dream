
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface TranslationResultProps {
  result: string;
  isRTL: boolean;
  onCopy: () => void;
}

const TranslationResult: React.FC<TranslationResultProps> = ({ result, isRTL, onCopy }) => {
  // Function to render formatted text with markdown-like syntax
  const renderFormattedText = (text: string) => {
    if (!text) return <span className="text-gray-400">Le résultat apparaîtra ici</span>;
    
    // Split by lines to process headers and lists
    return text.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        return <h2 key={index} className="text-xl font-bold mb-2">{line.substring(2)}</h2>;
      } else if (line.startsWith('## ')) {
        return <h3 key={index} className="text-lg font-semibold mt-4 mb-2">{line.substring(3)}</h3>;
      } else if (line.startsWith('### ')) {
        return <h4 key={index} className="text-md font-medium mt-3 mb-1">{line.substring(4)}</h4>;
      } 
      // List items
      else if (line.startsWith('• ')) {
        return <li key={index} className="ml-4">{line.substring(2)}</li>;
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
          className="prose max-w-none"
          onClick={onCopy}
        >
          {renderFormattedText(result)}
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationResult;
