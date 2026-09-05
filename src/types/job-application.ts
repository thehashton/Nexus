export type JobStage = "applied" | "interview" | "offer" | "rejected";

export type JobApplication = {
  id: string;
  company: string;
  role: string;
  stage: JobStage;
  notes: string | null;
  appliedDate: string;
  lastUpdated: string;
};

export type CreateJobApplicationInput = {
  company: string;
  role: string;
  stage: JobStage;
  notes?: string | null;
  appliedDate: string;
};

export type UpdateJobApplicationInput = Partial<CreateJobApplicationInput>;
