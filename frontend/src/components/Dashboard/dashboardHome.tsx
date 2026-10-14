"use client";

import { useDashboardData } from "./Usedashboarddata";
import DashboardHeader from "./Dashboardheader";
import StatsGrid from "./Statsgrid";
import LatestAnalysisCard from "./Latestanalysiscard";
import AiRecommendationCard from "./Airecommendationcard";
import RecentAnalyses from "./Recentanalyses";
import QuickActions from "./Quickactions";

const DashboardHome = () => {
  const { profile, stats, latest, recent, recommendation, loading, error } =
    useDashboardData();

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-gray-900">
      <DashboardHeader name={profile?.user?.name} />

      <main className="px-6 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Intro */}
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
              Career overview
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-tight text-gray-800">
              Your placement readiness
            </h2>

            <p className="mt-1 max-w-xl text-sm text-gray-500">
              Track your job matches, skill gaps and interview preparation from
              one place.
            </p>
          </div>

          {error && (
            <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
              {error}
            </p>
          )}

          <StatsGrid stats={stats} loading={loading} />

          <div className="mt-5 grid gap-5 xl:grid-cols-5">
            <LatestAnalysisCard analysis={latest} loading={loading} />
            <AiRecommendationCard
              recommendation={recommendation}
              loading={loading}
            />
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <RecentAnalyses analyses={recent} loading={loading} />
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardHome;