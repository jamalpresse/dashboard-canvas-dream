
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from '@/context/LanguageContext';

interface SourceTextInputProps {
  text: string;
  setText: (text: string) => void;
  isRTL: boolean;
  label?: string;
}

const SourceTextInput: React.FC<SourceTextInputProps> = ({
  text,
  setText,
  isRTL,
  label
}) => {
  const { t } = useLanguage();
  
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">{label || t('translation', 'sourceText')}</span>
        <span className="text-sm text-gray-500">
          {isRTL ? t('common', 'rtl') : t('common', 'ltr')}
        </span>
      </div>
      <Textarea
        placeholder={isRTL ? "الصق النص المراد ترجمته هنا" : "Collez ici votre texte à traduire"}
        value={text}
        onChange={e => setText(e.target.value)}
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`w-full h-40 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-snrt-red ${
          isRTL ? 'text-right' : 'text-left'
        }`}
      />
    </section>
  );
};

export default SourceTextInput;
