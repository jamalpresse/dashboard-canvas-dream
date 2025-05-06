
import React from 'react';
import SourceTextInput from '@/components/translation/SourceTextInput';
import ErrorDisplay from '@/components/translation/ErrorDisplay';
import TranslationResult from '@/components/translation/TranslationResult';
import ResultActions from '@/components/translation/ResultActions';
import LanguageSelector from '@/components/translation/LanguageSelector';
import useTranslation from '@/hooks/useTranslation';

interface TranslationFormProps {
  onDebugToggle: () => void;
  setDebugData: (data: any) => void;
}

const TranslationForm: React.FC<TranslationFormProps> = ({ onDebugToggle, setDebugData }) => {
  const {
    text,
    setText,
    langPair,
    setLangPair,
    result,
    error,
    loading,
    responseType,
    isSourceRTL,
    isTargetRTL,
    handlePaste,
    handleTranslate,
    handleClear,
    handleCopy
  } = useTranslation(setDebugData);

  return (
    <>
      {/* Source Text Input Section */}
      <SourceTextInput
        text={text}
        setText={setText}
        isRTL={isSourceRTL}
        handlePaste={handlePaste}
        handleTranslate={handleTranslate}
        handleClear={handleClear}
        loading={loading}
      />

      {/* Language Selector Component */}
      <section>
        <LanguageSelector 
          selectedLangPair={langPair}
          onLangPairChange={setLangPair}
        />
      </section>

      {/* Error Messages */}
      <ErrorDisplay error={error} />

      {/* Translation Results */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">
            {responseType === 'enhanced-content' ? 'Contenu amélioré:' : 'Résultat de la traduction:'}
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
    </>
  );
};

export default TranslationForm;
