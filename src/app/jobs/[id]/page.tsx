"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobById } from "@/store/features/Jobs/jobsThunks";
import { RootState, AppDispatch } from "@/store";
import { ArrowLeft } from "lucide-react";
import { waitForMSWReady } from "@/lib/mswReady";

export default function JobDetailsPage() {
  const params = useParams();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {
    selectedJob: job,
    loading,
    error,
  } = useSelector((state: RootState) => state.jobs);

  useEffect(() => {
    if (id) {
      waitForMSWReady().then(() => {
        dispatch(fetchJobById(id));
      });
    }
  }, [id, dispatch]);

  if (loading)
    return (
      <div className="py-16 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-600"></div>
      </div>
    );
  if (error)
    return (
      <div className="py-12 text-center text-red-500 text-lg min-h-screen flex items-center justify-center">
        {error}
      </div>
    );
  if (!job)
    return (
      <div className="py-12 text-center text-gray-500 text-base min-h-screen flex items-center justify-center">
        Job not found.
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100 px-2 md:px-0 transition-all duration-500">
      <div className="w-full max-w-xl bg-white/90 p-8 md:p-10 rounded-2xl shadow-2xl transition-all duration-500 animate-fade-in">
        <button
          onClick={() => router.back()}
          className="mb-7 flex items-center gap-2 text-blue-600 hover:underline hover:text-blue-800 text-base transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Jobs
        </button>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight transition-colors duration-300 hover:text-blue-700">
            {job.title}
          </h1>
          <span
            className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-full font-semibold text-sm transition-colors duration-200 ${
              job.status === "active"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-gray-200 text-gray-700 border border-gray-300"
            }`}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
              <circle cx={8} cy={8} r={8} />
            </svg>
            {job.status}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-gray-600 text-base mb-6">
          {job.location && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 font-medium transition-all hover:bg-blue-100 hover:text-blue-700">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <circle cx={12} cy={10} r={3} />
              </svg>
              {job.location}
            </span>
          )}
          {job.type && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 font-medium transition-all hover:bg-blue-100 hover:text-blue-700 capitalize">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <rect width={16} height={12} x={4} y={6} rx={2} />
              </svg>
              {job.type.replace("-", " ")}
            </span>
          )}
        </div>
        <div className="mb-7 text-gray-800 text-lg leading-relaxed bg-white/80 rounded-xl p-6 shadow transition-all duration-300 animate-slide-up">
          {job.description}
        </div>
        {job.tags && job.tags.length > 0 && (
          <div className="mb-5">
            <div className="font-semibold text-base text-gray-600 mb-2">
              Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:bg-blue-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        {job.requirements && job.requirements.length > 0 && (
          <div>
            <div className="font-semibold text-base text-gray-600 mb-2">
              Requirements
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-base">
              {job.requirements.map((req) => (
                <li
                  key={req}
                  className="transition-all duration-300 animate-fade-in"
                >
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}
        <style jsx global>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(24px);
            }
            to {
              opacity: 1;
              transform: none;
            }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease;
          }
          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(32px);
            }
            to {
              opacity: 1;
              transform: none;
            }
          }
          .animate-slide-up {
            animation: slide-up 0.7s cubic-bezier(0.4, 1.7, 0.7, 1);
          }
        `}</style>
      </div>
    </div>
  );
}
