import { Job } from "@/types/types";
import Dexie, { Table } from "dexie";

export class AppDB extends Dexie {
  jobs!: Table<Job, string>;

  constructor() {
    super("AppDB");
    this.version(1).stores({
      jobs: "id, title, slug, status, order, createdAt, updatedAt",
    });
  }
}

export const db = new AppDB();
