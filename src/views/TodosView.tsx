import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { TodoFormDialog } from "@/components/todos/TodoFormDialog";
import { TodoList } from "@/components/todos/TodoList";
import { Button } from "@/components/ui/button";
import {
  createTodo,
  deleteTodo,
  listTodos,
  setTodoCompleted,
  updateTodo,
} from "@/lib/db/todos";
import type { CreateTodoInput, Todo } from "@/types";

export function TodosView() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Todo | null>(null);

  const refresh = useCallback(async () => {
    const next = await listTodos();
    setTodos(next);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    refresh()
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load todos.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  async function handleSave(input: CreateTodoInput) {
    if (editing) {
      await updateTodo(editing.id, input);
    } else {
      await createTodo(input);
    }
    await refresh();
  }

  async function handleToggle(todo: Todo) {
    await setTodoCompleted(todo.id, !todo.completed);
    await refresh();
  }

  async function handleDelete(todo: Todo) {
    await deleteTodo(todo.id);
    await refresh();
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Todos</h1>
          <p className="text-sm text-muted-foreground">
            Capture work, then knock it down.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus />
          Add todo
        </Button>
      </div>
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading todos…</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <TodoList
          todos={todos}
          onToggle={(todo) => void handleToggle(todo)}
          onEdit={(todo) => {
            setEditing(todo);
            setDialogOpen(true);
          }}
          onDelete={(todo) => void handleDelete(todo)}
        />
      )}
      <TodoFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        todo={editing}
        onSubmit={handleSave}
      />
    </div>
  );
}
