"use client";

import { db } from "@/services/db";
import {
  seedAssessments,
  seedCandidates,
  seedJobsIfEmpty,
} from "@/services/seed";
import { useEffect } from "react";

export default function ClientSeedProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    async function maybeSeedAll() {
      if ((await db.jobs.count()) === 0) {
        await seedJobsIfEmpty();
      }
      if ((await db.candidates.count()) === 0) {
        await seedCandidates(1000);
      }
      if ((await db.assessments.count()) === 0) {
        await seedAssessments();
      }
    }
    maybeSeedAll();
  }, []);

  return <>{children}</>;
}
