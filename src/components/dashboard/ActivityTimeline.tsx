
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg">Activités récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className={cn(
                  "mt-0.5 rounded-full p-1.5 bg-purple-100",
                  item.type === "success" && "bg-green-100",
                  item.type === "warning" && "bg-amber-100",
                  item.type === "error" && "bg-red-100"
                )}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-muted-foreground">{item.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
