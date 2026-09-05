export type Goal = {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  notes: string | null;
};

export type CreateGoalInput = {
  title: string;
  date: string;
  notes?: string | null;
};

export type UpdateGoalInput = Partial<CreateGoalInput> & {
  completed?: boolean;
};
