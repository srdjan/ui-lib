// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * TodoList Component
 * Renders a list of todos using the library Stack layout component
 */

import { h } from "jsx";
import { defineComponent } from "../../../lib/define-component.ts";
import { todoAPI } from "../api/index.ts";
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
        <div class="todo-list todo-list--empty">
          <p>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "0.5rem",
          }}
        >
          {hasCompleted && (
            <button
              type="button"
              class="btn btn--danger"
              onAction={{ api: "clearCompleted" }}
            >
              Clear completed
            </button>
          )}
        </div>
        <ul class="todo-list">
          {todos.map((todo) => (
            <li class="todo-list__item">
              <todo-item todo={todo} />
            </li>
          ))}
        </ul>
      </div>
    );
  },
});

export const TodoList = "todo-list";
