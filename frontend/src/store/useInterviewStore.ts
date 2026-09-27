import { create } from "zustand";

interface InterviewStore {
  selectedResumeId: string | null;
  selectedJobId: string | null;

  setSelectedResumeId: (resumeId: string | null) => void;
  setSelectedJobId: (jobId: string | null) => void;

  clearInterviewSelection: () => void;
}

const useInterviewStore = create<InterviewStore>((set) => ({
  selectedResumeId: null,
  selectedJobId: null,

  setSelectedResumeId: (resumeId) =>
    set({
      selectedResumeId: resumeId,
    }),

  setSelectedJobId: (jobId) =>
    set({
      selectedJobId: jobId,
    }),

  clearInterviewSelection: () =>
    set({
      selectedResumeId: null,
      selectedJobId: null,
    }),
}));

export default useInterviewStore;