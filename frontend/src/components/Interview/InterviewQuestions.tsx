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

const scoreColor = (score: number | null) => {
  if (score === null) return "#6B7280";
  const s10 = scoreOutOf10(score) ?? 0;
  if (s10 >= 7) return "#1E7A4C";
  if (s10 >= 4) return "#B98900";
  return "#B3261E";
};

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

      // Log the raw shape once so it's easy to see what the backend
      // actually sent back if this ever looks wrong again.
      console.log("Submit response:", response.data);

      // Try the shapes a backend might reasonably use. If none of them
      // contain a `questions` array, fall back to re-fetching the
      // interview (which, per the GET sample, does include per-question
      // score/feedback after evaluation).
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
        <div className="flex items-center gap-3 text-[#6B7280]">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#2F5D50] border-t-transparent" />
          <p className="text-sm">Loading your interview…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-lg border border-[#E2A69A] bg-[#FBEEEC] px-5 py-4 text-sm text-[#8A2F1F]">
          {error}
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-sm text-[#6B7280]">
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
        {/* Summary header */}
        <div className="sticky top-0 z-10 border-b border-[#E2E1DC] backdrop-blur">
          <div className="mx-auto px-4 py-5 sm:px-6">
            <div className="flex items-baseline justify-between">
              <h1 className="text-2xl text-[#1C2321]">Interview results</h1>
              <span
                className="text-sm font-medium"
                style={{ color: scoreColor(avgScore10 / 10) }}
              >
                Avg score: {avgScore10}/10
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-sm text-[#6B7280]">
              <span>
                Question Type: {(result.questionType ?? "n/a").toUpperCase()}
              </span>
              <span className="text-[#D8D6CE]">·</span>
              <span>
                Difficulty: {(result.difficulty ?? "n/a").toUpperCase()}
              </span>
              <span className="text-[#D8D6CE]">·</span>
              <span>{total} questions</span>
            </div>
          </div>
        </div>

        <div className="mx-auto px-4 py-8 sm:px-6">
          <div className="space-y-5">
            {questions.map((question, index) => {
              const s10 = scoreOutOf10(question.score);
              return (
                <div
                  key={question._id}
                  className="rounded-lg border border-[#E2E1DC] bg-white p-6"
                  style={{
                    borderLeft: `3px solid ${scoreColor(question.score)}`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 text-lg text-[#B9B6AA]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-3 text-xs text-[#6B7280]">
                        <span>
                          {TYPE_LABEL[question.type] ?? question.type}
                        </span>
                        <span className="text-[#D8D6CE]">·</span>
                        <span>
                          {DIFFICULTY_LABEL[question.difficulty] ??
                            question.difficulty}
                        </span>
                        <span
                          className="ml-auto rounded-full bg-[#F1F0EA] px-2.5 py-0.5 font-medium"
                          style={{ color: scoreColor(question.score) }}
                        >
                          {s10 ?? "—"}/10
                        </span>
                      </div>

                      <h2 className="text-lg leading-7 text-[#1C2321]">
                        {question.question}
                      </h2>

                      {/* User's answer */}
                      <div className="mt-4 rounded-md border border-[#E2E1DC] bg-[#FBFBFA] p-4">
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#A6A49A]">
                          Your answer
                        </p>
                        <p className="text-sm text-[#1C2321] whitespace-pre-wrap">
                          {question.answer || "(no answer provided)"}
                        </p>
                      </div>

                      {/* Feedback */}
                      <div className="mt-4">
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#A6A49A]">
                          Feedback
                        </p>
                        <p className="text-sm text-[#1C2321]">
                          {question.feedback}
                        </p>
                      </div>

                      {/* Strengths / Improvements */}
                      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {(question.strengths ?? []).length > 0 && (
                          <div>
                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#1E7A4C]">
                              Strengths
                            </p>
                            <ul className="list-disc space-y-1 pl-4 text-sm text-[#1C2321]">
                              {(question.strengths ?? []).map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {(question.improvements ?? []).length > 0 && (
                          <div>
                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-[#B98900]">
                              Improvements
                            </p>
                            <ul className="list-disc space-y-1 pl-4 text-sm text-[#1C2321]">
                              {(question.improvements ?? []).map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Better answer */}
                      {question.betterAnswer && (
                        <details className="mt-4 rounded-md border border-[#E2E1DC] bg-[#F7F7F5] p-4">
                          <summary className="cursor-pointer text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                            Suggested answer
                          </summary>
                          <p className="mt-2 text-sm text-[#1C2321] whitespace-pre-wrap">
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
      {/* Sticky progress header */}
      <div className="sticky top-0 z-10 border-b border-[#E2E1DC] backdrop-blur">
        <div className="mx-auto px-4 py-5 sm:px-6">
          <div className="flex items-baseline justify-between">
            <h1 className=" text-2xl text-[#1C2321]">Mock interview</h1>
            <span className="text-sm text-[#6B7280]">
              {answeredCount} of {total} answered
            </span>
          </div>

          <div className="mt-3 flex items-center gap-3 text-sm text-[#6B7280]">
            <span>Question Type: {interview.questionType.toUpperCase()}</span>
            <span className="text-[#D8D6CE]">·</span>
            <span>Difficulty: {interview.difficulty.toUpperCase()}</span>
          </div>

          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#E9E8E2]">
            <div
              className="h-full rounded-full bg-violet-600 transition-[width] duration-300 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="mx-auto px-4 py-8 sm:px-6">
        <div className="space-y-5">
          {questionsList.map((question, index) => {
            const answered = Boolean((answers[question._id] || "").trim());

            return (
              <div
                key={question._id}
                className="rounded-lg border border-[#E2E1DC] bg-white p-6"
                style={{
                  borderLeft: `3px solid ${answered ? "#192791" : "#E2E1DC"}`,
                }}
              >
                <div className="flex items-start gap-4">
                  <span className="mt-0.5  text-lg text-[#B9B6AA]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-3 text-xs text-[#6B7280]">
                      <span>{TYPE_LABEL[question.type] ?? question.type}</span>
                      <span className="text-[#D8D6CE]">·</span>
                      <span>
                        {DIFFICULTY_LABEL[question.difficulty] ??
                          question.difficulty}
                      </span>
                    </div>

                    <h2 className=" text-lg leading-7 text-[#1C2321]">
                      {question.question}
                    </h2>

                    <textarea
                      value={answers[question._id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(question._id, e.target.value)
                      }
                      placeholder="Type your answer here…"
                      rows={6}
                      className="mt-4 w-full resize-none rounded-md border border-[#E2E1DC] bg-[#FBFBFA] p-4 text-sm text-[#1C2321] outline-none transition placeholder:text-[#A6A49A] focus:border-[#2F5D50] focus:bg-white focus:ring-1 focus:ring-[#2F5D50]"
                    />

                    <div className="mt-2 flex items-center justify-between text-xs text-[#A6A49A]">
                      <span>{answered ? "Answered" : "Not answered yet"}</span>
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
        <div className="mt-8 flex items-center justify-between border-t border-[#E2E1DC] pt-6">
          <span className="text-sm text-[#6B7280]">
            {answeredCount === total
              ? "All questions answered."
              : `${total - answeredCount} question${
                  total - answeredCount === 1 ? "" : "s"
                } left.`}
          </span>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-md bg-violet-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-[#274F44] focus:outline-none focus:ring-2 focus:ring-[#2a2981] focus:ring-offset-2 focus:ring-offset-[#F7F7F5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Evaluating…" : "Submit interview"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewQuestions;
