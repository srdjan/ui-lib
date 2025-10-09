// deno-lint-ignore-file verbatim-module-syntax

/** @jsx h */
/**
 * TodoItem Component
 * Pure composition using library's Item component
 * Zero custom CSS - all styling from ui-lib
 */

import { h } from "jsx";
import { defineComponent, del, post, spreadAttrs } from "../../../mod.ts";
import type { ItemBadgeVariant } from "../../../mod.ts";
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

    // Map priority to badge variant
    const badgeVariant: ItemBadgeVariant =
      todo.priority === "high" ? "danger" :
      todo.priority === "medium" ? "warning" : "success";

    return (
      <item
        id={rootId}
        title={todo.text}
        timestamp={new Date(todo.createdAt).toLocaleDateString()}
        completed={todo.completed ? "true" : "false"}
        priority={todo.priority}
        icon={`<input type="checkbox" ${todo.completed ? "checked" : ""} ${
          spreadAttrs(api!.toggle(todo.id))
        } />`}
        badges={JSON.stringify([{
          text: todo.priority,
          variant: badgeVariant,
        }])}
        actions={JSON.stringify([{
          text: "Delete",
          variant: "danger",
          attributes: spreadAttrs(api!.deleteTodo(todo.id)),
        }])}
      />
    ) as unknown as string;
  },
});

export const TodoItem = "todo-item";
