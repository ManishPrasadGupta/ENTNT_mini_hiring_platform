import { http, HttpResponse } from "msw";
import { db } from "../db";
import { Job } from "@/types/types";

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
    console.log("Initial jobs collection:", collection);

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
];
