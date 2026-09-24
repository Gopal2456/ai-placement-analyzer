import { Suspense } from "react";
import AnalysisContent from "@/components/Resumes/AnalysisContent";

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div>Loading analysis...</div>}>
      <AnalysisContent />
    </Suspense>
  );
}
