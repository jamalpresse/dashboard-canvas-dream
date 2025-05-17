
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useImproveText } from '@/hooks/useImproveText';
import { InputSection } from '@/components/improve/InputSection';
import { ResultsSection } from '@/components/improve/ResultsSection';
import ImproveNavigationButtons from '@/components/improve/ImproveNavigationButtons';
import { useLanguage } from '@/context/LanguageContext';

export default function Improve() {
  const { t, dir } = useLanguage();
  
  const {
    inputText,
    setInputText,
    loading,
    requestSent,
    result,
    handlePaste,
    handleImprove,
    handleCopy
  } = useImproveText();

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in" dir={dir}>
      <Card className="w-full max-w-3xl mx-auto shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-2xl font-semibold text-foreground flex items-center justify-between">
            <span>{t('improve', 'title')}</span>
            {requestSent && result && (
              <span className="text-sm font-normal bg-snrt-red/10 text-snrt-red px-2 py-1 rounded-full">
                {t('improve', 'resultsAvailable')}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <InputSection
            inputText={inputText}
            setInputText={setInputText}
            handlePaste={handlePaste}
            handleImprove={handleImprove}
            loading={loading}
            requestSent={requestSent}
          />

          {result && (
            <>
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-4 text-sm text-muted-foreground">{t('improve', 'results')}</span>
                </div>
              </div>
              <ResultsSection result={result} handleCopy={handleCopy} />
            </>
          )}
          
          {/* Navigation Buttons */}
          <ImproveNavigationButtons />
        </CardContent>
      </Card>
    </div>
  );
}
