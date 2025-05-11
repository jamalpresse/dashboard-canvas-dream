
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { isRTL, dirFrom } from "@/utils/textUtils";

type TimelineItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  icon?: React.ReactNode;
  type?: "default" | "success" | "warning" | "error";
};

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
  title?: string;
}

export function ActivityTimeline({
  items,
  className,
  title = "Activités récentes"
}: TimelineProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => {
            const isItemRTL = isRTL(item.title) || isRTL(item.description);
            const itemDir = dirFrom(isItemRTL ? "rtl" : "ltr");
            
            return (
              <div key={item.id} className="relative">
                {index !== 0 && <Separator className="my-4" />}
                <div dir={itemDir} className="flex gap-4 items-start">
                  {item.icon && (
                    <div 
                      className={cn(
                        "mt-1 p-2 rounded-full flex-shrink-0",
                        item.type === "success" && "bg-green-100",
                        item.type === "warning" && "bg-yellow-100",
                        item.type === "error" && "bg-red-100",
                        (item.type === "default" || !item.type) && "bg-blue-100"
                      )}
                    >
                      {item.icon}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className={isItemRTL ? "text-right" : "text-left"}>
                      <p className="font-medium text-base">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <time className="text-xs text-muted-foreground mt-1 block">
                      {item.time}
                    </time>
                  </div>
                </div>
              </div>
            );
          })}
          
          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucune activité récente
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
