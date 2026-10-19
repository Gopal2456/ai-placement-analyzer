"use client";

import { FormEvent, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { isAxiosError } from "axios";
import api from "@/api/axios";
import useInterviewStore from "@/store/useInterviewStore";
import { useSelectedResume } from "@/hooks/useSelectedResume";

interface Job {
  _id: string;
  company: string;
  title: string;
  description: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  skills: string[];
  source: string;
  url: string;
  createdAt?: string;
}

interface JobsResponse {
  success: boolean;
  message: string;
  search: {
    query: string;
    location: string;
    page: number;
  };
  count: number;
  jobs: Job[];
}

interface ApiErrorResponse {
  message?: string;
}

const INDIAN_CITIES = [
  "Pune",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Delhi",
  "Noida",
  "Gurugram",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Chandigarh",
  "Indore",
  "Nagpur",
  "Nashik",
  "Kochi",
  "Coimbatore",
  "Thiruvananthapuram",
  "Lucknow",
  "Bhubaneswar",
  "Vadodara",
  "Surat",
];

const SKILL_KEYWORDS: Record<string, string[]> = {
  React: ["react", "react.js", "reactjs"],
  "Next.js": ["next.js", "nextjs"],
  TypeScript: ["typescript"],
  JavaScript: ["javascript"],
  "Node.js": ["node.js", "nodejs", "node js"],
  MongoDB: ["mongodb"],
  "Tailwind CSS": ["tailwind"],
  "REST API": ["rest api", "restful", "rest apis"],
  GraphQL: ["graphql"],
  AWS: ["aws"],
  Docker: ["docker"],
  Git: ["git"],
  SQL: ["sql"],
  Python: ["python"],
  Java: ["java"],
  Django: ["django"],
  Flask: ["flask"],
  Angular: ["angular"],
  "Vue.js": ["vue", "vue.js"],
  "CI/CD": ["ci/cd"],
};

const normalizeSkill = (skill: string) =>
  skill
    .toLowerCase()
    .replace(/[\s.\-]/g, "")
    .replace(/js$/, "");

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const hasWord = (text: string, keyword: string) =>
  new RegExp(`(^|[^a-z0-9])${escapeRegex(keyword)}([^a-z0-9]|$)`).test(text);

interface JobMatch {
  score: number | null;
  matched: string[];
  missing: string[];
}

const analyzeJob = (job: Job, userSkills: string[]): JobMatch => {
  const found = new Map<string, string>();

  (job.skills || []).forEach((skill) => {
    found.set(normalizeSkill(skill), skill);
  });

  const text = `${job.title} ${job.description}`.toLowerCase();

  Object.entries(SKILL_KEYWORDS).forEach(([label, keywords]) => {
    if (keywords.some((keyword) => hasWord(text, keyword))) {
      const key = normalizeSkill(label);
      if (!found.has(key)) found.set(key, label);
    }
  });

  const userKeys = new Set(userSkills.map(normalizeSkill));
  const matched: string[] = [];
  const missing: string[] = [];

  found.forEach((label, key) => {
    (userKeys.has(key) ? matched : missing).push(label);
  });

  const total = matched.length + missing.length;

  return {
    score: total > 0 ? Math.round((matched.length / total) * 100) : null,
    matched,
    missing,
  };
};

const timeAgo = (date?: string) => {
  if (!date) return "";
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (days <= 0) return "Posted today";
  if (days === 1) return "Posted 1 day ago";
  if (days < 7) return `Posted ${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `Posted ${weeks} week${weeks > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `Posted ${months} month${months > 1 ? "s" : ""} ago`;
};

const matchLabel = (score: number) => {
  if (score >= 80) return { text: "Strong match", color: "text-green-600" };
  if (score >= 60) return { text: "Good match", color: "text-violet-600" };
  return { text: "Partial match", color: "text-orange-500" };
};

const formatSalary = (min: number | null, max: number | null) =>
  min !== null && max !== null
    ? `₹${min.toLocaleString("en-IN")} – ₹${max.toLocaleString("en-IN")}`
    : "";

type JobWithMatch = Job & { match: JobMatch };

const JobCard = ({
  job,
  selected,
  onToggleSelect,
}: {
  job: JobWithMatch;
  selected: boolean;
  onToggleSelect: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const { score, matched, missing } = job.match;
  const label = score !== null ? matchLabel(score) : null;
  const salary = formatSalary(job.salaryMin, job.salaryMax);

  return (
    <article
      className={`rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md sm:p-6 ${
        selected
          ? "border-violet-300 ring-2 ring-violet-500/10"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex gap-3 sm:gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600 sm:h-12 sm:w-12">
          {job.company?.charAt(0)?.toUpperCase() || "J"}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="wrap-break-word text-base font-bold text-gray-950">
                {job.title}
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                {job.company || "Company not specified"}
              </p>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                {job.location && <span>⌖ {job.location}</span>}
                {salary && <span>{salary}</span>}
              </div>
            </div>

            {score !== null && (
              <div className="shrink-0 text-right">
                <p className="text-2xl font-bold leading-none text-violet-600">
                  {score}%
                </p>
                <p className="mt-1 text-[10px] font-medium text-gray-400">
                  match
                </p>
              </div>
            )}
          </div>

          {score !== null && (
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-violet-500"
                style={{ width: `${score}%` }}
              />
            </div>
          )}

          {(matched.length > 0 || missing.length > 0) && (
            <div className="mt-5 flex flex-wrap gap-2">
              {matched.map((skill) => (
                <span
                  key={`m-${skill}`}
                  className="rounded-lg bg-green-50 px-3 py-1.5 text-[11px] font-semibold text-green-700"
                >
                  ✓ {skill}
                </span>
              ))}
              {missing.slice(0, 4).map((skill) => (
                <span
                  key={`x-${skill}`}
                  className="rounded-lg bg-orange-50 px-3 py-1.5 text-[11px] font-semibold text-orange-600"
                >
                  + {skill}
                </span>
              ))}
            </div>
          )}

          {open && (
            <div className="mt-4 rounded-xl bg-gray-50 p-4 text-xs leading-5 text-gray-600">
              {score === null ? (
                <p>
                  No skills were listed for this job, so it can&apos;t be
                  scored.
                </p>
              ) : (
                <>
                  <p>
                    You match {matched.length} of{" "}
                    {matched.length + missing.length} skills found in this
                    listing.
                  </p>
                  {missing.length > 0 && (
                    <p className="mt-1">
                      Missing: {missing.join(", ")}. Adding these to your resume
                      could raise this score.
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400">
              <span>{timeAgo(job.createdAt) || `Source: ${job.source}`}</span>
              {label && (
                <>
                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                  <span className={`font-semibold ${label.color}`}>
                    {label.text}
                  </span>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="order-1 h-10 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 sm:order-0 sm:px-4"
              >
                Why this match?
              </button>

              <button
                type="button"
                onClick={onToggleSelect}
                aria-pressed={selected}
                className={`order-3 col-span-2 h-10 rounded-lg px-3 text-xs font-semibold transition sm:order-0 sm:col-span-1 sm:px-4 ${
                  selected
                    ? "bg-violet-600 text-white hover:bg-violet-700"
                    : "border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100"
                }`}
              >
                {selected
                  ? "Selected for interview prep"
                  : "Select for interview prep"}
              </button>

              {job.url && (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="order-2 flex h-10 items-center justify-center rounded-lg bg-gray-950 px-3 text-xs font-semibold text-white transition hover:bg-black sm:order-0 sm:px-5"
                >
                  View job →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

const DEFAULT_QUERY = "MERN Stack Developer";
const DEFAULT_CITY = "Pune";

const RecommendedJobs = () => {
  const { selectedResume, loading: resumeLoading } = useSelectedResume();

  // Stable reference so useMemo below doesn't recompute on every render
  const userSkills = useMemo(
    () => selectedResume?.skills ?? [],
    [selectedResume],
  );

  // Values actually used for the API call
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [location, setLocation] = useState(DEFAULT_CITY);
  // Value typed in the input (applied on submit)
  const [searchInput, setSearchInput] = useState(DEFAULT_QUERY);

  const setSelectedJobId = useInterviewStore((s) => s.setSelectedJobId);
  const selectedJobId = useInterviewStore((s) => s.selectedJobId);

  const jobsQuery = useQuery<JobsResponse, Error>({
    queryKey: ["jobs", "import", query, location, 10],
    queryFn: async ({ signal }) => {
      const response = await api.get<JobsResponse>("/jobs/import", {
        params: { query, location, limit: 10 },
        signal,
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const jobs = useMemo(() => jobsQuery.data?.jobs ?? [], [jobsQuery.data]);
  const loading = jobsQuery.isPending;

  // Show an error only when the request failed and there's no cached data
  const error =
    jobsQuery.isError && !jobsQuery.data
      ? isAxiosError<ApiErrorResponse>(jobsQuery.error)
        ? jobsQuery.error.response?.data?.message ||
          "Failed to fetch recommended jobs."
        : "Failed to fetch recommended jobs."
      : "";

  const refetch = () => {
    void jobsQuery.refetch();
  };

  const rankedJobs: JobWithMatch[] = useMemo(
    () =>
      jobs
        .map((job) => ({
          ...job,
          match: analyzeJob(job, userSkills),
        }))
        .sort((a, b) => (b.match.score ?? -1) - (a.match.score ?? -1)),
    [jobs, userSkills],
  );

  const scoredJobs = rankedJobs.filter((job) => job.match.score !== null);

  const matchReadiness =
    scoredJobs.length > 0
      ? Math.round(
          scoredJobs.reduce((total, job) => total + (job.match.score ?? 0), 0) /
            scoredJobs.length,
        )
      : null;

  const readinessLabel =
    matchReadiness === null
      ? "Not available"
      : matchReadiness >= 80
        ? "Strong match"
        : matchReadiness >= 60
          ? "Good match"
          : "Needs improvement";

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (!trimmed) return;

    if (trimmed === query) {
      refetch();
    } else {
      setQuery(trimmed);
    }
  };

  const handleCityChange = (city: string) => {
    setLocation(city); 
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-7 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-violet-600">
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                AI Job Matcher
              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-950">
                Recommended Jobs
              </h1>

              <p className="mt-1 max-w-xl text-sm text-gray-500">
                Jobs selected based on your resume, skills and career profile.
              </p>
            </div>

            <button
              type="button"
              onClick={refetch}
              disabled={jobsQuery.isFetching}
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              <span>↻</span>
              {jobsQuery.isFetching ? "Refreshing..." : "Refresh matches"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* AI Summary */}
        <section className="relative overflow-hidden rounded-2xl bg-gray-950 p-6 text-white shadow-sm">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-violet-600 opacity-20 blur-3xl" />
          <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3 md:items-center">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-violet-300">
                  ✦
                </div>

                <span className="text-xs font-semibold text-violet-300">
                  AI-powered recommendations
                </span>
              </div>

              <h2 className="mt-4 text-xl font-bold tracking-tight">
                {loading
                  ? "Finding jobs that match your profile..."
                  : `We found ${jobs.length} jobs that match your profile.`}
              </h2>

              <p className="mt-2 max-w-xl text-xs leading-6 text-gray-400">
                Your strongest opportunities are currently in frontend and
                full-stack development. Improving your Next.js and cloud skills
                could unlock even more matches.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {matchReadiness !== null ? `${matchReadiness}%` : "—"}
                  </p>

                  <p className="mt-1 text-[10px] text-gray-400">
                    Profile match average
                  </p>
                </div>

                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full p-1"
                  style={{
                    background: `conic-gradient(#8b5cf6 ${
                      matchReadiness ?? 0
                    }%, rgba(255,255,255,0.1) 0)`,
                  }}
                >
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-950 text-[10px] font-bold">
                    {matchReadiness !== null ? matchReadiness : "—"}
                  </div>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-violet-500 transition-all duration-500"
                  style={{
                    width: `${matchReadiness ?? 0}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-[10px] text-gray-400">
                {scoredJobs.length > 0
                  ? `Based on ${scoredJobs.length} job matches`
                  : "Search for jobs to calculate your match"}
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <form
          onSubmit={handleSearch}
          className="mt-7 flex flex-col gap-3 lg:flex-row"
        >
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              ⌕
            </span>

            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search jobs, e.g. React Developer"
              className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-xs text-gray-800 outline-none placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <select
            value={location}
            onChange={(e) => handleCityChange(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-xs font-medium text-gray-600 outline-none focus:border-violet-400"
          >
            {INDIAN_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading || !searchInput.trim()}
            className="h-11 rounded-xl bg-violet-600 px-6 text-xs font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
          >
            Search
          </button>
        </form>

        {/* Content */}
        <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Jobs */}
          <section className="min-w-0 space-y-4 lg:col-span-2">
            <div className="flex  items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-gray-950">
                  Available jobs
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Jobs found for {query} in {location}
                </p>
              </div>

              {!loading && !error && (
                <span className="rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-semibold text-violet-600">
                  {jobs.length} jobs
                </span>
              )}
            </div>

            {loading && (
              <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-violet-600" />

                <p className="mt-4 text-sm font-semibold text-gray-800">
                  Finding jobs...
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Searching for {query} jobs in {location}.
                </p>
              </div>
            )}

            {error && !loading && (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
                <p className="text-sm font-semibold text-red-600">
                  Failed to load jobs
                </p>

                <p className="mt-1 text-xs text-red-500">{error}</p>

                <button
                  type="button"
                  onClick={refetch}
                  className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && jobs.length === 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
                <p className="text-sm font-semibold text-gray-800">
                  No jobs found
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Try a different job title or city.
                </p>
              </div>
            )}

            {!loading && !error && rankedJobs.length > 0 && (
              <div className="custom-scrollbar space-y-4 lg:max-h-169 lg:overflow-y-auto lg:p-1 lg:pr-2">
                {rankedJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    selected={selectedJobId === job._id}
                    onToggleSelect={() =>
                      setSelectedJobId(
                        selectedJobId === job._id ? null : job._id,
                      )
                    }
                  />
                ))}
              </div>
            )}
          </section>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Your profile */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-violet-600">
                    Your profile
                  </p>

                  <h3 className="mt-1 text-sm font-bold text-gray-950">
                    Match readiness
                  </h3>
                </div>

                <Link
                  href="/resumes"
                  className="text-[10px] font-semibold text-violet-600"
                >
                  Edit
                </Link>
              </div>

              <div className="mt-5 flex items-center gap-5">
                {/* Dynamic circular progress */}
                <div
                  className="h-20 w-20 shrink-0 rounded-full p-2"
                  style={{
                    background: `conic-gradient(#8b5cf6 ${
                      matchReadiness ?? 0
                    }%, #ede9fe 0)`,
                  }}
                >
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                    <span className="text-lg font-bold text-gray-950">
                      {matchReadiness !== null ? `${matchReadiness}%` : "—"}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-900">
                    {loading ? "Analyzing jobs..." : readinessLabel}
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-gray-400">
                    {matchReadiness !== null
                      ? `Average skills match across ${scoredJobs.length} jobs.`
                      : "Search for jobs to calculate your skills match."}
                  </p>
                </div>
              </div>

              <Link
                href="/resumes"
                className="mt-5 flex h-9 items-center justify-center rounded-lg bg-gray-50 text-[10px] font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                Improve profile →
              </Link>
            </section>

            {/* Top skills */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-bold text-gray-950">
                Your strongest skills
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                Skills helping your job matches
              </p>

              <div className="mt-4 max-h-96 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {resumeLoading ? (
                  <p className="text-xs text-gray-400">
                    Loading resume skills...
                  </p>
                ) : userSkills.length > 0 ? (
                  userSkills.map((skill) => (
                    <div className="flex flex-col gap-2" key={skill}>
                      <div className="mb-1.5 flex justify-between">
                        <span className="text-[10px] font-medium text-gray-600">
                          {skill}
                        </span>

                        <span className="text-[10px] font-semibold text-gray-400">
                          Resume skill
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full w-full rounded-full bg-violet-500" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">
                    No skills found. Please upload or select a resume.
                  </p>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default RecommendedJobs;