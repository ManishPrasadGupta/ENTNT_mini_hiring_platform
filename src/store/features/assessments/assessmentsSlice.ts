import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Assessment,
  // AssessmentResponse
} from "@/types/types";
import {
  AssessmentDashboardItem,
  fetchAssessments,
  fetchAssessmentByJobId,
  saveAssessment,
  deleteAssessment,
  submitAssessmentResponse,
} from "./assessmentsThunks";

interface AssessmentsState {
  assessments: AssessmentDashboardItem[];
  loading: boolean;
  error: string | null;
  // For builder/details
  currentAssessment: Assessment | null;
  submitting: boolean;
  submitError: string | null;
}

const initialState: AssessmentsState = {
  assessments: [],
  loading: false,
  error: null,
  currentAssessment: null,
  submitting: false,
  submitError: null,
};

export const assessmentsSlice = createSlice({
  name: "assessments",
  initialState,
  reducers: {
    clearCurrentAssessment(state) {
      state.currentAssessment = null;
      state.error = null;
    },
    clearSubmitError(state) {
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard listing
      .addCase(fetchAssessments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAssessments.fulfilled,
        (state, action: PayloadAction<AssessmentDashboardItem[]>) => {
          state.assessments = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchAssessments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Single assessment fetch (for builder/view)
      .addCase(fetchAssessmentByJobId.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentAssessment = null;
      })
      .addCase(
        fetchAssessmentByJobId.fulfilled,
        (state, action: PayloadAction<Assessment>) => {
          state.currentAssessment = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchAssessmentByJobId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentAssessment = null;
      })
      // Save/update
      .addCase(saveAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        saveAssessment.fulfilled,
        (state, action: PayloadAction<Assessment>) => {
          state.currentAssessment = action.payload;
          state.loading = false;
        }
      )
      .addCase(saveAssessment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete
      .addCase(
        deleteAssessment.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.assessments = state.assessments.filter(
            (a) => a.id !== action.payload
          );
        }
      )
      .addCase(deleteAssessment.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Submit response
      .addCase(submitAssessmentResponse.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
      })
      .addCase(submitAssessmentResponse.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(submitAssessmentResponse.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload as string;
      });
  },
});

export const { clearCurrentAssessment, clearSubmitError } =
  assessmentsSlice.actions;
export const assessmentsReducer = assessmentsSlice.reducer;
