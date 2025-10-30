import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Candidate, CandidateTimelineEntry } from "@/types/types";
import {
  fetchCandidates,
  createCandidate,
  updateCandidate,
  fetchCandidateTimeline,
  fetchCandidateById,
} from "./candidatesThunks";

export interface CandidatesState {
  candidates: Candidate[];
  total: number;
  timeline: Record<string, CandidateTimelineEntry[]>;
  loading: boolean;
  error?: string | null;
}

const initialState: CandidatesState = {
  candidates: [],
  total: 0,
  timeline: {},
  loading: false,
  error: null,
};

const candidatesSlice = createSlice({
  name: "candidates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Candidates
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCandidates.fulfilled,
        (
          state,
          action: PayloadAction<{ candidates: Candidate[]; total: number }>
        ) => {
          state.candidates = action.payload.candidates;
          state.total = action.payload.total;
          state.loading = false;
        }
      )
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Candidate
      .addCase(
        createCandidate.fulfilled,
        (state, action: PayloadAction<Candidate>) => {
          state.candidates.unshift(action.payload);
          state.total += 1;
        }
      )

      // Update Candidate
      .addCase(
        updateCandidate.fulfilled,
        (state, action: PayloadAction<Candidate>) => {
          state.candidates = state.candidates.map((c) =>
            c.id === action.payload.id ? action.payload : c
          );
        }
      )

      // Fetch Candidate Timeline
      .addCase(
        fetchCandidateTimeline.fulfilled,
        (
          state,
          action: PayloadAction<{
            id: string;
            timeline: CandidateTimelineEntry[];
          }>
        ) => {
          state.timeline[action.payload.id] = action.payload.timeline;
        }
      )

      .addCase(
        fetchCandidateById.fulfilled,
        (state, action: PayloadAction<Candidate>) => {
          const idx = state.candidates.findIndex(
            (c) => c.id === action.payload.id
          );
          if (idx >= 0) {
            state.candidates[idx] = action.payload;
          } else {
            state.candidates.push(action.payload);
          }
        }
      );
  },
});
console.log("CANDIDATES INITIAL STATE DEBUG", initialState);
export const candidatesReducer = candidatesSlice.reducer;
