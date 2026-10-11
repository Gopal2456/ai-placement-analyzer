import { create } from "zustand";
import { persist } from "zustand/middleware";

interface InterviewStore {
  selectedResumeId: string | null;
  selectedJobId: string | null;

  setSelectedResumeId: (resumeId: string | null) => void;
  setSelectedJobId: (jobId: string | null) => void;
  clearInterviewSelection: () => void;
}

const useInterviewStore = create<InterviewStore>()(
  persist(
    (set) => ({
      selectedResumeId: null,
      selectedJobId: null,

      setSelectedResumeId: (resumeId) =>
        set({ selectedResumeId: resumeId }),

      setSelectedJobId: (jobId) =>
        set({ selectedJobId: jobId }),

      clearInterviewSelection: () =>
        set({
          selectedResumeId: null,
          selectedJobId: null,
        }),
    }),
    {
      name: "interview-storage",
    }
  )
);

export default useInterviewStore;