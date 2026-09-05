import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Todo } from "@/types";

type TodoItemProps = {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
};

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo)}
        className="mt-1"
        aria-label={`Mark ${todo.title} ${todo.completed ? "incomplete" : "complete"}`}
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "font-medium",
            todo.completed && "text-muted-foreground line-through",
          )}
        >
          {todo.title}
        </p>
        {todo.description ? (
          <p className="mt-1 text-sm text-muted-foreground">{todo.description}</p>
        ) : null}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {todo.dueDate ? (
            <span className="text-xs text-muted-foreground">Due {todo.dueDate}</span>
          ) : null}
          {todo.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Edit ${todo.title}`}
          onClick={() => onEdit(todo)}
        >
          <Pencil />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete ${todo.title}`}
          onClick={() => onDelete(todo)}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
