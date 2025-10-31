import { AssessmentDashboardItem } from "@/store/features/assessments/assessmentsThunks";
import AssessmentCard from "./assessmentCard";

type Props = {
  assessments: AssessmentDashboardItem[];
  isLoading?: boolean;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function AssessmentList({
  assessments,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: Props) {
  if (isLoading)
    return (
      <div className="py-12 text-center text-gray-500">
        Loading assessments…
      </div>
    );
  if (!assessments.length)
    return (
      <div className="py-12 text-center text-gray-400">
        No assessments found.
      </div>
    );

  return (
    <div>
      {assessments.map((a) => (
        <AssessmentCard
          key={a.id}
          assessment={a}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
