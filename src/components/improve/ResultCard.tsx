import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { isRTL, dirFrom, alignFrom } from '@/utils/textUtils';
import { Badge } from "@/components/ui/badge";

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
  // Check if we're dealing with keywords (both "Keywords" and "Mots-clés" titles)
  const isKeywords = title === "Keywords" || title === "Mots-clés";
  const isHashtags = title === "Hashtags";

  // Render keywords in a more visual way using badges
  const renderKeywords = (items: string[]) => {
    // If displayMode is paragraph, return keywords as a single paragraph with Arabic commas
    if (displayMode === "paragraph" && isKeywords) {
      return renderKeywordsAsParagraph(items);
    }

    // Default display as badges
    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item: string, i: number) => (
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
              <span className="text-xs">Copier</span>
            </Button>
          </div>
        ))}
      </div>
    );
  };

  // New function to render keywords as a paragraph with Arabic commas
  const renderKeywordsAsParagraph = (items: string[]) => {
    const joinedText = items.join('، '); // Join with single Arabic comma
    
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
          <Copy className="h-4 w-4 mr-2" /> Copier
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
                    <span className="text-xs">Copier</span>
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
              <Copy className="h-4 w-4 mr-2" /> Copier tous
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
          <Copy className="h-4 w-4 mr-2" /> Copier
        </Button>
      </CardContent>
    </Card>
  );
}
