// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * TodoItem Component
 * Pure composition using library's Item component with custom children
 * Zero custom CSS - all styling from ui-lib
 * API spread operators preserved: {...api!.action(id)}
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
      <item
        id={rootId}
        completed={todo.completed}
        priority={todo.priority}
      >
        <input
          type="checkbox"
          checked={todo.completed}
          {...api!.toggle(todo.id)}
        />
        <span>{todo.text}</span>
        <span data-priority={todo.priority}>
          {todo.priority}
        </span>
        <span>
          {new Date(todo.createdAt).toLocaleDateString()}
        </span>
        <button
          type="button"
          {...api!.deleteTodo(todo.id)}
        >
          Delete
        </button>
      </item>
    ) as unknown as string;
  },
});

export const TodoItem = "todo-item";
