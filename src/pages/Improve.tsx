
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
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center justify-between">
            <span>Améliorer Texte & SEO</span>
            {requestSent && result && (
              <span className="text-sm font-normal text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Résultats disponibles ✓
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
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500">Résultats</span>
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
