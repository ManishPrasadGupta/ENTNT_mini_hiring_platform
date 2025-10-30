import { Candidate, CandidateTimelineEntry, Job } from "@/types/types";
import Dexie, { Table } from "dexie";

export class AppDB extends Dexie {
  jobs!: Table<Job, string>;
  candidates!: Table<Candidate, string>;
  candidateTimelines!: Table<
    CandidateTimelineEntry & { candidateId: string },
    number
  >;

  constructor() {
    super("AppDB");
    this.version(1).stores({
      jobs: "id, title, slug, status, order, createdAt, updatedAt",
      candidates: "id, name, email, stage, jobId, createdAt, updatedAt",
      candidateTimelines: "++id, candidateId, timestamp, stage, by",
    });
  }
}

export const db = new AppDB();
