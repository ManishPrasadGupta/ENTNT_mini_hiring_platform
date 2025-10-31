import { useEffect, useState } from "react";

type JobStatus = "all" | "active" | "archived";

type JobSearchAndFilterProps = {
  onChange: (filter: { search: string; status: JobStatus }) => void;
  initialSearch?: string;
  initialStatus?: JobStatus;
};

export default function JobFilter({
  onChange,
  initialSearch = "",
  initialStatus = "all",
}: JobSearchAndFilterProps) {
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState<JobStatus>(initialStatus);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setStatus(e.target.value as JobStatus);
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange({ search, status });
    }, 300);

    return () => clearTimeout(handler);
  }, [search, status, onChange]);

  return (
    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mb-6 w-full">
      <input
        type="text"
        className="flex-1 border border-emerald-200 rounded-lg px-4 py-2 shadow-sm bg-white focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition placeholder:text-gray-400"
        placeholder="Search jobs..."
        value={search}
        onChange={handleSearchChange}
      />
      <select
        className="border border-emerald-200 rounded-lg px-3 py-2 shadow-sm bg-white focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition cursor-pointer"
        value={status}
        onChange={handleStatusChange}
      >
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="archived">Archived</option>
      </select>
    </div>
  );
}
