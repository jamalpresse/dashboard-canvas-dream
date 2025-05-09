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
  return <Card className={cn("", className)}>
      
      <CardContent className="p-0">
        <div className="space-y-0">
          {items.map((item, index) => <div key={item.id}>
              
              {index < items.length - 1 && <Separator />}
            </div>)}
        </div>
      </CardContent>
    </Card>;
}