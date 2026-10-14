import type { LatestAnalysis } from "@/types/dashboard";
import { getMatchStatus } from "@/lib/dashboard";

interface LatestAnalysisCardProps {
  analysis: LatestAnalysis | null;
  loading: boolean;
}

interface SkillChipsProps {
  title: string;
  skills: string[];
  chipClass: string;
  emptyText: string;
}

const SkillChips = ({ title, skills, chipClass, emptyText }: SkillChipsProps) => (
  <div>
    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
      {title}
    </p>

    {skills.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className={`rounded-lg border px-2.5 py-1 text-[10px] font-medium ${chipClass}`}
          >
            {skill}
          </span>
        ))}
      </div>
    ) : (
      <p className="text-[11px] text-gray-400">{emptyText}</p>
    )}
  </div>
);

const LatestAnalysisCard = ({ analysis, loading }: LatestAnalysisCardProps) => {
  if (loading) {
    return (
      <section className="flex min-h-72 items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-3">
        <div className="h-24 w-24 animate-pulse rounded-full bg-gray-100" />
      </section>
    );
  }

  if (!analysis) {
    return (
      <section className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm xl:col-span-3">
        <h3 className="text-sm font-semibold text-gray-800">No analysis yet</h3>
        <p className="mt-1 text-xs text-gray-400">
          Analyze a resume against a job to see your results here.
        </p>
      </section>
    );
  }

  const status = getMatchStatus(analysis.score);
  const score = Math.max(0, Math.min(100, analysis.score));

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-800">Latest analysis</h3>

        <span
          className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${status.badge}`}
        >
          {status.label}
        </span>
      </div>

      <p className="mt-1 text-xs text-gray-400">
        {analysis.jobTitle}
        {analysis.company ? ` · ${analysis.company}` : ""}
      </p>

      <div className="mt-8 grid items-center gap-8 md:grid-cols-[180px_1fr]">
        {/* Match score ring (fills according to the real score) */}
        <div className="flex justify-center">
          <div
            className="flex h-36 w-36 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(#7c3aed ${score * 3.6}deg, #ede9fe 0deg)`,
            }}
          >
            <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white">
              <p className="text-4xl font-semibold tracking-tighter text-gray-800">
                {analysis.score}
              </p>
              <p className="mt-1 text-[9px] font-medium tracking-[0.12em] text-gray-400">
                MATCH
              </p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-5">
          <SkillChips
            title="Matched skills"
            skills={analysis.matchedSkills}
            chipClass="border-green-100 bg-green-50 text-green-700"
            emptyText="No matched skills found."
          />

          <SkillChips
            title="Missing skills"
            skills={analysis.missingSkills}
            chipClass="border-red-100 bg-red-50 text-red-600"
            emptyText="No missing skills. You cover everything this job asks for."
          />
        </div>
      </div>
    </section>
  );
};

export default LatestAnalysisCard;