
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { cva, type VariantProps } from "class-variance-authority";

const statCardVariants = cva(
  "flex h-full w-full flex-col justify-between rounded-xl overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-br from-purple-600 to-purple-500 text-white",
        primary: "bg-gradient-to-br from-pink-500 to-purple-600 text-white",
        success: "bg-gradient-to-br from-green-500 to-teal-500 text-white",
        warning: "bg-gradient-to-br from-amber-500 to-orange-500 text-white",
        danger: "bg-gradient-to-br from-red-500 to-pink-500 text-white",
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
    <Card className={cn("border-none shadow-lg", className)}>
      <CardContent className={cn(statCardVariants({ variant }), "p-6")}>
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm opacity-90">{title}</h3>
          <div className="rounded-full bg-white/20 p-2.5 backdrop-blur-sm">{icon}</div>
        </div>
        <div className="mt-6">
          <div className="text-3xl font-bold">{value}</div>
          {trend && (
            <div className="mt-2 flex items-center text-xs">
              <span
                className={cn(
                  "mr-1.5 rounded-full px-2 py-0.5",
                  trend.positive ? "bg-white/20 text-white" : "bg-white/20 text-white"
                )}
              >
                {trend.positive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className="opacity-70">vs dernière période</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
