import { db } from "@/lib/db/client";
import type {
  CreateJobApplicationInput,
  JobApplication,
  UpdateJobApplicationInput,
} from "@/types";

type JobRow = {
  id: string;
  company: string;
  role: string;
  stage: JobApplication["stage"];
  notes: string | null;
  applied_date: string;
  last_updated: string;
};

function mapJob(row: JobRow): JobApplication {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    stage: row.stage,
    notes: row.notes,
    appliedDate: row.applied_date,
    lastUpdated: row.last_updated,
  };
}

export async function listJobApplications(): Promise<JobApplication[]> {
  const { data, error } = await db
    .from("job_applications")
    .select("id,company,role,stage,notes,applied_date,last_updated")
    .order("last_updated", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as JobRow[]).map(mapJob);
}

export async function createJobApplication(
  input: CreateJobApplicationInput,
): Promise<JobApplication> {
  const { data, error } = await db
    .from("job_applications")
    .insert({
      id: crypto.randomUUID(),
      company: input.company.trim(),
      role: input.role.trim(),
      stage: input.stage,
      notes: input.notes?.trim() || null,
      applied_date: input.appliedDate,
      last_updated: new Date().toISOString(),
    })
    .select("id,company,role,stage,notes,applied_date,last_updated")
    .single();

  if (error) throw error;
  return mapJob(data as JobRow);
}

export async function updateJobApplication(
  id: string,
  input: UpdateJobApplicationInput,
): Promise<JobApplication> {
  const patch: Record<string, unknown> = {
    last_updated: new Date().toISOString(),
  };
  if (input.company !== undefined) patch.company = input.company.trim();
  if (input.role !== undefined) patch.role = input.role.trim();
  if (input.stage !== undefined) patch.stage = input.stage;
  if (input.notes !== undefined) patch.notes = input.notes?.trim() || null;
  if (input.appliedDate !== undefined) patch.applied_date = input.appliedDate;

  const { data, error } = await db
    .from("job_applications")
    .update(patch)
    .eq("id", id)
    .select("id,company,role,stage,notes,applied_date,last_updated")
    .single();

  if (error) throw error;
  return mapJob(data as JobRow);
}

export async function deleteJobApplication(id: string): Promise<void> {
  const { error } = await db.from("job_applications").delete().eq("id", id);
  if (error) throw error;
}
