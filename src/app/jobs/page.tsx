"use client";
import { useState } from "react";
import JobList from "@/components/jobs/JobList";
import CreateJobModal from "@/components/jobs/CreateJobModal";
import { Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { createJob } from "@/store/features/Jobs/jobsThunks";
import { waitForMSWReady } from "@/lib/mswReady";
import JobFilter from "@/components/jobs/JobFilter";

export default function JobsPage() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState({ search: "", status: "all" });
  const dispatch = useDispatch<AppDispatch>();

  const handleCreate = (job: any) => {
    const slug = job.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
    waitForMSWReady().then(() => {
      dispatch(createJob({ ...job, slug }));
    });
  };
  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-emerald-700">Jobs</h1>
          <p className="text-gray-600">
            Manage job postings and track applications
          </p>
        </div>
        <button
          className="flex items-center px-5 py-2 bg-black text-white rounded-lg shadow font-semibold hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
          onClick={() => setOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" /> Create Job
        </button>
      </div>
      <JobFilter onChange={setFilter} />
      <JobList
        search={filter.search}
        status={filter.status as "all" | "active" | "archived" | undefined}
      />
      <CreateJobModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={handleCreate}
      />
    </main>
  );
}
