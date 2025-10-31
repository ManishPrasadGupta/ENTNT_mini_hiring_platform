"use client";

import { Candidate, CandidateStage } from "@/types/types";
import CandidatesCard from "./candidatesCard";

const STAGES: { key: CandidateStage; label: string }[] = [
  { key: "applied", label: "Applied" },
  { key: "screen", label: "Screen" },
  { key: "tech", label: "Tech" },
  { key: "offer", label: "Offer" },
  { key: "hired", label: "Hired" },
  { key: "rejected", label: "Rejected" },
];

type CandidatesKanbanProps = {
  candidates: Candidate[];
  onView?: (id: string) => void;
};

export default function CandidatesKanban({
  candidates,
  onView,
}: CandidatesKanbanProps) {
  return (
    <div className="flex overflow-x-auto space-x-6 py-4">
      {STAGES.map((stage) => {
        const list = candidates.filter((c) => c.stage === stage.key);
        return (
          <div key={stage.key} className="w-72 shrink-0">
            <div className="font-semibold text-lg mb-2 text-center text-emerald-700">
              {stage.label}
            </div>
            <div className="bg-emerald-50 rounded-xl min-h-[100px] p-2 border border-emerald-100">
              {list.length === 0 ? (
                <div className="text-emerald-300 text-center py-4">
                  No candidates
                </div>
              ) : (
                list.map((candidate) => (
                  <CandidatesCard
                    key={candidate.id}
                    candidate={candidate}
                    onView={onView}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
