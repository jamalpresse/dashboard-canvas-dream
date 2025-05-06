
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ResultHeader from './ResultHeader';
import EmptyResult from './EmptyResult';
import ErrorResult from './ErrorResult';
import EnhancedContentResult from './EnhancedContentResult';
import DirectTranslationResult from './DirectTranslationResult';
import UnknownResult from './UnknownResult';

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
  // Function to render formatted result based on response type
  const renderFormattedResult = () => {
    if (!result) {
      return <EmptyResult />;
    }
    
    console.log("Rendering result with type:", responseType);
    
    // If there's an explicit error message
    if (result.includes('Aucune traduction disponible') || responseType === 'error') {
      return <ErrorResult message={result} />;
    }
    
    // Always use DirectTranslationResult to ensure we get plain translations
    return <DirectTranslationResult content={result} />;
  };

  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div 
          dir={isRTL ? 'rtl' : 'ltr'}
          className="prose max-w-none relative"
        >
          <ResultHeader onCopy={onCopy} result={result} />
          <div className="translation-content">
            {renderFormattedResult()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationResult;
