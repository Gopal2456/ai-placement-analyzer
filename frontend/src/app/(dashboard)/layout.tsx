"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "▦",
  },
  {
    label: "My Resumes",
    href: "/resumes",
    icon: "□",
  },
  {
    label: "Job Matches",
    href: "/recommended-jobs",
    icon: "⌁",
  },
  {
    label: "Interviews",
    href: "/interview",
    icon: "◌",
  },
];

const secondaryNavigation = [
  {
    label: "Settings",
    href: "/settings",
    icon: "⚙",
  },
];

const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-50 hidden w-61 border-r border-gray-100 bg-white lg:flex lg:flex-col">
          {/* Logo */}
          <div className="flex h-20 shrink-0 items-center border-gray-100 px-7">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-950 text-white shadow-sm">
                <span className="text-lg font-bold">A</span>
              </div>

              <div>
                <p className="text-[15px] font-bold tracking-tight text-gray-950">
                  Placement<span className="text-violet-600">AI</span>
                </p>

                <p className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.18em] text-gray-400">
                  Career Intelligence
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex flex-1 flex-col px-4 py-6">
            <div>
              <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-gray-400">
                Workspace
              </p>

              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`group flex h-11 items-center gap-3 rounded-xl px-3 text-xs font-medium transition-all ${
                        isActive
                          ? "bg-gray-950 text-white shadow-sm"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm ${
                          isActive
                            ? "bg-white/10 text-violet-300"
                            : "text-gray-400 group-hover:text-violet-600"
                        }`}
                      >
                        {item.icon}
                      </span>

                      <span>{item.label}</span>

                      {item.label === "Job Matches" && (
                        <span
                          className={`ml-auto rounded-full px-2 py-0.5 text-[8px] font-bold ${
                            isActive
                              ? "bg-violet-500/20 text-violet-200"
                              : "bg-violet-50 text-violet-600"
                          }`}
                        >
                          AI
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* New Analysis Card */}
            {/* <div className="mt-8 rounded-2xl bg-gray-950 p-4 text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm text-violet-300">
                ✦
              </div>

              <p className="mt-4 text-xs font-bold">
                Analyze a new job
              </p>

              <p className="mt-1 text-[9px] leading-4 text-gray-500">
                Compare your resume with a job description.
              </p>

              <Link
                href="/analysis/new"
                className="mt-4 flex h-9 items-center justify-center rounded-lg bg-white text-[10px] font-bold text-gray-950 transition hover:bg-gray-100"
              >
                Start analysis →
              </Link>
            </div> */}

            {/* Bottom navigation */}
            <div className="mt-auto">
              <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-gray-400">
                Account
              </p>

              <nav className="space-y-1">
                {secondaryNavigation.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`group flex h-11 items-center gap-3 rounded-xl px-3 text-xs font-medium transition ${
                        isActive
                          ? "bg-gray-950 text-white"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          isActive
                            ? "text-violet-300"
                            : "text-gray-400 group-hover:text-violet-600"
                        }`}
                      >
                        {item.icon}
                      </span>

                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* User */}
              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3 rounded-xl p-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-blue-500 text-xs font-bold text-white">
                    G
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-bold text-gray-900">
                      Gopal
                    </p>

                    <p className="truncate text-[9px] text-gray-400">
                      Career Explorer
                    </p>
                  </div>

                  <button
                    type="button"
                    className="text-gray-400 transition hover:text-gray-900"
                  >
                    •••
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1 lg:pl-61">
          {/* Mobile header */}
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-5 backdrop-blur-lg lg:hidden">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-950 text-sm font-bold text-white">
                A
              </div>

              <span className="text-sm font-bold">
                Placement<span className="text-violet-600">AI</span>
              </span>
            </Link>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600"
            >
              ☰
            </button>
          </header>

          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;