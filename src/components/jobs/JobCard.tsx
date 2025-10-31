"use client";

import { Job } from "@/types/types";
import { Archive, Eye, SquarePen, Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";

type JobCardProps = {
  job: Job;
  onEdit?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
};

const statusBadge = (status: Job["status"]) => {
  const label = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Unknown";
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-colors duration-200 ${
        status === "active"
          ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
          : "bg-gray-200 text-gray-700 border border-gray-300"
      }`}
    >
      {label}
    </span>
  );
};

function JobCard({ job, onEdit, onArchive }: JobCardProps) {
  const router = useRouter();
  const isArchived = job.status === "archived";

  return (
    <div
      className={`group relative overflow-hidden bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-4 transition-all duration-300
      hover:shadow-emerald-200 hover:border-emerald-300 hover:-translate-y-1
      ${isArchived ? "opacity-60 grayscale cursor-not-allowed" : ""}
      `}
    >
      {/* Optional overlay */}
      {isArchived && (
        <div className="absolute inset-0 bg-emerald-100 bg-opacity-70 flex items-center justify-center z-10 pointer-events-none transition-all">
          <span className="text-emerald-700 font-bold text-lg tracking-wide select-none">
            Archived
          </span>
        </div>
      )}
      <div className="flex flex-row items-start justify-between relative z-20">
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-gray-800 group-hover:text-emerald-700 transition-colors duration-200">
              {job.title}
            </h2>
            {statusBadge(job.status)}
          </div>
          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium border border-emerald-100 transition-colors duration-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-4 mt-2 text-gray-500 text-sm">
            {job.location && <span>{job.location}</span>}
            {job.type && (
              <span className="capitalize">{job.type.replace("-", " ")}</span>
            )}
          </div>
        </div>
        <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
          <button
            className="bg-white border border-gray-200 p-2 rounded-lg shadow-sm hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            onClick={() => router.push(`/jobs/${job.id}`)}
            aria-label="View"
            title="View"
            disabled={isArchived}
            tabIndex={isArchived ? -1 : undefined}
          >
            <Eye className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
          </button>
          <button
            className="bg-white border border-gray-200 p-2 rounded-lg shadow-sm hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            onClick={onEdit}
            aria-label="Edit"
            title="Edit"
            disabled={isArchived}
            tabIndex={isArchived ? -1 : undefined}
          >
            <SquarePen className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
          </button>
          <button
            className={
              "bg-white border border-gray-200 p-2 rounded-lg shadow-sm " +
              "hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-150 " +
              "focus:outline-none focus:ring-2 focus:ring-emerald-300"
            }
            onClick={onArchive}
            aria-label={isArchived ? "Unarchive" : "Archive"}
            title={isArchived ? "Unarchive" : "Archive"}
          >
            {isArchived ? (
              <Undo2 className="w-5 h-5 text-emerald-700" />
            ) : (
              <Archive className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
            )}
          </button>
        </div>
      </div>
      {job.description && (
        <div className="text-gray-600 mt-4 text-base leading-relaxed relative z-20">
          {job.description}
        </div>
      )}
      <div className="absolute inset-0 pointer-events-none rounded-2xl border border-transparent group-hover:border-emerald-200 transition-all duration-300" />
    </div>
  );
}

export default JobCard;
