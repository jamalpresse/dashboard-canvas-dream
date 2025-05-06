
import React from "react";
import { LineChart } from "@/components/dashboard/LineChart";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";

interface ChartDataPoint {
  name: string;
  visits: number;
  articles: number;
}

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
}

interface ChartsSectionProps {
  chartData: ChartDataPoint[];
  activities: ActivityItem[];
  chartTitle: string;
  visitLabel: string;
  articlesLabel: string;
}

export function ChartsSection({ 
  chartData, 
  activities, 
  chartTitle, 
  visitLabel, 
  articlesLabel 
}: ChartsSectionProps) {
  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <LineChart
        className="col-span-1 lg:col-span-2 shadow-md hover:shadow-lg transition-shadow duration-300"
        data={chartData}
        title={chartTitle}
        lines={[
          { dataKey: "visits", stroke: "#9b87f5", name: visitLabel },
          { dataKey: "articles", stroke: "#D946EF", name: articlesLabel }
        ]}
      />
      
      <ActivityTimeline 
        items={activities} 
        className="col-span-1 shadow-md hover:shadow-lg transition-shadow duration-300"
      />
    </div>
  );
}
