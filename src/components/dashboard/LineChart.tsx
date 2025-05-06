
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
  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={yAxisFormatter} />
            <Tooltip formatter={(value) => [`${value}`, ""]} />
            <Legend />
            {lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.stroke}
                name={line.name || line.dataKey}
                activeDot={{ r: 8 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
