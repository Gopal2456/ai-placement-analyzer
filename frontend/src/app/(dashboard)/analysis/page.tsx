// "use client";

// import { Suspense, useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { isAxiosError } from "axios";
// import api from "@/api/axios";

// interface Analysis {
//   overallScore: number;
//   skillsScore: number;
//   experienceScore: number;
//   projectsScore: number;
//   educationScore: number;
//   strengths: string[];
//   weaknesses: string[];
//   missingSkills: string[];
//   suggestions: string[];
//   summary: string;
// }

// interface AnalysisResponse {
//   analysis: Analysis;
// }

// interface ApiErrorResponse {
//   message?: string;
// }

// const AnalysisContent = () => {
//   const searchParams = useSearchParams();
//   const resumeId = searchParams.get("resumeId");

//   const [analysis, setAnalysis] = useState<Analysis | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!resumeId) {
//       return;
//     }

//     const fetchAnalysis = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const response = await api.get<AnalysisResponse>(
//           `/analysis/${resumeId}`,
//         );

//         setAnalysis(response.data.analysis);
//       } catch (error: unknown) {
//         console.error("Fetch analysis error:", error);

//         if (
//           isAxiosError<ApiErrorResponse>(error) &&
//           error.response?.status === 404
//         ) {
//           try {
//             const response = await api.post<AnalysisResponse>("/analysis", {
//               resumeId,
//             });

//             setAnalysis(response.data.analysis);
//           } catch (analysisError: unknown) {
//             console.error("Create analysis error:", analysisError);

//             if (isAxiosError<ApiErrorResponse>(analysisError)) {
//               setError(
//                 analysisError.response?.data?.message ||
//                   "Failed to analyze resume.",
//               );
//             } else {
//               setError("Failed to analyze resume.");
//             }
//           }
//         } else if (isAxiosError<ApiErrorResponse>(error)) {
//           setError(
//             error.response?.data?.message || "Failed to fetch resume analysis.",
//           );
//         } else {
//           setError("Failed to fetch resume analysis.");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnalysis();
//   }, [resumeId]);

//   if (!resumeId) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
//         <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
//           <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
//             <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-lg font-semibold text-red-600">
//               !
//             </div>
//           </div>

//           <h2 className="mt-5 text-base font-semibold text-gray-800">
//             No resume selected
//           </h2>

//           <p className="mt-2 text-xs leading-5 text-gray-400">
//             Please select a resume to view its analysis.
//           </p>
//         </div>
//       </main>
//     );
//   }

//   // useEffect(() => {
//   //   if (!resumeId) {
//   //     setError("No resume selected.");
//   //     setLoading(false);
//   //     return;
//   //   }

//   //   const fetchAnalysis = async () => {
//   //     try {
//   //       setLoading(true);
//   //       setError("");

//   //       const response = await api.get<AnalysisResponse>(
//   //         `/analysis/${resumeId}`,
//   //       );

//   //       setAnalysis(response.data.analysis);
//   //     } catch (error: unknown) {
//   //       console.error("Fetch analysis error:", error);

//   //       if (
//   //         isAxiosError<ApiErrorResponse>(error) &&
//   //         error.response?.status === 404
//   //       ) {
//   //         try {
//   //           const response = await api.post<AnalysisResponse>("/analysis", {
//   //             resumeId,
//   //           });

//   //           setAnalysis(response.data.analysis);
//   //         } catch (analysisError: unknown) {
//   //           console.error("Create analysis error:", analysisError);

//   //           if (isAxiosError<ApiErrorResponse>(analysisError)) {
//   //             setError(
//   //               analysisError.response?.data?.message ||
//   //                 "Failed to analyze resume.",
//   //             );
//   //           } else {
//   //             setError("Failed to analyze resume.");
//   //           }
//   //         }
//   //       } else {
//   //         if (isAxiosError<ApiErrorResponse>(error)) {
//   //           setError(
//   //             error.response?.data?.message ||
//   //               "Failed to fetch resume analysis.",
//   //           );
//   //         } else {
//   //           setError("Failed to fetch resume analysis.");
//   //         }
//   //       }
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchAnalysis();
//   // }, [resumeId]);

