
import React from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FlashNewsItem {
  id: string | number;
  title: string;
  timestamp: string;
  category?: string;
}

interface FlashNewsProps {
  items: FlashNewsItem[];
  className?: string;
}

export const FlashNews: React.FC<FlashNewsProps> = ({ items, className }) => {
  return (
    <div className={cn("flash-news rounded-lg overflow-hidden", className)}>
      <div className="flex items-center gap-2 bg-red-600 py-2 px-4">
        <Bell className="h-4 w-4 text-white" />
        <h3 className="text-sm font-bold text-white uppercase">Flash News</h3>
      </div>
      
      <div className="space-y-1 max-h-[400px] overflow-y-auto scrollbar-hide">
        {items.length > 0 ? (
          items.map((item) => (
            <div 
              key={item.id} 
              className="p-3 border-b border-gray-800 hover:bg-gray-900 transition-colors"
            >
              {item.category && (
                <span className="snrt-category mb-1 inline-block">{item.category}</span>
              )}
              <p className="text-sm font-medium text-white">{item.title}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="snrt-timestamp">{item.timestamp}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-400">
            Aucune actualité à afficher
          </div>
        )}
      </div>
    </div>
  );
};
