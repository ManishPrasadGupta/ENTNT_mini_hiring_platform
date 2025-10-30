export type JobStatus = "active" | "archived";
export type JobType = "full-time" | "part-time" | "contract";

export interface Job {
  id: string;
  title: string;
  description?: string;
  location?: string;
  type?: JobType;
  status: JobStatus;
  requirements?: string[];
  tags: string[];
  slug: string;
  order: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export type CreateJobFields = {
  title: string;
  description?: string;
  location?: string;
  type?: JobType;
  status: JobStatus;
  requirements?: string[];
  tags: string[];
};
