
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
}

export function ActivityTimeline({
  items,
  className
}: TimelineProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Activités récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {items.map((item) => {
            const iconColorClass = 
              item.type === "success" ? "bg-green-500" :
              item.type === "warning" ? "bg-yellow-500" :
              item.type === "error" ? "bg-red-500" :
              "bg-blue-500";
            
            return (
              <div key={item.id} className="flex items-start space-x-4">
                <div className={cn(
                  "relative mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  iconColorClass
                )}>
                  {item.icon || (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
