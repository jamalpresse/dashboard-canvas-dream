
import React from 'react';
import SourceTextInput from '@/components/translation/SourceTextInput';
import ErrorDisplay from '@/components/translation/ErrorDisplay';
import TranslationOutput from '@/components/translation/TranslationOutput';
import LanguageSelector from '@/components/translation/LanguageSelector';
import TranslationControls from '@/components/translation/TranslationControls';
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
      />

      {/* Translation Controls */}
      <TranslationControls
        loading={loading}
        handleTranslate={handleTranslate}
        handleClear={handleClear}
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
      <TranslationOutput
        result={result}
        isTargetRTL={isTargetRTL}
        responseType={responseType}
        handleCopy={handleCopy}
        handleClear={handleClear}
        onDebugToggle={onDebugToggle}
      />
    </>
  );
};

export default TranslationForm;
