
import React from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
  return (
    <div className={cn("flash-news rounded-lg overflow-hidden bg-card border border-gray-800 shadow-md", className)}>
      <div className="flex items-center gap-2 bg-snrt-red text-white px-4 py-2">
        <Bell className="h-5 w-5" />
        <h3 className="font-bold">Flash Info</h3>
      </div>
      
      <div className="space-y-1 max-h-[400px] overflow-y-auto scrollbar-hide">
        {items.length > 0 ? items.map(item => (
          <div key={item.id} className="p-3 border-b border-gray-800 hover:bg-gray-900 transition-colors">
            <div className="flex justify-between items-center mb-1">
              <Badge variant="outline" className="text-xs bg-gray-800 text-gray-300">
                {item.category || "ACTUALITÉ"}
              </Badge>
              <span className="text-xs text-gray-400">{item.timestamp}</span>
            </div>
            <p className="text-sm font-medium">{item.title}</p>
          </div>
        )) : (
          <div className="p-4 text-center text-gray-400">
            Aucune actualité à afficher
          </div>
        )}
      </div>
    </div>
  );
};
