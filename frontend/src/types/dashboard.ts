export interface ProfileData {
  user?: {
    name?: string;
  };
}

export interface DashboardStats {
  averageMatchScore: number;
  jobsAnalyzed: number;
  jobsAnalyzedThisMonth: number;
  skillGaps: number;
}

export interface PrioritySkill {
  skill: string;
  occurrences: number;
}

export interface Recommendation {
  message: string;
  prioritySkills: PrioritySkill[];
  suggestions: string[];
}

export interface LatestAnalysis {
  id: string;
  score: number;
  jobTitle: string;
  company: string;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  createdAt: string;
}

export interface RecentAnalysis {
  id: string;
  resumeId: string;
  resumeName?: string;
  jobTitle: string;
  company: string;
  score: number;
  missingSkills: string[];
  createdAt: string;
}

