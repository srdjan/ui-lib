// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * TodoList Component
 * Renders a list of todos using the library Stack layout component
 */

import { h } from "jsx";
import { defineComponent, post } from "../../../mod.ts";
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
    clearCompleted: post("/api/todos/clear-completed", todoAPI.clearCompleted),
  },
  render: (props, api) => {
    const {
      todos,
      emptyMessage = "No todos yet. Add a todo above to get started!",
    } = props;

    const hasCompleted = todos.some((t) => t.completed);

    if (todos.length === 0) {
      return (
        <stack direction="vertical" gap="md" align="center">
          <p>{emptyMessage}</p>
        </stack>
      );
    }

    return (
      <stack direction="vertical" gap="md">
        {hasCompleted && (
          <stack direction="horizontal" gap="md" justify="end">
            <button
              type="button"
              variant="danger"
              size="sm"
              {...api!.clearCompleted()}
            >
              Clear completed
            </button>
          </stack>
        )}
        <stack direction="vertical" gap="md">
          {todos.map((todo) => <todo-item todo={todo} />)}
        </stack>
      </stack>
    );
  },
});

export const TodoList = "todo-list";
