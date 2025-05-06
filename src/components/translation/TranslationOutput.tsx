
import React from 'react';
import TranslationResult from '@/components/translation/TranslationResult';
import ResultActions from '@/components/translation/ResultActions';

interface TranslationOutputProps {
  result: string;
  isTargetRTL: boolean;
  responseType: 'direct-translation' | 'enhanced-content' | 'error' | 'unknown';
  handleCopy: () => void;
  handleClear: () => void;
  onDebugToggle: () => void;
}

const TranslationOutput: React.FC<TranslationOutputProps> = ({
  result,
  isTargetRTL,
  responseType,
  handleCopy,
  handleClear,
  onDebugToggle
}) => {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">
          Résultat de la traduction:
        </span>
        <span className="text-sm text-gray-500">
          {isTargetRTL ? 'RTL' : 'LTR'}
        </span>
      </div>
      
      <TranslationResult 
        result={result} 
        isRTL={isTargetRTL} 
        onCopy={handleCopy}
        responseType={responseType}
      />
      
      <ResultActions 
        result={result}
        handleCopy={handleCopy}
        handleClear={handleClear}
        onDebugToggle={onDebugToggle}
      />
    </section>
  );
};

export default TranslationOutput;
