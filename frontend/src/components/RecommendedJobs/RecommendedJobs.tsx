"use client";

import Link from "next/link";

const jobs = [
  {
    id: 1,
    company: "TechFlow",
    companyInitial: "T",
    role: "Frontend Developer",
    location: "Dublin, Ireland",
    type: "Full-time",
    salary: "€45k – €60k",
    match: 94,
    skills: ["React", "TypeScript", "Next.js", "Node.js"],
    missing: ["GraphQL"],
    posted: "2 days ago",
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: 2,
    company: "Nova Systems",
    companyInitial: "N",
    role: "Full Stack Developer",
    location: "Dublin, Ireland",
    type: "Full-time",
    salary: "€50k – €68k",
    match: 89,
    skills: ["React", "Node.js", "MongoDB", "TypeScript"],
    missing: ["AWS"],
    posted: "4 days ago",
    color: "bg-violet-50 text-violet-600",
  },
  {
    id: 3,
    company: "Pixel Labs",
    companyInitial: "P",
    role: "React Developer",
    location: "Remote · Ireland",
    type: "Full-time",
    salary: "€42k – €55k",
    match: 84,
    skills: ["React", "JavaScript", "REST API", "Git"],
    missing: ["Testing"],
    posted: "1 week ago",
    color: "bg-orange-50 text-orange-600",
  },
  {
    id: 4,
    company: "CloudBridge",
    companyInitial: "C",
    role: "Software Engineer",
    location: "Cork, Ireland",
    type: "Full-time",
    salary: "€48k – €65k",
    match: 81,
    skills: ["JavaScript", "Node.js", "React", "Git"],
    missing: ["Docker", "AWS"],
    posted: "1 week ago",
    color: "bg-green-50 text-green-600",
  },
];

const RecommendedJobs = () => {
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
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
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
                We found 24 jobs that match your profile.
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
        <div className="mt-7 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search recommended jobs..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-xs text-gray-800 outline-none placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <select className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-xs font-medium text-gray-600 outline-none focus:border-violet-400">
            <option>All locations</option>
            <option>Dublin</option>
            <option>Cork</option>
            <option>Remote</option>
          </select>

          <select className="h-11 rounded-xl border border-gray-200 bg-white px-4 text-xs font-medium text-gray-600 outline-none focus:border-violet-400">
            <option>Match: Highest</option>
            <option>Newest</option>
            <option>Salary: Highest</option>
          </select>
        </div>

        {/* Content */}
        <div className="mt-7 grid gap-6 lg:grid-cols-3">
          {/* Jobs */}
          <section className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-gray-950">
                  Best matches
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Ranked by compatibility with your resume
                </p>
              </div>

              <span className="rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-semibold text-violet-600">
                24 matches
              </span>
            </div>

            {jobs.map((job) => (
              <article
                key={job.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md"
              >
                <div className="flex gap-4">
                  {/* Company */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${job.color}`}
                  >
                    {job.companyInitial}
                  </div>

                  <div className="min-w-0 flex-1">
                    {/* Job heading */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-gray-950">
                          {job.role}
                        </h3>

                        <p className="mt-1 text-xs font-medium text-gray-600">
                          {job.company}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-400">
                          <span>⌖ {job.location}</span>
                          <span>◷ {job.type}</span>
                          <span>€ {job.salary.replace("€ ", "")}</span>
                        </div>
                      </div>

                      {/* Match */}
                      <div className="flex shrink-0 items-center gap-3">
                        <div className="text-right">
                          <p className="text-xl font-bold text-violet-600">
                            {job.match}%
                          </p>

                          <p className="text-[9px] font-medium text-gray-400">
                            match
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Match bar */}
                    <div className="mt-5">
                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-violet-500"
                          style={{ width: `${job.match}%` }}
                        />
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-green-50 px-2.5 py-1.5 text-[9px] font-semibold text-green-700"
                        >
                          ✓ {skill}
                        </span>
                      ))}

                      {job.missing.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-orange-50 px-2.5 py-1.5 text-[9px] font-semibold text-orange-600"
                        >
                          + {skill}
                        </span>
                      ))}
                    </div>

                    {/* Bottom */}
                    <div className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-gray-400">
                          Posted {job.posted}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-gray-300" />

                        <span className="text-[9px] font-semibold text-green-600">
                          Strong match
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="flex h-9 items-center justify-center rounded-lg border border-gray-200 px-3 text-[10px] font-semibold text-gray-600 transition hover:bg-gray-50"
                        >
                          Why this match?
                        </button>

                        <button
                          type="button"
                          className="flex h-9 items-center justify-center rounded-lg bg-gray-950 px-4 text-[10px] font-semibold text-white transition hover:bg-black"
                        >
                          View job →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
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
                  <span className="text-lg font-bold text-gray-950">
                    82%
                  </span>
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