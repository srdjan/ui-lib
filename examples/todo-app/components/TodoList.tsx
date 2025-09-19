/**
 * TodoList Component
 * Main container for displaying todos with loading and empty states using defineComponent
 */

import { Alert } from "../../../mod-simple.ts";
import { boolean, defineComponent, renderComponent, string } from "../../../mod.ts";
import { h } from "../../../lib/jsx-runtime.ts";
import type { Todo, TodoFilter } from "../api/types.ts";
import "./TodoItem.tsx"; // Import to register the component

defineComponent("todo-list", {
  styles: `
    .todo-list {
      min-height: 200px;
    }
    
    .todo-list.empty {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }
    
    .todo-list.loading {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      color: #6b7280;
    }
    
    .loading-spinner:before {
      content: "";
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid #d1d5db;
      border-top: 2px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 8px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `,
  render: (attrs: Record<string, string>) => {
    const todos = attrs.todos || "[]";
    const filter = attrs.filter || '{"status":"all"}';
    const loading = "loading" in attrs;

    const parsedTodos = safeParseArray<Todo>(todos, []);
    const parsedFilter = safeParse<TodoFilter>(filter, { status: "all" });

    if (loading) {
      return (
        <div id="todo-list" class="todo-list loading">
          <div class="loading-spinner">Loading todos...</div>
        </div>
      );
    }

    if (parsedTodos.length === 0) {
      const alertContent = parsedFilter.status === "all"
        ? "No todos yet. Add one above to get started!"
        : `No ${parsedFilter.status} todos found.`;

      return (
        <div id="todo-list" class="todo-list empty">
          <div class="alert alert-info">
            {alertContent}
          </div>
        </div>
      );
    }

    return (
      <div id="todo-list" class="todo-list">
        {parsedTodos.map((todo) =>
          renderComponent("todo-item", { todo: JSON.stringify(todo) })
        ).join("")}
      </div>
    );
  },
});

// Export JSX component for direct use
export const TodoList = ({
  todos,
  filter,
  loading = false
}: {
  todos: string | readonly Todo[] | Todo[];
  filter: string | object;
  loading?: boolean;
}) => {
  const todosStr = typeof todos === "string" ? todos : JSON.stringify(todos);
  const filterStr = typeof filter === "string" ? filter : JSON.stringify(filter);

  return renderComponent("todo-list", {
    todos: todosStr,
    filter: filterStr,
    loading: loading ? "true" : "false"
  });
};


function safeParse<T>(value: string, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function safeParseArray<T>(value: string, fallback: T[]): T[] {
  const parsed = safeParse<T[] | null>(value, null);
  return Array.isArray(parsed) ? parsed : fallback;
}
