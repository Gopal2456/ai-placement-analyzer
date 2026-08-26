"use client";

import Link from "next/link";

const stats = [
  {
    value: "87%",
    label: "Avg. match score",
    change: "↑ 12%",
  },
  {
    value: "14",
    label: "Jobs analyzed",
    change: "This month",
  },
  {
    value: "8",
    label: "Skill gaps",
    change: "To improve",
  },
];

const skills = [
  {
    name: "React",
    score: 95,
    status: "Excellent",
  },
  {
    name: "TypeScript",
    score: 88,
    status: "Strong",
  },
  {
    name: "Node.js",
    score: 82,
    status: "Strong",
  },
  {
    name: "Next.js",
    score: 55,
    status: "Needs work",
  },
];

const recentAnalyses = [
  {
    role: "Frontend Developer",
    company: "Technology",
    score: 87,
    status: "Strong match",
    date: "Today",
  },
  {
    role: "Full Stack Developer",
    company: "SaaS Company",
    score: 76,
    status: "Good match",
    date: "Yesterday",
  },
  {
    role: "React Developer",
    company: "Product Company",
    score: 71,
    status: "Good match",
    date: "Aug 22",
  },
];

const DashboardHome = () => {
  return (
    <div className="min-h-screen bg-[#f7f8fa] text-gray-900">
      {/* Dashboard Header */}
      <header className=" border-gray-200 bg-white">
        <div className="flex h-20 items-center justify-between px-6 lg:px-8">
          <div>
            <p className="text-xs font-medium text-gray-400">
              Tuesday, August 25
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-gray-950">
              Good evening, Gopal 👋
            </h1>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-blue-500 text-sm font-bold text-white shadow-sm"
          >
            G
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Welcome / Quick Action */}
          <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
                Career overview
              </p>

              <h2 className="mt-2 text-xl font-bold tracking-tight text-gray-950">
                Your placement readiness
              </h2>

              <p className="mt-1 max-w-xl text-sm text-gray-500">
                Track your job matches, skill gaps and interview preparation
                from one place.
              </p>
            </div>

            <Link
              href="/analysis/new"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition hover:-translate-y-0.5 hover:bg-black"
            >
              <span className="text-lg leading-none">+</span>
              New analysis
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-3xl font-bold tracking-[-0.04em] text-gray-950">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs font-medium text-gray-400">
                      {stat.label}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-sm text-violet-600">
                    ✦
                  </div>
                </div>

                <p className="mt-5 text-[10px] font-semibold text-violet-600">
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          {/* Main Analysis Area */}
          <div className="mt-5 grid gap-5 xl:grid-cols-5">
            {/* Latest Analysis */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-950">
                      Latest analysis
                    </h3>

                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-[9px] font-semibold text-green-600">
                      Strong match
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gray-400">
                    Frontend Developer · Technology
                  </p>
                </div>

                <Link
                  href="/analysis"
                  className="text-xs font-semibold text-gray-400 transition hover:text-violet-600"
                >
                  View all →
                </Link>
              </div>

              <div className="mt-8 grid items-center gap-8 md:grid-cols-[180px_1fr]">
                {/* Match Score */}
                <div className="flex justify-center">
                  <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-12 border-violet-100">
                    <div className="absolute -inset-3 rounded-full border-12 border-violet-600 border-b-transparent border-l-transparent rotate-[-42deg]" />

                    <div className="text-center">
                      <p className="text-4xl font-bold tracking-tighter text-gray-950">
                        87
                      </p>

                      <p className="mt-1 text-[9px] font-medium tracking-[0.12em] text-gray-400">
                        MATCH
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-5">
                  {skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[10px] font-medium text-gray-600">
                          {skill.name}
                        </span>

                        <span className="text-[10px] font-medium text-gray-400">
                          {skill.status}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-violet-500 transition-all duration-700"
                          style={{ width: `${skill.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analysis Actions */}
              <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row">
                <Link
                  href="/analysis/latest"
                  className="flex h-10 items-center justify-center rounded-lg bg-gray-950 px-4 text-xs font-semibold text-white transition hover:bg-black"
                >
                  View full analysis →
                </Link>

                <Link
                  href="/analysis/latest/skills"
                  className="flex h-10 items-center justify-center rounded-lg border border-gray-200 px-4 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  View skill gaps
                </Link>
              </div>
            </section>

            {/* AI Recommendation */}
            <section className="relative overflow-hidden rounded-2xl bg-gray-950 p-6 text-white shadow-sm xl:col-span-2">
              {/* Background decoration */}
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-600/20 blur-3xl" />

              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg">
                  ✦
                </div>

                <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-300">
                  AI insight
                </p>

                <h3 className="mt-2 text-xl font-bold tracking-tight">
                  AI recommendation
                </h3>

                <p className="mt-4 max-w-sm text-xs leading-6 text-gray-400">
                  Strengthen your{" "}
                  <span className="font-semibold text-gray-200">
                    Next.js
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold text-gray-200">
                    GraphQL
                  </span>{" "}
                  knowledge to increase your match score for this role.
                </p>

                {/* Skills */}
                <div className="mt-7 space-y-3">
                  <div>
                    <div className="mb-1.5 flex justify-between text-[9px]">
                      <span className="text-gray-400">Next.js</span>
                      <span className="text-violet-300">55%</span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[55%] rounded-full bg-violet-500" />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1.5 flex justify-between text-[9px]">
                      <span className="text-gray-400">GraphQL</span>
                      <span className="text-violet-300">32%</span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[32%] rounded-full bg-violet-500" />
                    </div>
                  </div>
                </div>

                <Link
                  href="/analysis/latest/skills"
                  className="mt-7 inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 text-xs font-semibold text-gray-950 transition hover:bg-gray-100"
                >
                  View skill gaps →
                </Link>
              </div>
            </section>
          </div>

          {/* Bottom Section */}
          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            {/* Recent Analyses */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-950">
                    Recent analyses
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    Your latest job comparisons
                  </p>
                </div>

                <Link
                  href="/analysis"
                  className="text-xs font-semibold text-violet-600 hover:text-violet-700"
                >
                  See all
                </Link>
              </div>

              <div className="mt-6 overflow-hidden rounded-xl border border-gray-100">
                {recentAnalyses.map((analysis, index) => (
                  <Link
                    href="/analysis/latest"
                    key={analysis.role}
                    className={`flex items-center gap-4 p-4 transition hover:bg-gray-50 ${
                      index !== recentAnalyses.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    {/* Company icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs font-bold text-gray-600">
                      {analysis.role.charAt(0)}
                    </div>

                    {/* Job */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-gray-900">
                        {analysis.role}
                      </p>

                      <p className="mt-1 text-[10px] text-gray-400">
                        {analysis.company} · {analysis.date}
                      </p>
                    </div>

                    {/* Score */}
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {analysis.score}%
                      </p>

                      <p className="mt-0.5 text-[9px] text-gray-400">
                        {analysis.status}
                      </p>
                    </div>

                    <span className="text-gray-300">→</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-950">
                Quick actions
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                Continue where you left off
              </p>

              <div className="mt-6 space-y-3">
                <Link
                  href="/resumes/upload"
                  className="group flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:border-violet-200 hover:bg-violet-50/50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-sm text-violet-600">
                    ↑
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-800">
                      Upload resume
                    </p>

                    <p className="mt-0.5 text-[9px] text-gray-400">
                      Add a new resume
                    </p>
                  </div>

                  <span className="text-gray-300 transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/jobs/new"
                  className="group flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:border-violet-200 hover:bg-violet-50/50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-sm text-violet-600">
                    +
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-800">
                      Add job
                    </p>

                    <p className="mt-0.5 text-[9px] text-gray-400">
                      Analyze a new position
                    </p>
                  </div>

                  <span className="text-gray-300 transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/interview"
                  className="group flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:border-violet-200 hover:bg-violet-50/50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-sm text-violet-600">
                    ✦
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-800">
                      Practice interview
                    </p>

                    <p className="mt-0.5 text-[9px] text-gray-400">
                      Prepare with AI
                    </p>
                  </div>

                  <span className="text-gray-300 transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/recommended-jobs"
                  className="group flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:border-violet-200 hover:bg-violet-50/50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-sm text-violet-600">
                    ◎
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-800">
                      Find jobs for me
                    </p>

                    <p className="mt-0.5 text-[9px] text-gray-400">
                      Discover matching jobs
                    </p>
                  </div>

                  <span className="text-gray-300 transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardHome;