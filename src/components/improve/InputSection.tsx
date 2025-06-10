
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { isRTL, alignFrom, dirFrom } from '@/utils/textUtils';
import { Loader2, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface InputSectionProps {
  inputText: string;
  setInputText: (text: string) => void;
  handlePaste: () => Promise<void>;
  handleImprove: () => Promise<void>;
  loading: boolean;
  requestSent?: boolean;
}

export function InputSection({ 
  inputText, 
  setInputText, 
  handlePaste, 
  handleImprove, 
  loading,
  requestSent = false
}: InputSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder={t('improve', 'placeholder')}
        dir={dirFrom(inputText)}
        className={`w-full h-40 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-snrt-red text-black ${alignFrom(
          inputText
        )}`}
      />
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handlePaste}
          className="px-6 py-2 bg-snrt-red text-white rounded-md hover:bg-red-700 shadow-sm transition-colors"
        >
          {t('improve', 'paste')}
        </button>
        <button
          type="button"
          onClick={handleImprove}
          disabled={loading}
          className={`px-6 py-2 text-white rounded-md shadow-sm flex items-center justify-center ${
            loading 
              ? 'bg-gray-400' 
              : 'bg-gradient-to-r from-snrt-red to-red-700 hover:from-red-700 hover:to-red-800 transition-colors'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('improve', 'loadingMessage')}
            </>
          ) : (
            t('improve', 'improveAndSeo')
          )}
        </button>
      </div>

      {loading && (
        <div className="text-center">
          <p className="text-snrt-red">{t('improve', 'processingMessage')}</p>
          {requestSent && (
            <p className="text-green-600 flex items-center justify-center mt-2">
              <Check className="h-4 w-4 mr-2" />
              {t('improve', 'successMessage')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
