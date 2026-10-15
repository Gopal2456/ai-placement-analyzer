// hooks/useSelectedResume.ts
import { useEffect, useMemo } from "react";
import useResumeStore from "@/store/useResumeStore";
import useInterviewStore from "@/store/useInterviewStore";

export const useSelectedResume = () => {
  const selectedResumeId = useInterviewStore((s) => s.selectedResumeId);
  const setSelectedResumeId = useInterviewStore((s) => s.setSelectedResumeId);

  const resumes = useResumeStore((s) => s.resumes);
  const loaded = useResumeStore((s) => s.loaded);
  const loading = useResumeStore((s) => s.loading);
  const fetchResumes = useResumeStore((s) => s.fetchResumes);

  // Loads once; does nothing if another component already loaded it
  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  // Default to the first resume if nothing is selected
  useEffect(() => {
    if (loaded && !selectedResumeId && resumes.length > 0) {
      setSelectedResumeId(resumes[0]._id);
    }
  }, [loaded, selectedResumeId, resumes, setSelectedResumeId]);

  const selectedResume = useMemo(
    () => resumes.find((r) => r._id === selectedResumeId) ?? null,
    [resumes, selectedResumeId],
  );

  return { selectedResume, selectedResumeId, resumes, loading };
};