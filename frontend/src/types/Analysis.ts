export interface AnalysisDetail {
  _id: string;
  resumeId: string;
  jobId: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  summary: string;
  createdAt: string;
}

export interface AnalysisJobInfo {
  title?: string;
  company?: string;
}