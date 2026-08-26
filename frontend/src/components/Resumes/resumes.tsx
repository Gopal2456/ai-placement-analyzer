"use client";

import Link from "next/link";
import { useState } from "react";

const resumes = [
  {
    id: "1",
    name: "Gopal_Mahajan_Resume.pdf",
    role: "Frontend Developer",
    size: "1.8 MB",
    uploaded: "Today",
    skills: 18,
    experience: "2+ years",
    status: "Ready",
    primary: true,
  },
  {
    id: "2",
    name: "Gopal_FullStack_Resume.pdf",
    role: "Full Stack Developer",
    size: "2.1 MB",
    uploaded: "Aug 18, 2026",
    skills: 22,
    experience: "2+ years",
    status: "Ready",
    primary: false,
  },
];

const Resumes = () => {
  const [selectedResume, setSelectedResume] = useState("1");

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-600">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
              Resume Manager
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-gray-950">
              My Resumes
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your resumes and keep your career profile up to date.
            </p>
          </div>

          <Link
            href="/resumes/upload"
            className="group flex h-11 items-center gap-2 rounded-xl bg-gray-950 px-5 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition hover:-translate-y-0.5 hover:bg-black"
          >
            <span className="text-lg leading-none">+</span>
            Upload resume
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-950">2</p>
                <p className="mt-1 text-xs text-gray-400">
                  Total resumes
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                □
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-950">18</p>
                <p className="mt-1 text-xs text-gray-400">
                  Skills extracted
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                ◇
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-950">87%</p>
                <p className="mt-1 text-xs text-gray-400">
                  Best job match
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                ✓
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          {/* Resume list */}
          <section className="xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-gray-950">
                  Your resumes
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Select a resume to view its profile.
                </p>
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1.5 text-[10px] font-semibold text-gray-500">
                {resumes.length} files
              </span>
            </div>

            <div className="space-y-3">
              {resumes.map((resume) => {
                const active = selectedResume === resume.id;

                return (
                  <button
                    key={resume.id}
                    type="button"
                    onClick={() => setSelectedResume(resume.id)}
                    className={`w-full rounded-2xl border bg-white p-5 text-left transition ${
                      active
                        ? "border-violet-300 ring-2 ring-violet-500/10"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* PDF icon */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xs font-bold text-red-500">
                        PDF
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="truncate text-sm font-bold text-gray-900">
                                {resume.name}
                              </h3>

                              {resume.primary && (
                                <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[8px] font-bold text-violet-600">
                                  PRIMARY
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-xs text-gray-400">
                              {resume.role}
                            </p>
                          </div>

                          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[9px] font-semibold text-green-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            {resume.status}
                          </span>
                        </div>

                        <div className="mt-5 grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
                          <div>
                            <p className="text-[9px] uppercase tracking-wider text-gray-400">
                              Skills
                            </p>
                            <p className="mt-1 text-xs font-semibold text-gray-800">
                              {resume.skills}
                            </p>
                          </div>

                          <div>
                            <p className="text-[9px] uppercase tracking-wider text-gray-400">
                              Experience
                            </p>
                            <p className="mt-1 text-xs font-semibold text-gray-800">
                              {resume.experience}
                            </p>
                          </div>

                          <div>
                            <p className="text-[9px] uppercase tracking-wider text-gray-400">
                              Uploaded
                            </p>
                            <p className="mt-1 text-xs font-semibold text-gray-800">
                              {resume.uploaded}
                            </p>
                          </div>
                        </div>
                      </div>

                      <span className="hidden text-gray-300 sm:block">
                        →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Upload area */}
            <Link
              href="/resumes/upload"
              className="mt-4 flex min-h-37.5 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-6 text-center transition hover:border-violet-300 hover:bg-violet-50/30"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-lg text-violet-600">
                ↑
              </div>

              <h3 className="mt-3 text-sm font-bold text-gray-800">
                Upload another resume
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                PDF files up to 10 MB
              </p>
            </Link>
          </section>

          {/* Resume preview */}
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 xl:sticky xl:top-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-violet-600">
                  Resume profile
                </p>

                <h2 className="mt-1 text-sm font-bold text-gray-950">
                  Gopal Mahajan
                </h2>
              </div>

              <button
                type="button"
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-[10px] font-semibold text-gray-500 hover:bg-gray-50"
              >
                Edit
              </button>
            </div>

            {/* Profile readiness */}
            <div className="mt-6 rounded-xl bg-gray-950 p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-gray-500">
                    Profile readiness
                  </p>

                  <p className="mt-1 text-2xl font-bold">82%</p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-violet-500/30 border-t-violet-500 text-[10px] font-bold">
                  82
                </div>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[82%] rounded-full bg-violet-500" />
              </div>

              <p className="mt-3 text-[9px] leading-4 text-gray-500">
                Your resume is in good shape. Improve a few skills to increase
                your job match potential.
              </p>
            </div>

            {/* Extracted skills */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-900">
                  Extracted skills
                </h3>

                <span className="text-[9px] text-gray-400">
                  18 skills
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  "React",
                  "Next.js",
                  "TypeScript",
                  "JavaScript",
                  "Node.js",
                  "MongoDB",
                  "Express",
                  "Tailwind CSS",
                  "Git",
                  "REST API",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1.5 text-[9px] font-medium text-gray-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume info */}
            <div className="mt-6 border-t border-gray-100 pt-5">
              <h3 className="text-xs font-bold text-gray-900">
                Resume details
              </h3>

              <div className="mt-3 space-y-3">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">File</span>
                  <span className="max-w-42.5 truncate font-medium text-gray-700">
                    Gopal_Mahajan_Resume.pdf
                  </span>
                </div>

                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">Size</span>
                  <span className="font-medium text-gray-700">
                    1.8 MB
                  </span>
                </div>

                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">Experience</span>
                  <span className="font-medium text-gray-700">
                    2+ years
                  </span>
                </div>

                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">Status</span>
                  <span className="font-semibold text-green-600">
                    Processed
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 grid grid-cols-2 gap-2">
              <Link
                href="/analysis/new"
                className="flex h-10 items-center justify-center rounded-lg bg-gray-950 text-[10px] font-semibold text-white transition hover:bg-black"
              >
                Analyze resume
              </Link>

              <button
                type="button"
                className="flex h-10 items-center justify-center rounded-lg border border-gray-200 text-[10px] font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Download
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Resumes;