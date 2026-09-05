import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CreateTodoInput, Todo } from "@/types";

type TodoFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo?: Todo | null;
  onSubmit: (input: CreateTodoInput) => Promise<void>;
};

function tagsToString(tags: string[]) {
  return tags.join(", ");
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function TodoFormDialog({
  open,
  onOpenChange,
  todo,
  onSubmit,
}: TodoFormDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setTitle(todo?.title ?? "");
    setDescription(todo?.description ?? "");
    setDueDate(todo?.dueDate ?? "");
    setTags(todo ? tagsToString(todo.tags) : "");
    setError(null);
  }, [open, todo]);

  async function handleSubmit() {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setPending(true);
    setError(null);
    try {
      await onSubmit({
        title,
        description: description || null,
        dueDate: dueDate || null,
        tags: parseTags(tags),
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save todo.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{todo ? "Edit todo" : "Add todo"}</DialogTitle>
          <DialogDescription>
            Keep the title short. Tags are comma-separated.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="todo-title">Title</Label>
            <Input
              id="todo-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="todo-description">Description</Label>
            <Textarea
              id="todo-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="todo-due">Due date</Label>
            <Input
              id="todo-due"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="todo-tags">Tags</Label>
            <Input
              id="todo-tags"
              placeholder="work, urgent"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" disabled={pending} onClick={handleSubmit}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
