"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";

import type {
  DashboardStats,
  LatestAnalysis,
  ProfileData,
  Recommendation,
  RecentAnalysis,
} from "@/types/dashboard";

export const useDashboardData = () => {
  const queryClient = useQueryClient();

  // 1. Profile
  const profileQuery = useQuery({
    queryKey: ["dashboard", "profile"],

    queryFn: async ({ signal }) => {
      const response = await api.get<ProfileData>(
        "/auth/me",
        { signal }
      );

      return response.data;
    },

    staleTime: 60 * 1000,
  });

  // 2. Dashboard statistics
  const statsQuery = useQuery({
    queryKey: ["dashboard", "stats"],

    queryFn: async ({ signal }) => {
      const response = await api.get<{
        stats: DashboardStats;
      }>("/dashboard/stats", { signal });

      return response.data.stats;
    },

    staleTime: 60 * 1000,
  });

  // 3. Latest analysis
  const latestQuery = useQuery({
    queryKey: ["dashboard", "latest-analysis"],

    queryFn: async ({ signal }) => {
      const response = await api.get<{
        analysis: LatestAnalysis | null;
      }>("/dashboard/latest-analysis", { signal });

      return response.data.analysis ?? null;
    },

    staleTime: 60 * 1000,
  });

  // 4. Recent analyses
  const recentQuery = useQuery({
    queryKey: ["dashboard", "recent-analyses", 5],

    queryFn: async ({ signal }) => {
      const response = await api.get<{
        analyses: RecentAnalysis[];
      }>("/dashboard/recent-analyses", {
        params: { limit: 5 },
        signal,
      });

      return response.data.analyses ?? [];
    },

    staleTime: 60 * 1000,
  });

  // 5. Recommendations
  const recommendationQuery = useQuery({
    queryKey: ["dashboard", "recommendation"],

    queryFn: async ({ signal }) => {
      const response = await api.get<{
        recommendation: Recommendation;
      }>("/dashboard/recommendation", { signal });

      return response.data.recommendation;
    },

    staleTime: 5 * 60 * 1000,
  });

  const queries = [
    profileQuery,
    statsQuery,
    latestQuery,
    recentQuery,
    recommendationQuery,
  ];

  // Wait for all initial requests to settle.
  const loading = queries.some((query) => query.isPending);

  // One failed endpoint won't hide successful results.
  const error = queries.some((query) => query.isError)
    ? "Some dashboard data failed to load."
    : "";

  // Refresh all active dashboard queries when requested.
  const refreshDashboard = () =>
    queryClient.invalidateQueries({
      queryKey: ["dashboard"],
    });

  return {
    profile: profileQuery.data ?? null,
    stats: statsQuery.data ?? null,
    latest: latestQuery.data ?? null,
    recent: recentQuery.data ?? [],
    recommendation: recommendationQuery.data ?? null,

    loading,
    error,
    refreshDashboard,
  };
};
