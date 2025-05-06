
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ResultHeader from './ResultHeader';
import EmptyResult from './EmptyResult';
import ErrorResult from './ErrorResult';
import DirectTranslationResult from './DirectTranslationResult';

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
  // Fonction simplifiée pour afficher le résultat
  const renderFormattedResult = () => {
    if (!result || result.trim() === '') {
      return <EmptyResult />;
    }
    
    console.log("Rendu du résultat avec type:", responseType);
    
    // Si une erreur est détectée
    if (result.includes('Aucune traduction disponible') || responseType === 'error') {
      return <ErrorResult message={result} />;
    }
    
    // Utiliser DirectTranslationResult pour tous les cas valides
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
