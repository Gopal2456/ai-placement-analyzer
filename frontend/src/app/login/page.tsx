"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Connect this to your Node.js login API later
    console.log("Login submitted");
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-900">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left - Visual */}
        <section className="relative hidden overflow-hidden bg-gray-950 lg:flex">
          {/* Background */}
          <div className="absolute inset-0">
            <div className="absolute left-[-10%] top-[10%] h-96 w-96 rounded-full bg-violet-600/20 blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-blue-600/20 blur-[100px]" />

            <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)]" />
          </div>

          <div className="relative flex w-full items-center justify-center px-10">
            <div className="w-full max-w-xl">
              {/* Label */}
              <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                AI Career Intelligence
              </div>

              {/* Heading */}
              <h2 className="text-5xl font-bold leading-[1.05] tracking-[-0.045em] text-white">
                Turn your resume
                <br />
                into a <span className="text-violet-400">career strategy.</span>
              </h2>

              <p className="mt-6 max-w-md text-sm leading-7 text-gray-400">
                Understand your job fit, identify skill gaps and prepare smarter
                for your next interview.
              </p>

              {/* Analysis card */}
              <div className="mt-12 rounded-2xl border border-white/10 bg-white/6 p-5 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Latest Job Analysis
                    </div>
                    <div className="mt-1 text-[10px] text-gray-500">
                      Frontend Developer
                    </div>
                  </div>

                  <span className="rounded-full bg-green-400/10 px-3 py-1.5 text-[9px] font-semibold text-green-400">
                    Strong match
                  </span>
                </div>

                <div className="mt-7 flex items-center gap-7">
                  {/* Score */}
                  <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[9px] border-violet-500/20">
                    <div className="absolute -inset-2.25 rounded-full border-[9px] border-violet-500 border-b-transparent border-l-transparent rotate-[-40deg]" />

                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">87</div>
                      <div className="text-[8px] font-medium tracking-wider text-gray-500">
                        MATCH
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex-1 space-y-4">
                    {[
                      ["React", "95%"],
                      ["TypeScript", "88%"],
                      ["Node.js", "82%"],
                      ["Next.js", "55%"],
                    ].map(([skill, score]) => (
                      <div key={skill}>
                        <div className="mb-1.5 flex justify-between">
                          <span className="text-[9px] text-gray-300">
                            {skill}
                          </span>
                          <span className="text-[9px] text-gray-500">
                            {score}
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-violet-500"
                            style={{ width: score }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-sm text-violet-300">
                      ✦
                    </div>

                    <div>
                      <div className="text-[10px] font-semibold text-white">
                        AI Recommendation
                      </div>

                      <p className="mt-1 text-[9px] leading-5 text-gray-500">
                        Strengthen your Next.js knowledge to improve your match
                        for this role.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom stats */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  ["87%", "Match score"],
                  ["8", "Skill gaps"],
                  ["12", "Questions"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/10 bg-white/4 p-4"
                  >
                    <div className="text-lg font-bold text-white">{value}</div>
                    <div className="mt-1 text-[9px] text-gray-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative corner */}
          <div className="absolute bottom-8 right-8 text-[10px] font-medium tracking-widest text-white/20">
            PLACEMENT AI · 2026
          </div>
        </section>

        {/* Right - Login */}
        <section className="flex min-h-screen flex-col">
          {/* Logo */}
          <div className="px-6 py-7 sm:px-10 lg:px-14">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-950 text-white shadow-sm">
                <span className="text-lg font-bold">A</span>
              </div>

              <div>
                <div className="text-[15px] font-bold tracking-tight">
                  Placement<span className="text-violet-600">AI</span>
                </div>

                <div className="text-[9px] font-medium uppercase tracking-[0.18em] text-gray-400">
                  Career Intelligence
                </div>
              </div>
            </Link>
          </div>

          {/* Login Form */}
          <div className="flex flex-1 items-center justify-center px-6 py-10">
            <div className="w-full max-w-md">
              {/* Heading */}
              <div className="mb-8">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  ✦
                </div>

                <h1 className="text-3xl font-bold tracking-[-0.035em] text-gray-950 sm:text-4xl">
                  Welcome back
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Sign in to continue your career journey with PlacementAI.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-semibold text-gray-700"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      @
                    </span>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold text-gray-700"
                    >
                      Password
                    </label>

                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-violet-600 transition hover:text-violet-700"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      ●
                    </span>

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Remember */}
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 accent-violet-600"
                  />

                  <label htmlFor="remember" className="text-xs text-gray-500">
                    Keep me signed in
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-950 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition hover:-translate-y-0.5 hover:bg-black"
                >
                  Sign in
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </form>

              {/* Divider */}
              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                  or continue with
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Google */}
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              >
                <span className="text-base font-bold">G</span>
                Continue with Google
              </button>

              {/* Register */}
              <p className="mt-8 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-violet-600 transition hover:text-violet-700"
                >
                  Create account
                </Link>
              </p>

              {/* Security */}
              <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-gray-400">
                <span>🔒</span>
                Your information is securely encrypted
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
