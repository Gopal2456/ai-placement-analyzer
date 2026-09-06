"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/api/axios";

const AnalysisPage = () => {
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("resumeId");

  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!resumeId) {
      setError("No resume selected.");
      setLoading(false);
      return;
    }

    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/analysis/${resumeId}`);

        setAnalysis(response.data.analysis);
      } catch (error: any) {
        console.error("Fetch analysis error:", error);

        // If analysis doesn't exist yet, create it
        if (error?.response?.status === 404) {
          try {
            const response = await api.post("/analysis", {
              resumeId,
            });

            setAnalysis(response.data.analysis);
          } catch (analysisError: any) {
            console.error("Create analysis error:", analysisError);

            setError(
              analysisError?.response?.data?.message ||
                "Failed to analyze resume.",
            );
          }
        } else {
          setError(
            error?.response?.data?.message ||
              "Failed to fetch resume analysis.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [resumeId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="flex w-full max-w-md flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          {/* Loader */}
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-gray-100 border-t-violet-600" />

            <div className="h-8 w-8 animate-pulse rounded-full bg-violet-100" />
          </div>

          {/* Text */}
          <p className="mt-6 text-sm font-semibold text-gray-800">
            Analyzing your resume
            <span className="inline-flex w-6 text-left">
              <span className="animate-pulse">...</span>
            </span>
          </p>

          <p className="mt-2 max-w-sm text-xs leading-5 text-gray-400">
            Our AI is reviewing your skills, experience, projects and education.
          </p>

          {/* Progress dots */}
          <div className="mt-5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-500" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-500 [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-500 [animation-delay:300ms]" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          {/* Error Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-lg font-semibold text-red-600">
              !
            </div>
          </div>

          {/* Error Message */}
          <h2 className="mt-5 text-base font-semibold text-gray-800">
            Analysis failed
          </h2>

          <p className="mt-2 text-xs leading-5 text-gray-400">{error}</p>

          <p className="mt-1 text-xs text-gray-400">
            Please try again or select another resume.
          </p>

          {/* Retry Button */}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-gray-950 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-black"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-600">
            AI Resume Analysis
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-800">
            Resume Analysis
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Here is your AI-powered resume evaluation.
          </p>
        </div>

        {/* Overall Score */}
        <div className="mt-6 rounded-2xl bg-gray-950 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400">
                Overall Resume Score
              </p>

              <p className="mt-2 text-4xl font-semibold">
                {analysis.overallScore}%
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Based on skills, experience, projects and education.
              </p>
            </div>

            <div className="flex h-20 w-20 items-center justify-center rounded-full border-8 border-violet-500/20 border-t-violet-500 text-xl font-semibold">
              {analysis.overallScore}
            </div>
          </div>
        </div>

        {/* Score Cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ScoreCard title="Skills" score={analysis.skillsScore} />

          <ScoreCard title="Experience" score={analysis.experienceScore} />

          <ScoreCard title="Projects" score={analysis.projectsScore} />

          <ScoreCard title="Education" score={analysis.educationScore} />
        </div>

        {/* Strengths / Weaknesses */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Strengths */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-gray-900">Strengths</h2>

            <div className="mt-4 space-y-3">
              {analysis.strengths?.map((strength: string, index: number) => (
                <div key={index} className="rounded-xl bg-green-50 p-4">
                  <p className="text-xs leading-5 text-gray-700">{strength}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-gray-900">Weaknesses</h2>

            <div className="mt-4 space-y-3">
              {analysis.weaknesses?.map((weakness: string, index: number) => (
                <div key={index} className="rounded-xl bg-red-50 p-4">
                  <p className="text-xs leading-5 text-gray-700">{weakness}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Missing Skills */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Missing Skills
            </h2>

            <span className="rounded-full bg-violet-50 px-3 py-1 text-[10px] font-semibold text-violet-600">
              {analysis.missingSkills?.length || 0} skills
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {analysis.missingSkills?.map((skill: string) => (
              <span
                key={skill}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900">Suggestions</h2>

          <div className="mt-4 space-y-3">
            {analysis.suggestions?.map((suggestion: string, index: number) => (
              <div key={index} className="flex gap-3 rounded-xl bg-gray-50 p-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-600">
                  {index + 1}
                </span>

                <p className="text-xs leading-5 text-gray-700">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900">AI Summary</h2>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            {analysis.summary}
          </p>
        </div>
      </div>
    </main>
  );
};

const ScoreCard = ({ title, score }: { title: string; score: number }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-xs text-gray-400">{title}</p>

      <p className="mt-2 text-2xl font-semibold text-gray-800">{score}%</p>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-violet-500"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

export default AnalysisPage;
