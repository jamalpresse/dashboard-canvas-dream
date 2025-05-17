
import React from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/context/LanguageContext';

interface TranslationActionsProps {
  text: string;
  loading: boolean;
  handlePaste: () => void;
  handleTranslate: () => void;
  handleClear: () => void;
}

const TranslationActions: React.FC<TranslationActionsProps> = ({
  text,
  loading,
  handlePaste,
  handleTranslate,
  handleClear
}) => {
  const { t, isRTL } = useLanguage();

  return (
    <section className={`flex flex-wrap gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <Button 
        onClick={handlePaste} 
        className="bg-snrt-red hover:bg-red-700 text-white"
        disabled={loading}
      >
        {t('translation', 'paste')}
      </Button>
      
      <Button 
        onClick={handleTranslate}
        disabled={!text.trim() || loading}
        className="bg-black hover:bg-gray-800 text-white flex-1"
      >
        {loading ? t('translation', 'loading') : t('translation', 'translate')}
      </Button>
      
      <Button 
        onClick={handleClear}
        disabled={!text.trim() || loading}
        className="text-gray-700 border border-gray-300 hover:bg-gray-100"
      >
        {t('translation', 'clear')}
      </Button>
    </section>
  );
};

export default TranslationActions;
