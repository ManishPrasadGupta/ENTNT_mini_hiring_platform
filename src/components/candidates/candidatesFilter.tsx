"use client";

import { CandidateStage } from "@/types/types";
import { ChangeEvent } from "react";

type CandidatesFilterProps = {
  search: string;
  stage: CandidateStage | "all";
  view: "list" | "kanban";
  onSearch: (search: string) => void;
  onStageChange: (stage: CandidateStage | "all") => void;
  onViewChange: (view: "list" | "kanban") => void;
};

const stageOptions: { value: CandidateStage | "all"; label: string }[] = [
  { value: "all", label: "All stages" },
  { value: "applied", label: "Applied" },
  { value: "screen", label: "Screening" },
  { value: "tech", label: "Technical" },
  { value: "offer", label: "Offer" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

export default function CandidatesFilter({
  search,
  stage,
  view,
  onSearch,
  onStageChange,
  onViewChange,
}: CandidatesFilterProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
      {/* Search Input */}
      <div className="flex-1">
        <input
          type="text"
          className="w-full border border-emerald-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition placeholder:text-gray-400"
          placeholder="Search candidates by name or email..."
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onSearch(e.target.value)
          }
        />
      </div>
      {/* Stage Filter */}
      <div>
        <select
          className="border border-emerald-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition cursor-pointer"
          value={stage}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            onStageChange(e.target.value as CandidateStage | "all")
          }
        >
          {stageOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {/* View Switcher */}
      <div className="flex gap-1 ml-auto">
        <button
          onClick={() => onViewChange("list")}
          className={`px-4 py-2 rounded transition border font-medium ${
            view === "list"
              ? "bg-emerald-700 text-white border-emerald-700 shadow"
              : "bg-white text-gray-800 border-emerald-200 hover:bg-emerald-50"
          }`}
        >
          List
        </button>
        <button
          onClick={() => onViewChange("kanban")}
          className={`px-4 py-2 rounded transition border font-medium ${
            view === "kanban"
              ? "bg-emerald-700 text-white border-emerald-700 shadow"
              : "bg-white text-gray-800 border-emerald-200 hover:bg-emerald-50"
          }`}
        >
          Kanban
        </button>
      </div>
    </div>
  );
}
