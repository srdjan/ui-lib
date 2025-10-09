// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * TodoItem Component
 * Wraps the library Item component with todo-specific logic
 */

import { h } from "jsx";
import { defineComponent, del, post } from "../../../mod.ts";
import "../../../lib/components/data-display/item.ts";
import { todoAPI } from "../api/index.ts";

import type { Todo } from "../api/types.ts";

// Define the TodoItem component that accepts todo props directly
defineComponent<{ todo: Todo }>("todo-item", {
  api: {
    toggle: post(
      "/api/todos/:id/toggle",
      (req, params) => todoAPI.toggleTodo(req, params as { id: string }),
    ),
    deleteTodo: del(
      "/api/todos/:id",
      (req, params) => todoAPI.deleteTodo(req, params as { id: string }),
    ),
  },
  render: ({ todo }, api) => {
    const rootId = `todo-${todo.id}`;

    return (
      <div class="todo-item" id={rootId}>
        <input
          type="checkbox"
          checked={todo.completed}
          {...api!.toggle(todo.id)}
        />
        <div class="todo-content">
          <span class="todo-text">{todo.text}</span>
          <span class="todo-priority" data-priority={todo.priority}>
            {todo.priority}
          </span>
          <span class="todo-date">
            {new Date(todo.createdAt).toLocaleDateString()}
          </span>
        </div>
        <button
          type="button"
          class="todo-delete"
          {...api!.deleteTodo(todo.id)}
        >
          Delete
        </button>
      </div>
    ) as unknown as string;
  },
});

export const TodoItem = "todo-item";
