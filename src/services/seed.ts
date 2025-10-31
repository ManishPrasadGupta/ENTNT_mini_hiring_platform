import { db } from "./db";
import {
  Assessment,
  AssessmentQuestion,
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
  const jobs = await db.jobs.toArray();
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
      //  jobId: faker.string.uuid(),
      jobId: faker.helpers.arrayElement<Job>(jobs).id,
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

//assessments

// Generate a random question of various types
function randomQuestionType(): AssessmentQuestion {
  const types: AssessmentQuestion["type"][] = [
    "single-choice",
    "multi-choice",
    "short-text",
    "long-text",
    "numeric",
    "file-upload",
  ];
  const type = faker.helpers.arrayElement(types);

  const q: AssessmentQuestion = {
    id: faker.string.uuid(),
    label: faker.lorem.sentence(),
    type,
    required: faker.datatype.boolean(),
  };

  if (type === "single-choice" || type === "multi-choice") {
    q.options = faker.helpers.uniqueArray(
      () => faker.word.noun(),
      faker.number.int({ min: 3, max: 6 })
    );
  }
  if (type === "numeric") {
    q.min = faker.number.int({ min: 0, max: 10 });
    q.max = q.min + faker.number.int({ min: 10, max: 100 });
  }
  if (type === "short-text" || type === "long-text") {
    q.maxLength = faker.number.int({ min: 20, max: 200 });
  }
  if (Math.random() < 0.1) {
    q.condition = {
      questionId: "", // will be set later
      value: faker.word.noun(),
    };
  }
  return q;
}

/**
 * Generate a full assessment with at least 10 questions.
 */
function generateAssessment(job: Job, title: string): Assessment {
  const questions = Array.from(
    { length: 10 + faker.number.int(5) },
    randomQuestionType
  );

  questions.forEach((q, idx) => {
    if (q.condition && idx > 0) {
      q.condition.questionId = questions[0].id;
    }
  });

  // Always provide valid fields
  return {
    id: faker.string.uuid(),
    jobId: job.id as string,
    title: title || "Untitled Assessment",
    status: "active",
    createdAt: faker.date.past().toISOString(),
    questions: questions || [],
  };
}

export async function seedAssessments() {
  const existing = await db.assessments.count();
  if (existing > 0) {
    console.log("Assessments already seeded.");
    return;
  }
  let jobs = await db.jobs.toArray();
  if (jobs.length < 3) {
    jobs = [];
    for (let i = 0; i < 3; i++) {
      const jobTitle = faker.person.jobTitle();
      console.log(`Seeding job: ${jobTitle}`);
      jobs.push({
        id: faker.string.uuid(),
        title: jobTitle,
        slug: faker.helpers.slugify(jobTitle).toLowerCase(),
        status: "active",
        tags: [],
        order: i,
        description: faker.lorem.paragraph(),
        requirements: [faker.lorem.sentence()],
        location: faker.location.city(),
        type: faker.helpers.arrayElement(jobTypes),
        createdAt: faker.date.past().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    await db.jobs.bulkAdd(jobs);
  }

  // Seed assessments
  const assessmentTitles = [
    "AI Assessment",
    "Data Analytics Assessment",
    "Dev Assessment",
  ];

  for (let i = 0; i < 3; i++) {
    const assessment = generateAssessment(jobs[i], assessmentTitles[i]);
    await db.assessments.add(assessment);
  }
}

// If running directly...
if (typeof window !== "undefined") {
  seedAssessments().then(() => console.log("Seeded assessments"));
}
