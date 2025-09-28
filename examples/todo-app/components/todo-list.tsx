// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * TodoList Component
 * Renders a list of todos using the library Stack layout component
 */

import { h } from "jsx";
import { defineComponent } from "../../../mod.ts";
import { todoAPI } from "../api/index.ts";
import "../../../lib/components/button/button.ts";
import "../../../lib/components/layout/stack.ts";
import "./todo-item.tsx";

import type { Todo } from "../api/types.ts";

export type TodoListProps = {
  todos: readonly Todo[];
  emptyMessage?: string;
};

defineComponent<TodoListProps>("todo-list", {
  api: {
    clearCompleted: [
      "POST",
      "/api/todos/clear-completed",
      todoAPI.clearCompleted,
    ],
  },
  render: (props, _api) => {
    const {
      todos,
      emptyMessage = "No todos yet. Add a todo above to get started!",
    } = props;

    const hasCompleted = todos.some((t) => t.completed);

    if (todos.length === 0) {
      return (
        <div style="text-align: center; padding: 2rem; color: #6b7280;">
          <p>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <stack direction="vertical" gap="md">
        {hasCompleted && (
          <div style="display: flex; justify-content: flex-end;">
            <button
              type="button"
              variant="danger"
              size="sm"
              onAction={{ api: "clearCompleted" }}
            >
              Clear completed
            </button>
          </div>
        )}
        <stack direction="vertical" gap="md">
          {todos.map((todo) => <todo-item todo={todo} />)}
        </stack>
      </stack>
    );
  },
});

export const TodoList = "todo-list";
