
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

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
      <CardContent>
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative flex-shrink-0 mt-0.5">
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  {
                    "bg-blue-100 text-blue-600": item.type === "default" || !item.type,
                    "bg-green-100 text-green-600": item.type === "success",
                    "bg-yellow-100 text-yellow-600": item.type === "warning",
                    "bg-red-100 text-red-600": item.type === "error",
                  }
                )}>
                  {item.icon}
                </div>
                <div className="absolute bottom-0 left-1/2 top-8 w-px -translate-x-1/2 bg-border" />
              </div>
              <div className="pb-6 w-full">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium">{item.title}</div>
                  <time className="text-sm text-muted-foreground">{item.time}</time>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
                <Separator className="mt-6" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
