import { http, HttpResponse } from "msw";
import { db } from "../db";
import { Assessment, AssessmentResponse, Candidate, Job } from "@/types/types";

// Artificial delay for realism
function randomDelay() {
  return new Promise((resolve) =>
    setTimeout(resolve, 200 + Math.random() * 1000)
  );
}

// function maybeError() {
//   if (Math.random() < 0.1) throw new Error("Simulated write error");
// }

export const handlers = [
  // GET /jobs (list/paginate/filter/sort)
  http.get("/jobs", async ({ request }) => {
    await randomDelay();
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
    const sort = url.searchParams.get("sort") || "order";

    let collection = await db.jobs.toArray();

    // Apply search filter
    if (search) {
      collection = collection.filter((j) =>
        j.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (status) {
      collection = collection.filter((j) => j.status === status);
    }

    // Always sort!
    collection = collection.sort((a, b) => {
      const aVal = a[sort as keyof Job];
      const bVal = b[sort as keyof Job];

      if (aVal === undefined && bVal === undefined) return 0;
      if (aVal === undefined) return 1;
      if (bVal === undefined) return -1;
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    });

    const total = collection.length;
    const paged = collection.slice((page - 1) * pageSize, page * pageSize);

    return HttpResponse.json({ jobs: paged, total });
  }),

  // POST /jobs (create)
  http.post("/jobs", async ({ request }) => {
    await randomDelay();
    // maybeError();
    const data = await request.json();

    if (!data || typeof data !== "object") {
      return HttpResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    // Slug uniqueness check
    const existing = await db.jobs.where("slug").equals(data.slug).first();
    if (existing != undefined) {
      return HttpResponse.json(
        { message: "Slug must be unique" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const job: Job = {
      id: data.id || crypto.randomUUID(),
      title: data.title,
      slug: data.slug,
      status: data.status,
      tags: data.tags ?? [],
      order:
        typeof data.order === "number" ? data.order : await db.jobs.count(),
      description: data.description ?? "",
      requirements: data.requirements ?? [],
      location: data.location ?? "",
      type: data.type ?? undefined,
      createdAt: now,
      updatedAt: now,
    };
    await db.jobs.add(job);
    return HttpResponse.json(job, { status: 201 });
  }),

  // PATCH /jobs/:id/reorder (drag-and-drop reorder)
  http.patch("/jobs/:id/reorder", async ({ request }) => {
    await randomDelay();
    if (Math.random() < 0.1) {
      return HttpResponse.json(
        { message: "Failed to reorder" },
        { status: 500 }
      );
    }
    const body = (await request.json()) as {
      fromOrder: number;
      toOrder: number;
    };
    const { fromOrder, toOrder } = body;
    const jobs = await db.jobs.orderBy("order").toArray();
    const fromIdx = jobs.findIndex((j) => j.order === fromOrder);
    if (fromIdx === -1)
      return HttpResponse.json({ message: "Job not found" }, { status: 404 });

    const [job] = jobs.splice(fromIdx, 1);
    jobs.splice(toOrder, 0, job);

    // Update orders
    await Promise.all(
      jobs.map((j, idx) => db.jobs.update(j.id, { order: idx }))
    );
    return HttpResponse.json({});
  }),

  // PATCH /jobs/:id (edit/update any field)
  http.patch("/jobs/:id", async ({ params, request }) => {
    await randomDelay();
    // maybeError();
    const id = params.id as string;
    const data = await request.json();
    if (!data || typeof data !== "object") {
      return HttpResponse.json(
        { message: "Invalid update body" },
        { status: 400 }
      );
    }
    // Only update valid fields
    const updateFields: Partial<Job> = {
      title: data.title,
      slug: data.slug,
      status: data.status,
      tags: data.tags,
      order: data.order,
      description: data.description,
      requirements: data.requirements,
      location: data.location,
      type: data.type,
      updatedAt: new Date().toISOString(),
    };
    await db.jobs.update(id, updateFields);
    const job = await db.jobs.get(id);
    return HttpResponse.json(job);
  }),

  // GET /jobs/:id (get single job)
  http.get("/jobs/:id", async ({ params }) => {
    await randomDelay();
    const id = params.id as string;
    const job = await db.jobs.get(id);
    console.log("Fetched job:", job);
    if (!job) {
      return HttpResponse.json({ message: "Job not found" }, { status: 404 });
    }
    return HttpResponse.json(job);
  }),

  // ###### candiates handlers ########
  // GET /candidates?search=&stage=&page=
  http.get("/candidates", async ({ request }) => {
    await randomDelay();
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const stage = url.searchParams.get("stage");
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "20", 10);

    let collection = await db.candidates.toArray();

    // Client-side search (name/email)
    if (search) {
      const q = search.toLowerCase();
      collection = collection.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.email && c.email.toLowerCase().includes(q))
      );
    }

    // Filter by stage
    if (stage && stage !== "all") {
      collection = collection.filter((c) => c.stage === stage);
    }

    // Sort by createdAt desc
    collection = collection.sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1
    );

    const total = collection.length;
    const paged = collection.slice((page - 1) * pageSize, page * pageSize);

    return HttpResponse.json({ candidates: paged, total });
  }),

  // POST /candidates
  http.post("/candidates", async ({ request }) => {
    await randomDelay();
    const data = await request.json();

    if (
      !data ||
      typeof data !== "object" ||
      !data.name ||
      !data.email ||
      !data.stage
    ) {
      return HttpResponse.json(
        { message: "Invalid candidate body" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const candidate: Candidate = {
      id: data.id || crypto.randomUUID(),
      name: data.name,
      email: data.email,
      phone: data.phone ?? "",
      resume: data.resume ?? "",
      jobId: data.jobId ?? "",
      stage: data.stage,
      notes: data.notes ?? "",
      createdAt: now,
      updatedAt: now,
    };

    await db.candidates.add(candidate);

    // Add timeline entry for creation
    await db.candidateTimelines.add({
      candidateId: candidate.id,
      timestamp: now,
      stage: candidate.stage,
      by: "System",
      note: "Applied",
    });

    return HttpResponse.json(candidate, { status: 201 });
  }),

  // GET /candidates/:id/timeline
  http.get("/candidates/:id/timeline", async ({ params }) => {
    await randomDelay();
    const id = params.id as string;
    const timeline = await db.candidateTimelines
      .where("candidateId")
      .equals(id)
      .sortBy("timestamp");
    return HttpResponse.json({ timeline });
  }),

  // PATCH /candidates/:id (stage transition, note, etc.)
  http.patch("/candidates/:id", async ({ params, request }) => {
    await randomDelay();
    const id = params.id as string;
    const data = await request.json();

    if (!data || typeof data !== "object") {
      return HttpResponse.json(
        { message: "Invalid update body" },
        { status: 400 }
      );
    }

    const updateFields: Partial<Candidate> = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      resume: data.resume,
      jobId: data.jobId,
      notes: data.notes,
      stage: data.stage,
      updatedAt: new Date().toISOString(),
    };

    await db.candidates.update(id, updateFields);
    const updated = await db.candidates.get(id);

    // If stage changed, add timeline entry
    if (data.stage) {
      await db.candidateTimelines.add({
        candidateId: id,
        timestamp: new Date().toISOString(),
        stage: data.stage,
        by: data.by || "System",
        note: data.timelineNote || "",
      });
    }

    return HttpResponse.json(updated);
  }),

  // GET /candidates/:id
  http.get("/candidates/:id", async ({ params }) => {
    await randomDelay();
    const id = params.id as string;
    const candidate = await db.candidates.get(id);
    if (!candidate) {
      return HttpResponse.json(
        { message: "Candidate not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(candidate);
  }),

  // ###### assessments handlers ########
  // GET /assessments
  http.get("/assessments", async () => {
    const assessments = await db.assessments.toArray();
    console.log("Fetched assessments for dashboard:", assessments);

    const enriched = await Promise.all(
      assessments.map(async (a) => ({
        ...a,
        title: a.title || "(Untitled)",
        jobId: a.jobId || "no-job",
        status: a.status || "active",
        createdAt: a.createdAt || new Date().toISOString(),
        questions: Array.isArray(a.questions) ? a.questions : [],
        questionsCount: Array.isArray(a.questions) ? a.questions.length : 0,
        responsesCount: 0, // Or real count if you want
      }))
    );
    return HttpResponse.json(enriched);
  }),

  // GET /assessments/:jobId
  http.get("/assessments/:jobId", async ({ params }) => {
    const jobId = params.jobId as string;
    console.log("Fetching assessment for jobId(handler):", jobId);
    const assessment = await db.assessments.where({ jobId }).first();
    console.log("Fetched assessment by jobId(handler):", assessment);
    if (!assessment) {
      return HttpResponse.json(
        { message: "Assessment not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(assessment);
  }),

  // PUT /assessments/:jobId (create or update assessment for a job)
  http.put("/assessments/:jobId", async ({ params, request }) => {
    const jobId = params.jobId as string;
    const data = (await request.json()) as Partial<Assessment>;
    // console.log("Received assessment data to save:", data);

    let assessment = await db.assessments.where({ jobId }).first();

    if (assessment) {
      // Update
      await db.assessments.update(assessment.id, {
        ...assessment,
        ...data,
        jobId,
      });
      const updated = await db.assessments.get(assessment.id);
      if (!updated) {
        return HttpResponse.json(
          { message: "Assessment not found" },
          { status: 404 }
        );
      }
      return HttpResponse.json(updated);
    } else {
      // Create
      const now = new Date().toISOString();
      const id = crypto.randomUUID();
      const newAssessment: Assessment = {
        ...data,
        id,
        jobId,
        createdAt: now,
        status: "active",
        questions: data.questions ?? [],
        title: data.title ?? "",
      } as Assessment;
      await db.assessments.add(newAssessment);
      return HttpResponse.json(newAssessment);
    }
  }),

  // POST /assessments/:jobId/submit (store response locally)
  http.post("/assessments/:jobId/submit", async ({ params, request }) => {
    const jobId = params.jobId as string;
    const body = (await request.json()) as {
      candidateId: string;
      answers: any;
    };
    const { candidateId, answers } = body;
    const assessment = await db.assessments.where({ jobId }).first();
    if (!assessment) {
      return HttpResponse.json(
        { message: "Assessment not found" },
        { status: 404 }
      );
    }
    const response: AssessmentResponse = {
      id: crypto.randomUUID(),
      assessmentId: assessment.id,
      candidateId,
      answers,
      submittedAt: new Date().toISOString(),
    };
    await db.assessmentResponses.add(response);
    return HttpResponse.json(response, { status: 201 });
  }),

  // (Optional) DELETE /assessments/:id
  http.delete("/assessments/:id", async ({ params }) => {
    const id = params.id as string;
    await db.assessments.delete(id);
    // Optionally, delete responses as well
    await db.assessmentResponses.where("assessmentId").equals(id).delete();
    return HttpResponse.json({ success: true });
  }),
];
