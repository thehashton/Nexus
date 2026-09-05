export type Todo = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  dueDate: string | null;
  tags: string[];
};

export type CreateTodoInput = {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  tags?: string[];
};

export type UpdateTodoInput = Partial<CreateTodoInput> & {
  completed?: boolean;
};
