
import React from 'react';
import { ResultCard } from './ResultCard';

interface ResultsSectionProps {
  result: any;
  handleCopy: (value: string) => Promise<void>;
}

export function ResultsSection({ result, handleCopy }: ResultsSectionProps) {
  if (!result) return null;

  return (
    <div className="grid gap-6">
      {result.main_title !== undefined && (
        <ResultCard 
          title="Main Title" 
          content={result.main_title} 
          handleCopy={handleCopy} 
        />
      )}
      
      {result.body !== undefined && (
        <ResultCard 
          title="Body" 
          content={result.body} 
          handleCopy={handleCopy} 
        />
      )}
      
      {Array.isArray(result.seo_titles) && (
        <ResultCard 
          title="SEO Titles" 
          content={result.seo_titles} 
          handleCopy={handleCopy} 
          isArrayContent={true} 
        />
      )}
      
      {Array.isArray(result.keywords) && (
        <ResultCard 
          title="Keywords" 
          content={result.keywords} 
          handleCopy={handleCopy}
          isArrayContent={true} 
        />
      )}
      
      {Array.isArray(result.hashtags) && (
        <ResultCard 
          title="Hashtags" 
          content={result.hashtags} 
          handleCopy={handleCopy}
          isArrayContent={true} 
        />
      )}
      
      {result.youtube_thumbnail_title !== undefined && (
        <ResultCard 
          title="YouTube Thumbnail Title" 
          content={result.youtube_thumbnail_title} 
          handleCopy={handleCopy} 
        />
      )}
    </div>
  );
}