//   if (loading) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
//         <div className="flex w-full max-w-md flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
//           {/* Loader */}
//           <div className="relative flex h-16 w-16 items-center justify-center">
//             <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-gray-100 border-t-violet-600" />

//             <div className="h-8 w-8 animate-pulse rounded-full bg-violet-100" />
//           </div>

//           {/* Text */}
//           <p className="mt-6 text-sm font-semibold text-gray-800">
//             Analyzing your resume
//             <span className="inline-flex w-6 text-left">
//               <span className="animate-pulse">...</span>
//             </span>
//           </p>

//           <p className="mt-2 max-w-sm text-xs leading-5 text-gray-400">
//             Our AI is reviewing your skills, experience, projects and education.
//           </p>

//           {/* Progress dots */}
//           <div className="mt-5 flex items-center gap-1.5">
//             <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-500" />
//             <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-500 [animation-delay:150ms]" />
//             <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-500 [animation-delay:300ms]" />
//           </div>
//         </div>
//       </main>
//     );
//   }

//   if (error) {
//     return (
//       <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
//         <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
//           {/* Error Icon */}
//           <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
//             <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-lg font-semibold text-red-600">
//               !
//             </div>
//           </div>

//           {/* Error Message */}
//           <h2 className="mt-5 text-base font-semibold text-gray-800">
//             Analysis failed
//           </h2>

//           <p className="mt-2 text-xs leading-5 text-gray-400">{error}</p>

//           <p className="mt-1 text-xs text-gray-400">
//             Please try again or select another resume.
//           </p>

//           {/* Retry Button */}
//           <button
//             type="button"
//             onClick={() => window.location.reload()}
//             className="mt-6 rounded-lg bg-gray-950 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-black"
//           >
//             Try again
//           </button>
//         </div>
//       </main>
//     );
//   }

//   if (!analysis) {
//     return null;
//   }

//   return (
//     <main className="min-h-screen bg-gray-50">
//       <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
//         {/* Header */}
//         <div>
//           <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-600">
//             AI Resume Analysis
//           </p>

//           <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-800">
//             Resume Analysis
//           </h1>

//           <p className="mt-1 text-sm text-gray-500">
//             Here is your AI-powered resume evaluation.
//           </p>
//         </div>

//         {/* Overall Score */}
//         <div className="mt-6 rounded-2xl bg-gray-950 p-6 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs uppercase tracking-wider text-gray-400">
//                 Overall Resume Score
//               </p>

//               <p className="mt-2 text-4xl font-semibold">
//                 {analysis.overallScore}%
//               </p>

//               <p className="mt-2 text-xs text-gray-400">
//                 Based on skills, experience, projects and education.
//               </p>
//             </div>

//             <div className="flex h-20 w-20 items-center justify-center rounded-full border-8 border-violet-500/20 border-t-violet-500 text-xl font-semibold">
//               {analysis.overallScore}
//             </div>
//           </div>
//         </div>

//         {/* Score Cards */}
//         <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           <ScoreCard title="Skills" score={analysis.skillsScore} />

//           <ScoreCard title="Experience" score={analysis.experienceScore} />

//           <ScoreCard title="Projects" score={analysis.projectsScore} />

//           <ScoreCard title="Education" score={analysis.educationScore} />
//         </div>

//         {/* Strengths / Weaknesses */}
//         <div className="mt-6 grid gap-6 lg:grid-cols-2">
//           {/* Strengths */}
//           <div className="rounded-2xl border border-gray-200 bg-white p-6">
//             <h2 className="text-sm font-semibold text-gray-900">Strengths</h2>

//             <div className="mt-4 space-y-3">
//               {analysis.strengths?.map((strength: string, index: number) => (
//                 <div key={index} className="rounded-xl bg-green-50 p-4">
//                   <p className="text-xs leading-5 text-gray-700">{strength}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Weaknesses */}
//           <div className="rounded-2xl border border-gray-200 bg-white p-6">
//             <h2 className="text-sm font-semibold text-gray-900">Weaknesses</h2>

