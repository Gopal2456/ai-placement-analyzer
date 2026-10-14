export const getMatchStatus = (score: number) => {
  if (score >= 80) {
    return { label: "Strong match", badge: "bg-green-50 text-green-600" };
  }
  if (score >= 60) {
    return { label: "Good match", badge: "bg-amber-50 text-amber-600" };
  }
  return { label: "Needs work", badge: "bg-red-50 text-red-600" };
};

export const formatRelativeDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

  const diffDays = Math.round(
    (startOfDay(new Date()) - startOfDay(date)) / 86_400_000,
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
};