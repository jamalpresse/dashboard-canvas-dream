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
      {title}
      <CardContent className="p-0">
        <ResponsiveContainer width="100%" height={350}>
          <RechartsLineChart data={data} margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20
        }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={yAxisFormatter} />
            <Tooltip />
            <Legend />
            {lines.map((line, index) => <Line key={index} type="monotone" dataKey={line.dataKey} stroke={line.stroke} name={line.name || line.dataKey} strokeWidth={2} dot={{
            r: 4
          }} activeDot={{
            r: 6
          }} />)}
          </RechartsLineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>;
}