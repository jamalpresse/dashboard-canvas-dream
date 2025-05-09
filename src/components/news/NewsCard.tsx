
import React from 'react';
import { Calendar, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface NewsCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  source: string;
  date: string;
  link: string;
  compact?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  title,
  description,
  imageUrl,
  source,
  date,
  link,
  compact = false
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col group">
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
          title={title} // Add tooltip for full title on hover
        >
          {title}
        </h3>
        <div className="flex items-center text-xs text-gray-500 gap-1">
          <span className="font-medium bg-gray-100 px-2 py-0.5 rounded-full">{source}</span>
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
          title={description} // Add tooltip for full description on hover
        >
          {description}
        </p>
      </CardContent>
      <CardFooter className={compact ? "pt-0 p-4" : "pt-2"}>
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-purple-700 hover:text-purple-900 flex items-center gap-1 transition-colors group-hover:underline"
        >
          Lire l'article complet
          <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </a>
      </CardFooter>
    </Card>
  );
};
