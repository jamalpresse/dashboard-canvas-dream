
import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";

interface StatItem {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: { value: number; positive: boolean };
  variant?: "default" | "primary" | "success" | "warning" | "danger";
}

interface StatsSectionProps {
  sectionTitle: string;
  stats: StatItem[];
}

export function StatsSection({ sectionTitle, stats }: StatsSectionProps) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{sectionTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            variant={stat.variant}
            className="transform transition-transform hover:scale-105 duration-300"
          />
        ))}
      </div>
    </div>
  );
}
