import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Job } from "@/types/types";
import {
  fetchJobs,
  fetchJobById,
  createJob,
  toggleJobArchive,
  updateJob,
} from "./jobsThunks";

type JobsState = {
  jobs: Job[];
  total: number;
  loading: boolean;
  error: string | null;
  selectedJob?: Job | null;
};

const initialState: JobsState = {
  jobs: [],
  total: 0,
  loading: false,
  error: null,
  selectedJob: null,
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchJobs.fulfilled,
        (state, action: PayloadAction<{ jobs: Job[]; total: number }>) => {
          state.loading = false;
          state.jobs = action.payload.jobs;
          state.total = action.payload.total;
        }
      )
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch jobs";
      })

      // Create job
      .addCase(createJob.fulfilled, (state, action: PayloadAction<Job>) => {
        if (!Array.isArray(state.jobs)) state.jobs = [];
        state.jobs.unshift(action.payload);
        state.total += 1;
      })

      // Fetch job by id
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedJob = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action: PayloadAction<Job>) => {
        state.loading = false;
        state.selectedJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch job";
        state.selectedJob = null;
      })
      .addCase(
        toggleJobArchive.fulfilled,
        (state, action: PayloadAction<Job>) => {
          // Update job in jobs list
          state.jobs = state.jobs.map((j) =>
            j.id === action.payload.id ? action.payload : j
          );
          // If it's selected, update that too
          if (state.selectedJob?.id === action.payload.id) {
            state.selectedJob = action.payload;
          }
        }
      )
      .addCase(updateJob.fulfilled, (state, action: PayloadAction<Job>) => {
        state.jobs = state.jobs.map((j) =>
          j.id === action.payload.id ? action.payload : j
        );
        if (state.selectedJob?.id === action.payload.id) {
          state.selectedJob = action.payload;
        }
      });
  },
});

export const jobsReducer = jobsSlice.reducer;
