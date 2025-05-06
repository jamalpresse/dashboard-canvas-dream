
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { LineChart } from "@/components/dashboard/LineChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  DollarSign, 
  ShoppingCart, 
  ArrowUpRight,
  MessageSquare,
  FileText,
  Clock,
  Settings
} from "lucide-react";

const revenueData = [
  { name: "Jan", total: 18000 },
  { name: "Feb", total: 22000 },
  { name: "Mar", total: 32000 },
  { name: "Apr", total: 28000 },
  { name: "May", total: 42000 },
  { name: "Jun", total: 38000 },
];

const growthData = [
  { name: "Jan", users: 400, revenue: 2400, orders: 240 },
  { name: "Feb", users: 600, revenue: 1398, orders: 310 },
  { name: "Mar", users: 800, revenue: 9800, orders: 290 },
  { name: "Apr", users: 1000, revenue: 3908, orders: 350 },
  { name: "May", users: 1300, revenue: 4800, orders: 480 },
  { name: "Jun", users: 1600, revenue: 3800, orders: 600 },
];

const activityItems = [
  {
    id: "1",
    title: "New user registered",
    description: "Sophie Moore has registered with email sophie.moore@example.com",
    time: "2 hours ago",
    icon: <Users className="h-4 w-4" />,
    type: "success",
  },
  {
    id: "2",
    title: "New order placed",
    description: "Order #4912 was placed for $320",
    time: "4 hours ago",
    icon: <ShoppingCart className="h-4 w-4" />,
  },
  {
    id: "3",
    title: "Payment received",
    description: "Payment of $1,200 received from customer #40498",
    time: "Yesterday",
    icon: <DollarSign className="h-4 w-4" />,
    type: "success",
  },
  {
    id: "4",
    title: "System update scheduled",
    description: "The system will be updated at 2:00 AM tomorrow",
    time: "2 days ago",
    icon: <Settings className="h-4 w-4" />,
    type: "warning",
  },
  {
    id: "5",
    title: "Report generated",
    description: "Monthly report has been generated and is ready for review",
    time: "3 days ago",
    icon: <FileText className="h-4 w-4" />,
  },
];

const Index = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your business analytics and performance
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$45,231.89"
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 12, positive: true }}
          variant="primary"
        />
        <StatCard
          title="New Customers"
          value="2,350"
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 5.2, positive: true }}
        />
        <StatCard
          title="Orders"
          value="1,245"
          icon={<ShoppingCart className="h-5 w-5" />}
          trend={{ value: 2.3, positive: false }}
          variant="warning"
        />
        <StatCard
          title="Conversion Rate"
          value="3.2%"
          icon={<ArrowUpRight className="h-5 w-5" />}
          trend={{ value: 4.1, positive: true }}
          variant="success"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <OverviewChart data={revenueData} title="Revenue Overview" className="lg:col-span-4" />
        <ActivityTimeline items={activityItems} className="lg:col-span-3" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <LineChart
          data={growthData}
          title="Growth Metrics"
          className="lg:col-span-4"
          lines={[
            { dataKey: "users", stroke: "#3B82F6", name: "Users" },
            { dataKey: "revenue", stroke: "#10B981", name: "Revenue" },
            { dataKey: "orders", stroke: "#F59E0B", name: "Orders" },
          ]}
        />
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>{`U${i}`}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">User {i}</p>
                    <p className="text-sm text-muted-foreground">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae...
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <MessageSquare className="h-3 w-3" />
                      <span>3 replies</span>
                      <Clock className="ml-2 h-3 w-3" />
                      <span>{i} hour{i !== 1 ? "s" : ""} ago</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
