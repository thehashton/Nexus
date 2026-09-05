import { db } from "@/lib/db/client";
import type { CreateTodoInput, Todo, UpdateTodoInput } from "@/types";

type TodoRow = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  due_date: string | null;
  tags: string[] | null;
};

function mapTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    completed: row.completed,
    createdAt: row.created_at,
    dueDate: row.due_date,
    tags: row.tags ?? [],
  };
}

export async function listTodos(): Promise<Todo[]> {
  const { data, error } = await db
    .from("todos")
    .select("id,title,description,completed,created_at,due_date,tags")
    .order("completed", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as TodoRow[]).map(mapTodo);
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  const { data, error } = await db
    .from("todos")
    .insert({
      id: crypto.randomUUID(),
      title: input.title.trim(),
      description: input.description?.trim() || null,
      due_date: input.dueDate || null,
      tags: input.tags ?? [],
    })
    .select("id,title,description,completed,created_at,due_date,tags")
    .single();

  if (error) throw error;
  return mapTodo(data as TodoRow);
}

export async function updateTodo(
  id: string,
  input: UpdateTodoInput,
): Promise<Todo> {
  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title.trim();
  if (input.description !== undefined) {
    patch.description = input.description?.trim() || null;
  }
  if (input.dueDate !== undefined) patch.due_date = input.dueDate || null;
  if (input.tags !== undefined) patch.tags = input.tags;
  if (input.completed !== undefined) patch.completed = input.completed;

  const { data, error } = await db
    .from("todos")
    .update(patch)
    .eq("id", id)
    .select("id,title,description,completed,created_at,due_date,tags")
    .single();

  if (error) throw error;
  return mapTodo(data as TodoRow);
}

export async function deleteTodo(id: string): Promise<void> {
  const { error } = await db.from("todos").delete().eq("id", id);
  if (error) throw error;
}

export async function setTodoCompleted(
  id: string,
  completed: boolean,
): Promise<Todo> {
  return updateTodo(id, { completed });
}
