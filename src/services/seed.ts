import { db } from "./db";
import {
  Candidate,
  CandidateStage,
  Job,
  JobStatus,
  JobType,
} from "@/types/types";
import { nanoid } from "nanoid";
import { faker } from "@faker-js/faker";

// Example tags, requirements, locations, and types
const tagsList = [
  ["engineering"],
  ["design"],
  ["sales"],
  ["remote"],
  ["urgent"],
  [],
];
const requirementsList = [
  ["3+ years experience", "Team player", "Good communicator"],
  ["Portfolio required", "Experience with Figma"],
  ["B2B sales", "CRM knowledge"],
  [],
];
const locations = ["Remote", "New York", "Berlin", "San Francisco", "London"];
const jobTypes: JobType[] = ["full-time", "part-time", "contract"];

export async function seedJobsIfEmpty() {
  const count = await db.jobs.count();
  if (count === 0) {
    const now = new Date().toISOString();
    const jobs: Job[] = Array.from({ length: 25 }).map((_, i) => {
      const status: JobStatus = Math.random() > 0.5 ? "active" : "archived";
      const title = `Job ${i + 1}`;
      return {
        id: nanoid(),
        title,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
        status,
        tags: tagsList[Math.floor(Math.random() * tagsList.length)],
        order: i,
        description: `This is a description for ${title}.`,
        requirements:
          requirementsList[Math.floor(Math.random() * requirementsList.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        type: jobTypes[Math.floor(Math.random() * jobTypes.length)],
        createdAt: now,
        updatedAt: now,
      };
    });
    await db.jobs.bulkAdd(jobs);
  }
}

export async function seedCandidates(count = 1000) {
  const stages: CandidateStage[] = [
    "applied",
    "screen",
    "tech",
    "offer",
    "hired",
    "rejected",
  ];
  const candidates: Candidate[] = [];

  for (let i = 0; i < count; i++) {
    const stage = faker.helpers.arrayElement(stages);
    candidates.push({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      stage,
      jobId: faker.string.uuid(),
      phone: faker.phone.number(),
      resume: "",
      notes: "",
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    });
  }
  await db.candidates.bulkAdd(candidates);
  console.log(`${count} candidates seeded.`);
}
