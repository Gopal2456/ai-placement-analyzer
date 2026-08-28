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
    <main className="min-h-screen bg-white text-gray-900">
      <div className="flex min-h-screen flex-col">
        {/* Logo */}
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full border-gray-200 shadow-xl rounded-2xl p-9 max-w-lg">
            {/* Heading */}
            <div className="mb-8 text-center">
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full text-white">
                  <img
                    src="/Logo.png"
                    alt="Logo"
                    className="h-8 w-8 object-contain"
                  />
                </div>

                <div>
                  <div className="text-[17px] text-left font-bold tracking-tight">
                    Placement<span className="text-violet-600"> AI</span>
                  </div>

                  <div className="text-[12px] font-medium uppercase tracking-wider text-gray-400">
                    Career Intelligence
                  </div>
                </div>
              </Link>
              {/* <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Welcome back
              </h1> */}

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

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                />
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
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 pr-16 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
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
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gray-950 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition hover:bg-black"
              >
                Sign in
                <span>→</span>
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
      </div>
    </main>
  );
};

export default LoginPage;
