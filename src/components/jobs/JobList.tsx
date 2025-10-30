"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchJobs,
  toggleJobArchive,
  updateJob,
} from "@/store/features/Jobs/jobsThunks";
import JobCard from "./JobCard";
import { waitForMSWReady } from "@/lib/mswReady";
import { CreateJobFields, Job } from "@/types/types";
import CreateJobModal from "./CreateJobModal";

type JobListProps = {
  search?: string;
  status?: "all" | "active" | "archived";
};

function JobList({ search = "", status = "all" }: JobListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const { jobs, loading, error } = useSelector(
    (state: RootState) => state.jobs
  );

  const handleUpdateJob = (jobData: Job | CreateJobFields) => {
    // Only update if this is a full Job (edit mode)
    if ("id" in jobData) {
      dispatch(updateJob(jobData));
      setEditingJob(null);
    }
  };
  useEffect(() => {
    waitForMSWReady().then(() => {
      dispatch(fetchJobs());
    });
  }, [dispatch]);
  if (loading) return <div className="py-8 text-center">Loading jobs...</div>;
  if (error)
    return <div className="py-8 text-center text-red-500">Error: {error}</div>;
  if (!jobs?.length)
    return <div className="py-8 text-center text-gray-500">No jobs found.</div>;

  // Filter logic
  let filteredJobs = jobs;
  if (search) {
    filteredJobs = filteredJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        (job.description &&
          job.description.toLowerCase().includes(search.toLowerCase()))
    );
  }
  if (status !== "all") {
    filteredJobs = filteredJobs.filter((job) => job.status === status);
  }

  return (
    <>
      {filteredJobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onEdit={() => setEditingJob(job)}
          onArchive={() => dispatch(toggleJobArchive(job))}
        />
      ))}
      {editingJob && (
        <CreateJobModal
          open={true}
          initialData={editingJob}
          onClose={() => setEditingJob(null)}
          onCreate={handleUpdateJob}
          isEditMode={true}
        />
      )}
    </>
  );
}
export default JobList;
