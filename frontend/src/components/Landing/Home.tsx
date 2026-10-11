"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  FileUser,
  SearchCheck,
  BookOpenCheck,
  Percent,
  ListChecks,
  Sparkles,
  TrendingUp,
  Target,
} from "lucide-react";

/* ---------- data ---------- */
const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#about", label: "About" },
];

const features = [
  {
    number: "01",
    title: "Resume Analysis",
    icon: <SearchCheck size={18} />,
    description:
      "Upload your resume and let AI extract your skills, experience, education and projects.",
  },
  {
    number: "02",
    title: "Job Match Score",
    icon: <Percent size={18} />,
    description:
      "Compare your resume with any job description and get a clear, deterministic match score.",
  },
  {
    number: "03",
    title: "Skill Gap Analysis",
    icon: <ListChecks size={18} />,
    description:
      "Discover the skills you're missing and get practical recommendations to improve your profile.",
  },
  {
    number: "04",
    title: "Interview Practice",
    icon: <Sparkles size={18} />,
    description:
      "Generate technical, behavioral and resume-based interview questions tailored to your target role.",
  },
];

const stats = [
  { value: 87, suffix: "%", label: "Average Match Score" },
  { value: 24, suffix: "+", label: "Skills Identified" },
  { value: 10, suffix: "k+", label: "Jobs Analyzed" },
];

const steps = [
  {
    step: "01",
    title: "Upload your resume",
    text: "Give us your existing resume as a PDF and we'll turn it into structured career data.",
  },
  {
    step: "02",
    title: "Add a job",
    text: "Paste the job description you're targeting and we'll extract the key requirements.",
  },
  {
    step: "03",
    title: "Get your strategy",
    text: "See your match score, skill gaps, recommendations and personalized interview questions.",
  },
];

const skills: [string, string, number][] = [
  ["React", "Excellent", 95],
  ["TypeScript", "Strong", 88],
  ["Node.js", "Strong", 82],
  ["Next.js", "Needs work", 55],
];

/* ---------- hooks & helpers ---------- */
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const [node, setNode] = useState<T | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (!node) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [node, threshold]);

  return [setNode, seen] as const;
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  // const { ref, seen } = useInView<HTMLDivElement>(0.15);
  const [watch, seen] = useInView<HTMLDivElement>(0.15);
  return (
    <div
      ref={watch}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  // const { ref, seen } = useInView<HTMLSpanElement>(0.5);
  const [watch, seen] = useInView<HTMLSpanElement>(0.5);

  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / 1400, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return (
    <span ref={watch}>
      {n}
      {suffix}
    </span>
  );
}

const now = new Date();

