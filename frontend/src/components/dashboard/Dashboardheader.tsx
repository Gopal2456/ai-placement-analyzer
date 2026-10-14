"use client";

import { useMemo } from "react";

interface DashboardHeaderProps {
  name?: string;
}

const DashboardHeader = ({ name }: DashboardHeaderProps) => {
  const { date, greeting } = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();

    return {
      date: now.toLocaleDateString("en-IN", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      greeting:
        hour < 12
          ? "Good morning"
          : hour < 17
            ? "Good afternoon"
            : "Good evening",
    };
  }, []);

  const words = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  const firstName = words[0] || "User";
  const initials =
    words
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <header className="border-gray-200 bg-white">
      <div className="flex h-20 items-center justify-between px-6 lg:px-8">
        <div>
          <p className="text-xs font-medium text-gray-400">{date}</p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-800">
            {greeting}, {firstName} 👋
          </h1>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-blue-500 text-sm font-medium text-white shadow-sm"
        >
          {initials}
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;