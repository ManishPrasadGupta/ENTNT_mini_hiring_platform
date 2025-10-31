"use client";

import { Candidate, CandidateStage } from "@/types/types";
import { Eye } from "lucide-react";

function getInitials(name: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Emerald-themed stage colors for consistency
const stageColors: Record<CandidateStage, string> = {
  applied: "bg-emerald-50 text-emerald-700",
  screen: "bg-emerald-100 text-emerald-800",
  tech: "bg-emerald-200 text-emerald-900",
  offer: "bg-emerald-100 text-emerald-700",
  hired: "bg-emerald-200 text-emerald-800",
  rejected: "bg-red-100 text-red-700",
};

type CandidatesCardProps = {
  candidate: Candidate;
  onView?: (id: string) => void;
};

export default function CandidatesCard({
  candidate,
  onView,
}: CandidatesCardProps) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-emerald-100 px-4 py-3 mb-2">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-base font-bold text-emerald-700">
        {getInitials(candidate.name)}
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-base text-gray-900 truncate">
          {candidate.name}
        </div>
        <div
          className="text-gray-500 text-xs truncate max-w-[120px]"
          title={candidate.email}
        >
          {candidate.email}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${stageColors[candidate.stage] || "bg-gray-100 text-gray-500"}`}
          >
            {candidate.stage}
          </span>
        </div>
      </div>
      {/* Actions */}
      <button
        className="text-emerald-300 hover:text-emerald-600 p-1 rounded transition-colors"
        aria-label="View"
        onClick={() => onView?.(candidate.id)}
      >
        <Eye size={18} />
      </button>
    </div>
  );
}
