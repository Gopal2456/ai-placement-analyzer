"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Connect this to your Node.js register API later
    console.log("Signup submitted");
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-900">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left - Visual */}
        <section className="relative hidden overflow-hidden bg-gray-950 lg:flex">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute left-[-10%] top-[8%] h-96 w-96 rounded-full bg-violet-600/20 blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-blue-600/20 blur-[100px]" />

            <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)]" />
          </div>

          <div className="relative flex w-full items-center justify-center px-10">
            <div className="w-full max-w-xl">
              {/* Label */}
              <div className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                Your career, understood
              </div>

              {/* Heading */}
              <h2 className="text-5xl font-bold leading-[1.05] tracking-[-0.045em] text-white">
                Build a stronger
                <br />
                profile with <span className="text-violet-400">AI.</span>
              </h2>

              <p className="mt-6 max-w-md text-sm leading-7 text-gray-400">
                PlacementAI analyzes your skills against real job requirements
                so you know exactly what to improve.
              </p>

              {/* Feature cards */}
              <div className="mt-12 space-y-3">
                {[
                  {
                    icon: "◎",
                    title: "Know your match score",
                    text: "See exactly how closely your profile matches a role.",
                  },
                  {
                    icon: "◇",
                    title: "Find your skill gaps",
                    text: "Discover which skills could improve your chances.",
                  },
                  {
                    icon: "✦",
                    title: "Prepare with AI",
                    text: "Practice personalized interview questions.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition hover:bg-white/8"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                      {item.icon}
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold text-white">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-[10px] leading-5 text-gray-500">
                        {item.text}
                      </p>
                    </div>

                    <span className="ml-auto text-gray-600 transition group-hover:translate-x-1 group-hover:text-gray-400">
                      →
                    </span>
                  </div>
                ))}
              </div>

              {/* Mini dashboard */}
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/4 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-gray-500">
                      Profile readiness
                    </p>

                    <p className="mt-1 text-xl font-bold text-white">82%</p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-violet-500/30 border-t-violet-500 text-[9px] font-bold text-white">
                    82
                  </div>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[82%] rounded-full bg-violet-500" />
                </div>

                <div className="mt-3 flex justify-between text-[9px] text-gray-500">
                  <span>Current profile</span>
                  <span>Target: 100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer mark */}
          <div className="absolute bottom-8 right-8 text-[10px] font-medium tracking-widest text-white/20">
            PLACEMENT AI · 2026
          </div>
        </section>

        {/* Right - Signup */}
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

          {/* Signup Form */}
          <div className="flex flex-1 items-center justify-center px-6 py-8">
            <div className="w-full max-w-md">
              {/* Heading */}
              <div className="mb-7">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  ✦
                </div>

                <h1 className="text-3xl font-bold tracking-[-0.035em] text-gray-950 sm:text-4xl">
                  Create your account
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Start analyzing your career potential with PlacementAI.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-xs font-semibold text-gray-700"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      ◯
                    </span>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Gopal Mahajan"
                      autoComplete="name"
                      required
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                    />
                  </div>
                </div>

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
                      autoComplete="email"
                      required
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-semibold text-gray-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      ●
                    </span>

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-16 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <p className="mt-2 text-[10px] text-gray-400">
                    Use at least 8 characters.
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-xs font-semibold text-gray-700"
                  >
                    Confirm password
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      ●
                    </span>

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-16 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-violet-600"
                  />

                  <label
                    htmlFor="terms"
                    className="text-[11px] leading-5 text-gray-500"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="font-semibold text-gray-700 hover:text-violet-600"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="font-semibold text-gray-700 hover:text-violet-600"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-950 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition hover:-translate-y-0.5 hover:bg-black"
                >
                  Create account
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" />

                <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                  or
                </span>

                <div className="h-px flex-1 bg-gray-200" />
              </div>

              {/* Google */}
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              >
                <span className="text-base font-bold">G</span>
                Sign up with Google
              </button>

              {/* Login */}
              <p className="mt-7 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-violet-600 transition hover:text-violet-700"
                >
                  Sign in
                </Link>
              </p>

              {/* Security */}
              <div className="mt-7 flex items-center justify-center gap-2 text-[10px] text-gray-400">
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

export default SignupPage;
