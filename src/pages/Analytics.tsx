
import { LineChart } from "@/components/dashboard/LineChart";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
} from "recharts";

const salesData = [
  { name: "Jan", total: 4500 },
  { name: "Feb", total: 5200 },
  { name: "Mar", total: 3800 },
  { name: "Apr", total: 6000 },
  { name: "May", total: 5100 },
  { name: "Jun", total: 7000 },
  { name: "Jul", total: 6300 },
  { name: "Aug", total: 5700 },
  { name: "Sep", total: 7500 },
  { name: "Oct", total: 8200 },
  { name: "Nov", total: 7800 },
  { name: "Dec", total: 9000 },
];

const trafficData = [
  { name: "Jan", organic: 4000, direct: 2400, referral: 1800 },
  { name: "Feb", organic: 3000, direct: 1398, referral: 2100 },
  { name: "Mar", organic: 2000, direct: 9800, referral: 2290 },
  { name: "Apr", organic: 2780, direct: 3908, referral: 2000 },
  { name: "May", organic: 1890, direct: 4800, referral: 2181 },
  { name: "Jun", organic: 2390, direct: 3800, referral: 2500 },
  { name: "Jul", organic: 3490, direct: 4300, referral: 2100 },
];

const deviceData = [
  { name: "Desktop", value: 58 },
  { name: "Mobile", value: 32 },
  { name: "Tablet", value: 10 },
];

const DEVICE_COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

const countryData = [
  { name: "United States", value: 42 },
  { name: "United Kingdom", value: 18 },
  { name: "Germany", value: 12 },
  { name: "France", value: 10 },
  { name: "Japan", value: 8 },
  { name: "Other", value: 10 },
];

const COUNTRY_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#A855F7", "#6B7280"];

function CustomPieChart({ data, colors }: { data: any[]; colors: string[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Legend />
        <RechartsTooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Detailed insights and performance metrics</p>
        </div>

        <Select defaultValue="30days">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4 w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Revenue</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$45,231</div>
                <p className="text-xs text-muted-foreground">+12.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Conversion Rate</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3.2%</div>
                <p className="text-xs text-muted-foreground">+0.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Average Order Value</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$89.42</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <LineChart
              data={trafficData}
              title="Traffic Sources"
              lines={[
                { dataKey: "organic", stroke: "#3B82F6", name: "Organic" },
                { dataKey: "direct", stroke: "#10B981", name: "Direct" },
                { dataKey: "referral", stroke: "#F59E0B", name: "Referral" },
              ]}
            />
            <OverviewChart data={salesData} title="Sales Overview" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Traffic by Device</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomPieChart data={deviceData} colors={DEVICE_COLORS} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Traffic by Country</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomPieChart data={countryData} colors={COUNTRY_COLORS} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <OverviewChart data={salesData} title="Monthly Sales" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="flex flex-col justify-between">
                <CardHeader className="pb-2">
                  <CardTitle>Product {i}</CardTitle>
                  <CardDescription>Category {Math.ceil(i / 2)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${(i * 123).toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    {i % 2 === 0 ? "+" : "-"}
                    {Math.floor(Math.random() * 10) + 1}% from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          <LineChart
            data={trafficData}
            title="Traffic Sources Over Time"
            lines={[
              { dataKey: "organic", stroke: "#3B82F6", name: "Organic" },
              { dataKey: "direct", stroke: "#10B981", name: "Direct" },
              { dataKey: "referral", stroke: "#F59E0B", name: "Referral" },
            ]}
          />
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomPieChart data={deviceData} colors={DEVICE_COLORS} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomPieChart data={countryData} colors={COUNTRY_COLORS} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Overview</CardTitle>
              <CardDescription>
                Key metrics related to user engagement over the past 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Avg. Session Duration
                  </div>
                  <div className="text-2xl font-bold">3m 42s</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Pages per Session</div>
                  <div className="text-2xl font-bold">2.3</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Bounce Rate</div>
                  <div className="text-2xl font-bold">42.8%</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">New vs Returning</div>
                  <div className="text-2xl font-bold">67% / 33%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <LineChart
              data={[
                { name: "Jan", sessions: 5000, bounceRate: 45 },
                { name: "Feb", sessions: 4800, bounceRate: 47 },
                { name: "Mar", sessions: 6200, bounceRate: 42 },
                { name: "Apr", sessions: 5700, bounceRate: 44 },
                { name: "May", sessions: 6800, bounceRate: 40 },
                { name: "Jun", sessions: 7200, bounceRate: 38 },
              ]}
              title="Sessions & Bounce Rate"
              lines={[
                { dataKey: "sessions", stroke: "#3B82F6", name: "Sessions" },
                { dataKey: "bounceRate", stroke: "#F59E0B", name: "Bounce Rate %" },
              ]}
            />
            <LineChart
              data={[
                { name: "Jan", pageviews: 12000, avgDuration: 210 },
                { name: "Feb", pageviews: 11500, avgDuration: 205 },
                { name: "Mar", pageviews: 14800, avgDuration: 220 },
                { name: "Apr", pageviews: 13600, avgDuration: 215 },
                { name: "May", pageviews: 16200, avgDuration: 225 },
                { name: "Jun", pageviews: 17000, avgDuration: 230 },
              ]}
              title="Pageviews & Avg. Duration"
              lines={[
                { dataKey: "pageviews", stroke: "#3B82F6", name: "Pageviews" },
                { dataKey: "avgDuration", stroke: "#10B981", name: "Avg. Duration (s)" },
              ]}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
