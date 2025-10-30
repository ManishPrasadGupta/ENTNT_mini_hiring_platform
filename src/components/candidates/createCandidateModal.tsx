"use client";

import { useState } from "react";
import { CandidateStage } from "@/types/types";

const stageOptions: { value: CandidateStage; label: string }[] = [
  { value: "applied", label: "Applied" },
  { value: "screen", label: "Screen" },
  { value: "tech", label: "Tech" },
  { value: "offer", label: "Offer" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

type CreateCandidateModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (candidate: {
    name: string;
    email: string;
    stage: CandidateStage;
  }) => Promise<void> | void;
  submitting?: boolean;
  error?: string | null;
};

export default function CreateCandidateModal({
  open,
  onClose,
  onSubmit,
  submitting = false,
  error,
}: CreateCandidateModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    stage: "applied" as CandidateStage,
  });

  if (
    !open &&
    (form.name || form.email || form.phone || form.stage !== "applied")
  ) {
    setForm({ name: "", email: "", phone: "", stage: "applied" });
  }

  if (!open) return null;

  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[94vw] max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Candidate</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onSubmit(form);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              value={form.name}
              required
              className="w-full border rounded px-3 py-2"
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={form.email}
              required
              className="w-full border rounded px-3 py-2"
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Phone </label>
            <input
              type="tel"
              value={form.phone}
              required
              className="w-full border rounded px-3 py-2"
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Stage</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={form.stage}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  stage: e.target.value as CandidateStage,
                }))
              }
            >
              {stageOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <div className="flex justify-between gap-2 pt-1">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
