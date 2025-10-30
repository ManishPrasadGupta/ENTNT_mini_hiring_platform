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
          ? "bg-green-100 text-green-700 border border-green-300"
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
      className={`group relative overflow-hidden bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-4 transition-all duration-300 hover:shadow-2xl hover:border-blue-300 hover:-translate-y-1
      ${isArchived ? "opacity-60 grayscale cursor-not-allowed" : ""}
      `}
    >
      {/* Optional overlay */}
      {isArchived && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-60 flex items-center justify-center z-10 pointer-events-none transition-all">
          <span className="text-gray-600 font-bold text-lg tracking-wide select-none">
            Archived
          </span>
        </div>
      )}
      <div className="flex flex-row items-start justify-between relative z-20">
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-gray-800 group-hover:text-blue-700 transition-colors duration-200">
              {job.title}
            </h2>
            {statusBadge(job.status)}
          </div>
          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200"
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
            className="bg-white border border-gray-200 p-2 rounded-lg shadow-sm hover:bg-blue-50 hover:border-blue-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => router.push(`/jobs/${job.id}`)}
            aria-label="View"
            title="View"
            disabled={isArchived}
            tabIndex={isArchived ? -1 : undefined}
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            className="bg-white border border-gray-200 p-2 rounded-lg shadow-sm hover:bg-blue-50 hover:border-blue-400 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={onEdit}
            aria-label="Edit"
            title="Edit"
            disabled={isArchived}
            tabIndex={isArchived ? -1 : undefined}
          >
            <SquarePen className="w-5 h-5" />
          </button>
          <button
            className={
              "bg-white border border-gray-200 p-2 rounded-lg shadow-sm " +
              "hover:bg-blue-50 hover:border-blue-400 transition-all duration-150 " +
              "focus:outline-none focus:ring-2 focus:ring-blue-400"
            }
            onClick={onArchive}
            aria-label={isArchived ? "Unarchive" : "Archive"}
            title={isArchived ? "Unarchive" : "Archive"}
            // Allow unarchive even if archived
          >
            {isArchived ? (
              <Undo2 className="w-5 h-5" />
            ) : (
              <Archive className="w-5 h-5" />
            )}
          </button>
          {/* <button
            className="bg-red-500 text-white p-2 rounded-lg shadow-sm hover:bg-red-700 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
            onClick={onDelete}
            aria-label="Delete"
            title="Delete"
            disabled={isArchived}
            tabIndex={isArchived ? -1 : undefined}
          >
            <Trash2 className="w-5 h-5" />
          </button> */}
        </div>
      </div>
      {job.description && (
        <div className="text-gray-600 mt-4 text-base leading-relaxed relative z-20">
          {job.description}
        </div>
      )}
      <div className="absolute inset-0 pointer-events-none rounded-2xl border border-transparent group-hover:border-blue-200 transition-all duration-300" />
    </div>
  );
}

export default JobCard;
