"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/api/axios";

interface Question {
  _id: string;
  question: string;
  type: "technical" | "behavioral" | "project" | "general";
  difficulty: "easy" | "medium" | "hard";
  answer: string;
  score: number | null;
  feedback: string;
  strengths: string[];
  improvements: string[];
  betterAnswer: string;
}

interface Interview {
  _id: string;
  resumeId: string;
  jobId: string;
  questionType: string;
  difficulty: string;
  questionCount: number;
  questions: Question[];
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

const TYPE_LABEL: Record<string, string> = {
  technical: "Technical",
  behavioral: "Behavioral",
  project: "Project",
  general: "General",
};

// Score is out of 1 in the sample payload; scale to /10 for display.
const scoreOutOf10 = (score: number | null) =>
  score === null ? null : Math.round(score * 10);

// Returns Tailwind classes for text + left border based on score
const scoreTone = (score: number | null) => {
  if (score === null)
    return { text: "text-gray-500", border: "border-l-gray-300" };
  const s10 = scoreOutOf10(score) ?? 0;
  if (s10 >= 7)
    return { text: "text-emerald-600", border: "border-l-emerald-500" };
  if (s10 >= 4)
    return { text: "text-amber-600", border: "border-l-amber-500" };
  return { text: "text-red-600", border: "border-l-red-500" };
};

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
    {children}
  </span>
);

