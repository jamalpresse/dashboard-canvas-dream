
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
            title="Texte après amélioration" 
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
          title="Texte après amélioration" 
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

  console.log('Improve keys', Object.keys(processedResult), Object.keys(processedResult?.content || {}), Object.keys(processedResult?.data || {}));

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

  // Normalize fields into 5 target sections
  const improvedText: string | null =
    (typeof processedResult.rewrittenText === 'string' && processedResult.rewrittenText) ||
    (typeof processedResult?.content?.rewrittenText === 'string' && processedResult.content.rewrittenText) ||
    (typeof processedResult?.data?.rewrittenText === 'string' && processedResult.data.rewrittenText) ||
    (typeof processedResult.body === 'string' && processedResult.body) ||
    (typeof processedResult.improved_text === 'string' && processedResult.improved_text) ||
    (typeof processedResult.texte_ameliore === 'string' && processedResult.texte_ameliore) ||
    (typeof processedResult.text === 'string' && processedResult.text) ||
    (typeof processedResult.content === 'string' && processedResult.content) ||
    (typeof processedResult.result === 'string' && processedResult.result) ||
    (processedResult.response && typeof processedResult.response.body === 'string' && processedResult.response.body) ||
    null;

  const recommendedTitlesRaw =
    processedResult.seoTitles ??
    processedResult.seo_titles ??
    processedResult.titles ??
    processedResult.titres_recommandes ??
    null;
  const recommendedTitles: string[] = Array.isArray(recommendedTitlesRaw)
    ? recommendedTitlesRaw
    : (typeof recommendedTitlesRaw === 'string' && recommendedTitlesRaw.trim() !== ''
      ? recommendedTitlesRaw.split(/\r?\n|[•\-]\s+/).map((s: string) => s.trim()).filter(Boolean)
      : []);

  // Build tags from keywords/mots_cles/tags (string or array), clean and dedupe
  const collectToArray = (val: any): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val.map(String);
    if (typeof val === 'string') return cleanKeywords(val);
    return [];
  };

  const tagsRaw: string[] = [
    ...collectToArray(processedResult.keywords),
    ...collectToArray(processedResult.mots_cles),
    ...collectToArray(processedResult.tags),
  ];
  const tags: string[] = Array.from(new Set(tagsRaw.map((k) => k.trim()).filter(Boolean)));

  const hashtags: string[] = Array.isArray(processedResult.hashtags)
    ? processedResult.hashtags.map(String)
    : (typeof processedResult.hashtags === 'string' ? cleanKeywords(processedResult.hashtags) : []);

  const shortTitle: string | null =
    (typeof processedResult.short_title === 'string' && processedResult.short_title) ||
    (typeof processedResult.youtube_thumbnail_title === 'string' && processedResult.youtube_thumbnail_title) ||
    (typeof processedResult.titre_court === 'string' && processedResult.titre_court) ||
    (typeof processedResult.thumbnailTitle === 'string' && processedResult.thumbnailTitle) ||
    null;

  // Determine if there are any recognized fields beyond improved text
  const hasOtherFields = Boolean(
    recommendedTitles.length || tags.length || hashtags.length || shortTitle
  );
  const shouldShowRawJSON = !hasOtherFields && !improvedText;

  // Display the result with the requested 5 sections
  return (
    <div className="grid gap-6">
      <ResultCard 
        title="Texte après amélioration" 
        content={improvedText ?? ''} 
        handleCopy={handleCopy} 
      />

      {recommendedTitles.length > 0 && (
        <ResultCard 
          title="Titres recommandés" 
          content={recommendedTitles} 
          handleCopy={handleCopy} 
          isArrayContent={true} 
        />
      )}

      {tags.length > 0 && (
        <ResultCard 
          title="Tags" 
          content={tags} 
          handleCopy={handleCopy}
          isArrayContent={true}
        />
      )}

      {hashtags.length > 0 && (
        <ResultCard 
          title="Hashtags" 
          content={hashtags} 
          handleCopy={handleCopy}
          isArrayContent={true} 
        />
      )}

      {shortTitle && (
        <ResultCard 
          title="Titre court" 
          content={shortTitle} 
          handleCopy={handleCopy} 
        />
      )}

      {shouldShowRawJSON && (
        <ResultCard 
          title="Résultat (Format Brut)" 
          content={JSON.stringify(processedResult, null, 2)} 
          handleCopy={(value) => handleCopy(value)} 
        />
      )}
    </div>
  );
}
