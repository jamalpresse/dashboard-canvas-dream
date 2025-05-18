
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { isRTL, dirFrom } from "@/utils/textUtils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { isDefined, hasItems } from "@/utils/dataUtils";

export type TimelineItem = {
  id: string;
  title: string;
  description?: string;
  time: string;
  icon?: React.ReactNode;
  type?: "default" | "success" | "warning" | "error";
};

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
  title?: string;
  showViewAll?: boolean;
}

export function ActivityTimeline({
  items = [], // Default to empty array to avoid undefined errors
  className,
  title = "Activités récentes",
  showViewAll = false
}: TimelineProps) {
  // Validate items to ensure they're valid before trying to render
  const validItems = hasItems(items) 
    ? items.filter(item => isDefined(item) && isDefined(item.id) && isDefined(item.title)) 
    : [];
    
  const hasValidItems = validItems.length > 0;
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {!hasValidItems ? (
          <div className="p-6 text-center text-muted-foreground">
            <p>Aucune activité récente</p>
          </div>
        ) : (
          <div className="space-y-1">
            {validItems.map((item, index) => {
              // Determine direction based on content
              const isRtlTitle = isRTL(item.title);
              const isRtlDesc = item.description ? isRTL(item.description) : false;
              
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex flex-col px-6 py-4 hover:bg-muted/50 transition-colors",
                    item.type === "success" && "border-l-4 border-green-500",
                    item.type === "warning" && "border-l-4 border-yellow-500",
                    item.type === "error" && "border-l-4 border-red-500"
                  )}
                >
                  <div className="flex items-center gap-4">
                    {item.icon && (
                      <div className={cn(
                        "rounded-full p-2 flex-shrink-0",
                        item.type === "success" && "bg-green-100 text-green-700",
                        item.type === "warning" && "bg-yellow-100 text-yellow-700",
                        item.type === "error" && "bg-red-100 text-red-700",
                        !item.type && "bg-blue-100 text-blue-700"
                      )}>
                        {item.icon}
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium" dir={dirFrom(isRtlTitle ? "rtl" : "ltr")}>
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1" dir={dirFrom(isRtlDesc ? "rtl" : "ltr")}>
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.time}
                    </div>
                  </div>
                  {index < validItems.length - 1 && <Separator className="mt-4" />}
                </div>
              );
            })}
          </div>
        )}
        {showViewAll && hasValidItems && (
          <div className="p-4 text-center border-t border-border">
            <Button variant="link" size="sm" className="text-snrt-red">
              Voir toutes les activités <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
