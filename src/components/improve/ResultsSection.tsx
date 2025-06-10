
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
      return (
        <div className="grid gap-6">
          <ResultCard 
            title="Résultat" 
            content={result} 
            handleCopy={handleCopy} 
          />
        </div>
      );
    }
  }

  // Handle simple body text result - common fallback format
  if (typeof processedResult === 'object' && processedResult !== null && 
      processedResult.body && Object.keys(processedResult).length === 1) {
    console.log("Simple body result detected");
    return (
      <div className="grid gap-6">
        <ResultCard 
          title="Contenu Amélioré" 
          content={processedResult.body} 
          handleCopy={handleCopy} 
        />
      </div>
    );
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

  // Enhanced and comprehensive cleaning function for keywords
  const cleanKeywords = (keywordString: string): string[] => {
    console.log("Original keyword string:", keywordString);
    
    // Step 1: Multiple comprehensive cleaning passes
    let cleaned = keywordString
      // Remove multiple consecutive Arabic commas (،،، → ،)
      .replace(/،{2,}/g, '،')
      // Remove multiple consecutive regular commas (,,, → ,)
      .replace(/,{2,}/g, ',')
      // Clean up mixed comma patterns (،, → ،) and (,، → ،)
      .replace(/،\s*,+\s*/g, '، ')
      .replace(/,+\s*،\s*/g, '، ')
      // Remove commas at start and end of string
      .replace(/^[،,\s]+|[،,\s]+$/g, '')
      // Normalize spaces around commas
      .replace(/\s*،\s*/g, '، ')
      .replace(/\s*,\s*/g, ', ');
    
    console.log("After initial cleaning:", cleaned);
    
    // Step 2: Smart splitting logic with fallback options
    let keywordArray;
    if (cleaned.includes('،')) {
      // Split by Arabic comma first
      keywordArray = cleaned.split(/،+/);
    } else if (cleaned.includes(',')) {
      // Split by regular comma if no Arabic comma
      keywordArray = cleaned.split(/,+/);
    } else {
      // Split by spaces as last resort
      keywordArray = cleaned.split(/\s+/);
    }
    
    // Step 3: Clean each individual keyword thoroughly
    const finalKeywords = keywordArray
      .map((keyword: string) => {
        return keyword
          .trim()
          // Remove any remaining commas at start/end of individual keywords
          .replace(/^[،,]+|[،,]+$/g, '')
          .trim();
      })
      .filter((keyword: string) => keyword.length > 0 && keyword !== '،' && keyword !== ',');
    
    console.log("Final processed keywords:", finalKeywords);
    return finalKeywords;
  };

  // Process keywords field - enhanced handling for Arabic commas
  if (processedResult.keywords && typeof processedResult.keywords === 'string') {
    processedResult.keywords = cleanKeywords(processedResult.keywords);
    console.log("Processed keywords from string:", processedResult.keywords);
  }

  // Process mots_cles field with the same enhanced logic
  if (processedResult.mots_cles && typeof processedResult.mots_cles === 'string') {
    processedResult.mots_cles = cleanKeywords(processedResult.mots_cles);
    console.log("Processed mots_cles from string:", processedResult.mots_cles);
  }

  // If the result is empty or doesn't have any of the expected fields
  const hasExpectedFields = 
    processedResult.main_title !== undefined ||
    processedResult.body !== undefined ||
    Array.isArray(processedResult.seo_titles) ||
    Array.isArray(processedResult.keywords) ||
    Array.isArray(processedResult.mots_cles) ||
    Array.isArray(processedResult.hashtags) ||
    processedResult.youtube_thumbnail_title !== undefined;

  if (!hasExpectedFields) {
    // Display as raw JSON if we can't interpret it
    console.log("Result doesn't have expected fields, showing raw JSON");
    return (
      <div className="grid gap-6">
        <ResultCard 
          title="Résultat (Format Brut)" 
          content={JSON.stringify(processedResult, null, 2)} 
          handleCopy={(value) => handleCopy(value)} 
        />
      </div>
    );
  }

  // Display the result with the expected format
  return (
    <div className="grid gap-6">
      {processedResult.main_title !== undefined && (
        <ResultCard 
          title="Titre Principal" 
          content={processedResult.main_title} 
          handleCopy={handleCopy} 
        />
      )}
      
      {processedResult.body !== undefined && (
        <ResultCard 
          title="Corps du Texte" 
          content={processedResult.body} 
          handleCopy={handleCopy} 
        />
      )}
      
      {Array.isArray(processedResult.seo_titles) && processedResult.seo_titles.length > 0 && (
        <ResultCard 
          title="Titres SEO" 
          content={processedResult.seo_titles} 
          handleCopy={handleCopy} 
          isArrayContent={true} 
        />
      )}
      
      {/* Support both "keywords" and "mots_cles" fields with paragraph display mode */}
      {Array.isArray(processedResult.keywords) && processedResult.keywords.length > 0 && (
        <ResultCard 
          title="Mots-clés" 
          content={processedResult.keywords} 
          handleCopy={handleCopy}
          isArrayContent={true}
          displayMode="paragraph" 
        />
      )}
      
      {/* Add support for French "mots_cles" field with paragraph display mode */}
      {Array.isArray(processedResult.mots_cles) && processedResult.mots_cles.length > 0 && (
        <ResultCard 
          title="Mots-clés" 
          content={processedResult.mots_cles} 
          handleCopy={handleCopy}
          isArrayContent={true}
          displayMode="paragraph"
        />
      )}
      
      {/* Handle string keywords that weren't processed earlier */}
      {processedResult.keywords && !Array.isArray(processedResult.keywords) && (
        <ResultCard 
          title="Mots-clés" 
          content={String(processedResult.keywords)} 
          handleCopy={handleCopy}
        />
      )}
      
      {Array.isArray(processedResult.hashtags) && processedResult.hashtags.length > 0 && (
        <ResultCard 
          title="Hashtags" 
          content={processedResult.hashtags} 
          handleCopy={handleCopy}
          isArrayContent={true} 
        />
      )}
      
      {processedResult.youtube_thumbnail_title !== undefined && (
        <ResultCard 
          title="Titre Miniature YouTube" 
          content={processedResult.youtube_thumbnail_title} 
          handleCopy={handleCopy} 
        />
      )}
    </div>
  );
}
