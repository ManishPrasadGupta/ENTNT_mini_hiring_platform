"use client";
import { useEffect, useState } from "react";
import { CandidateStage } from "@/types/types";
import { fetchCandidates } from "@/store/features/candidates/candidatesThunks";
import CandidatesFilter from "@/components/candidates/candidatesFilter";
import CandidatesList from "@/components/candidates/candidatesList";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { waitForMSWReady } from "@/lib/mswReady";
import CandidatesKanban from "@/components/candidates/candidatesKanban";
import { useRouter } from "next/navigation";

export default function CandidatesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { candidates, loading, total } = useSelector(
    (state: RootState) => state.candidates
  );

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  // Filter/search/view state (local)
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<CandidateStage | "all">("all");
  const [view, setView] = useState<"list" | "kanban">("list");

  useEffect(() => {
    waitForMSWReady().then(() => {
      dispatch(fetchCandidates({ search, stage, page, pageSize }));
    });
  }, [dispatch, search, stage, page, pageSize]);

  useEffect(() => {
    waitForMSWReady().then(() => {
      dispatch(fetchCandidates({ search, stage }));
    });
  }, [dispatch, search, stage]);

  // Reset to first page when search/stage changes
  useEffect(() => {
    setPage(1);
  }, [search, stage]);

  return (
    <div className="max-w-4xl mx-auto pt-8">
      <h1 className="text-3xl font-bold mb-1">Candidates</h1>
      <div className="text-gray-500 mb-6">
        Manage your candidate pipeline and hiring process
      </div>

      <CandidatesFilter
        search={search}
        stage={stage}
        view={view}
        onSearch={setSearch}
        onStageChange={setStage}
        onViewChange={setView}
      />

      {view === "list" && (
        <CandidatesList
          candidates={candidates}
          isLoading={loading}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onView={(id) => router.push(`/candidates/${id}`)}
        />
      )}

      {view === "kanban" && (
        <div className="text-center text-gray-400 py-12">
          <CandidatesKanban
            candidates={candidates}
            onView={(id) => router.push(`/candidates/${id}`)}
          />
        </div>
      )}
    </div>
  );
}
