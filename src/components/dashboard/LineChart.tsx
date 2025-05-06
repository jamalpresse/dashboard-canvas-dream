import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
interface LineChartProps {
  data: any[];
  title?: string;
  className?: string;
  lines: {
    dataKey: string;
    stroke: string;
    name?: string;
  }[];
  yAxisFormatter?: (value: number) => string;
}
export function LineChart({
  data,
  title,
  className,
  lines,
  yAxisFormatter = value => `${value}`
}: LineChartProps) {
  return <Card className={className}>
      {title && <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>}
      
    </Card>;
}