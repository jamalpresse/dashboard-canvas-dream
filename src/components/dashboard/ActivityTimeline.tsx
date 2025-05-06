
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
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Activités récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                {
                  "bg-purple-100 text-purple-600": !item.type || item.type === "default",
                  "bg-green-100 text-green-600": item.type === "success",
                  "bg-yellow-100 text-yellow-600": item.type === "warning",
                  "bg-red-100 text-red-600": item.type === "error",
                }
              )}>
                {item.icon}
              </div>
              <div className="space-y-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