const date = now.toLocaleDateString("en-IN", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

const hour = now.getHours();

const greeting =
  hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

const navLink =
  "relative text-sm font-medium text-gray-500 transition hover:text-gray-900 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-violet-600 after:transition-all hover:after:w-full";

/* ---------- page ---------- */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const { isAuthenticated, loading } = useAuth();
  const preview = useInView<HTMLDivElement>(0.3);
  const [watchPreview, previewSeen] = useInView<HTMLDivElement>(0.3);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setScrolled(h.scrollTop > 8);
      setProgress((h.scrollTop / (h.scrollHeight - h.clientHeight || 1)) * 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading) return null;

  const ctaHref = isAuthenticated ? "/resumes" : "/login";
  const circumference = 2 * Math.PI * 48;

  return (
    <main className="min-h-screen scroll-smooth bg-[#f7f8fa] text-[#111827]">
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-14px) } }
        @keyframes drift { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(24px,-18px) scale(1.08) } }
        @keyframes rise { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: none } }
        @keyframes shine { to { background-position: 200% center } }
        .rise { opacity: 0; animation: rise .8s cubic-bezier(.2,.7,.2,1) forwards }
        .shine { background-size: 200% auto; animation: shine 6s linear infinite }
        @media (prefers-reduced-motion: reduce) {
          .rise { opacity: 1; animation: none }
          .shine, [class*="animate-"] { animation: none !important }
        }
      `}</style>

      {/* Scroll progress */}
      <div
        className="fixed left-0 top-16 z-60 h-0.5 bg-linear-to-r from-violet-600 to-blue-600"
        style={{ width: `${progress}%` }}
      />

      {/* Navigation */}
      <nav
        className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${scrolled ? "border-black/10 bg-[#f7f8fa]/95 shadow-sm" : "border-black/5 bg-[#f7f8fa]/80"}`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 lg:px-8 ${scrolled ? "h-16" : "h-16"}`}
        >
          <a href="#" className="group flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
              <Image
                src="/Logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            </div>
            <div>
              <div className="text-[15px] font-bold tracking-tight">
                Placement <span className="text-violet-600">AI</span>
              </div>
              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-400">
                Career Intelligence
              </div>
            </div>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className={navLink}>
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-white hover:text-gray-900"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl bg-[#111827] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition hover:-translate-y-0.5 hover:bg-black hover:shadow-xl"
                >
                  Get started
                </Link>
              </>
            ) : (
              <Link
                href="/dashboard"
                className="rounded-xl bg-[#141f35] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition hover:-translate-y-0.5 hover:bg-black"
              >
                Go to dashboard
              </Link>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-black/10 bg-white p-2 md:hidden"
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-5 bg-gray-700 transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 bg-gray-700 transition ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 bg-gray-700 transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>

        {/* Backdrop */}
        <div
          onClick={() => setMenuOpen(false)}
          className={`fixed inset-0 z-40 bg-gray-900/30 backdrop-blur-sm transition-opacity duration-300 md:hidden ${menuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        />

        {/* Slide-in panel */}
        <div
          className={`fixed inset-y-0 right-0 z-50 h-screen w-72 max-w-[70%] transform bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex h-18 items-center justify-between border-b border-black/5 px-4">
            <Image
              src="/Logo.png"
              alt="Logo"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
            <button
              onClick={() => setMenuOpen(false)}
              className="rounded-lg border border-black/10 bg-white p-2"
              aria-label="Close menu"
            >
              <span className="block text-lg leading-none text-gray-700">
                ✕
              </span>
            </button>
          </div>

          <div className="flex flex-col gap-4 px-5 py-6">
            {navLinks.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  transitionDelay: menuOpen ? `${120 + i * 60}ms` : "0ms",
                }}
                className={`text-sm font-medium text-gray-700 transition-all duration-300 ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}
              >
                {l.label}
              </a>
            ))}
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 rounded-xl bg-[#111827] px-5 py-3 text-center text-sm font-semibold text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-center text-sm font-semibold text-gray-900"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-xl bg-[#111827] p-3 text-center text-sm font-semibold text-white"
              >
                Go to dashboard
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="bg-cover bg-center"
        style={{ backgroundImage: "url('/PastelAI.png')" }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[8%] top-20 h-72 w-72 animate-[drift_14s_ease-in-out_infinite] rounded-full bg-violet-200/40 blur-3xl" />
          <div className="absolute right-[8%] top-32 h-80 w-80 animate-[drift_18s_ease-in-out_infinite_reverse] rounded-full bg-blue-200/35 blur-3xl" />
          <div className="absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-linear-to-r from-transparent via-gray-300 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
          <div className="mx-auto max-w-4xl text-center">
            <div className="rise mb-7 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-semibold text-violet-700 shadow-sm">
              <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-violet-100">
                <span className="absolute inset-0 animate-ping rounded-full bg-violet-300/60" />
                <Sparkles size={11} className="relative" />
              </span>
              AI-powered career intelligence
            </div>

            <h1
              className="rise text-5xl font-bold leading-[1.05] tracking-[-0.045em] text-gray-950 sm:text-6xl lg:text-7xl"
              style={{ animationDelay: "120ms" }}
            >
              Know exactly how
              <br />
              <span className="shine bg-linear-to-r from-violet-600 via-blue-500 to-violet-600 bg-clip-text text-transparent">
                job-ready you are.
              </span>
            </h1>

            <p
              className="rise mx-auto mt-7 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg"
              style={{ animationDelay: "260ms" }}
            >
              Upload your resume, add a job description, and get an intelligent
              breakdown of your match score, skill gaps, strengths and next
              steps.
            </p>

            <div
              className="rise mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
              style={{ animationDelay: "400ms" }}
            >
              <Link
                href={ctaHref}
                className="group relative flex h-11 items-center justify-center gap-3 overflow-hidden rounded-lg bg-[#111827] px-7 text-sm font-semibold text-white shadow-xl shadow-gray-900/15 transition hover:-translate-y-0.5 hover:bg-black"
              >
                <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Analyze my resume</span>
                <span className="relative transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <a
                href="#how-it-works"
                className="group flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-7 text-sm font-semibold text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:bg-gray-50"
              >
                See how it works
                <span className="transition-transform group-hover:translate-y-0.5">
                  ↓
                </span>
              </a>
            </div>
          </div>

          {/* Product Preview */}
          <div
            ref={watchPreview}
            className="rise relative mx-auto mt-16 max-w-6xl lg:mt-20"
            style={{ animationDelay: "560ms" }}
          >
            <div className="absolute -inset-4 rounded-4xl bg-linear-to-r from-violet-500/15 via-blue-500/15 to-cyan-500/15 blur-2xl" />

            {/* Floating chips */}
            <div className="absolute -left-3 top-80 z-10 hidden animate-[float_6s_ease-in-out_infinite] items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-xl lg:flex">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <TrendingUp size={14} />
              </span>
              <div>
                <div className="text-[10px] font-bold text-gray-900">
                  +12% match
                </div>
                <div className="text-[9px] text-gray-400">vs. last resume</div>
              </div>
            </div>
            <div className="absolute -right-3 bottom-24 z-10 hidden animate-[float_7s_ease-in-out_infinite_reverse] items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-xl lg:flex">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                <Target size={14} />
              </span>
              <div>
                <div className="text-[10px] font-bold text-gray-900">
                  8 skill gaps
                </div>
                <div className="text-[9px] text-gray-400">
                  with learning tips
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.3)]">
              <div className="flex h-12 items-center gap-2 border-b border-gray-100 bg-gray-50 px-5">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
                <div className="mx-auto hidden h-7 w-80 items-center justify-center rounded-md border border-gray-200 bg-white text-[10px] text-gray-400 sm:flex">
                  placement-ai-two-bay.vercel.app/dashboard
                </div>
              </div>

              <div className="grid min-h-107.5 grid-cols-12">
                <aside className="hidden border-r border-gray-100 bg-[#fbfbfc] p-5 sm:col-span-3 sm:block lg:col-span-2">
                  <div className="mb-6 flex items-center gap-2">
                    <Image
                      src="/Logo.png"
                      alt="Logo"
                      width={32}
                      height={32}
                      className="h-6 w-6 object-contain"
                    />
                    <span className="text-xs font-bold">
                      Placement<span className="text-violet-600"> AI</span>
                    </span>
                  </div>
                  <div className="space-y-1">
                    {[
                      {
                        icon: LayoutDashboard,
                        label: "Dashboard",
                        active: true,
                      },
                      { icon: FileUser, label: "My Resumes", active: false },
                      {
                        icon: SearchCheck,
                        label: "Job Matches",
                        active: false,
                      },
                      {
                        icon: BookOpenCheck,
                        label: "Interviews",
                        active: false,
                      },
                    ].map(({ icon: Icon, label, active }) => (
                      <div
                        key={label}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[10px] font-medium transition ${active ? "bg-gray-900 text-white" : "text-gray-400 hover:bg-gray-100"}`}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        {label}
                      </div>
                    ))}
                  </div>
                </aside>

                <div className="col-span-12 bg-white p-5 sm:col-span-9 lg:col-span-10 lg:p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-medium text-gray-400">
                        {date}
                      </p>
                      <h2 className="mt-1 text-xl font-bold tracking-tight text-gray-900">
                        {greeting}
                        <span className="inline-block origin-[70%_70%] animate-[float_3s_ease-in-out_infinite]">
                          👋
                        </span>
                      </h2>
                    </div>
                    <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-blue-500 text-[10px] font-bold text-white sm:flex">
                      GM
                    </div>
                  </div>

                  <div className="mt-7 grid grid-cols-3 gap-3">
                    {[
                      ["87%", "Avg. match score", "↑ 12%"],
                      ["14", "Jobs analyzed", "This month"],
                      ["8", "Skill gaps", "To improve"],
                    ].map(([value, label, change], i) => (
                      <div
                        key={label}
                        style={{ transitionDelay: `${i * 120}ms` }}
                        className={`rounded-xl border border-gray-100 bg-gray-50/70 p-4 transition-all duration-700 hover:-translate-y-1 hover:shadow-md ${previewSeen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                      >
                        <div className="text-xl font-bold text-gray-900">
                          {value}
                        </div>
                        <div className="mt-1 text-[9px] text-gray-400">
                          {label}
                        </div>
                        <div className="mt-3 text-[8px] font-semibold text-violet-600">
                          {change}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-5">
                    <div className="rounded-xl border border-gray-100 p-5 lg:col-span-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-bold text-gray-900">
                            Latest analysis
                          </h3>
                          <p className="mt-1 text-[9px] text-gray-400">
                            Frontend Developer · Technology
                          </p>
                        </div>
                        <span className="rounded-full bg-green-50 px-2 py-1 text-[8px] font-semibold text-green-600">
                          Strong match
                        </span>
                      </div>

                      <div className="mt-7 flex items-center gap-7">
                        {/* Animated score ring */}
                        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
                          <svg
                            viewBox="0 0 120 120"
                            className="absolute inset-0 -rotate-90"
                          >
                            <circle
                              cx="60"
                              cy="60"
                              r="48"
                              fill="none"
                              strokeWidth="10"
                              className="stroke-violet-100"
                            />
                            <circle
                              cx="60"
                              cy="60"
                              r="48"
                              fill="none"
                              strokeWidth="10"
                              strokeLinecap="round"
                              className="stroke-violet-600 transition-[stroke-dashoffset] duration-1600 ease-out"
                              strokeDasharray={circumference}
                              strokeDashoffset={
                                previewSeen
                                  ? circumference * (1 - 0.87)
                                  : circumference
                              }
                            />
                          </svg>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              <CountUp to={87} />
                            </div>
                            <div className="text-[8px] text-gray-400">
                              MATCH
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 space-y-3">
                          {skills.map(([skill, status, width], i) => (
                            <div key={skill}>
                              <div className="mb-1 flex justify-between text-[8px]">
                                <span className="font-medium text-gray-600">
                                  {skill}
                                </span>
                                <span className="text-gray-400">{status}</span>
                              </div>
                              <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                                <div
                                  className="h-full rounded-full bg-linear-to-r from-violet-500 to-blue-500 transition-[width] duration-1000 ease-out"
                                  style={{
                                    width: previewSeen ? `${width}%` : "0%",
                                    transitionDelay: `${400 + i * 150}ms`,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-gray-900 p-5 text-white lg:col-span-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                        <Sparkles size={14} className="animate-pulse" />
                      </div>
                      <h3 className="mt-5 text-sm font-bold">
                        AI recommendation
                      </h3>
                      <p className="mt-2 text-[9px] leading-5 text-gray-400">
                        Strengthen your Next.js and GraphQL knowledge to
                        increase your match score for this role.
                      </p>
                      <button className="mt-6 rounded-lg bg-white px-3 py-2 text-[9px] font-semibold text-gray-900 transition hover:bg-violet-50">
                        View skill gaps →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-1 divide-y divide-gray-100 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {stats.map((s) => (
            <div key={s.label} className="px-8 py-8 text-center">
              <div className="text-3xl font-bold tracking-tight text-gray-900">
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-xs font-medium text-gray-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
              Everything you need
            </div>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.035em] text-gray-950 sm:text-5xl">
              From resume to
              <br />
              <span className="text-gray-400">career strategy.</span>
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-500">
              One intelligent workspace to understand your profile, discover
              opportunities and prepare for the interviews that matter.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <Reveal key={f.number} delay={i * 100} className="bg-white">
                <div className="group relative h-full overflow-hidden p-7 transition-colors duration-300 hover:bg-gray-50">
                  <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-violet-600 to-blue-500 transition-transform duration-500 group-hover:scale-x-100" />
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-semibold text-gray-300 transition-colors duration-300 group-hover:text-violet-200">
                      {f.number}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-violet-50 group-hover:text-violet-600">
                      {f.icon}
                    </span>
                  </div>
                  <h3 className="mt-14 text-base font-bold text-gray-900">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-xs leading-6 text-gray-500">
                    {f.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="overflow-hidden bg-[#f7f8fa] py-24 lg:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal className="text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
              Simple process
            </div>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.035em] text-gray-950">
              Three steps. One clear answer.
            </h2>
          </Reveal>

          <div className="relative mt-16 grid gap-10 md:grid-cols-3">
            <div className="absolute left-[18%] right-[18%] top-8 hidden h-px bg-gray-200 md:block" />
            {steps.map((item, i) => (
              <Reveal
                key={item.step}
                delay={i * 150}
                className="relative text-center"
              >
                <div className="group mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-white text-sm font-bold text-gray-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-500/20">
                  {item.step}
                </div>
                <h3 className="mt-7 text-base font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="mx-auto mt-3 max-w-xs text-xs leading-6 text-gray-500">
                  {item.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="about"
        className="relative overflow-hidden bg-gray-950 py-24 text-white lg:py-28"
      >
        <div className="pointer-events-none absolute -top-24 left-1/4 h-64 w-64 animate-[drift_16s_ease-in-out_infinite] rounded-full bg-violet-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-1/4 h-64 w-64 animate-[drift_20s_ease-in-out_infinite_reverse] rounded-full bg-blue-600/20 blur-3xl" />
        <Reveal className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
          <div className="mx-auto flex h-12 w-12 animate-[float_5s_ease-in-out_infinite] items-center justify-center rounded-2xl bg-white/10">
            <Sparkles size={20} />
          </div>
          <h2 className="mt-7 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
            Stop guessing.
            <br />
            Start preparing.
          </h2>
          <p className="mx-auto my-5 max-w-xl text-sm leading-7 text-gray-400">
            Understand where you stand against your target role and get a
            practical path to become a stronger candidate.
          </p>
          <Link
            href={ctaHref}
            className="group mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 text-sm font-bold text-gray-950 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/20"
          >
            Analyze my resume
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 px-6 pb-10 text-gray-500">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <div className="text-xs">
            © 2026 PlacementAI. Built for better careers.
          </div>
          <div className="flex gap-6 text-xs">
            {["Privacy", "Terms", "Contact"].map((t) => (
              <a key={t} href="#" className="transition hover:text-white">
                {t}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
