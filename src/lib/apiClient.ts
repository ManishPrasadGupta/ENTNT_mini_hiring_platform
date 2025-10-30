import api from "./axios";
import {
  Candidate,
  CandidateStage,
  CandidateTimelineEntry,
  Job,
} from "@/types/types";

export const jobsApi = {
  getJobs: (params?: {
    search?: string;
    status?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
  }) => api.get<{ jobs: Job[]; total: number }>("/jobs", { params }),

  getJobById: (id: string) => api.get<Job>(`/jobs/${id}`),

  createJob: (job: Partial<Job>) => api.post<Job>("/jobs", job),

  updateJob: (id: string, updates: Partial<Job>) =>
    api.patch<Job>(`/jobs/${id}`, updates),

  reorderJob: (id: string, fromOrder: number, toOrder: number) =>
    api.patch(`/jobs/${id}/reorder`, { fromOrder, toOrder }),
};

export const candidatesApi = {
  // GET /candidates?search=&stage=&page=&pageSize=
  getCandidates: (params?: {
    search?: string;
    stage?: CandidateStage | "all";
    page?: number;
    pageSize?: number;
  }) =>
    api.get<{ candidates: Candidate[]; total: number }>("/candidates", {
      params,
    }),

  // GET /candidates/:id
  getCandidateById: (id: string) => api.get<Candidate>(`/candidates/${id}`),

  // POST /candidates
  createCandidate: (candidate: Partial<Candidate>) =>
    api.post<Candidate>("/candidates", candidate),

  // PATCH /candidates/:id
  updateCandidate: (
    id: string,
    updates: Partial<Candidate> & { by?: string; timelineNote?: string }
  ) => api.patch<Candidate>(`/candidates/${id}`, updates),

  // GET /candidates/:id/timeline
  getCandidateTimeline: (id: string) =>
    api.get<{ timeline: CandidateTimelineEntry[] }>(
      `/candidates/${id}/timeline`
    ),
};
