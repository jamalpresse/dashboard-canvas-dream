
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { cva, type VariantProps } from "class-variance-authority";

const statCardVariants = cva(
  "flex h-full w-full flex-col justify-between",
  {
    variants: {
      variant: {
        default: "",
        primary: "bg-primary text-primary-foreground",
        success: "bg-green-500 text-white",
        warning: "bg-amber-500 text-white",
        danger: "bg-red-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

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
  className,
}: StatCardProps) {
  return (
    <Card className={cn("h-full overflow-hidden", className)}>
      <CardContent className={cn(statCardVariants({ variant }), "p-6")}>
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{title}</h3>
          <div className="rounded-full bg-white bg-opacity-20 p-2">{icon}</div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-bold">{value}</div>
          {trend && (
            <div className="mt-2 flex items-center text-xs">
              <span
                className={cn(
                  "mr-1 rounded-sm px-1",
                  trend.positive ? "bg-green-500 bg-opacity-20" : "bg-red-500 bg-opacity-20"
                )}
              >
                {trend.positive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className="text-gray-400">vs last period</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
