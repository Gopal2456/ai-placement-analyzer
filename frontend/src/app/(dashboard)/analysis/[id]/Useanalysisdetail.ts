"use client";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import api from "@/api/axios";
import type { AnalysisDetail, AnalysisJobInfo } from "@/types/Analysis";

interface ApiErrorResponse {
  message?: string;
}

export const useAnalysisDetail = (id?: string) => {
  const [analysis, setAnalysis] = useState<AnalysisDetail | null>(null);
  const [job, setJob] = useState<AnalysisJobInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get<{ analysis: AnalysisDetail }>(
          `/analysis/${id}`,
        );

        if (cancelled) return;
        setAnalysis(res.data.analysis);

        // The analysis only stores jobId, so look up title/company separately.
        // Optional: if this fails, the page still renders without them.
        try {
          const jobRes = await api.get<{ job: AnalysisJobInfo }>(
            `/jobs/${res.data.analysis.jobId}`,
          );
          if (!cancelled) setJob(jobRes.data.job ?? null);
        } catch {
          /* ignore */
        }
      } catch (err: unknown) {
        console.error("Fetch analysis error:", err);
        if (cancelled) return;

        setError(
          isAxiosError<ApiErrorResponse>(err)
            ? err.response?.data?.message || "Failed to load analysis."
            : "Failed to load analysis.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { analysis, job, loading, error };
};