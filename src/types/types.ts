export type JobStatus = "active" | "archived";
export type JobType = "full-time" | "part-time" | "contract";

export interface Job {
  id: string;
  title: string;
  description?: string;
  location?: string;
  type?: JobType;
  status: JobStatus;
  requirements?: string[];
  tags: string[];
  slug: string;
  order: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export type CreateJobFields = {
  title: string;
  description?: string;
  location?: string;
  type?: JobType;
  status: JobStatus;
  requirements?: string[];
  tags: string[];
};

// candidates
export type CandidateStage =
  | "applied"
  | "screen"
  | "tech"
  | "offer"
  | "hired"
  | "rejected";

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  stage: CandidateStage;
  jobId: string;
  resume?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateTimelineEntry {
  timestamp: string;
  stage: CandidateStage;
  fromStage?: CandidateStage;
  by: string; // user
  note?: string;
  candidateId: string;
}

// assessments

// Params for dashboard/listing endpoint
export type AssessmentDashboardItem = Assessment & {
  questionsCount: number;
  responsesCount: number;
};

export type AssessmentStatus = "active" | "inactive";

export interface Assessment {
  id: string;
  jobId: Job["id"] | string;
  title: string;
  status: AssessmentStatus;
  createdAt: string;
  questions: AssessmentQuestion[];
}

export type AssessmentQuestionType =
  | "single-choice"
  | "multi-choice"
  | "short-text"
  | "long-text"
  | "numeric"
  | "file-upload";

export interface AssessmentQuestion {
  id: string;
  type: AssessmentQuestionType;
  label: string;
  options?: string[];
  required?: boolean;
  min?: number;
  max?: number;
  maxLength?: number;
  condition?: { questionId: string; value: any };
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  candidateId: string;
  answers: Record<string, any>; // questionId -> answer
  submittedAt: string;
}
