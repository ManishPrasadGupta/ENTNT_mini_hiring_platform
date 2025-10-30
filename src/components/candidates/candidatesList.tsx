"use client";

import { Candidate } from "@/types/types";
import CandidatesCard from "./candidatesCard";

type CandidatesListProps = {
  candidates: Candidate[];
  isLoading?: boolean;
  onView?: (id: string) => void;
  onEmail?: (email: string) => void;
  total?: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export default function CandidatesList({
  candidates = [],
  isLoading = false,
  onView,
  total = 0,
  page,
  pageSize,
  onPageChange,
}: CandidatesListProps) {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      {/* Count */}
      <div className="text-gray-500 mb-2 text-sm">
        {isLoading
          ? "Loading candidates..."
          : `Showing ${candidates.length}${total ? ` of ${total}` : ""} candidate${candidates.length !== 1 ? "s" : ""}`}
      </div>
      {/* List */}
      <div className="bg-gray-50 rounded-xl p-6 max-h-[60vh] overflow-y-auto">
        {candidates.length === 0 && !isLoading && (
          <div className="text-center text-gray-400 py-12">
            No candidates found.
          </div>
        )}
        {candidates.map((candidate) => (
          <CandidatesCard
            key={candidate.id}
            candidate={candidate}
            onView={onView}
          />
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
