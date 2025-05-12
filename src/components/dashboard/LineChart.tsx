
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
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={yAxisFormatter}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "6px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  border: "1px solid rgba(209, 213, 219, 1)",
                }}
                formatter={(value) => [`${value}`, ""]}
              />
              <Legend />
              {lines.map((line, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={line.dataKey}
                  stroke={line.stroke}
                  name={line.name || line.dataKey}
                  strokeWidth={2}
                  dot={{
                    r: 4,
                    strokeWidth: 1,
                    fill: "white",
                  }}
                  activeDot={{
                    r: 6,
                    stroke: line.stroke,
                    strokeWidth: 2,
                  }}
                />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
