
import React from 'react';
import SourceTextInput from '@/components/translation/SourceTextInput';
import ErrorDisplay from '@/components/translation/ErrorDisplay';
import TranslationOutput from '@/components/translation/TranslationOutput';
import LanguageSelector from '@/components/translation/LanguageSelector';
import TranslationActions from '@/components/translation/TranslationActions';
import useTranslation from '@/hooks/useTranslation';
import { useLanguage } from '@/context/LanguageContext';

interface TranslationFormProps {
  onDebugToggle: () => void;
  setDebugData: (data: any) => void;
}

const TranslationForm: React.FC<TranslationFormProps> = ({ onDebugToggle, setDebugData }) => {
  const { t } = useLanguage();
  
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
        label={t('translation', 'sourceText')}
      />

      {/* Translation Actions - All three buttons in one row */}
      <TranslationActions 
        text={text}
        loading={loading}
        handlePaste={handlePaste}
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
