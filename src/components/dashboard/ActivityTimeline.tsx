
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
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {items.map((item, index) => (
            <div key={item.id}>
              <div className="p-4">
                <div className="flex items-start space-x-4">
                  {item.icon && (
                    <div className={cn(
                      "mt-0.5 rounded-full p-1.5 flex-shrink-0",
                      item.type === "success" ? "bg-green-100" :
                      item.type === "warning" ? "bg-yellow-100" :
                      item.type === "error" ? "bg-red-100" :
                      "bg-purple-100"
                    )}>
                      <div className={cn(
                        "h-4 w-4",
                        item.type === "success" ? "text-green-600" :
                        item.type === "warning" ? "text-yellow-600" :
                        item.type === "error" ? "text-red-600" :
                        "text-purple-600"
                      )}>
                        {item.icon}
                      </div>
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p 
                        className="text-sm font-medium" 
                        dir={dirFrom(item.title)}
                      >
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                    <div 
                      className="text-sm text-muted-foreground"
                      dir={dirFrom(item.description)}
                    >
                      {/* Safely render description or remove HTML tags */}
                      {item.description.replace(/<\/?[^>]+(>|$)/g, "")}
                    </div>
                  </div>
                </div>
              </div>
              {index < items.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
