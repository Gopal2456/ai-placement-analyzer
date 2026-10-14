"use client";

import { useEffect, useState } from "react";
import api from "@/api/axios";
import type {
  DashboardStats,
  LatestAnalysis,
  ProfileData,
  Recommendation,
  RecentAnalysis,
} from "@/types/dashboard";

export const useDashboardData = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [latest, setLatest] = useState<LatestAnalysis | null>(null);
  const [recent, setRecent] = useState<RecentAnalysis[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");

      // allSettled: one failing endpoint shouldn't blank the whole dashboard
      const [profileRes, statsRes, latestRes, recentRes, recommendationRes] =
        await Promise.allSettled([
          api.get<ProfileData>("/auth/me"),
          api.get<{ stats: DashboardStats }>("/dashboard/stats"),
          api.get<{ analysis: LatestAnalysis | null }>(
            "/dashboard/latest-analysis",
          ),
          api.get<{ analyses: RecentAnalysis[] }>(
            "/dashboard/recent-analyses?limit=5",
          ),
          api.get<{ recommendation: Recommendation }>(
            "/dashboard/recommendation",
          ),
        ]);

      if (cancelled) return;

      if (profileRes.status === "fulfilled") setProfile(profileRes.value.data);
      if (statsRes.status === "fulfilled") setStats(statsRes.value.data.stats);
      if (latestRes.status === "fulfilled") {
        setLatest(latestRes.value.data.analysis ?? null);
      }
      if (recentRes.status === "fulfilled") {
        setRecent(recentRes.value.data.analyses ?? []);
      }
      if (recommendationRes.status === "fulfilled") {
        setRecommendation(recommendationRes.value.data.recommendation);
      }

      const results = [
        profileRes,
        statsRes,
        latestRes,
        recentRes,
        recommendationRes,
      ];

      const failed = results.filter(
        (r): r is PromiseRejectedResult => r.status === "rejected",
      );

      if (failed.length > 0) {
        failed.forEach((r) => console.error("Dashboard error:", r.reason));
        setError("Some dashboard data failed to load.");
      }

      setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { profile, stats, latest, recent, recommendation, loading, error };
};