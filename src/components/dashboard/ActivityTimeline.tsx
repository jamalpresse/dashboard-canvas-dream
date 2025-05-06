
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
}

export function ActivityTimeline({
  items,
  className
}: TimelineProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Activités récentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {items.map((item, index) => (
          <div key={item.id} className="relative">
            <div className="flex gap-3">
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center",
                item.type === "success" ? "bg-green-100 text-green-600" : 
                item.type === "warning" ? "bg-amber-100 text-amber-600" : 
                item.type === "error" ? "bg-red-100 text-red-600" : 
                "bg-purple-100 text-purple-600"
              )}>
                {item.icon}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-base font-medium">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.description}</p>
                <p className="text-xs text-gray-400">{item.time}</p>
              </div>
            </div>
            {index < items.length - 1 && (
              <Separator className="my-4" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
