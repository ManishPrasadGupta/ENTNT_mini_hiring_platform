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
    phone: string;
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

  // Reset form when modal closes
  if (
    !open &&
    (form.name || form.email || form.phone || form.stage !== "applied")
  ) {
    setForm({ name: "", email: "", phone: "", stage: "applied" });
  }

  if (!open) return null;

  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-2xl p-7 w-[94vw] max-w-md border border-emerald-100">
        <h2 className="text-2xl font-extrabold text-emerald-700 mb-4 text-center">
          Create Candidate
        </h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await onSubmit(form);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1 font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={form.name}
              required
              className="w-full border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-lg px-3 py-2 transition"
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              required
              className="w-full border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-lg px-3 py-2 transition"
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              value={form.phone}
              required
              className="w-full border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-lg px-3 py-2 transition"
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Stage
            </label>
            <select
              className="w-full border border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-lg px-3 py-2 transition"
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
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-between gap-2 pt-1">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition disabled:opacity-70"
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
