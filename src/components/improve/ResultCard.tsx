
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface ResultCardProps {
  title: string;
  content: string | string[];
  handleCopy: (value: string) => Promise<void>;
  isArrayContent?: boolean;
}

export function ResultCard({ title, content, handleCopy, isArrayContent = false }: ResultCardProps) {
  const isRTL = (txt: string = '') => /[\u0600-\u06FF]/.test(txt);
  const dirFrom = (txt: string) => (isRTL(txt) ? 'rtl' : 'ltr');
  const alignFrom = (txt: string) => (isRTL(txt) ? 'text-right' : 'text-left');

  if (isArrayContent && Array.isArray(content)) {
    return (
      <Card className="card-hover">
        <CardContent className="p-4">
          <h3 className="font-bold mb-2">{title}</h3>
          {title === "Keywords" || title === "Hashtags" ? (
            <div className={title === "Keywords" ? "flex flex-wrap gap-2" : "flex flex-col gap-1"}>
              {content.map((item: string, i: number) => (
                <div key={i} className="flex items-center">
                  <span
                    dir={dirFrom(item)}
                    className={alignFrom(item)}
                  >
                    {item}
                  </span>
                  {title === "Keywords" && (
                    <button
                      onClick={() => handleCopy(item)}
                      className="text-purple-600 hover:underline ml-1"
                    >
                      COPIER
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-2">
              {content.map((item: string, i: number) => (
                <li key={i} className="flex justify-between items-center">
                  <span
                    dir={dirFrom(item)}
                    className={alignFrom(item)}
                  >
                    {item}
                  </span>
                  <button
                    onClick={() => handleCopy(item)}
                    className="text-purple-600 hover:underline ml-2"
                  >
                    COPIER
                  </button>
                </li>
              ))}
            </ul>
          )}
          {title === "Hashtags" && (
            <button
              onClick={() => handleCopy(content.join('\n'))}
              className="mt-2 text-purple-600 hover:underline"
            >
              COPIER
            </button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-hover">
      <CardContent className="p-4">
        <h3 className="font-bold mb-2">{title}</h3>
        <p
          dir={dirFrom(content as string)}
          className={alignFrom(content as string)}
        >
          {content as string}
        </p>
        <button
          onClick={() => handleCopy(content as string)}
          className="mt-2 text-purple-600 hover:underline"
        >
          COPIER
        </button>
      </CardContent>
    </Card>
  );
}
