"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import {
  fetchCandidateById,
  fetchCandidateTimeline,
  updateCandidate,
} from "@/store/features/candidates/candidatesThunks";
import { RootState, AppDispatch } from "@/store";
import CandidateDetail from "@/components/candidates/candidateDetail";
import { waitForMSWReady } from "@/lib/mswReady";

export default function CandidateDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const candidate = useSelector((state: RootState) =>
    state.candidates.candidates.find((c) => c.id === id)
  );
  const timeline = useSelector(
    (state: RootState) => state.candidates.timeline[id] || []
  );

  useEffect(() => {
    waitForMSWReady().then(() => {
      dispatch(fetchCandidateById(id));
      dispatch(fetchCandidateTimeline(id));
    });
  }, [dispatch, id]);

  if (!candidate) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto pt-8">
      <CandidateDetail
        candidate={candidate}
        timeline={timeline}
        onUpdateStage={(newStage, note) => {
          dispatch(
            updateCandidate({
              id: candidate.id,
              updates: {
                stage: newStage,
                timelineNote: note,
                by: "CurrentUser",
              },
            })
          ).then(() => {
            dispatch(fetchCandidateTimeline(candidate.id));
            dispatch(fetchCandidateById(candidate.id));
          });
        }}
        onAddNote={(note) => {
          dispatch(
            updateCandidate({
              id: candidate.id,
              updates: { timelineNote: note, by: "CurrentUser" },
            })
          ).then(() => {
            dispatch(fetchCandidateTimeline(candidate.id));
          });
        }}
        onBack={() => router.push("/candidates")}
      />
    </div>
  );
}
