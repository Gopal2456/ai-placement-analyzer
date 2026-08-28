"use client";

import { useState } from "react";

const InterviewHome = () => {
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("Mixed");

  const categories = [
    {
      id: "All",
      title: "All questions",
      description: "A balanced interview session",
      icon: "✦",
    },
    {
      id: "Technical",
      title: "Technical",
      description: "Test your technical knowledge",
      icon: "⌘",
    },
    {
      id: "Behavioral",
      title: "Behavioral",
      description: "Practice common HR questions",
      icon: "◉",
    },
    {
      id: "Resume",
      title: "Resume based",
      description: "Questions from your resume",
      icon: "▤",
    },
    {
      id: "Skill Gap",
      title: "Skill gaps",
      description: "Improve your missing skills",
      icon: "↗",
    },
  ];

  const difficulties = ["Easy", "Medium", "Hard", "Mixed"];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 text-gray-900">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-violet-600">
              Interview Practice
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-gray-950">
              Get interview ready.
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Practice role-specific questions generated from your resume,
              target job, and skill gaps.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs text-gray-400">Your progress</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-lg font-bold text-gray-950">68%</span>
              <span className="text-xs font-medium text-emerald-600">
                Interview readiness
              </span>
            </div>
          </div>
        </div>

        {/* Target Role */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-lg font-bold text-violet-600">
                FE
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Preparing for
                </p>

                <h2 className="mt-1 text-base font-semibold text-gray-950">
                  Frontend Developer
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Your latest resume · Latest analysis
                </p>
              </div>
            </div>

            <button
              type="button"
              className="text-left text-sm font-semibold text-violet-600 transition hover:text-violet-700 sm:text-right"
            >
              Change role →
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Configuration */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-950">
                  Build your interview
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Choose what you want to practice.
                </p>
              </div>

              {/* Categories */}
              <div className="grid gap-3 sm:grid-cols-2">
                {categories.map((item) => {
                  const selected = category === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCategory(item.id)}
                      className={`flex items-start gap-4 rounded-xl border p-4 text-left transition ${
                        selected
                          ? "border-violet-300 bg-violet-50"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${
                          selected
                            ? "bg-violet-600 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.icon}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {item.title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Difficulty */}
              <div className="mt-7">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Difficulty
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      How challenging should the questions be?
                    </p>
                  </div>

                  <span className="text-xs font-medium text-violet-600">
                    {difficulty}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {difficulties.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setDifficulty(item)}
                      className={`rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
                        difficulty === item
                          ? "border-violet-300 bg-violet-50 text-violet-700"
                          : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Questions */}
              <div className="mt-7">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Number of questions
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    Choose the length of your practice session.
                  </p>
                </div>

                <div className="flex gap-2">
                  {["5", "10", "15", "20"].map((number, index) => (
                    <button
                      key={number}
                      type="button"
                      className={`rounded-lg border px-5 py-2.5 text-xs font-semibold transition ${
                        index === 1
                          ? "border-violet-300 bg-violet-50 text-violet-700"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start */}
              <button
                type="button"
                className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-950 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition hover:bg-black"
              >
                Start interview
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* AI Generated */}
            <div className="rounded-2xl bg-gray-950 p-6 text-white shadow-lg">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-violet-300">
                ✦
              </div>

              <h3 className="text-lg font-semibold">
                AI-powered practice
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Questions are generated around your target role, resume,
                missing skills, and previous analysis.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs text-gray-400">
                    Questions generated
                  </span>

                  <span className="text-sm font-semibold">42</span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs text-gray-400">
                    Sessions completed
                  </span>

                  <span className="text-sm font-semibold">6</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Average score
                  </span>

                  <span className="text-sm font-semibold text-emerald-400">
                    82%
                  </span>
                </div>
              </div>
            </div>

            {/* What you'll practice */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-950">
                What you'll practice
              </h3>

              <div className="mt-5 space-y-4">
                <PracticeItem
                  title="Technical knowledge"
                  description="Role-specific technical concepts"
                />

                <PracticeItem
                  title="Behavioral questions"
                  description="Communication and workplace situations"
                />

                <PracticeItem
                  title="Resume questions"
                  description="Questions based on your experience"
                />

                <PracticeItem
                  title="Skill gaps"
                  description="Areas identified in your analysis"
                />
              </div>
            </div>

            {/* Previous Session */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Last session</p>

                  <p className="mt-1 text-sm font-semibold text-gray-950">
                    Frontend Interview
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-gray-950">84%</p>

                  <p className="text-[11px] text-emerald-600">
                    Good performance
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="mt-4 w-full rounded-lg bg-gray-50 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                View feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PracticeItem = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-xs font-bold text-violet-600">
        ✓
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-800">{title}</p>

        <p className="mt-1 text-[11px] leading-5 text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
};

export default InterviewHome;