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
export const FlashNews: React.FC<FlashNewsProps> = ({
  items,
  className
}) => {
  return <div className={cn("flash-news rounded-lg overflow-hidden", className)}>
      
      
      <div className="space-y-1 max-h-[400px] overflow-y-auto scrollbar-hide">
        {items.length > 0 ? items.map(item => {}) : <div className="p-4 text-center text-gray-400">
            Aucune actualité à afficher
          </div>}
      </div>
    </div>;
};