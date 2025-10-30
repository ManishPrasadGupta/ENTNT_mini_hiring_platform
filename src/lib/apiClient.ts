import api from "./axios";
import { Job } from "@/types/types";

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
