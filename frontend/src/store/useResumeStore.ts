// store/useResumeStore.ts
import { create } from "zustand";
import api from "@/api/axios";

export interface Resume {
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

interface ResumeState {
  resumes: Resume[];
  loaded: boolean;
  loading: boolean;
  fetchResumes: (force?: boolean) => Promise<void>;
  removeResume: (id: string) => void;
}

const useResumeStore = create<ResumeState>((set, get) => ({
  resumes: [],
  loaded: false,
  loading: false,

  fetchResumes: async (force = false) => {
    if (get().loading || (get().loaded && !force)) return;

    set({ loading: true });
    try {
      const response = await api.get("/resumes/");
      set({ resumes: response.data.resumes || [], loaded: true });
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      set({ loading: false });
    }
  },

  removeResume: (id) =>
    set((state) => ({ resumes: state.resumes.filter((r) => r._id !== id) })),
}));

export default useResumeStore;