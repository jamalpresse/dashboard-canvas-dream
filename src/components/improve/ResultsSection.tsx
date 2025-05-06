import React from 'react';
import { ResultCard } from './ResultCard';
import ErrorResult from '../translation/ErrorResult';

interface ResultsSectionProps {
  result: any;
  handleCopy: (value: string) => Promise<void>;
}

export function ResultsSection({ result, handleCopy }: ResultsSectionProps) {
  if (!result) return null;

  // Check if the result is a string and try to parse it as JSON
  let processedResult = result;
  if (typeof result === 'string') {
    try {
      processedResult = JSON.parse(result);
      console.log("String result successfully parsed as JSON:", processedResult);
    } catch (err) {
      console.log("Result is a string but not valid JSON, using as is");
      // If it's not valid JSON, we'll keep it as a string and display it directly
    }
  }

  // Handle case where the result is not in expected format
  if (typeof processedResult !== 'object' || processedResult === null) {
    console.log("Result is not an object, displaying raw result");
    return (
      <div className="grid gap-6">
        <ResultCard 
          title="Résultat" 
          content={String(processedResult)} 
          handleCopy={handleCopy} 
        />
      </div>
    );
  }

  // If the result is empty or doesn't have any of the expected fields
  const hasExpectedFields = 
    processedResult.main_title !== undefined ||
    processedResult.body !== undefined ||
    Array.isArray(processedResult.seo_titles) ||
    Array.isArray(processedResult.keywords) ||
    Array.isArray(processedResult.hashtags) ||
    processedResult.youtube_thumbnail_title !== undefined;

  if (!hasExpectedFields) {
    console.log("Result doesn't have expected fields, showing error");
    return <ErrorResult message="Format de réponse inattendu. Veuillez réessayer ou contacter l'administrateur." />;
  }

  // Display the result with the expected format
  return (
    <div className="grid gap-6">
      {processedResult.main_title !== undefined && (
        <ResultCard 
          title="Main Title" 
          content={processedResult.main_title} 
          handleCopy={handleCopy} 
        />
      )}
      
      {processedResult.body !== undefined && (
        <ResultCard 
          title="Body" 
          content={processedResult.body} 
          handleCopy={handleCopy} 
        />
      )}
      
      {Array.isArray(processedResult.seo_titles) && (
        <ResultCard 
          title="SEO Titles" 
          content={processedResult.seo_titles} 
          handleCopy={handleCopy} 
          isArrayContent={true} 
        />
      )}
      
      {Array.isArray(processedResult.keywords) && (
        <ResultCard 
          title="Keywords" 
          content={processedResult.keywords} 
          handleCopy={handleCopy}
          isArrayContent={true} 
        />
      )}
      
      {Array.isArray(processedResult.hashtags) && (
        <ResultCard 
          title="Hashtags" 
          content={processedResult.hashtags} 
          handleCopy={handleCopy}
          isArrayContent={true} 
        />
      )}
      
      {processedResult.youtube_thumbnail_title !== undefined && (
        <ResultCard 
          title="YouTube Thumbnail Title" 
          content={processedResult.youtube_thumbnail_title} 
          handleCopy={handleCopy} 
        />
      )}
    </div>
  );
}
