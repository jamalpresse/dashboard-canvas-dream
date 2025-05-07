
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useImproveText } from '@/hooks/useImproveText';
import { InputSection } from '@/components/improve/InputSection';
import { ResultsSection } from '@/components/improve/ResultsSection';
import ImproveNavigationButtons from '@/components/improve/ImproveNavigationButtons';

export default function Improve() {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6 animate-fade-in">
      <Card className="w-full max-w-3xl mx-auto shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">Améliorer Texte & SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <InputSection
            inputText={inputText}
            setInputText={setInputText}
            handlePaste={handlePaste}
            handleImprove={handleImprove}
            loading={loading}
            requestSent={requestSent}
          />

          {result && (
            <ResultsSection result={result} handleCopy={handleCopy} />
          )}
          
          {/* Navigation Buttons */}
          <ImproveNavigationButtons />
        </CardContent>
      </Card>
    </div>
  );
}
