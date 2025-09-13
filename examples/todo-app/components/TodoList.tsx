/**
 * TodoList Component
 * Main container for displaying todos with loading and empty states using defineComponent
 */

import { defineComponent, h } from "../../../mod.ts";
import { Alert } from "../../../mod-simple.ts";
import { TodoItem } from "./TodoItem.tsx";
import type { Todo, TodoFilter } from "../api/types.ts";

defineComponent("todo-list", {
  props: (attrs) => ({
    todos: JSON.parse(attrs.todos) as Todo[],
    filter: JSON.parse(attrs.filter) as TodoFilter,
    loading: attrs.loading === "true"
  }),
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
  render: ({ todos, filter, loading }) => {
    if (loading) {
      return (
        <div id="todo-list" class="todo-list loading">
          <div class="loading-spinner">Loading todos...</div>
        </div>
      );
    }

    if (todos.length === 0) {
      return (
        <div id="todo-list" class="todo-list empty">
          <Alert variant="info">
            {filter.status === "all"
              ? "No todos yet. Add one above to get started!"
              : `No ${filter.status} todos found.`}
          </Alert>
        </div>
      );
    }

    return (
      <div id="todo-list" class="todo-list">
        {todos.map((todo) => <TodoItem todo={todo} />)}
      </div>
    );
  }
});

// Export JSX function for backwards compatibility and direct use
export function TodoList({
  todos,
  filter,
  loading = false,
}: {
  todos: Todo[];
  filter: TodoFilter;
  loading?: boolean;
}) {
  return (
    <todo-list 
      todos={JSON.stringify(todos)}
      filter={JSON.stringify(filter)}
      loading={loading ? "true" : "false"}
    />
  );
}