//             <div className="mt-4 space-y-3">
//               {analysis.weaknesses?.map((weakness: string, index: number) => (
//                 <div key={index} className="rounded-xl bg-red-50 p-4">
//                   <p className="text-xs leading-5 text-gray-700">{weakness}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Missing Skills */}
//         <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
//           <div className="flex items-center justify-between">
//             <h2 className="text-sm font-semibold text-gray-900">
//               Missing Skills
//             </h2>

//             <span className="rounded-full bg-violet-50 px-3 py-1 text-[10px] font-semibold text-violet-600">
//               {analysis.missingSkills?.length || 0} skills
//             </span>
//           </div>

//           <div className="mt-4 flex flex-wrap gap-2">
//             {analysis.missingSkills?.map((skill: string) => (
//               <span
//                 key={skill}
//                 className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600"
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Suggestions */}
//         <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
//           <h2 className="text-sm font-semibold text-gray-900">Suggestions</h2>

//           <div className="mt-4 space-y-3">
//             {analysis.suggestions?.map((suggestion: string, index: number) => (
//               <div key={index} className="flex gap-3 rounded-xl bg-gray-50 p-4">
//                 <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-600">
//                   {index + 1}
//                 </span>

//                 <p className="text-xs leading-5 text-gray-700">{suggestion}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Summary */}
//         <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
//           <h2 className="text-sm font-semibold text-gray-900">AI Summary</h2>

//           <p className="mt-3 text-sm leading-6 text-gray-600">
//             {analysis.summary}
//           </p>
//         </div>
//       </div>
//     </main>
//   );
// };

// const ScoreCard = ({ title, score }: { title: string; score: number }) => {
//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white p-5">
//       <p className="text-xs text-gray-400">{title}</p>

//       <p className="mt-2 text-2xl font-semibold text-gray-800">{score}%</p>

//       <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
//         <div
//           className="h-full rounded-full bg-violet-500"
//           style={{ width: `${score}%` }}
//         />
//       </div>
//     </div>
//   );
// };

// const AnalysisPage = () => {
//   return (
//     <Suspense
//       fallback={
//         <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
//           <div className="flex w-full max-w-md flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
//             <div className="relative flex h-16 w-16 items-center justify-center">
//               <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-gray-100 border-t-violet-600" />
//               <div className="h-8 w-8 animate-pulse rounded-full bg-violet-100" />
//             </div>

//             <p className="mt-6 text-sm font-semibold text-gray-800">
//               Loading analysis...
//             </p>
//           </div>
//         </main>
//       }
//     >
//       <AnalysisContent />
//     </Suspense>
//   );
// };

// export default AnalysisPage;

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { isAxiosError } from "axios";
import api from "@/api/axios";

interface Resume {
  _id: string;
  fileName: string;
  skills: string[];
}

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
}

interface Analysis {
  _id?: string;
  id?: string;
  resumeId: string;
  jobId: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  summary: string;
  createdAt?: string;
}

interface AnalysisResponse {
  analysis: Analysis;
}

interface ResumeResponse {
  resume: Resume;
}

interface JobsResponse {
  jobs: Job[];
}

interface ApiErrorResponse {
  message?: string;
}

