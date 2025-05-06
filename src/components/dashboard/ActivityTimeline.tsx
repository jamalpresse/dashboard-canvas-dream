
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

export function ActivityTimeline({ items, className }: TimelineProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {items.map((item, index) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative flex items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    {
                      "bg-blue-100 text-blue-600": !item.type || item.type === "default",
                      "bg-green-100 text-green-600": item.type === "success",
                      "bg-yellow-100 text-yellow-600": item.type === "warning",
                      "bg-red-100 text-red-600": item.type === "error",
                    }
                  )}
                >
                  {item.icon}
                </div>
                {index < items.length - 1 && (
                  <div className="absolute bottom-0 left-1/2 top-10 -ml-px w-[1px] bg-border" />
                )}
              </div>
              <div className="flex-1 pb-8">
                <div className="mb-1 text-sm font-medium">{item.title}</div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <div className="mt-2 text-xs text-muted-foreground">{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
