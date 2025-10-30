"use client";
import { useState } from "react";
import {
  Candidate,
  CandidateStage,
  CandidateTimelineEntry,
} from "@/types/types";

const stageLabels: Record<CandidateStage, string> = {
  applied: "Applied",
  screen: "Screen",
  tech: "Technical",
  offer: "Offer",
  hired: "Hired",
  rejected: "Rejected",
};

const stageOptions = Object.entries(stageLabels);

function getInitials(name: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

type CandidateDetailProps = {
  candidate: Candidate;
  timeline: CandidateTimelineEntry[];
  onUpdateStage: (stage: CandidateStage, note?: string) => void;
  onAddNote: (note: string) => void;
  onBack: () => void;
};

export default function CandidateDetail({
  candidate,
  timeline,
  onUpdateStage,
  onAddNote,
  onBack,
}: CandidateDetailProps) {
  const [stage, setStage] = useState(candidate.stage);
  const [stageNote, setStageNote] = useState("");
  const [note, setNote] = useState("");

  // Group timeline by events, reverse chronological order
  const sortedTimeline = [...timeline].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="flex flex-col gap-8">
      <button
        className="flex items-center gap-2 text-sm text-gray-600 hover:underline mb-2"
        onClick={onBack}
      >
        ← Back to Candidates
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Profile & Actions */}
        <div className="flex flex-col gap-6">
          {/* Profile */}
          <div className="bg-white rounded-xl p-6 shadow border">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-gray-800 text-white flex items-center justify-center text-2xl font-bold">
                {getInitials(candidate.name)}
              </div>
              <div>
                <div className="text-2xl font-semibold">{candidate.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                    {stageLabels[candidate.stage]}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-5 space-y-2 text-gray-700">
              <div className="flex items-center gap-2">
                <span className="font-medium">📧</span> {candidate.email}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">📞</span> {candidate.phone}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">📅</span>
                Applied {new Date(candidate.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          {/* Update Stage */}
          <div className="bg-white rounded-xl p-6 shadow border">
            <div className="font-semibold text-lg mb-2">Update Stage</div>
            <select
              className="w-full border rounded px-3 py-2 mb-3"
              value={stage}
              onChange={(e) => setStage(e.target.value as CandidateStage)}
            >
              {stageOptions.map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
            <textarea
              className="w-full border rounded px-3 py-2 mb-3"
              placeholder="Add a note about this stage change (optional)..."
              value={stageNote}
              onChange={(e) => setStageNote(e.target.value)}
              rows={3}
            />
            <button
              className="w-full bg-gray-400 text-white font-semibold py-2 rounded disabled:opacity-50"
              onClick={() => {
                onUpdateStage(stage, stageNote);
                setStageNote("");
              }}
              disabled={stage === candidate.stage}
            >
              Update Stage
            </button>
          </div>
          {/* Add Note */}
          <div className="bg-white rounded-xl p-6 shadow border">
            <div className="font-semibold text-lg mb-2">Add Note</div>
            <textarea
              className="w-full border rounded px-3 py-2 mb-3"
              placeholder="Add a note... Use @username to mention team members"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
            <button
              className="w-full bg-gray-400 text-white font-semibold py-2 rounded disabled:opacity-50 flex items-center gap-2 justify-center"
              onClick={() => {
                onAddNote(note);
                setNote("");
              }}
              disabled={!note.trim()}
            >
              <span>💬</span> Add Note
            </button>
          </div>
        </div>
        {/* Right: Timeline */}
        <div className="bg-gray-50 rounded-xl p-6 shadow border flex-1">
          <div className="font-semibold text-lg mb-4">Timeline</div>
          <div className="space-y-6">
            {sortedTimeline.map((entry, i) => (
              <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gray-700 font-medium">
                    ● Stage changed
                  </span>
                  {entry.stage && (
                    <>
                      {entry.fromStage && (
                        <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-xs mx-1">
                          {stageLabels[entry.fromStage as CandidateStage] ||
                            entry.fromStage}
                        </span>
                      )}
                      <span>→</span>
                      <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-xs mx-1">
                        {stageLabels[entry.stage as CandidateStage] ||
                          entry.stage}
                      </span>
                    </>
                  )}
                  <span className="text-gray-500 text-xs ml-auto">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
                {entry.note && (
                  <div className="text-gray-700 mt-2 whitespace-pre-line">
                    {entry.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
