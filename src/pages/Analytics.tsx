
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

// Device data for the pie charts
const deviceData = [
  { name: "Desktop", value: 58 },
  { name: "Mobile", value: 32 },
  { name: "Tablet", value: 10 },
];

const DEVICE_COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

const countryData = [
  { name: "Maroc", value: 72 },
  { name: "Algérie", value: 8 },
  { name: "France", value: 6 },
  { name: "Tunisie", value: 5 },
  { name: "Sénégal", value: 4 },
  { name: "Autre", value: 5 },
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
  const [period, setPeriod] = useState("30days");
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('analytics')
          .select('*')
          .order('date', { ascending: true });
          
        if (error) throw error;
        setAnalyticsData(data || []);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        toast.error('Erreur lors du chargement des données analytiques');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);
  
  // Format analytics data for charts
  const formattedData = analyticsData.map(item => ({
    name: new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
    total: item.page_view_count
  }));
  
  // Format traffic data
  const trafficData = analyticsData.map(item => ({
    name: new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
    organic: Math.round(item.page_view_count * 0.65), // 65% organic
    direct: Math.round(item.page_view_count * 0.25), // 25% direct
    referral: Math.round(item.page_view_count * 0.10), // 10% referral
  }));
  
  // Calculate totals for overview
  const latestData = analyticsData.length > 0 ? analyticsData[analyticsData.length - 1] : null;
  const previousData = analyticsData.length > 1 ? analyticsData[analyticsData.length - 2] : null;
  
  const calculatePercentChange = (current: number, previous: number) => {
    if (!previous) return '+0.0%';
    const change = ((current - previous) / previous) * 100;
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };
  
  // Data for engagement tab
  const engagementData = [
    { name: analyticsData[0]?.date ? new Date(analyticsData[0].date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'Jan', sessions: 5000, bounceRate: 45 },
    { name: analyticsData[1]?.date ? new Date(analyticsData[1].date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'Feb', sessions: 4800, bounceRate: 47 },
    { name: analyticsData[2]?.date ? new Date(analyticsData[2].date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'Mar', sessions: 6200, bounceRate: 42 },
    { name: analyticsData[3]?.date ? new Date(analyticsData[3].date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'Apr', sessions: 5700, bounceRate: 44 },
    { name: analyticsData[4]?.date ? new Date(analyticsData[4].date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'May', sessions: 6800, bounceRate: 40 },
    { name: analyticsData[5]?.date ? new Date(analyticsData[5].date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'Jun', sessions: 7200, bounceRate: 38 },
  ];
  
  const pageviewData = [
    { name: analyticsData[0]?.date ? new Date(analyticsData[0].date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'Jan', pageviews: 12000, avgDuration: 210 },
    { name: analyticsData[1]?.date ? new Date(analyticsData[1].date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'Feb', pageviews: 11500, avgDuration: 205 },
    { name: analyticsData[2]?.date ? new Date(analyticsData[2].date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'Mar', pageviews: 14800, avgDuration: 220 },
    { name: analyticsData[3]?.date ? new Date(analyticsData[3].date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'Apr', pageviews: 13600, avgDuration: 215 },
    { name: analyticsData[4]?.date ? new Date(analyticsData[4].date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'May', pageviews: 16200, avgDuration: 225 },
    { name: analyticsData[5]?.date ? new Date(analyticsData[5].date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'Jun', pageviews: 17000, avgDuration: 230 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Detailed insights and performance metrics</p>
        </div>

        <Select defaultValue={period} onValueChange={setPeriod}>
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
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Visites Totales</CardTitle>
                <CardDescription>30 derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {latestData ? latestData.page_view_count.toLocaleString() : '...'} 
                </div>
                <p className="text-xs text-muted-foreground">
                  {previousData ? calculatePercentChange(latestData?.page_view_count || 0, previousData?.page_view_count || 0) : '...'} depuis le mois dernier
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Articles Consultés</CardTitle>
                <CardDescription>30 derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {latestData ? latestData.article_view_count.toLocaleString() : '...'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {previousData ? calculatePercentChange(latestData?.article_view_count || 0, previousData?.article_view_count || 0) : '...'} depuis le mois dernier
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Traductions</CardTitle>
                <CardDescription>30 derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {latestData ? latestData.translation_count.toLocaleString() : '...'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {previousData ? calculatePercentChange(latestData?.translation_count || 0, previousData?.translation_count || 0) : '...'} depuis le mois dernier
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <LineChart
              data={trafficData}
              title="Sources de trafic"
              lines={[
                { dataKey: "organic", stroke: "#3B82F6", name: "Organique" },
                { dataKey: "direct", stroke: "#10B981", name: "Direct" },
                { dataKey: "referral", stroke: "#F59E0B", name: "Référents" },
              ]}
            />
            <OverviewChart data={formattedData} title="Aperçu des visites" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Trafic par Appareil</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomPieChart data={deviceData} colors={DEVICE_COLORS} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Trafic par Pays</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomPieChart data={countryData} colors={COUNTRY_COLORS} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          <LineChart
            data={trafficData}
            title="Sources de trafic dans le temps"
            lines={[
              { dataKey: "organic", stroke: "#3B82F6", name: "Organique" },
              { dataKey: "direct", stroke: "#10B981", name: "Direct" },
              { dataKey: "referral", stroke: "#F59E0B", name: "Référents" },
            ]}
          />
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribution des appareils</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomPieChart data={deviceData} colors={DEVICE_COLORS} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Distribution géographique</CardTitle>
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
              <CardTitle>Vue d'ensemble de l'engagement</CardTitle>
              <CardDescription>
                Métriques clés liées à l'engagement utilisateur au cours des 30 derniers jours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Durée moyenne de session
                  </div>
                  <div className="text-2xl font-bold">3m 42s</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Pages par session</div>
                  <div className="text-2xl font-bold">2.3</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Taux de rebond</div>
                  <div className="text-2xl font-bold">42.8%</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Nouveaux vs Récurrents</div>
                  <div className="text-2xl font-bold">67% / 33%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <LineChart
              data={engagementData}
              title="Sessions & Taux de rebond"
              lines={[
                { dataKey: "sessions", stroke: "#3B82F6", name: "Sessions" },
                { dataKey: "bounceRate", stroke: "#F59E0B", name: "Taux de rebond %" },
              ]}
            />
            <LineChart
              data={pageviewData}
              title="Pages vues & Durée moyenne"
              lines={[
                { dataKey: "pageviews", stroke: "#3B82F6", name: "Pages vues" },
                { dataKey: "avgDuration", stroke: "#10B981", name: "Durée moyenne (s)" },
              ]}
            />
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance du contenu</CardTitle>
              <CardDescription>
                Analyse des types de contenu et leur performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Articles en français
                  </div>
                  <div className="text-2xl font-bold">78%</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Articles en arabe</div>
                  <div className="text-2xl font-bold">22%</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Temps de lecture moyen</div>
                  <div className="text-2xl font-bold">2m 12s</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Taux d'achèvement</div>
                  <div className="text-2xl font-bold">58%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <LineChart
              data={[
                { name: "Politique", views: 3200, shares: 280 },
                { name: "Sport", views: 4800, shares: 420 },
                { name: "Culture", views: 2100, shares: 190 },
                { name: "Économie", views: 2800, shares: 210 },
                { name: "Société", views: 3500, shares: 310 },
                { name: "Tech", views: 1800, shares: 150 },
              ]}
              title="Performance par catégorie"
              lines={[
                { dataKey: "views", stroke: "#3B82F6", name: "Vues" },
                { dataKey: "shares", stroke: "#10B981", name: "Partages" },
              ]}
            />
            <OverviewChart 
              data={[
                { name: "Texte", total: 4500 },
                { name: "Photo", total: 6700 },
                { name: "Vidéo", total: 5200 },
                { name: "Audio", total: 2100 },
                { name: "Infog.", total: 3200 },
              ]} 
              title="Performance par format" 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
