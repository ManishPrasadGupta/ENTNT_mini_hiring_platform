import { createAsyncThunk } from "@reduxjs/toolkit";
import { Candidate, CandidateStage } from "@/types/types";
import { candidatesApi } from "@/lib/apiClient";

// Thunks
export const fetchCandidates = createAsyncThunk(
  "candidates/fetchCandidates",
  async (
    params: {
      search?: string;
      stage?: CandidateStage | "all";
      page?: number;
      pageSize?: number;
    } = {},
    thunkAPI
  ) => {
    try {
      const res = await candidatesApi.getCandidates(params);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch candidates"
      );
    }
  }
);

export const createCandidate = createAsyncThunk(
  "candidates/createCandidate",
  async (candidate: Partial<Candidate>, thunkAPI) => {
    try {
      const res = await candidatesApi.createCandidate(candidate);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to create candidate"
      );
    }
  }
);

export const updateCandidate = createAsyncThunk(
  "candidates/updateCandidate",
  async (
    {
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Candidate> & { by?: string; timelineNote?: string };
    },
    thunkAPI
  ) => {
    try {
      const res = await candidatesApi.updateCandidate(id, updates);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to update candidate"
      );
    }
  }
);

export const fetchCandidateTimeline = createAsyncThunk(
  "candidates/fetchCandidateTimeline",
  async (id: string, thunkAPI) => {
    try {
      const res = await candidatesApi.getCandidateTimeline(id);
      return { id, timeline: res.data.timeline };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch timeline"
      );
    }
  }
);

export const fetchCandidateById = createAsyncThunk(
  "candidates/fetchCandidateById",
  async (id: string, thunkAPI) => {
    try {
      const res = await candidatesApi.getCandidateById(id);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch candidate"
      );
    }
  }
);
