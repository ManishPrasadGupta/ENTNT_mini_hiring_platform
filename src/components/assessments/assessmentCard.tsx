import { AssessmentDashboardItem } from "@/store/features/assessments/assessmentsThunks";

type Props = {
  assessment: AssessmentDashboardItem;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function AssessmentCard({
  assessment,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const created = new Date(assessment.createdAt);
  const dateString = created.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-4 flex flex-col gap-2 border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">{assessment.title}</h2>
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
            assessment.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {assessment.status.charAt(0).toUpperCase() +
            assessment.status.slice(1)}
        </span>
      </div>
      <div className="flex flex-wrap gap-x-6 text-gray-600 text-sm">
        <span>💡 {assessment.questionsCount} questions</span>
        <span>📝 {assessment.responsesCount} responses</span>
        <span>📅 {dateString}</span>
        {/* <span>🏷️ {assessment.jobId}</span> */}
      </div>
      <div className="flex gap-2 mt-2">
        {onView && (
          <button
            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 text-sm font-semibold"
            onClick={() => onView(assessment.id)}
          >
            View
          </button>
        )}
        {onEdit && (
          <button
            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 text-sm"
            onClick={() => onEdit(assessment.id)}
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
            onClick={() => onDelete(assessment.id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
