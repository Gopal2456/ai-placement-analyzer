"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ListCheck,
  SquareText,
  Plus,
  Trash2,
  CheckCircle2,
  Loader,
} from "lucide-react";
import api from "@/api/axios";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import useInterviewStore from "@/store/useInterviewStore";

interface Resume {
  _id: string;
  fileName: string;
  role: string;
  skills: string[];
  experience: string;
  createdAt: string;
  status: string;
  primary?: boolean;
  fileSize?: number;
}

const Resumes = () => {
  const { selectedResumeId, setSelectedResumeId } = useInterviewStore();

  const queryClient = useQueryClient();

  const resumesQuery = useQuery({
    queryKey: ["resumes"],

    queryFn: async ({ signal }) => {
      const response = await api.get("/resumes/", { signal });

      return (response.data.resumes || []) as Resume[];
    },

    staleTime: 60 * 1000,
  });

  const resumes = resumesQuery.data ?? [];
  const count = resumes.length;

  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!resumeToDelete) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !deletingId) setResumeToDelete(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [resumeToDelete, deletingId]);

  useEffect(() => {
    if (!selectedResumeId && resumes.length > 0) {
      setSelectedResumeId(resumes[0]._id);
    }
  }, [resumes, selectedResumeId, setSelectedResumeId]);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("resume", file);

      return api.post("/resumes/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },

    onSuccess: async () => {
      toast.success("Resume uploaded successfully!");
      setUploadError("");

      // Fetch the updated resume list.
      await queryClient.invalidateQueries({
        queryKey: ["resumes"],
      });
    },

    onError: (error: unknown) => {
      console.error("Resume upload error:", error);

      const message = isAxiosError(error)
        ? error.response?.data?.message ||
          "Failed to upload resume. Please try again."
        : "Failed to upload resume. Please try again.";

      setUploadError(message);
      toast.error(message);
    },
  });

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploadError("");

    if (file.type !== "application/pdf") {
      setUploadError("Please upload a PDF file.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10 MB.");
      event.target.value = "";
      return;
    }

    uploadMutation.mutate(file);

    // Allow the same file to be selected again later.
    event.target.value = "";
  };

  const deleteMutation = useMutation({
    mutationFn: async (resumeId: string) => {
      await api.delete(`/resumes/${resumeId}`);
      return resumeId;
    },
  });

  const handleDelete = async () => {
    if (!resumeToDelete) return;

    const id = resumeToDelete._id;

    setDeletingId(id);

    try {
      await deleteMutation.mutateAsync(id);

      // Update the cached list immediately.
      const remaining = resumes.filter((resume) => resume._id !== id);

      queryClient.setQueryData<Resume[]>(["resumes"], remaining);

      // Remove the deleted resume's analysis from the cache.
      queryClient.removeQueries({
        queryKey: ["analysis", id],
      });

      // Refresh data from the backend.
      await queryClient.invalidateQueries({
        queryKey: ["resumes"],
      });

      if (selectedResumeId === id) {
        setSelectedResumeId(remaining[0]?._id ?? "");
      }

      toast.success("Resume deleted successfully!");
      setResumeToDelete(null);
    } catch (error: unknown) {
      console.error("Resume delete error:", error);

      const message = isAxiosError(error)
        ? error.response?.data?.message || "Failed to delete resume."
        : "Failed to delete resume.";

      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  // const handleDelete = async () => {
  //   if (!resumeToDelete) return;

  //   const id = resumeToDelete._id;

  //   try {
  //     setDeletingId(id);

  //     await api.delete(`/resumes/${id}`);

  //     toast.success("Resume deleted successfully!");

  //     const remaining = resumes.filter((resume) => resume._id !== id);
  //     setResumes(remaining);
  //     setCount(remaining.length);

  //     if (selectedResumeId === id) {
  //       setSelectedResumeId(remaining[0]?._id ?? "");
  //       setProfileReadiness(0);
  //     }

  //     setResumeToDelete(null); // close modal on success
  //   } catch (error: unknown) {
  //     console.error("Resume delete error:", error);

  //     if (isAxiosError(error)) {
  //       toast.error(
  //         error.response?.data?.message || "Failed to delete resume.",
  //       );
  //     } else {
  //       toast.error("Failed to delete resume.");
  //     }
  //     // modal stays open so the user can retry or cancel
  //   } finally {
  //     setDeletingId(null);
  //   }
  // };

  const selectedResumeData = resumes.find(
    (resume) => resume._id === selectedResumeId,
  );

  return (
    <main className="min-h-screen bg-[#f7f8fa]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-600">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
              Resume Manager
            </div>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-gray-800">
              My Resumes
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your resumes and keep your career profile up to date.
            </p>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
              className="group flex h-9.5 items-center gap-2 rounded-lg bg-gray-800 px-4 text-base font-medium text-white shadow-lg shadow-gray-900/10 transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload"}

              <span className="text-lg leading-none">
                {uploadMutation.isPending ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-800">{count}</p>
                <p className="mt-1 text-xs text-gray-400">Total resumes</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <SquareText className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-800">
                  {
                    new Set(resumes.flatMap((resume) => resume.skills || []))
                      .size
                  }
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Unique Skills extracted
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <ListCheck className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-800">87%</p>
                <p className="mt-1 text-xs text-gray-400">Best job match</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                ✓
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          {/* Resume list */}
          <section className="xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-800">
                  Your resumes
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Select a resume to view its profile.
                </p>
              </div>

              <span className="rounded-full bg-gray-100 px-3 py-1.5 text-[10px] font-semibold text-gray-500">
                {resumes.length} files
              </span>
            </div>

            <div className="custom-scrollbar max-h-120 space-y-3 overflow-y-auto p-1 pr-2">
              {resumesQuery.isPending && (
                <p className="p-4 text-sm text-center text-gray-500">
                  Loading resumes{" "}
                  <Loader className="ml-2 inline h-4 w-4 animate-spin" />
                </p>
              )}

              {resumesQuery.isError && (
                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
                  <p>Failed to load resumes.</p>

                  <button
                    type="button"
                    onClick={() => void resumesQuery.refetch()}
                    className="mt-2 font-semibold underline"
                  >
                    Try again
                  </button>
                </div>
              )}
              {resumes.map((resume) => {
                const active = selectedResumeId === resume._id;
                const isDeleting = deletingId === resume._id;

                return (
                  <div key={resume._id} className="relative">
                    <button
                      type="button"
                      onClick={() => setSelectedResumeId(resume._id)}
                      className={`w-full rounded-2xl border bg-white p-5 pr-14 text-left transition ${
                        active
                          ? "border-violet-300 ring-2 ring-violet-500/10"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      } ${isDeleting ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-start gap-4">
                        {/* PDF icon */}
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-xs font-semibold text-red-500">
                          PDF
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="truncate sm:max-w-full max-w-36 text-sm font-semibold text-gray-900">
                                  {resume.fileName}
                                </h3>

                                {resume.primary && (
                                  <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[8px] font-semibold text-violet-600">
                                    PRIMARY
                                  </span>
                                )}
                              </div>

                              <p className="mt-1 text-xs text-gray-400">
                                {resume.role}
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
                            <div>
                              <p className="text-[9px] uppercase tracking-wider text-gray-400">
                                Skills
                              </p>
                              <p className="mt-1 text-xs font-semibold text-gray-800">
                                {resume.skills.length}
                              </p>
                            </div>

                            <div>
                              <p className="text-[9px] uppercase tracking-wider text-gray-400">
                                Experience
                              </p>
                              <p className="mt-1 text-xs font-semibold text-gray-800">
                                {resume.experience}
                              </p>
                            </div>

                            <div>
                              <p className="text-[9px] uppercase tracking-wider text-gray-400">
                                Uploaded
                              </p>
                              <p className="mt-1 text-xs font-semibold text-gray-800">
                                {new Date(resume.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                    {active && (
                      <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 shadow-sm">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Selected
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setResumeToDelete(resume)}
                      disabled={isDeleting}
                      aria-label={`Delete ${resume.fileName}`}
                      className="absolute right-4 bottom-4 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Upload area */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
                className="mt-4 flex min-h-37.5 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-6 text-center transition hover:border-violet-300 hover:bg-violet-50/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-lg text-violet-600">
                  {uploadMutation.isPending ? (
                    <Loader className="h-5 w-5 animate-spin " />
                  ) : (
                    "↑"
                  )}
                </div>

                <h3 className="mt-3 text-sm font-semibold text-gray-800">
                  {uploadMutation.isPending ? "Uploading resume..." : "Upload another resume"}
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  {uploadMutation.isPending
                    ? "Please wait while your resume is uploaded."
                    : "PDF files up to 10 MB"}
                </p>
              </button>

              {uploadError && (
                <p className="mt-2 text-center text-xs font-medium text-red-500">
                  {uploadError}
                </p>
              )}
            </div>
          </section>

          {/* Resume preview */}
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-6 xl:sticky xl:top-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-violet-600">
                  Resume profile
                </p>

                <h2 className="mt-1 text-sm font-semibold text-gray-800">
                  {selectedResumeData?.fileName || "Resume Profile"}
                </h2>
              </div>
            </div>

            {/* Extracted skills */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-900">
                  Extracted skills
                </h3>

                <span className="text-[9px] text-gray-400">
                  {selectedResumeData?.skills?.length || 0} skills
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {selectedResumeData?.skills?.map((skill: string) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-gray-100 bg-gray-50 px-2.5 py-1.5 text-[9px] font-medium text-gray-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume info */}
            <div className="mt-6 border-t border-gray-100 pt-5">
              <h3 className="text-xs font-semibold text-gray-900">
                Resume details
              </h3>

              <div className="mt-3 space-y-3">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">File</span>
                  <span className="max-w-42.5 truncate font-medium text-gray-700">
                    {selectedResumeData?.fileName || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">Size</span>
                  <span className="font-medium text-gray-700">
                    {selectedResumeData?.fileSize
                      ? (selectedResumeData.fileSize / 1024 / 1024).toFixed(2) +
                        " MB"
                      : "N/A"}
                  </span>
                </div>

                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">Experience</span>
                  <span className="font-medium text-gray-700">
                    {selectedResumeData?.experience || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">Status</span>
                  <span className="font-semibold text-green-600">
                    Processed
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6">
              <Link
                href={
                  selectedResumeId
                    ? `/analysis?resumeId=${selectedResumeId}`
                    : "/analysis"
                }
                className="flex h-10 items-center justify-center rounded-lg bg-gray-950 text-[11px] font-semibold text-white transition hover:bg-black"
              >
                Analyze resume
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {resumeToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/65 px-4"
          onClick={() => !deletingId && setResumeToDelete(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="delete-dialog-title"
              className="mt-4 text-base font-semibold text-gray-900"
            >
              Delete this resume?
            </h2>

            <p className="mt-1.5 text-sm leading-6 text-gray-500">
              <span className="font-medium text-gray-700">
                {resumeToDelete.fileName}
              </span>{" "}
              and its analysis data will be permanently removed. This action
              cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                autoFocus
                onClick={() => setResumeToDelete(null)}
                disabled={!!deletingId}
                className="h-9.5 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={!!deletingId}
                className="h-9.5 rounded-lg bg-red-500 px-4 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Resumes;
