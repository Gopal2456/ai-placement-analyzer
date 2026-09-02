"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Connect this to your Node.js register API later
    console.log("Signup submitted");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4  text-gray-900 sm:px-6">
      <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center">
        <div className="w-full rounded-3xl bg-white px-6 py-6 shadow-xl shadow-gray-200/60 sm:px-10 sm:py-6">
          {/* Logo */}
          <div className="mb-4 flex justify-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full text-white">
                <img
                  src="/Logo.png"
                  alt="Logo"
                  className="h-8 w-8 object-contain"
                />
              </div>

              <div>
                <div className="text-left text-[15px] font-bold tracking-tight text-gray-950">
                  Placement
                  <span className="text-violet-600"> AI</span>
                </div>

                <div className="text-left text-[9px] font-medium uppercase tracking-wider text-gray-400">
                  Career Intelligence
                </div>
              </div>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
              Create your account
            </h1>

            <p className=" text-sm leading-6 text-gray-500">
              Start analyzing your career potential with PlacementAI.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Gopal Mahajan"
                autoComplete="name"
                required
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 pr-16 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Use at least 8 characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Confirm password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 pr-16 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="group flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gray-950 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition hover:bg-black"
            >
              Create account
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </form>

          {/* Divider */}
          {/* <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />

            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
              or
            </span>

            <div className="h-px flex-1 bg-gray-200" />
          </div> */}

          {/* Google */}
          {/* <button
            type="button"
            className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
          >
            <span className="text-base font-bold">G</span>
            Sign up with Google
          </button> */}

          {/* Login */}
          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-violet-600 transition hover:text-violet-700"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
};

export default Signup;
