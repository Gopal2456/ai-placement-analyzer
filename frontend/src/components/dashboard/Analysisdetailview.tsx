import Link from "next/link";
import { ArrowLeft, Check, X } from "lucide-react";
import type { AnalysisDetail, AnalysisJobInfo } from "@/types/Analysis";
import { getMatchStatus } from "@/lib/dashboard";

interface AnalysisDetailViewProps {
  analysis: AnalysisDetail;
  job: AnalysisJobInfo | null;
  onBack: () => void;
}

const SkillPanel = ({
  title,
  skills,
  badgeClass,
  chipClass,
  emptyText,
}: {
  title: string;
  skills: string[];
  badgeClass: string;
  chipClass: string;
  emptyText: string;
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6">
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>

      <span
        className={`rounded-full px-3 py-1 text-[10px] font-semibold ${badgeClass}`}
      >
        {skills.length} {skills.length === 1 ? "skill" : "skills"}
      </span>
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      {skills.length > 0 ? (
        skills.map((skill) => (
          <span
            key={skill}
            className={`rounded-lg border px-3 py-2 text-xs font-medium ${chipClass}`}
          >
            {skill}
          </span>
        ))
      ) : (
        <p className="text-xs text-gray-400">{emptyText}</p>
      )}
    </div>
  </div>
);

const InsightList = ({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "good" | "bad";
}) => {
  const isGood = tone === "good";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>

      <div className="mt-4 space-y-3">
        {items.length === 0 && (
          <p className="text-xs text-gray-400">Nothing to show.</p>
        )}

        {items.map((item, index) => (
          <div
            key={index}
            className={`flex gap-3 rounded-xl p-4 ${
              isGood ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                isGood
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-500"
              }`}
            >
              {isGood ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            </span>

            <p className="text-xs leading-5 text-gray-700">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnalysisDetailView = ({
  analysis,
  job,
  onBack,
}: AnalysisDetailViewProps) => {
  const status = getMatchStatus(analysis.matchScore);
  const score = Math.max(0, Math.min(100, analysis.matchScore));

  const analyzedOn = new Date(analysis.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-600">
          Analysis report
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-800">
          {job?.title || "Job match analysis"}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {job?.company ? `${job.company} · ` : ""}Analyzed on {analyzedOn}
        </p>

        {/* Score hero */}
        <section className="relative mt-6 overflow-hidden rounded-2xl bg-gray-950 p-6 text-white md:p-8">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet-600/20 blur-3xl" />

          <div className="relative grid items-center gap-8 md:grid-cols-[160px_1fr]">
            <div className="flex justify-center">
              <div
                className="flex h-36 w-36 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#8b5cf6 ${score * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
                }}
              >
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-gray-950">
                  <p className="text-4xl font-semibold tracking-tighter">
                    {analysis.matchScore}
                    <span className="text-lg text-gray-400">%</span>
                  </p>
                  <p className="mt-1 text-[9px] font-medium tracking-[0.12em] text-gray-400">
                    MATCH
                  </p>
                </div>
              </div>
            </div>

            <div>
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-semibold ${status.badge}`}
              >
                {status.label}
              </span>

              <h2 className="mt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-300">
                AI summary
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-300">
                {analysis.summary}
              </p>
            </div>
          </div>
        </section>

        {/* Skills */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <SkillPanel
            title="Matched skills"
            skills={analysis.matchedSkills ?? []}
            badgeClass="bg-green-50 text-green-600"
            chipClass="border-green-100 bg-green-50 text-green-700"
            emptyText="No matched skills found."
          />

          <SkillPanel
            title="Missing skills"
            skills={analysis.missingSkills ?? []}
            badgeClass="bg-red-50 text-red-600"
            chipClass="border-red-100 bg-red-50 text-red-600"
            emptyText="No missing skills. You cover everything this job asks for."
          />
        </div>

        {/* Strengths / weaknesses */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <InsightList
            title="Strengths"
            items={analysis.strengths ?? []}
            tone="good"
          />
          <InsightList
            title="Weaknesses"
            items={analysis.weaknesses ?? []}
            tone="bad"
          />
        </div>

        {/* Recommendations */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-gray-900">
            Recommendations
          </h2>

          <div className="mt-4 space-y-3">
            {(analysis.recommendations ?? []).map((recommendation, index) => (
              <div key={index} className="flex gap-3 rounded-xl bg-gray-50 p-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-600">
                  {index + 1}
                </span>

                <p className="text-xs leading-5 text-gray-700">
                  {recommendation}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Next steps */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/interview"
            className="flex h-11 items-center justify-center rounded-xl bg-gray-950 text-sm font-semibold text-white transition hover:bg-black"
          >
            Practice interview
          </Link>

          <Link
            href="/recommended-jobs"
            className="flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Analyze another job
          </Link>
        </div>
      </div>
    </main>
  );
};

export default AnalysisDetailView;