"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAssessmentByJobId,
  deleteAssessment,
} from "@/store/features/assessments/assessmentsThunks";
import { RootState, AppDispatch } from "@/store";

export default function AssessmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentAssessment, loading } = useSelector(
    (state: RootState) => state.assessments
  );

  useEffect(() => {
    if (params?.id && typeof params.id === "string") {
      dispatch(fetchAssessmentByJobId(params.id));
    }
  }, [dispatch, params?.id]);

  if (loading || !currentAssessment) {
    return (
      <div className="py-12 text-center text-gray-500">Loading assessment…</div>
    );
  }

  const created = new Date(currentAssessment.createdAt).toLocaleDateString();
  const handleDelete = () => {
    dispatch(deleteAssessment(currentAssessment.id));
    router.push("/assessments");
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-100"
          onClick={() => router.back()}
        >
          ← Back
        </button>
        <div>
          <h1 className="text-2xl font-bold">Assessment Overview</h1>
          <div className="text-gray-500 text-sm">
            For Job:{" "}
            <span className="font-medium">{currentAssessment.jobId}</span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            className="px-3 py-1 rounded border border-blue-600 text-blue-700 hover:bg-blue-50 font-semibold"
            onClick={() => alert("Edit functionality coming soon")}
          >
            Edit
          </button>
          <button
            className="px-3 py-1 rounded border border-red-600 text-red-700 hover:bg-red-50 font-semibold"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Assessment Details Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border">
        <h2 className="text-lg font-semibold text-center mb-4">
          Assessment Details
        </h2>
        <div className="grid grid-cols-2 gap-6 items-start">
          <div>
            <label className="block text-gray-500 text-xs mb-1">
              Assessment Title
            </label>
            <input
              className="w-full p-2 rounded border bg-gray-50"
              value={currentAssessment.title}
              readOnly
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs mb-1">
              Description
            </label>
            <textarea
              className="w-full p-2 rounded border bg-gray-50"
              //   value={currentAssessment.description ?? ""}
              readOnly
              rows={2}
            />
          </div>
        </div>
        <div className="flex gap-6 mt-4 text-gray-400 text-xs">
          <span>
            Status:{" "}
            <b
              className={
                currentAssessment.status === "active"
                  ? "text-green-600"
                  : "text-gray-600"
              }
            >
              {currentAssessment.status}
            </b>
          </span>
          <span>
            Created: <b className="text-gray-600">{created}</b>
          </span>
        </div>
      </div>

      {/* Questions Section */}
      <div className="bg-gray-50 rounded-xl border p-4 mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-base">Questions</h3>
          <button
            className="flex items-center gap-1 px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 text-sm font-semibold"
            onClick={() => alert("Add Question coming soon")}
          >
            <span>＋</span> Add Question
          </button>
        </div>
        {currentAssessment.questions?.length ? (
          <ul className="divide-y">
            {currentAssessment.questions.map((q) => (
              <li key={q.id} className="py-2 flex items-center gap-2">
                <span className="text-gray-500">
                  {q.type === "single-choice" && "🔘"}
                  {q.type === "multi-choice" && "☑️"}
                  {q.type === "short-text" && "✏️"}
                  {q.type === "long-text" && "📝"}
                  {q.type === "numeric" && "#️⃣"}
                  {q.type === "file-upload" && "📎"}
                </span>
                <span className="font-medium">{q.label}</span>
                <span className="ml-auto text-xs text-gray-400">
                  {q.type.replace("-", " ")}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-400 text-center py-6">
            No questions added yet.
          </div>
        )}
      </div>
    </div>
  );
}