const AnalysisContent = () => {
  const searchParams = useSearchParams();

  const resumeId = searchParams.get("resumeId");

  const [resume, setResume] = useState<Resume | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState("");

  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  /*
   * Fetch selected resume
   */
  useEffect(() => {
    if (!resumeId) {
      setLoading(false);
      return;
    }

    const fetchResume = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<ResumeResponse>(
          `/resumes/${resumeId}`,
        );

        setResume(response.data.resume);
      } catch (error: unknown) {
        console.error("Fetch resume error:", error);

        if (isAxiosError<ApiErrorResponse>(error)) {
          setError(
            error.response?.data?.message ||
              "Failed to fetch resume.",
          );
        } else {
          setError("Failed to fetch resume.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  /*
   * Fetch jobs
   */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get<JobsResponse>("/jobs");

        setJobs(response.data.jobs || []);
      } catch (error: unknown) {
        console.error("Fetch jobs error:", error);

        if (isAxiosError<ApiErrorResponse>(error)) {
          setError(
            error.response?.data?.message ||
              "Failed to fetch jobs.",
          );
        } else {
          setError("Failed to fetch jobs.");
        }
      }
    };

    fetchJobs();
  }, []);

  /*
   * Analyze Resume against Job
   */
  const handleAnalyzeJobMatch = async () => {
    if (!resumeId) {
      setError("Please select a resume.");
      return;
    }

    if (!selectedJob) {
      setError("Please select a job.");
      return;
    }

    try {
      setAnalyzing(true);
      setError("");
      setAnalysis(null);

      const response = await api.post<AnalysisResponse>(
        "/analysis",
        {
          resumeId,
          jobId: selectedJob,
        },
      );

      setAnalysis(response.data.analysis);
    } catch (error: unknown) {
      console.error("Job match analysis error:", error);

      if (isAxiosError<ApiErrorResponse>(error)) {
        setError(
          error.response?.data?.message ||
            "Failed to analyze job match.",
        );
      } else {
        setError("Failed to analyze job match.");
      }
    } finally {
      setAnalyzing(false);
    }
  };

  /*
   * No resume selected
   */
  if (!resumeId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-lg font-semibold text-red-600">
              !
            </div>
          </div>

          <h2 className="mt-5 text-base font-semibold text-gray-800">
            No resume selected
          </h2>

          <p className="mt-2 text-xs leading-5 text-gray-400">
            Please select a resume to analyze.
          </p>
        </div>
      </main>
    );
  }

  /*
   * Loading
   */
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-gray-100 border-t-violet-600" />

            <div className="h-8 w-8 animate-pulse rounded-full bg-violet-100" />
          </div>

          <p className="mt-6 text-sm font-semibold text-gray-800">
            Loading...
          </p>

          <p className="mt-2 text-xs text-gray-400">
            Loading your resume and available jobs.
          </p>
        </div>
      </main>
    );
  }

  /*
   * Error
   */
  if (error && !analysis) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-lg font-semibold text-red-600">
              !
            </div>
          </div>

          <h2 className="mt-5 text-base font-semibold text-gray-800">
            Analysis failed
          </h2>

          <p className="mt-2 text-xs leading-5 text-gray-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-gray-950 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-black"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const selectedJobData = jobs.find(
    (job) => job.id === selectedJob,
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        {/* Header */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-600">
            Job Match Analyzer
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-800">
            Analyze Job Match
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Compare your resume with a job and discover your skill match.
          </p>
        </div>

        {/* Resume + Job Selection */}
        {!analysis && (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">

            {/* Resume */}
            <div>
              <label className="text-xs font-semibold text-gray-800">
                Resume
              </label>

              <div className="mt-2 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {resume?.fileName || "Resume"}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {resume?.skills?.length || 0} extracted skills
                  </p>
                </div>

                <span className="rounded-lg bg-red-50 px-2 py-1 text-[9px] font-semibold text-red-500">
                  PDF
                </span>
              </div>
            </div>

            {/* Job */}
            <div className="mt-6">
              <label
                htmlFor="job"
                className="text-xs font-semibold text-gray-800"
              >
                Job
              </label>

              <select
                id="job"
                value={selectedJob}
                onChange={(e) => {
                  setSelectedJob(e.target.value);
                  setError("");
                }}
                className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/10"
              >
                <option value="">
                  Select Job
                </option>

                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                    {job.company ? ` — ${job.company}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Job Preview */}
            {selectedJobData && (
              <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4">

                <p className="text-sm font-semibold text-gray-900">
                  {selectedJobData.title}
                </p>

                {selectedJobData.company && (
                  <p className="mt-1 text-xs text-gray-500">
                    {selectedJobData.company}
                  </p>
                )}

                {selectedJobData.skills?.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      Required Skills
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {selectedJobData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[9px] font-medium text-gray-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="mt-4 text-xs font-medium text-red-500">
                {error}
              </p>
            )}

            {/* Analyze Button */}
            <button
              type="button"
              onClick={handleAnalyzeJobMatch}
              disabled={
                analyzing ||
                !resumeId ||
                !selectedJob
              }
              className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-gray-950 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {analyzing
                ? "Analyzing Job Match..."
                : "Analyze Job Match"}
            </button>
          </div>
        )}

        {/* Analyzing */}
        {analyzing && (
          <div className="mt-6 flex min-h-75 items-center justify-center rounded-2xl border border-gray-200 bg-white">
            <div className="text-center">

              <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-gray-100 border-t-violet-600" />

                <div className="h-8 w-8 animate-pulse rounded-full bg-violet-100" />
              </div>

              <p className="mt-6 text-sm font-semibold text-gray-800">
                Analyzing Job Match...
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Comparing your skills with the job requirements.
              </p>
            </div>
          </div>
        )}

        {/* Analysis Result */}
        {analysis && !analyzing && (
          <>
            {/* Match Score */}
            <div className="mt-6 rounded-2xl bg-gray-950 p-6 text-white">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400">
                    Job Match Score
                  </p>

                  <p className="mt-2 text-4xl font-semibold">
                    {analysis.matchScore}%
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    Based on the skills required by this job.
                  </p>
                </div>

                <div className="flex h-20 w-20 items-center justify-center rounded-full border-8 border-violet-500/20 border-t-violet-500 text-xl font-semibold">
                  {analysis.matchScore}
                </div>
              </div>
            </div>

            {/* Matched / Missing Skills */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">

              {/* Matched */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Matched Skills
                  </h2>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-semibold text-green-600">
                    {analysis.matchedSkills?.length || 0} skills
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {analysis.matchedSkills?.length > 0 ? (
                    analysis.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-green-100 bg-green-50 px-3 py-2 text-xs font-medium text-green-700"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">
                      No matched skills found.
                    </p>
                  )}
                </div>
              </div>

              {/* Missing */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-900">
                    Missing Skills
                  </h2>

                  <span className="rounded-full bg-red-50 px-3 py-1 text-[10px] font-semibold text-red-600">
                    {analysis.missingSkills?.length || 0} skills
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {analysis.missingSkills?.length > 0 ? (
                    analysis.missingSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-600"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">
                      No missing skills found.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Strengths / Weaknesses */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">

              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-sm font-semibold text-gray-900">
                  Strengths
                </h2>

                <div className="mt-4 space-y-3">
                  {analysis.strengths?.map(
                    (strength, index) => (
                      <div
                        key={index}
                        className="rounded-xl bg-green-50 p-4"
                      >
                        <p className="text-xs leading-5 text-gray-700">
                          {strength}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-sm font-semibold text-gray-900">
                  Weaknesses
                </h2>

                <div className="mt-4 space-y-3">
                  {analysis.weaknesses?.map(
                    (weakness, index) => (
                      <div
                        key={index}
                        className="rounded-xl bg-red-50 p-4"
                      >
                        <p className="text-xs leading-5 text-gray-700">
                          {weakness}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-gray-900">
                Recommendations
              </h2>

              <div className="mt-4 space-y-3">
                {analysis.recommendations?.map(
                  (recommendation, index) => (
                    <div
                      key={index}
                      className="flex gap-3 rounded-xl bg-gray-50 p-4"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-600">
                        {index + 1}
                      </span>

                      <p className="text-xs leading-5 text-gray-700">
                        {recommendation}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-gray-900">
                AI Summary
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {analysis.summary}
              </p>
            </div>

            {/* Analyze Another Job */}
            <button
              type="button"
              onClick={() => {
                setAnalysis(null);
                setSelectedJob("");
              }}
              className="mt-6 w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Analyze Another Job
            </button>
          </>
        )}
      </div>
    </main>
  );
};

export default AnalysisContent;