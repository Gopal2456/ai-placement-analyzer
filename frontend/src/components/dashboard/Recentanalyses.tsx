import Link from "next/link";
import type { RecentAnalysis } from "@/types/dashboard";
import { formatRelativeDate, getMatchStatus } from "@/lib/dashboard";

interface RecentAnalysesProps {
  analyses: RecentAnalysis[];
  loading: boolean;
}

const RecentAnalyses = ({ analyses, loading }: RecentAnalysesProps) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
      <h3 className="text-sm font-semibold text-gray-800">Recent analyses</h3>

      <p className="mt-1 text-xs text-gray-400">Your latest job comparisons</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-100">
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-17 animate-pulse border-b border-gray-100 bg-gray-50 last:border-b-0"
            />
          ))}

        {!loading && analyses.length === 0 && (
          <p className="p-6 text-center text-xs text-gray-400">
            No analyses yet.
          </p>
        )}

        {!loading &&
          analyses.map((analysis, index) => {
            const status = getMatchStatus(analysis.score);

            return (
              <Link
                // Adjust this route to match your analysis detail page
                href={`/analysis/${analysis.resumeId}`}
                key={analysis.resumeId}
                className={`flex items-center gap-4 p-4 transition hover:bg-gray-50 ${
                  index !== analyses.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xs font-semibold text-gray-600">
                  {analysis.jobTitle.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-gray-900">
                    {analysis.jobTitle}
                  </p>

                  <p className="mt-1 truncate text-[10px] text-gray-400">
                    {analysis.company} · {formatRelativeDate(analysis.createdAt)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {analysis.score}%
                  </p>

                  <p className="mt-0.5 text-[9px] text-gray-400">
                    {status.label}
                  </p>
                </div>

                <span className="text-gray-300">→</span>
              </Link>
            );
          })}
      </div>
    </section>
  );
};

export default RecentAnalyses;