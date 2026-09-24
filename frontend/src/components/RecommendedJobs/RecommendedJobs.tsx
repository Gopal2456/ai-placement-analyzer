"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import api from "@/api/axios";

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

// TODO: replace with the skills from the user's parsed resume
const USER_SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "MongoDB",
  "Tailwind CSS",
  "REST API",
  "Git",
];

// Used to detect skills in job descriptions when the API returns none
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

const analyzeJob = (job: Job): JobMatch => {
  const found = new Map<string, string>();

  (job.skills || []).forEach((skill) => found.set(normalizeSkill(skill), skill));

  const text = `${job.title} ${job.description}`.toLowerCase();
  Object.entries(SKILL_KEYWORDS).forEach(([label, keywords]) => {
    if (keywords.some((keyword) => hasWord(text, keyword))) {
      const key = normalizeSkill(label);
      if (!found.has(key)) found.set(key, label);
    }
  });

  const userKeys = new Set(USER_SKILLS.map(normalizeSkill));
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

const JobCard = ({ job }: { job: JobWithMatch }) => {
  const [open, setOpen] = useState(false);
  const { score, matched, missing } = job.match;
  const label = score !== null ? matchLabel(score) : null;
  const salary = formatSalary(job.salaryMin, job.salaryMax);

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-gray-300 hover:shadow-md">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
          {job.company?.charAt(0)?.toUpperCase() || "J"}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-gray-950">{job.title}</h3>

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
                <p>No skills were listed for this job, so it can&apos;t be scored.</p>
              ) : (
                <>
                  <p>
                    You match {matched.length} of {matched.length + missing.length}{" "}
                    skills found in this listing.
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
            <div className="flex items-center gap-2 text-xs text-gray-400">
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

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Why this match?
              </button>

              {job.url && (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 items-center justify-center rounded-lg bg-gray-950 px-5 text-xs font-semibold text-white transition hover:bg-black"
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

const DEFAULT_QUERY = "Full Stack Developer";
const DEFAULT_CITY = "Pune";

const RecommendedJobs = () => {
  // Values actually used for the API call
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [location, setLocation] = useState(DEFAULT_CITY);

  // Value typed in the input (applied on submit)
  const [searchInput, setSearchInput] = useState(DEFAULT_QUERY);

  // Bumped to force a re-fetch with the same query/location
  const [refreshTick, setRefreshTick] = useState(0);

  // The latest response, tagged with the request it belongs to
  const [result, setResult] = useState<{
    key: string;
    jobs: Job[];
    error: string;
  } | null>(null);

  const requestKey = `${query}|${location}|${refreshTick}`;

  useEffect(() => {
    let cancelled = false;

    api
      .get<JobsResponse>("/jobs/import", {
        params: { query, location, limit: 10 },
      })
      .then((response) => {
        if (cancelled) return;
        setResult({
          key: requestKey,
          jobs: response.data.jobs || [],
          error: "",
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("Fetch recommended jobs error:", err);

        const message = isAxiosError<ApiErrorResponse>(err)
          ? err.response?.data?.message || "Failed to fetch recommended jobs."
          : "Failed to fetch recommended jobs.";

        setResult({ key: requestKey, jobs: [], error: message });
      });

    // Cancels stale responses when the user searches again quickly
    return () => {
      cancelled = true;
    };
  }, [query, location, requestKey]);

  // Derived state: no setState needed inside the effect
  const loading = result?.key !== requestKey;
  const jobs = result?.jobs ?? [];
  const error = loading ? "" : (result?.error ?? "");

  const refetch = () => setRefreshTick((t) => t + 1);

  const rankedJobs: JobWithMatch[] = useMemo(
    () =>
      jobs
        .map((job) => ({ ...job, match: analyzeJob(job) }))
        .sort((a, b) => (b.match.score ?? -1) - (a.match.score ?? -1)),
    [jobs],
  );

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = searchInput.trim();
    if (!trimmed) return;

    // If the query is unchanged, the effect won't re-run, so fetch directly
    if (trimmed === query) {
      refetch();
    } else {
      setQuery(trimmed);
    }
  };

  const handleCityChange = (city: string) => {
    setLocation(city); // effect re-fetches automatically
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
              disabled={loading}
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              <span>↻</span>
              Refresh matches
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* AI Summary */}
        <section className="relative overflow-hidden rounded-2xl bg-gray-950 p-6 text-white shadow-sm">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-violet-600 opacity-20 blur-3xl" />

          <div className="relative grid gap-6 md:grid-cols-3 md:items-center">
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
                  <p className="text-3xl font-bold">87%</p>
                  <p className="mt-1 text-[10px] text-gray-500">
                    Profile match average
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-violet-500 border-l-white/10 border-b-white/10 text-[10px] font-bold">
                  87
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-5/6 rounded-full bg-violet-500" />
              </div>
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
        <div className="mt-7 grid gap-6 lg:grid-cols-3">
          {/* Jobs */}
          <section className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
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

            {!loading &&
              !error &&
              rankedJobs.map((job) => <JobCard key={job._id} job={job} />)}
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
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-8 border-violet-100">
                  <span className="text-lg font-bold text-gray-950">82%</span>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-900">
                    Good profile
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-gray-400">
                    Your profile is ready for most frontend roles.
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

              <div className="mt-5 space-y-4">
                {[
                  ["React", "95%"],
                  ["TypeScript", "88%"],
                  ["Node.js", "82%"],
                  ["JavaScript", "80%"],
                ].map(([skill, score]) => (
                  <div key={skill}>
                    <div className="mb-1.5 flex justify-between">
                      <span className="text-[10px] font-medium text-gray-600">
                        {skill}
                      </span>

                      <span className="text-[10px] font-semibold text-gray-400">
                        {score}
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-violet-500"
                        style={{ width: score }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Improve matches */}
            <section className="rounded-2xl border border-violet-100 bg-violet-50 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
                ✦
              </div>

              <h3 className="mt-4 text-sm font-bold text-gray-950">
                Improve your matches
              </h3>

              <p className="mt-2 text-[10px] leading-5 text-gray-500">
                Learning Next.js, GraphQL and AWS could increase the number of
                high-match jobs available to you.
              </p>

              <Link
                href="/analysis/latest/skills"
                className="mt-4 inline-flex text-[10px] font-bold text-violet-600"
              >
                View skill roadmap →
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default RecommendedJobs;