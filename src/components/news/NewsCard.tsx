
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
}

export const NewsCard: React.FC<NewsCardProps> = ({
  title,
  description,
  imageUrl,
  source,
  date,
  link
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {imageUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={imageUrl || '/placeholder.svg'} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <h3 className="font-bold text-lg line-clamp-2 hover:text-purple-700 transition-colors">{title}</h3>
        <div className="flex items-center text-sm text-gray-500 gap-1">
          <span className="font-medium">{source}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {date}
          </span>
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-gray-600 line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="pt-2">
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-purple-700 hover:text-purple-900 flex items-center gap-1 transition-colors"
        >
          Lire l'article complet
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardFooter>
    </Card>
  );
};
