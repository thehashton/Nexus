import { db } from "@/lib/db/client";
import type { CreateGoalInput, Goal, UpdateGoalInput } from "@/types";

type GoalRow = {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  notes: string | null;
};

function mapGoal(row: GoalRow): Goal {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    completed: row.completed,
    notes: row.notes,
  };
}

export async function listGoals(): Promise<Goal[]> {
  const { data, error } = await db
    .from("goals")
    .select("id,title,date,completed,notes")
    .order("date", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as GoalRow[]).map(mapGoal);
}

export async function createGoal(input: CreateGoalInput): Promise<Goal> {
  const { data, error } = await db
    .from("goals")
    .insert({
      id: crypto.randomUUID(),
      title: input.title.trim(),
      date: input.date,
      notes: input.notes?.trim() || null,
    })
    .select("id,title,date,completed,notes")
    .single();

  if (error) throw error;
  return mapGoal(data as GoalRow);
}

export async function updateGoal(
  id: string,
  input: UpdateGoalInput,
): Promise<Goal> {
  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title.trim();
  if (input.date !== undefined) patch.date = input.date;
  if (input.notes !== undefined) patch.notes = input.notes?.trim() || null;
  if (input.completed !== undefined) patch.completed = input.completed;

  const { data, error } = await db
    .from("goals")
    .update(patch)
    .eq("id", id)
    .select("id,title,date,completed,notes")
    .single();

  if (error) throw error;
  return mapGoal(data as GoalRow);
}

export async function deleteGoal(id: string): Promise<void> {
  const { error } = await db.from("goals").delete().eq("id", id);
  if (error) throw error;
}
