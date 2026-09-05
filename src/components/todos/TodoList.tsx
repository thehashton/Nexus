import { TodoItem } from "@/components/todos/TodoItem";
import type { Todo } from "@/types";

type TodoListProps = {
  todos: Todo[];
  onToggle: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
};

export function TodoList({ todos, onToggle, onEdit, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No todos yet. Add one to get started.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
