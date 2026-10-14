import type { Recommendation } from "@/types/dashboard";

interface AiRecommendationCardProps {
  recommendation: Recommendation | null;
  loading: boolean;
}

const AiRecommendationCard = ({
  recommendation,
  loading,
}: AiRecommendationCardProps) => {
  const skills = recommendation?.prioritySkills ?? [];
  const maxOccurrences = Math.max(1, ...skills.map((s) => s.occurrences));

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gray-950 p-6 text-white shadow-sm xl:col-span-2">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-600/20 blur-3xl" />

      <div className="relative">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg">
          ✦
        </div>

        <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-300">
          AI insight
        </p>

        <h3 className="mt-2 text-xl font-semibold tracking-tight">
          AI recommendation
        </h3>

        {loading ? (
          <div className="mt-4 space-y-2">
            <div className="h-3 w-3/4 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-white/10" />
          </div>
        ) : (
          <p className="mt-4 max-w-sm text-xs leading-6 text-gray-400">
            {recommendation?.message ||
              "Analyze a few jobs to get personalized skill recommendations."}
          </p>
        )}

        {/* Priority skills */}
        {skills.length > 0 && (
          <div className="mt-7 space-y-3">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-500">
              Priority skills
            </p>

            {skills.map((item) => (
              <div key={item.skill}>
                <div className="mb-1.5 flex justify-between text-[9px]">
                  <span className="text-gray-400">{item.skill}</span>
                  <span className="text-violet-300">
                    {item.occurrences}× missing
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-violet-500 transition-all duration-700"
                    style={{
                      width: `${(item.occurrences / maxOccurrences) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Suggestions (the API currently returns an empty array) */}
        {recommendation && recommendation.suggestions.length > 0 && (
          <ul className="mt-6 space-y-2">
            {recommendation.suggestions.map((suggestion, index) => (
              <li key={index} className="text-[11px] leading-5 text-gray-300">
                • {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default AiRecommendationCard;