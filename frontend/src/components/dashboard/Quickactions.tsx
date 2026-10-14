import Link from "next/link";

const actions = [
  {
    href: "/resumes",
    icon: "↑",
    title: "Upload resume",
    description: "Add a new resume",
  },
  {
    href: "/recommended-jobs",
    icon: "+",
    title: "Add job",
    description: "Analyze a new position",
  },
  {
    href: "/interview",
    icon: "✦",
    title: "Practice interview",
    description: "Prepare with AI",
  },
  {
    href: "/recommended-jobs",
    icon: "◎",
    title: "Find jobs for me",
    description: "Discover matching jobs",
  },
];

const QuickActions = () => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-800">Quick actions</h3>

      <p className="mt-1 text-xs text-gray-400">Continue where you left off</p>

      <div className="mt-6 space-y-3">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="group flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:border-violet-200 hover:bg-violet-50/50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-sm text-violet-600">
              {action.icon}
            </div>

            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-800">
                {action.title}
              </p>

              <p className="mt-0.5 text-[9px] text-gray-400">
                {action.description}
              </p>
            </div>

            <span className="text-gray-300 transition group-hover:translate-x-1">
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;