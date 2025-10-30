import { createAsyncThunk } from "@reduxjs/toolkit";
import { Job, JobStatus } from "@/types/types";
import { jobsApi } from "@/lib/apiClient";

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData: Partial<Job>) => {
    const response = await jobsApi.createJob(jobData);
    console.log("Create job response:", response.data);
    return response.data;
  }
);

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (params?: {
    search?: string;
    status?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
  }) => {
    const response = await jobsApi.getJobs(params);
    console.log("Fetch jobs response:", response.data);
    return response.data;
  }
);

export const fetchJobById = createAsyncThunk(
  "jobs/fetchJobById",
  async (id: string) => {
    const response = await jobsApi.getJobById(id);
    return response.data as Job;
  }
);

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async (job: Job) => {
    const response = await jobsApi.updateJob(job.id, job);
    console.log("Update job response:", response.data);
    return response.data;
  }
);

export const toggleJobArchive = createAsyncThunk(
  "jobs/toggleJobArchive",
  async (job: Job) => {
    const updatedJob = {
      ...job,
      status:
        job.status === "active"
          ? ("archived" as JobStatus)
          : ("active" as JobStatus),
    };
    // Update via API
    await jobsApi.updateJob(updatedJob.id, updatedJob);
    return updatedJob;
  }
);
