/** @jsx h */
/**
 * TodoItem Component
 * Wraps the library Item component with todo-specific logic
 */

import { hx } from "../../../lib/api-recipes.ts";
import "../../../lib/components/data-display/item.ts";
import { defineComponent, h } from "../../../lib/define-component.ts";

import type { Todo } from "../api/types.ts";

export type ItemVariant = "default" | "completed" | "selected" | "priority";
export type ItemPriority = "low" | "medium" | "high";
export type BadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";
export type ActionVariant = "default" | "primary" | "danger";

export type ItemBadge = {
  readonly text: string;
  readonly variant?: BadgeVariant;
};

export type ItemAction = {
  readonly text: string;
  readonly action?: string; // legacy optional onclick
  readonly attributes?: string; // preferred: raw hx-* attributes string
  readonly variant?: ActionVariant;
};

export type ItemProps = {
  readonly id?: string;
  readonly title?: string;
  readonly description?: string;
  readonly icon?: string;
  readonly timestamp?: string;
  readonly badges?: readonly ItemBadge[];
  readonly actions?: readonly ItemAction[];
  readonly variant?: ItemVariant;
  readonly size?: "sm" | "md" | "lg";
  readonly priority?: ItemPriority;
  readonly completed?: boolean;
  readonly selected?: boolean;
};

function getPriorityVariant(priority: string): BadgeVariant {
  switch (priority) {
    case "high":
      return "danger";
    case "medium":
      return "warning";
    case "low":
      return "success";
    default:
      return "neutral";
  }
}

// Define the TodoItem component that accepts todo props directly
defineComponent<{ todo: Todo }>("todo-item", {
  api: {
    toggle: [
      "POST",
      "/api/todos/:id/toggle",
      () => new Response(null, { status: 204 }),
    ],
    deleteTodo: [
      "DELETE",
      "/api/todos/:id",
      () => new Response(null, { status: 204 }),
    ],
  },
  render: ({ todo }, api) => {
    const rootId = `todo-${todo.id}`;

    const toggleAttrs = api
      ? api.toggle(
        todo.id,
        hx({ target: `#${rootId}`, swap: "outerHTML" }),
      )
      : `hx-post="/api/todos/${todo.id}/toggle" hx-target="#${rootId}" hx-swap="outerHTML"`;

    const deleteAttrs = api
      ? api.deleteTodo(
        todo.id,
        hx({
          target: `#${rootId}`,
          swap: "outerHTML",
          confirm: "Are you sure you want to delete this todo?",
        }),
      )
      : `hx-delete="/api/todos/${todo.id}" hx-target="#${rootId}" hx-swap="outerHTML" hx-confirm="Are you sure you want to delete this todo?"`;

    const itemProps: ItemProps = {
      id: rootId,
      title: todo.text,
      completed: todo.completed,
      priority: todo.priority,
      timestamp: new Date(todo.createdAt).toLocaleDateString(),
      badges: [{
        text: todo.priority,
        variant: getPriorityVariant(todo.priority),
      }],
      icon: `<input type="checkbox" ${
        todo.completed ? "checked" : ""
      } ${toggleAttrs} />`,
      actions: [
        { text: "Edit" }, // keep UI, no JS action
        { text: "Delete", variant: "danger", attributes: deleteAttrs },
      ],
    };

    return <item {...itemProps} /> as unknown as string;
  },
});

export const TodoItem = "todo-item";
