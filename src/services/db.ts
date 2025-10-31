import {
  Candidate,
  CandidateTimelineEntry,
  Job,
  Assessment,
  AssessmentResponse,
} from "@/types/types";
import Dexie, { Table } from "dexie";

export class AppDB extends Dexie {
  jobs!: Table<Job, string>;
  candidates!: Table<Candidate, string>;
  candidateTimelines!: Table<
    CandidateTimelineEntry & { candidateId: string },
    number
  >;
  assessments!: Table<Assessment, string>;
  assessmentResponses!: Table<AssessmentResponse, string>;

  constructor() {
    super("AppDB");
    this.version(1).stores({
      jobs: "id, title, slug, status, order, createdAt, updatedAt",
      candidates: "id, name, email, stage, jobId, createdAt, updatedAt",
      candidateTimelines: "++id, candidateId, timestamp, stage, by",
      assessments: "id, jobId, title, status, createdAt",
      assessmentResponses: "id, assessmentId, candidateId, submittedAt",
    });
  }
}

export const db = new AppDB();
