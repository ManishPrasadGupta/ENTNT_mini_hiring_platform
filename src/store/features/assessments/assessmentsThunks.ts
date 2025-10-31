import { createAsyncThunk } from "@reduxjs/toolkit";
import { Assessment, AssessmentResponse } from "@/types/types";
import { assessmentsApi } from "@/lib/apiClient";

// Dashboard listing item type (from your API and types)
export type AssessmentDashboardItem = Assessment & {
  questionsCount: number;
  responsesCount: number;
};

// Fetch all assessments for dashboard
export const fetchAssessments = createAsyncThunk<AssessmentDashboardItem[]>(
  "assessments/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await assessmentsApi.getAssessments();
      console.log("Fetched assessments:", res.data);

      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch assessments");
    }
  }
);

// Fetch single assessment by job id (for builder/editor)
export const fetchAssessmentByJobId = createAsyncThunk<Assessment, string>(
  "assessments/fetchByJobId",
  async (jobId, { rejectWithValue }) => {
    try {
      const res = await assessmentsApi.getAssessmentByJobId(jobId);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch assessment");
    }
  }
);

// Save/update assessment for a job
export const saveAssessment = createAsyncThunk<
  Assessment,
  { jobId: string; assessment: Partial<Assessment> }
>("assessments/save", async ({ jobId, assessment }, { rejectWithValue }) => {
  try {
    const res = await assessmentsApi.putAssessment(jobId, assessment);
    return res.data;
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to save assessment");
  }
});

// Delete assessment
export const deleteAssessment = createAsyncThunk<string, string>(
  "assessments/delete",
  async (assessmentId, { rejectWithValue }) => {
    try {
      await assessmentsApi.deleteAssessment(assessmentId);
      return assessmentId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete assessment");
    }
  }
);

// Submit an assessment response
export const submitAssessmentResponse = createAsyncThunk<
  AssessmentResponse,
  { jobId: string; candidateId: string; answers: Record<string, any> }
>(
  "assessments/submitResponse",
  async ({ jobId, candidateId, answers }, { rejectWithValue }) => {
    try {
      const res = await assessmentsApi.submitAssessmentResponse(jobId, {
        candidateId,
        answers,
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to submit response");
    }
  }
);
