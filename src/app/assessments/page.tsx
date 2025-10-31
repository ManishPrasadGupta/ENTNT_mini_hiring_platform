"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchAssessments,
  deleteAssessment,
} from "@/store/features/assessments/assessmentsThunks";
import AssessmentList from "@/components/assessments/assessmentList";
import AssessmentFilter from "@/components/assessments/assessmentFilter";
import { waitForMSWReady } from "@/lib/mswReady";
import { useRouter } from "next/navigation";

export default function AssessmentsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { assessments, loading } = useSelector(
    (state: RootState) => state.assessments
  );

  console.log("Assessments", assessments.slice(0, 5));
  const [search, setSearch] = useState("");

  useEffect(() => {
    waitForMSWReady().then(() => {
      dispatch(fetchAssessments());
    });
  }, [dispatch]);

  // Simple onSearch client filter (can be replaced with server query)
  const filtered = Array.isArray(assessments)
    ? assessments.filter((a) =>
        a.title.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  console.log("Filtered", filtered);
  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Assessments</h1>
          <div className="text-gray-500">
            Build and manage job-specific assessments and quizzes
          </div>
        </div>
        <button className="bg-gray-900 text-white rounded px-4 py-2 hover:bg-gray-700">
          + New Assessment
        </button>
      </div>
      <AssessmentFilter search={search} onSearch={setSearch} />

      {/* Dashboard stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-4">
          <span className="text-3xl">📋</span>
          <div>
            <div className="font-bold text-lg">{assessments.length}</div>
            <div className="text-gray-500 text-sm">Total Assessments</div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 flex items-center gap-4">
          <span className="text-3xl">💼</span>
          <div>
            <div className="font-bold text-lg">
              {Array.isArray(assessments)
                ? [...new Set(assessments.map((a) => a.jobId))].length
                : 0}
            </div>
            <div className="text-gray-500 text-sm">Active Jobs</div>
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 flex items-center gap-4">
          <span className="text-3xl">👁️</span>
          <div>
            <div className="font-bold text-lg">
              {Array.isArray(assessments)
                ? assessments.reduce(
                    (acc, a) => acc + (a.responsesCount || 0),
                    0
                  )
                : 0}
            </div>
            <div className="text-gray-500 text-sm">Total Responses</div>
          </div>
        </div>
      </div>

      <AssessmentList
        assessments={filtered}
        isLoading={loading}
        onView={(id) => router.push(`/assessments/${id}`)}
        onEdit={(id) => router.push(`/assessments/${id}/edit`)}
        onDelete={(id) => dispatch(deleteAssessment(id))}
      />
    </div>
  );
}
