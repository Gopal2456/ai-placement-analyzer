"use client";

import { useState } from "react";
import Link from "next/link";

const features = [
  {
    number: "01",
    title: "Resume Analysis",
    description:
      "Upload your resume and let AI extract your skills, experience, education and projects.",
    icon: "↗",
  },
  {
    number: "02",
    title: "Job Match Score",
    description:
      "Compare your resume with any job description and get a clear, deterministic match score.",
    icon: "◎",
  },
  {
    number: "03",
    title: "Skill Gap Analysis",
    description:
      "Discover the skills you're missing and get practical recommendations to improve your profile.",
    icon: "◇",
  },
  {
    number: "04",
    title: "Interview Practice",
    description:
      "Generate technical, behavioral and resume-based interview questions tailored to your target role.",
    icon: "✦",
  },
];

const stats = [
  { value: "87%", label: "Average Match Score" },
  { value: "24+", label: "Skills Identified" },
  { value: "10k+", label: "Jobs Analyzed" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#111827]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-black/6 bg-[#f7f8fa]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full text-white">
              <img
                src="/Logo.png"
                alt="Logo"
                className="h-8 w-8 object-contain"
              />
            </div>

            <div>
              <div className="text-[15px] font-bold tracking-tight">
                Placement <span className="text-violet-600">AI</span>
              </div>
              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-400">
                Career Intelligence
              </div>
            </div>
          </a>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
            >
              How it works
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
            >
              About
            </a>
          </div>

          {/* Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-white hover:text-gray-900"
            >
              Log in
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl bg-[#111827] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition hover:-translate-y-0.5 hover:bg-black"
            >
              Get started
            </Link>
          </div>

          {/* Mobile menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-black/10 bg-white p-2 md:hidden"
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-gray-700" />
              <span className="block h-0.5 w-5 bg-gray-700" />
              <span className="block h-0.5 w-5 bg-gray-700" />
            </div>
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-black/6 bg-white px-6 py-5 md:hidden">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-sm font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium">
                How it works
              </a>
              <a href="#about" className="text-sm font-medium">
                About
              </a>
              <button className="mt-2 rounded-xl bg-[#111827] px-5 py-3 text-sm font-semibold text-white">
                Get started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[8%] top-20 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />
          <div className="absolute right-[8%] top-32 h-80 w-80 rounded-full bg-blue-200/25 blur-3xl" />
          <div className="absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-linear-to-r from-transparent via-gray-300 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-semibold text-violet-700 shadow-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100">
                ✦
              </span>
              AI-powered career intelligence
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-bold leading-[1.05] tracking-[-0.045em] text-gray-950 sm:text-6xl lg:text-7xl">
              Know exactly how
              <br />
              <span className="bg-linear-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                job-ready you are.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
              Upload your resume, add a job description, and get an intelligent
              breakdown of your match score, skill gaps, strengths and next
              steps.
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button className="group flex h-13 items-center justify-center gap-3 rounded-xl bg-[#111827] px-7 text-sm font-semibold text-white shadow-xl shadow-gray-900/15 transition hover:-translate-y-0.5 hover:bg-black">
                Analyze my resume
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>

              <button className="flex h-13 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-7 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50">
                See how it works
                <span>↓</span>
              </button>
            </div>

            <p className="mt-5 text-xs text-gray-400">
              No credit card required · Secure resume processing
            </p>
          </div>

          {/* Product Preview */}
          <div className="relative mx-auto mt-16 max-w-6xl lg:mt-20">
            <div className="absolute -inset-4 rounded-4xl bg-linear-to-r from-violet-500/10 via-blue-500/10 to-cyan-500/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.3)]">
              {/* Browser bar */}
              <div className="flex h-12 items-center gap-2 border-b border-gray-100 bg-gray-50 px-5">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />

                <div className="mx-auto hidden h-7 w-80 items-center justify-center rounded-md border border-gray-200 bg-white text-[10px] text-gray-400 sm:flex">
                  app.placementai.com/dashboard
                </div>
              </div>

              {/* Dashboard preview */}
              <div className="grid min-h-107.5 grid-cols-12">
                {/* Sidebar */}
                <aside className="hidden border-r border-gray-100 bg-[#fbfbfc] p-5 sm:col-span-3 sm:block lg:col-span-2">
                  <div className="mb-8 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-900 text-xs font-bold text-white">
                      A
                    </div>
                    <span className="text-xs font-bold">PlacementAI</span>
                  </div>

                  <div className="space-y-1">
                    {[
                      ["▦", "Dashboard", true],
                      ["□", "My Resumes", false],
                      ["⌁", "Job Matches", false],
                      ["◌", "Interviews", false],
                    ].map(([icon, label, active]) => (
                      <div
                        key={String(label)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[10px] font-medium ${
                          active ? "bg-gray-900 text-white" : "text-gray-400"
                        }`}
                      >
                        <span>{icon}</span>
                        {label}
                      </div>
                    ))}
                  </div>
                </aside>

                {/* Main */}
                <div className="col-span-12 bg-white p-5 sm:col-span-9 lg:col-span-10 lg:p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-medium text-gray-400">
                        Tuesday, August 25
                      </p>
                      <h2 className="mt-1 text-xl font-bold tracking-tight text-gray-900">
                        Good evening, Gopal 👋
                      </h2>
                    </div>

                    <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-blue-500 text-[10px] font-bold text-white sm:flex">
                      G
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="mt-7 grid grid-cols-3 gap-3">
                    {[
                      ["87%", "Avg. match score", "↑ 12%"],
                      ["14", "Jobs analyzed", "This month"],
                      ["8", "Skill gaps", "To improve"],
                    ].map(([value, label, change]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-gray-100 bg-gray-50/70 p-4"
                      >
                        <div className="text-xl font-bold text-gray-900">
                          {value}
                        </div>
                        <div className="mt-1 text-[9px] text-gray-400">
                          {label}
                        </div>
                        <div className="mt-3 text-[8px] font-semibold text-violet-600">
                          {change}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Analysis card */}
                  <div className="mt-4 grid gap-4 lg:grid-cols-5">
                    <div className="rounded-xl border border-gray-100 p-5 lg:col-span-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-bold text-gray-900">
                            Latest analysis
                          </h3>
                          <p className="mt-1 text-[9px] text-gray-400">
                            Frontend Developer · Technology
                          </p>
                        </div>
                        <span className="rounded-full bg-green-50 px-2 py-1 text-[8px] font-semibold text-green-600">
                          Strong match
                        </span>
                      </div>

                      <div className="mt-7 flex items-center gap-7">
                        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-10 border-violet-100">
                          <div className="absolute -inset-2.5 rounded-full border-10 border-violet-600 border-b-transparent border-l-transparent rotate-[-40deg]" />
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              87
                            </div>
                            <div className="text-[8px] text-gray-400">
                              MATCH
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 space-y-3">
                          {[
                            ["React", "Excellent", 95],
                            ["TypeScript", "Strong", 88],
                            ["Node.js", "Strong", 82],
                            ["Next.js", "Needs work", 55],
                          ].map(([skill, status, width]) => (
                            <div key={skill}>
                              <div className="mb-1 flex justify-between text-[8px]">
                                <span className="font-medium text-gray-600">
                                  {skill}
                                </span>
                                <span className="text-gray-400">{status}</span>
                              </div>
                              <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                                <div
                                  className="h-full rounded-full bg-violet-500"
                                  style={{ width: `${width}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-gray-900 p-5 text-white lg:col-span-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm">
                        ✦
                      </div>
                      <h3 className="mt-5 text-sm font-bold">
                        AI recommendation
                      </h3>
                      <p className="mt-2 text-[9px] leading-5 text-gray-400">
                        Strengthen your Next.js and GraphQL knowledge to
                        increase your match score for this role.
                      </p>

                      <button className="mt-6 rounded-lg bg-white px-3 py-2 text-[9px] font-semibold text-gray-900">
                        View skill gaps →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-1 divide-y divide-gray-100 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((stat) => (
            <div key={stat.label} className="px-8 py-8 text-center">
              <div className="text-3xl font-bold tracking-tight text-gray-900">
                {stat.value}
              </div>
              <div className="mt-1 text-xs font-medium text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
              Everything you need
            </div>

            <h2 className="mt-4 text-4xl font-bold tracking-[-0.035em] text-gray-950 sm:text-5xl">
              From resume to
              <br />
              <span className="text-gray-400">career strategy.</span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-500">
              One intelligent workspace to understand your profile, discover
              opportunities and prepare for the interviews that matter.
            </p>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="group bg-white p-7 transition hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-semibold text-gray-300">
                    {feature.number}
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition group-hover:bg-violet-50 group-hover:text-violet-600">
                    {feature.icon}
                  </span>
                </div>

                <h3 className="mt-14 text-base font-bold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-xs leading-6 text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="overflow-hidden bg-[#f7f8fa] py-24 lg:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
              Simple process
            </div>

            <h2 className="mt-4 text-4xl font-bold tracking-[-0.035em] text-gray-950">
              Three steps. One clear answer.
            </h2>
          </div>

          <div className="relative mt-16 grid gap-8 md:grid-cols-3">
            {/* Connecting line */}
            <div className="absolute left-[18%] right-[18%] top-8 hidden h-px bg-gray-200 md:block" />

            {[
              {
                step: "01",
                title: "Upload your resume",
                text: "Give us your existing resume as a PDF and we'll turn it into structured career data.",
              },
              {
                step: "02",
                title: "Add a job",
                text: "Paste the job description you're targeting and we'll extract the key requirements.",
              },
              {
                step: "03",
                title: "Get your strategy",
                text: "See your match score, skill gaps, recommendations and personalized interview questions.",
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-white text-sm font-bold text-gray-900 shadow-sm">
                  {item.step}
                </div>

                <h3 className="mt-7 text-base font-bold text-gray-900">
                  {item.title}
                </h3>

                <p className="mx-auto mt-3 max-w-xs text-xs leading-6 text-gray-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="bg-gray-950 py-24 text-white lg:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl">
            ✦
          </div>

          <h2 className="mt-7 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
            Stop guessing.
            <br />
            Start preparing.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-400">
            Understand where you stand against your target role and get a
            practical path to become a stronger candidate.
          </p>

          <button className="mt-9 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-gray-950 transition hover:-translate-y-0.5 hover:bg-gray-100">
            Analyze my resume →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 px-6 pb-10 text-gray-500">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <div className="text-xs">
            © 2026 PlacementAI. Built for better careers.
          </div>

          <div className="flex gap-6 text-xs">
            <a href="#" className="transition hover:text-white">
              Privacy
            </a>
            <a href="#" className="transition hover:text-white">
              Terms
            </a>
            <a href="#" className="transition hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
