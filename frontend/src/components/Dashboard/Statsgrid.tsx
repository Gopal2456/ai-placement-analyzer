import { Briefcase, Percent, TrendingUp } from "lucide-react";
import type { DashboardStats } from "@/types/dashboard";

interface StatsGridProps {
  stats: DashboardStats | null;
  loading: boolean;
}

const StatsGrid = ({ stats, loading }: StatsGridProps) => {
  const items = [
    {
      label: "Avg. match score",
      value: stats ? `${stats.averageMatchScore}%` : "—",
      change: "Across all analyses",
      icon: Percent ,
    },
    {
      label: "Jobs analyzed",
      value: stats ? String(stats.jobsAnalyzed) : "—",
      change: stats ? `${stats.jobsAnalyzedThisMonth} this month` : "",
      icon: Briefcase,
    },
    {
      label: "Skill gaps",
      value: stats ? String(stats.skillGaps) : "—",
      change: "To improve",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p
                  className={`text-3xl font-semibold tracking-[-0.04em] ${
                    loading ? "animate-pulse text-gray-200" : "text-gray-800"
                  }`}
                >
                  {loading ? "00" : stat.value}
                </p>

                <p className="mt-1 text-xs font-medium text-gray-400">
                  {stat.label}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <p className="mt-5 min-h-3 text-[10px] font-semibold text-violet-600">
              {loading ? "" : stat.change}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;