const InterviewQuestions = () => {
  const params = useParams();
  const interviewId = params.interviewId as string;

  const [interview, setInterview] = useState<Interview | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Results state — populated once the interview has been submitted & evaluated
  const [result, setResult] = useState<Interview | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/interview/${interviewId}`);
        setInterview(response.data.interview);
      } catch (error) {
        console.error(error);
        setError("Failed to load interview.");
      } finally {
        setLoading(false);
      }
    };

    if (interviewId) {
      fetchInterview();
    }
  }, [interviewId]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!interview) return;

    try {
      setSubmitting(true);
      setError("");

      const formattedAnswers = (interview.questions ?? []).map((question) => ({
        questionId: question._id,
        answer: answers[question._id] || "",
      }));

      const response = await api.post(`/interview/${interviewId}/answers`, {
        answers: formattedAnswers,
      });

      console.log("Submit response:", response.data);

      const candidate: Partial<Interview> | undefined =
        response.data?.interview ??
        response.data?.evaluation ??
        response.data?.result ??
        response.data;

      let evaluated: Interview | null =
        candidate && Array.isArray(candidate.questions)
          ? (candidate as Interview)
          : null;

      if (!evaluated) {
        const refetch = await api.get(`/interview/${interviewId}`);
        if (Array.isArray(refetch.data?.interview?.questions)) {
          evaluated = refetch.data.interview;
        }
      }

      if (!evaluated) {
        setError(
          "Submitted, but couldn't read the evaluation results back. Check the console log for the response shape.",
        );
        return;
      }

      setResult(evaluated);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      setError("Failed to submit interview.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
          <p className="text-sm">Loading your interview…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-sm text-gray-500">
          This interview couldn&apos;t be found.
        </p>
      </div>
    );
  }

  // ---------- RESULTS VIEW (shown after submit) ----------
  if (submitted && result) {
    const questions = result.questions ?? [];
    const total = questions.length;
    const avgScore10 =
      total > 0
        ? Math.round(
            (questions.reduce(
              (sum, q) => sum + (scoreOutOf10(q.score) ?? 0),
              0,
            ) /
              total) *
              10,
          ) / 10
        : 0;

    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          {/* Page heading */}
          <p className="text-sm font-medium text-violet-600">
            Interview Practice
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            Interview results
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Here&apos;s how you did, with feedback and a suggested answer for
            each question.
          </p>

          {/* Dark summary card */}
          <div className="mt-6 rounded-3xl bg-[#0B0B14] p-6 text-white shadow-lg sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-sm text-gray-400">Average score</p>
                <p className="mt-1 text-4xl font-bold tracking-tight text-emerald-400">
                  {avgScore10}
                  <span className="text-xl text-gray-500">/10</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-x-10 gap-y-4 text-sm">
                <div>
                  <p className="text-gray-400">Question type</p>
                  <p className="mt-1 font-semibold uppercase">
                    {result.questionType ?? "n/a"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Difficulty</p>
                  <p className="mt-1 font-semibold uppercase">
                    {result.difficulty ?? "n/a"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Questions</p>
                  <p className="mt-1 font-semibold">{total}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Result cards */}
          <div className="mt-6 space-y-5">
            {questions.map((question, index) => {
              const s10 = scoreOutOf10(question.score);
              const tone = scoreTone(question.score);
              return (
                <div
                  key={question._id}
                  className={`rounded-2xl border border-l-4 border-gray-200 bg-white p-6 shadow-sm ${tone.border}`}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-sm font-semibold text-gray-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Chip>{TYPE_LABEL[question.type] ?? question.type}</Chip>
                        <Chip>
                          {DIFFICULTY_LABEL[question.difficulty] ??
                            question.difficulty}
                        </Chip>
                        <span
                          className={`ml-auto rounded-full bg-gray-50 px-3 py-1 text-sm font-bold ring-1 ring-gray-200 ${tone.text}`}
                        >
                          {s10 ?? "—"}/10
                        </span>
                      </div>

                      <h2 className="text-lg font-semibold leading-7 text-gray-900">
                        {question.question}
                      </h2>

                      {/* User's answer */}
                      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Your answer
                        </p>
                        <p className="whitespace-pre-wrap text-sm text-gray-800">
                          {question.answer || "(no answer provided)"}
                        </p>
                      </div>

                      {/* Feedback */}
                      <div className="mt-4">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Feedback
                        </p>
                        <p className="text-sm leading-6 text-gray-700">
                          {question.feedback}
                        </p>
                      </div>

                      {/* Strengths / Improvements */}
                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {(question.strengths ?? []).length > 0 && (
                          <div className="rounded-xl bg-emerald-50 p-4">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                              Strengths
                            </p>
                            <ul className="list-disc space-y-1 pl-4 text-sm text-gray-800 marker:text-emerald-500">
                              {(question.strengths ?? []).map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {(question.improvements ?? []).length > 0 && (
                          <div className="rounded-xl bg-amber-50 p-4">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
                              Improvements
                            </p>
                            <ul className="list-disc space-y-1 pl-4 text-sm text-gray-800 marker:text-amber-500">
                              {(question.improvements ?? []).map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Better answer */}
                      {question.betterAnswer && (
                        <details className="group mt-4 rounded-xl border border-violet-100 bg-violet-50 p-4">
                          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-violet-700">
                            Suggested answer
                          </summary>
                          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-800">
                            {question.betterAnswer}
                          </p>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ---------- ANSWERING VIEW ----------
  const questionsList = interview.questions ?? [];
  const answeredCount = questionsList.filter((q) =>
    (answers[q._id] || "").trim(),
  ).length;
  const total = questionsList.length;
  const progressPct = total ? Math.round((answeredCount / total) * 100) : 0;

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-5 py-8 sm:px-7">
        {/* Page heading */}
        <p className="text-sm font-medium text-violet-600">
          Interview Practice
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
          Mock interview
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Answer each question in your own words, then submit for AI feedback.
        </p>

        {/* Sticky progress card */}
        <div className="sticky top-3 z-10 mt-6 rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Chip>{interview.questionType.toUpperCase()}</Chip>
              <Chip>{interview.difficulty.toUpperCase()}</Chip>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900">
                {progressPct}%
              </span>{" "}
              <span className="text-sm font-medium text-emerald-600">
                {answeredCount} of {total} answered
              </span>
            </div>
          </div>

          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-violet-600 transition-[width] duration-300 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="mt-6 space-y-5">
          {questionsList.map((question, index) => {
            const answered = Boolean((answers[question._id] || "").trim());

            return (
              <div
                key={question._id}
                className={`rounded-2xl border bg-white p-6 shadow-sm transition ${
                  answered
                    ? "border-violet-300 bg-violet-50/40"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold transition ${
                      answered
                        ? "bg-violet-600 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <Chip>{TYPE_LABEL[question.type] ?? question.type}</Chip>
                      <Chip>
                        {DIFFICULTY_LABEL[question.difficulty] ??
                          question.difficulty}
                      </Chip>
                    </div>

                    <h2 className="text-lg font-semibold leading-7 text-gray-900">
                      {question.question}
                    </h2>

                    <textarea
                      value={answers[question._id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(question._id, e.target.value)
                      }
                      placeholder="Type your answer here…"
                      rows={6}
                      className="mt-4 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20"
                    />

                    <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                      <span
                        className={answered ? "font-medium text-violet-600" : ""}
                      >
                        {answered ? "Answered" : "Not answered yet"}
                      </span>
                      <span>
                        {(answers[question._id] || "").length} characters
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <span className="text-sm text-gray-500">
            {answeredCount === total
              ? "All questions answered."
              : `${total - answeredCount} question${
                  total - answeredCount === 1 ? "" : "s"
                } left.`}
          </span>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Evaluating…" : "Submit interview"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewQuestions;