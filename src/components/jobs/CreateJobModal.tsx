import { useState, useRef, useEffect } from "react";
import { CreateJobFields, Job, JobStatus, JobType } from "@/types/types";
import { Plus, X } from "lucide-react";

type CreateJobModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (job: CreateJobFields | Job) => void;
  initialData?: Job;
  isEditMode?: boolean;
};

export default function CreateJobModal({
  open,
  onClose,
  onCreate,
  initialData,
  isEditMode,
}: CreateJobModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<JobType | "">("");
  const [status, setStatus] = useState<JobStatus>("active");
  const [requirementInput, setRequirementInput] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const requirementInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Modern transition logic: fade/slide modal in/out
  useEffect(() => {
    if (initialData && isEditMode) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setLocation(initialData.location || "");
      setType(initialData.type || "");
      setStatus(initialData.status || "active");
      setRequirements(initialData.requirements ?? []);
      setTags(initialData.tags ?? []);
    } else if (!open) {
      setTitle("");
      setDescription("");
      setLocation("");
      setType("");
      setStatus("active");
      setRequirements([]);
      setRequirementInput("");
      setTags([]);
      setTagInput("");
    }
  }, [initialData, isEditMode, open]);

  function handleAddRequirement() {
    const val = requirementInput.trim();
    if (val && !requirements.includes(val)) {
      setRequirements((prev) => [...prev, val]);
    }
    setRequirementInput("");
    requirementInputRef.current?.focus();
  }

  function handleRemoveRequirement(val: string) {
    setRequirements((prev) => prev.filter((r) => r !== val));
  }

  function handleAddTag() {
    const val = tagInput.trim();
    if (val && !tags.includes(val)) {
      setTags((prev) => [...prev, val]);
    }
    setTagInput("");
    tagInputRef.current?.focus();
  }

  function handleRemoveTag(val: string) {
    setTags((prev) => prev.filter((t) => t !== val));
  }

  function handleTagInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  }
  function handleRequirementInputKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddRequirement();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const jobData = {
      title,
      description: description || undefined,
      location: location || undefined,
      type: type || undefined,
      status,
      requirements: requirements.length ? requirements : undefined,
      tags,
    };

    if (isEditMode && initialData) {
      onCreate({
        ...initialData,
        ...jobData,
      });
    } else {
      onCreate(jobData);
      setTitle("");
      setDescription("");
      setLocation("");
      setType("");
      setStatus("active");
      setRequirements([]);
      setRequirementInput("");
      setTags([]);
      setTagInput("");
    }

    onClose();
  }

  // Animation classes
  const backdropClass = open
    ? "opacity-100 pointer-events-auto"
    : "opacity-0 pointer-events-none";
  const modalClass = open
    ? "animate-modal-in"
    : "animate-modal-out pointer-events-none";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${backdropClass}`}
      aria-modal="true"
      role="dialog"
      style={{ transitionProperty: "opacity" }}
    >
      <div
        className={`relative bg-linear-to-br from-white via-blue-50 to-blue-100 px-7 py-8 rounded-3xl shadow-2xl border w-full max-w-md transition-all duration-300 ${modalClass}`}
        style={{ transitionProperty: "opacity, transform" }}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="mb-7 text-3xl font-bold tracking-tight text-gray-800 text-center uppercase letter-spacing-wide">
          {isEditMode ? "Edit Job" : "Create Job"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg p-3 text-lg transition disabled:opacity-50"
              placeholder="e.g., Frontend Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg p-3 min-h-20 text-base transition"
              placeholder="Describe the job..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Location
              </label>
              <input
                className="w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg p-3 text-base transition"
                placeholder="e.g., Remote, New York"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Type
              </label>
              <select
                className="w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg p-3 text-base transition"
                value={type}
                onChange={(e) => setType(e.target.value as JobType)}
              >
                <option value="">Select type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-lg p-3 text-base transition"
                value={status}
                onChange={(e) => setStatus(e.target.value as JobStatus)}
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex">
                <input
                  className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-l-lg p-3 text-base transition"
                  placeholder="e.g, remote"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  ref={tagInputRef}
                  onKeyDown={handleTagInputKeyDown}
                />
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg px-4"
                  onClick={handleAddTag}
                  tabIndex={-1}
                >
                  <Plus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                      onClick={() => handleRemoveTag(tag)}
                      aria-label={`Remove ${tag}`}
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Requirements
            </label>
            <div className="flex">
              <input
                className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-l-lg p-3 text-base transition"
                placeholder="e.g., 3+ years experience"
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                ref={requirementInputRef}
                onKeyDown={handleRequirementInputKeyDown}
              />
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg px-4"
                onClick={handleAddRequirement}
                tabIndex={-1}
              >
                <Plus />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {requirements.map((req) => (
                <span
                  key={req}
                  className="inline-flex items-center bg-green-100 text-green-800 rounded-full px-3 py-1 text-xs font-medium"
                >
                  {req}
                  <button
                    type="button"
                    className="ml-2 text-green-500 hover:text-green-700 focus:outline-none"
                    onClick={() => handleRemoveRequirement(req)}
                    aria-label={`Remove ${req}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-semibold shadow-lg text-lg transition-all duration-200"
            >
              {isEditMode ? "Update" : "Create"}
            </button>
          </div>
        </form>
        <style jsx global>{`
          @keyframes modal-in {
            from {
              opacity: 0;
              transform: translateY(32px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: none;
            }
          }
          @keyframes modal-out {
            from {
              opacity: 1;
              transform: none;
            }
            to {
              opacity: 0;
              transform: translateY(32px) scale(0.98);
            }
          }
          .animate-modal-in {
            animation: modal-in 0.35s cubic-bezier(0.4, 1.7, 0.7, 1) forwards;
          }
          .animate-modal-out {
            animation: modal-out 0.2s ease forwards;
          }
        `}</style>
      </div>
    </div>
  );
}
