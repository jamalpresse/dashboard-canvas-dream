
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
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={yAxisFormatter} />
              <Tooltip
                formatter={(value: number, name: string) => {
                  const line = lines.find(line => line.dataKey === name);
                  return [yAxisFormatter(value), line?.name || name];
                }}
              />
              <Legend />
              {lines.map((line, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={line.dataKey}
                  stroke={line.stroke}
                  activeDot={{ r: 6 }}
                  name={line.name || line.dataKey}
                />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
