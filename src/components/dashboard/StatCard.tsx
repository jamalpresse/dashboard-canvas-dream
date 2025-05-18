
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { cva, type VariantProps } from "class-variance-authority";

const statCardVariants = cva("flex h-full w-full flex-col justify-between rounded-xl overflow-hidden", {
  variants: {
    variant: {
      default: "bg-gradient-to-br from-purple-600 to-purple-500 text-white",
      primary: "bg-gradient-to-br from-pink-500 to-purple-600 text-white",
      success: "bg-gradient-to-br from-green-500 to-teal-500 text-white",
      warning: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
      danger: "bg-gradient-to-br from-red-500 to-pink-500 text-white"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export interface StatCardProps extends VariantProps<typeof statCardVariants> {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  variant,
  className
}: StatCardProps) {
  return (
    <Card className={cn("border-none shadow-lg h-full", className)}>
      <CardContent className={cn(statCardVariants({ variant }), "p-0")}>
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div className="text-sm font-medium opacity-85">{title}</div>
            <div className="p-2 rounded-full bg-white/10">{icon}</div>
          </div>
          <div className="flex-1 flex flex-col justify-end">
            <div className="text-3xl font-bold">{value}</div>
            {trend && (
              <div className="flex items-center text-xs mt-1">
                <span className={trend.positive ? "text-green-300" : "text-red-300"}>
                  {trend.positive ? "+" : "-"}{trend.value}%
                </span>
                <span className="ml-1 opacity-75">depuis 30j</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
