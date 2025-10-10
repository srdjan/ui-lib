// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * TodoList Component
 * Renders a vertical list of todos using library CSS classes - zero custom CSS
 */

import { h } from "jsx";
import { defineComponent, post } from "../../../mod.ts";
import { todoAPI } from "../api/index.ts";
import "../../../lib/components/button/button.ts";
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
        <div class="empty-state">
          <p>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div class="stack stack--vertical stack--gap-md">
        {hasCompleted && (
          <div class="stack stack--horizontal stack--gap-md stack--justify-end">
            <button
              type="button"
              variant="danger"
              size="sm"
              {...api!.clearCompleted()}
            >
              Clear completed
            </button>
          </div>
        )}
        <div class="todo-list">
          {todos.map((todo) => <todo-item todo={todo} />)}
        </div>
      </div>
    );
  },
});

export const TodoList = "todo-list";
