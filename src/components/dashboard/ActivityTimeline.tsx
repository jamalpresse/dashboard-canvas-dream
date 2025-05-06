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
  return;
}