"use client";

import { useParams, useRouter } from "next/navigation";
import { useAnalysisDetail } from "./Useanalysisdetail";
import AnalysisDetailView from "@/components/dashboard/Analysisdetailview"; 
import Image from "next/image";
import { Loader } from "lucide-react";

const AnalysisDetailPage = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const { analysis, job, loading, error } = useAnalysisDetail(params?.id);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-gray-100 border-t-violet-600" />
            <Image
              src="/Logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="relative z-10"
            />
          </div>

          <p className="mt-6 text-sm font-semibold text-gray-800">
            Loading analysis <Loader className="ml-2 inline-block h-4 w-4 animate-spin text-gray-500" />
          </p>
        </div>
      </main>
    );
  }

  if (error || !analysis) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-lg font-semibold text-red-600">
            !
          </div>

          <h2 className="mt-5 text-base font-semibold text-gray-800">
            Couldn&apos;t load analysis
          </h2>

          <p className="mt-2 text-xs leading-5 text-gray-500">
            {error || "This analysis doesn't exist."}
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-6 rounded-lg bg-gray-950 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-black"
          >
            Go back
          </button>
        </div>
      </main>
    );
  }

  return (
    <AnalysisDetailView
      analysis={analysis}
      job={job}
      onBack={() => router.back()}
    />
  );
};

export default AnalysisDetailPage;