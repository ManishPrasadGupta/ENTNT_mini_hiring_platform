"use client";

import { db } from "@/services/db";
import { seedCandidates } from "@/services/seed";
import { useEffect } from "react";

export default function ClientSeedProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    async function maybeSeedCandidates() {
      const count = await db.candidates.count();
      if (count === 0) {
        await seedCandidates(1000);
      }
    }
    maybeSeedCandidates();
  }, []);

  return <>{children}</>;
}
