
import React from 'react';
import { Calendar, ExternalLink, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { isRTL, dirFrom } from "@/utils/textUtils";
import { Badge } from "@/components/ui/badge";

interface NewsCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  source: string;
  date: string;
  link: string;
  compact?: boolean;
  error?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  title,
  description,
  imageUrl,
  source,
  date,
  link,
  compact = false,
  error
}) => {
  const titleDir = dirFrom(title);
  const descDir = dirFrom(description);
  
  // Clean HTML from description
  const cleanDescription = description.replace(/<\/?[^>]+(>|$)/g, "");
  
  if (error) {
    return (
      <Card className="overflow-hidden border-red-200 bg-red-50 h-full flex flex-col">
        <CardHeader className="p-4 pb-2 border-b border-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <h3 className="font-medium text-red-700">Erreur</h3>
          </div>
        </CardHeader>
        <CardContent className="p-4 text-center flex items-center justify-center flex-grow">
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col group relative">
      {imageUrl && !compact && (
        <div className="h-48 overflow-hidden">
          <img 
            src={imageUrl || '/placeholder.svg'} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
      )}
      <CardHeader className={compact ? "p-4 pb-1" : "pb-2"}>
        <h3 
          className={`font-bold ${compact ? "text-base" : "text-lg"} line-clamp-2 group-hover:text-purple-700 transition-colors`}
          title={title}
          dir={titleDir}
        >
          {title}
        </h3>
        <div className="flex items-center text-xs text-gray-500 gap-1 flex-wrap">
          <Badge variant="outline" className="bg-gray-100 font-normal">
            {source}
          </Badge>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {date}
          </span>
        </div>
      </CardHeader>
      <CardContent className={`${compact ? "py-0 px-4" : "py-2"} flex-grow`}>
        <p 
          className={`text-gray-600 ${compact ? "line-clamp-2 text-sm" : "line-clamp-3"}`}
          title={cleanDescription} 
          dir={descDir}
        >
          {cleanDescription}
        </p>
      </CardContent>
      <CardFooter className={compact ? "pt-0 p-4" : "pt-2"}>
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-purple-700 hover:text-purple-900 flex items-center gap-1 transition-colors group-hover:underline"
        >
          {isRTL(title) ? "قراءة المقال الكامل" : "Lire l'article complet"}
          <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </a>
      </CardFooter>
    </Card>
  );
};
