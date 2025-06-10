import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { isRTL, dirFrom, alignFrom } from '@/utils/textUtils';
import { Badge } from "@/components/ui/badge";
import { useLanguage } from '@/context/LanguageContext';

interface ResultCardProps {
  title: string;
  content: string | string[];
  handleCopy: (value: string) => Promise<void>;
  isArrayContent?: boolean;
  displayMode?: "badges" | "paragraph";
}

export function ResultCard({ 
  title, 
  content, 
  handleCopy, 
  isArrayContent = false, 
  displayMode = "badges" 
}: ResultCardProps) {
  const { t } = useLanguage();

  // Check if we're dealing with keywords (both "Keywords" and "Mots-clés" titles)
  const isKeywords = title === "Keywords" || title === "Mots-clés";
  const isHashtags = title === "Hashtags";

  // Comprehensive keyword cleaning function as ultimate defensive measure
  const cleanKeywordText = (text: string): string => {
    console.log("ResultCard cleaning text:", text);
    
    const cleaned = text
      // Remove multiple consecutive Arabic commas (،،، → ،)
      .replace(/،{2,}/g, '،')
      // Remove multiple consecutive regular commas (,,, → ,)
      .replace(/,{2,}/g, ',')
      // Clean mixed comma patterns (،, → ،) and (,، → ،)
      .replace(/،\s*,+\s*/g, '،')
      .replace(/,+\s*،\s*/g, '،')
      // Remove commas at start and end
      .replace(/^[،,\s]+|[،,\s]+$/g, '')
      // Normalize spacing around commas
      .replace(/\s*،\s*/g, '،')
      .replace(/\s*,\s*/g, ',')
      .trim();
    
    console.log("ResultCard cleaned text:", cleaned);
    return cleaned;
  };

  // Render keywords in a more visual way using badges
  const renderKeywords = (items: string[]) => {
    // Clean each keyword as defensive measure
    const cleanedItems = items.map(item => cleanKeywordText(item));
    
    // If displayMode is paragraph, return keywords as a single paragraph with Arabic commas
    if (displayMode === "paragraph" && isKeywords) {
      return renderKeywordsAsParagraph(cleanedItems);
    }

    // Default display as badges
    return (
      <div className="flex flex-wrap gap-2">
        {cleanedItems.map((item: string, i: number) => (
          <div key={i} className="flex items-center mb-2">
            <Badge
              variant="outline"
              className={`px-3 py-1 ${isRTL(item) ? 'text-right' : 'text-left'} bg-purple-50 text-foreground border-purple-200 hover:bg-purple-100`}
              dir={dirFrom(item)}
            >
              {item}
            </Badge>
            <Button
              onClick={() => handleCopy(item)}
              variant="ghost"
              size="sm"
              className="ml-1 p-0 h-auto"
            >
              <Copy className="h-3 w-3 mr-1" /> 
              <span className="text-xs">{t('improve', 'copy')}</span>
            </Button>
          </div>
        ))}
      </div>
    );
  };

  // Enhanced function to render keywords as a paragraph with Arabic commas
  const renderKeywordsAsParagraph = (items: string[]) => {
    console.log("Rendering keywords as paragraph, input items:", items);
    
    // Step 1: Clean each individual keyword thoroughly
    const thoroughlyCleanedItems = items.map(item => {
      const cleaned = cleanKeywordText(item);
      // Additional cleanup for individual keywords
      return cleaned
        .replace(/[،,]+$/, '') // Remove trailing commas
        .replace(/^[،,]+/, '') // Remove leading commas
        .trim();
    }).filter(item => item.length > 0);
    
    console.log("Thoroughly cleaned individual items:", thoroughlyCleanedItems);
    
    // Step 2: Join with single Arabic comma and space
    let joinedText = thoroughlyCleanedItems.join('، ');
    
    // Step 3: Final emergency cleanup of the joined text
    joinedText = joinedText
      // Remove any double commas that might have slipped through
      .replace(/،{2,}/g, '،')
      .replace(/,{2,}/g, ',')
      // Clean mixed patterns one more time
      .replace(/،\s*,+\s*/g, '، ')
      .replace(/,+\s*،\s*/g, '، ')
      // Ensure proper spacing
      .replace(/،(?!\s)/g, '، ')
      .replace(/\s+،/g, '،')
      .replace(/\s+/g, ' ')
      .trim();
    
    console.log("Final joined text:", joinedText);
    
    return (
      <div className="mb-3">
        <p 
          dir={dirFrom(joinedText)} 
          className={`${alignFrom(joinedText)} whitespace-pre-wrap text-foreground`}
        >
          {joinedText}
        </p>
        <Button
          onClick={() => handleCopy(joinedText)}
          variant="outline"
          size="sm"
          className="mt-2"
        >
          <Copy className="h-4 w-4 mr-2" /> {t('improve', 'copy')}
        </Button>
      </div>
    );
  };

  // Render hashtags in a list format
  const renderHashtags = (items: string[]) => {
    return (
      <div className="flex flex-col gap-1">
        {items.map((item: string, i: number) => (
          <div key={i} className="flex items-center">
            <span
              dir={dirFrom(item)}
              className={`${alignFrom(item)} text-foreground`}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (isArrayContent && Array.isArray(content)) {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-4">
          <h3 className="font-bold mb-2 text-foreground">{title}</h3>
          {isKeywords && renderKeywords(content)}
          {isHashtags && renderHashtags(content)}
          {!isKeywords && !isHashtags && (
            <ul className="space-y-2">
              {content.map((item: string, i: number) => (
                <li key={i} className="flex justify-between items-center">
                  <span
                    dir={dirFrom(item)}
                    className={`${alignFrom(item)} text-foreground`}
                  >
                    {item}
                  </span>
                  <Button
                    onClick={() => handleCopy(item)}
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    <span className="text-xs">{t('improve', 'copy')}</span>
                  </Button>
                </li>
              ))}
            </ul>
          )}
          {isHashtags && (
            <Button
              onClick={() => handleCopy(content.join('\n'))}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              <Copy className="h-4 w-4 mr-2" /> {t('improve', 'copyAll')}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4">
        <h3 className="font-bold mb-2 text-foreground">{title}</h3>
        <p
          dir={dirFrom(content as string)}
          className={`${alignFrom(content as string)} whitespace-pre-wrap text-foreground`}
        >
          {content as string}
        </p>
        <Button
          onClick={() => handleCopy(content as string)}
          variant="outline"
          size="sm"
          className="mt-3"
        >
          <Copy className="h-4 w-4 mr-2" /> {t('improve', 'copy')}
        </Button>
      </CardContent>
    </Card>
  );
}
